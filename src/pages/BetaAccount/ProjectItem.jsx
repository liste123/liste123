import { gql, useQuery } from "@apollo/client";
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

const GET_PROJECT = gql`
  query GetProjectIndex($projectId: String!) {
    projects: beta_get_project(args: { uuid: $projectId }) {
      updated_at
      title
      uname
      uuid
    }
  }
`;

export const ProjectItem = ({ projectId, showOwner, onDeleteRequest }) => {
  const { loading, data, error } = useQuery(GET_PROJECT, {
    variables: { projectId }
  });

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

  // Generic Error
  if (error)
    return (
      <ListItem>
        <Alert severity="warning" sx={{ flex: 1 }}>
          {error.message}
        </Alert>
      </ListItem>
    );

  // Project Not Found
  if (!loading && !data.projects.length)
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
        !loading &&
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
        primary={loading ? "..." : data?.projects[0].title}
        primaryTypographyProps={{
          color: (theme) =>
            theme.palette.getContrastText(theme.palette.background.default)
        }}
        secondary={
          <Stack component="span">
            {showOwner && (
              <Typography component="span">
                shared by: <i>{data?.projects[0].uname}</i>
              </Typography>
            )}
            <Typography component="span">
              last updated: <i>{formatDate(data?.projects[0].updated_at)}</i>
            </Typography>
          </Stack>
        }
      />
    </ListItem>
  );
};
