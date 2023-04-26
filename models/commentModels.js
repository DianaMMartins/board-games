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

exports.updateCommentsLike = (id, value) => {
  const regex = /\d/;
  if (!regex.test(id)) {
    return Promise.reject("Comment not valid");
  }
  if(value === undefined) {
    return Promise.reject("Vote property is invalid");
  }

  return db.query(`UPDATE comments SET votes = votes + $1 WHERE comment_id = $2 RETURNING *`, [value, id]).then((results) => {
    if (results.rowCount === 0 && regex.test(id)) {
      return Promise.reject("Can't find comment");
    } else if (results.rowCount === 0 && !regex.test(id)) {
      return Promise.reject("Comment not valid");
    } else {
      return results.rows[0];
    }
  })
}

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

exports.fetchCommentsFromReview = (id) => {
  let queryString = "SELECT * FROM comments";
  const query = [];

  if (id !== undefined) {
    queryString += ` WHERE review_id = $1 ORDER BY created_at DESC`;
    query.push(id);
  }

  return db.query(queryString, query).then((results) => {
    return results.rows;
  });
};

exports.insertComment = (id, comment) => {
  const { username, body } = comment;

  if (username === undefined) {
    return Promise.reject("Property not found!");
  }
  return db.query(`SELECT * FROM users`).then((results) => {
    if (results.rowCount > 0) {
      return db
        .query(
          "INSERT INTO comments (body, author, review_id) VALUES ($1, $2, $3) RETURNING *",
          [body, username, id]
        )
        .then((result) => {
          return result.rows;
        });
    } else {
      return Promise.reject("Invalid data!");
    }
  });
};