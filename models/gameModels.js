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
    return db.query(`SELECT * FROM reviews WHERE review_id = $1`, [id]).then((result) => {
        if(result.rowCount === 0) {
            return Promise.reject("Can't find review");
        } else { 
            return result.rows[0];
        }
    })
}