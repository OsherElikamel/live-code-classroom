import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Card,
  CardActionArea,
  CardContent,
  Grid,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import CodeIcon from "@mui/icons-material/Code";
import TerminalIcon from "@mui/icons-material/Terminal";
import { fetchCodeBlocks } from "../services/codeBlocks.service";
import type { CodeBlock } from "../types";

const LobbyPage = () => {
  const [blocks, setBlocks] = useState<CodeBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const { data } = await fetchCodeBlocks();
        setBlocks(data);
      } catch {
        setError("Failed to load code blocks");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", px: { xs: 2, md: 3 }, py: 5, position: "relative", overflow: "hidden" }}>
      <Box
        sx={{
          position: "absolute",
          top: "10%",
          left: "20%",
          width: 260,
          height: 260,
          borderRadius: "50%",
          bgcolor: "primary.main",
          opacity: 0.05,
          filter: "blur(80px)",
        }}
      />
      <Stack sx={{ alignItems: "center", mb: 4, position: "relative" }}>
        <Box
          sx={{
            width: 52,
            height: 52,
            borderRadius: 3,
            bgcolor: "primary.main",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 2,
          }}
        >
          <TerminalIcon sx={{ color: "primary.contrastText", fontSize: 26 }} />
        </Box>
        <Typography variant="h4" gutterBottom align="center">
          Choose a Code Block
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          align="center"
        >
          Select an exercise to start coding. The first person in the room becomes
          the mentor.
        </Typography>
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Grid container spacing={2}>
          {[...Array(4)].map((_, i) => (
            <Grid size={{ xs: 12, sm: 6 }} key={i}>
              <Skeleton variant="rectangular" height={140} sx={{ borderRadius: 1.5 }} />
            </Grid>
          ))}
        </Grid>
      ) : blocks.length === 0 ? (
        <Alert severity="info">No code blocks available. Run the seed script to add some.</Alert>
      ) : (
        <Grid container spacing={2}>
          {blocks.map((block) => (
            <Grid size={{ xs: 12, sm: 6 }} key={block._id}>
              <Card
                sx={{
                  height: "100%",
                  transition: "transform 0.15s, border-color 0.15s",
                  "&:hover": {
                    transform: "translateY(-3px)",
                    borderColor: "primary.main",
                  },
                }}
              >
                <CardActionArea
                  onClick={() => navigate(`/code-block/${block._id}`)}
                  sx={{ height: "100%", p: 0 }}
                >
                  <CardContent>
                    <Stack sx={{ flexDirection: "row", alignItems: "center", gap: 1.5, mb: 1 }}>
                      <CodeIcon sx={{ color: "primary.main" }} />
                      <Typography variant="h6">{block.title}</Typography>
                    </Stack>
                    <Typography variant="body2" color="text.secondary">
                      {block.description}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default LobbyPage;
