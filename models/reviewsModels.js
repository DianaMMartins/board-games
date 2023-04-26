const db = require("../db/connection.js");
const { selectCategoriesFromReviews } = require("../models/categoriesModels");

const validCategories = [];
const validateCategories = selectCategoriesFromReviews();
Promise.all([validateCategories]).then(([response]) => {
  response.forEach((responseCategory) => {
    validCategories.push(responseCategory);
  });
});

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
  const regex = /\d/g;
  const testInteger = regex.test(category);

  if (testInteger) {
    return Promise.reject("Invalid type in category");
  }
  if (!validCategories.includes(category) && category !== undefined) {
    return Promise.reject("Invalid category");
  }
  if (!validSortOptions.includes(sort_by)) {
    return Promise.reject("Invalid sort by request!");
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
  const regex = /\d/;
  if (!regex.test(id)) {
    return Promise.reject("Review not valid");
  }
  if(votes === undefined) {
    return Promise.reject("Vote property is invalid");
  }
  
  let queryString = `UPDATE reviews SET votes = votes + $1 WHERE reviews.review_id = $2 RETURNING *`;
  const query = [votes, id]
  return db
    .query(
      queryString,
      query
    )
    .then((result) => {
      if (result.rowCount === 0 && regex.test(id)) {
        return Promise.reject("Can't find review");
      } else if (result.rowCount === 0 && !regex.test(id)) {
        return Promise.reject("Review not valid");
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
