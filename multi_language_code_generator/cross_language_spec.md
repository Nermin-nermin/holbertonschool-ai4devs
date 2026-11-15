# Cross-Language Specification - Log Analyzer

The same algorithm will be implemented in Python (reference), JavaScript and Java/Go. Every implementation must produce **byte-identical JSON** for the test cases below.

## Algorithm
Parse web server access logs in **Apache Common Log Format** and compute summary statistics.

Line format:
```
<ip> <ident> <user> [<timestamp>] "<METHOD> <path> <protocol>" <status> <bytes>
```
Example: `192.168.1.10 - - [15/Nov/2026:10:00:00 +0400] "GET /index.html HTTP/1.1" 200 1024`

Steps:
1. Read the input line by line. Skip blank lines (empty or only whitespace).
2. Match each line against the format above. If it does not match, increase `malformed_lines` and continue. Never crash on bad input.
3. For each valid line, record: IP (visitor), path, status code, bytes (`-` means `0`).
4. A request is an **error** if `status >= 400`.
5. Compute the output fields below.

## Inputs
- A text file (UTF-8) with one log entry per line, passed as a path on the command line (`log_analyzer <file>`), or a list of strings when called as a function.

## Outputs
A JSON object with exactly these keys:

| Field | Type | Rule |
|---|---|---|
| `total_requests` | int | Number of valid lines |
| `unique_visitors` | int | Number of distinct IPs |
| `error_count` | int | Valid lines with status ≥ 400 |
| `error_rate` | float | `error_count / total_requests * 100`, rounded to 2 decimals; `0.0` when there are no requests |
| `total_bytes` | int | Sum of bytes (`-` = 0) |
| `status_counts` | object | Status code (as string) → count, keys sorted ascending |
| `top_paths` | array | Up to 3 `{path, count}` objects, sorted by count descending, ties broken alphabetically by path |
| `malformed_lines` | int | Non-blank lines that did not match the format |

## Edge Cases
- Empty file → all counts `0`, `error_rate` `0.0`, `top_paths` `[]`
- Blank or whitespace-only lines → ignored (not malformed)
- Malformed entry (random text, missing status, missing quotes) → counted in `malformed_lines`, not raised
- Bytes field is `-` → treated as `0`
- Same IP many times → counted once in `unique_visitors`
- Ties in path counts → alphabetical order, so all languages agree
- Error rate with a repeating decimal (e.g. 1/3) → rounded to `33.33`
- All requests are errors → `error_rate` `100.0`

## Test Cases
| # | Input | Expected |
|---|---|---|
| 1 | Empty input | `total_requests: 0`, `error_rate: 0.0`, `top_paths: []` |
| 2 | One valid `200` line | `total_requests: 1`, `unique_visitors: 1`, `error_rate: 0.0` |
| 3 | 4 lines from 3 IPs (200, 404, 500, 200) | `total_requests: 4`, `unique_visitors: 3`, `error_count: 2`, `error_rate: 50.0` |
| 4 | 2 × `200` + 1 × `404` | `error_rate: 33.33` |
| 5 | 1 valid line + 2 garbage lines | `total_requests: 1`, `malformed_lines: 2` |
| 6 | Line with bytes `-` | `total_bytes` adds `0` |
| 7 | `/index.html` ×2, `/about` ×1, `/missing` ×1 | `top_paths`: `/index.html`(2), `/about`(1), `/missing`(1) |
| 8 | Only `404` and `500` lines | `error_rate: 100.0` |
| 9 | Blank and whitespace lines + 1 valid | `total_requests: 1`, `malformed_lines: 0` |
| 10 | Valid line parsed alone | `{ip, method: "GET", path: "/index.html", status: 200, bytes: 1024}` |

The Python reference implementation and its 14 unit tests are in `reference/`.
