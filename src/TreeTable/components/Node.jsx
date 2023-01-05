import { useNode } from "../state/use-node";
import { useCollapse } from "../state/use-collapse";
import { useFocus } from "../state/use-focus";
import { useStatus } from "../state/use-status";

import Checkbox from "./Checkbox";

const Node = ({ node }) => {
  const { hasFocus, requestFocus } = useFocus(node);
  const { isCollapsed, toggleCollapse } = useCollapse(node);
  const { isCompleted } = useStatus(node);

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
      <button onClick={toggleCollapse}>{isCollapsed ? "+" : "-"}</button>{" "}
      <Checkbox value={isCompleted} /> {title}
    </div>
  );
};

export default Node;
