import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { AuthProvider } from "./context/AuthContext.jsx";
import { StoreProvider } from "./context/StoreContext.jsx";
import { ListingsProvider } from "./context/ListingsContext.jsx";
import { ChatProvider } from "./context/ChatContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <StoreProvider>
        <ListingsProvider>
          <ChatProvider>
            <App />
          </ChatProvider>
        </ListingsProvider>
      </StoreProvider>
    </AuthProvider>
  </React.StrictMode>
);

