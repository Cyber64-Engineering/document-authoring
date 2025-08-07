import { expect } from 'chai';
import { JSDOM } from 'jsdom';
import decorate from '../text.js'; // Adjust path as needed

describe('Text component test', () => {
  let dom;
  let document;
  let block;

  beforeEach(() => {
    dom = new JSDOM('<!DOCTYPE html><body></body>');
    document = dom.window.document;

    // Setup a fake block with some HTML content
    block = document.createElement('div');
    block.classList.add('size-18');
    block.innerHTML = `
      <h2>Title</h2>
      <p>Paragraph 1</p>
      <p></p> <!-- should be skipped -->
      <p>Paragraph 2</p>
    `;
  });

  it('wraps content in an article with class "text"', () => {
    decorate(block);
    const article = block.querySelector('article');

    expect(article).to.exist;
    expect(article.classList.contains('text')).to.be.true;
  });

  it('applies font size from class name', () => {
    decorate(block);
    const article = block.querySelector('article');
    expect(article.style.fontSize).to.equal('18px');
  });

  it('moves non-empty headings and paragraphs into the article', () => {
    decorate(block);
    const article = block.querySelector('article');
    const children = Array.from(article.children);

    expect(children.length).to.equal(3); // h2, p, p (skips empty one)
    expect(children[0].tagName).to.equal('H2');
    expect(children[0].textContent).to.equal('Title');
    expect(children[1].textContent).to.equal('Paragraph 1');
    expect(children[2].textContent).to.equal('Paragraph 2');
  });

  it('clears the original block before appending the new article', () => {
    decorate(block);
    expect(block.children.length).to.equal(1);
    expect(block.firstElementChild.tagName).to.equal('ARTICLE');
  });
});
