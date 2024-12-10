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

        const table = document.createElement('table');
        table.border = '1';
        table.style.width = '100%';
        table.style.borderCollapse = 'collapse';

        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        headerRow.innerHTML = `
            <th>Nivel Educativo</th>
            <th>Hombres</th>
            <th>Mujeres</th>
            <th>Total</th>
        `;
        thead.appendChild(headerRow);
        table.appendChild(thead);

        const tbody = document.createElement('tbody');
        regionInfo.education_data.forEach(row => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${row.level}</td>
                <td>${row.men}</td>
                <td>${row.women}</td>
                <td>${row.total}</td>
            `;
            tbody.appendChild(tr);
        });
        table.appendChild(tbody);

        panel.appendChild(table);
    });
}
