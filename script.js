const dataEvento = new Date("2026-08-29T13:00:00").getTime();

function atualizarContador() {

    const agora = new Date().getTime();
    const distancia = dataEvento - agora;


    const dias = Math.floor(distancia / (1000 * 60 * 60 * 24));

    const horas = Math.floor(
        (distancia % (1000 * 60 * 60 * 24)) /
        (1000 * 60 * 60)
    );

    const minutos = Math.floor(
        (distancia % (1000 * 60 * 60)) /
        (1000 * 60)
    );

    const segundos = Math.floor(
        (distancia % (1000 * 60)) /
        1000
    );


    document.getElementById("dias").innerHTML = String(dias).padStart(2,"0");
    document.getElementById("horas").innerHTML = String(horas).padStart(2,"0");
    document.getElementById("minutos").innerHTML = String(minutos).padStart(2,"0");
    document.getElementById("segundos").innerHTML = String(segundos).padStart(2,"0");

}

atualizarContador();

setInterval(atualizarContador,1000);