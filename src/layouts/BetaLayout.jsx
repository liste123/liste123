import { Outlet } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  Stack,
  Alert,
  AlertTitle,
  Button
} from "@mui/material";
import { withBetaAccount } from "../state/with-beta-account";
import { useBetaAccount } from "../state/use-beta-account";

const darkTheme = createTheme({
  palette: {
    // mode: "dark"
  }
});

const BetaLayout = () => {
  const { isLoading, accountID, error, resetAccount } = useBetaAccount();

  const renderError = () =>
    error && (
      <Box sx={{ m: 2 }}>
        <Alert
          severity="error"
          action={<Button onClick={resetAccount}>reset account</Button>}
        >
          <AlertTitle>Oooops!</AlertTitle>
          {error.message}
        </Alert>
      </Box>
    );

  const renderBody = () => (isLoading ? null : <Outlet />);

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
            {accountID && (
              <Stack sx={{ fontSize: 14, alignItems: "flex-end" }}>
                <b>AccountID</b>
                <small>{accountID}</small>
              </Stack>
            )}
          </Toolbar>
        </AppBar>
        <Toolbar />

        {renderError()}
        {renderBody()}
      </Box>
    </ThemeProvider>
  );
};

export default withBetaAccount(BetaLayout);
