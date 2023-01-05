import { useNode } from "../state/use-node";
import { useEditMode } from "../state/use-edit-mode";

import { Box } from "@mui/material";
import Input from "./TextInput";

export const Title = ({ node }) => {
  const { isEditMode, requestEditMode, requestViewMode } = useEditMode(node);

  const {
    update,
    data: { title }
  } = useNode(node);

  const handleChange = (title) => {
    update({ title });
  };

  return isEditMode ? (
    <Input
      value={title}
      onChange={handleChange}
      onBlur={requestViewMode}
      style={{ flex: 1 }}
    />
  ) : (
    <Box onClick={requestEditMode} sx={{ flex: 1 }}>
      {title}
    </Box>
  );
};

export default Title;
