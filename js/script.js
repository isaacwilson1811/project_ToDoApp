const Data = [];
var selectedListUID = null;
// HTML Elements
const Elm = {
    listDisplay: document.getElementById('listDisplay'),
    selectedListDisplay: document.getElementById('selectedListDisplay'),
    taskDisplay: document.getElementById('taskDisplay'),
    newTaskBTN: document.getElementById('newTaskBTN'),
    deleteDoneBTN: document.getElementById('deleteDoneBTN'),
}

class TaskList {
    constructor(name) {
        this.uid = Helper.genUID();
        this.name = name;
        this.selected = false;
        this.tasks = [];
    }
}

class TaskItem{
    constructor(text){
        this.uid = Helper.genUID();
        this.text = text;
        this.done = false;
    }
}

window.onload = function(){
    render();
}

function clickNewList(){
    let name = window.prompt('Enter name of new Task List', 'New Task List');
    if (name === null || name === '') return;
    let list = new TaskList(name);
    Data.unshift(list);
    selectedListUID = list.uid;
    render();
}

function clickEditList(uid){
    let index = Helper.getIndex(Data, 'uid', uid);
    let name = window.prompt('Edit the name of this Task List' , Data[index].name);
    if (name === null || name === '') return;
    Data[index].name = name;
    render();
}

function clickDeleteList(uid){
    if(!confirm('Are You Sure?')) return;
    let index = Helper.getIndex(Data, 'uid', uid);
    Data.splice(index, 1);
    if (Data.length === 0){ 
        selectedListUID = null;
    } else{
        if (uid === selectedListUID){
            selectedListUID = Data[0].uid;
        }
    }
    render();
}

function clickMoveListUp(uid){
    let indexA = Helper.getIndex(Data, 'uid', uid);
    if (indexA === 0) return;
    let indexB = indexA -1;
    Helper.swapIndex(Data, indexA, indexB);
    render();
}

function clickMoveListDown(uid){
    let indexA = Helper.getIndex(Data, 'uid', uid);
    if (indexA === Data.length - 1) return;
    let indexB = indexA +1;
    Helper.swapIndex(Data, indexA, indexB);
    render();
}

function selectList(uid){
    selectedListUID = uid;
    render();
}

function clickNewTask(){
    let text = window.prompt('Enter name of new Task', 'New Task');
    if (text === null || text === '') return;
    let task = new TaskItem(text);
    let index = Helper.getIndex(Data, 'uid', selectedListUID)
    Data[index].tasks.push(task);
    render();
}

function renderTasks(){
    let newHTML = '';
        let index = Helper.getIndex(Data, 'uid', selectedListUID);
        Data[index].tasks.forEach(function(task){
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
</div>`;
            newHTML += chunkOfHTML;
        });
        Elm.taskDisplay.innerHTML = newHTML;
};



function render(){
    //if there is a selected list
    if (selectedListUID !== null){
        let index = Helper.getIndex(Data, 'uid', selectedListUID);
        Elm.selectedListDisplay.innerText = Data[index].name;
        Elm.newTaskBTN.style.display = '';
        Elm.deleteDoneBTN.style.display = '';
        renderTasks();
    }else{
        Elm.selectedListDisplay.innerText = 'You Have Zero Lists';
        Elm.newTaskBTN.style.display = "none";
        Elm.deleteDoneBTN.style.display = "none";
        Elm.taskDisplay.innerHTML = '';
    }
    //render the list of lists
    let newHTML = '';
    Data.forEach(function(list) {
        let chunkOfHTML = `
        <div class="list_chunk">
            <div class="item_center">
                <h3><a data-id="${list.uid}" class="list_link" href="javascript:selectList('${list.uid}')">${list.name}</a></h3>
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
    Elm.listDisplay.innerHTML = newHTML;
    if (selectedListUID !== null){
        let cssChange = document.querySelector(`[data-id='${selectedListUID}']`);
        cssChange.classList.add('selected');
    }
}

class Helper{
    static genUID(){
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
    static getIndex(arr,prop,val){
        for(let i = 0; i < arr.length; i++) {
            if(arr[i][prop] === val) {
                return i;
            }
        }
        return -1;
    }
    static swapIndex(arr, iA, iB){
        let temp = arr[iA];
        arr[iA] = arr[iB];
        arr[iB] = temp;
    }
}