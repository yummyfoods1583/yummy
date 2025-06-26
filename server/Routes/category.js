const db = require("../Api")
///category/:id
const category = async (req, res) => {
  try {
    const dish_id = req.params.id
    const result = await db.query(
      "SELECT CATEGORY_NAME FROM DISH_CATEGORY_LINKER WHERE DISH_ID=$1",
      [dish_id]
    )
    res.status(200).json({
      status: "success",
      data_length: result.rows.length,
      data: {
        categories: result.rows.map((x) => x.category_name),
      },
    })
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    })
  }
}
module.exports = category
