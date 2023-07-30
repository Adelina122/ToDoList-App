import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    var currentDay = new Date().getDay();
    var currentDate = new Date().getDate();
    var currentMonth = new Date().getMonth();
    res.render("./index.ejs", {
        day: dayNames[currentDay],
        date: currentDate,
        month: monthNames[currentMonth],
    });
});

app.get("/work", (req, res) => {
    res.render("./work.ejs");
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "December"];
