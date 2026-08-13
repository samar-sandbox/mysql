import { createPool } from "mysql2/promise";
import config from "../config/config.js";

const db = createPool({
  host: config.dbHost,
  user: config.dbUser,
  password: config.dbPassword,
});

export default db;
