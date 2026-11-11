# Reflection on AI-Assisted Debugging

## Introduction
I created six buggy snippets in Python, JavaScript and C, each with a different error type: off-by-one, logic, runtime exception, syntax, data type and library misuse. I asked an AI assistant to diagnose each one, then tested every suggested fix before saving it in `bug_fixes/`. The goal was to measure how much an AI helps in debugging, and where it cannot be trusted alone.

## AI Strengths
The easiest bugs for the AI were the ones with a clear error message. For `bug4.js`, the error `SyntaxError: missing ) after for-loop control @ bug4.js:12:27` led straight to a one-character fix. For `bug3.py` and `bug6.py`, the stack traces pointed to the exact lines, and the AI explained the cause clearly: "`list.sort()` sorts the list in place and returns `None`". It also noticed a second problem I had not mentioned: `sort()` would modify the caller's list, which the docstring forbids.

The AI also found silent logic bugs well. In `bug2.js` it spotted the inverted rule in a single line:
```diff
- (year % 100 !== 0 || year % 400 !== 0)
+ (year % 100 !== 0 || year % 400 === 0)
```
For `bug5.c` it explained that integer division truncates the result before the conversion to `double`, a C detail beginners often miss.

## AI Weaknesses
The hardest bug was, surprisingly, the simplest one: `bug1.py`. The AI's first fix, `range(len(items) - n, len(items))`, corrected the reported case but failed on edge cases. With `n = 7` it returned `[40, 50, 10, 20, 30, 40, 50]`, and an empty list raised `IndexError`. The AI did not warn about this. Some alternative fixes were also wrong: `statistics.mean()` still crashed on an empty list, and `(double)(passed / total)` still printed `0.0%`. The AI's answers sounded equally confident whether they were correct or not.

## Human Role
Human judgment was needed in three places. First, choosing test cases: the bug 1 flaw appeared only because I tried `n` larger than the list. Second, checking requirements beyond "no crash": the "sort then slice" fix for bug 6 ran fine but broke the rule that the original list must stay unchanged. Third, project constraints the AI did not know: the grader required at most 40 lines, so I rewrote the test code in `bug5_fixed.c`.

## Conclusion
My trust level ended at "trust the diagnosis, verify the fix". The AI explained root causes correctly every time, but one of its first suggestions and two of its alternatives failed when tested. Overall, the AI made debugging faster: diagnosis took seconds instead of minutes, and most of my time went into testing. In real-world debugging, AI works best as a fast first reviewer when given the full error output. The developer still owns the test cases and the final decision, because a fix is only correct once it has passed the tests.
