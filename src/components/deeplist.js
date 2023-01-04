/**
 * Shall we look into a deep clone library?
 * @param {*} nodes
 * @returns
 */
export const clone = (nodes) =>
  nodes.map((node) => ({
    ...node,
    children: clone(node.children)
  }));

/**
 * This can be improved A LOT
 *
 * @param {*} nodes
 * @param {*} parentId
 * @returns
 */
export const flat = (nodes, parentId = null) => {
  const list = [];

  nodes.forEach((node) => {
    const { children, ...data } = node;
    list.push({ ...data, parentId });
    flat(children, data.id).forEach(($) => list.push($));
  });

  return list;
};

export const getNodeById = (nodes, id) => {
  for (const node of nodes) {
    if (id === node.id) return node;
    const sub = getNodeById(node.children, id);
    if (sub) return sub;
  }
};

/**
 * Applies changes to the properties of a Node.
 * NOTE: modifies the given list inline
 * @param {*} nodes
 * @param {*} id
 * @param {*} change
 * @returns
 */
export const updateNodeById = (nodes, id, change = {}) => {
  const _node = getNodeById(nodes, id);

  for (const key in change) {
    _node[key] = change[key];
  }

  return [...nodes];
};

export default {
  getNodeById,
  updateNodeById
};
