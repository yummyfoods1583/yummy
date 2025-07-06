const db = require("../Api")
//cart/:cart_id ->delete request
const removeCart = async (req, res) => {
  try {
    const result = await db.query("delete from cart where cart_id=$1 returning *", [
      req.params.cart_id,
    ])
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
module.exports = removeCart
