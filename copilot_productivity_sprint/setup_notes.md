# Setup Notes: AI Coding Assistant Environment

## Machine
- **OS:** macOS (Apple Silicon)
- **Runtime:** Node.js v24.21.0, npm 11.19.0 (checked with `node --version` and `npm --version`)

## IDEs
| IDE | Role | Version / channel |
|---|---|---|
| Visual Studio Code | Main editor | Stable channel, updated November 2026 |
| Cursor ("Cursor 2") | AI-first editor for comparison | Updated to the latest release on 15 Nov 2026. The old build was rejected with "Your version of Cursor is no longer supported." |

To check an exact version: **Code → About Visual Studio Code** / **Cursor → About Cursor**.

## AI assistants and extensions
| Tool | Where | Plan | What it does |
|---|---|---|---|
| Claude Code (Anthropic extension) | VS Code and Cursor | Claude account (Opus 5.5 model) | Chat and agent mode: reads, creates and edits files and runs shell commands after approval |
| Cursor Tab | Built into Cursor | Cursor Free plan | Grey inline completions, accepted with `Tab` |
| Cursor Chat / Agent | Built into Cursor | Cursor Free plan | Side-panel chat (`Cmd+L`) and agent mode |
| GitHub Copilot (optional) | VS Code | Copilot Free | Inline completions and chat; same role as Cursor Tab, so I use it as an alternative |

## Setup steps
1. **Install VS Code** from code.visualstudio.com and drag it to Applications.
2. **Install Node.js** (LTS installer from nodejs.org) and verify with `node --version`.
3. **Install the Claude Code extension.** In VS Code open Extensions (`Cmd+Shift+X`), search "Claude Code" (publisher: Anthropic), click Install, then sign in with my Claude account when the panel opens.
4. **Install Cursor** from cursor.com, sign in on the Free plan, and import VS Code settings when prompted (Settings → General → VS Code Import).
5. **Update Cursor.** The first AI request failed because the version was unsupported. I clicked **Update now** (or **Cursor → Check for Updates…**), and after the restart Cursor Tab and chat worked.
6. **Install Claude Code in Cursor too**, so the same agent is available in both editors.
7. **(Optional) GitHub Copilot.** In VS Code Extensions, install "GitHub Copilot" and sign in with GitHub to enable Copilot Free.
8. **(Optional) `cursor` shell command.** `cursor <path>` returned "command not found", so: Cursor Command Palette (`Cmd+Shift+P`) → "Shell Command: Install 'cursor' command in PATH". Until then, `open -a Cursor "<path>"` works.

## Verification
- **Agent mode:** Claude Code created `mini-agent-demo/` (README.md, dice.js, dice.test.js), ran `node --test`, and all 5 tests passed.
- **Inline completion:** typing `function rollTwo` in Cursor showed a grey Cursor Tab suggestion (`Dice() {`); the status bar counts these under "Tab Stats".
- **Chat:** asked for explanations and rewrites in the side panel.

## Settings worth knowing
- **Permission mode:** Claude Code defaults to **Auto**, which approves its own lower-risk actions. During testing it scaffolded a React app and installed 24 npm packages without asking. For benchmark runs I switch to **Ask before edits** so every change is reviewed.
- **Privacy mode** in Cursor is **Enabled** (code is not stored by Cursor).
- **Context:** remove unrelated files from the chat context (e.g. a personal project that was open) so the assistant doesn't edit the wrong file.
