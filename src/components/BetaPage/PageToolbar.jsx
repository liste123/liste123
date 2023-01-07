import { Stack } from "@mui/material";

import { PageTitle } from "./PageTitle";
import { LinkBack } from "./LinkBack";
import { LinkClose } from "./LinkClose";

export const PageToolbar = ({
  title,
  subtitle,
  linkBackTo,
  linkCloseTo,
  actions,
  actionsLeft
}) => {
  const renderLeftBox = () => {
    if (linkBackTo) return <LinkBack to={linkBackTo} />;
    if (actionsLeft) return <Stack>{actionsLeft}</Stack>;
  };

  const renderRightBox = () => {
    if (linkCloseTo) return <LinkClose to={linkCloseTo} />;
    if (actions) return <Stack>{actions}</Stack>;
  };

  if (
    !title &&
    !subtitle &&
    !linkBackTo &&
    !linkCloseTo &&
    !actions &&
    !actionsLeft
  )
    return null;

  return (
    <Stack direction={"row"} spacing={2} alignItems={"center"} sx={{ mb: 4 }}>
      {renderLeftBox()}
      <PageTitle title={title} subtitle={subtitle} />
      {renderRightBox()}
    </Stack>
  );
};
