import { useState } from "react";
import { useClipboard } from "../../utils/use-clipboard";
import { useCollapse } from "../state/use-collapse";
import { useFocus } from "../state/use-focus";
import { useStatus } from "../state/use-status";
import { useApi } from "../state/use-api";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteIcon from "@mui/icons-material/Delete";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PlaylistAddSharpIcon from "@mui/icons-material/PlaylistAddSharp";
import PlaylistPlaySharpIcon from "@mui/icons-material/PlaylistPlaySharp";
import RadioButtonUncheckedSharpIcon from "@mui/icons-material/RadioButtonUncheckedSharp";
import RadioButtonCheckedSharpIcon from "@mui/icons-material/RadioButtonCheckedSharp";
import ExpandCircleDownSharpIcon from "@mui/icons-material/ExpandCircleDownSharp";
import LabelSharpIcon from "@mui/icons-material/LabelSharp";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

import {
  Stack,
  Popover,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  ListItemIcon,
  Divider,
  Chip
} from "@mui/material";
import Checkbox from "./Checkbox";
import Title from "./Title";

const Node = ({ node, isLeaf }) => {
  const { clip } = useClipboard();
  const [chipRef, setChipRef] = useState(null);
  const [menuTarget, setMenuTarget] = useState(null);
  const { hasFocus, requestFocus } = useFocus(node);
  const { isCollapsed, toggleCollapse } = useCollapse(node);
  const { isCompleted, toggleStatus } = useStatus(node);
  const api = useApi();

  const handleDelete = (e) => {
    if (confirm("Sure?")) {
      api.requestDelete(node.id);
    }
  };

  const handleAddAfter = () => {
    setMenuTarget(null);
    api.appendAfter(node.id, {});
  };

  const handleAddInto = () => {
    setMenuTarget(null);
    api.appendInto(node.id, {});
  };

  return (
    <Stack
      direction={"row"}
      spacing={1}
      onClick={requestFocus}
      alignItems={"center"}
      className={[
        "treetable-item",
        "treetable-item-node",
        ...[hasFocus ? "treetable-item-focus" : null]
      ].join(" ")}
    >
      {isLeaf ? (
        <IconButton onClick={(e) => toggleStatus(e, !isCompleted)}>
          {isCompleted ? (
            <RadioButtonCheckedSharpIcon />
          ) : (
            <RadioButtonUncheckedSharpIcon />
          )}
        </IconButton>
      ) : (
        <IconButton onClick={toggleCollapse}>
          {isCollapsed ? (
            isCompleted ? (
              <ExpandCircleDownSharpIcon />
            ) : (
              <ExpandMoreIcon />
            )
          ) : isCompleted ? (
            <ExpandCircleDownSharpIcon sx={{ transform: "rotate(180deg)" }} />
          ) : (
            <ExpandLessIcon />
          )}
        </IconButton>
      )}
      <Title node={node} helpMode={false} />
      {/* <Checkbox value={isCompleted} onChange={isLeaf ? toggleStatus : null} /> */}
      <Chip
        label={node.id.slice(-3).toUpperCase()}
        variant="outlined"
        size="small"
        icon={<LabelSharpIcon />}
        onClick={(evt) => setChipRef(evt.currentTarget)}
      />
      <Popover
        open={Boolean(chipRef)}
        anchorEl={chipRef}
        onClose={() => setChipRef(null)}
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
                onClick={() => clip(node.id)}
              >
                <ContentCopyIcon />
              </IconButton>
            }
          >
            <ListItemText
              primary="TaskID"
              secondary={<span onClick={() => clip(node.id)}>{node.id}</span>}
            />
          </ListItem>
        </List>
      </Popover>
      <IconButton
        size={"small"}
        onClick={(e) => setMenuTarget(e.currentTarget)}
      >
        <MoreVertIcon />
      </IconButton>
      <Popover
        open={Boolean(menuTarget)}
        anchorEl={menuTarget}
        onClose={() => setMenuTarget(null)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left"
        }}
      >
        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={handleAddAfter}>
              <ListItemIcon>
                <PlaylistAddSharpIcon />
              </ListItemIcon>
              <ListItemText primary="New task after" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={handleAddInto}>
              <ListItemIcon>
                <PlaylistPlaySharpIcon />
              </ListItemIcon>
              <ListItemText primary="New task inside" />
            </ListItemButton>
          </ListItem>
          <Divider />
          <ListItem disablePadding>
            <ListItemButton onClick={handleDelete}>
              <ListItemIcon>
                <DeleteIcon />
              </ListItemIcon>
              <ListItemText primary="Delete Item" />
            </ListItemButton>
          </ListItem>
        </List>
      </Popover>
    </Stack>
  );
};

export default Node;
