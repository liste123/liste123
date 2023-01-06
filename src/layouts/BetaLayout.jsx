import { Outlet } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { AppBar, Toolbar, Box, Typography, Stack } from "@mui/material";
import { withBetaAccount } from "../state/with-beta-account";
import { useBetaAccount } from "../state/use-beta-account";

const darkTheme = createTheme({
  palette: {
    mode: "dark"
  }
});

const BetaLayout = () => {
  const { accountID } = useBetaAccount();
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="fixed">
          <Toolbar variant="dense">
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Liste123{" "}
              <small style={{ fontWeight: "normal", fontSize: 10 }}>beta</small>
            </Typography>
            <Stack sx={{ fontSize: 14, alignItems: "flex-end" }}>
              <b>AccountID</b>
              <small>{accountID}</small>
            </Stack>
          </Toolbar>
        </AppBar>
        <Toolbar />
        <Outlet />
      </Box>
    </ThemeProvider>
  );
};

export default withBetaAccount(BetaLayout);
