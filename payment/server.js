import { app } from "./app.js";
import connectDB from "./db/database.js";

connectDB().then(() => {
          app.listen(process.env.PORT, () => {
                    console.log(`Payment server running on port : ${process.env.PORT}`);
          });
}).catch((error) => {
          console.error(`Error: ${error.message}`);
          process.exit(1);
})