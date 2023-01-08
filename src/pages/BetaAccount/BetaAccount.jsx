import { useBetaAccount } from "../../state/use-beta-account";
import {
  List,
  ListItem,
  Button,
  Paper,
  ListItemText,
  ListItemAvatar,
  ListSubheader,
  Avatar,
  Fab
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import WorkIcon from "@mui/icons-material/Work";
import { Link } from "react-router-dom";

import { useScreenSize } from "../../utils/use-screen-size";
import BetaPage from "../../components/BetaPage";
import { ProjectItem } from "./ProjectItem";

const BetaAccount = () => {
  const { isBigScreen, isSmallScreen } = useScreenSize();

  const { uname, accountData } = useBetaAccount();

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
            New&nbsp;project
          </Button>
        )
      }
    >
      <Paper>
        <List>
          <ListSubheader>My Projects</ListSubheader>
          {ownProjects.map((projectId) => (
            <ProjectItem key={projectId} projectId={projectId} />
          ))}
          <ListSubheader>Shared Projects</ListSubheader>
          {sharedProjects.map((projectId) => (
            <ProjectItem key={projectId} projectId={projectId} showOwner />
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
