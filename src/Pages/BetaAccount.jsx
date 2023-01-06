import { useBetaAccount } from "../state/use-beta-account";
import { useEffectDebounced } from "../utils/use-effect-debounced";
import { Box, Button } from "@mui/material";
import { Link } from "react-router-dom";

const BetaAccount = () => {
  const { isLoading, accountData, reloadAccount } = useBetaAccount();
  if (isLoading || !accountData) return null;

  useEffectDebounced(
    () => {
      console.log("reload");
      reloadAccount();
    },
    [],
    { delay: 0 }
  );

  return (
    <Box sx={{ m: 2 }}>
      <pre>{JSON.stringify(accountData, null, 2)}</pre>
      <Button component={Link} to="/beta/create">
        New project
      </Button>
    </Box>
  );
};

export default BetaAccount;
