const db = require("../Api")
//cart->post request
const createCart = async (req, res) => {
  try {
    const result = await db.query(
      "insert into cart (customer_id, rest_id) values ($1, $2) returning *",
      [req.body.customer_id, req.body.rest_id]
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
module.exports = createCart
