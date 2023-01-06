import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Box, Alert, AlertTitle, Button, Typography } from "@mui/material";

import { useBetaProject } from "../state/use-beta-project";
import BetaPage from "../components/BetaPage";

const BetaProject = () => {
  const { loading, error, title, data, update } = useBetaProject();

  const [src, setSrc] = useState(JSON.stringify(data, null, 2));
  useEffect(() => {
    console.log("@setSrc");
    setSrc(JSON.stringify(data, null, 2));
  }, [data]);

  if (loading) {
    return null;
  }

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
    <>
      <Typography variant="h4">{title}</Typography>
      <textarea
        value={src}
        onChange={(e) => setSrc(e.target.value)}
        style={{ width: 500, height: 400 }}
      />
      <button onClick={() => update(title, JSON.parse(src))}>save</button>
    </>
  );

  return <BetaPage>{error ? renderError() : renderBody()}</BetaPage>;
};

export default BetaProject;
