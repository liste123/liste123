import { useState } from "react";
import { Outlet } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import {
  AppBar,
  Toolbar,
  Typography,
  Stack,
  Popover,
  List,
  ListItem,
  ListItemText
} from "@mui/material";
import { QRCode } from "react-qrcode-logo";

import { withBetaAccount } from "../state/with-beta-account";
import { useBetaAccount } from "../state/use-beta-account";

const darkTheme = createTheme({
  palette: {
    mode: "dark"
  }
});

const BetaPublicLayout = () => {
  const [accountMenu, setAccountMenu] = useState(null);
  const { uname, accountID, accountURL } = useBetaAccount();

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />

      <AppBar position="fixed">
        <Toolbar variant="dense">
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Liste123{" "}
            <small style={{ fontWeight: "normal", fontSize: 10 }}>beta</small>
          </Typography>
          {uname && (
            <>
              <Stack
                sx={{ fontSize: 14, alignItems: "flex-end" }}
                onClick={(e) => setAccountMenu(e.currentTarget)}
              >
                <b>AccountID</b>
                <small>{uname}</small>
              </Stack>
              <Popover
                open={Boolean(accountMenu)}
                anchorEl={accountMenu}
                onClose={() => setAccountMenu(null)}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left"
                }}
              >
                <List>
                  <ListItem>
                    <ListItemText primary="AccountID" secondary={accountID} />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Share via url:"
                      secondary={
                        <a
                          href={accountURL}
                          target="_blank"
                          style={{ color: "white" }}
                        >
                          Open in New Tab
                        </a>
                      }
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Share via QRCode:"
                      secondary={<QRCode value={accountURL} />}
                    />
                  </ListItem>
                </List>
              </Popover>
            </>
          )}
        </Toolbar>
      </AppBar>
      <Toolbar />
      <Outlet />
    </ThemeProvider>
  );
};

export default withBetaAccount(BetaPublicLayout);
