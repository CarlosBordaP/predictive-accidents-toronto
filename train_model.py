import pickle
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split

# Simulación de datos
data = pd.DataFrame({
    'AVG_TEMPERATURE': np.random.uniform(-15, 35, 5000),
    '0_OR_1_SNOW': np.random.randint(0, 2, 5000),
    'AVG_WIND_SPEED': np.random.uniform(0, 50, 5000),
    'AVG_VISIBILITY': np.random.uniform(1000, 25000, 5000),
    'SNOW': np.random.uniform(0, 30, 5000),
    'SNOW_ON_GROUND': np.random.randint(0, 50, 5000),
    'LONGITUDE': np.random.uniform(-79.6, -79.2, 5000),
    'LATITUDE': np.random.uniform(43.6, 43.8, 5000),
    'ACCIDENT_COUNT': np.random.uniform(1, 3, 5000)  # Valores de ejemplo
})

# Separar características y variable objetivo
X = data.drop(columns=['ACCIDENT_COUNT'])
y = data['ACCIDENT_COUNT']

# Dividir en entrenamiento y prueba
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Entrenar el modelo Random Forest
model = RandomForestRegressor(n_estimators=100, random_state=42, n_jobs=-1)
model.fit(X_train, y_train)

# Guardar el modelo correctamente
with open("random_forest_model.pkl", "wb") as f:
    pickle.dump(model, f)

print("Modelo entrenado y guardado como 'random_forest_model.pkl'")
