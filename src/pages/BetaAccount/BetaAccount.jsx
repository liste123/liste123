import { useBetaAccount } from "../../state/use-beta-account";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  Button,
  Paper,
  ListItemText,
  ListSubheader,
  Fab
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import UploadFileIcon from "@mui/icons-material/UploadFile";

import { Link } from "react-router-dom";

import { useScreenSize } from "../../utils/use-screen-size";
import BetaPage from "../../components/BetaPage";
import { ProjectItem } from "./ProjectItem";

const BetaAccount = () => {
  const { isBigScreen, isSmallScreen } = useScreenSize();
  const { uname, accountData, removeOwnProject, removeSharedProject } =
    useBetaAccount();

  const { own_projects: ownProjects, shared_projects: sharedProjects } =
    accountData;

  return (
    <BetaPage
      title="Hello, Unknown User"
      actions={
        isBigScreen && (
          <Button
            component={Link}
            to={`/beta/${uname}/create`}
            variant="contained"
            startIcon={<AddIcon />}
          >
            New&nbsp;Project
          </Button>
        )
      }
      menu={
        <List>
          <ListItem disablePadding>
            <ListItemButton component={Link} to={`/beta/${uname}/create`}>
              <ListItemIcon>
                <AddIcon />
              </ListItemIcon>
              <ListItemText primary="New Project" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton component={Link} to={`/beta/${uname}/import`}>
              <ListItemIcon>
                <UploadFileIcon />
              </ListItemIcon>
              <ListItemText primary="Import Project" />
            </ListItemButton>
          </ListItem>
        </List>
      }
    >
      <Paper>
        <List>
          <ListSubheader>My Projects</ListSubheader>
          {[...new Set(ownProjects)].map((projectId) => (
            <ProjectItem
              key={projectId}
              projectId={projectId}
              onDeleteRequest={removeOwnProject}
            />
          ))}
          <ListSubheader>Shared Projects</ListSubheader>
          {[...new Set(sharedProjects)].map((projectId) => (
            <ProjectItem
              showOwner
              key={projectId}
              projectId={projectId}
              onDeleteRequest={removeSharedProject}
            />
          ))}
        </List>
      </Paper>
      {isSmallScreen && (
        <Fab
          component={Link}
          to={`/beta/${uname}/create`}
          color={"primary"}
          sx={{
            margin: 0,
            top: "auto",
            right: 30,
            bottom: 30,
            left: "auto",
            position: "fixed"
          }}
        >
          <AddIcon />
        </Fab>
      )}
    </BetaPage>
  );
};

export default BetaAccount;
