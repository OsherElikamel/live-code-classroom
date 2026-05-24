import { Routes, Route, Navigate } from "react-router-dom";
import AppShell from "../components/layout/AppShell";
import LobbyPage from "../pages/LobbyPage";
import CodeRoomPage from "../pages/CodeRoomPage";

const AppRoutes = () => (
  <Routes>
    <Route element={<AppShell />}>
      <Route path="/" element={<LobbyPage />} />
      <Route path="/code-block/:id" element={<CodeRoomPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Route>
  </Routes>
);

export default AppRoutes;
