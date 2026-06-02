<!-- vibe coding -->

# code-review.md

## 审查目标

用于交付前审查机制修改、流程修改、测试任务和正式包清洁度。

## 审查清单

| 检查项 | 要求 |
|---|---|
| 最小改动 | 只修改当前任务必要文件 |
| 机制完整性 | `node .agent/check.mjs` 通过 |
| 测试任务 | `node .agent/check.mjs test` 通过 |
| 路由引用 | route 中真实文档引用必须存在 |
| 输出契约 | 最终报告满足 `.agent/output-contract.json` |
| 临时内容 | 正式包不得包含 scratch、压测过程、测试草稿 |
| 编码 | 中文可读，无 U+FFFD 乱码 |
| JSON | `.agent/*.json` 不得出现注释、尾逗号、Markdown 内容 |
| subagent | 命中强制条件时必须读取 `docs/subagent-collaboration.md` |
