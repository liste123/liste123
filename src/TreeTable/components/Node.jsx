import { useNode } from "../state/use-node";
import { useCollapse } from "../state/use-collapse";
import { useFocus } from "../state/use-focus";

const Node = ({ node }) => {
  const { hasFocus, requestFocus } = useFocus(node.id);
  const { isCollapsed, toggleCollapse } = useCollapse(node.id);

  const {
    data: { title }
  } = useNode(node);

  return (
    <div
      onClick={() => requestFocus(node.id)}
      style={{
        background: hasFocus ? "yellow" : "transparent"
      }}
    >
      <button onClick={toggleCollapse}>{isCollapsed ? "+" : "-"}</button>{" "}
      {title}
    </div>
  );
};

export default Node;
