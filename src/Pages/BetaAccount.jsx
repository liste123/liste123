import { useBetaAccount } from "../state/use-beta-account";
import { Box, Button } from "@mui/material";
import { Link } from "react-router-dom";

const BetaAccount = () => {
  const { isLoading, accountData } = useBetaAccount();
  if (isLoading || !accountData) return null;

  return (
    <Box sx={{ m: 2 }}>
      <pre>{JSON.stringify(accountData, null, 2)}</pre>
      <Button component={Link} to="new">
        New project
      </Button>
    </Box>
  );
};

export default BetaAccount;
