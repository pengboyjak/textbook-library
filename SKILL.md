---
name: textbook-library
description: 查询中国K12中小学教材库（与正版教材同步）。当用户提到教材、课本、教科书、中小学教材、语文/数学/英语等学科教材、人教版/北师大版等版本、某年级某册教材、电子课本时，使用此技能。覆盖小学、初中、高中、五•四学制、特殊教育共2637本教材。开放公益项目，支持多平台智能体引用。
---

# 中国K12中小学教材库

> 🌍 **开放公益项目** — 永久免费，旨在让全球中文学习者便捷获取中国K12教材信息  
> 🤖 **通用 AI Skills** — 支持 OpenClaw / Hermes / Claude Code / ChatGPT / Codex CLI / Cursor 等 15+ 平台引用  
> 📚 **[2637 本教材](https://github.com/pengboyjak/textbook-library)** — 与正版教材同步的K12教育内容

## 🤖 AI 智能体使用指南

本技能支持多种 AI 平台引用，详见 [AGENTS.md](./AGENTS.md)：
- **OpenClaw**: 放入 `skills/` 自动加载，50+ 消息平台可用
- **Hermes Agent**: 放入 `skills/` 自动加载，支持 Skill 自进化
- **Claude Code**: 放入 `.claude/skills/` 自动加载
- **ChatGPT/GPTs**: 上传 `catalog.csv` + `AGENTS.md`
- **Codex CLI**: 放入 Skills 目录自动索引
- **Cursor/Windsurf**: Fork 后 Agent 自索引
- **Cline / RooCode / Aider**: VS Code/终端开源 Agent
- **Devin / Gemini CLI**: 云端/终端自主 Agent
- **通用 LLM**: 将 `references/catalog_index.md` 注入 context prompt

## 教材分类体系

平台使用五级标签维度组织教材：

| 维度 | 标识 | 说明 |
|------|------|------|
| 学段 | `zxxxd` | 小学、初中、高中、特殊教育等 |
| 学科 | `zxxxk` | 语文、数学、英语、物理、化学等 |
| 版本 | `zxxbb` | 人教版、北师大版、苏教版等 |
| 年级 | `zxxnj` | 一年级~十二年级 |
| 册次 | `zxxcc` | 上册、下册、全一册 |

## 覆盖学段

执行以下命令获取各学段统计：

```bash
node scripts/lookup.js stats
```

学段概况：
- **小学**：7个学科，约282本教材
- **小学（五•四学制）**：9个学科，约115本教材
- **初中**：18个学科，约630本教材
- **初中（五•四学制）**：15个学科，约170本教材
- **高中**：21个学科，约516本教材
- **特殊教育**：21个学科，约300本教材

## 查询教材

### 方式1：使用查询脚本

```bash
# 按学段查询
node scripts/lookup.js stage 小学

# 按学段+学科查询
node scripts/lookup.js subject 初中 语文

# 按学段+学科+版本查询
node scripts/lookup.js edition 高中 数学 人教版

# 搜索教材名
node scripts/lookup.js search "一年级上册"

# 查看教材详情
node scripts/lookup.js detail <教材ID>

# 查看所有学段
node scripts/lookup.js stages

# 查看某学段的所有学科
node scripts/lookup.js subjects 初中
```

### 方式2：直接读取数据文件

教材数据文件的优先级：
1. **`references/catalog.json`** - 完整结构化目录（先读这个了解结构）
2. **`references/primary.md`** - 小学阶段教材索引
3. **`references/junior.md`** - 初中阶段教材索引
4. **`references/senior.md`** - 高中阶段教材索引
5. **`references/special.md`** - 特殊教育教材索引

当用户查询量大时，读取对应的 references 文件而不是一次加载全部数据。

### 方式3：CSV数据查询

`references/catalog.csv` 包含所有教材的CSV格式数据，可用Excel打开或脚本处理。

## 教材在线查看

每本教材在平台上有对应的详情页：

```
https://basic.smartedu.cn/tchMaterial/detail?id={教材ID}
```

将 `{教材ID}` 替换为教材的唯一标识符（如 `bdc00134-465d-454b-a541-dcd0cec4d86e`）即可查看。

## 教材ID格式

教材ID是UUID格式，例如：`bdc00134-465d-454b-a541-dcd0cec4d86e`

## 常见查询示例

| 用户问法 | 查询方式 |
|---------|---------|
| "人教版小学语文一年级上册" | `search "一年级上册 语文"` → 筛选"人教版" |
| "初中物理有哪些版本" | `subjects 初中` → 查找物理 → `edition 初中 物理` |
| "高中数学必修一" | `search "必修 第一册"` 或 `subject 高中 数学` |
| "三年级英语教材" | `search "三年级 英语"` 考虑小学和初中两个学段 |

## 数据来源

数据与正版教材同步，采集时间见数据文件中的 `generatedAt` 字段。教材内容版权归原出版社所有。

## 文件结构

```
textbook-library/
├── SKILL.md                      # 本文件 - 技能入口
├── scripts/
│   └── lookup.js                 # 教材查询脚本
└── references/
    ├── catalog.json              # 完整结构化目录（大文件）
    ├── catalog.csv               # CSV格式索引导出
    ├── catalog_index.md          # Markdown格式完整索引
    ├── primary.md                # 小学阶段教材列表
    ├── junior.md                 # 初中阶段教材列表
    ├── senior.md                 # 高中阶段教材列表
    └── special.md                # 特殊教育教材列表
```
