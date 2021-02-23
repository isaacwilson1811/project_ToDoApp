const listDisplay = document.getElementById('listDisplay');
const selectedListDisplay = document.getElementById('selectedListDisplay');
const taskDisplay = document.getElementById('taskDisplay');
const newTaskBTN = document.getElementById('newTaskBTN');
const deleteDoneBTN = document.getElementById('deleteDoneBTN');

// Array that holds all the TaskList Objects
let allTheLists = [];
// the index of the currently selected list | -1 is default for none
let selectedListIndex = -1;

// Class template constructor for the TaskList object | takes a uid, name and an array
class TaskList {
    constructor(uid, name) {
        this.uid = uid;
        this.name = name;
        this.selected = false;
        this.tasks = [];
    }
}

// Class template for each task item
class TaskItem{
    constructor(uid,text){
        this.uid = uid;
        this.text = text;
        this.done = false;
    }
}

// make unique id | thanks stack overflow
function uid(){
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// find the index of an object in an array of objects by a property value (uid) 
function findTheIndexOfThisPropVal(array, prop, val) {
    for(let i = 0; i < array.length; i++) {
        if(array[i][prop] === val) {
            return i;
        }
    }
    return -1;
}

//swap index in array
function swapIndex(array, indexA, indexB){
    let swap = array[indexA];
    array[indexA] = array[indexB];
    array[indexB] = swap;
}

window.onload = function(){
    render();
}

function clickNewList(){
    let name = window.prompt('Enter name of new Task List', 'New Task List');
    if (name === null || name === '') return;
    let list = new TaskList(uid(),name);
    allTheLists.unshift(list);
    selectedListIndex = 0;
    render();
}

function clickEditList(uid){
    let index = findTheIndexOfThisPropVal(allTheLists, 'uid', uid);
    let name = window.prompt('Edit the name of this Task List' , allTheLists[index].name);
    if (name === null || name === '') return;
    allTheLists[index].name = name;
    render();
}

function clickDeleteList(uid){
    if(!confirm('Are You Sure?')) return;
    let index = findTheIndexOfThisPropVal(allTheLists, 'uid', uid);
    allTheLists.splice(index, 1);
    if (allTheLists.length === 0){ 
        selectedListIndex = -1;
    }
    render();
}

function clickMoveListUp(uid){
    let indexA = findTheIndexOfThisPropVal(allTheLists, 'uid', uid);
    if (indexA === 0) return;
    let indexB = indexA -1;
    swapIndex(allTheLists, indexA, indexB);
    render();
}

function clickMoveListDown(uid){
    let indexA = findTheIndexOfThisPropVal(allTheLists, 'uid', uid);
    if (indexA === allTheLists.length - 1) return;
    let indexB = indexA +1;
    swapIndex(allTheLists, indexA, indexB);
    render();
}

function selectList(uid){
    selectedListIndex = findTheIndexOfThisPropVal(allTheLists, 'uid', uid);
    render();
}

function clickNewTask(){
    let name = window.prompt('Enter name of new Task', 'New Task');
    if (name === null || name === '') return;
    let task = new TaskItem(uid(),name);
    allTheLists[selectedListIndex].tasks.unshift(task);
    render();
}

// example of making a new TaskList
// let testList = new TaskList(uid(), 'test',[{text: 'test item', done: false}]);

// // adding a task to the new list
// testList.tasks.push({text: 'another thing', done: false});
// // adding the taskList to allTheLists
// allTheLists.push(testList);
// console.log(allTheLists);
function renderTasks(){
    let newHTML = '';
        allTheLists[selectedListIndex].tasks.forEach(function(task){
            let chunkOfHTML = `
<div class="task_chunk">
    <div class="group_col check_container">
        <span>Done</span>
        <input type="checkbox">
    </div>
    <div>
        <p>${task.text}</p>
    </div>
    <div>
        <div class="group_col">
            <button>Move Up</button>
            <button>Move Down</button>
        </div>
        <div class="group_row">
            <button>Edit</button>
            <button>Delete</button>
        </div>
    </div>
</div>


            `;
            newHTML += chunkOfHTML;
        });
        taskDisplay.innerHTML = newHTML;
};



function render(){
    //if there is a selected list
    if (selectedListIndex !== -1){
        selectedListDisplay.innerText = allTheLists[selectedListIndex].name;
        newTaskBTN.style.display = '';
        deleteDoneBTN.style.display = '';
        renderTasks();
    }else{
        selectedListDisplay.innerText = 'You Have Zero Lists';
        newTaskBTN.style.display = "none";
        deleteDoneBTN.style.display = "none";
        taskDisplay.innerHTML = '';
    }
    //render the list of lists
    let newHTML = '';
    allTheLists.forEach(function(list) {
        let chunkOfHTML = `
        <div class="list_chunk" data-${list.uid}">
            <div class="item_center">
                <h3><a class="list_link" href="javascript:selectList('${list.uid}')">${list.name}</a></h3>
            </div>
            <div>
                <div class="group_col">
                    <button onClick="clickMoveListUp('${list.uid}')">Move Up</button>
                    <button onClick="clickMoveListDown('${list.uid}')">Move Down</button>
                </div>
                <div class="group_row">
                    <button onClick="clickEditList('${list.uid}')">Edit</button>
                    <button onClick="clickDeleteList('${list.uid}')">Delete</button>
                </div>
            </div>
        </div>`;
        newHTML += chunkOfHTML;
    });
    listDisplay.innerHTML = newHTML;
}