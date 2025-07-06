const db = require("../Api")

function isAtLeast30MinutesAhead(proposedTime) {
  const now = new Date()
  const deliveryTime = new Date(proposedTime)
  const diffMs = deliveryTime - now
  return diffMs >= 30 * 60 * 1000 // 30 minutes in milliseconds
}
//place_order=> placing a order->post req
const place_order = async (req, res) => {
  console.log(req.body)
  try {
    if (!isAtLeast30MinutesAhead(req.body.proposed_delivery_time)) {
      return res.status(400).json({
        status: "failed",
        message: "Proposed delivery time must be at least 30 minutes from now.",
      })
    }
    const result = await db.query(
      "insert into order_(order_id,delivery_method,sub_dist_id,proposed_delivery_time, detailed_address, order_status) values($1,$2,$3,$4,$5,'PENDING') returning *",
      [
        req.body.order_id,
        req.body.delivery_method,
        req.body.sub_dist_id,
        req.body.proposed_delivery_time,
        req.body.detailed_address,
      ]
    )
    res.status(200).json({
      status: "success",
      data_length: result.rows.length,
      data: {
        order: result.rows,
      },
    })
  } catch (error) {
    res.status(500).json({
      status: "Error",
      message: "Internal Server Error",
    })
    // console.log(error)
  }
}
module.exports = place_order
