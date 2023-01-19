class TodoList {
  #domElems;
  #localStorageListName;
  #listId;

  constructor(listName, listId, docElem) {
    this.listName = listName;
    this.#localStorageListName = this.#createLocalStorageName(listId);
    this.list = this.#getList();
    this.#initDOM(docElem, listName, listId);
    this.#domElems = this.#defineDOMElems(listId);
    this.#displayList(this.list);
    this.#listId = listId;
  }

  #createLocalStorageName(listName) {
    return listName.replace(/\W/g, '');
  }

  #initDOM(docElem, listName, listId) {
    const listHTML = `
      <h1>${listName}</h1>
      <form>
        <input class="item" name="item" type="text">
        <button type="button" class="submit-button">Submit</button>
      </form>
      <div class="tasks"></div>
      <button class="clear">Clear Button</button>
   `;
    const div = document.createElement("div");
    div.id = listId;
    div.innerHTML = listHTML;
    docElem.appendChild(div);
  }

  #defineDOMElems(listId) {
    const elems = {
      itemInput: document.querySelector(`#${listId} .item`),
      submitButton: document.querySelector(`#${listId} .submit-button`),
      clearButton: document.querySelector(`#${listId} .clear`),
      tasksElem: document.querySelector(`#${listId} .tasks`)
    };
    elems.submitButton.addEventListener("click", this.#submit.bind(this));
    return elems;
  }

  #getList() {
    return JSON.parse(localStorage.getItem(this.#localStorageListName)) || [];
  }

  #toggleItemCheckbox(event) {
    const itemId = event.currentTarget.id;
    const pElem = document.getElementById(itemId);
    const status = !this.#getItemStatus(itemId);
    pElem.querySelector('input').checked = status
    this.#updateItemStatus(itemId, status);
  }

  #displayList(items) {
    items.forEach(({ description, status, id }) => {
      const p = document.createElement("p");
      p.id = id;
      const checked = status ? "checked" : "";
      p.innerHTML = `${description} <input type="checkbox" ${checked}/>`;
      p.addEventListener('click', this.#toggleItemCheckbox.bind(this));
      this.#domElems.tasksElem.appendChild(p);
    });
  }

  #updateLocalStorage(items) {
    localStorage.setItem(this.#localStorageListName, JSON.stringify(items));
  }

  #getListIndex(id) {
    return +id.replace(`${this.#listId}-item`, '');
  }

  #addItem(item) {
    const newItem = {
      description: item,
      status: false,
      id: `${this.#listId}-item${this.list.length}`
    };
    this.list.push(newItem);
    this.#displayList([newItem]);
    this.#updateLocalStorage(this.list);
  }

  #getItemStatus(id) {
    return this.list[this.#getListIndex(id)].status;
  }

  #updateItemStatus(id, status) {
    const itemIndex = this.#getListIndex(id);
    this.list[itemIndex] = { ...this.list[itemIndex], status };
    this.#updateLocalStorage(this.list);
  }

  #submit() {
    const item = this.#domElems.itemInput.value;
    if (item !== "") {
      this.#addItem(item)
      this.#domElems.itemInput.value = "";
    }
  }
}

const groceryList = new TodoList('Grocery List', 'grocery-list', document.body);
const homeProjectList = new TodoList('Home Project List', 'home-project-list', document.body);
