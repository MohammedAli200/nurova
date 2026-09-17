<<<<<<< HEAD
import React from "react";
import ReactDOM from "react-dom/client";

import AppRoutes
  from "./routes/AppRoutes";

import {
  AuthProvider
} from "./contexts/AuthContext";

import "./styles/index.css";
import "./styles/claymorphism.css";

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  </React.StrictMode>
);
=======
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
>>>>>>> origin/feature/module-a-farha-backend-new
