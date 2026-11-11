# Prompt Use Cases

## Planning & Design
- **Requirements Breakdown**
  - **Goal**: Turn a vague task or assignment into clear, actionable requirements
  - **Input**: Task description ([TASK_TEXT]) and any constraints ([CONSTRAINTS])
  - **Output**: List of requirements, acceptance criteria, and open questions

- **Feature Implementation Plan**
  - **Goal**: Plan a feature step by step before writing any code
  - **Input**: Feature description ([FEATURE]), tech stack ([LANGUAGE]/[FRAMEWORK]), existing project structure ([PROJECT_TREE])
  - **Output**: Ordered implementation steps, files to create or change, and a verification check for each step

- **Technology Comparison**
  - **Goal**: Choose the right tool, library, or engine for a project
  - **Input**: Project goals ([GOALS]), options to compare ([OPTION_A], [OPTION_B]), team skill level ([EXPERIENCE])
  - **Output**: Comparison table of trade-offs and a justified recommendation

## Code Generation
- **API Endpoint Scaffolding**
  - **Goal**: Generate an endpoint that follows the project's existing architecture
  - **Input**: Architecture pattern ([PATTERN], e.g. CQRS), entity/model ([MODEL]), required operations ([OPERATIONS])
  - **Output**: Command/query classes, handlers, controller endpoint, and validation rules

- **File Import with Validation**
  - **Goal**: Import data from a file safely, rejecting invalid rows
  - **Input**: File format ([FORMAT], e.g. Excel/CSV), column schema ([SCHEMA]), validation rules ([RULES])
  - **Output**: Import code, row-level error reporting, and a summary of imported vs. rejected rows

- **External API Integration**
  - **Goal**: Connect an application to a third-party or internal API
  - **Input**: API documentation or sample request ([API_SPEC]), authentication method ([AUTH]), [LANGUAGE]
  - **Output**: Client code with error handling, retries, and configuration kept out of the source code

## Code Quality
- **Production-Readiness Refactor**
  - **Goal**: Turn a working prototype script into maintainable, deployable code
  - **Input**: Prototype source code ([CODE_BLOCK]), target environment ([ENVIRONMENT])
  - **Output**: Restructured modules, config/secrets separated, logging added, plus an explanation of each change

- **Understanding & Modifying Existing Code**
  - **Goal**: Safely change code written by someone else
  - **Input**: Existing code ([CODE_BLOCK]), desired change ([CHANGE_REQUEST])
  - **Output**: Short explanation of how the code works, the minimal change needed, and the risks of that change

## Debugging
- **Error Explanation & Fix**
  - **Goal**: Find the root cause of an error and fix it without breaking other code
  - **Input**: Error message/traceback ([ERROR_MESSAGE]), related code ([CODE_BLOCK]), [LANGUAGE]/[FRAMEWORK]
  - **Output**: Plain-language cause, minimal fix, and how to verify it

- **Environment & Tooling Issues**
  - **Goal**: Resolve setup problems with terminal, Git, IDE, or dependencies
  - **Input**: Command run ([COMMAND]), full terminal output ([OUTPUT]), operating system ([OS])
  - **Output**: Explanation of the cause, exact commands to fix it, and a command to confirm the fix

## Data & Databases
- **Read-Only SQL Query**
  - **Goal**: Write a query that answers a business question without modifying data
  - **Input**: Table schemas ([SCHEMA]), question to answer ([QUESTION]), SQL dialect ([DIALECT])
  - **Output**: A SELECT-only query, an explanation of each clause, and performance notes

- **Data Matching & Cleaning**
  - **Goal**: Match or deduplicate records from different sources
  - **Input**: Sample records from each source ([SAMPLE_A], [SAMPLE_B]), matching criteria ([CRITERIA])
  - **Output**: Matching approach, implementation code, and examples of edge cases

## Documentation & Testing
- **README Generation**
  - **Goal**: Document a project so a new developer can run it quickly
  - **Input**: Project structure ([PROJECT_TREE]), main entry point ([ENTRY_FILE]), dependencies ([DEPENDENCIES])
  - **Output**: README with overview, setup steps, usage examples, and configuration

- **Unit Test Generation**
  - **Goal**: Cover a function's normal behavior and edge cases with tests
  - **Input**: Function source ([CODE_BLOCK]), [LANGUAGE], test framework ([TEST_FRAMEWORK])
  - **Output**: Test file with normal, edge, and error cases, plus a list of untested scenarios
