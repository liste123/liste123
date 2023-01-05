/**
 * Shall we look into a deep clone library?
 */
export const clone = (nodes) =>
  nodes.map((node) => ({
    ...node,
    children: clone(node.children)
  }));

/**
 * This can be improved A LOT
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

/**
 * Change this with PushID
 */
export const createId = () =>
  [
    Date.now(),
    Math.floor(Math.random() * (9 - 0 + 1) + 0),
    Math.floor(Math.random() * (9 - 0 + 1) + 0),
    Math.floor(Math.random() * (9 - 0 + 1) + 0),
    Math.floor(Math.random() * (9 - 0 + 1) + 0),
    Math.floor(Math.random() * (9 - 0 + 1) + 0),
    Math.floor(Math.random() * (9 - 0 + 1) + 0),
    Math.floor(Math.random() * (9 - 0 + 1) + 0)
  ].join("");

export const createNode = ({
  id,
  title,
  status,
  children,
  ...payload
} = {}) => ({
  id: id || createId(),
  title: title || "New item",
  status: status || false,
  children: children ? children.map(createNode) : [],
  ...payload
});

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

export const isNodeCompleted = (node) => {
  if (!node.children.length) return node.status;
  return node.children.every(isNodeCompleted);
};
