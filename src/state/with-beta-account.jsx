import { createContext, useState, useEffect } from "react";
import { gql, useLazyQuery } from "@apollo/client";
import { useNavigate } from "react-router-dom";

import { useEffectDebounced } from "../utils/use-effect-debounced";

const LOAD_ACCOUNT = gql`
  query LoadAccount($uuid: String!) {
    account: beta_accounts_by_pk(uuid: $uuid) {
      uuid
      created_at
      updated_at
      data
      own_projects
      shared_projects
    }
  }
`;

export const BetaAccountContext = createContext();

export const withBetaAccount = (Component) => () => {
  const navigate = useNavigate();
  const [accountID, setAccountID] = useState(null);
  const [error, setError] = useState(null);

  const [loadAccount, { refetch: reloadAccount, ...loadStatus }] =
    useLazyQuery(LOAD_ACCOUNT);

  /**
   * Load AccountID or Create New Account
   */
  useEffectDebounced(
    () => {
      // Load AccountID from local storage:
      const accountID = localStorage.getItem("liste123.beta.account.id");
      if (accountID) {
        setAccountID(accountID);
        return;
      }

      // Send to signup pipeline:
      navigate("/beta/signup");
    },
    [],
    { delay: 0 }
  );

  /**
   * Load Account Data
   */
  useEffectDebounced(
    () => {
      loadAccount({ variables: { uuid: accountID } }).then((res) => {
        if (res.data.account) {
          localStorage.setItem("liste123.beta.account.id", accountID);
        } else {
          setError({
            name: "MissingAccount",
            message: `Account "${accountID}" does not exists on this server`
          });
        }
      });
    },
    [accountID],
    { delay: 0, skipFirst: true }
  );

  // TODO: fix it up!
  // This is horrible, we definitely need a different layout for the
  // signup pipeline to simplify this and avoid the flickering!
  const isLoading = () => {
    if (accountID && loadStatus.data?.account) return false;
    if (accountID && (loadStatus.error || error)) return false;
    if (!accountID) return false;

    return true;
  };

  return (
    <BetaAccountContext.Provider
      value={{
        isLoading: isLoading(),
        error: loadStatus.error || error,
        accountID,
        setAccountID,
        accountData: loadStatus.data?.account,
        loadAccount,
        reloadAccount,
        loadStatus
      }}
    >
      <Component />
    </BetaAccountContext.Provider>
  );
};
