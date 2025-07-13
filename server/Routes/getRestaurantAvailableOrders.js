const db = require("../Api")
//restaurant_available_orders/:id=> rest_id
const getRestaurantAvailableOrders = async (req, res) => {
  try {
    const result = await db.query(
      "select o.*,c.*,u.name from order_ o join cart c on(o.order_id=c.cart_id) join users u on(u.user_id=c.rest_id) where c.rest_id=$1 and o.order_status='PENDING'",
      [req.params.id]
    )
    console.log(result.rows)
    res.status(200).json({
      status: "success",
      data_length: result.rows.length,
      data: {
        orders: result.rows,
      },
    })
  } catch (error) {
    res.status(500).json({
      status: "Error",
      message: "Internal Server Error",
    })
      console.log(error)
  }
}
module.exports = getRestaurantAvailableOrders
