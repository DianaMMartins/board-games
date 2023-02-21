const db = require("../db/connection.js");
const { reviewData } = require("../db/data/test-data/index.js");

exports.selectCategories = () => {
  return db
  .query(`SELECT * FROM categories;`)
  .then((response) => {
    console.log('bye');
    return response.rows;
  });
};

exports.selectReviews = () => {
  return (
    db
      .query(
        `SELECT reviews.*, COUNT(comment_id) AS comment_count 
        FROM reviews RIGHT JOIN comments 
        ON comments.review_id = reviews.review_id
        GROUP BY reviews.review_id;`
      )
      .then((response) => {
        const clonedResponse = JSON.parse(JSON.stringify(response.rows));
        const newArray = clonedResponse.map((object) => {
            object.comment_count = Number(object.comment_count)  
            delete object.review_body;
            return object
        });
        return newArray;
      })
  );
};
