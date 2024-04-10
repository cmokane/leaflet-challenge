let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

function createmap(earthquakes) {

    let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    let topomap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
        });

    let basemap = {"Street Map": streetmap, "Topographic Map": topomap
    };

    let dotmap = { "Earthquakes": earthquakes
    };

    let map = L.map("map", {center: [37.09, -95.71], zoom: 4, layers: [streetmap, earthquakes]
    });

    L.control.layers(basemap, dotmap, {
        collapsed: false
    }).addTo(map);

    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function() {
    
        var div = L.DomUtil.create('div', 'info legend'),
            grades = [-10, 10, 30, 50, 70, 90],
            labels = [];
    
        
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + mapColor(grades[i] + 1) + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }
    
        return div;
    };
    
    legend.addTo(map);

}

function dotSize(magnitude) {
    return magnitude * 20000;
}

function mapColor(depth) {
    if (depth < 10) return "#95b9e8";
    else if (depth < 30) return "##5d85ba";
    else if (depth < 50) return "#365a8a";
    else if (depth < 70) return "#1a4173";
    else if (depth < 90) return "#185cb5";
    else return "#04387d";
}

function mapMarkers(response) {

    let earthquakes = response.features;

    console.log(earthquakes);

    eqArray = [];

    for (let i = 0; i < earthquakes.length; i++) {

        let earthquake = earthquakes[i].properties;

        let coordinates = earthquakes[i].geometry.coordinates;

        let eqmarker = L.circle([coordinates[1], coordinates[0]], {
            fillOpacity: 1,
            color: "red",
            weight: 0.5,
            fillColor: mapColor(coordinates[2]),
            radius: dotSize(earthquake.mag)
        }).bindPopup("<h3>Location: " + earthquake.place + "<h3><h3>Magnitude: " + earthquake.mag + "<h3><h3>Depth: " + coordinates[2]);

        eqArray.push(eqmarker);
    }

    createmap(L.layerGroup(eqArray));
}

d3.json(url).then(mapMarkers);