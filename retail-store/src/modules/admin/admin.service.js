import { DB_NAME } from "../../database/db-init.js";
import db from "../../database/db.js";

export async function addDatabaseUser(username = "store_manager") {
  await db.query(
    `CREATE USER IF NOT EXISTS ? IDENTIFIED VIA mysql_native_password`,
    [username],
  );

  await db.query(
    `GRANT SELECT, INSERT, UPDATE ON ${DB_NAME}.* TO ? REQUIRE NONE`,
    [username],
  );

  return {
    message: `${username} created with SELECT, INSERT, UPDATE permissions on all tables in ${DB_NAME}`,
  };
}

export async function revokeUpdatePermission(username = "store_manager") {
  await db.query(`REVOKE UPDATE ON ${DB_NAME}.* FROM ?`, [username]);

  return {
    message: `UPDATE privilege revoked from ${username} for all tables in ${DB_NAME}`,
  };
}

export async function grantDeletePermission(username = "store_manager") {
  await db.query(`GRANT DELETE ON ${DB_NAME}.sales TO ?`, [username]);

  return {
    message: `DELETE privilege on the sales table granted to ${username}`,
  };
}
