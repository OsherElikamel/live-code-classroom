import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";
import AppShell from "../components/layout/AppShell";
import LobbyPage from "../pages/LobbyPage";

// The code room pulls in the Monaco wrapper, socket.io client, and
// confetti — split it so the lobby doesn't pay for any of that.
const CodeRoomPage = lazy(() => import("../pages/CodeRoomPage"));

const pageFallback = (
  <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
    <CircularProgress />
  </Box>
);

const AppRoutes = () => (
  <Routes>
    <Route element={<AppShell />}>
      <Route path="/" element={<LobbyPage />} />
      <Route
        path="/code-block/:id"
        element={
          <Suspense fallback={pageFallback}>
            <CodeRoomPage />
          </Suspense>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Route>
  </Routes>
);

export default AppRoutes;
