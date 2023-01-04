import { useContext } from "react";
import { TreeTableContext } from "./Context";

export const useFocus = (nodeId) => {
  const { focus, setFocus } = useContext(TreeTableContext);

  return {
    hasFocus: focus === nodeId,
    requestFocus: () => setFocus(nodeId)
  };
};
