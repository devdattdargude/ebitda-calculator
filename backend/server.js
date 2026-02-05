const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/scenario",
  require("./routes/scenario"));

app.use("/api/user",
  require("./routes/user"));

app.listen(4000,
  () => console.log("API running"));
