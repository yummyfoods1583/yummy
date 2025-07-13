const db = require("../Api")

// GET /reviews?rest_id=...&dish_id=...
const getReview = async (req, res) => {
  try {
    const { rest_id, dish_id } = req.query

    const result = await db.query(
      `SELECT *
       FROM review
       WHERE ($1::varchar IS NULL OR rest_id = $1)
         AND ($2::numeric IS NULL OR dish_id = $2)
         order by review_time desc`,
      [rest_id || null, dish_id || null]
    )

    res.status(200).json({
      status: "success",
      data_length: result.rows.length,
      data: { reviews: result.rows },
    })
  } catch (error) {
    console.error(error) // helpful for debugging
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    })
  }
}

module.exports = getReview
