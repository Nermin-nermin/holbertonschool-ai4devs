"""Reference implementation of the Log Analyzer (see cross_language_spec.md).

Parses Apache Common Log Format lines and computes summary statistics.
Pure Python, standard library only, so it can be ported line by line.
"""
import json
import re
import sys

# host ident authuser [date] "METHOD path PROTOCOL" status bytes
LOG_PATTERN = re.compile(
    r'^(?P<ip>\S+) \S+ \S+ \[(?P<time>[^\]]+)\] '
    r'"(?P<method>[A-Z]+) (?P<path>\S+) [^"]*" '
    r'(?P<status>\d{3}) (?P<size>\d+|-)$'
)


def parse_line(line):
    """Return a dict for a valid log line, or None if the line is malformed."""
    match = LOG_PATTERN.match(line.strip())
    if not match:
        return None
    size = match.group("size")
    return {
        "ip": match.group("ip"),
        "method": match.group("method"),
        "path": match.group("path"),
        "status": int(match.group("status")),
        "bytes": 0 if size == "-" else int(size),
    }


def analyze(lines):
    """Compute statistics for an iterable of log lines.

    Blank lines are ignored. Malformed lines are counted, not raised.
    """
    total = 0
    errors = 0
    malformed = 0
    total_bytes = 0
    visitors = set()
    status_counts = {}
    path_counts = {}

    for raw in lines:
        if not raw.strip():
            continue
        entry = parse_line(raw)
        if entry is None:
            malformed += 1
            continue
        total += 1
        visitors.add(entry["ip"])
        total_bytes += entry["bytes"]
        if entry["status"] >= 400:
            errors += 1
        status = str(entry["status"])
        status_counts[status] = status_counts.get(status, 0) + 1
        path_counts[entry["path"]] = path_counts.get(entry["path"], 0) + 1

    # Ties are broken alphabetically so every language gives the same order.
    top_paths = sorted(path_counts.items(), key=lambda item: (-item[1], item[0]))[:3]

    return {
        "total_requests": total,
        "unique_visitors": len(visitors),
        "error_count": errors,
        "error_rate": round(errors / total * 100, 2) if total else 0.0,
        "total_bytes": total_bytes,
        "status_counts": dict(sorted(status_counts.items())),
        "top_paths": [{"path": p, "count": c} for p, c in top_paths],
        "malformed_lines": malformed,
    }


def main(argv):
    if len(argv) != 2:
        print("Usage: python log_analyzer.py <logfile>", file=sys.stderr)
        return 1
    with open(argv[1], encoding="utf-8") as handle:
        print(json.dumps(analyze(handle), indent=2))
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
