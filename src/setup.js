// Bootstrap: expose React on window BEFORE the legacy IIFE modules run.
// The view modules reference global `React`/`ReactDOM` and attach components to
// window (e.g. window.Puente). This file MUST be imported first in main.jsx.
import React from 'react';
import * as ReactDOMClient from 'react-dom/client';

window.React = React;
window.ReactDOM = ReactDOMClient;
