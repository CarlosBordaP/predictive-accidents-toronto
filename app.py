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
with open("model.pkl", "rb") as f:
    model = pickle.load(f)

# Cargar datos originales con latitud y longitud
accident_data = pd.read_csv("dataset.csv")  # Asegúrate de que este archivo tiene lat/lon
accident_data = accident_data[['latitude', 'longitude', 'Number_of_events']]  # Ajusta según las columnas reales

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        features = np.array([[data['temperature'], data['wind_speed'], data['visibility'], data['snow']]])
        
        # Realizar predicción
        prediction = model.predict(features)[0]

        # Generar mapa de calor basado en los datos
        m = folium.Map(location=[43.7, -79.4], zoom_start=11)
        heat_data = accident_data.values.tolist()
        HeatMap(heat_data).add_to(m)

        # Convertir el mapa a HTML en memoria
        map_html = m._repr_html_()
        accident_count = 20
        return jsonify({"prediction": int(prediction), "map_html": map_html})
    
    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True)
