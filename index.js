const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);

const bodyParser = require("body-parser");
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.removeHeader("X-Powered-By");
  next();
});

io.on("connection", socket => {
  if (socket.handshake.headers.source == 'computer') {
    socket.join('computers');
  }
  console.log("new connection from "+socket.id);
});


app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/computer-actions", (req, res) => {
  let actions = req.body.computer_actions;
  if (actions) {
    for(var key in actions) {
      io.to('computers').emit(key, { item: actions[key] });
    }

    res.status(200).send("{\"message\": \"computer actions sent\" }");
  } else {
    res.status(400).send("{\"message\": \"no computer action specified.\" }");
  }
});

server.listen(process.env.PORT || 3000, () => {
  console.log("Example app listening on port 3000!");
});
