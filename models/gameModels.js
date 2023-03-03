const { use } = require("../app.js");
const db = require("../db/connection.js");
const categories = require("../db/data/test-data/categories.js");
const { reviewData } = require("../db/data/test-data/index.js");

exports.selectCategories = () => {
  return db.query(`SELECT * FROM categories;`).then((response) => {
    return response.rows;
  });
};

exports.selectCategoriesFromReviews = () => {
  return db
    .query(`SELECT category FROM reviews GROUP BY category`)
    .then((response) => {
      return response.rows;
    });
};

exports.selectReviews = (category, sort_by, order) => {
  const validSortOptions = [
    "created_at",
    "title",
    "designer",
    "owner",
    "review_img_url",
    "review_body",
    "category",
    "votes",
  ];
  if (!validSortOptions.includes(sort_by)) {
    return Promise.reject("Invalid sorting!");
  }

  console.log(category);
  
  let queryString = `SELECT reviews.*, COUNT(comments.comment_id)::INT AS comment_count FROM reviews LEFT JOIN comments ON comments.review_id = reviews.review_id`;
  const query = [];

  if (category !== undefined) {
    queryString += ` WHERE reviews.category = $1`;
    query.push(category);
  }
  queryString += ` GROUP BY reviews.review_id ORDER BY ${sort_by}`;
  if (order === "ASC") {
    queryString += ` ASC;`;
  } else {
    queryString += " DESC;";
  }
  return db.query(queryString, query).then((response) => {
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

  if (username === undefined) {
    return Promise.reject("Property not found!");
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
