const db = require("../Api")
///dish_sub_category/:id
const dish_sub_category = async (req, res) => {
  try {
    const result = await db.query(
      "select * from dish_sub_category where dish_id=$1",
      [req.params.id]
    )
    res.status(200).json({
      status: "success",
      data_length: result.rows.length,
      data: {
        dish_sub_category: result.rows,
      },
    })
  } catch (error) {
    res.status(500).json({
      status: "Error",
      message: "Internal Server Error",
    })
  }
}
module.exports = dish_sub_category
