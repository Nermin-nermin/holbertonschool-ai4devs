#include <stdio.h>

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
 * main - test pass_rate with known inputs
 *
 * Return: 0 if all tests pass, 1 otherwise
 */
int main(void)
{
	int passed[] = {29, 18, 30, 0, 5}, total[] = {40, 24, 30, 25, 0};
	double expected[] = {72.5, 75.0, 100.0, 0.0, 0.0}, got;
	int i, ok = 1;

	for (i = 0; i < 5; i++)
	{
		got = pass_rate(passed[i], total[i]);
		printf("pass_rate(%d, %d) = %.1f%% (expected %.1f%%) %s\n", passed[i],
		       total[i], got, expected[i], got == expected[i] ? "PASS" : "FAIL");
		if (got != expected[i])
			ok = 0;
	}
	printf("%s\n", ok ? "All tests passed" : "Some tests FAILED");
	return (ok ? 0 : 1);
}
