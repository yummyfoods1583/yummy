const db = require("../Api")
const categories = async (req, res) => {
  try {
    const result = await db.query("SELECT CATEGORY_NAME FROM CATEGORY")
    //SUCCESS
    res.status(200).json({
      status: "success",
      data_length: result.rows.length,
      data: {
        categories: result.rows.map(x=> x.category_name),
      },
    })
  } catch (err) {
    res.status(500).json({
      status: "Error",
      message: "Internal Server Error",
    })
  }
}
module.exports = categories
