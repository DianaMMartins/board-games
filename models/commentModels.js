const db = require("../db/connection.js");

exports.fetchCommentsById = (comment_id) => {
  return db
    .query(`SELECT * FROM comments WHERE comment_id = $1`, [comment_id])
    .then((results) => {
      if (results.rowCount === 0) {
        return Promise.reject("Can't find comment");
      }
      return results.rows[0];
    });
};

exports.removeCommentById = (comment_id) => {
  return db
    .query(`DELETE FROM comments WHERE comment_id = $1 RETURNING *`, [comment_id])
    .then(( results ) => {
      if (results.rowCount === 0) {
        return Promise.reject("Can't find comment");
      }
      return results.rows
    });
};
