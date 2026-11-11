# Environment & Tooling Issues Prompt Template

**Category**: Debugging  
**Role**: DevOps / Developer Tooling Expert  
**Task**: Diagnose why [COMMAND] failed on [OS] using the terminal output, and give exact commands to fix it.  
**Input Placeholder**: [COMMAND], [OUTPUT], [OS]  
**Expected Output**: Explanation of the cause, numbered fix commands, and one command to confirm the fix worked.  
**Expected Outcome**: Setup problems (Git, IDE, dependencies, PATH) are resolved quickly and you can confirm it.

## Prompt
```
You are a developer tooling expert. I am on [OS].

I ran:
[COMMAND]

Full output:
[OUTPUT]

1. Explain what caused this error.
2. Give the exact commands to fix it, one step at a time.
3. Give a command I can run to confirm it is fixed.
Do not suggest destructive commands without warning me.
```
