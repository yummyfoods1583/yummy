const db = require("../Api")
//cart_item=> create a cart item
const cart_item = async (req, res) => {
  try {
    const result = await db.query(
      "insert into cart_item values ($1,$2,$3, $4) returning *",
      [
        req.body.sub_cat_id,
        req.body.cart_id,
        req.body.quantity,
        req.body.order_specification,
      ]
    )
    res.status(200).json({
      status: "success",
      data_length: result.rows.length,
      data: { cart_item: result.rows },
    })
  } catch (error) {
    res.status(500).json({
      status: "Error",
      message: "Internal Server Error",
    })
  }
}
module.exports = cart_item
