import { useBetaAccount } from "../state/use-beta-account";
import {
  List,
  ListItem,
  Button,
  Typography,
  Paper,
  ListItemText,
  ListItemAvatar,
  ListSubheader,
  Avatar
} from "@mui/material";

import WorkIcon from "@mui/icons-material/Work";
import { Link } from "react-router-dom";

import BetaPage from "../components/BetaPage";

const BetaAccount = () => {
  const { isLoading, accountData } = useBetaAccount();
  if (isLoading || !accountData) return null;

  const { own_projects: ownProjects, shared_projects: sharedProjects } =
    accountData;

  return (
    <BetaPage>
      <Typography variant="h4">Own Projects</Typography>
      <Paper>
        <List>
          <ListSubheader>Projects</ListSubheader>
          {Object.values(ownProjects).map((project) => (
            <ListItem
              key={project.projectID}
              to={`/beta/project/${project.projectID}`}
              component={Link}
            >
              <ListItemAvatar>
                <Avatar>
                  <WorkIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={project.title}
                primaryTypographyProps={{ color: "white" }}
                secondary={project.updated_at}
              />
            </ListItem>
          ))}
          <ListSubheader>Shared Projects</ListSubheader>
          {Object.values(sharedProjects).map((project) => (
            <ListItem
              key={project.projectID}
              to={`/beta/project/${project.projectID}`}
              component={Link}
            >
              <ListItemAvatar>
                <Avatar>
                  <WorkIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={project.title}
                primaryTypographyProps={{ color: "white" }}
                secondary={project.updated_at}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
      <Button component={Link} to="/beta/create">
        New project
      </Button>
    </BetaPage>
  );
};

export default BetaAccount;
