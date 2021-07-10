// get the task name
var inp = document.querySelector(".taskname");

// list for the tasks
var list = document.querySelector(".tasklist");

// add the tasks 
var addTask = document.querySelector(".btnTask");

// clear all tasks
var taskClear = document.querySelector(".btnClear");


// array that will have all the tasks.
var taskList = [];



// function that will create li for the task.
function render(ele) {
    list.innerHTML = "";
    ele.forEach(e => {
        let newElement = document.createElement("li");
        newElement.innerHTML = e;
        newElement.classList.add("list-group-item");
        list.appendChild(newElement);
    });
}


addTask.addEventListener("click", function () {
    if (inp.value !== "") {
        taskList.push(inp.value);
        inp.value = "";
        render(taskList);
        taskClear.style.display = "block";
        // localstorage can only store primitive values hence we are stringify it.
        localStorage.setItem("mylist", JSON.stringify(taskList));
    }
});

// store it to the local storage of the browser.
let saved = localStorage.getItem("mylist");
if (saved) {
    taskList = JSON.parse(localStorage.getItem("mylist"));
    render(taskList);
} else {
    taskClear.style.display = "none";
}


// line-through the task by single click.


list.addEventListener('click', function (evt) {
    let clickedTask = evt.target;
    console.log(evt)
    clickedTask.style.textDecoration = "line-through";
    clickedTask.style.textDecorationColor = "red";
})

// delete the task on double click.
list.addEventListener('dblclick', function (evnt) {
    let clickedTask_del = evnt.target;
    clickedTask_del.remove();
    return

})


// clear all the tasks
taskClear.addEventListener("click", function () {
    localStorage.clear();
    list.innerHTML = "";
    taskList = [];
    taskClear.style.display = "none";
});
