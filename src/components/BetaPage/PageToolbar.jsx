import { Stack } from "@mui/material";

import { PageTitle } from "./PageTitle";
import { LinkBack } from "./LinkBack";
import { LinkClose } from "./LinkClose";

export const PageToolbar = ({
  title,
  subtitle,
  linkBackTo,
  linkCloseTo,
  actions
}) => {
  const renderLeftBox = () => {
    if (linkBackTo) return <LinkBack to={linkBackTo} />;
  };

  const renderRightBox = () => {
    if (linkCloseTo) return <LinkClose to={linkCloseTo} />;
    if (actions) return <Stack>{actions}</Stack>;
  };

  if (!title && !subtitle && !linkBackTo && !linkCloseTo && !actions)
    return null;

  return (
    <Stack direction={"row"} spacing={2} alignItems={"center"} sx={{ mb: 4 }}>
      {renderLeftBox()}
      <PageTitle title={title} subtitle={subtitle} />
      {renderRightBox()}
    </Stack>
  );
};
