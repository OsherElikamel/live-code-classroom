import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { io, type Socket } from "socket.io-client";
import confetti from "canvas-confetti";
import {
  Alert,
  Box,
  Button,
  Chip,
  IconButton,
  Skeleton,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PeopleIcon from "@mui/icons-material/People";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import CodeEditor from "../components/ui/CodeEditor";
import { fetchCodeBlockById } from "../services/codeBlocks.service";
import type { CodeBlock, Role } from "../types";

const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:3001";

const CodeRoomPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [codeBlock, setCodeBlock] = useState<CodeBlock | null>(null);
  const [code, setCode] = useState("");
  const [role, setRole] = useState<Role>(null);
  const [studentsCount, setStudentsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "warning";
  }>({ open: false, message: "", severity: "success" });

  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!id) return;

    const socket = io(SERVER_URL);
    socketRef.current = socket;

    socket.on("connect", () => {
      socket.emit("join-room", id);
    });

    socket.on("assign-role", (assignedRole: Role) => {
      setRole(assignedRole);
    });

    socket.on("code-update", (updatedCode: string) => {
      setCode(updatedCode);
    });

    socket.on("students-count", (count: number) => {
      setStudentsCount(count);
    });

    socket.on("mentor-left", () => {
      setSnackbar({
        open: true,
        message: "The mentor has left the session. Redirecting to lobby...",
        severity: "warning",
      });
      setTimeout(() => navigate("/"), 2500);
    });

    (async () => {
      try {
        const { data } = await fetchCodeBlockById(id);
        setCodeBlock(data);
        setCode(data.initialCode);
      } catch {
        setSnackbar({
          open: true,
          message: "Failed to load code block",
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
    })();

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [id, navigate]);

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    socketRef.current?.emit("code-update", newCode);
  };

  const fireConfetti = () => {
    const end = Date.now() + 1500;
    const frame = () => {
      confetti({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0, y: 0.7 } });
      confetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1, y: 0.7 } });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
  };

  const handleCheck = () => {
    if (!codeBlock?.solution) return;

    const normalize = (s: string) => s.trim().replace(/\s+/g, " ");

    if (normalize(code) === normalize(codeBlock.solution)) {
      setSnackbar({ open: true, message: "Correct solution! Great job!", severity: "success" });
      fireConfetti();
    } else {
      setSnackbar({ open: true, message: "Not quite right — keep trying!", severity: "error" });
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 3, flex: 1, display: "flex", flexDirection: "column" }}>
        <Skeleton height={40} width={200} sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" sx={{ flex: 1, borderRadius: 1.5 }} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        width: "100%",
        px: { xs: 2, md: 4 },
        py: 2,
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <Stack
        direction="row"
        alignItems="center"
        gap={1.5}
        flexWrap="wrap"
      >
        <IconButton onClick={() => navigate("/")} size="small">
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h6" fontWeight={700} sx={{ flex: 1, minWidth: 0 }}>
          {codeBlock?.title}
        </Typography>
        <Chip
          label={role === "mentor" ? "Mentor" : "Student"}
          color={role === "mentor" ? "warning" : "primary"}
          size="small"
          variant="outlined"
        />
        <Chip
          icon={<PeopleIcon />}
          label={`${studentsCount} student${studentsCount !== 1 ? "s" : ""}`}
          size="small"
          variant="outlined"
        />
      </Stack>

      {codeBlock?.description && (
        <Alert severity="info" sx={{ mt: 1.5 }}>
          {codeBlock.description}
        </Alert>
      )}

      {role === "mentor" && (
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
          You are the mentor — watching in read-only mode
        </Typography>
      )}

      {/* Editor */}
      <Box
        sx={{
          flex: 1,
          mt: 1.5,
          borderRadius: 1.5,
          overflow: "hidden",
          border: 2,
          borderColor: "primary.main",
          position: "relative",
          minHeight: 0,
        }}
      >
        <Box sx={{ position: "absolute", inset: 0 }}>
          <CodeEditor
            value={code}
            onChange={role === "student" ? handleCodeChange : undefined}
            readOnly={role !== "student"}
          />
        </Box>
      </Box>

      {/* Actions */}
      {role === "student" && (
        <Stack direction="row" gap={1.5} sx={{ mt: 1.5 }}>
          <Button
            variant="contained"
            startIcon={<CheckCircleOutlinedIcon />}
            onClick={handleCheck}
          >
            Check Solution
          </Button>
        </Stack>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CodeRoomPage;
