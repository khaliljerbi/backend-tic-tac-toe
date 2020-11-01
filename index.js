// const path = require("path");
const express = require("express");
const app = express();
require("colors");

const PORT = process.env.PORT || 5000;

// const appPath = path.join(__dirname, "client/dist");
// app.use(express.static(appPath));
// app.get("*", (req, res) => {
//   res.sendFile(path.resolve(appPath, "index.html"));
// });

const server = app.listen(PORT, () =>
  console.log(`Started server on PORT: ${PORT}`.cyan)
);

require("./socket").init(server);
