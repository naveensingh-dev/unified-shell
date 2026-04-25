const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');

const dom = new JSDOM(`<!DOCTYPE html><html><head></head><body><app-root></app-root></body></html>`, {
  runScripts: "dangerously",
  resources: "usable"
});

// Polyfills for browser environment
global.window = dom.window;
global.document = dom.window.document;
global.navigator = dom.window.navigator;

const mainPath = path.join(__dirname, 'dist/unified-shell/browser/main.js');
const polyfillsPath = path.join(__dirname, 'dist/unified-shell/browser/polyfills.js');

try {
  if (fs.existsSync(polyfillsPath)) {
      dom.window.eval(fs.readFileSync(polyfillsPath, 'utf8'));
  }
  dom.window.eval(fs.readFileSync(mainPath, 'utf8'));
  
  setTimeout(() => {
    console.log("App HTML:", dom.window.document.body.innerHTML);
  }, 1000);
} catch (e) {
  console.error("Runtime Error Caught:", e);
}
