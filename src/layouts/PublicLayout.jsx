import { Outlet } from "react-router-dom";
import { AppBar, Toolbar, Box, Stack, Typography, Button } from "@mui/material";
import { usePubSub } from "../utils/use-pubsub";

const PublicLayout = () => {
  const { publish } = usePubSub();

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed">
        <Toolbar variant="dense">
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Liste123
          </Typography>
          <Stack direction="row" spacing={1}>
            <Button color="inherit" component="label">
              Import
              <input
                type="file"
                hidden
                onChange={(evt) => publish("import::file", evt)}
              />
            </Button>
            <Button color="inherit" onClick={() => publish("export::json")}>
              Download
            </Button>
            <Button
              color="inherit"
              onClick={() => publish("export::clipboard")}
            >
              Copy
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>
      <Toolbar />
      <Outlet />
    </Box>
  );
};

export default PublicLayout;
