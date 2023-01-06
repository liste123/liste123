import { createContext, useState } from "react";

import { gql, useMutation, useLazyQuery } from "@apollo/client";
import { useEffectDebounced } from "../utils/use-effect-debounced";
import { usePushID } from "../utils/use-pushid";

const LOAD_ACCOUNT = gql`
  query LoadAccount($uuid: String!) {
    account: beta_accounts_by_pk(uuid: $uuid) {
      created_at
      data
      updated_at
      uuid
    }
  }
`;

const CREATE_ACCOUNT = gql`
  mutation CreateAccount($uuid: String!, $data: jsonb = "{}") {
    account: insert_beta_accounts_one(object: { uuid: $uuid, data: $data }) {
      uuid
    }
  }
`;

export const BetaAccountContext = createContext();

export const withBetaAccount = (Component) => (props, ref) => {
  const [accountID, setAccountID] = useState(null);
  const [accountData, setAccountData] = useState(null);
  const { generatePushID } = usePushID();

  const [loadAccount, accountStatus] = useLazyQuery(LOAD_ACCOUNT);
  const [createAccount, createStatus] = useMutation(CREATE_ACCOUNT);
  // console.log(createStatus);

  // Grab AccountID from local storage
  // Or create a new Beta Account
  useEffectDebounced(
    () => {
      const accountID = localStorage.getItem("liste123.beta.account.id");
      if (accountID) {
        setAccountID(accountID);
      } else {
        const uuid = generatePushID();
        createAccount({ variables: { uuid } }).then((res) => {
          localStorage.setItem(
            "liste123.beta.account.id",
            res.data.account.uuid
          );
          setAccountID(res.data.account.uuid);
        });
      }
    },
    [],
    { delay: 0 }
  );

  useEffectDebounced(
    () => {
      loadAccount({ variables: { uuid: accountID } }).then((res) => {
        setAccountData(res.data.account);
      });
    },
    [accountID],
    { delay: 0, skipFirst: true }
  );

  return (
    <BetaAccountContext.Provider
      value={{
        isLoading:
          (!accountStatus.called && !createStatus.called) ||
          accountStatus.loading ||
          createStatus.loading,
        error: createStatus.error || accountStatus.error,
        accountID,
        accountData
      }}
    >
      <Component />
    </BetaAccountContext.Provider>
  );
};
