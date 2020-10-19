const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const port = process.env.PORT || 4000;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

require('./controller/socket.io.js')(io);

http.listen(port, () => console.log("listening on " + port));
