import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Stack,
  Box,
  Alert,
  AlertTitle,
  Button,
  Popover,
  List,
  ListItem,
  ListItemText,
  IconButton
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import QrCode2Icon from "@mui/icons-material/QrCode2";
import { QRCode } from "react-qrcode-logo";

import { useBetaAccount } from "../state/use-beta-account";
import { useBetaProject } from "../state/use-beta-project";
import { useClipboard } from "../utils/use-clipboard";
import BetaPage from "../components/BetaPage";
import AddTask from "../components/AddTask";
import TreeTable from "../TreeTable";

const BetaProject = () => {
  const { clip } = useClipboard();
  const [projectMenu, setProjectMenu] = useState(null);
  const treeTableRef = useRef();
  const { uname } = useBetaAccount();
  const { loading, error, uuid, title, data, update, projectID, projectURL } =
    useBetaProject();

  const [src, setSrc] = useState(JSON.stringify(data, null, 2));
  useEffect(() => {
    setSrc(JSON.stringify(data, null, 2));
  }, [data]);

  if (loading) {
    return <BetaPage>loading project...</BetaPage>;
  }

  const onChange = (data) => update(title, data);

  const renderError = () => (
    <Box sx={{ m: 2 }}>
      <Alert
        severity="error"
        action={
          <Button component={Link} to={`/beta/${uname}`}>
            close
          </Button>
        }
      >
        <AlertTitle>Oooops!</AlertTitle>
        {error.message}
      </Alert>
    </Box>
  );

  const renderBody = () => (
    <Stack spacing={2}>
      <AddTask
        placeholder={"(Ctrl + P) Prepend a new item"}
        shortcut={"Ctrl + p"}
        onSubmit={(title) =>
          treeTableRef.current.prepend({
            title
          })
        }
      />

      <TreeTable ref={treeTableRef} data={data} onChange={onChange} />

      <AddTask
        placeholder={"(Ctrl + A) Append a new item"}
        shortcut={"Ctrl + a"}
        onSubmit={(title) =>
          treeTableRef.current.append({
            title
          })
        }
      />
    </Stack>
  );

  return (
    <BetaPage
      title={title}
      subtitle={`ID: ${uuid}`}
      linkCloseTo={`/beta/${uname}`}
      actionsLeft={
        <IconButton
          edge="end"
          aria-label="delete"
          onClick={(e) => setProjectMenu(e.currentTarget)}
        >
          <QrCode2Icon />
        </IconButton>
      }
    >
      {error ? renderError() : renderBody()}

      <Popover
        open={Boolean(projectMenu)}
        anchorEl={projectMenu}
        onClose={() => setProjectMenu(null)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left"
        }}
      >
        <List>
          <ListItem
            secondaryAction={
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={() => clip(accountID)}
              >
                <ContentCopyIcon />
              </IconButton>
            }
          >
            <ListItemText
              primary="ProjectID"
              secondary={
                <span onClick={() => clip(projectID)}>{projectID}</span>
              }
            />
          </ListItem>
          <ListItem
            secondaryAction={
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={() => clip(projectURL)}
              >
                <ContentCopyIcon />
              </IconButton>
            }
          >
            <ListItemText
              primary="Share via url:"
              secondary={
                <a href={projectURL} target="_blank" style={{ color: "white" }}>
                  Open in New Tab
                </a>
              }
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Share via QRCode:"
              secondary={<QRCode value={projectURL} size={180} />}
            />
          </ListItem>
        </List>
      </Popover>
    </BetaPage>
  );
};

export default BetaProject;
