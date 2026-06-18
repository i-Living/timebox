// Apply saved theme before render to avoid flash
(function initTheme() {
  const saved = localStorage.getItem('timebox_theme');
  if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.dataset.theme = 'dark';
  }
})();

import { render } from 'preact';
import { App } from './app';
import './index.css';

render(<App />, document.getElementById('app')!);
