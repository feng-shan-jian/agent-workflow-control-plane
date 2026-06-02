# Agent Workflow Control Plane

## 项目定位

本包不是某个业务系统的开发包，也不是 QMS 专用包。

它的目标是把一段复杂协作对话中形成的工作方式机制化，使 Codex 可以继续执行类似流程：

```text
需求澄清
→ 初版评估
→ 红队审查
→ 多方案比较
→ 最小补强
→ 机制化设计
→ 多轮功能测试
→ 稳定性测试
→ 压力测试
→ 查缺补漏
→ 清理测试痕迹
→ 锁定版本
→ 输出报告和交付包
```

核心原则：

```text
少靠语言限制，多靠机制文件、生命周期门禁、状态文件、路由查询、测试任务和校验脚本。
```

## 核心结构

```text
AGENTS.md                         # 短启动内核
.agent/context.json               # route pack 索引，不默认全文读取
.agent/state.json                 # 项目状态、dirty、active、学习队列
.agent/lifecycle.json             # 工作流程阶段门禁
.agent/policy.json                # 强制策略和禁止项
.agent/output-contract.json       # 最终输出契约
.agent/test-tasks.json            # 自带机制测试任务
.agent/check.mjs                  # 零依赖 Router-CLI + 校验器
.agent/routes/core.json           # 核心流程 route
docs/subagent-collaboration.md    # 多 Agent / subagent 协作机制
docs/test-tasks.md                # 测试任务说明
CODEX_CONTINUE_PROMPT.md          # 交给 Codex 继续工作的提示词
```

## 默认执行方式

先运行：

```bash
node .agent/check.mjs
node .agent/check.mjs test
node .agent/check.mjs routes
```

根据任务选择 route：

```bash
node .agent/check.mjs route workflow_review
node .agent/check.mjs route redteam_review
node .agent/check.mjs route mechanism_patch
node .agent/check.mjs route stability_test
node .agent/check.mjs route pressure_test
node .agent/check.mjs route package_release
```

如果无法判断任务类型：

```bash
node .agent/check.mjs route unknown_task
```

未知任务不得导致全量读取，应先进入窄化分类流程。

## 版本进化方式

本包支持持续进化，但不允许无限膨胀：

1. 高频未知任务先进入 `.agent/state.json` 的 `route_learning_queue`。
2. 达到阈值后再新增 route。
3. route 长期不用时降级为 `deprecated` 或移入扩展 route pack。
4. 每次改机制文件后必须运行 `node .agent/check.mjs`。
5. 正式交付包不得包含测试草稿、压测过程、scratch 文件或聊天思考内容。

## 适用范围

适合交给 Codex 继续推进这类工作：

- 对初始化规则进行红队审查。
- 比较多个设计版本。
- 把语言规则机械化。
- 对机制做功能测试、稳定性测试、压力测试。
- 生成最终报告、版本包、交付说明。
- 根据测试结果进行最小补强，而不是继续堆长规则。

## 测试用例

全链路测试用例见：

```text
docs/testing/full-chain-test-cases.md
```

该文件属于项目测试资产，可以提交；临时测试报告、变异副本、压测过程不得提交。
