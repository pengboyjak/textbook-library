# AGENTS.md — 中国K12中小学教材库

## 项目使命 / Mission

这是一个**开放公益**的教材目录索引库，旨在让全球任何 AI 智能体都能查询中国中小学教材信息。
帮助海外华人学子、国际中文学习者、教育工作者快速定位所需教材。

This is an **open public-benefit** textbook catalog index for any AI agent worldwide,
supporting Chinese K-12 education accessibility for overseas students and global learners.

---

## AI Agent 使用说明 / Agent Usage Instructions

### 数据加载策略 / Data Loading Strategy

1. **小查询（<50本）**：直接运行 `node scripts/lookup.js search "关键词"` 或 `python scripts/lookup.py search "关键词"`
2. **中查询（按学段/学科）**：读取 `references/{stage}.md` 分文件（如 `references/primary.md`）
3. **大查询（全量分析）**：解析 `references/catalog.json` 结构化数据
4. **Excel/表格分析**：使用 `references/catalog.csv`

### 查询命令 / Lookup Commands

#### Node.js
```bash
node scripts/lookup.js stages          # 所有学段
node scripts/lookup.js stats           # 统计信息
node scripts/lookup.js subjects 初中    # 某学段的学科
node scripts/lookup.js stage 小学       # 某学段教材
node scripts/lookup.js subject 初中 语文 # 学段+学科
node scripts/lookup.js edition 高中 数学 人教版 # 学段+学科+版本
node scripts/lookup.js search "关键词"  # 搜索
node scripts/lookup.js detail <教材ID>  # 详情
```

#### Python
```bash
python scripts/lookup.py stages        # 所有学段
python scripts/lookup.py stats         # 统计信息
python scripts/lookup.py subjects 初中  # 某学段的学科
python scripts/lookup.py stage 小学     # 某学段教材
python scripts/lookup.py subject 初中 语文
python scripts/lookup.py edition 高中 数学 人教版
python scripts/lookup.py search "关键词"
python scripts/lookup.py detail <教材ID>
```

### 数据结构 / Data Structure

```
catalog.json:
{
  "generatedAt": "ISO时间戳",
  "source": "basic.smartedu.cn/tchMaterial",
  "totalCount": 2637,
  "catalog": {
    "学段名": {
      "学科名": {
        "版本名": {
          "年级名": {
            "册次名": [
              { "title": "教材名称", "id": "UUID" }
            ]
          }
        }
      }
    }
  }
}
```

### 五级分类维度 / Five Classification Dimensions

| 维度 | 字段 | 典型值 |
|------|------|--------|
| 学段 Stage | zxxxd | 小学, 初中, 高中, 特殊教育 |
| 学科 Subject | zxxxk | 语文, 数学, 英语, 物理... |
| 版本 Edition | zxxbb | 人教版, 北师大版, 苏教版... |
| 年级 Grade | zxxnj | 一年级~十二年级 |
| 册次 Volume | zxxcc | 上册, 下册, 全一册 |

### 教材查看链接 / Textbook Viewing URL

```
https://basic.smartedu.cn/tchMaterial/detail?id={教材UUID}
```

### 常见查询对照 / Common Query Mapping

| 用户问题 | Agent 操作 |
|---------|-----------|
| "人教小学语文一年级上" | search "一年级上册 语文" → 筛选人教版 |
| "初中物理有哪些版本" | subjects 初中 → 找物理 → editions 初中 物理 |
| "高中必修一" | subject 高中 数学 → 找必修第一册 |
| "三年级英语" | search "三年级 英语"（注意小学/初中都有） |

---

## 多平台适配 / Multi-Platform Notes

### OpenClaw
全球最快的开源 AI Agent 框架（360K+ GitHub Stars）。将本项目放入 OpenClaw 的 `skills/` 目录即可自动加载。OpenClaw 通过 `AGENTS.md` 和 `SKILL.md` 自动识别技能，支持 Telegram/WhatsApp/Slack/飞书等 50+ 消息平台触发查询。

### Hermes Agent (Nous Research)
自进化 AI Agent 框架（134K+ GitHub Stars），具备 Skill 自动创建与优化能力。将项目放入 Hermes 的 `skills/` 目录，Agent 会基于 `SKILL.md` 和 `AGENTS.md` 自动加载教材查询能力，并在使用中持续优化调用策略。

### Claude Code / Claude
加载 `SKILL.md` 和 `AGENTS.md`，自动获得教材查询能力。

### ChatGPT / GPT Builder
将 `AGENTS.md` 内容配置为 GPT Instructions，上传 `catalog.csv` 作为 knowledge file。

### Codex CLI (OpenAI)
开源终端 Agent，将项目放入 Skills 目录，通过 `AGENTS.md` 自动索引。

### Cursor / Windsurf / GitHub Copilot
IDE 内置 Agent 会自动索引 `AGENTS.md` 和项目文件。

### Cline / RooCode
VS Code 开源 Agent，支持自定义 Skills 路径，放入后自动识别。

### Aider
Git 原生终端 Agent，直接运行 `scripts/lookup.py` 或 `scripts/lookup.js` 查询教材。

### Devin
云端自主 Agent，Fork 本项目后自动索引 `AGENTS.md` 获取教材查询能力。

### Gemini CLI
Google 开源终端 Agent，支持项目级上下文，每天 1000 次免费调用。

### LangChain / LlamaIndex
直接解析 `references/catalog.json`，构建向量索引或结构化查询器。

### Continue.dev / OpenHands
开源 IDE 助手，索引 `AGENTS.md` 后支持自然语言教材查询。

### 通用 LLM
将 `references/catalog_index.md` 作为 context 直接注入 prompt。

---

## 贡献 / Contributing

见 [CONTRIBUTING.md](./CONTRIBUTING.md)，欢迎提交教材数据更新、新增查询接口、修复问题。

## 协议 / License

代码: MIT License | 教材目录与正版教材同步，版权归原出版社所有
详见 [LICENSE](./LICENSE)
