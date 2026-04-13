const pool = require("../pool");

async function findUserById(id) {
  const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
  return rows;
}

async function findUserByEmail(emailAddress) {
  const { rows } = await pool.query("SELECT * FROM users WHERE email_address = $1", [emailAddress]);
  return rows;
}

async function createMember({ firstName, lastName, emailAddress, password, isAdmin }) {
  const membershipId = isAdmin === true ? 2 : 1;

  await pool.query(
    `INSERT INTO users (first_name, last_name, email_address, password, membership_id, is_admin)
    VALUES ($1, $2, $3, $4, $5, $6);`,
    [firstName, lastName, emailAddress, password, membershipId, isAdmin],
  );
}

async function upgradeMemberToPremium(userId) {
  await pool.query(
    `
    UPDATE users
    SET membership_id = 2,
        updated_at = NOW()
    WHERE id = $1`,
    [userId],
  );
}

module.exports = { findUserById, findUserByEmail, createMember, upgradeMemberToPremium };
