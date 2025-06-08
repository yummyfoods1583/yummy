//importrs
const express = require("express")
require("dotenv").config()
const db = require("./Api")
const cors = require("cors")

//variables
const app = express()

//bypass the cross origin resource sharing protocols
app.use(cors())
//middleware to parse JSON content
app.use(express.json())

//fetch the districts
app.get("/api/v1/districts", async (req, res) => {
  const result = await db.query("SELECT * FROM DISTRICT")
  res.status(200).json({
    status: "success",
    data_length: result.rows.length,
    data: {
      districts: result.rows,
    },
  })
})

//fetch login data
app.post("/api/v1/login", async (req, res) => {
  const result = await db.query(
    "SELECT USER_ID, USER_TYPE FROM USERS WHERE USER_ID= $1 AND PASSWORD=$2",
    [req.body.user_id, req.body.password]
  )
  res.status(200).json({
    status: "success",
    data_length: result.rows.length,
    data: {
      user: result.rows[0],
    },
  })
})

//fetch the subdistricts
app.get("/api/v1/subdistricts/:id", async (req, res) => {
  try {
    const result = await db.query(
      "SELECT * FROM SUB_DISTRICT WHERE DIST_NAME=$1",
      [req.params.id]
    )
    res.status(200).json({
      status: "success",
      data_length: result.rows.length,
      data: {
        subdistricts: result.rows,
      },
    })
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "internal server error",
    })
  }
})

//register a new customer
app.post("/api/v1/rider", async (req, res) => {
  try {
    const result1 = await db.query(
      "INSERT INTO USERS (USER_ID, USER_TYPE, NAME, PASSWORD, MOBILE) SELECT $1, 'RID', $2, $3, $4 WHERE NOT EXISTS (SELECT 1 FROM users WHERE USER_ID = $5) RETURNING *",
      [
        req.body.user_id,
        req.body.name,
        req.body.password,
        req.body.mobile,
        req.body.user_id,
      ]
    )
    let result = result1
    if (result1.rows.length == 1) {
      const result2 = await db.query(
        "INSERT INTO RIDER VALUES ($1,$2,$3,$4,$5) returning *",
        [
          req.body.user_id,
          req.body.curr_sub_dist_id,
          req.body.email,
          req.body.details,
          req.body.photo_url,
        ]
      )
      result = result2
    }

    res.status(200).json({
      status: "succes",
      data_length: result.rows.length,
      data: {
        rider: result.rows[0],
      },
    })
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "internal server error",
    })
  }
})

//get restaurants based on query location
app.get("/api/v1/restaurants", async (req, res) => {
  try {
    const {
      dist_name,
      sub_dist_id,
      rating_order,
      rating_min,
      rating_max,
      name,
    } = req.query
    const result = await db.query(
      `SELECT R1.REST_ID,
  R1.SUB_DIST_ID,
  R1.EMAIL,
  R1.OPENING_TIME,
  R1.CLOSING_TIME,
  R1.CLOSE_UNTIL,
  R1.REST_DETAILS,
  R1.MANAGER_NAME,
  R1.PHOTO_URL,
  R1.PAYMENT_METHOD,
  R1.RATING,
  R1.DETAILED_ADDRESS,
  U.NAME,
  U.MOBILE, COUNT(R2.REST_ID) AS REVIEW_COUNT FROM RESTAURANT R1 LEFT JOIN USERS U 
ON (R1.REST_ID=U.USER_ID)
LEFT JOIN REVIEW R2
ON(R1.REST_ID=R2.REST_ID)
LEFT JOIN SUB_DISTRICT S
ON(S.SUB_DIST_ID=R1.SUB_DIST_ID)
WHERE ($1::text is NULL OR S.DIST_NAME=$2 ) AND ($3::numeric is NULL OR S.SUB_DIST_ID=$4) AND
($5::numeric is NULL OR R1.RATING>=$6) AND ($7::numeric is NULL OR R1.RATING<=$8) AND ($9::text is NULL OR LOWER(U.NAME) LIKE ('%'||$10||'%'))
GROUP BY R1.REST_ID, R1.SUB_DIST_ID, R1.EMAIL, R1.OPENING_TIME, R1.CLOSING_TIME, R1.CLOSE_UNTIL, R1.REST_DETAILS, R1.MANAGER_NAME, R1.PHOTO_URL, R1.PAYMENT_METHOD, R1.RATING, R1.DETAILED_ADDRESS, U.NAME, U.MOBILE
ORDER BY R1.RATING ${rating_order}`,
      [
        dist_name || null,
        dist_name,
        sub_dist_id || null,
        sub_dist_id,
        rating_min || null,
        rating_min,
        rating_max || null,
        rating_max,
        name || null,
        name,
      ]
    )
    res.status(200).json({
      status: "success",
      data_length: result.rows.length,
      data: {
        restaurants: result.rows,
      },
    })
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "internal server error",
    })
  }
})

app.listen(process.env.PORT, () => {
  console.log(`server is listening at port: ${process.env.PORT}`)
})
