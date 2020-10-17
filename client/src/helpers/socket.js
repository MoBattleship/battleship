import socketIOClient from "socket.io-client";
const ENDPOINT = "http://localhost:4000";

const socket = socketIOClient(ENDPOINT);

export default socket;
