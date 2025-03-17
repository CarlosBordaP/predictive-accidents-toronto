import React, { useState } from "react";
import axios from "axios";
import { FaSnowflake, FaCloudShowersHeavy, FaSun, FaBolt , FaWind, FaCloud, FaCloudRain, FaEye, FaEraser, FaExclamationTriangle, FaCheckCircle } from "react-icons/fa";

const BACKEND_URL =
  process.env.NODE_ENV === "development"
    ? "http://127.0.0.1:5000" // Backend local
    : "https://tu-backend.onrender.com"; // Backend en producción

// Definir las escalas y valores de lluvia y nieve
const rainLevels = [
  { label: "No", min: 0, max: 0, icon: null },
  { label: "Light", min: 1, max: 10, icon: <FaCloudRain className="text-blue-400 text-2xl" /> },
  { label: "Moderate", min: 11, max: 30, icon: <FaCloudShowersHeavy className="text-blue-500 text-2xl" /> },
  { label: "Heavy", min: 31, max: 45, icon: <FaCloudShowersHeavy className="text-blue-700 text-2xl" /> },
  { label: "Thunderstorm", min: 46, max: 70, icon: <FaBolt className="text-yellow-500 text-2xl" /> },
];

const snowLevels = [
  { label: "No", min: 0, max: 0, icon: null },
  { label: "Light", min: 1, max: 5, icon: <FaSnowflake className="text-blue-300 text-2xl" /> },
  { label: "Moderate", min: 6, max: 12, icon: <FaSnowflake className="text-blue-500 text-2xl" /> },
  { label: "Heavy", min: 13, max: 20, icon: <FaSnowflake className="text-blue-700 text-2xl" /> },
];

