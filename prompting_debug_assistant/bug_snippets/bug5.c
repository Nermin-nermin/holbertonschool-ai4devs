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
	return (passed / total * 100);
}

/**
 * main - print the pass rate for a few classes
 *
 * Return: Always 0
 */
int main(void)
{
	printf("Class A: %.1f%%\n", pass_rate(29, 40));  /* expected 72.5 */
	printf("Class B: %.1f%%\n", pass_rate(18, 24));  /* expected 75.0 */
	printf("Class C: %.1f%%\n", pass_rate(30, 30));  /* expected 100.0 */
	return (0);
}
