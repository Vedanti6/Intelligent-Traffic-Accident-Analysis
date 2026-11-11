# Intelligent Traffic Accident Analysis and Severity Prediction

## About the Project

This project is a simple attempt to build a Machine Learning web application using the XGBoost algorithm.

I wanted to learn how XGBoost works and understand how a trained machine learning model can be integrated into a web application.

The application uses traffic accident datasets to analyze accident patterns and predict accident severity based on different input features.

## Features

- Dashboard displaying traffic accident statistics.
- Visualizations of accident severity, monthly trends, and weather conditions.
- Map showing the approximate regions of four highway projects.
- Accident severity prediction using XGBoost.
- Prediction probabilities for different severity classes.

## Algorithm Used

**XGBoost (Extreme Gradient Boosting)**

XGBoost is a machine learning algorithm based on gradient-boosted decision trees. It builds multiple decision trees sequentially, where each new tree helps improve the predictions made by the previous trees.

I used XGBoost to predict accident severity based on features such as road conditions, weather, vehicle types, location, and time.

## Technologies Used

- Python
- XGBoost
- Pandas
- NumPy
- Scikit-learn
- Flask
- React.js
- JavaScript
- CSS
- React-Leaflet

## Datasets

The project uses three datasets:

1. Indian Highway Accident Dataset – Main dataset for model training and accident analysis.
2. Vehicle-wise Accident Dataset – Used for vehicle-related accident analysis.
3. Weather-wise Accident Dataset – Used for weather-related accident analysis.

Main dataset source: [Zenodo](https://zenodo.org/records/16946653)

## Project Structure

```text
Intelligent-Traffic-Accident-Analysis/
│
├── backend/
│   ├── app.py
│   ├── requirements.txt
│   ├── ETP_4_New_Data_Accidents.csv
│   ├── traffic_accident_xgb.json
│   └── traffic_accident_preprocessor.pkl
│
├── frontend/
│   ├── public/
│   └── src/
│       ├── AccidentMap.jsx
│       ├── App.jsx
│       ├── App.css
│       ├── Prediction.jsx
│       └── Prediction.css
│
└── README.md
```

## How to Run

### Backend

```bash
cd backend
pip install -r requirements.txt
python app.py
```

### Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL provided by Vite in your browser.

## Purpose

The main purpose of this project was to learn the XGBoost algorithm and gain practical experience in building and connecting a Machine Learning model with a Flask backend and React frontend.


