const pool = require("../pool");

async function createMember({ firstName, lastName, emailAddress, password, membershipId, isAdmin }) {
  await pool.query(
    `INSERT INTO users (first_name, last_name, email_address, password, membership_id, is_admin)
    VALUES ($1, $2, $3, $4, $5, $6);`,
    [firstName, lastName, emailAddress, password, membershipId, isAdmin],
  );
}

module.exports = { createMember };
