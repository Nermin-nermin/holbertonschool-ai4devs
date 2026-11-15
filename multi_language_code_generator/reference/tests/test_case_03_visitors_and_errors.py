import os
import sys
import unittest

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))
from log_analyzer import analyze, parse_line  # noqa: E402,F401

OK = '192.168.1.10 - - [15/Nov/2026:10:00:00 +0400] "GET /index.html HTTP/1.1" 200 1024'
NOT_FOUND = '192.168.1.11 - - [15/Nov/2026:10:00:05 +0400] "GET /missing HTTP/1.1" 404 512'
SERVER_ERR = '10.0.0.5 - - [15/Nov/2026:10:01:00 +0400] "POST /api/login HTTP/1.1" 500 -'
SAME_IP = '192.168.1.10 - - [15/Nov/2026:10:02:00 +0400] "GET /about HTTP/1.1" 200 2048'


class TestCase03(unittest.TestCase):
    """Spec test case 3: visitors and errors."""

    def test_case(self):
        result = analyze([OK, NOT_FOUND, SERVER_ERR, SAME_IP])
        self.assertEqual(result['total_requests'], 4)
        self.assertEqual(result['unique_visitors'], 3)
        self.assertEqual(result['error_count'], 2)
        self.assertEqual(result['error_rate'], 50.0)


if __name__ == "__main__":
    unittest.main()
