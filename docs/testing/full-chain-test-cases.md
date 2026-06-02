<!-- vibe coding -->

# full-chain-test-cases.md

## 文档定位

本文档记录本项目的全链路测试用例设计。它属于项目测试资产，不是临时测试报告。

## 测试分层

| 层级 | 目标 | 命令 / 方法 |
|---|---|---|
| T0 完整性 | 核心文件、JSON、route 引用存在 | `node .agent/check.mjs` |
| T1 功能 | route 查询、unknown fallback、输出契约 | `node .agent/check.mjs test` |
| T2 稳定性 | state budget、route GC、正式包清洁 | `node .agent/check.mjs test` |
| T3 压力 | 多 route 循环与引用数上限 | `node .agent/check.mjs stress` |
| T4 变异 | 删除关键文件、破坏 JSON、缺输出字段时应失败 | 临时副本中执行，不提交变异文件 |
| T5 交叉验证 | 对比原始语言版、拓扑版、机制版的约束保留情况 | 测试报告中记录，不写入机制文件 |

## 必须覆盖的测试用例

| ID | 类型 | 用例 | 期望 |
|---|---|---|---|
| FT-001 | 功能 | 查询 `workflow_review` route | 返回对应读取范围 |
| FT-002 | 功能 | 查询不存在 route | 兜底到 `unknown_task` |
| FT-003 | 功能 | 校验 delivery template | 必须包含输出契约要求的所有章节和关键字段 |
| ST-001 | 稳定 | `.agent/state.json` 默认入口数量不超过预算 | 校验通过 |
| ST-002 | 稳定 | route 引用真实文件缺失 | 校验失败 |
| ST-003 | 稳定 | `policy.subagent.required_doc` 缺失 | 校验失败 |
| PT-001 | 压力 | 10000 轮 route 循环 | 不出现 route explosion |
| MT-001 | 变异 | 破坏任一 `.agent/*.json` | 校验失败 |
| MT-002 | 变异 | 删除 `docs/subagent-collaboration.md` | 校验失败 |
| MT-003 | 变异 | 删除交付模板中任一关键字段 | delivery 校验失败 |

## 交付要求

正式交付包不得包含临时变异文件、压测过程、scratch 目录或测试报告草稿。
