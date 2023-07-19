import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter} from 'react-router-dom';

import 'css/index.css';
import App from './app';

class Main extends React.Component {
  render() {
    return (

      <BrowserRouter>
        <App></App>
      </BrowserRouter>
    );
  }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <Main />
);

