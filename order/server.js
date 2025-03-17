import { app } from "./app.js";
import { connectDB } from "./db/database.js";

connectDB()
  .then(() => {
    app.on("error", (err) => console.log(err));
    app.listen(process.env.PORT, () => {
      console.log("User server running on port :",process.env.PORT);
    });
  })
  .catch((err) => console.log(err));
