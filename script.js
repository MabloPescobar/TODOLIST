

// Valitaan to do lista
const todoLomake = document.querySelector('.todo-lomake');
// valitaan syöttökenttä
const todoSyote = document.querySelector('.todo-syote');
// valitaan lista class="TavaraLista"
const todoTavaraLista = document.querySelector('.todo-tavarat');

// kenttä mikä tallentaa kaikki to do:t
let todos = [];

// lisätään kuuntelija palautus tapahtumalle (Submit)
todoLomake.addEventListener('submit', function(event) {
  // Estetään sivun uudelleen latautuminen
  event.preventDefault();
  // pyydetään lisätty merkkijono syöttö kentästä (todoSyote)
  addTodo(todoSyote.value); 
});

// Lisää listalle syötetyn merkkijonon 
function addTodo(item) {
  // jos kentässä on jotain
  if (item !== '') {
    // luo to do objektin millä on id, name ja completed true/false
    const todo = {
      id: Date.now(),
      name: item,
      completed: false
    };

    // Työnnetään todo kenttään let todos
    todos.push(todo);
    //lisätään tieto selaimen paikalliseen muistiin
    addToLocalStorage(todos); 

    // Tyhjennetään syöttökenttä
    todoSyote.value = '';
    
  }
}

// tällä funktiolla lajitellaan annetut todot näytölle
function renderTodos(todos) {
  // tyhjentää kaiken <ul> sisällä luokalla class=todo-tavarat
  todoTavaraLista.innerHTML = '';

  // käy läpi kaiken todojen sisällä
  todos.forEach(function(item) {
    // tarkistaa onko tehtävä suoritettu
    const checked = item.completed ? 'checked': null;

    // luo listan <li> ja täyttää sen
    
    const li = document.createElement('li');
    li.setAttribute('class', 'item');
  
    li.setAttribute('data-key', item.id);
   
    // jos on suoritettu lisätään luokka <li> nimeltä 'checked', joka lisää yliviivauksen
    if (item.completed === true) {
      li.classList.add('checked');
    }

    li.innerHTML = `
      <input type="checkbox" class="checkbox" ${checked}>
      ${item.name}
      <button class="delete-button">X</button>
    `;
    // lisätään li ul:llään
    todoTavaraLista.append(li);
  });

}

// lisätään todo:t localstorageen
function addToLocalStorage(todos) {

  localStorage.setItem('todos', JSON.stringify(todos));
  // järjestää
  renderTodos(todos);
}

// saadaan todo:t localstoragesta
function getFromLocalStorage() {
  const reference = localStorage.getItem('todos');

  if (reference) {
  
    todos = JSON.parse(reference);
    renderTodos(todos);
  }
}

// annetaan arvo suoritettu tai ei suoritettu
function toggle(id) {
  todos.forEach(function(item) {
    
    if (item.id == id) {
      // säädetään arvo
      item.completed = !item.completed;
    }
  });

  addToLocalStorage(todos);
}

// poistaa todon ja päivttää arvon localstorageen
function deleteTodo(id) {
  todos = todos.filter(function(item) {
    
    return item.id != id;
  });

  // päivittää localstoragen
  addToLocalStorage(todos);
}

// haetaan localstoragesta
getFromLocalStorage();

// lisätään addEventListener <ul> class=todoTavarat kanssa. jotta tiedetää kaikki tapahtumat checkboxeissa ja poisto nappuloissa (delete)
todoTavaraLista.addEventListener('click', function(event) {
  // tarkistetaan onko kohde "checkboxissa"
  if (event.target.type === 'checkbox') {
    // säädetään tila
    toggle(event.target.parentElement.getAttribute('data-key'));
  }

  // tarkistetaan onko poisto nappula (delete)
  if (event.target.classList.contains('delete-button')) {
    // Hankitaan id vanhemman data-keyn atributesta missä <li> poisto nappi on voimassa 
    deleteTodo(event.target.parentElement.getAttribute('data-key'));
  }
});
