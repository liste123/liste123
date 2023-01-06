import { useBetaAccount } from "../state/use-beta-account";
import { Box, Button } from "@mui/material";
import { Link } from "react-router-dom";

const BetaProjectCreate = () => {
  const { accountID } = useBetaAccount();

  return (
    <Box sx={{ m: 2 }}>
      {accountID}
      <Button component={Link} to="/beta">
        Back
      </Button>
    </Box>
  );
};

export default BetaProjectCreate;
