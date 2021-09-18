// 0.1 ao carregar a página exibe as tarefas salvas no localStorage ou exibe mensagem informando que não há tarefas salvas.
window.onload = function () {
    printTasksOnload()
};


// 1. Função de entrada de dados (disparada no botão de adcionar tarefas). 
// Adiciona tarefas, coletadas no input, ao Array de tarefas. Salva dados no local storage, limpa input, atualiza dados impressos na tela
// e retorna mensagem de erro caso usuário tente enviar tarefa em branco.

function sendTask() {
    const tasksInputData = document.querySelector('#taskInput');
    if (tasksInputData.value === '') {
        let warning = document.querySelector('.contentWarn');
        warning.style = 'display: block;';
        warning.innerText = `Impossível adicionar tarefa em branco.`;
        animationO('faded-out', warning)
        setTimeout(function () {
            warning.style = 'display: none;';
        }, 1750);
        return;
    } else {
        document.querySelector('.contentAdvise').style = 'display: none';
        printTasksOnClick(tasksInputData.value);
        salvedata();
        clearInput(tasksInputData);
    };
};

// 1.2 dispara função acima ao usuário pressionar tecla enter no input de tarefas

document.querySelector('#taskInput').addEventListener('keypress', function (e) {
    if (e.keyCode === 13) {
        sendTask();
    };
});

// 2. Funções

// 2.1 Função construtora de elementos do DOM.
function DOMConstructor(elem, elem2, elem3, attribute) {

    let element = document.createElement(elem);
    element.setAttribute(attribute, elem2);
    return elem3 === '.m-content_C' ? document.querySelector(elem3).appendChild(element) : elem3.appendChild(element);
}

// 2.2 Função para limpar input
function clearInput(input) {
    input.value = '';
}

// 2.3 Função para salvar dados no localStorage (retirados da HTML), e atualizar marcação ou remoção dos dados no localStorage.
function salvedata() {

    let tasksList = document.querySelectorAll('.c-tasks__label');
    let tasksArray = [];
    for (let task of tasksList) {
        let taskText = { name: task.innerText, markup: 0 };
        // 2.3.1 se a tarefa foi marcada insere 1 na propriedade "markup"
        if (task.parentElement.id === 'checked') {
            taskText.markup = 1;
        }
        tasksArray.push(taskText);
    };
    const tasksJSON = JSON.stringify(tasksArray);
    localStorage.setItem('TasksData', tasksJSON);
};

// 2.4 função para imprimir dados no HTML após o clique do usuário.
function printTasksOnClick(argument) {
    let divContentTask = DOMConstructor("div", "m-content__tasks", ".m-content_C", 'class');
    animationO('faded-out', divContentTask)
    let inputCheckBox = DOMConstructor("input", "checkbox", divContentTask, 'type');
    inputCheckBox.setAttribute('class', 'c-tasks__checkbox')
    inputCheckBox.setAttribute('id', 'checkboxTask')
    let labelForCheckbox = DOMConstructor("label", "c-tasks__label", divContentTask, 'class');
    labelForCheckbox.innerText = argument;
    let btnRemoveTask = DOMConstructor("button", "c-tasks__btnRemove", divContentTask, 'class');
    btnRemoveTask.innerText = 'Remover Tarefa';
}

// 2.5 função para imprimir dados do localStorage após o carregamento da página, se não houver dados retorna mensagem.
function printTasksOnload() {
    const tasksFromlocal = JSON.parse(localStorage.getItem('TasksData')) || [];
    const contentAdvise = document.querySelector('.contentAdvise');
    if (tasksFromlocal.length > 0) {
        tasksFromlocal.forEach((task) => {

            let divContentTask = DOMConstructor("div", "m-content__tasks", ".m-content_C", 'class');
            animationO('faded-out', divContentTask)
            let inputCheckBox = DOMConstructor("input", "checkbox", divContentTask, 'type');
            inputCheckBox.setAttribute('class', 'c-tasks__checkbox');
            inputCheckBox.setAttribute('id', 'checkboxTask');
            // 2.5.1 se tarefa foi marcada com 1 no atributo markup, recebe ID checked para estilização e Checkbox é marcado.
            if (task.markup === 1) {
                divContentTask.setAttribute('id', 'checked');
                inputCheckBox.checked = true;
            }
            let labelForCheckbox = DOMConstructor("label", "c-tasks__label", divContentTask, 'class');
            labelForCheckbox.innerText = task.name;
            let btnRemoveTask = DOMConstructor("button", "c-tasks__btnRemove", divContentTask, 'class');
            btnRemoveTask.innerText = 'Remover Tarefa';
        });
    } else {
        contentAdvise.style = "display:block;";
        animationO('faded-out', contentAdvise);
    }
};

// 2.6 função para invocar jQuerry window de confirmacao de exclusao de tarefa.
function deleteConfirmation(arg) {
    $.confirm({
        useBootstrap: false,
        boxWidth: '30%',
        textAlign: 'center',
        title: 'Deseja excluir a tarefa?',
        content: '',
        buttons: {
            formSubmit: {
                text: 'Excluir',
                btnClass: 'btn-blue',
                action: function () {
                    arg.parentElement.remove()
                    let ifEmpty = document.getElementsByClassName(`${arg.parentElement.classList.value}`)
                    // 2.6.1 se nao houver nenhuma tarefa na lista, volta a exibir mensagem informando ausencia de tarefas.
                    if (ifEmpty.length === 0) {
                        let advise = document.querySelector(".contentAdvise");
                        advise.style = 'display: block';
                        animationO('faded-out', advise);
                    }
                    salvedata();
                }
            },
            cancelar: function () {
                return;
            },
        },
    });
};

// 2.7 Função de animação(mudança de opacidade) de entrada de elementos injetados no HTML.
function animationO(classe, elem) {
    elem.classList.add(classe);
    requestAnimationFrame(() => {
        elem.classList.remove(classe);
    });
}

// 3. Eventos de click
document.addEventListener('click', (e) => {

    let el = e.target
    // 3.1 Callback para deletar tarefa da tela e do localStorage ao clicar no botão de remover tarefa
    // e retornar mensagem de que a seção de tarefas está vazia.
    if (el.classList.contains('c-tasks__btnRemove')) {
        deleteConfirmation(el);
    };
    // 3.2 Callback configurado no clique no checkbox ou no label para marcar ou desmarcar tarefa(marca utilizando ID CSS)
    // e Atualizar localStorage(salvedata()).
    //3.2.1 no Label
    if (el.classList.contains('c-tasks__label')) {
        if (el.parentElement.id === 'checked') {
            let sibling = el.previousElementSibling;
            sibling.checked = false;
            el.parentElement.removeAttribute('id')
            salvedata();
            return;
        }
        let sibling = el.previousElementSibling;
        sibling.checked = true;
        el.parentElement.setAttribute('id', 'checked')
        salvedata();
    };
    //3.2.2 no Checkbox
    if (el.id === 'checkboxTask') {
        if (el.parentElement.id === 'checked') {
            el.parentElement.removeAttribute('id')
            salvedata();
            return;
        }
        el.parentElement.setAttribute('id', 'checked')
        salvedata();
    };
});
