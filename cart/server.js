import { app } from "./app.js";
import { connectDB } from "./db/database.js";

connectDB().then(() => {
          app.listen(process.env.PORT, () => {
                    console.log(`Server is running on port ${process.env.PORT}`);
          });
}).catch(err => console.error(err));