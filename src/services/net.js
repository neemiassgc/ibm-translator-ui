import axios from "axios"

const HOST = "http://localhost:8080"
const net = axios.create({baseURL: HOST});

export default net;