import { NextUIProvider } from "@nextui-org/react";

import React from 'react'
import ReactDOM from 'react-dom/client'

import App from "./app";

import './index.scss'

ReactDOM.createRoot( document.getElementById( 'root' )! ).render(
    <React.StrictMode>
        <NextUIProvider>
            <App/>
        </NextUIProvider>
    </React.StrictMode>,
);
