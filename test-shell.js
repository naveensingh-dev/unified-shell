const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');

const dom = new JSDOM('<!DOCTYPE html><html><body><app-shell-root></app-shell-root></body></html>', {
  runScripts: "dangerously",
  resources: "usable"
});

global.window = dom.window;
global.document = dom.window.document;
global.navigator = dom.window.navigator;

const bundlePath = path.join(__dirname, 'dist/unified-shell/browser/main.js');

try {
  const code = fs.readFileSync(bundlePath, 'utf8');
  dom.window.eval(code);
  setTimeout(() => {
    console.log("SUCCESS: Shell booted. HTML:", dom.window.document.body.innerHTML);
    process.exit(0);
  }, 500);
} catch (e) {
  console.error("RUNTIME ERROR:", e.message);
  process.exit(1);
}
