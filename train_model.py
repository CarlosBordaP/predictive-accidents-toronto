import pandas as pd
import numpy as np
import pickle
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier

# Simulación de datos (reemplázalos con los reales)
np.random.seed(42)
data = pd.DataFrame({
    'temperature': np.random.uniform(-10, 30, 1000),
    'wind_speed': np.random.uniform(0, 50, 1000),
    'visibility': np.random.uniform(1000, 25000, 1000),
    'snow': np.random.randint(0, 2, 1000),
    'accidents': np.random.randint(0, 2, 1000)  # 0 = No accidente, 1 = Accidente
})

X = data[['temperature', 'wind_speed', 'visibility', 'snow']]
y = data['accidents']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Entrenar modelo
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Guardar modelo
with open('model.pkl', 'wb') as f:
    pickle.dump(model, f)

print("Modelo guardado exitosamente como model.pkl")
