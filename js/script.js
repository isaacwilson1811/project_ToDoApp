window.onload = function(){
    Display.render();
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
/* ~~~~~~~~~~~~~~~LIST FUNCTIONS~~~~~~~~~~~~~~~~~~~~ */
    static selectList(uid){
        selectedListUID = uid;
        Display.render();
    }
    static newList(){
        let timestamp = new Date().toUTCString();
        let name = window.prompt('Enter the name of this list', 'New List: '+ timestamp);
        if (name === null || name === '') return;
        let list = new TaskList(name);
        Data.unshift(list);
        selectedListUID = list.uid;
        Display.render();
    }
    static editList(uid){
        let index = Helper.getIndex(Data, 'uid', uid);
        let name = window.prompt('Edit the name of this List' , Data[index].name);
        if (name === null || name === '') return;
        Data[index].name = name;
        Display.render();
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
        Display.render();
    }
    static moveListUp(uid){
        let indexA = Helper.getIndex(Data, 'uid', uid);
        if (indexA === 0) return;
        let indexB = indexA -1;
        Helper.swapIndex(Data, indexA, indexB);
        Display.render();
    }
    static moveListDown(uid){
        let indexA = Helper.getIndex(Data, 'uid', uid);
        if (indexA === Data.length - 1) return;
        let indexB = indexA +1;
        Helper.swapIndex(Data, indexA, indexB);
        Display.render();
    }
/* ~~~~~~~~~~~~~~~ITEM FUNCTIONS~~~~~~~~~~~~~~~~~~~~ */
    static newItem(){
    let text = window.prompt('Enter name of this task', 'Do This Thing');
    if (text === null || text === '') return;
    let task = new TaskItem(text);
    Data[Helper.selectedListIndex()].items.push(task);
    Display.render();
    }
}

class Display{
    static render(){
        if (selectedListUID !== null){Display.renderItems()};
        Display.renderLists();
    }
    static renderItems(){
        let buffer = '';
        Data[Helper.selectedListIndex()].items.forEach(function(item){
            let html = `
                <div class="item_chunk">
                    <div class="group_col check_container">
                        <span>Done</span>
                        <input type="checkbox">
                    </div>
                    <div>
                        <p>${Helper.sanitize(item.text)}</p>
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
            buffer += html;
        });
        Elm.taskDisplay.innerHTML = buffer;
        Elm.selectedListDisplay.innerText = Data[Helper.selectedListIndex()].name;
    }
    static renderLists(){
        let buffer = '';
        Data.forEach(function(list) {
            let chunk = `
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
            buffer += chunk;
        });
        Elm.listDisplay.innerHTML = buffer;
        Display.styleUpdate();
    }
    static styleUpdate(){
        switch(selectedListUID !== null ? true : false){
            // We have at least one list and of course it's selected (by design)
            case true:
                document.querySelector(`[data-id='${selectedListUID}']`).classList.add('selected');
                Elm.newTaskBTN.style.display = '';
                Data[Helper.selectedListIndex()].items.length != 0 ? Elm.deleteDoneBTN.style.display = '' : Elm.deleteDoneBTN.style.display = 'none';
                break;
            // We have no lists
            case false:
                Elm.selectedListDisplay.innerText = 'You Have Zero Lists';
                Elm.newTaskBTN.style.display = 'none';
                Elm.taskDisplay.innerHTML = '';
                Elm.deleteDoneBTN.style.display = 'none';
                break;
        }
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
    static selectedListIndex(){
        return Helper.getIndex(Data, 'uid', selectedListUID);
    }
}