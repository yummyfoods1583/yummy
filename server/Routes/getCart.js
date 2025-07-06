const db = require("../Api")
//cart/:id->get request id=customer_id
const getCart = async (req, res) => {
  try {
    const result = await db.query(
      "select c.*, u.name, r.sub_dist_id from cart c join restaurant r on(c.rest_id=r.rest_id) join users u on(u.user_id=r.rest_id) where c.customer_id=$1 and c.cart_status='ACTIVE'",
      [req.params.id]
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
module.exports = getCart
