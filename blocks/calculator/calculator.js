import { h, render } from 'https://esm.sh/preact';
import htm from 'https://esm.sh/htm';
import { Clock } from './clock.js';

const html = htm.bind(h);

export default async function decorate(block) {    
    render(html`<${Clock} />`, block);
}
