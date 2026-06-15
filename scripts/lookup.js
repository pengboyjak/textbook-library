#!/usr/bin/env node
/**
 * 教材库查询脚本
 * 用法: node lookup.js <command> [args...]
 */

const fs = require('fs');
const path = require('path');

// 数据文件路径
const SKILL_DIR = path.join(__dirname, '..');
const DATA_DIR = path.join(SKILL_DIR, 'references');
const CATALOG_FILE = path.join(DATA_DIR, 'catalog.json');

function loadCatalog() {
  return JSON.parse(fs.readFileSync(CATALOG_FILE, 'utf-8'));
}

function printHelp() {
  console.log(`
教材库查询工具

用法: node lookup.js <command> [args...]

命令:
  stats                    显示总体统计
  stages                   列出所有学段
  subjects <学段>           列出某学段的所有学科
  editions <学段> <学科>    列出某学段某学科的所有版本
  stage <学段>             列出某学段的所有教材
  subject <学段> <学科>     列出某学段某学科的所有教材
  edition <学段> <学科> <版本>  列出某版本的所有教材
  search <关键词>           搜索教材（支持中文关键词）
  detail <教材ID>           查看教材详情
  help                     显示帮助
`);
}

function stats() {
  const cat = loadCatalog();
  const stages = Object.keys(cat.catalog).sort();
  console.log(`\n📚 教材库统计\n`);
  console.log(`总计: ${cat.totalCount} 本教材, ${stages.length} 个学段\n`);

  let grandTotal = 0;
  stages.forEach(stage => {
    const subjects = Object.keys(cat.catalog[stage]);
    const total = countMaterials(cat.catalog[stage]);
    grandTotal += total;
    console.log(`  ${stage}: ${subjects.length}个学科, ${total}本`);
  });
  console.log(`\n  核实总计: ${grandTotal} 本`);
}

function listStages() {
  const cat = loadCatalog();
  const stages = Object.keys(cat.catalog).sort();
  console.log('\n所有学段:');
  stages.forEach((s, i) => {
    const subs = Object.keys(cat.catalog[s]);
    console.log(`  ${i + 1}. ${s} (${subs.length}个学科)`);
  });
}

function listSubjects(stageName) {
  const cat = loadCatalog();
  const stage = cat.catalog[stageName];
  if (!stage) {
    console.log(`❌ 未找到学段: ${stageName}`);
    console.log(`可用学段: ${Object.keys(cat.catalog).join(', ')}`);
    return;
  }
  const subjects = Object.keys(stage).sort();
  console.log(`\n${stageName} - 学科列表:`);
  subjects.forEach((s, i) => {
    const eds = Object.keys(stage[s]);
    const total = countMaterials(stage[s]);
    console.log(`  ${i + 1}. ${s}: ${eds.length}个版本, ${total}本`);
  });
}

function listEditions(stageName, subjectName) {
  const cat = loadCatalog();
  const stage = cat.catalog[stageName];
  if (!stage) {
    console.log(`❌ 未找到学段: ${stageName}`);
    return;
  }
  const subject = stage[subjectName];
  if (!subject) {
    console.log(`❌ 未找到学科: ${subjectName}`);
    console.log(`可用学科: ${Object.keys(stage).join(', ')}`);
    return;
  }
  const editions = Object.keys(subject).sort();
  console.log(`\n${stageName} > ${subjectName} - 版本列表:`);
  editions.forEach((e, i) => {
    const grades = Object.keys(subject[e]);
    const total = countMaterials(subject[e]);
    console.log(`  ${i + 1}. ${e}: ${grades.length}个年级, ${total}本`);
  });
}

function listByStage(stageName) {
  const cat = loadCatalog();
  const stage = cat.catalog[stageName];
  if (!stage) {
    console.log(`❌ 未找到学段: ${stageName}`);
    return;
  }
  console.log(`\n📚 ${stageName}\n`);
  printCatalogLevel(stage, 1);
}

function listBySubject(stageName, subjectName) {
  const cat = loadCatalog();
  const stage = cat.catalog[stageName];
  if (!stage) { console.log(`❌ 未找到学段: ${stageName}`); return; }
  const subject = stage[subjectName];
  if (!subject) {
    console.log(`❌ 未找到学科: ${subjectName}`);
    console.log(`可用学科: ${Object.keys(stage).sort().join(', ')}`);
    return;
  }
  console.log(`\n📚 ${stageName} > ${subjectName}\n`);
  printCatalogLevel(subject, 2);
}

