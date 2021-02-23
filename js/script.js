const listDisplay = document.getElementById('listDisplay');
const listNameDisplay = document.getElementById('listNameDisplay');
const taskDisplay = document.getElementById('taskDisplay');

// Array that holds all the TaskList Objects
let allTheLists = [];

// constructor for the TaskList object | takes a string and an array
class TaskList {
    constructor(uid, name, tasks) {
        this.uid = uid;
        this.name = name;
        this.tasks = tasks;
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

function clickNewList(){
    let name = window.prompt('Enter name of new Task List', 'New Task List');
    if (name === null || name === '') return;
    let list = new TaskList(uid(),name,[]);
    allTheLists.unshift(list);
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

// example of making a new TaskList
// let testList = new TaskList(uid(), 'test',[{text: 'test item', done: false}]);

// // adding a task to the new list
// testList.tasks.push({text: 'another thing', done: false});
// // adding the taskList to allTheLists
// allTheLists.push(testList);
// console.log(allTheLists);

function render(){
    let newHTML = '';
    allTheLists.forEach(function(list) {
        let chunkOfHTML = `
        <div class="list_chunk" data-${list.uid}">
            <div class="item_center">
                <h3><a class="list_link" href="#">${list.name}</a></h3>
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