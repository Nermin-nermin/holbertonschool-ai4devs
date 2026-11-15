// Render a list of job titles as HTML and look up a job by id from the URL.
// Expected: titles are shown as text, and ?id=2 finds the job with id 2.

const jobs = [
  { id: 1, title: 'Junior AI Engineer' },
  { id: 2, title: '<img src=x onerror="alert(document.cookie)">' },
  { id: 3, title: 'Data Analyst' },
];

function renderJobs(list) {
  let html = '<ul>';
  for (var i = 0; i < list.length; i++) {
    html += '<li>' + list[i].title + '</li>';
  }
  return html + '</ul>';
}

function findJob(list, idFromUrl) {
  return list.find((job) => job.id === idFromUrl);
}

const params = new URLSearchParams('?id=2');
console.log(renderJobs(jobs));
console.log(findJob(jobs, params.get('id')));   // expected the job with id 2

module.exports = { renderJobs, findJob };
