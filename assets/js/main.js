
// 0.1 ao carregar a página exibe as tarefas salvas no localStorage ou exibe mensagem informando que não há tarefas salvas.
window.onload = function () {
    printTasksOnload()
}

// 1. Função de entrada de dados (disparada no botão de adcionar tarefas). 
// 1.2 Adiciona tarefas, coletadas no input, ao Array de tarefas. Salva dados no local storage, limpa input e atualiza dados impressos na tela.



function sendTask() {

    document.querySelector('.contentWarn').innerHTML = '';
    const tasksInputData = document.querySelector('#taskInput');
    salvedata();
    printTasksOnClick(tasksInputData.value);
    clearInput(tasksInputData);


};



// 2. Funções



function DOMConstructor(elem, elem2, elem3, attribute) {

    let element = document.createElement(elem);
    element.setAttribute(attribute, elem2);
    return elem3 === '.m-content_C' ? document.querySelector(elem3).appendChild(element) : elem3.appendChild(element)
}


function clearInput(input) {
    input.value = '';
}


function salvedata() {

    let tasksList = document.querySelectorAll('.c-tasks__label');
    let tasksArray = [];
    for (let tarefa of tasksList) {
        let taskText = tarefa.innerText;
        tasksArray.push(taskText);
    };
    console.log(tasksArray)
    const tasksJSON = JSON.stringify(tasksArray);
    localStorage.setItem('TasksData', tasksJSON)
};



function printTasksOnClick(argument) {
    let divContentTask = DOMConstructor("div", "m-content__tasks", ".m-content_C", 'class');
    let inputCheckBox = DOMConstructor("input", "checkbox", divContentTask, 'type');
    inputCheckBox.setAttribute('class', 'c-tasks__checkbox')
    inputCheckBox.setAttribute('id', 'checkboxTask')
    let labelForCheckbox = DOMConstructor("label", "c-tasks__label", divContentTask, 'class');
    labelForCheckbox.setAttribute('for', 'checkboxTask');
    labelForCheckbox.innerText = argument;
    let btnRemoveTask = DOMConstructor("button", "c-tasks__btnRemove", divContentTask, 'class');
    btnRemoveTask.innerText = 'Remover Tarefa';
}




function printTasksOnload() {
    const tasksFromlocal = JSON.parse(localStorage.getItem('TasksData')) || [];
    const contentWarn = document.querySelector('.contentWarn')

    if (tasksFromlocal.length > 0) {
        tasksFromlocal.forEach((task) => {

            let divContentTask = DOMConstructor("div", "m-content__tasks", ".m-content_C", 'class');
            let inputCheckBox = DOMConstructor("input", "checkbox", divContentTask, 'type');
            inputCheckBox.setAttribute('class', 'c-tasks__checkbox')
            inputCheckBox.setAttribute('id', 'checkboxTask')
            let labelForCheckbox = DOMConstructor("label", "c-tasks__label", divContentTask, 'class');
            labelForCheckbox.setAttribute('for', 'checkboxTask');
            labelForCheckbox.innerText = task;
            let btnRemoveTask = DOMConstructor("button", "c-tasks__btnRemove", divContentTask, 'class');
            btnRemoveTask.innerText = 'Remover Tarefa';
        });
    } else {
        
        contentWarn.innerHTML = `<p>No momento não há tarefas adicionadas, experimente adicionar alguma tarefa, ajuda você a organizar o seu dia!</p>`
    }
}





document.addEventListener('click', (e) => {
    e.preventDefault()
    let el = e.target
    console.log(el)
    if (el.classList.contains('c-tasks__btnRemove')) {
        el.parentElement.remove()
        salvedata()
    }
    if (el.classList.contains('c-tasks__checkbox') || el.classList.contains('c-tasks__label')) {
        el.parentElement.style = 'text-decoration: line-through; background-color: RGBA( 139, 0, 0, 0.1)'
        console.log('entrou')
        salvedata()
    }


})