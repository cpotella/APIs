let grafico;

async function getData() {
    const res = await fetch("https://mindicador.cl/api/");
    const data = await res.json();
    return data;
}

async function cambioMoneda() {
    try {
        const data = await getData();
        const cantidad = document.querySelector(".cantidad").value;
        const moneda = document.getElementById("moneda").value;
        const resultadoSpan = document.querySelector(".resultado");

        let conversion;

        if (moneda === "Euro") {
            conversion = cantidad * data.euro.valor;
        } else if (moneda === "Dolar") {
            conversion = cantidad * data.dolar.valor;
        } else if (moneda === "UF") {
            conversion = cantidad * data.uf.valor;    
        } else {
            conversion = 0;
        }
        resultadoSpan.textContent = conversion.toLocaleString('es-CL', {
            style: 'currency',
            currency: 'CLP'
        });

        await generarGraficaMoneda(moneda);

    } catch (error) {
        alert("Error al realizar la conversión");
    }
}

async function generarGraficaMoneda(moneda) {
    const res = await fetch(`https://mindicador.cl/api/${moneda.toLowerCase()}`);
    const data = await res.json();
    
    const ultimosDiezDias = data.serie.slice(0, 10).reverse();

    const fechas = ultimosDiezDias.map(elem => elem.fecha.split('T')[0]);
    const valores = ultimosDiezDias.map(elem => elem.valor);

    const graficaData = document.getElementById('monedaChart').getContext('2d');

    if (grafico) {
        grafico.destroy();
    }

    grafico = new Chart(graficaData, {
        type: 'line',
        data: {
            labels: fechas,
            datasets: [{
                label: `Valor de ${moneda} en los últimos 10 días`,
                data: valores,
                borderColor: 'red',
                borderWidth: 1
            }]
        },
    });
}

document.querySelector("button").addEventListener("click", cambioMoneda);
