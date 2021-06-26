import React from 'react';
import ReactDOM from 'react-dom';
import './css/index.css';
import App from './components/App';

if (module.hot) {
    // Accept hot update
    module.hot.accept();
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
