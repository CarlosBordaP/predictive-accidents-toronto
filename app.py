from flask import Flask, request, jsonify, render_template_string
import pickle
import numpy as np
import folium
from folium.plugins import HeatMap
from flask_cors import CORS
import pandas as pd
import base64
from io import BytesIO

app = Flask(__name__)
CORS(app)  # Permitir peticiones desde el frontend

# Cargar modelo entrenado
with open("random_forest_model.pkl", "rb") as f:
    model = pickle.load(f)

print("Modelo cargado correctamente:", type(model)) 

# Definir los 4 puntos fijos de Toronto
locations = [
    {"name": "East Toronto", "latitude": 43.7, "longitude": -79.25},
    {"name": "West Toronto", "latitude": 43.7, "longitude": -79.55},
    {"name": "North Toronto", "latitude": 43.8, "longitude": -79.4},
    {"name": "Center Toronto", "latitude": 43.72, "longitude": -79.4},
    {"name": "South Toronto", "latitude": 43.65, "longitude": -79.4}
]

# Cargar datos originales con latitud y longitud
# accident_data = pd.read_csv("dataset.csv")  # Asegúrate de que este archivo tiene lat/lon
# accident_data = accident_data[['latitude', 'longitude', 'Number_of_events']]  # Ajusta según las columnas reales

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        predictions = []
        heat_data = []
        total_accidents = 0

        print("Datos recibidos del frontend:", data)

        # Crear el mapa base
        m = folium.Map(location=[43.7, -79.4], zoom_start=10)

        for location in locations:
            features = np.array([[data['AVG_TEMPERATURE'], data['0_OR_1_SNOW'], data['AVG_WIND_SPEED'],
                                  data['AVG_VISIBILITY'], data['SNOW'], data['SNOW_ON_GROUND'],
                                  location["longitude"], location["latitude"]]])

            # Realizar predicción con Random Forest
            predicted_accidents = model.predict(features)[0]
            total_accidents += predicted_accidents
            # Guardar la predicción y ubicación para el heatmap
            predictions.append({
                "location": location["name"],
                "latitude": location["latitude"],
                "longitude": location["longitude"],
                "predicted_accidents": round(predicted_accidents, 2)
            })

            heat_data.append([location["latitude"], location["longitude"], predicted_accidents])

            # Agregar marcador con la cantidad de accidentes esperados
            folium.Marker(
                location=[location["latitude"], location["longitude"]],
                popup=f"{location['name']}: {round(predicted_accidents, 2)} accidents",
                icon=folium.Icon(color="red", icon="info-sign")
            ).add_to(m)

        # Agregar HeatMap con los puntos de predicción
        HeatMap(heat_data).add_to(m)

        # Convertir el mapa a HTML en memoria
        map_html = m._repr_html_()

        # Crear el JSON de respuesta
        response_data = {
            "predictions": predictions,
            "map_html": map_html,
            "total_accidents": round(total_accidents, 2)  # Asegurar que total_accidents está en la respuesta
        }

        print("✅ Respuesta enviada al frontend:", response_data)  # ← Verificar qué se está enviando


        return jsonify({"predictions": predictions, "map_html": map_html,"total_accidents": float(total_accidents)})

    except Exception as e:
        print("Error en el backend:", str(e))
        return jsonify({"error": str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True)
