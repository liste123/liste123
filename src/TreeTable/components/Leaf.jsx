import { useCallback } from "react";

import { useNode } from "../state/use-node";
import { useFocus } from "../state/use-focus";

import Checkbox from "./Checkbox";

const Leaf = ({ node }) => {
  const { hasFocus, requestFocus } = useFocus(node.id);

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
      <Checkbox value={status} onChange={onStatusChange} /> {title}
    </div>
  );
};

export default Leaf;
