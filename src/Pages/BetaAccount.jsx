import { useBetaAccount } from "../state/use-beta-account";

const BetaAccount = () => {
  const { isLoading, accountData } = useBetaAccount();

  if (isLoading) return "...";

  return <div>{JSON.stringify(accountData)}</div>;
};

export default BetaAccount;
