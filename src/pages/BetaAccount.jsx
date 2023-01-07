import { useBetaAccount } from "../state/use-beta-account";
import {
  List,
  ListItem,
  Button,
  Paper,
  ListItemText,
  ListItemAvatar,
  ListSubheader,
  Avatar
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import WorkIcon from "@mui/icons-material/Work";
import { Link } from "react-router-dom";

import BetaPage from "../components/BetaPage";

const BetaAccount = () => {
  const { uname, accountData } = useBetaAccount();

  const { own_projects: ownProjects, shared_projects: sharedProjects } =
    accountData;

  return (
    <BetaPage
      title="Hello, Unknown User"
      actions={
        <Button
          component={Link}
          to={`/beta/${uname}/create`}
          variant="contained"
          startIcon={<AddIcon />}
        >
          New&nbsp;project
        </Button>
      }
    >
      <Paper>
        <List>
          <ListSubheader>My Projects</ListSubheader>
          {Object.values(ownProjects).map((project) => (
            <ListItem
              key={project.projectID}
              to={project.projectID}
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
              to={project.projectID}
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
    </BetaPage>
  );
};

export default BetaAccount;
