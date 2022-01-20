const { Pool } = require("pg");

const config = {
  user: "postgres",
  host: "localhost",
  password: "Junjie1995",
  database: "likeme",
  port: 5432,
};

const pool = new Pool(config);

//? Show data
const showData = async () => {
  try {
    const querySql = "SELECT * FROM posts";
    const query = await pool.query(querySql);
    return query.rows;
  } catch (error) {
    console.log(error.code);
    return error;
  }
};

//? Insert Data
const insertData = async (data) => {
  const statement = {
    text: "INSERT INTO posts (usuario, url, descripcion) VALUES ($1, $2, $3) RETURNING *;",
    values: data,
  };
  try {
    await pool.query(statement);
  } catch (error) {
    console.log(error.code);
    return error;
  }
};

//? Add a like
const addLike = async (id) => {
  const data = await pool.query(`SELECT likes FROM posts WHERE id = ${id}`);
  let likes = data.rows[0].likes;
  if (likes === null) {
    await pool.query(`UPDATE posts SET likes = 1 WHERE id = ${id}`);
  } else {
    let plus = likes + 1;
    const statement = {
      text: `UPDATE posts SET likes = ($1) WHERE id = ${id}`,
      values: [plus],
    };
    await pool.query(statement);
  }
};

module.exports = { showData, insertData, addLike };
