
import * as dotenv from "dotenv";
dotenv.config({ path: "./config.env" });
import app from "./app";



// Start the server

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});