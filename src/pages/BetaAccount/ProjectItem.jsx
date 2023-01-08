import { Link } from "react-router-dom";
import {
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  Stack,
  Alert
} from "@mui/material";
import WorkIcon from "@mui/icons-material/Work";
import { gql, useQuery } from "@apollo/client";
import { formatDistance } from "date-fns";

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

export const ProjectItem = ({ projectId, showOwner }) => {
  const { loading, data, error } = useQuery(GET_PROJECT, {
    variables: { projectId }
  });

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
        <Alert severity="warning" sx={{ flex: 1 }}>
          {"404 - Project not found"}
        </Alert>
      </ListItem>
    );

  const formatDate = (_date) => {
    if (!_date) return "n/a";
    try {
      return formatDistance(new Date(_date), new Date(), { addSuffix: true });
    } catch (err) {
      console.log(err.message, _date);
    }
  };

  return (
    <ListItem to={projectId} component={Link}>
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

[
  "-NL6at4ofuO8MYEkCEo9",
  "-NL6dRIE5OzZQ9voHi8q",
  "-NL7C-Vw22gXkNI9FlXj",
  "-NL7D9z9KH2WeY0FI6wr",
  "-NLBXnyazB5gVMNifRyS",
  "-NLBXzRzzepsUi2T2uA3"
][("-NL7HYOReOMgAICj64gi", "-NL7agJeNfd4SQdlPxhh", "-NLAFv7ait5AZoW0M315")];
