import { useContext } from "react";
import { TreeTableContext } from "./Context";

export const useCollapse = (nodeId) => {
  const { collapse, setCollapse } = useContext(TreeTableContext);

  const toggleCollapse = () => {
    const _collapse = collapse.includes(nodeId)
      ? collapse.filter(($) => $ !== nodeId)
      : [...collapse, nodeId];

    setCollapse(_collapse);
  };

  return {
    isCollapsed: collapse.includes(nodeId),
    toggleCollapse
  };
};
