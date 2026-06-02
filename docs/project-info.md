<!-- vibe coding -->

# project-info.md

## 文档定位

本文档只记录本控制平面项目的基础信息与首次接入方式。

本项目用于把复杂协作流程机制化，不绑定具体业务系统。

## 项目名称

```text
Agent Workflow Control Plane
```

## 目标

```text
把“评估、红队、比较、机制化、测试、压测、锁版、交付”的工作链条固定为可查询、可校验、可迭代的机制。
```

## 首次接入

```bash
node .agent/check.mjs
node .agent/check.mjs test
node .agent/check.mjs routes
```

如果本包被迁移到具体项目中，应根据真实项目更新：

```text
.agent/state.json
docs/project-info.md
spec/ruoyi-conventions.md 或对应项目约定文档
```

## 不做的事

```text
不存放 AI 思考过程。
不存放聊天全文。
不把压测过程写入正式机制文件。
不默认读取全部历史记录。
```
