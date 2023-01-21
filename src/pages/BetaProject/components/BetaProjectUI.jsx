import { useRef } from "react";

import { QRCode } from "react-qrcode-logo";
import {
  Stack,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton
} from "@mui/material";

import ContentCopyIcon from "@mui/icons-material/ContentCopy";

import { useClipboard } from "../../../utils/use-clipboard";
import BetaPage from "../../../components/BetaPage";
import AddTask from "../../../components/AddTask";
import TreeTable from "../TreeTable";

/**
 *
 * @param {*} param0
 * @returns
 */
export const BetaProjectUI = ({ projectData, onTreeTableChange }) => {
  const { clip } = useClipboard();
  const treeTableRef = useRef(null);
  const { uuid: projectID, title } = projectData;

  const shareProjectURL = `${window.location.origin}/beta/@me/import?projectID=${projectID}`;

  return (
    <BetaPage
      title={title}
      subtitle={`Shall be completed when...`}
      linkBackTo={`/beta/@me`}
      menu={({ closeMenu }) => (
        <List>
          <ListItem
            secondaryAction={
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={() => clip(projectID)}
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
                onClick={() => clip(shareProjectURL)}
              >
                <ContentCopyIcon />
              </IconButton>
            }
          >
            <ListItemText
              primary="Share via url:"
              secondary={
                <a
                  href={shareProjectURL}
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
              secondary={<QRCode value={shareProjectURL} size={180} />}
            />
          </ListItem>
          <ListItem>
            <Button
              fullWidth
              onClick={() => {
                treeTableRef.current.showEditor();
                closeMenu();
              }}
            >
              Edit Source Code
            </Button>
          </ListItem>
        </List>
      )}
    >
      <Stack spacing={2} flex={1}>
        <AddTask
          placeholder={"(Ctrl + P) Prepend a new item"}
          shortcut={"Ctrl + p"}
          onSubmit={(title) =>
            treeTableRef.current.prependNode({
              title
            })
          }
        />
        <TreeTable
          ref={treeTableRef}
          etag={projectData.etag}
          value={projectData.data}
          onChange={onTreeTableChange}
        />
        <AddTask
          placeholder={"(Ctrl + A) Append a new item"}
          shortcut={"Ctrl + a"}
          onSubmit={(title) =>
            treeTableRef.current.appendNode({
              title
            })
          }
        />
      </Stack>
    </BetaPage>
  );
};