function App() {
  const [formData, setFormData] = useState({
    temperature: 10,
    wind_speed: 10,
    visibility: 10000,
    snow: 0,
    rain: 0,
  });

  const [prediction, setPrediction] = useState(null);
  const [accidentCount, setAccidentCount] = useState(null);
  const [mapHtml, setMapHtml] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedFormData = { ...formData, [name]: Number(value) };
  
    // Si la temperatura es mayor a 15°C, resetear Snow a "No"
    if (name === "temperature" && Number(value) > 15) {
      updatedFormData.snow = 0;
      updatedFormData.snowIndex = 0;
    }
  
    setFormData(updatedFormData);
  };
  

  const handleToggle = (field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field] === 1 ? 0 : 1,
    }));
  };

  const handlePrediction = async () => {
    try {
      const res = await axios.post(`${BACKEND_URL}/predict`, formData);
      setPrediction(res.data.prediction);
      setAccidentCount(Math.floor(Math.random() * (300 - 10 + 1)) + 10); // Valor dummy
      setMapHtml(res.data.map_html);
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while making the prediction.");
    }
  };

  const handleReset = () => {
    setFormData({
      temperature: 10,
      wind_speed: 10,
      visibility: 10000,
      snow: 0,
      rain: 0,
    });
    setPrediction(null);
    setMapHtml("");
  };

  // Determinar icono para temperatura
  const getTemperatureIcon = () => {
    if (formData.temperature < 0) return <FaSnowflake className="text-blue-500 text-2xl" />;
    if (formData.temperature > 25) return <FaSun className="text-yellow-500 text-2xl" />;
    return <FaCloud className="text-gray-500 text-2xl" />;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-5">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-lg text-gray-800">
      <div className="bg-white w-full flex flex-col items-center py-4">
        <img src="/university_logo.png" alt="University Logo" className="h-16 mb-2" />
        <h2 className="text-lg font-semibold text-gray-700">Predictive Analytics (DAMO-510-6)</h2>
        <p className="text-sm text-gray-500">Professor Foad Aghamiri</p>
      </div>

        <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">Accident Prediction in Toronto</h1>

        {/* Sliders */}
        <div className="space-y-6">
          {/* Temperature */}
          <div>
            <label className="block font-semibold mb-2">Temperature (°C)</label>
            <div className="flex items-center gap-3">
              {getTemperatureIcon()}
              <input
                type="range"
                name="temperature"
                min="-30"
                max="35"
                value={formData.temperature}
                onChange={handleChange}
                className="w-full"
              />
              <span>{formData.temperature}°C</span>
            </div>
          </div>

          {/* Wind Speed */}
          <div>
            <label className="block font-semibold mb-2">Wind Speed (km/h)</label>
            <div className="flex items-center gap-3">
              <FaWind className="text-gray-500 text-2xl" />
              <input
                type="range"
                name="wind_speed"
                min="0"
                max="50"
                value={formData.wind_speed}
                onChange={handleChange}
                className="w-full"
              />
              <span>{formData.wind_speed} km/h</span>
            </div>
          </div>

          {/* Visibility */}
          <div>
            <label className="block font-semibold mb-2">Visibility (m)</label>
            <div className="flex items-center gap-3">
              <FaEye className="text-gray-500 text-2xl" />
              <input
                type="range"
                name="visibility"
                min="100"
                max="25000"
                step="100"
                value={formData.visibility}
                onChange={handleChange}
                className="w-full"
              />
              <span>{formData.visibility} m</span>
            </div>
          </div>
        </div>

        {/* Rain and Snow Buttons */}
        <div className="mt-6 space-y-4">
          {/* Rain */}
          <div>
            <label className="block font-semibold mb-2 flex items-center gap-2">
              <FaCloudRain className="text-blue-500 text-xl" /> Rain
            </label>
            <input
              type="range"
              min="0"
              max="4"
              step="1"
              value={formData.rainIndex || 0}
              onChange={(e) => {
                const index = parseInt(e.target.value);
                const rainLevels = [0, 10, 30, 45, 70];
                const randomValue = Math.floor(Math.random() * (rainLevels[index] - (index > 0 ? rainLevels[index - 1] : 0) + 1)) + (index > 0 ? rainLevels[index - 1] + 1 : 0);
                setFormData({ ...formData, rain: randomValue, rainIndex: index });
              }}
              className="w-full"
            />
            <div className="grid grid-cols-5 text-sm text-gray-500 text-center mt-1">
              {["No", "Light", "Moderate", "Heavy", "Thunderstorm"].map((label, index) => (
                <span
                  key={index}
                  className={formData.rainIndex === index ? "font-bold text-black text-base" : "text-gray-500 text-sm"}
                >
                  {label}
                </span>
              ))}
            </div>
          </div>

          {/* Snow */}
          <div>
            <label className="block font-semibold mb-2 flex items-center gap-2">
              <FaSnowflake className="text-blue-500 text-xl" /> Snow
            </label>
            <input
              type="range"
              min="0"
              max="3"
              step="1"
              value={formData.snowIndex || 0}
              onChange={(e) => {
                const index = parseInt(e.target.value);
                const snowLevels = [0, 5, 12, 20];
                const randomValue = Math.floor(Math.random() * (snowLevels[index] - (index > 0 ? snowLevels[index - 1] : 0) + 1)) + (index > 0 ? snowLevels[index - 1] + 1 : 0);
                setFormData({ ...formData, snow: randomValue, snowIndex: index });
              }}
              className="w-full"
              disabled={formData.temperature > 15}
            />
            <div className="grid grid-cols-4 text-sm text-gray-500 text-center mt-1">
              {["No", "Light", "Moderate", "Heavy"].map((label, index) => (
                <span
                  key={index}
                  className={formData.snowIndex === index ? "font-bold text-black text-base" : "text-gray-500 text-sm"}
                >
                  {label}
                </span>
              ))}
            </div>
            <div className="h-6 mt-2">
              {formData.temperature > 15 && <p className="text-red-500 text-sm">❌ Snow is not possible above 15°C</p>}
            </div>
          </div>
        </div>

        {/* Buttons - Now in the same row */}
        <div className="mt-6 flex gap-4">
          <button onClick={handlePrediction} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full">
            Predict
          </button>
          <button onClick={handleReset} className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded w-full flex items-center justify-center gap-2">
            <FaEraser /> Clear
          </button>
        </div>
        {/* Resultado de la Predicción */}
        {prediction !== null && (
          <div className="mt-4 flex items-center justify-between p-3 rounded-lg shadow-md w-full">
            {/* Mensaje de predicción */}
            <div className={`flex items-center gap-2 p-3 rounded-lg w-2/3 text-lg font-bold text-center 
              ${prediction === 1 ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"}`}>
              {prediction === 1 ? (
                <>
                  <FaExclamationTriangle className="text-red-600 text-2xl" />
                  <span>🚨 High Risk of Accident</span>
                </>
              ) : (
                <>
                  <FaCheckCircle className="text-green-600 text-2xl" />
                  <span>✅ Low Risk of Accident</span>
                </>
              )}
            </div>

            {/* Cantidad de accidentes esperados (dummy) */}
            <div className={`w-1/3 text-center p-3 font-bold text-lg rounded-lg shadow-md 
              ${prediction === 1 ? "bg-red-500 text-white" : "bg-green-500 text-white"}`}>
              {accidentCount} Accidents
            </div>
          </div>
        )}
        {/* Map */}
        {mapHtml && <div dangerouslySetInnerHTML={{ __html: mapHtml }} className="mt-6 border rounded-lg overflow-hidden shadow-lg"></div>}
        
        {/* Parámetros enviados al modelo */}
        {prediction !== null && (
          <div className="mt-6 bg-gray-100 p-4 rounded-lg shadow-md text-gray-700">
            <h2 className="text-lg font-bold text-center mb-3">Model Input Parameters</h2>
            <div className="grid grid-cols-2 gap-4">
              <p><strong>Temperature:</strong> {formData.temperature}°C</p>
              <p><strong>Wind Speed:</strong> {formData.wind_speed} km/h</p>
              <p><strong>Visibility:</strong> {formData.visibility} m</p>
              <p><strong>Rain:</strong> {formData.rain} mm</p>
              <p><strong>Snow:</strong> {formData.snow} cm</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
