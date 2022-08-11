const input = document.querySelector("input");
const select = document.querySelector("#selector");
const boton = document.querySelector("button");
const url = "https://mindicador.cl/api/";
const resultado = document.querySelector(".resultado");
let canvas;

boton.addEventListener("click", async() => {
    await conversion(select.value);
    await renderGrafica(select.value);
});


const getMonedas = async(moneda) => {
    try {
        //const response = await fetch(`${url}${moneda}`);
        const response = await fetch(`https://mindicador.cl/api/${moneda}`);
        const data = await response.json();
        return data;
    } catch (error) {
        alert(error);
        console.log(error);
    }
};
const conversion = async(moneda) => {
    const datos = await getMonedas(moneda);
    const valorMoneda = datos.serie[0].valor;
    const conversion = +input.value / +valorMoneda;
    resultado.textContent = conversion.toFixed(2);
};

const grafica = (monedas) => {
    if (canvas) canvas.destroy();
    //creamos las variables necesarias para el objetode configuracion
    const tipoDeGrafica = "line";

    const titulo = "Conversion de Monedas";
    const colorLinea = "red";
    const arrayConDiezDias = monedas.serie.slice(0, 10);
    const fechas = arrayConDiezDias.map((f) => {
        const fecha = new Date(f.fecha);
        return fecha.toLocaleDateString();
    });
    const valor = arrayConDiezDias.map((val) => +val.valor);

    //creacion del objeto
    const config = {
        type: tipoDeGrafica,
        data: {
            labels: fechas,
            datasets: [{
                label: titulo,
                backgroundcolor: colorLinea,
                data: valor,
            }, ],
        },
    };
    return config;
};

const renderGrafica = async(valores) => {
    const monedas = await getMonedas(valores);
    const config = grafica(monedas);
    const chartDOM = document.getElementById("myChart");
    canvas = new Chart(chartDOM, config);
};
