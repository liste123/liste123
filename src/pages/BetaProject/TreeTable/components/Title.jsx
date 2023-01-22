import { useEditMode } from "../state/use-edit-mode";
import { useApi } from "../state/use-api";
import { Box } from "@mui/material";
import { TextInput } from "./TextInput";

export const Title = ({ node, helpMode = false }) => {
  const { removeNode } = useApi();
  const { isEditMode, requestEditMode, requestViewMode, update } =
    useEditMode(node);

  return isEditMode ? (
    <TextInput
      value={node.meta.title}
      onChange={(title) => update({ title })}
      onEnter={(title, appendInside) => update({ title }, true, appendInside)}
      onCancel={(title) => {
        requestViewMode();
        title.length ? update({ title }) : removeNode(node);
      }}
      onBlur={(title, hasChanged) => {
        requestViewMode();
        if (hasChanged) {
          update({ title });
        } else if (!title) {
          removeNode(node);
        }
      }}
      style={{
        flex: 1,
        background: "transparent",
        color: "white",
        border: "none",
        outline: "none",
        fontFamily: "Roboto, Helvetica, Arial, sans-serif",
        fontSize: "1rem",
        paddingTop: 2,
        paddingBottom: 2
      }}
    />
  ) : (
    <Box onClick={requestEditMode} sx={{ flex: 1 }}>
      {node.meta.title || <i>write something here!</i>}
      {helpMode && <i>{" when..."}</i>}
    </Box>
  );
};

export default Title;
