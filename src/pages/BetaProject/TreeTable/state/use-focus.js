import { useTreeTable } from "./use-tree-table";

export const useFocus = (node) => {
  const { focus, setFocus } = useTreeTable();

  return {
    hasFocus: focus === node.id,
    requestFocus: () => setFocus(node.id)
  };
};
