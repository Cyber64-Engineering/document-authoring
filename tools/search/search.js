import { crawl } from 'https://da.live/nx/public/utils/tree.js';

const PATH = '/cyber64-engineering/document-authoring';

(async function init() {
  // Create cancel button
  const button = document.createElement('button');
  button.innerText = 'Cancel';
  document.body.append(button);

  // Create the callback to fire when a file is returned
  const callback = (file) => {
    button.insertAdjacentHTML('afterend', `${file.path}`);
  }

  // Start the crawl
  const { results, getDuration, cancelCrawl } = crawl({ path: PATH, callback, throttle: 10 });

  // Asign the cancel button the cancel event
  button.addEventListener('click', cancelCrawl);

  // Await the results to finish
  await results;

  // Add the duration after the results are finished
  button.insertAdjacentHTML('beforebegin', `

${getDuration()}

`);
}());