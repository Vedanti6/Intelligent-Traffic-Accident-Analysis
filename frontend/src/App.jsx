import Prediction from "./Prediction";
import AccidentMap from "./AccidentMap";
import { useEffect, useState } from "react";

import {
  Activity,
  AlertTriangle,
  BarChart3,
  LayoutDashboard,
  Map,
  Brain,
  CalendarDays,
  ArrowUpRight,
  Car,
  CloudRain,
  Clock
} from "lucide-react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";

import "./App.css";

const severityColors = ["#60a5fa", "#34d399", "#fbbf24", "#f87171"];

function App() {
  const [dashboardStats, setDashboardStats] = useState(null);

  // Fetch dashboard data from Flask backend
  useEffect(() => {
    fetch("http://127.0.0.1:5000/dashboard-stats")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch dashboard data");
        }
        return response.json();
      })
      .then((data) => {
        setDashboardStats(data);
        console.log("Dashboard data:", data);
      })
      .catch((error) => {
        console.error("Error fetching dashboard data:", error);
      });
  }, []);

  // Dynamic severity chart data
  const severityData = dashboardStats
    ? Object.entries(dashboardStats.severity).map(([key, value]) => ({
        name: `Class ${key}`,
        value: value
      }))
    : [];

     // Dynamic monthly chart data
  const monthlyData = dashboardStats
    ? Object.entries(dashboardStats.monthly)
        .sort(([a], [b]) => Number(a) - Number(b))
        .map(([key, value]) => ({
          month: new Date(2000, Number(key) - 1).toLocaleString("en", {
            month: "short"
          }),
          accidents: value
        }))
    : [];

  // Find the month with the highest accidents
  const highestMonth = monthlyData.length
    ? monthlyData.reduce((max, item) =>
        item.accidents > max.accidents ? item : max
      )
    : null;

  // Find the most frequent severity class
  const highestSeverity = severityData.length
    ? severityData.reduce((max, item) =>
        item.value > max.value ? item : max
      )
    : null;

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">
            <Activity size={24} />
          </div>
          <div>
            <h2>Traffic<span>IQ</span></h2>
            <p>Accident Intelligence</p>
          </div>
        </div>

        <p className="menu-label">MAIN MENU</p>

        <nav className="sidebar-nav">
          <a href="#overview" className="nav-link active">
            <LayoutDashboard size={19} />
            Dashboard
          </a>

          <a href="#analysis" className="nav-link">
            <BarChart3 size={19} />
            Accident Analysis
          </a>

          <a href="#prediction" className="nav-link">
            <Brain size={19} />
            Severity Prediction
          </a>

          <a href="#map" className="nav-link">
            <Map size={19} />
            Project Map
          </a>
        </nav>

        <div className="sidebar-bottom">
          <div className="status-dot"></div>
          <span>ML Model Connected</span>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <p className="breadcrumb">Dashboard</p>
            <h1>Traffic Accident Dashboard</h1>
          </div>

        </header>

        <section id="map" className="panel" style={{ marginBottom: "25px" }}>
          <div className="panel-heading">
            <div>
              <h3>Highway Project Overview Map</h3>
              <p>Geographical overview of the four highway project regions</p>
            </div>
            <Map size={20} />
          </div>

          <AccidentMap />
        </section>

         <section id="overview" className="welcome-section">
          <Prediction />

          <div>
            <p className="eyebrow">INTELLIGENT TRAFFIC MONITORING</p>
            <h2>Accident Analysis & Severity Prediction</h2>
            <p>
              Explore accident patterns, identify hotspots and predict
              accident severity using machine learning.
            </p>
          </div>

          <div className="welcome-icon">
            <Activity size={48} />
          </div>
        </section>

        <section className="stats-grid">
          <div className="stat-card">
            <div className="stat-top">
              <span>Total Accidents</span>
              <div className="stat-icon blue"><Car size={21} /></div>
            </div>
            <h2>
              {dashboardStats
                ? dashboardStats.total_accidents.toLocaleString()
                : "Loading..."}
            </h2>
            <p>Records in the dataset</p>
          </div>

          <div className="stat-card">
            <div className="stat-top">
              <span>Severity Classes</span>
              <div className="stat-icon purple">
                <AlertTriangle size={21} />
              </div>
            </div>
            <h2>4</h2>
            <p>Classification categories</p>
          </div>

          <div className="stat-card">
            <div className="stat-top">
              <span>Input Features</span>
              <div className="stat-icon green"><Brain size={21} /></div>
            </div>
            <h2>12</h2>
            <p>Model input variables</p>
          </div>

          <div className="stat-card">
            <div className="stat-top">
              <span>Weather Categories</span>
              <div className="stat-icon orange">
                <CloudRain size={21} />
              </div>
            </div>
            <h2>12</h2>
            <p>Recorded weather codes</p>
          </div>
        </section>

        <section id="analysis" className="charts-grid">
          <div className="panel">
            <div className="panel-heading">
              <div>
                <h3>Monthly Accident Distribution</h3>
                <p>Number of recorded accidents by month</p>
              </div>
              <CalendarDays size={20} />
            </div>

            <div className="chart-area">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar
                    dataKey="accidents"
                    fill="#5685f5"
                    radius={[5, 5, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="panel">
            <div className="panel-heading">
              <div>
                <h3>Severity Distribution</h3>
                <p>Accidents across four severity classes</p>
              </div>
              <AlertTriangle size={20} />
            </div>

             <div className="chart-area">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={severityData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="45%"
                    outerRadius={95}
                    label
                  >
                    {severityData.map((entry, index) => (
                      <Cell
                        key={entry.name}
                        fill={severityColors[index]}
                      />
                    ))}
                  </Pie>

                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        <section className="bottom-grid">
          <div className="panel insight-panel">
            <div className="panel-heading">
              <div>
                <h3>Key Dataset Insights</h3>
                <p>Observations from exploratory data analysis</p>
              </div>
              <ArrowUpRight size={20} />
            </div>

            <div className="insight-item">
              <Clock size={20} />
              <div>
                <strong>Peak accident hour</strong>
                <p>7:00 PM in the available records</p>
              </div>
            </div>

            <div className="insight-item">
              <CalendarDays size={20} />
              <div>
                <strong>Highest accident month</strong>
                <p>
                  {highestMonth
                    ? `${highestMonth.month}, with ${highestMonth.accidents} records`
                    : "Loading..."}
                </p>
              </div>
            </div>

            <div className="insight-item">
              <Car size={20} />
              <div>
                <strong>Most frequent severity class</strong>
                <p>
                  {highestSeverity
                    ? `${highestSeverity.name}, with ${highestSeverity.value} records`
                    : "Loading..."}
                </p>
              </div>
            </div>
          </div>

          <div className="panel model-panel">
            <div className="panel-heading">
              <div>
                <h3>Prediction Model</h3>
                <p>Machine learning system status</p>
              </div>
              <Brain size={20} />
            </div>

            <div className="model-status">
              <div className="model-status-icon">
                <Brain size={30} />
              </div>
              <div>
                <h4>XGBoost Classifier</h4>
                <span>
                  <span className="status-dot"></span>
                  Model configured
                </span>
              </div>
            </div>

            <a href="#prediction" className="prediction-link">
              Go to Severity Prediction <ArrowUpRight size={17} />
            </a>
          </div>
        </section>

        <footer>
          Intelligent Traffic Accident Analysis & Severity Prediction
          <span>Machine Learning Project</span>
        </footer>
      </main>
    </div>
  );
}

export default App;
