import { useTreeTable } from "./use-tree-table";
import { useFocus } from "./use-focus";
import { useApi } from "./use-api";
import { appendNode, updateNode } from "../deeplist";

export const useEditMode = (node) => {
  const { nodes, isEditMode, setIsEditMode, setNodes } = useTreeTable();
  const { hasFocus, requestFocus } = useFocus(node);
  const { createNode } = useApi();

  const requestEditMode = (evt) => {
    evt.preventDefault();
    evt.stopPropagation();

    setIsEditMode(true);
    requestFocus();
  };

  const requestViewMode = () => {
    setIsEditMode(false);
  };

  const update = (data, create = false, append = false) => {
    if (!isEditMode || !hasFocus) return;

    // Apply new value and clone the nodes for the new update:
    const _nodes = updateNode(nodes, node.id, data, { clone: true });

    // Append new node and move focus to it:
    if (create) {
      const newNode = createNode();

      appendNode(_nodes, newNode, {
        [append ? "into" : "after"]: node.id
      });

      setTimeout(() => requestFocus(newNode.id));
    }

    setNodes(_nodes);
  };

  return {
    isEditMode: isEditMode && hasFocus,
    requestEditMode,
    requestViewMode,
    update
  };
};
