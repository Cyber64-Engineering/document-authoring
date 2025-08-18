export default function decorate(block) {
  const rootElement = document.createElement('article');
  rootElement.classList.add('text');

  const classes = Array.from(block.classList);
  classes.forEach((className) => {
    if (className.startsWith('size-')) {
      const size = className.split('size-')[1];
      rootElement.style.fontSize = `${size}px`;
    }
  });

  const paragraphs = block.querySelectorAll('p, h1, h2, h3, h4, h5, h6');
  paragraphs.forEach((element) => {
    if (element.textContent.trim() !== '') {
      rootElement.append(element);
    }
  });

  block.innerHTML = '';
  block.append(rootElement);
}
