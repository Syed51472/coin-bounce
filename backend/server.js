const express = require("express");
const dbConnect = require("./database/index");
const router = require("./routes/index");
const { PORT } = require("./Config/index");
const errorHandling = require("./middleware/errorHandling");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const corsOptions = {
  credentials: true,
  origin: ["http://localhost:3000"],
};

const port = PORT;

const app = express();

app.use(cookieParser());

app.use(cors(corsOptions));

app.use(express.json({ limit: "50mb" }));

app.use(router);

dbConnect();

app.use("/storage", express.static("storage"));

app.use(errorHandling);

app.listen(port, console.log(`Server is running on PORT: ${port}`));
