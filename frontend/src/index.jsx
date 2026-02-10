import React from "react";

import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";

import { store } from "@/store/store";
import { ToastProvider } from "@/context/ToastContext.jsx";
import MainApp from "@/MainApp.jsx";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ToastProvider>
          <MainApp />
        </ToastProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
