const db = require("../Api")

// GET /rating?rest_id=...&dish_id=...
const getRating = async (req, res) => {
  try {
    const { rest_id, dish_id } = req.query

    const result = await db.query(
      `SELECT AVG(rating) AS rating, COUNT(*) AS review_count
       FROM review
       WHERE ($1::varchar IS NULL OR rest_id = $1)
         AND ($2::numeric IS NULL OR dish_id = $2)`,
      [rest_id || null, dish_id || null]
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

module.exports = getRating
