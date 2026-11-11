// Determine whether a year is a leap year (Gregorian calendar).
// Rules: divisible by 4, except years divisible by 100,
// unless they are also divisible by 400.

function isLeapYear(year) {
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 !== 0);
}

const tests = [
  { year: 2024, expected: true },
  { year: 2023, expected: false },
  { year: 1900, expected: false },
  { year: 2000, expected: true },
];

for (const { year, expected } of tests) {
  const result = isLeapYear(year);
  const status = result === expected ? 'PASS' : 'FAIL';
  console.log(`${status} ${year}: got ${result}, expected ${expected}`);
}
