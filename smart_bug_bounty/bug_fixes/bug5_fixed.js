// Render a list of job titles as HTML and look up a job by id from the URL.

const jobs = [
  { id: 1, title: 'Junior AI Engineer' },
  { id: 2, title: '<b style="color:red">URGENT</b> Hiring now' },
  { id: 3, title: 'Data Analyst' },
];

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderJobs(list) {
  const items = list.map((job) => `<li>${escapeHtml(job.title)}</li>`);
  return `<ul>${items.join('')}</ul>`;
}

function findJob(list, idFromUrl) {
  const id = Number.parseInt(idFromUrl, 10);   // URL params are always strings
  if (!Number.isInteger(id)) return undefined;
  return list.find((job) => job.id === id);
}

if (require.main === module) {
  const params = new URLSearchParams('?id=2');
  console.log(renderJobs(jobs));
  console.log(findJob(jobs, params.get('id')));
}

module.exports = { renderJobs, findJob, escapeHtml };
