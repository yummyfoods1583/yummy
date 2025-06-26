const db = require("../Api")
const Restaurant = async (req, res) => {
  try {
    const result = await db.query(
      "SELECT U.NAME, U.MOBILE, R.* FROM USERS U JOIN RESTAURANT R ON(U.USER_ID=R.REST_ID) WHERE U.USER_ID=$1",
      [req.params.id]
    )
    if (result.rows.length === 0) {
      return res.status(404).json({
        status: "fail",
        message: "Restaurant not found",
      })
    }
    res.status(200).json({
      status: "success",
      data_length: result.rows.length,
      data: {
        restaurant: result.rows[0],
      },
    })
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    })
  }
}
module.exports=Restaurant