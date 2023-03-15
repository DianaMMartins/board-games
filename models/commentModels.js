const db = require("../db/connection.js");

exports.fetchCommentsById = (comment_id) => {
    return db.query(`SELECT * FROM comments WHERE comment_id = $1`, [comment_id] )
    .then((results) => {
        console.log(results.rowCount, 'HI');
        if (results.rowCount === 0) {
            return Promise.reject("Can't find comment");
        }
        return results.rows[0];
      });
}