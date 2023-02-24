const { use } = require("../app.js");
const db = require("../db/connection.js");
const { reviewData } = require("../db/data/test-data/index.js");

exports.selectCategories = () => {
  return db.query(`SELECT * FROM categories;`).then((response) => {
    return response.rows;
  });
};

exports.selectReviews = (sort_by) => {
  const validSortOptions = ["created_at"];

  if (sort_by && !validSortOptions.includes(sort_by)) {
    return Promise.reject("Invalid sorting!");
  }

  let queryString = `SELECT reviews.*, COUNT(comments.comment_id) AS comment_count 
    FROM reviews LEFT JOIN comments 
    ON comments.review_id = reviews.review_id
    GROUP BY reviews.review_id`;

  if (sort_by) {
    queryString += ` ORDER BY ${sort_by} DESC`;
  }

  return db.query(queryString).then((response) => {
    const clonedResponse = JSON.parse(JSON.stringify(response.rows));
    const newArray = clonedResponse.map((object) => {
      object.comment_count = Number(object.comment_count);
      delete object.review_body;
      return object;
    });
    return newArray;
  });
};

exports.fetchReviewById = (id) => {
  return db
    .query(`SELECT * FROM reviews WHERE review_id = $1`, [id])
    .then((result) => {
      if (result.rowCount === 0) {
        return Promise.reject("Can't find review");
      } else {
        return result.rows[0];
      }
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

exports.insertComment = (id, properties) => {
  const { username, body } = properties;
  console.log(username);

  if (username === undefined) {
    return Promise.reject("Property not found!")
  }
  return db
    .query(`SELECT * FROM users WHERE username = $1`, [username])
    .then((results) => {
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
