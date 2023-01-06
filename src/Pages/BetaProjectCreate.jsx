import { gql, useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { Button, TextField, Stack, Typography } from "@mui/material";
import { usePushID } from "../utils/use-pushid";
import { useBetaAccount } from "../state/use-beta-account";
import { Link } from "react-router-dom";

import BetaPage from "../components/BetaPage";

const CREATE_PROJECT = gql`
  mutation CreateProject(
    $accountID: String!
    $projectID: String!
    $title: String!
    $data: jsonb!
  ) {
    project: insert_beta_projects_one(
      object: {
        uuid: $projectID
        account_uuid: $accountID
        title: $title
        data: $data
      }
    ) {
      projectID: uuid
      created_at
      updated_at
      title
    }
  }
`;

const ADD_OWN_PROJECT = gql`
  mutation AddOwnProject($accountID: String!, $project: jsonb!) {
    update_beta_accounts_by_pk(
      pk_columns: { uuid: $accountID }
      _append: { own_projects: $project }
    ) {
      own_projects
      uuid
    }
  }
`;

const BetaProjectCreate = () => {
  const navigate = useNavigate();
  const { generatePushID } = usePushID();
  const { accountID } = useBetaAccount();
  const [createProject] = useMutation(CREATE_PROJECT);
  const [addOwnProject] = useMutation(ADD_OWN_PROJECT);

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    const projectID = generatePushID();
    const title = evt.target.elements.title.value;

    try {
      // Create project:
      const res1 = await createProject({
        variables: {
          accountID,
          projectID,
          title,
          data: {
            collapse: [],
            item: []
          }
        }
      });

      // Add reference to user's account data:
      await addOwnProject({
        variables: {
          accountID,
          project: { [projectID]: res1.data.project }
        }
      });

      navigate("/beta/account");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <BetaPage>
      <Stack component="form" spacing={2} onSubmit={handleSubmit}>
        <Typography variant="h4">Create New Project:</Typography>
        <TextField name="title" placeholder="Project's title" />
        <Stack direction={"row"} justifyContent={"flex-end"} spacing={2}>
          <Button variant="contained" type="submit">
            Create
          </Button>
          <Button component={Link} to="/beta/account">
            Cancel
          </Button>
        </Stack>
      </Stack>
    </BetaPage>
  );
};

export default BetaProjectCreate;
