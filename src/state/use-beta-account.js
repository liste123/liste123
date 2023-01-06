import { useContext } from "react";
import { BetaAccountContext } from "./with-beta-account";

export const useBetaAccount = () => {
  const state = useContext(BetaAccountContext);

  return {
    ...state
  };
};
