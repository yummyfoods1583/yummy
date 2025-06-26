const db = require("../Api")
const dishes = async (req, res) => {
  try {
    const {
      dist_name,
      sub_dist_id,
      rating_order = "DESC", // default to DESC
      rating_min,
      rating_max,
      dish_name,
      available,
      category_name,
      rest_id,
    } = req.query

    const result = await db.query(
      `SELECT
          D.*,
          (SELECT NAME FROM USERS WHERE USER_ID = D.REST_ID) AS RESTAURANT_NAME,
          COUNT(RR.REVIEW_ID) AS REVIEW_COUNT
        FROM
          DISH D
          LEFT JOIN RESTAURANT R ON D.REST_ID = R.REST_ID
          LEFT JOIN SUB_DISTRICT S ON R.SUB_DIST_ID = S.SUB_DIST_ID
          LEFT JOIN REVIEW RR ON RR.DISH_ID = D.DISH_ID
          LEFT JOIN DISH_CATEGORY_LINKER C ON D.DISH_ID=C.DISH_ID
        WHERE
          ($1::TEXT IS NULL OR S.DIST_NAME = $1)
          AND ($2::NUMERIC IS NULL OR S.SUB_DIST_ID = $2)
          AND ($3::NUMERIC IS NULL OR D.RATING >= $3)
          AND ($4::NUMERIC IS NULL OR D.RATING <= $4)
          AND ($5::TEXT IS NULL OR LOWER(D.DISH_NAME) LIKE ('%' || LOWER($5) || '%'))
          AND ($6=FALSE OR AVAILABLE=$6)
          AND ($7::TEXT IS NULL OR C.CATEGORY_NAME=$7)
          AND ($8::TEXT IS NULL OR R.REST_ID=$8)
        GROUP BY
          D.DISH_ID,
          D.REST_ID,
          D.DISH_NAME,
          D.DISH_DETAILS,
          D.DISCOUNT,
          D.PHOTO_URL,
          D.RATING,
          (SELECT NAME FROM USERS WHERE USER_ID = D.REST_ID)
        ORDER BY D.RATING ${rating_order === "ASC" ? "ASC" : "DESC"}`,
      [
        dist_name || null,
        sub_dist_id || null,
        rating_min || null,
        rating_max || null,
        dish_name || null,
        available,
        category_name || null,
        rest_id || null,
      ]
    )

    // Success
    return res.status(200).json({
      status: "success",
      data_length: result.rows.length,
      data: {
        dishes: result.rows,
      },
    })
  } catch (error) {
    console.error("Error fetching dishes:", error.message)
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    })
  }
}

module.exports = dishes
