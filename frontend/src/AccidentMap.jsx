import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

function AccidentMap() {
  // These are approximate reference points for the four project regions.
  // They are NOT exact accident coordinates or verified highway-route points.
  const locations = [
    {
      name: "Pune–Solapur Highway",
      region: "Maharashtra",
      accidents: 2804,
      position: [18.09, 74.88]
    },
    {
      name: "Barwa-Adda–Panagarh Highway",
      region: "Jharkhand & West Bengal",
      accidents: 3710,
      position: [23.62, 86.80]
    },
    {
      name: "Chengapally–Walayar Highway",
      region: "Tamil Nadu",
      accidents: 422,
      position: [10.99, 77.02]
    },
    {
      name: "Nagpur Region",
      region: "Maharashtra",
      accidents: 1180,
      position: [21.1458, 79.0882]
    }
  ];

  return (
    <div style={{ width: "100%", height: "450px", position: "relative" }}>
      <MapContainer
        center={[20.59, 78.96]}
        zoom={5}
        style={{ height: "100%", width: "100%", borderRadius: "12px" }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {locations.map((location) => (
          <CircleMarker
            key={location.name}
            center={location.position}
            radius={10}
            pathOptions={{
              color: "#ffffff",
              fillColor: "#ef4444",
              fillOpacity: 0.85,
              weight: 2
            }}
          >
            <Popup>
              <strong>{location.name}</strong>
              <br />
              Region: {location.region}
              <br />
              Dataset records: {location.accidents.toLocaleString()}
              <br />
              <em>Approximate project-region marker</em>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>

      <p
        style={{
          fontSize: "12px",
          color: "#64748b",
          marginTop: "10px",
          lineHeight: "1.5"
        }}
      >
        Note: Markers show approximate highway project regions, not the exact
        locations of individual accidents. Record counts are project-level
        totals from the dataset source.
      </p>
    </div>
  );
}

export default AccidentMap;
