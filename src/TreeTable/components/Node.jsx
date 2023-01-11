import { useState } from "react";
import { useCollapse } from "../state/use-collapse";
import { useFocus } from "../state/use-focus";
import { useStatus } from "../state/use-status";
import { useApi } from "../state/use-api";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteIcon from "@mui/icons-material/Delete";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import RemoveIcon from "@mui/icons-material/Remove";
import CommitSharpIcon from "@mui/icons-material/CommitSharp";
import RadioButtonUncheckedSharpIcon from "@mui/icons-material/RadioButtonUncheckedSharp";
import RadioButtonCheckedSharpIcon from "@mui/icons-material/RadioButtonCheckedSharp";

import {
  Stack,
  Popover,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  ListItemIcon
} from "@mui/material";
import Checkbox from "./Checkbox";
import Title from "./Title";

const Node = ({ node, isLeaf }) => {
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
          {isCollapsed ? <ExpandMoreIcon /> : <ExpandLessIcon />}
        </IconButton>
      )}
      <Title node={node} helpMode={false} />
      <Checkbox value={isCompleted} onChange={isLeaf ? toggleStatus : null} />
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
