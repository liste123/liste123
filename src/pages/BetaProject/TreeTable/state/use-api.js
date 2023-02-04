import { useTreeTable } from "./use-tree-table";
import {
  createNode,
  appendNode,
  removeNode,
  getNodeNext,
  getNodePrev
} from "../deeplist";

export const makeApi = ({
  nodes,
  focus,
  collapse,
  setNodes,
  setFocus,
  setIsEditMode
}) => {
  const _create = (data = {}) =>
    createNode({
      title: "",
      status: false,
      ...data
    });

  const _insert = (data = {}, focus = false, config = {}) => {
    const newNode = _create(data);

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
    createNode: (d) => _create(d),
    appendNode: (d, f) => _insert(d, f),
    prependNode: (d, f) => _insert(d, f, { prepend: true }),
    insertNodeAfter: (after, d, f) => _insert(d, f, { after }),
    insertNodeInto: (into, d, f) => _insert(d, f, { into, prepend: true }),
    removeNode: (targetNode) => {
      const _nodes = removeNode(nodes, targetNode, { clone: true });
      setNodes(_nodes);
    },
    moveFocusNext: () => {
      const nextNode = getNodeNext(nodes, focus, {
        canGoDown: (node) => !collapse.includes(node.id)
      });

      if (!nextNode) {
        setFocus(nodes[0].id);
        return;
      }
      setFocus(nextNode.id);
    },
    moveFocusPrev: () => {
      const prevNode = getNodePrev(nodes, focus, {
        canGoDown: (node) => {
          console.log("?", node.id, collapse);
          return !collapse.includes[node.id];
        }
      });
      if (!prevNode) {
        // setFocus(nodes[0].id);
        return;
      }
      setFocus(prevNode.id);
    }
  };
};

export const useApi = () => makeApi(useTreeTable());
