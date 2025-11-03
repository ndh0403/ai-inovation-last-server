const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// 센서 데이터 초기값: 모두 'off'
let sensorData = {
  temperature: 'off',
  pH: 'off',
  salinity: 'off',
  light: 'off',
  lastUpdated: null
};

// 센서 데이터 받는 엔드포인트
app.post('/update', (req, res) => {
  const { temperature, pH, salinity, light } = req.body;

  // 들어온 값이 undefined이면 'off' 유지
  sensorData = {
    temperature: temperature !== undefined ? temperature : 'off',
    pH: pH !== undefined ? pH : 'off',
    salinity: salinity !== undefined ? salinity : 'off',
    light: light !== undefined ? light : 'off',
    lastUpdated: Date.now()
  };

  res.json({ status: 'success' });
});

// 센서 데이터 전달 엔드포인트
app.get('/data', (req, res) => {
  const now = Date.now();
  const isOffline = !sensorData.lastUpdated || (now - sensorData.lastUpdated > 60000);

  res.json({
    temperature: isOffline ? 'off' : sensorData.temperature,
    pH: isOffline ? 'off' : sensorData.pH,
    salinity: isOffline ? 'off' : sensorData.salinity,
    light: isOffline ? 'off' : sensorData.light,
    lastUpdated: sensorData.lastUpdated
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
