// ===============================
// CONFIGURAÇÕES
// ===============================

const API_URL = 
"https://script.google.com/macros/s/AKfycbxd9yQfKRMVmvhWfGZmEjjIn4WSz2Lrc9TvtgBntvyn5jQGAh6KwQkEt6OFzUwfYU4K/exec";


const chavePix = "5511960889666";


// ===============================
// VARIÁVEIS
// ===============================

let presentes = [];

let presenteSelecionado = null;



// ===============================
// CARREGAR PRESENTES DA PLANILHA
// ===============================

async function carregarPresentes(){


    try{


        const resposta = await fetch(API_URL);


        presentes = await resposta.json();


        renderizarPresentes();


    }


    catch(error){


        console.error(
            "Erro ao carregar presentes:",
            error
        );


        alert(
            "Não foi possível carregar a lista de presentes."
        );


    }


}




// ===============================
// RENDERIZAR CARDS
// ===============================

function renderizarPresentes(){


    const container = 
    document.getElementById(
        "containerPresentes"
    );


    container.innerHTML = "";



    presentes.forEach((presente)=>{


        const card =
        document.createElement("div");


        card.className =
        "card-presente";



        card.innerHTML = `


        <div class="imagem-presente">

            ${
                presente.imagem

                ?

                `
                <img 
                src="${presente.imagem}"
                alt="${presente.nome}">
                `

                :

                "🎁"

            }

        </div>



        <h3>
            ${presente.nome}
        </h3>



        <p>
            ${presente.categoria}
        </p>



        <strong>
            ${presente.valor}
        </strong>



        ${
            presente.linkCompra

            ?

            `
            <a 
            href="${presente.linkCompra}"
            target="_blank"
            class="btn">

            Ver produto

            </a>
            `

            :

            ""

        }



        ${
            presente.reservado

            ?

            `
            <button
            class="btn"
            disabled>

            🤎 Presente reservado

            </button>
            `


            :


            `
            <button
            class="btn btn-primary"
            onclick="abrirModal(${presente.id})">

            Vou presentear

            </button>
            `

        }



        `;



        container.appendChild(card);



    });


}






// ===============================
// ABRIR MODAL
// ===============================

function abrirModal(id){


    presenteSelecionado =
    presentes.find(
        p => p.id == id
    );



    document.getElementById(
        "nomePresenteSelecionado"
    ).innerHTML =


    `
    Você escolheu:

    <strong>
    ${presenteSelecionado.nome}
    </strong>
    `;



    document.getElementById(
        "idPresente"
    ).value =
    presenteSelecionado.id;



    document.getElementById(
        "modalPresente"
    ).style.display =
    "flex";


}





// ===============================
// FECHAR MODAL
// ===============================

function fecharModal(){


    document.getElementById(
        "modalPresente"
    ).style.display =
    "none";



    document.getElementById(
        "nomeConvidado"
    ).value = "";



}






// ===============================
// RESERVAR PRESENTE
// ===============================


document
.getElementById("formPresente")
.addEventListener(
"submit",
async function(event){



    event.preventDefault();



    const nome =
    document.getElementById(
        "nomeConvidado"
    ).value;



    const dados = new FormData();



    dados.append(
        "id",
        presenteSelecionado.id
    );



    dados.append(
        "nome",
        nome
    );




    try{


        const resposta =
        await fetch(

            API_URL,

            {

                method:"POST",

                body:dados

            }

        );



        const retorno =
        await resposta.json();





        if(retorno.sucesso){



            alert(
                "Obrigada! Seu presente foi reservado 💛"
            );



            fecharModal();



            carregarPresentes();



        }



        else{


            alert(
                "Esse presente já foi reservado 🤎"
            );



            carregarPresentes();


        }



    }


    catch(error){



        console.error(
            "Erro ao reservar:",
            error
        );



        alert(
            "Erro ao reservar presente."
        );



    }



});







// ===============================
// COPIAR PIX
// ===============================

function copiarPix(){


    navigator.clipboard.writeText(
        chavePix
    );



    alert(
        "PIX copiado! Obrigada pelo carinho 💛"
    );


}





// ===============================
// INICIAR
// ===============================

carregarPresentes();