const pool = require("../pool");

async function getAllMessages() {
  const { rows } = await pool.query(`
    SELECT me.id, me.message, me.author_id, CONCAT(us.first_name, ' ', us.last_name) AS author_name, me.created_at
    FROM messages AS me
    LEFT JOIN users AS us ON me.author_id = us.id;`);

  return rows;
}

async function createMessage({ message, authorId }) {
  await pool.query(
    `
    INSERT INTO messages (message, author_id)
    VALUES ($1, $2);`,
    [message, authorId],
  );
}

module.exports = { getAllMessages, createMessage };
