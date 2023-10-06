import axios from "axios";

const $host = axios.create({
    baseURL: process.env.APP_API_URL,
    withCredentials: true,
})

export default $host;