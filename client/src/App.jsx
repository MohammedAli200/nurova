import { AuthProvider } from "./contexts/AuthContext";
import { ToastProvider } from "./contexts/ToastContext";
import AppRoutes from "./routes/AppRoutes";
import ClayBackground from "./components/ui/ClayBackground";

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <ClayBackground />
        <AppRoutes />
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;