import { useState, useEffect, useRef } from "react";
import { Box, Stack, Button } from "@mui/material";
import { usePubSub } from "../utils/use-pubsub";
import TreeTable from "../TreeTable";
import backlog from "../backlog.json";
import { useKeyboardEvent } from "../utils/use-keyboard-event";

const dummy = {
  collapse: [],
  items: [
    { id: 1, parentId: null, title: "foo", status: false },
    { id: 2, parentId: 1, title: "faa", status: false },
    { id: 3, parentId: null, title: "fii", status: false }
  ]
};

const empty = {
  collapse: [],
  items: []
};

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

const HomePage = () => {
  const { subscribe } = usePubSub();
  const [data, setData] = useState(true ? backlog : dummy);
  const treeTableRef = useRef();

  // Import source code from the data so to make it editable
  const [src, setSrc] = useState({});
  useEffect(() => {
    setSrc(JSON.stringify(data, null, 2));
  }, [data]);

  // reset
  useEffect(() => subscribe("reset", () => setData([])), [data]);

  // export::json
  useEffect(
    () =>
      subscribe("export::json", () => {
        const el = document.createElement("a");

        el.setAttribute(
          "href",
          `data:text/json;charset=utf-8,${encodeURIComponent(
            JSON.stringify(data, null, 2)
          )}`
        );
        el.setAttribute("download", "liste123-backlog.json");
        el.click();
      }),
    [data]
  );

  // export::clipboard
  useEffect(
    () =>
      subscribe("export::clipboard", () => {
        navigator.clipboard.writeText(JSON.stringify(data, null, 2));
      }),
    [data]
  );

  // import::file
  useEffect(
    () =>
      subscribe("import::file", (evt) => {
        const reader = new FileReader();
        reader.onload = (evt) => setData(JSON.parse(evt.target.result));
        reader.readAsText(evt.target.files[0]);
      }),
    []
  );

  return (
    <Box>
      <Stack direction="row" spacing={4}>
        <Box sx={{ flex: 1 }}>
          <Stack spacing={2}>
            <Input
              placeholder={"(Ctrl + P) Prepend a new item"}
              shortcut={"Ctrl + p"}
              onSubmit={(title) =>
                treeTableRef.current.prepend({
                  title
                })
              }
            />

            <TreeTable ref={treeTableRef} data={data} onChange={setData} />

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
        </Box>

        <Stack sx={{ width: "35vw" }}>
          <Stack direction="row" justifyContent="space-between">
            <h4>Edit Document:</h4>
            <Stack direction="row">
              <Button onClick={() => setData(empty)}>Reset</Button>
              <Button onClick={() => setData(JSON.parse(src))}>Apply</Button>
            </Stack>
          </Stack>
          <textarea
            rows={30}
            style={{ fontSize: 10, height: "70vh" }}
            value={src}
            onChange={(e) => setSrc(e.target.value)}
          />
        </Stack>
      </Stack>
    </Box>
  );
};

export default HomePage;
