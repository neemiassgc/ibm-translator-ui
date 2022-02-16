import axios from "axios"

const HOST = "https://secret-eyrie-64268.herokuapp.com"
const net = axios.create({baseURL: HOST});

export default net;