import { Outlet } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { AppBar, Toolbar, Typography, Stack } from "@mui/material";

import { withBetaAccount } from "../state/with-beta-account";
import { useBetaAccount } from "../state/use-beta-account";

const darkTheme = createTheme({
  palette: {
    mode: "dark"
  }
});

const BetaPublicLayout = () => {
  const { accountID } = useBetaAccount();
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />

      <AppBar position="fixed">
        <Toolbar variant="dense">
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Liste123{" "}
            <small style={{ fontWeight: "normal", fontSize: 10 }}>beta</small>
          </Typography>
          {accountID && (
            <Stack sx={{ fontSize: 14, alignItems: "flex-end" }}>
              <b>AccountID</b>
              <small>{accountID}</small>
            </Stack>
          )}
        </Toolbar>
      </AppBar>
      <Toolbar />
      <Outlet />
    </ThemeProvider>
  );
};

export default withBetaAccount(BetaPublicLayout);
