const db = require("../Api")
//cart/:cart_id/:sub_cat_id->delete request
const removeCart_item = async (req, res) => {
  try {
    const result = await db.query(
      "delete from cart_item where cart_id=$1 and sub_cat_id= $2",
      [req.params.cart_id, req.params.sub_cat_id]
    )
    res.status(200).json({
      status: "success",
      data_length: result.rows.length,
      data: {
        cart: result.rows,
      },
    })
  } catch (error) {
    res.status(500).json({
      status: "Error",
      message: "Internal Server Error",
    })
  }
}
module.exports = removeCart_item
