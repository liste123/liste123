import { useBetaAccount } from "../state/use-beta-account";
import { Box, Alert, AlertTitle, Button } from "@mui/material";

const BetaAccount = () => {
  const { isLoading, accountData, error, resetAccount } = useBetaAccount();

  if (isLoading) return "...";

  if (error) {
    return (
      <Box sx={{ m: 2 }}>
        <Alert
          severity="error"
          action={<Button onClick={resetAccount}>reset account</Button>}
        >
          <AlertTitle>Oooops!</AlertTitle>
          {error.message}
        </Alert>
      </Box>
    );
  }

  return <pre>{JSON.stringify(accountData)}</pre>;
};

export default BetaAccount;
