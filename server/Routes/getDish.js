const db = require("../Api")

// GET /dish/:dish_id
const getDish = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT *
       FROM dish where
       dish_id=$1`,
      [req.params.dish_id]
    )

    res.status(200).json({
      status: "success",
      data_length: result.rows.length,
      data: { dish: result.rows[0] },
    })
  } catch (error) {
    console.error(error) // helpful for debugging
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    })
  }
}

module.exports = getDish
