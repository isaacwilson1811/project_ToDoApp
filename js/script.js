// Array that holds all the TaskList Objects
let allTheLists = [];

// constructor for the TaskList object | takes a string and an array
class TaskList {
    constructor(name, tasks) {
        this.name = name;
        this.tasks = tasks;
    }
}

// example of making a new TaskList
let testList = new TaskList('test',[{text: 'test item', done: false}]);

// adding a task to the new list
testList.tasks.push({text: 'another thing', done: false});
// adding the taskList to allTheLists
allTheLists.push(testList);
console.log(allTheLists);