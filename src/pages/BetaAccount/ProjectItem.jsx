import { formatDistance } from "date-fns";
import { Link } from "react-router-dom";
import {
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  Stack,
  Alert,
  IconButton
} from "@mui/material";
import WorkIcon from "@mui/icons-material/Work";
import DeleteIcon from "@mui/icons-material/Delete";

export const ProjectItem = ({ project, showOwner, onDeleteRequest }) => {
  const { uuid: projectId, title, uname, updated_at } = project;

  const formatDate = (_date) => {
    if (!_date) return "n/a";
    try {
      return formatDistance(new Date(_date), new Date(), { addSuffix: true });
    } catch (err) {
      console.log(err.message, _date);
    }
  };

  const handleDelete = (evt) => {
    evt.preventDefault();
    evt.stopPropagation();
    if (confirm("Sure?")) {
      onDeleteRequest(projectId);
    }
  };
  const handleDeleteForced = (evt) => {
    evt.preventDefault();
    evt.stopPropagation();
    onDeleteRequest(projectId);
  };

  // Project Not Found
  if (!updated_at)
    return (
      <ListItem>
        <Alert severity="warning" sx={{ flex: 1 }} onClose={handleDeleteForced}>
          {"404 - Project not found"}
        </Alert>
      </ListItem>
    );

  return (
    <ListItem
      to={projectId}
      component={Link}
      secondaryAction={
        onDeleteRequest && (
          <IconButton edge="end" onClick={handleDelete}>
            <DeleteIcon />
          </IconButton>
        )
      }
    >
      <ListItemAvatar>
        <Avatar>
          <WorkIcon />
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={title}
        primaryTypographyProps={{
          color: (theme) =>
            theme.palette.getContrastText(theme.palette.background.default)
        }}
        secondary={
          <Stack component="span">
            {showOwner && (
              <Typography component="span">
                shared by: <i>{uname}</i>
              </Typography>
            )}
            <Typography component="span">
              last updated: <i>{formatDate(updated_at)}</i>
            </Typography>
          </Stack>
        }
      />
    </ListItem>
  );
};
