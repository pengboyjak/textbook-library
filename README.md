# 📚 中国K12中小学教材库 / China K-12 Textbook Library

> 🌍 **开放公益项目** — 让全球中文学习者便捷访问中国K12教材资源  
> 🌍 **Open Public-Benefit** — Making Chinese K-12 textbooks accessible to learners worldwide

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Textbooks](https://img.shields.io/badge/Textbooks-2,637-blue)](./references/catalog.json)
[![AI Ready](https://img.shields.io/badge/AI%20Ready-Universal-green)](./AGENTS.md)

---

## 🎯 使命 / Mission

**让世界每个角落的学习者都能便捷获取中国中小学教材信息。**

这个代码库诞生于一个简单的信念：中文教育不应该有国界。无论你是在北京、纽约、伦敦还是新加坡，每个想学习中文教材的学生都应该能轻松找到需要的课本。

项目免费、开放、永久公益。我们特别希望帮助：
- 🧑‍🎓 海外华人学子学习母语教材
- 🌐 国际中文教育者准备教学材料
- 📖 全球中文爱好者系统学习中文
- 🤖 各类 AI 智能体提供教材信息查询服务

---

## 📊 数据概览 / Data Overview

与正版教材同步的 K12 教育内容，**2,637 本教材**，7 个学段。

| 学段 Stage | 学科数 | 教材数 |
|-----------|--------|--------|
| 小学 Primary | 7 | 282 |
| 小学（五•四学制） | 9 | 115 |
| 初中 Junior High | 18 | 630 |
| 初中（五•四学制） | 15 | 170 |
| 高中 Senior High | 21 | 516 |
| 特殊教育 Special Ed | 21 | 300 |
| 其他 Others | 1 | 624 |

---

## 🚀 快速开始 / Quick Start

### 人类使用 / For Humans

```bash
# 克隆仓库
git clone git@github.com:pengboyjak/textbook-library.git
cd textbook-library

# 用 Node.js 查询
node scripts/lookup.js search "三年级英语"

# 或用 Python 查询
python scripts/lookup.py search "三年级英语"

# 查看统计
node scripts/lookup.js stats
```

### AI 智能体使用 / For AI Agents

此项目为**通用 Skills 库**，多种 AI 平台可直接引用：

| 平台 | 使用方式 |
|------|---------|
| **OpenClaw** | 放入 `skills/` 目录自动加载，支持 50+ 消息平台 |
| **Hermes Agent** | 放入 `skills/` 目录，支持 Skill 自动加载与自进化 |
| **Claude Code** | 放入 `.claude/skills/` 自动加载 |
| **Claude.ai / API** | 读取 `AGENTS.md` + `SKILL.md` 注入 context |
| **ChatGPT / GPTs** | 上传 `catalog.csv` 作为 Knowledge file，`AGENTS.md` 作为 Instructions |
| **Codex CLI (OpenAI)**| 开源终端 Agent，支持 Skills 目录自动索引 |
| **Cursor / Windsurf** | Fork 项目，Agent 自索引 `AGENTS.md` |
| **GitHub Copilot** | 添加 `@terminal` 运行 lookup 脚本 |
| **Cline / RooCode** | VS Code 开源 Agent，支持自定义 Skills 目录 |
| **Aider** | Git 原生终端 Agent，直接运行 lookup 脚本 |
| **Devin** | 云端自主 Agent，Fork 项目后自动索引 |
| **Gemini CLI** | Google 终端 Agent，1000次/天免费 |
| **LangChain / LlamaIndex** | 解析 `catalog.json` 构建 RAG |
| **Continue.dev / OpenHands** | 开源 IDE 助手，支持项目级 Skills |
| **通用 LLM** | 将 `references/catalog_index.md` 注入 system prompt |

详见 [AGENTS.md](./AGENTS.md) 和 [llms.txt](./llms.txt)。

---

## 📁 项目结构 / Structure

```
textbook-library/
├── README.md                   # 本文件（双语）
├── LICENSE                     # MIT 协议 + 数据版权说明
├── AGENTS.md                   # 🤖 AI 智能体通用接入文档
├── llms.txt                    # 🤖 AI 可读索引（LLMs.txt 标准）
├── CONTRIBUTING.md             # 贡献指南
├── SKILL.md                    # Claude Code Skill 定义
├── scripts/
│   ├── lookup.js               # Node.js 查询脚本
│   └── lookup.py               # Python 查询脚本
└── references/
    ├── catalog.json            # 完整结构化目录（1.8MB）
    ├── catalog.csv             # CSV 格式导出
    ├── catalog_index.md        # Markdown 完整索引
    ├── primary.md              # 小学阶段
    ├── junior.md               # 初中阶段
    ├── senior.md               # 高中阶段
    └── special.md              # 特殊教育
```

---

## 🔧 查询方式 / Query Methods

### 命令行 / CLI

```bash
# 学段列表
node scripts/lookup.js stages

# 按学段查
node scripts/lookup.js stage 小学

# 按学段+学科
node scripts/lookup.js subject 初中 语文

# 按学段+学科+版本
node scripts/lookup.js edition 高中 数学 人教版

# 关键词搜索
node scripts/lookup.js search "一年级上册"

# 教材详情
node scripts/lookup.js detail <UUID>
```

### 自然语言对照 / Natural Language Mapping

| 用户问法 | 查询方式 |
|---------|---------|
| 人教版小学语文一年级上册 | `search "一年级上册 语文"` → 筛选人教版 |
| 初中物理有哪些版本 | `subjects 初中` → 找物理 → `editions 初中 物理` |
| 高中数学必修一 | `search "必修 第一册"` + `subject 高中 数学` |
| 三年级英语教材 | `search "三年级 英语"`（注意：跨小学/初中） |

---

## 📖 教材分类 / Classification

五级标签维度组织所有教材：

| 维度 | 标识 | 典型值 |
|------|------|--------|
| 学段 | `zxxxd` | 小学、初中、高中、特殊教育 |
| 学科 | `zxxxk` | 语文、数学、英语、物理、化学... |
| 版本 | `zxxbb` | 人教版、北师大版、苏教版、部编版... |
| 年级 | `zxxnj` | 一年级 ~ 十二年级 |
| 册次 | `zxxcc` | 上册、下册、全一册 |

---

## 🔗 在线教材 / View Online

```
https://basic.smartedu.cn/tchMaterial/detail?id={教材UUID}
```

---

## 🤝 参与贡献 / Contribute

这个项目需要你的帮助！请查看 [CONTRIBUTING.md](./CONTRIBUTING.md)：

- 📊 更新教材数据
- 🔧 新增查询接口（Go, Rust, PHP...）
- 🌐 改进英文翻译
- 🧪 添加测试
- 🐛 修复 Bug

---

## 📜 协议 / License

- **代码**: MIT License — 自由使用、修改、分发
- **使用声明**: 本项目仅提供教材目录索引，与正版教材同步，不含教材正文内容

详见 [LICENSE](./LICENSE)

---

## ⭐ 支持我们 / Support Us

如果这个项目帮助了你或你的孩子找到了需要的教材——请点一个 ⭐ Star。

这束星光会让更多海外学子、中文教师、教育公益者发现这个项目。

If this project helped you or your child find the right textbook — give it a ⭐ Star. That starlight helps more overseas students, Chinese teachers, and education advocates discover this resource.

---

## ☕ 赞助本项目 / Sponsor

这个项目将**永久免费、永久开源**——不会收费，不会加广告，不会设付费墙。

但维护一个涵盖 2,637 本教材的数据库需要持续的精力投入：

- 🕐 跟踪教材版本更新
- 🔧 维护多语言查询脚本
- 🤖 适配不断涌现的新 AI 智能体平台
- 🌐 为海外访问提供更快的镜像服务

**如果你愿意请我们喝杯咖啡，每一份心意都在说：这件事值得做下去。**

<div align="center">

![赞助收款码](./assets/sponsor-qr.jpg)

*微信/支付宝扫码均可*

</div>

> 💡 赞助完全自愿，不赞助也永久免费使用。你觉得有价值就够了。

---

> 📮 联系 / Contact: 提交 [Issue](https://github.com/pengboyjak/textbook-library/issues) 或 PR
