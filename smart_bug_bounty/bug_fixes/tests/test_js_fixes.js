const test = require('node:test');
const assert = require('node:assert');
const { notifyAll } = require('../bug2_fixed');
const { renderJobs, findJob } = require('../bug5_fixed');

const jobs = [{ id: 1, title: 'A' }, { id: 2, title: '<img src=x onerror="alert(1)">' }];

test('bug2: counts all sent emails after they finish', async () => {
  assert.strictEqual(await notifyAll([{ email: 'a' }, { email: 'b' }, { email: 'c' }]), 'Sent 3 emails');
});
test('bug2: empty list', async () => {
  assert.strictEqual(await notifyAll([]), 'Sent 0 emails');
});
test('bug5: titles are HTML-escaped (no XSS)', () => {
  const html = renderJobs(jobs);
  assert.ok(!html.includes('<img'));
  assert.ok(html.includes('&lt;img src=x onerror=&quot;alert(1)&quot;&gt;'));
});
test('bug5: string id from URL finds the job', () => {
  assert.strictEqual(findJob(jobs, '2').id, 2);
});
test('bug5: invalid id returns undefined', () => {
  assert.strictEqual(findJob(jobs, 'abc'), undefined);
  assert.strictEqual(findJob(jobs, '99'), undefined);
});
