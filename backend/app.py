
from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import joblib
import os
from xgboost import XGBClassifier

app = Flask(__name__)
CORS(app)

# Get the backend folder path
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

DATASET_PATH = os.path.join(
    BASE_DIR, 'ETP_4_New_Data_Accidents.csv'
)

dashboard_df = pd.read_csv(DATASET_PATH)
print("Dataset columns:", dashboard_df.columns.tolist())
print("Accident location codes:")
print(dashboard_df['Accident_Location_A'].value_counts().sort_index())

print("Chainage range:")
print(dashboard_df['Accident_Location_A_Chainage_km'].describe())
dashboard_df['Date'] = pd.to_datetime(
    dashboard_df['Date'], errors='coerce', dayfirst=True
)

dashboard_df['Month'] = dashboard_df['Date'].dt.month

print("Dashboard dataset loaded:", dashboard_df.shape)

# Load the preprocessor and feature columns
artifacts = joblib.load(
    os.path.join(BASE_DIR, 'traffic_accident_preprocessor.pkl')
)


preprocessor = artifacts['preprocessor']
feature_columns = artifacts['feature_columns']

# Load XGBoost model from JSON
model = XGBClassifier()
model.load_model(
    os.path.join(BASE_DIR, 'traffic_accident_xgb.json')
)

print("Model and preprocessor loaded successfully!")

@app.route('/dashboard-stats', methods=['GET'])
def dashboard_stats():
    return jsonify({
        "total_accidents": int(len(dashboard_df)),

        "severity": {
            str(k): int(v)
            for k, v in dashboard_df[
                'Accident_Severity_C'
            ].value_counts().sort_index().items()
        },

        "monthly": {
            str(k): int(v)
            for k, v in dashboard_df[
                'Month'
            ].value_counts().sort_index().items()
        },

        "day_wise": {
            str(k): int(v)
            for k, v in dashboard_df[
                'Day_of_Week'
            ].value_counts().sort_index().items()
        },

        "weather": {
            str(k): int(v)
            for k, v in dashboard_df[
                'Weather_Conditions_H'
            ].value_counts().sort_index().items()
        }
    })


@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "Backend is running"})

@app.route('/features', methods=['GET'])
def get_features():
    return jsonify({
        "features": feature_columns
    })


@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()

        if not data:
            return jsonify({"error": "No input data received"}), 400

        # Check whether all required features are provided
        missing = [
            col for col in feature_columns
            if col not in data
        ]

        if missing:
            return jsonify({
                "error": "Missing input features",
                "missing_features": missing
            }), 400

        # Arrange input features in the correct order
        input_df = pd.DataFrame(
            [[data[col] for col in feature_columns]],
            columns=feature_columns
        )

        # Apply the saved preprocessing
        input_encoded = preprocessor.transform(input_df)

        # Predict severity (model classes are 0–3)
        prediction = int(model.predict(input_encoded)[0]) + 1

        # Get prediction probabilities
        probabilities = model.predict_proba(input_encoded)[0]

        probability_result = {
            str(i + 1): round(float(probabilities[i]) * 100, 2)
            for i in range(len(probabilities))
        }

        return jsonify({
            "predicted_severity": prediction,
            "probabilities": probability_result
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)
