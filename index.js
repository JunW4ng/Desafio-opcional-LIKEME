const http = require("http");
const fs = require("fs");
const url = require("url");
const port = 3000;
const { showData, insertData, addLike } = require("./querys");

http
  .createServer(async (req, res) => {
    //? App
    if (req.url == "/" && req.method === "GET") {
      res.writeHeader(200, "Content-Type", "text/html");
      fs.readFile("index.html", (err, data) => {
        err ? console.log("Loading Error") : console.log("Loading OK");
        res.end(data);
      });
    }

    //? Show posts
    if (req.url.startsWith("/posts") && req.method === "GET") {
      try {
        res.writeHeader(200, { "Content-Type": "application/json" });
        const data = await showData();
        res.end(JSON.stringify(data));
      } catch (error) {
        res.writeHeader(500, { "Content-Type": "application/json" });
        res.end("ERROR EN EL SERVIDOR", error);
      }
    }

    //? Create a post
    if (req.url.startsWith("/post") && req.method === "POST") {
      let body = "";
      req.on("data", (chunck) => {
        body += chunck;
      });
      req.on("end", async () => {
        try {
          res.writeHeader(200, { "Content-Type": "application/json" });
          const values = Object.values(JSON.parse(body));
          console.log(values);
          const result = await insertData(values);
          res.end(JSON.stringify(result));
        } catch (error) {
          res.writeHeader(500, { "Content-Type": "application/json" });
          res.end("ERROR EN EL SERVIDOR", error);
        }
      });
    }

    //? Add a like
    if (req.url.startsWith("/post?") && req.method === "PUT") {
      try {
        res.writeHeader(200, { "Content-Type": "application/json" });
        const { id } = url.parse(req.url, true).query;
        await addLike(id);
        res.end();
      } catch (error) {
        res.writeHeader(500, { "Content-Type": "application/json" });
        res.end("ERROR EN EL SERVIDOR", error);
      }
    }
  })
  .listen(port, () => {
    console.log(`Listening to port ${port}`);
  });
