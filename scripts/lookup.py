#!/usr/bin/env python3
"""
教材库查询脚本 (Python 版)
用法: python lookup.py <command> [args...]

兼容 Python 3.7+
"""

import json
import os
import sys

# Windows 终端 UTF-8 编码支持
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

SKILL_DIR = os.path.join(os.path.dirname(__file__), "..")
DATA_DIR = os.path.join(SKILL_DIR, "references")
CATALOG_FILE = os.path.join(DATA_DIR, "catalog.json")


def load_catalog():
    with open(CATALOG_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


def count_materials(obj):
    if isinstance(obj, list):
        return len(obj)
    if isinstance(obj, dict):
        return sum(count_materials(v) for v in obj.values())
    return 0


def print_help():
    print("""
教材库查询工具 (Python)

用法: python lookup.py <command> [args...]

命令:
  stats                    显示总体统计
  stages                   列出所有学段
  subjects <学段>           列出某学段的所有学科
  editions <学段> <学科>    列出某学段某学科的所有版本
  stage <学段>             列出某学段的所有教材
  subject <学段> <学科>     列出某学段某学科的所有教材
  edition <学段> <学科> <版本>  列出某版本的所有教材
  search <关键词>           搜索教材
  detail <教材ID>           查看教材详情
  help                     显示帮助
""")


def stats():
    cat = load_catalog()
    stages = sorted(cat["catalog"].keys())
    print(f"\n📚 教材库统计\n")
    print(f"总计: {cat['totalCount']} 本教材, {len(stages)} 个学段\n")

    grand_total = 0
    for stage in stages:
        subjects = sorted(cat["catalog"][stage].keys())
        total = count_materials(cat["catalog"][stage])
        grand_total += total
        print(f"  {stage}: {len(subjects)}个学科, {total}本")
    print(f"\n  核实总计: {grand_total} 本")


def list_stages():
    cat = load_catalog()
    stages = sorted(cat["catalog"].keys())
    print("\n所有学段:")
    for i, s in enumerate(stages, 1):
        subs = len(cat["catalog"][s])
        print(f"  {i}. {s} ({subs}个学科)")


def list_subjects(stage_name):
    cat = load_catalog()
    stage = cat["catalog"].get(stage_name)
    if not stage:
        print(f"❌ 未找到学段: {stage_name}")
        print(f"可用学段: {', '.join(sorted(cat['catalog'].keys()))}")
        return
    subjects = sorted(stage.keys())
    print(f"\n{stage_name} - 学科列表:")
    for i, s in enumerate(subjects, 1):
        eds = len(stage[s])
        total = count_materials(stage[s])
        print(f"  {i}. {s}: {eds}个版本, {total}本")


def list_editions(stage_name, subject_name):
    cat = load_catalog()
    stage = cat["catalog"].get(stage_name)
    if not stage:
        print(f"❌ 未找到学段: {stage_name}")
        return
    subject = stage.get(subject_name)
    if not subject:
        print(f"❌ 未找到学科: {subject_name}")
        print(f"可用学科: {', '.join(sorted(stage.keys()))}")
        return
    editions = sorted(subject.keys())
    print(f"\n{stage_name} > {subject_name} - 版本列表:")
    for i, e in enumerate(editions, 1):
        grades = len(subject[e])
        total = count_materials(subject[e])
        print(f"  {i}. {e}: {grades}个年级, {total}本")


def print_catalog_level(obj, depth=1):
    """递归打印目录层级"""
    for k in sorted(obj.keys()):
        val = obj[k]
        indent = "  " * depth
        if isinstance(val, list):
            for m in val:
                print(f"{indent}📄 {m.get('title', 'N/A')}")
                print(f"{indent}   ID: {m.get('id', 'N/A')}")
        elif isinstance(val, dict):
            cnt = count_materials(val)
            print(f"{indent}📁 {k} ({cnt}本)")


def list_by_stage(stage_name):
    cat = load_catalog()
    stage = cat["catalog"].get(stage_name)
    if not stage:
        print(f"❌ 未找到学段: {stage_name}")
        return
    print(f"\n📚 {stage_name}\n")
    print_catalog_level(stage, 1)


def list_by_subject(stage_name, subject_name):
    cat = load_catalog()
    stage = cat["catalog"].get(stage_name)
    if not stage:
        print(f"❌ 未找到学段: {stage_name}")
        return
    subject = stage.get(subject_name)
    if not subject:
        print(f"❌ 未找到学科: {subject_name}")
        print(f"可用学科: {', '.join(sorted(stage.keys()))}")
        return
    print(f"\n📚 {stage_name} > {subject_name}\n")
    print_catalog_level(subject, 2)


def list_by_edition(stage_name, subject_name, edition_name):
    cat = load_catalog()
    stage = cat["catalog"].get(stage_name)
    if not stage:
        print(f"❌ 未找到学段: {stage_name}")
        return
    subject = stage.get(subject_name)
    if not subject:
        print(f"❌ 未找到学科: {subject_name}")
        return
    edition = subject.get(edition_name)
    if not edition:
        print(f"❌ 未找到版本: {edition_name}")
        print(f"可用版本: {', '.join(sorted(subject.keys()))}")
        return
    print(f"\n📚 {stage_name} > {subject_name} > {edition_name}\n")
    print_catalog_level(edition, 3)


def search_materials(keyword):
    cat = load_catalog()
    results = []
    kw = keyword.lower()

    def traverse(obj, path=None):
        if path is None:
            path = []
        if isinstance(obj, list):
            for m in obj:
                title = m.get("title", "")
                if kw in title.lower():
                    results.append({"material": m, "path": list(path)})
        elif isinstance(obj, dict):
            for k, v in obj.items():
                traverse(v, path + [k])

    traverse(cat["catalog"])
    print(f'\n🔍 搜索"{keyword}" 找到 {len(results)} 本教材:\n')
    for i, r in enumerate(results, 1):
        p = r["path"][-5:]
        classification = " > ".join(p) if len(p) >= 5 else " > ".join(p)
        mid = r["material"]["id"]
        title = r["material"]["title"]
        print(f"  {i}. {title}")
        print(f"     分类: {classification}")
        print(f"     ID: {mid}")
        print(f"     在线: https://basic.smartedu.cn/tchMaterial/detail?id={mid}")
        print("")


def show_detail(mid):
    cat = load_catalog()
    found = None
    found_path = []

    def traverse(obj, path=None):
        nonlocal found, found_path
        if path is None:
            path = []
        if isinstance(obj, list):
            for m in obj:
                if m.get("id") == mid:
                    found = m
                    found_path = list(path)
                    return
        elif isinstance(obj, dict):
            for k, v in obj.items():
                traverse(v, path + [k])

    traverse(cat["catalog"])

    if not found:
        print(f"❌ 未找到教材ID: {mid}")
        return

    print(f"\n📖 教材详情\n")
    print(f"  名称: {found['title']}")
    print(f"  ID: {found['id']}")
    print(f"  分类: {' > '.join(found_path[-5:])}")
    print(f"  资源类型: {found.get('resource_type', 'N/A')}")
    print(f"  章节数: {len(found.get('chapter_ids', []))}")
    print(f"  在线查看: https://basic.smartedu.cn/tchMaterial/detail?id={found['id']}")


# ===== 主程序 =====
if __name__ == "__main__":
    args = sys.argv[1:]
    cmd = args[0] if args else "help"

    commands = {
        "stats": stats,
        "stages": list_stages,
        "help": print_help,
    }

    if cmd in commands:
        commands[cmd]()
    elif cmd == "subjects":
        list_subjects(args[1] if len(args) > 1 else "")
    elif cmd == "editions":
        list_editions(args[1] if len(args) > 1 else "",
                       args[2] if len(args) > 2 else "")
    elif cmd == "stage":
        list_by_stage(args[1] if len(args) > 1 else "")
    elif cmd == "subject":
        list_by_subject(args[1] if len(args) > 1 else "",
                         args[2] if len(args) > 2 else "")
    elif cmd == "edition":
        list_by_edition(args[1] if len(args) > 1 else "",
                         args[2] if len(args) > 2 else "",
                         args[3] if len(args) > 3 else "")
    elif cmd == "search":
        search_materials(" ".join(args[1:]))
    elif cmd == "detail":
        show_detail(args[1] if len(args) > 1 else "")
    else:
        print_help()
