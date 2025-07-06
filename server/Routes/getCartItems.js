const db = require("../Api")
//cart_item/:id=> cart_id
const getCartItems = async (req, res) => {
  try {
    const result = await db.query(
      "select * from cart_item c join dish_sub_category d on (c.sub_cat_id=d.sub_cat_id) join dish ds on (d.dish_id=ds.dish_id) where cart_id=$1",
      [req.params.id]
    )
    res.status(200).json({
      status: "success",
      data_length: result.rows.length,
      data: {
        cart_item: result.rows,
      },
    })
  } catch (error) {
    res.status(500).json({
      status: "Error",
      message: "Internal Server Error",
    })
  }
}
module.exports = getCartItems
