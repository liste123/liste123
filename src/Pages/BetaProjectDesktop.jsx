import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Stack,
  Box,
  Alert,
  AlertTitle,
  Button,
  Typography
} from "@mui/material";

import { useKeyboardEvent } from "../utils/use-keyboard-event";
import { useBetaProject } from "../state/use-beta-project";
import BetaPage from "../components/BetaPage";
import TreeTable from "../TreeTable";

const Input = ({ shortcut, onSubmit, scrollOptions = {}, ...props }) => {
  const inputRef = useRef();

  // Prepend items from input
  useKeyboardEvent(
    "enter",
    (evt) => {
      onSubmit(evt.target.value);
      evt.target.value = "";
      evt.target.focus();
      evt.target.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "nearest",
        ...scrollOptions
      });
    },
    { target: inputRef }
  );

  useKeyboardEvent(shortcut, () => {
    inputRef.current.focus();
    inputRef.current.scrollIntoView({
      behavior: "smooth",
      block: "end",
      inline: "nearest",
      ...scrollOptions
    });
  });

  return <input {...props} ref={inputRef} type="text" />;
};

const BetaProject = () => {
  const treeTableRef = useRef();
  const { loading, error, title, data, update } = useBetaProject();

  const [src, setSrc] = useState(JSON.stringify(data, null, 2));
  useEffect(() => {
    console.log("@setSrc");
    setSrc(JSON.stringify(data, null, 2));
  }, [data]);

  if (loading) {
    return null;
  }

  const onChange = (data) => update(title, data);

  const renderError = () => (
    <Box sx={{ m: 2 }}>
      <Alert
        severity="error"
        action={
          <Button component={Link} to={"/beta/account"}>
            close
          </Button>
        }
      >
        <AlertTitle>Oooops!</AlertTitle>
        {error.message}
      </Alert>
    </Box>
  );

  const renderBody = () => (
    <>
      <Stack spacing={2}>
        <Typography variant="h4">{title}</Typography>

        <Input
          placeholder={"(Ctrl + P) Prepend a new item"}
          shortcut={"Ctrl + p"}
          onSubmit={(title) =>
            treeTableRef.current.prepend({
              title
            })
          }
        />

        <TreeTable ref={treeTableRef} data={data} onChange={onChange} />

        <Input
          placeholder={"(Ctrl + A) Append a new item"}
          shortcut={"Ctrl + a"}
          onSubmit={(title) =>
            treeTableRef.current.append({
              title
            })
          }
        />
      </Stack>
    </>
  );

  return <BetaPage>{error ? renderError() : renderBody()}</BetaPage>;
};

export default BetaProject;
