var pageContentEl = document.querySelector("#page-content");

var taskIdCounter = 0;
var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");

var tasksInProgressEl = document.querySelector("#tasks-in-progress");
var tasksCompletedEl = document.querySelector("#tasks-completed");

var tasks = [];

var taskFormHandler = function(event) {
    event.preventDefault();

    var taskNameInput = document.querySelector("input[name='task-name']").value;
    var taskTypeInput = document.querySelector("select[name='task-type']").value;

    // check if input values are empty strings
    if (!taskNameInput || !taskTypeInput) {
        alert('You need to fill out the task form!');
        return false;
    }

    // what's this for??
    formEl.reset();

    // see if a task in the form already has the task id attribute
    var isEdit = formEl.hasAttribute("data-task-id");

    // if it has the data attribute, get task id and call function to complete EDIT process
    if (isEdit) {
        var taskId = formEl.getAttribute("data-task-id");
        completeEditTask(taskNameInput, taskTypeInput, taskId);
    }
    // if it does NOT have a data attribute, create object as normal and pass to createTaskEl function (like adding a new task then), which makes sense why the status starts on "to do" for a newly added task
    else {
        var taskDataObj = {
            name: taskNameInput,
            type: taskTypeInput,
            status: "to do"
        };
        // pass this object into our function that will create a new task
        createTaskEl(taskDataObj);
    }
};

// create a new task
var createTaskEl = function(taskDataObj) {
    // create list item
    var listItemEl = document.createElement("li");
    listItemEl.className = "task-item";

    // add task id as a custom attribute
    listItemEl.setAttribute("data-task-id", taskIdCounter);

    // create div to hold task info and add to list item
    var taskInfoEl = document.createElement("div");
    //give it a class name
    taskInfoEl.className = "task-info";
    // add HTML content to div
    taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";

    // add div content to list item
    listItemEl.appendChild(taskInfoEl);

    // pass taskIdCounter in createTaskActions to create buttons that correspond to the current task id
    var taskActionsEl = createTaskActions(taskIdCounter);
    // add task action items (edit, delete, task status) to list item
    listItemEl.appendChild(taskActionsEl);

    // add entire list item to unordered list
    tasksToDoEl.appendChild(listItemEl);

    // we already have a value of the id in this function - taskIdCounter - just need to add that value as a property to the taskDataObj object
    taskDataObj.id = taskIdCounter;

    // add the object to the tasks array
    tasks.push(taskDataObj);
    // increase task counter for next unique id
    taskIdCounter++;

};

var createTaskActions = function(taskId) {
    var actionContainerEl = document.createElement('div');
    actionContainerEl.className = 'task-actions';

    // create edit button
    var editButtonEl = document.createElement('button');
    editButtonEl.textContent = 'Edit';
    editButtonEl.className = 'btn edit-btn';
    editButtonEl.setAttribute('data-task-id', taskId);

    // add edit button to action container div
    actionContainerEl.appendChild(editButtonEl);

    // create delete button
    var deleteButtonEl = document.createElement('button');
    deleteButtonEl.textContent = 'Delete';
    deleteButtonEl.className = 'btn delete-btn';
    deleteButtonEl.setAttribute('data-task-id', taskId);

    // add delete button to action container div
    actionContainerEl.appendChild(deleteButtonEl);

    // create task status dropdown menu
    var statusSelectEl = document.createElement('select');
    statusSelectEl.className = 'select-status';
    statusSelectEl.setAttribute('name', 'status-change');
    statusSelectEl.setAttribute('data-task-id', taskId);

    // add task status dropdown menu to the action container div
    actionContainerEl.appendChild(statusSelectEl);

    var statusChoices = ['To Do', 'In Progress', 'Completed'];

    for (var i = 0; i < statusChoices.length; i++) {
        // create option element
        var statusOptionEl = document.createElement('option');
        statusOptionEl.textContent = statusChoices[i];
        statusOptionEl.setAttribute('value', statusChoices[i]);

        // append status options to select (dropdown menu)
        statusSelectEl.appendChild(statusOptionEl);
    }

    // verify that the correct data is returned
    return actionContainerEl;
};

