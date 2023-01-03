import { useState, useEffect } from "react";
import { Box, Stack } from "@mui/material";
import { usePubSub } from "../utils/use-pubsub";
import TreeTable from "../components/TreeTable";
import backlog from "./backlog.json";

const HomePage = () => {
  const { subscribe } = usePubSub();
  const [data, setData] = useState(backlog);

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

        <Box
          component="pre"
          sx={{ fontSize: 10, maxWidth: "35vw", overflow: "auto" }}
        >
          {JSON.stringify(data, null, 2)}
        </Box>
      </Stack>
    </Box>
  );
};

export default HomePage;
