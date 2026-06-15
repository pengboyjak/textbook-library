# 贡献指南 / Contributing Guide

感谢你关注这个开放公益项目！Thanks for your interest in this open public-benefit project!

## 🌍 项目愿景 / Vision

让全球任何角落的学习者都能便捷发现和访问中国K12教材资源。
Help learners from any corner of the world easily discover and access Chinese K-12 textbook resources.

## 🤝 如何贡献 / How to Contribute

### 1. 更新教材数据 / Update Textbook Data

平台教材会随时间更新。如果你发现数据过期：

```bash
# 运行采集脚本（需要 Playwright + Chrome）
node smartedu_scraper.js

# 重新生成目录
node build_catalog.js
```

### 2. 新增查询接口 / Add Query Interfaces

目前支持 Node.js 和 Python。欢迎添加其他语言版本：
- Go
- Rust
- PHP
- Ruby

只需实现 `scripts/lookup.js` 中定义的命令即可。

### 3. 改进教材分类 / Improve Classification

如果发现教材分类错误或缺失：
1. 提交 Issue 描述问题
2. 或直接修改 `references/catalog.json` 提交 PR

### 4. 添加测试 / Add Tests

欢迎为查询脚本添加单元测试。

### 5. 改进文档 / Improve Documentation

- 英文翻译改进
- 新增使用示例
- 代理平台适配指南

## 📋 提交流程 / Submission Process

1. Fork 本仓库
2. 创建特性分支: `git checkout -b feature/xxx`
3. 提交更改: `git commit -m 'Add xxx'`
4. 推送到 Fork: `git push origin feature/xxx`
5. 提交 Pull Request

## 🎯 优先需求 / Priority Needs

- [ ] 英文版数据（字段翻译）
- [ ] REST API 封装
- [ ] pip / npm 包化发布
- [ ] 教材封面/图片信息
- [ ] 教材章节详情
- [ ] 海外访问镜像
- [ ] 多语言查询支持

## 📜 行为准则 / Code of Conduct

本项目遵循开放、包容、尊重的原则。所有参与者应遵守：
- 尊重他人贡献
- 建设性沟通
- 接受不同观点

Open, inclusive, respectful. All contributors should:
- Respect others' contributions
- Communicate constructively
- Accept different viewpoints
