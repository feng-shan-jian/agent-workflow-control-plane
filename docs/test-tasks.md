<!-- vibe coding -->

# test-tasks.md

## 测试定位

本文件说明 `.agent/test-tasks.json` 中的机制测试任务。

## 运行命令

```bash
node .agent/check.mjs test
node .agent/check.mjs stress
```

## 测试覆盖

```text
1. JSON 合法性。
2. route 查询。
3. unknown_task 兜底。
4. policy 强制策略。
5. output contract 输出契约。
6. route 引用存在性。
7. state budget。
8. 正式包清洁。
9. 轻量压力测试。
```
