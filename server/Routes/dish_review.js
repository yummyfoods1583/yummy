const db = require("../Api")

// POST /dish_review
const dish_review = async (req, res) => {
  try {
    const result = await db.query(
      `insert into review (customer_id, review_type, dish_id, review_text, rating) values ($1, 'DISH', $2, $3, $4) returning *`,
      [
        req.body.customer_id,
        req.body.dish_id,
        req.body.review_text,
        req.body.rating,
      ]
    )

    res.status(200).json({
      status: "success",
      data_length: result.rows.length,
      data: result.rows[0],
    })
  } catch (error) {
    console.error(error) // helpful for debugging
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    })
  }
}

module.exports = dish_review
