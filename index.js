import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";

const app = express();
const port = 3000;

const dailyTask = [];
const workTask = [];
let newTask;

//Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/ToDoListDB");

//Create new schema
const itemsSchema = new mongoose.Schema({
    name: String
});

//Add some test default models
const Task = mongoose.model("task", itemsSchema);

const test = new Task({
    name: "Test"
});

const defaultTasks = [test];

//Insert new model to the collection
// await Task.insertMany(defaultTasks).then(console.log("Insert Successfully!"));



app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", async (req, res) => {

    var currentDay = new Date().getDay();
    var currentDate = new Date().getDate();
    var currentMonth = new Date().getMonth();

    const usersTasks = await Task.find({});

    if (usersTasks == 0) {
        await Task.insertMany(defaultTasks).then(console.log("Insert Successfully!"));
        console.log(usersTasks, "Default tasks successfully inserted!");
        return res.redirect("/");
    }

    res.render("./index.ejs", {
        day: dayNames[currentDay],
        date: currentDate,
        month: monthNames[currentMonth],
        // taskList: dailyTask,
        taskList: usersTasks
    });
});

app.post("/submitMain", (req, res) => {
    const userTask = req.body["todayList"];
    // dailyTask.push(newTask);
    // console.log(newTask, dailyTask);

    const task = new Task({
        name: userTask
    });
    task.save();
    res.redirect("/");
});

app.get("/work", (req, res) => {
    res.render("./work.ejs", { tasksList: workTask});
});

app.post("/submitWork", (req, res) => {

    newTask = req.body["workList"];
    workTask.push(newTask);

    res.redirect("/work");
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "December"];
