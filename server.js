require("dotenv").config();
const express = require("express");
const app = express();
require("./db");
const schoolRoutes = require("./routes/schoolRoutes");

app.use(express.json());
app.use("/", schoolRoutes);

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
    res.send("running");
});

app.listen(PORT, () => {
    console.log("Server Running...");
});
