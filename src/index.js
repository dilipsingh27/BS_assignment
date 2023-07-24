const express = require("express");
const app = express();
const { contactRoute} = require("./routes/contact.js");

const PORT = process.env.PORT || 6000;

app.use(express.json());
app.use("/", contactRoute);

app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));