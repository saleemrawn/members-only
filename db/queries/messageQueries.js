const pool = require("../pool");

async function getAllMessages() {
  const { rows } = await pool.query(`
    SELECT me.id, me.message, me.author_id, CONCAT(us.first_name, ' ', us.last_name) AS author_name, me.created_at
    FROM messages AS me
    LEFT JOIN users AS us ON me.author_id = us.id;`);

  return rows;
}

module.exports = { getAllMessages };
