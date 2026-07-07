import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import ErrorBoundary from "./components/ui/ErrorBoundary";
import AppRoutes from "./routes/AppRoutes";

const App = () => (
  <ThemeProvider>
    <ErrorBoundary>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ErrorBoundary>
  </ThemeProvider>
);

export default App;
