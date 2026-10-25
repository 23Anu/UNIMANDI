import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "./context/AuthContext.jsx";
import { StoreProvider } from "./context/StoreContext.jsx";
import { ListingsProvider } from "./context/ListingsContext.jsx";
import { ChatProvider } from "./context/ChatContext.jsx";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <StoreProvider>
          <ListingsProvider>
            <ChatProvider>
              <App />
            </ChatProvider>
          </ListingsProvider>
        </StoreProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
