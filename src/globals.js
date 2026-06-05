// F-2: expone en window lo que los módulos legacy esperaban del CDN UMD.
// Debe ejecutarse ANTES que cualquier js/*.jsx o data.js (ver orden en main.jsx).
import React from 'react';
import * as ReactDOMClient from 'react-dom/client';
import { createClient } from '@supabase/supabase-js';

window.React = React;
window.ReactDOM = ReactDOMClient;           // expone .createRoot (usado en app.jsx)
window.supabase = { createClient };          // data.js hace window.supabase.createClient(...)
