const db = require("../Api")
//cart_check/:customer_id/:rest_id
const cart_check = async (req, res) => {
  try {
    const result = await db.query(
      "select * from cart where customer_id=$1 and rest_id=$2 and cart_status='ACTIVE'",
      [req.params.customer_id, req.params.rest_id]
    )
    res.status(200).json({
      status: "success",
      data_length: result.rows.length,
      data: { cart: result.rows },
    })
  } catch (error) {
    res.status(500).json({
      status: "Error",
      message: "Internal Server Error",
    })
  }
}
module.exports = cart_check
