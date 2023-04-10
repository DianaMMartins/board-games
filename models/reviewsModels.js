const db = require("../db/connection.js");

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

  let queryString = `SELECT reviews.*, COUNT(comments.comment_id)::INT AS comment_count 
  FROM reviews LEFT JOIN comments ON comments.review_id = reviews.review_id`;
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
    .query(
      `SELECT reviews.*, COUNT(comments.comment_id)::INT AS comment_count 
    FROM reviews LEFT JOIN comments ON comments.review_id = reviews.review_id WHERE reviews.review_id = $1 GROUP BY reviews.review_id`,
      [id]
    )
    .then((result) => {
      if (result.rowCount === 0) {
        return Promise.reject("Can't find review");
      } else {
        return result.rows[0];
      }
    });
};

exports.updateReviewById = (id, votes) => {
  return db
    .query(
      `UPDATE reviews SET votes = votes + $1 WHERE reviews.review_id = $2 RETURNING *`,
      [votes, id]
    )
    .then((result) => {
      if (result.rowCount === 0) {
        return Promise.reject("Can't find review");
      } else {
        return result.rows[0];
      }
    });
};

exports.fetchReviewByCategory = (category, availableCategories) => {
  const checkCategory = availableCategories.map((obj) => obj.slug);
  //check category exists
  if (
    checkCategory.filter(
      (existingCategories) => existingCategories === category
    ).length === 0
  ) {
    return Promise.reject("Can't find category");
  }
  return db
    .query(`SELECT * FROM reviews WHERE reviews.category = $1`, [category])
    .then((returns) => {
      return returns.rows;
    });
};