function listByEdition(stageName, subjectName, editionName) {
  const cat = loadCatalog();
  const stage = cat.catalog[stageName];
  if (!stage) { console.log(`❌ 未找到学段: ${stageName}`); return; }
  const subject = stage[subjectName];
  if (!subject) { console.log(`❌ 未找到学科: ${subjectName}`); return; }
  const edition = subject[editionName];
  if (!edition) {
    console.log(`❌ 未找到版本: ${editionName}`);
    console.log(`可用版本: ${Object.keys(subject).sort().join(', ')}`);
    return;
  }
  console.log(`\n📚 ${stageName} > ${subjectName} > ${editionName}\n`);
  printCatalogLevel(edition, 3);
}

function searchMaterials(keyword) {
  const cat = loadCatalog();
  const results = [];
  const kw = keyword.toLowerCase();

  function traverse(obj, path = []) {
    if (Array.isArray(obj)) {
      obj.forEach(m => {
        if (m.title && m.title.toLowerCase().includes(kw)) {
          results.push({ material: m, path: [...path] });
        }
      });
    } else if (typeof obj === 'object') {
      Object.keys(obj).forEach(k => traverse(obj[k], [...path, k]));
    }
  }

  traverse(cat.catalog);
  console.log(`\n🔍 搜索"${keyword}" 找到 ${results.length} 本教材:\n`);
  results.forEach((r, i) => {
    const [stage, subject, edition, grade, volume] = r.path.slice(-5);
    console.log(`  ${i + 1}. ${r.material.title}`);
    console.log(`     分类: ${stage} > ${subject} > ${edition} > ${grade} > ${volume}`);
    console.log(`     ID: ${r.material.id}`);
    console.log(`     在线: https://basic.smartedu.cn/tchMaterial/detail?id=${r.material.id}`);
    console.log('');
  });
}

function showDetail(id) {
  const cat = loadCatalog();
  let found = null;
  let foundPath = [];

  function traverse(obj, path = []) {
    if (Array.isArray(obj)) {
      obj.forEach(m => {
        if (m.id === id) {
          found = m;
          foundPath = [...path];
        }
      });
    } else if (typeof obj === 'object') {
      Object.keys(obj).forEach(k => traverse(obj[k], [...path, k]));
    }
  }

  traverse(cat.catalog);

  if (!found) {
    console.log(`❌ 未找到教材ID: ${id}`);
    return;
  }

  console.log(`\n📖 教材详情\n`);
  console.log(`  名称: ${found.title}`);
  console.log(`  ID: ${found.id}`);
  console.log(`  分类: ${foundPath.slice(-5).join(' > ')}`);
  console.log(`  资源类型: ${found.resource_type || 'N/A'}`);
  console.log(`  章节数: ${(found.chapter_ids || []).length}`);
  console.log(`  在线查看: https://basic.smartedu.cn/tchMaterial/detail?id=${found.id}`);
}

function printCatalogLevel(obj, depth) {
  const keys = Object.keys(obj).sort();
  keys.forEach(k => {
    const val = obj[k];
    const indent = '  '.repeat(depth);
    if (Array.isArray(val)) {
      val.forEach(m => {
        console.log(`${indent}📄 ${m.title}`);
        console.log(`${indent}   ID: ${m.id}`);
      });
    } else if (typeof val === 'object') {
      const count = countMaterials(val);
      console.log(`${indent}📁 ${k} (${count}本)`);
    }
  });
}

function countMaterials(obj) {
  if (Array.isArray(obj)) return obj.length;
  if (typeof obj === 'object') {
    return Object.values(obj).reduce((sum, v) => sum + countMaterials(v), 0);
  }
  return 0;
}

// ===== 主程序 =====
const args = process.argv.slice(2);
const cmd = args[0];

switch (cmd) {
  case 'stats': stats(); break;
  case 'stages': listStages(); break;
  case 'subjects': listSubjects(args[1]); break;
  case 'editions': listEditions(args[1], args[2]); break;
  case 'stage': listByStage(args[1]); break;
  case 'subject': listBySubject(args[1], args[2]); break;
  case 'edition': listByEdition(args[1], args[2], args[3]); break;
  case 'search': searchMaterials(args.slice(1).join(' ')); break;
  case 'detail': showDetail(args[1]); break;
  case 'help':
  default:
    printHelp();
    break;
}