formEl.addEventListener("submit", taskFormHandler);

var taskButtonHandler = function(event) {
    // get target element from event
    var targetEl = event.target;

    // edit button was clicked
    if (targetEl.matches(".edit-btn")) {
        var taskId = targetEl.getAttribute("data-task-id");
        editTask(taskId);
    }
    // delete button was clicked
    else if (targetEl.matches(".delete-btn")) {
        var taskId = targetEl.getAttribute("data-task-id");
        deleteTask(taskId);
    }
};

// edit a task
var editTask = function(taskId) {
    console.log("editing task #" + taskId);

    // get task list item element
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    // get content from task name and type
    var taskName = taskSelected.querySelector("h3.task-name").textContent;
    var taskType = taskSelected.querySelector("span.task-type").textContent;

    document.querySelector("input[name='task-name']").value = taskName;
    document.querySelector("select[name='task-type']").value = taskType;
    document.querySelector("#save-task").textContent = "Save Task";

    // save edited info, add taskId to data-task-id attribute on the form itself
    formEl.setAttribute("data-task-id", taskId);
}

// refer to taskFormHandler above
var completeEditTask = function(taskName, taskType, taskId) {
    // find the matching task list item using taskId
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    // set new values of edited task
    taskSelected.querySelector("h3.task-name").textContent = taskName;
    taskSelected.querySelector("span.task-type").textContent = taskType;

    alert("Task Updated!");

    // update task's in tasks array, loop through tasks array and task object with new content, check to see if the specific task's id property matches the taskId argument that was passed into completeEditTask()
    for (var i = 0; i < tasks.length; i++) {
        // parse will convert string data to numerical data, then we can compare (couldn't we use == ?), if the value equals true, then the new values for taskName and taskType will be updated on the task we are looking at
        if (tasks[i].id === parseInt(taskId)) {
            tasks[i].name = taskName;
            tasks[i].type = taskType;
        }
    };

    // remove the task Id from the form element so new tasks can be made again and change the button text back to normal
    formEl.removeAttribute("data-task-id");
    document.querySelector("#save-task").textContent = "Add Task";
};

// delete a task
var deleteTask = function(taskId) {
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    taskSelected.remove();

    // create new array to hold updated list of tasks
    var updatedTaskArr = [];

    // loop through current tasks
    for (var i = 0; i < tasks.length; i++) {
        // if tasks[i].id doesn't match the value of taskId, let's keep that task - it will get added to a new arry called updatedTaskArr which will end up updating the value of the tasks array (so that it leaves out any deleted tasks)
        if (tasks[i].id !== parseInt(taskId)) {
            updatedTaskArr.push(tasks[i]);
        }
    }
    // reassign tasks array to be the same as updatedTaskArr
    tasks = updatedTaskArr;
};

// change the task status, event.target is a reference to a <select> element
var taskStatusChangeHandler = function(event) {
    // get the task item's id
    var taskId = event.target.getAttribute("data-task-id");

    // get the currently selected option's value and convert to lowercase, helps to future-proof the app in case the status text is ever displayed differently
    var statusValue = event.target.value.toLowerCase();

    // find the parent task item element based on the id
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    // remember that tasksToDoEl, tasksInProgressEl, and tasksCompletedEl are references to the <ul> elemented created earlier
    if (statusValue === "to do") {
        tasksToDoEl.appendChild(taskSelected);
    }

    else if (statusValue === "in progress") {
        tasksInProgressEl.appendChild(taskSelected);
    }

    else if (statusValue === "completed") {
        tasksCompletedEl.appendChild(taskSelected);
    }

    // update task's in tasks array
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(taskId)) {
            tasks[i].status = statusValue;
        }
    };
};

pageContentEl.addEventListener("click", taskButtonHandler);
pageContentEl.addEventListener("change", taskStatusChangeHandler);