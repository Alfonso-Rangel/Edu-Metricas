from flask import Flask, render_template, request, jsonify, Response
from flask_cors import CORS
import json

app = Flask(__name__)
CORS(app)  # Habilitar CORS para permitir solicitudes desde el frontend


# Ruta principal para servir la página HTML
@app.route('/')
def index():
    return render_template('index.html')


# Ruta para enviar el archivo GeoJSON
@app.route('/geojson')
def get_geojson():
    try:
        with open('mexico.json', 'r', encoding='utf-8') as file:
            geojson_data = file.read()
        return Response(geojson_data, content_type='application/json; charset=utf-8')
    except FileNotFoundError:
        return jsonify({"error": "Archivo GeoJSON no encontrado"}), 404


# Ruta para manejar la solicitud de datos de la región
@app.route('/region-data', methods=['POST'])
def region_data():
    try:
        data = request.get_json()  # Obtener datos JSON de la solicitud
        region_id = data.get('region_id')
        region_name = data.get('region_name')

        # Datos educativos simulados por nivel y sexo
        region_info = {
            "id": region_id,
            "name": region_name,
            "description": f"Matrícula escolar de la región {region_name}",
            "education_data": [
                {"level": "Superior", "men": 120000, "women": 130000, "total": 250000},
                {"level": "Media Superior", "men": 150000, "women": 140000, "total": 290000},
                {"level": "Secundaria", "men": 300000, "women": 310000, "total": 610000},
                {"level": "Primaria", "men": 500000, "women": 490000, "total": 990000},
                {"level": "Preescolar", "men": 80000, "women": 90000, "total": 170000}
            ]
        }

        return jsonify(region_info)

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)