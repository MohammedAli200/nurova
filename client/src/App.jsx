<<<<<<< HEAD
import { AuthProvider } from "./contexts/AuthContext";
import { ToastProvider } from "./contexts/ToastContext";
import AppRoutes from "./routes/AppRoutes";
import ClayBackground from "./components/ui/ClayBackground";
=======
import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { AppRoutes } from './routes/AppRoutes';
>>>>>>> origin/feature/module-a-farha-backend-new

function App() {
  return (
    <AuthProvider>
<<<<<<< HEAD
      <ToastProvider>
        <ClayBackground />
        <AppRoutes />
      </ToastProvider>
=======
      <AppRoutes />
>>>>>>> origin/feature/module-a-farha-backend-new
    </AuthProvider>
  );
}

<<<<<<< HEAD
export default App;
=======
export default App;
>>>>>>> origin/feature/module-a-farha-backend-new
