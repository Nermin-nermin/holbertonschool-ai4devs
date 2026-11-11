#include <stdio.h>
#include <math.h>

/**
 * pass_rate - compute the percentage of students who passed
 * @passed: number of students who passed
 * @total: total number of students
 *
 * Return: pass rate as a percentage (e.g. 72.5)
 */
double pass_rate(int passed, int total)
{
	if (total == 0)
		return (0.0);
	return ((double)passed / total * 100);
}

/**
 * check - print one test case and whether it passed
 * @passed: number of students who passed
 * @total: total number of students
 * @expected: expected percentage
 *
 * Return: 1 if the test passed, 0 otherwise
 */
int check(int passed, int total, double expected)
{
	double got = pass_rate(passed, total);
	int ok = fabs(got - expected) < 1e-9;

	printf("pass_rate(%d, %d) = %.1f%% (expected %.1f%%) %s\n",
	       passed, total, got, expected, ok ? "PASS" : "FAIL");
	return (ok);
}

/**
 * main - run the pass rate test cases
 *
 * Return: 0 if all tests pass, 1 otherwise
 */
int main(void)
{
	int ok = 1;

	ok &= check(29, 40, 72.5);
	ok &= check(18, 24, 75.0);
	ok &= check(30, 30, 100.0);
	ok &= check(0, 25, 0.0);
	ok &= check(5, 0, 0.0);
	printf("%s\n", ok ? "All tests passed" : "Some tests FAILED");
	return (ok ? 0 : 1);
}
