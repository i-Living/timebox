
import { render } from 'preact';
import { App } from './app';
import './index.css';

// Hide the static info section when PWA mounts (Google verifier can read it without JS)
document.documentElement.classList.add('js-loaded');

render(<App />, document.getElementById('app')!);
