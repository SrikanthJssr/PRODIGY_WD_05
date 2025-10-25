# 🌦️ PRODIGY_WD_05 – Weather Forecast Web Application

## 📘 Overview
This project is part of my Web Development Internship at **Prodigy InfoTech**.  
The goal of this task was to **build a responsive and interactive weather web application** that fetches **real-time weather data** from the **OpenWeatherMap API** based on either the user's current location or a user-entered city name.

The app displays essential weather details such as:
- 🌡️ Temperature  
- 🌬️ Wind speed  
- 💧 Humidity  
- 🌤️ Weather condition and icon  

---

## 🧠 Features
✅ Fetches **live weather data** using OpenWeatherMap API  
✅ Displays weather information in a **clean, responsive UI**  
✅ **Search functionality** for any city worldwide  
✅ Option to use **user’s current location** automatically  
✅ Includes **error handling** for invalid locations  
✅ Built with **HTML, CSS, and JavaScript (separate files)**  

---

## 🛠️ Tech Stack
| Technology | Purpose |
|-------------|----------|
| **HTML5** | Structure of the web page |
| **CSS3** | Styling and responsive design |
| **JavaScript (ES6)** | Fetching data, DOM manipulation, and API handling |
| **OpenWeatherMap API** | Real-time weather data source |

---

## 🗝️ How to Get Your API Key
1. Go to [OpenWeatherMap](https://home.openweathermap.org/users/sign_up)
2. Create a free account  
3. Navigate to **API Keys** in your profile  
4. Copy your unique API key  
5. Replace it inside the `script.js` file:
   ```javascript
   const apiKey = "YOUR_API_KEY_HERE";
