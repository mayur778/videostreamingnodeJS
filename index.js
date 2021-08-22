const express = require("express");
const app = express();
const fs = require("fs");

app.get("/", function (req, res)  {
    res.sendFile(__dirname + "/index.html");
});

app.get("/video",  function (req, res) {
    const range = req.headers.range;
    if(!range){
        res.status(400).send("requires range");

    }

    const videopath = "demo.mp4";
    const videoSize = fs.statSync("demo.mp4").size;

    const CHUNK_SIZE = 10 ** 6;
    const start = Number(range.replace(/\D/g, ""));
    const end = Math.min(start + CHUNK_SIZE, videoSize - 1);


    const contentLength = end - start + 1;
    const headers = {
        "Content-Range": `bytes ${start}-${end}/${videoSize}`,
        "Accept-Range": "bytes",
        "Content-Length": contentLength,
        "Content-Type": "video/mp4",
    };

    res.writeHead(206, headers);

    const videoStream = fs.createReadStream(videopath, {start, end});

    videoStream.pipe(res);

});

let port = process.env.PORT || 8000;

app.listen(port, () => {
    console.log(`listening to the port no at ${port}`);
});