const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000; // Render 환경에서는 process.env.PORT 필수

// ✅ 미들웨어
app.use(cors());
app.use(express.json()); // body-parser 대신 express 내장 파서 사용

// ✅ 초기 센서 데이터
let sensorData = {
  temperature: "off",
  pH: "off",
  salinity: "off",
  light: "off",
  lastUpdated: null
};

// ✅ 센서 데이터 수신 (ESP8266 → 서버)
app.post("/update", (req, res) => {
  const { temperature, pH, salinity, light } = req.body;

  sensorData = {
    temperature: temperature !== undefined ? temperature : "off",
    pH: pH !== undefined ? pH : "off",
    salinity: salinity !== undefined ? salinity : "off",
    light: light !== undefined ? light : "off",
    lastUpdated: Date.now()
  };

  console.log("✅ 새 데이터 수신:", sensorData);
  res.json({ status: "success", data: sensorData });
});

// ✅ 센서 데이터 제공 (웹사이트 → 서버)
app.get("/data", (req, res) => {
  const now = Date.now();
  const isOffline =
    !sensorData.lastUpdated || now - sensorData.lastUpdated > 60000;

  res.json({
    temperature: isOffline ? "off" : sensorData.temperature,
    pH: isOffline ? "off" : sensorData.pH,
    salinity: isOffline ? "off" : sensorData.salinity,
    light: isOffline ? "off" : sensorData.light,
    lastUpdated: sensorData.lastUpdated
  });
});

// ✅ 서버 실행
app.listen(PORT, () => {
  console.log(`🌊 Coral Monitor Server running on port ${PORT}`);
});
