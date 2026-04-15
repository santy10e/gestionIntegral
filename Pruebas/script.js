const words = ["estrategias", "resultados", "crecimiento", "innovación"];
let i = 0;

const el = document.getElementById("dynamicText");

setInterval(() => {
    i = (i + 1) % words.length;
    el.textContent = words[i];
}, 2000);