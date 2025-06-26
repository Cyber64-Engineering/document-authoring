import { h, render } from 'https://esm.sh/preact';
import htm from 'https://esm.sh/htm';
import { renderContentBasedOnBlock } from '../../scripts/preactHelpers.js';
import HeroCarousel from './components/HeroCarousel.js';

const html = htm.bind(h);

export default async function decorate(block) {
  const content = renderContentBasedOnBlock(block);
  block.innerHTML = '';
  render(html`<${HeroCarousel} content=${content} />`, block);
}
