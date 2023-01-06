import { useContext } from "react";
import { gql, useMutation } from "@apollo/client";
import { usePushID } from "../utils/use-pushid";
import { BetaAccountContext } from "./with-beta-account";

const CREATE_ACCOUNT = gql`
  mutation CreateAccount($uuid: String!, $data: jsonb = "{}") {
    account: insert_beta_accounts_one(object: { uuid: $uuid, data: $data }) {
      uuid
    }
  }
`;

export const useBetaAccount = () => {
  const { generatePushID } = usePushID();
  const [createFn] = useMutation(CREATE_ACCOUNT);
  const { setAccountID, loadAccount, ...state } =
    useContext(BetaAccountContext);

  const createAccount = () => {
    const uuid = generatePushID();
    createFn({ variables: { uuid } }).then((res) =>
      setAccountID(res.data.account.uuid)
    );
  };

  const redeemAccount = (accountId) =>
    loadAccount({ variables: { uuid: accountId } }).then((res) => {
      if (!res.data.account) {
        alert("Account not found");
        return;
      }

      setAccountID(accountId);
    });

  const resetAccount = () => {
    localStorage.removeItem("liste123.beta.account.id");
    location.reload();
  };

  return {
    ...state,
    createAccount,
    redeemAccount,
    resetAccount
  };
};
