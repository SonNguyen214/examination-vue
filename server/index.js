import { connectDB } from "./utils/db";

export default defineNitroPlugin(() => {
  connectDB();
});
