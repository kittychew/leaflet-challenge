// Step 1: Create the base map
let map = L.map("map").setView([0, 0], 2); // Set initial view to global scale

// Step 2: Add the tile layer (base map)
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap contributors"
}).addTo(map);

// Step 3: Define the function to plot earthquakes
function plotEarthquakes(data) {
  // Loop through each earthquake feature
  data.features.forEach(feature => {
    const coordinates = feature.geometry.coordinates; // [longitude, latitude, depth]
    const properties = feature.properties; // Holds magnitude, place, etc.

    const latitude = coordinates[1];
    const longitude = coordinates[0];
    const depth = coordinates[2]; // Depth
    const magnitude = properties.mag; // Magnitude

    // Determine marker size and color based on magnitude and depth
    const markerSize = magnitude * 4; // Scale for size
    const markerColor = depth > 100 ? "red" : depth > 50 ? "orange" : "yellow";

    // Create a circle marker
    L.circleMarker([latitude, longitude], {
      radius: markerSize,
      fillColor: markerColor,
      color: "black",
      weight: 1,
      fillOpacity: 0.8
    })
      .bindPopup(`<h3>${properties.place}</h3><hr><p>Magnitude: ${magnitude}<br>Depth: ${depth}</p>`)
      .addTo(map);
  });
}

// Step 4: Fetch earthquake data and call the plotting function
fetch("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson")
  .then(response => response.json())
  .then(data => {
    console.log("Earthquake data fetched:", data); // Log fetched data
    plotEarthquakes(data); // Plot earthquakes on the map
  })
  .catch(error => {
    console.error("Error fetching earthquake data:", error);
  });

// Add a legend to the map
function addLegend() {
    const legend = L.control({ position: "bottomright" });
  
    legend.onAdd = function () {
      const div = L.DomUtil.create("div", "info legend");
  
      // Depth ranges and corresponding colors
      const depthRanges = [-10, 10, 50, 100]; // Depth ranges for color coding
      const colors = ["green", "yellow", "orange", "red"]; // Corresponding colors
  
      // Create a legend HTML content
      div.innerHTML = "<h4>Earthquake Depth (km)</h4>";
  
      // Loop through depthRanges and colors to add to the legend
      for (let i = 0; i < depthRanges.length; i++) {
        div.innerHTML +=
          `<div><i style="background: ${colors[i]}"></i> ` + 
          `${depthRanges[i]}${depthRanges[i + 1] ? "&ndash;" + depthRanges[i + 1] : "+"}</div>`;
      }
  
      return div;
    };
  
    legend.addTo(map); // Add the legend to the map
  }
  
  addLegend();
   
