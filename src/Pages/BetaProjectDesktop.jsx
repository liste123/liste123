import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Stack, Box, Alert, AlertTitle, Button } from "@mui/material";

import { useBetaProject } from "../state/use-beta-project";
import BetaPage from "../components/BetaPage";
import AddTask from "../components/AddTask";
import TreeTable from "../TreeTable";

const BetaProject = () => {
  const treeTableRef = useRef();
  const { loading, error, uuid, title, data, update } = useBetaProject();

  const [src, setSrc] = useState(JSON.stringify(data, null, 2));
  useEffect(() => {
    setSrc(JSON.stringify(data, null, 2));
  }, [data]);

  if (loading) {
    return <BetaPage>loading project...</BetaPage>;
  }

  const onChange = (data) => update(title, data);

  const renderError = () => (
    <Box sx={{ m: 2 }}>
      <Alert
        severity="error"
        action={
          <Button component={Link} to={"/beta/account"}>
            close
          </Button>
        }
      >
        <AlertTitle>Oooops!</AlertTitle>
        {error.message}
      </Alert>
    </Box>
  );

  const renderBody = () => (
    <Stack spacing={2}>
      <AddTask
        placeholder={"(Ctrl + P) Prepend a new item"}
        shortcut={"Ctrl + p"}
        onSubmit={(title) =>
          treeTableRef.current.prepend({
            title
          })
        }
      />

      <TreeTable ref={treeTableRef} data={data} onChange={onChange} />

      <AddTask
        placeholder={"(Ctrl + A) Append a new item"}
        shortcut={"Ctrl + a"}
        onSubmit={(title) =>
          treeTableRef.current.append({
            title
          })
        }
      />
    </Stack>
  );

  return (
    <BetaPage title={title} subtitle={`ID: ${uuid}`} linkCloseTo="/beta">
      {error ? renderError() : renderBody()}
    </BetaPage>
  );
};

export default BetaProject;
