const db = require("../db/connection.js");

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