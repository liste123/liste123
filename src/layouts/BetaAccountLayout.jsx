import { Outlet } from "react-router-dom";
import { Alert, AlertTitle, Button } from "@mui/material";
import { useBetaAccount } from "../state/use-beta-account";
import BetaPage from "../components/BetaPage";

const BetaAccountLayout = () => {
  const { loading, error, accountData, resetAccount } = useBetaAccount();

  if (loading) return null;

  // In case the Account does not exist
  if (error)
    return (
      <BetaPage>
        <Alert
          severity="error"
          action={<Button onClick={resetAccount}>reset account</Button>}
        >
          <AlertTitle>Oooops!</AlertTitle>
          {error.message}
        </Alert>
      </BetaPage>
    );

  // There is still some delay between end of loading and the
  // AccountData being available... d'oh!
  if (!accountData) return null;

  return <Outlet />;
};

export default BetaAccountLayout;
