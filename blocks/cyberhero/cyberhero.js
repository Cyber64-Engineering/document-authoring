export default async function decorate(block) {

  const rootElement = document.createElement('div');
  rootElement.classList.add('cyberhero');
  const picture = block.querySelector('picture');
  const paragraphs = block.querySelectorAll('p');
  
  rootElement.append(picture);
      paragraphs.forEach(element => {
      if (element.value !== '') {
          rootElement.append(element);
      }
  });
  block.innerHTML = '';
  block.append(rootElement);

}
