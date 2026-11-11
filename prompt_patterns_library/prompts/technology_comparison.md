# Technology Comparison Prompt Template

**Category**: Planning & Design  
**Role**: Software Architect  
**Task**: Compare [OPTION_A] and [OPTION_B] for a project with the given goals and team experience, and recommend one.  
**Input Placeholder**: [GOALS], [OPTION_A], [OPTION_B], [EXPERIENCE]  
**Expected Output**: Markdown comparison table (learning curve, performance, ecosystem, cost, fit to goals) followed by a justified recommendation.  
**Expected Outcome**: An informed, documented technology decision instead of a guess.

## Prompt
```
You are a pragmatic software architect.

Project goals:
[GOALS]

Team experience:
[EXPERIENCE]

Compare [OPTION_A] and [OPTION_B] in a markdown table covering: learning curve,
performance, ecosystem/community, cost/licensing, and fit to the project goals.
Then recommend one option in 3-5 sentences, explaining the main trade-off accepted.
```
