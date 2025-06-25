const db = require("../Api")
const category = async (req, res) => {
    const result=db.query("SELECT CATEGORY_NAME FROM DISH_CATEGORY_LINKER WHERE DISH_ID=$1", [])
}