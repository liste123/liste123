import { useNode } from "../state/use-node";
import { useFocus } from "../state/use-focus";
import { useStatus } from "../state/use-status";

import Checkbox from "./Checkbox";

const Leaf = ({ node }) => {
  const { hasFocus, requestFocus } = useFocus(node);
  const { isCompleted, toggleStatus } = useStatus(node);

  const {
    data: { title }
  } = useNode(node);

  return (
    <div
      onClick={requestFocus}
      style={{
        background: hasFocus ? "yellow" : "transparent"
      }}
    >
      <Checkbox value={isCompleted} onChange={toggleStatus} /> {title}
    </div>
  );
};

export default Leaf;
