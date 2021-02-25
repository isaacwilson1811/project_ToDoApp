window.onload = function(){
    render();
}
// Global data variables
const Data = [];
var selectedListUID = null;
// DOM Elements to manipulate
const Elm = {
    listDisplay: document.getElementById('listDisplay'),
    selectedListDisplay: document.getElementById('selectedListDisplay'),
    taskDisplay: document.getElementById('taskDisplay'),
    // I show and hide these buttons with a classs toggle
    newTaskBTN: document.getElementById('newTaskBTN'),
    deleteDoneBTN: document.getElementById('deleteDoneBTN'),
}
// Data Object Class Constructors
class TaskList {
    constructor(name) {
        this.uid = Helper.genUID();
        this.name = name;
        this.items = [];
    }
}
class TaskItem{
    constructor(text){
        this.uid = Helper.genUID();
        this.text = text;
        this.done = false;
    }
}
// Click Event Static Methods
class Event{
    static selectList(uid){
        selectedListUID = uid;
        render();
    }
    static newList(){
        let timestamp = new Date().toUTCString();
        let name = window.prompt('Enter the name of this list', 'New List: '+ timestamp);
        if (name === null || name === '') return;
        let list = new TaskList(name);
        Data.unshift(list);
        selectedListUID = list.uid;
        render();
    }
    static editList(uid){
        let index = Helper.getIndex(Data, 'uid', uid);
        let name = window.prompt('Edit the name of this List' , Data[index].name);
        if (name === null || name === '') return;
        Data[index].name = name;
        render();
    }
    static deleteList(uid){
        let index = Helper.getIndex(Data, 'uid', uid);
        if(!confirm('Are you sure you want to delete '+Data[index].name+'?')) return;
        Data.splice(index, 1);
        if (Data.length === 0){ 
            selectedListUID = null;
        }else if (uid === selectedListUID){
            selectedListUID = Data[0].uid;
        }
        render();
    }
    static moveListUp(uid){
        let indexA = Helper.getIndex(Data, 'uid', uid);
        if (indexA === 0) return;
        let indexB = indexA -1;
        Helper.swapIndex(Data, indexA, indexB);
        render();
    }
    static moveListDown(uid){
        let indexA = Helper.getIndex(Data, 'uid', uid);
        if (indexA === Data.length - 1) return;
        let indexB = indexA +1;
        Helper.swapIndex(Data, indexA, indexB);
        render();
    }
}

function clickNewTask(){
    let text = window.prompt('Enter name of new Task', 'New Task');
    if (text === null || text === '') return;
    let task = new TaskItem(text);
    let index = Helper.getIndex(Data, 'uid', selectedListUID)
    Data[index].items.push(task);
    render();
}

function renderTasks(){
    let index = Helper.getIndex(Data, 'uid', selectedListUID);
    let newHTML = '';
    Data[index].items.forEach(function(task){
        let chunkOfHTML = `
            <div class="task_chunk">
                <div class="group_col check_container">
                    <span>Done</span>
                    <input type="checkbox">
                </div>
                <div>
                    <p>${Helper.sanitize(task.text)}</p>
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
            <div onClick="Event.selectList('${list.uid}')" class="list_name_container">
                <h3 data-id="${list.uid}">${Helper.sanitize(list.name)}</h3>
            </div>
            <div>
                <div class="group_col">
                    <button onClick="Event.moveListUp('${list.uid}')">Move Up</button>
                    <button onClick="Event.moveListDown('${list.uid}')">Move Down</button>
                </div>
                <div class="group_row">
                    <button onClick="Event.editList('${list.uid}')">Edit</button>
                    <button onClick="Event.deleteList('${list.uid}')">Delete</button>
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
    static sanitize(dirty) {
        let element = document.createElement('div');
        element.innerText = dirty;
        let clean = element.innerHTML;
        element.remove();
        return clean;
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