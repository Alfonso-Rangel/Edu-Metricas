// Obtener datos de la región desde el servidor Flask
function getRegionData(regionId, regionName) {
    fetch('/region-data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8'
        },
        body: JSON.stringify({
            region_id: regionId,
            region_name: regionName
        })
    })
    .then(response => response.json())
    .then(regionInfo => {
        const panel = document.getElementById('panel');
        panel.innerHTML = `
            <h3>${regionInfo.name}</h3>
            <p>${regionInfo.description}</p>
        `;

        // Crear botones para las diferentes opciones
        const buttonContainer = document.createElement('div');
        buttonContainer.style.marginTop = '10px';

        const buttons = [
            { text: 'Matriculas por región', type: 'matriculas' },
            { text: 'Tasa de deserción escolar', type: 'desercion' }
        ];

        buttons.forEach(buttonData => {
            const btn = document.createElement('button');
            btn.textContent = buttonData.text;
            btn.style.marginRight = '10px';
            btn.addEventListener('click', () => generateContent(regionInfo, buttonData.type));
            buttonContainer.appendChild(btn);
        });

        panel.appendChild(buttonContainer);
    });
}

function generateContent(regionInfo, contentType) {
    const panel = document.getElementById('panel');

    // Limpiar contenido previo
    panel.innerHTML = `
        <h3>${regionInfo.name}</h3>
        <p>${regionInfo.description}</p>
    `;

    if (contentType === 'matriculas') {
        // Generar tabla de datos de matrícula
        generateTable(panel, regionInfo.education_data, ['Nivel Educativo', 'Hombres', 'Mujeres', 'Total']);
    } else if (contentType === 'desercion') {
        // Simulación de datos para tasas de matriculación por nivel educativo
        const matriculaData = [
            { nivel: "Preescolar", tasa: "65.0%" },
            { nivel: "Primaria", tasa: "92.3%" },
            { nivel: "Secundaria", tasa: "82.1%" },
            { nivel: "Media Superior", tasa: "54.9%" }
        ];

        // Generar tabla con datos de tasas de matrícula
        generateTable(panel, matriculaData, ['Nivel Educativo', 'Tasa de Matrícula']);

        // Generar gráfico
        generateChart(panel, matriculaData);
    }
}

function generateTable(panel, data, headers) {
    const table = document.createElement('table');
    table.border = '1';
    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';

    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    headers.forEach(headerText => {
        const th = document.createElement('th');
        th.textContent = headerText;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    data.forEach(rowData => {
        const tr = document.createElement('tr');
        headers.forEach(headerText => {
            const td = document.createElement('td');
            const key = headerText.toLowerCase().replace(/ /g, '_');
            td.textContent = rowData[key] || rowData[headerText.toLowerCase()];
            tr.appendChild(td);
        });
        tbody.appendChild(tr);
    });

    table.appendChild(tbody);
    panel.appendChild(table);
}

function generateChart(panel, data) {
    const chartContainer = document.createElement('div');
    chartContainer.id = 'chart-container';
    panel.appendChild(chartContainer);

    const canvas = document.createElement('canvas');
    canvas.id = 'chart';
    canvas.width = 400;
    canvas.height = 200;
    chartContainer.appendChild(canvas);

    // Configuración del gráfico
    const ctx = canvas.getContext('2d');
    const labels = data.map(item => item.nivel);
    const values = data.map(item => parseFloat(item.tasa));

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Tasa de Matrícula (%)',
                data: values,
                backgroundColor: 'rgba(0, 123, 255, 0.5)',
                borderColor: 'rgba(0, 123, 255, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            }
        }
    });
}
