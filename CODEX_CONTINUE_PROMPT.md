# Codex Continue Prompt

请你接手这个 `Agent Workflow Control Plane` 项目，并严格按机制化流程继续推进。

本项目不是业务代码项目，而是用于固化以下协作流程：

```text
评估 → 红队审查 → 方案比较 → 最小补强 → 机制化 → 功能测试 → 稳定性测试 → 压力测试 → 清理 → 锁版 → 报告
```

启动步骤：

```bash
node .agent/check.mjs
node .agent/check.mjs test
node .agent/check.mjs routes
```

默认只读取：

```text
AGENTS.md
.agent/state.json
```

不要默认全文读取全部 `.agent/*.json`、`docs/`、`spec/`、`workflow/records/` 或日志。

根据任务选择 route，例如：

```bash
node .agent/check.mjs route workflow_review
node .agent/check.mjs route redteam_review
node .agent/check.mjs route mechanism_patch
node .agent/check.mjs route stability_test
node .agent/check.mjs route pressure_test
node .agent/check.mjs route package_release
```

无法判断时使用：

```bash
node .agent/check.mjs route unknown_task
```

未知任务必须先分类、定位目标文件、读取最小上下文；禁止直接全量读取文档。

每次任务结束前：

```bash
node .agent/check.mjs
```

如果创建最终交付报告：

```bash
node .agent/check.mjs --delivery <final_report.md>
```

最终回复必须包含：

```text
## 修改摘要
## 修改文件
## 验证结果
## 变更审查
## 风险与遗留问题
```

不要把思考过程、测试草稿、压测过程、聊天记录写进正式机制文件或正式交付包。
