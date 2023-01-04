import { useState, useEffect } from "react";
import { Box, Stack, Button } from "@mui/material";
import { usePubSub } from "../utils/use-pubsub";
import TreeTable from "../components/TreeTable";
import backlog from "../backlog.json";

const dummy = [
  { id: 1, parentId: null, title: "foo", status: false },
  { id: 2, parentId: null, title: "faa", status: false },
  { id: 3, parentId: null, title: "fii", status: false }
];

const HomePage = () => {
  const { subscribe } = usePubSub();
  const [data, setData] = useState(true ? backlog : dummy);

  // Import source code from the data so to make it
  // editable and applicable
  const [src, setSrc] = useState({});
  useEffect(() => {
    setSrc(JSON.stringify(data, null, 2));
  }, [data]);

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
      <Stack direction="row">
        <Box sx={{ flex: 1 }}>
          <TreeTable data={data} onChange={setData} />
        </Box>

        <Stack sx={{ width: "35vw" }}>
          <Stack direction="row" justifyContent="space-between">
            <h4>Edit source:</h4>
            <Button onClick={() => setData(JSON.parse(src))}>Apply</Button>
          </Stack>
          <textarea
            rows={30}
            style={{ fontSize: 10, height: "70vh" }}
            value={src}
            onChange={(e) => setSrc(e.target.value)}
          />
        </Stack>
      </Stack>
      <button onClick={() => setData([])}>reset</button>
    </Box>
  );
};

export default HomePage;
