import { JSDOM } from 'jsdom';

const dom = new JSDOM('<!doctype html><html><body></body></html>');

// Set up global DOM globals
global.window = dom.window;
global.document = dom.window.document;
global.Node = dom.window.Node;
global.HTMLElement = dom.window.HTMLElement;
global.navigator = {
  userAgent: 'node.js',
};

// Optional: make global access easier
Object.keys(dom.window).forEach((key) => {
  if (!(key in global)) {
    global[key] = dom.window[key];
  }
});
