import express from 'express';
import axios from 'axios';

const app = express();
app.use(express.json());

const API_BASE_URL = 'https://cryptomi.io/api/';

app.use((req, res, next) => {
    // Форматирование текущей даты и времени
    const now = new Date().toISOString();
    // Вывод в консоль метода, URL запроса и времени
    console.log(`[${now}] ${req.method} ${req.url}`);
    next(); // Передача управления следующему middleware
});

app.use('/api/*', async (req, res) => {
  const now = new Date().toISOString();
    // Вывод в консоль метода, URL запроса и времени
  console.log(`[${now}] ${req.method} ${req.url}`);
  const path = req.originalUrl.substring(5);
  try {
    const response = await axios({
      method: req.method,
      url: `${API_BASE_URL}${path}`,
      data: req.body,
      headers: { ...req.headers, 'Content-Type': 'application/json' },
      withCredentials: true,
    });
    res.send(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).send(error.response?.data || 'Ошибка при запросе к API');
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
