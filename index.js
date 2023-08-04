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
    listName: String,
    name: String
});

//Add some test default models
const Task = mongoose.model("task", itemsSchema);

// const test = new Task({
//     name: "Test"
// });

// const test2 = new Task({
//     name: "test2"
// });

// const defaultTasks = [test, test2];

//Insert new model to the collection
// await Task.insertMany(defaultTasks).then(console.log("Insert Successfully!"));

// const listSchema = {
//     name: String,
//     items: [itemsSchema]
// };

// const List = mongoose.model("List", listSchema);




app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));


app.get("/", async (req, res) => {

    var currentDay = new Date().getDay();
    var currentDate = new Date().getDate();
    var currentMonth = new Date().getMonth();


    //Get all the existing tasks
    const usersTasks = await Task.find({listName: "Today"});

    if (usersTasks == 0) {
    //     //Insert new model to the collection
        const defaultTask = new Task({
            listName: "Today",
            name: "Welcome to your ToDoList"
        });
    defaultTask.save();
    //     await Task.insertMany(defaultTasks).then(console.log("Insert Successfully!"));
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
    const listName = "Today";
    // dailyTask.push(newTask);
    // console.log(newTask, dailyTask);

    const task = new Task({
        listName: listName,
        name: userTask
    });
    task.save();
    res.redirect("/");
});

app.post("/deleteMain", async (req, res) => {
    const checkedTaskID = req.body.checkbox;
    await Task.findByIdAndRemove(checkedTaskID).then(console.log("Successfully deleted checked task"));
    res.redirect("/");
});

// app.get("/:userParams", (req, res) => {
//     const userParams = req.params.userParams;

//     const list = new List({
//         name: userParams,
//         items: defaultTasks
//     })
// })

app.get("/work", async (req, res) => {
    const workTasks = await Task.find({listName: "work"});
    res.render("./work.ejs", { tasksList: workTasks});
});

app.post("/submitWork", (req, res) => {
    const newTask = req.body["workList"];
    const listName = "work";
    // workTask.push(newTask);
    const workTask = new Task({
        listName: listName,
        name: newTask
    });
    workTask.save();

    res.redirect("/work");
});

app.post("/deleteWork", async (req, res) => {
    const checkedTaskID = req.body.checkbox;
    await Task.findByIdAndRemove(checkedTaskID).then(console.log("Successfully deleted checked task"));
    res.redirect("/work");
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "December"];
