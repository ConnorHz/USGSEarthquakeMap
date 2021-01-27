
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

var depthGradient = [
    {
        min: -10,
        max: 10,
        color: "#a3f600",
        get label() {
            return `${this.min}-${this.max}`
        } 

    }, 
    {
        min: 10,
        max: 30,
        color: "#dcf400",
        get label() {
            return `${this.min}-${this.max}`
        } 
    }, 
    {
        min: 30,
        max: 50,
        color: "#f7db11",
        get label() {
            return `${this.min}-${this.max}`
        } 
    },
    {
        min: 50,
        max: 70,
        color: "#fdb72a",
        get label() {
            return `${this.min}-${this.max}`
        } 
    },
    {
        min: 70,
        max: 90,
        color: "#fca35d",
        get label() {
            return `${this.min}-${this.max}`
        } 
    },
    {
        min: 90,
        max: 1000,
        color: "#ff5f65",
        get label() {
            return `${this.min}+`
        } 
    }
]


function createMap(earthquakeMarkers) {

    var darkLayer = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "dark-v10",
    accessToken: API_KEY
    });

    var satelliteLayer = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    maxZoom: 18,
    id: "satellite-v9",
    accessToken: API_KEY
    });

    var layers = {
        Dark: darkLayer,
        Satellite: satelliteLayer
    }

    var overlayMaps = {
        Earthquakes: earthquakeMarkers
    };

    var myMap = L.map("map", {
        center: [39.38, -113.78],
        zoom: 5,
        layers: [satelliteLayer, earthquakeMarkers]
    });

    L.control.layers(layers, overlayMaps).addTo(myMap);

    var legend = L.control({ position: "bottomright" });
    legend.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend");

        var labels = [];

        // Add min & max
        var legendInfo = "<h1>Earthquake Depth (km)</h1>";

        div.innerHTML = legendInfo;

        depthGradient.forEach(function(x, index) {
            labels.push(`<li style="background-color: ${x.color}"></li>`);
        });

        div.innerHTML += "<ul>" + labels.join("") + "</ul>";
        return div;
    };

    legend.addTo(myMap);

}

d3.json(url, data => {

    console.log(data);

    var earthquakeMarkers = data.features.map(feature => {

        var depth = feature.geometry.coordinates[2];
        var circleColor = depthGradient.filter(x => (x.min < depth && x.max >= depth))[0].color;

        return L.circle([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], {
                        color: circleColor,
                        weight: 1,
                        fillColor: circleColor,
                        fillOpacity: 0.75,
                        radius: feature.properties.mag * 30000
                    }).bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p>`)
    });

    
    createMap(L.layerGroup(earthquakeMarkers));
});


