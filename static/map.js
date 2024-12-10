// Crear el mapa y establecer zoom y posición
const map = L.map('map', {
    minZoom: 5,
    maxZoom: 19
}).setView([23.634501, -102.552784], 5);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

let selectedLayer;  // Variable para almacenar la referencia de la región seleccionada

// Cargar el GeoJSON
function loadGeoJSON() {
    fetch('/geojson')
        .then(response => response.json())
        .then(data => {
            L.geoJSON(data, {
                onEachFeature: handleFeatureClick,
                style: setDefaultStyle
            }).addTo(map);
        })
        .catch(error => console.error('Error cargando el GeoJSON:', error));
}

function handleFeatureClick(feature, layer) {
    layer.on({
        click: function (e) {
            const regionId = feature.properties.id;
            const regionName = feature.properties.name;

            if (selectedLayer) {
                selectedLayer.setStyle({
                    fillColor: '#3388ff',
                    weight: 2,
                    opacity: 1,
                    color: 'white',
                    fillOpacity: 0.7
                });
            }

            // Seleccionar y destacar la nueva región
            selectedLayer = layer;
            selectedLayer.setStyle({
                fillColor: '#99d98c',
                weight: 3,
                opacity: 1,
                color: 'white',
                fillOpacity: 0.9
            });

            // Obtener datos de la región
            getRegionData(regionId, regionName);
        }
    });
}

function setDefaultStyle(feature) {
    return {
        fillColor: '#3388ff',
        weight: 2,
        opacity: 1,
        color: 'white',
        fillOpacity: 0.7
    };
}