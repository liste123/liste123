import { useCallback } from "react";

import { useNode, useFocus, useCollapse } from "./Context";
import Checkbox from "./Checkbox";

const TreeTableItem = ({ node }) => {
  const { hasFocus, requestFocus } = useFocus(node.id);
  const { isCollapsed, toggleCollapse } = useCollapse(node.id);

  const {
    update,
    data: { title, status }
  } = useNode(node);

  const onStatusChange = useCallback(
    (evt, status) => update({ status: status }),
    [node]
  );

  return (
    <div
      onClick={() => requestFocus(node.id)}
      style={{
        background: hasFocus ? "yellow" : "transparent"
      }}
    >
      <button onClick={toggleCollapse}>{isCollapsed ? "+" : "-"}</button>
      <Checkbox value={status} onChange={onStatusChange} />
      {title}
    </div>
  );
};

export default TreeTableItem;
