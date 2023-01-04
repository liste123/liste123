import { useRef } from "react";
// import { createPubSub } from "../utils/use-pubsub";

/**
 * EVENTS
 *
 * nodes::set
 * nodes::changed
 */

export const getNodeById = (nodes, id) => {
  for (const node of nodes) {
    if (id === node.id) return node;
    const sub = getNodeById(node.children, id);
    if (sub) return sub;
  }
};

export const updateNodeById = (nodes, id, change = {}) => {
  // Ineffective way to produce a full copy of the nodes tree
  const copy = JSON.parse(JSON.stringify(nodes));

  // Modify the node in-place but from the copy of the data
  const _node = getNodeById(copy, id);
  for (const key in change) {
    _node[key] = change[key];
  }

  return copy;
};

// export const useDeepList = (initialNodes) => {
//   const nodes = useRef(initialNodes);
//   const pubsub = createPubSub();

//   // Update internal state when the nodes structure changes
//   pubsub.subscribe("nodes::changed", (_nodes) => (nodes.currend = _nodes));

//   return {
//     ...pubsub,
//     setNodes: (_nodes, silent = false) => {
//       nodes.current = _nodes;
//       if (silent === false) {
//         pubsub.publish("nodes::set", _nodes);
//       }
//     },
//     getNodes: () => nodes.current,
//     getNodeById: (nodeId) => getNodeById(nodes.current, nodeId)
//   };
// };

export default {
  getNodeById,
  updateNodeById
};
