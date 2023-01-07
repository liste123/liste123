import { useContext } from "react";
import { useParams } from "react-router-dom";
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
  const { uname } = useParams();
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

  // Full page reload will remove any parameter
  // as so remove a bad accountID url
  const resetAccount = () => {
    localStorage.removeItem("liste123.beta.account.id");
    window.location = window.location.href.split("?")[0];
  };

  return {
    ...state,
    uname,
    createAccount,
    redeemAccount,
    resetAccount
  };
};
