import axios from "axios"
const CLOUD_NAME = "dvm1qpuvn"

const ImageFinder = axios.create({
  baseURL: `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
})
export default ImageFinder
