const db = require("../Api")

// GET /restaurant_review
const restaurant_review = async (req, res) => {
  try {
    const result = await db.query(
      `insert into review (customer_id, review_type, rest_id, review_text, rating) values ($1, 'RESTAURANT', $2, $3, $4) returning *`,
      [
        req.body.customer_id,
        req.body.rest_id,
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

module.exports = restaurant_review
