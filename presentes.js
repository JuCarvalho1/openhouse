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
// FETCH COM TIMEOUT E RETRY
// ===============================

async function fetchComTimeout(url, timeout = 12000) {
  const controlador = new AbortController();

  const timer = setTimeout(() => controlador.abort(), timeout);

  try {
    return await fetch(url, { signal: controlador.signal });
  } finally {
    clearTimeout(timer);
  }
}

async function buscarPresentes(tentativas = 3) {
  for (let i = 1; i <= tentativas; i++) {
    try {
      const resposta = await fetchComTimeout(API_URL);

      if (!resposta.ok) {
        throw new Error("HTTP " + resposta.status);
      }

      return await resposta.json();
    } catch (error) {
      if (i === tentativas) {
        throw error;
      }

      // espera crescente antes de tentar de novo
      await new Promise((r) => setTimeout(r, 1000 * i));
    }
  }
}

// ===============================
// CARREGAR PRESENTES DA PLANILHA
// ===============================

async function carregarPresentes() {
  const container = document.getElementById("containerPresentes");

  container.innerHTML = `

        <div class="loading-presentes">

            <span class="spinner"></span>

            <p>Carregando presentes...</p>

        </div>

    `;

  try {
    presentes = await buscarPresentes();
    renderizarPresentes();
  } catch (error) {
    console.error("Erro ao carregar presentes:", error);

    container.innerHTML = `

            <div class="loading-presentes">

                <p>Não foi possível carregar a lista de presentes. 🤎</p>

                <button
                class="btn btn-primary"
                onclick="carregarPresentes()">

                Tentar novamente

                </button>

            </div>

        `;
  }
}

// ===============================
// RENDERIZAR CARDS
// ===============================

function renderizarPresentes() {
  const container = document.getElementById("containerPresentes");

  container.innerHTML = "";

  presentes.forEach((presente) => {
    const card = document.createElement("div");

    card.className = "card-presente";

    card.innerHTML = `


        <div class="imagem-presente">

            ${
              presente.imagem
                ? `
                <img 
                src="${presente.imagem}"
                alt="${presente.nome}">
                `
                : "🎁"
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
            ? `
            <a 
            href="${presente.linkCompra}"
            target="_blank"
            class="btn">

            Ver produto

            </a>
            `
            : ""
        }



        ${
          presente.reservado
            ? `
            <button
            class="btn"
            disabled>

            🤎 Presente reservado

            </button>
            `
            : `
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

function abrirModal(id) {
  presenteSelecionado = presentes.find((p) => p.id == id);

  document.getElementById("nomePresenteSelecionado").innerHTML = `
    Você escolheu:

    <strong>
    ${presenteSelecionado.nome}
    </strong>
    `;

  document.getElementById("idPresente").value = presenteSelecionado.id;

  document.getElementById("modalPresente").style.display = "flex";
}

// ===============================
// FECHAR MODAL
// ===============================

function fecharModal() {
  document.getElementById("modalPresente").style.display = "none";

  document.getElementById("nomeConvidado").value = "";
}

// ===============================
// RESERVAR PRESENTE
// ===============================

document
  .getElementById("formPresente")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const nome = document.getElementById("nomeConvidado").value;

    const dados = new FormData();

    dados.append("id", presenteSelecionado.id);

    dados.append("nome", nome);

    try {
      const resposta = await fetch(
        API_URL,

        {
          method: "POST",

          body: dados,
        },
      );

      const retorno = await resposta.json();

      if (retorno.sucesso) {
        alert("Obrigada! Seu presente foi reservado 💛");

        fecharModal();

        carregarPresentes();
      } else {
        alert("Esse presente já foi reservado 🤎");

        carregarPresentes();
      }
    } catch (error) {
      console.error("Erro ao reservar:", error);

      alert("Erro ao reservar presente.");
    }
  });

// ===============================
// COPIAR PIX
// ===============================

function copiarPix() {
  navigator.clipboard.writeText(chavePix);

  alert("PIX copiado! Obrigada pelo carinho 💛");
}

// ===============================
// INICIAR
// ===============================

carregarPresentes();
