import { Stack } from "@mui/material";
import { Title } from "./Title";

export const PageTitle = ({ title, subtitle }) => {
  if (!title && !subtitle) return null;

  return (
    <Stack flexGrow={1}>
      <Title value={title} typographyProps={{ variant: "h4" }} />
      <Title value={subtitle} typographyProps={{ variant: "subtitle" }} />
    </Stack>
  );
};
