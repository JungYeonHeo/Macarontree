const app = require("./app.js");
const dotenv = require("dotenv");
dotenv.config();

const port = process.env.PORT || 3002;

app.listen(port, () => {
  console.log(`express is running on ${port}`);
});