
import { useState } from "react";
import axios from "axios";
import { Brain, Loader2 } from "lucide-react";
import "./Prediction.css";

const initialForm = {
  Day_of_Week: "",
  Accident_Location_A: "",
  Accident_Location_A_Chainage_km: "",
  Accident_Location_A_Chainage_km_RoadSide: "",
  Road_Feature_E: "",
  Road_Condition_F: "",
  Weather_Conditions_H: "",
  Vehicle_Type_Involved_J_V1: "",
  Vehicle_Type_Involved_J_V2: "",
  Hour: "",
  Year: "",
  Month: ""
};

const dropdowns = [
  {
    name: "Day_of_Week",
    label: "Day of Week",
    options: [1, 2, 3, 4, 5, 6, 7]
  },
  {
    name: "Accident_Location_A",
    label: "Accident Location",
    options: [1, 2]
  },
  {
    name: "Accident_Location_A_Chainage_km_RoadSide",
    label: "Road Side",
    options: [1, 2]
  },
  {
    name: "Road_Feature_E",
    label: "Road Feature",
    options: [1, 2, 3, 4]
  },
  {
    name: "Road_Condition_F",
    label: "Road Condition",
    options: [1, 2, 3, 4, 5, 6, 7, 8]
  },
  {
    name: "Weather_Conditions_H",
    label: "Weather Condition",
    options: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
  },
  {
    name: "Vehicle_Type_Involved_J_V1",
    label: "First Vehicle Type",
    options: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 15]
  },
  {
    name: "Vehicle_Type_Involved_J_V2",
    label: "Second Vehicle Type",
    options: [-1, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
  }
];

const numberInputs = [
  {
    name: "Accident_Location_A_Chainage_km",
    label: "Chainage (km)",
    placeholder: "Enter chainage"
  },
  {
    name: "Hour",
    label: "Hour (0–23)",
    placeholder: "Enter hour",
    min: 0,
    max: 23
  },
  {
    name: "Year",
    label: "Year",
    placeholder: "Enter year"
  },
  {
    name: "Month",
    label: "Month (1–12)",
    placeholder: "Enter month",
    min: 1,
    max: 12
  }
];

function Prediction() {
  const [formData, setFormData] = useState(initialForm);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (name, value) => {
    setFormData((previous) => ({
      ...previous,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setResult(null);

    const missing = Object.entries(formData)
      .filter(([, value]) => value === "")
      .map(([name]) => name);

    if (missing.length > 0) {
      setError("Please fill in all 12 fields.");
      return;
    }

    const payload = Object.fromEntries(
      Object.entries(formData).map(([key, value]) => [
        key,
        Number(value)
      ])
    );

    if (
      payload.Hour < 0 || payload.Hour > 23 ||
      payload.Month < 1 || payload.Month > 12
    ) {
      setError("Please enter a valid hour and month.");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        "http://127.0.0.1:5000/predict",
        payload
      );

      setResult(response.data);
    } catch (err) {
      setError(
        err.response?.data?.error ||
        "Unable to connect to the prediction server. Check whether Flask is running."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="prediction-page" id="prediction">

      <div className="prediction-heading">
        <div>
          <p className="prediction-eyebrow">MACHINE LEARNING</p>
          <h2>Accident Severity Prediction</h2>
          <p>Enter the accident details to predict its severity class.</p>
        </div>
        <div className="prediction-icon">
          <Brain size={30} />
        </div>
      </div>

      <form className="prediction-form" onSubmit={handleSubmit}>

        <h3>Accident Information</h3>
        <p className="form-description">
          Select the appropriate values for each feature.
        </p>

        <div className="prediction-fields">

          {dropdowns.map((field) => (
            <div className="prediction-field" key={field.name}>
              <label htmlFor={field.name}>{field.label}</label>

              <select
                id={field.name}
                value={formData[field.name]}
                onChange={(event) =>
                  handleChange(field.name, event.target.value)
                }
                required
              >
                <option value="">Select {field.label}</option>

                {field.options.map((option) => (
                  <option key={option} value={option}>
                    {option === -1 ? "-1 (No second vehicle)" : option}
                  </option>
                ))}
              </select>
            </div>
          ))}

          {numberInputs.map((field) => (
            <div className="prediction-field" key={field.name}>
              <label htmlFor={field.name}>{field.label}</label>

              <input
                id={field.name}
                type="number"
                step="any"
                min={field.min}
                max={field.max}
                placeholder={field.placeholder}
                value={formData[field.name]}
                onChange={(event) =>
                  handleChange(field.name, event.target.value)
                }
                required
              />
            </div>
          ))}

        </div>

        {error && <p className="prediction-error">{error}</p>}

        <button
          type="submit"
          className="predict-button"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="loading-icon" size={18} />
              Predicting...
            </>
          ) : (
            <>
              <Brain size={18} />
              Predict Accident Severity
            </>
          )}
        </button>

      </form>

      {result && (
        <div className="prediction-result">
          <h3>Prediction Result</h3>

          <div className="result-main">
            <span>Predicted Severity Class</span>
            <strong>Class {result.predicted_severity}</strong>
          </div>

          <h4>Class Probabilities</h4>

          {Object.entries(result.probabilities).map(([severity, probability]) => (
            <div className="probability-row" key={severity}>
              <div className="probability-label">
                <span>Class {severity}</span>
                <strong>{probability}%</strong>
              </div>

              <div className="probability-track">
                <div
                  className="probability-fill"
                  style={{ width: `${probability}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}

export default Prediction;
