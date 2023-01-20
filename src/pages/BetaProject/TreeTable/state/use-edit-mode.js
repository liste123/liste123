import { useContext } from "react";
import { useFocus } from "./use-focus";
import { TreeTableContext } from "../TreeTable";
import { updateNode } from "../deeplist";

export const useEditMode = (node) => {
  const { isEditMode, setIsEditMode, nodes, setNodes } =
    useContext(TreeTableContext);
  const { hasFocus, requestFocus } = useFocus(node);

  const requestEditMode = (evt) => {
    evt.preventDefault();
    evt.stopPropagation();

    setIsEditMode(true);
    requestFocus();
  };

  const requestViewMode = () => {
    setIsEditMode(false);
  };

  const update = (data) => {
    if (!isEditMode || !hasFocus) return;
    const _nodes = updateNode(nodes, node.id, data, { clone: true });
    setNodes(_nodes);
  };

  return {
    isEditMode: isEditMode && hasFocus,
    requestEditMode,
    requestViewMode,
    update
  };
};
