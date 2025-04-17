// common/ui-controls.js
// This file can include common UI helper functions across your simulation pages.
function createButton(text, onClick) {
    const btn = document.createElement('button');
    btn.innerText = text;
    btn.onclick = onClick;
    return btn;
  }
  