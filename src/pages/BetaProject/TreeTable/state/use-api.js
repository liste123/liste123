import { useTreeTable } from "./use-tree-table";
import { createNode, appendNode, removeNode } from "../deeplist";

export const makeApi = ({ nodes, setNodes, setFocus, setIsEditMode }) => {
  const _insert = (data = {}, focus = false, config = {}) => {
    const newNode = createNode({
      title: "",
      status: false,
      ...data
    });

    // Persist change in memory
    setNodes(
      appendNode(nodes, newNode, {
        ...config,
        clone: true
      })
    );

    // Conditional focus
    Boolean(focus) &&
      setTimeout(() => {
        setFocus(newNode.id);
        setIsEditMode(true);
      });

    return newNode;
  };

  return {
    appendNode: (d, f) => _insert(d, f),
    prependNode: (d, f) => _insert(d, f, { prepend: true }),
    insertNodeAfter: (after, d, f) => _insert(d, f, { after }),
    insertNodeInto: (into, d, f) => _insert(d, f, { into, prepend: true }),

    removeNode: (targetNode) => {
      const _nodes = removeNode(nodes, targetNode, { clone: true });
      setNodes(_nodes);
    }
  };
};

export const useApi = () => makeApi(useTreeTable());
