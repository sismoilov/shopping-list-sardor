const itemForm = document.getElementById("item-form");
const itemInput = document.getElementById("item-input");
const itemList = document.getElementById("item-list");
const clearBtn = document.getElementById("clear");
const itemFilter = document.getElementById("filter");
const formBtn = itemForm.querySelector("button");
let isEditMode = false;


function displayToScreen(){
  const itemsFromStorage = getItemsFromStorage();

  itemsFromStorage.forEach((item) => addItemToDom(item));
  checkUI();
}


function  onAddItemSubmit(e){
    e.preventDefault();
   const newItem = itemInput.value;

   if(newItem === ""){
    alert("Please add an item!")
    return;
   }

   if(isEditMode){
    const itemToEdit = itemList.querySelector(".edit-mode");

    removeItemFromStorage(itemToEdit.textContent);
    itemToEdit.classList.remove("edit-mode");
    itemToEdit.remove();

    isEditMode = false;
   } else{
    if(checkIfItemExist(newItem)){
        alert("This item is already exists!");
        return;
    }
   }
   //create item dom element
   addItemToDom(newItem);

   // create item to local storage
   addToLocalStorage(newItem);   
   checkUI();
   itemInput.value = "";
}
 



function addItemToDom(item){
    const li = document.createElement("li");
   li.appendChild(document.createTextNode(item));

   const button = createButton("remove-item btn-link text-red");  
   li.appendChild(button);
   itemList.appendChild(li);

}


function addToLocalStorage(item){
   const itemsFromStorage = getItemsFromStorage();
   
   itemsFromStorage.push(item);
   localStorage.setItem("items", JSON.stringify(itemsFromStorage));
}

function getItemsFromStorage(item){
    let itemsFromStorage;

   if(localStorage.getItem("items") === null){
    itemsFromStorage = [];
   }else{
    itemsFromStorage = JSON.parse(localStorage.getItem("items"));
   }
   return itemsFromStorage;
}


function createButton(classes){
    const button = document.createElement("button");
    button.className = classes;
    const icon = createIcon("fa-solid fa-xmark");
    button.appendChild(icon);
    return button;
}


function createIcon(classes){
    const icon = document.createElement("i");
    icon.className = classes;
    return icon;
}


function onClickItem(e){
    if(e.target.parentElement.classList.contains("remove-item")){
       removeItem(e.target.parentElement.parentElement);
    }else{
        setItemToEdit(e.target);
    }
}


function checkIfItemExist(item){
    const itemFromStorage = getItemsFromStorage();
    return itemFromStorage.includes(item);
}

function setItemToEdit(item) {
    isEditMode = true;

    itemList.querySelectorAll("li").forEach((i) => i.classList.remove("edit-mode"));

    item.classList.add("edit-mode");
    formBtn.innerHTML ='<i class="fa-solid fa-pen"></i>   Update Item';
    formBtn.style.backgroundColor = "#228B22"
    itemInput.value = item.textContent;
    

}
 
function removeItem(item) {
   if(confirm("Are you sure?")){
    item.remove();

    /// remove from storage
    removeItemFromStorage(item.textContent);
    checkUI();
   }
}

function  removeItemFromStorage(item){
    let itemsFromStorage = getItemsFromStorage();

    itemsFromStorage = itemsFromStorage.filter((i)=>  i !== item);

    //resetlocal storage
    localStorage.setItem("items", JSON.stringify(itemsFromStorage));
}


function clearItems() {
    // if(confirm("Are you sure?")){
    //     itemList.innerHTML="";
    // }
        while (itemList.firstChild) {
          itemList.removeChild(itemList.firstChild);
        }
        //local storage
        localStorage.removeItem("items");
      checkUI();
}


function checkUI() {
    itemInput.value = "";

    const items = itemList.querySelectorAll("li");
    if(items.length === 0) {
        clearBtn.style.display = "none";
        itemFilter.style.display = "none";
    } else{
        clearBtn.style.display = "block";
        itemFilter.style.display = "block";
        
    }

    formBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
    formBtn.style.backgroundColor = "#333";

    isEditMode = false;
}


function filterItems(e) {
    const items = itemList.querySelectorAll("li");
   const text = e.target.value.toLowerCase();

   items.forEach((item) =>{
    const itemName = item.firstChild.textContent.toLocaleLowerCase();

    if(itemName.indexOf(text) != -1){
        item.style.display = "flex";
    }else{
        item.style.display = "none";
    }
   });
}


itemForm.addEventListener("submit", onAddItemSubmit);
itemList.addEventListener("click", onClickItem);
clearBtn.addEventListener("click", clearItems);
itemFilter.addEventListener("input", filterItems)
document.addEventListener("DOMContentLoaded", displayToScreen);
checkUI();
