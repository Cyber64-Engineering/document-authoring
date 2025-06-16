import htm, { h, render } from 'preact';
import { Clock } from './clock.js';

const html = htm.bind(h);

export default async function decorate(block) {
  render(html`<${Clock} />`, block);
}
