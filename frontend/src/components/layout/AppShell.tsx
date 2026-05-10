import { AppBar, Box, IconButton, Toolbar, Typography } from "@mui/material";
import TerminalIcon from "@mui/icons-material/Terminal";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { Outlet } from "react-router-dom";
import { useThemeMode } from "../../contexts/ThemeContext";

const AppShell = () => {
  const { mode, toggle } = useThemeMode();

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{ borderBottom: 1, borderColor: "divider" }}
      >
        <Toolbar variant="dense">
          <TerminalIcon sx={{ mr: 1.5 }} />
          <Typography variant="subtitle1" fontWeight={600} sx={{ flexGrow: 1 }}>
            Live Code Classroom
          </Typography>
          <IconButton color="inherit" onClick={toggle}>
            {mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default AppShell;
