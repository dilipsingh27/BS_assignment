const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const app = express();
const { contactRoute} = require("./src/routes/contact.js");

const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use("/", contactRoute);

app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));