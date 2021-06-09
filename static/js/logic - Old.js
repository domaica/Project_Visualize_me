// Creating map object
var myMap = L.map("map", {
  center: [39.82, -98.57],
  zoom: 4
});

// Adding tile layer to the map
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
}).addTo(myMap);

// Store API query variables
// var baseURL = "https://data.cityofnewyork.us/resource/fhrw-4uyv.json?";
// var date = "$where=created_date between'2016-01-01T00:00:00' and '2017-01-01T00:00:00'";
// var complaint = "&complaint_type=Rodent";
// var limit = "&$limit=10000";

// Assemble API query URL
// var url = baseURL + date + complaint + limit;

// Varaible to hold state names for dropdown menu
var states = [""];
var restaurants = {};

// Grab the data with d3
d3.csv("fast_food.csv").then(function(response) {
console.log(response)
  // Create a new marker cluster group
  var markers = L.markerClusterGroup();
  
  // Loop through data
  for (var i = 0; i < response.length; i++) {

    // Set the data location property to a variable
    var location = [response[i].latitude,response[i].longitude];
    // console.log(location);

    // Check for location property
    if (location) {

      // Add a new marker to the cluster group and bind a pop-up
      // markers.addLayer(L.marker([location.coordinates[1], location.coordinates[0]])
      markers.addLayer(L.marker(location)
        .bindPopup("<strong>" + response[i].name + "</strong>" + "<hr>"  
        + response[i].address + "<br>" 
        + response[i].city
        + ", " + response[i].state
        
        ));
        // .bindPopup("<h3>" + response[i].name + "</h3> <hr> <h4>" response[i].address + response[i].city "</h4>");)
        // .bindPopup("<h3>" + response[i].name + "</h3> <hr> <h4>" + response[i].address + "</h4>");

    }

    // Get state names for drop down
    if (!(states.includes(response[i].state))) {
      states.push(response[i].state);
    }

    // Get restaurant names and count for top 10
    if (!(response[i].name in restaurants)) {
      //console.log(response[i].name)
      restaurants[response[i].name] = 1;
    }
    else {
      restaurants[response[i].name]++;
    }


  }
  console.log(states);
  // Sort reataurants from greatest to least frequency
  // https://stackoverflow.com/questions/25500316/sort-a-dictionary-by-value-in-javascript
  var restaurantsSorted = Object.keys(restaurants).map(function(key) {
    return [key, restaurants[key]];
  });
  
  // Sort the array based on the second element
  restaurantsSorted.sort(function(first, second) {
    return second[1] - first[1];
  });
  // restaurants.sort(function(a, b) {
  //   return b.name - a.name;
  // });
  console.log(restaurantsSorted);

  // Add our marker cluster layer to the map
  myMap.addLayer(markers);

  // // Drop down selection and graphs
  // // Get names to update dropdown menu
  // var states = [];

  // console.log(states);
  // Get a reference to the drop down menu
  var menu = d3.select("#selDataset");
  // Sort the states in alphabetical order
  states.sort();
  states[0] = "ALL";
  // Iterate through names and add each name as an option in the drop down menu
  states.forEach(function(state) {
      var item = menu.append("option");
      item.text(state);
      item.attr("value", state);
  });

  // Check for changes on dropdown menu and call the updatePlotly function
  d3.selectAll("#selDataset").on("change", updatePlotly);

  function updatePlotly() {
      // Select the dropdown menu
      var dropdownMenu = d3.select("#selDataset");
      // Update subject ID based on selection
      stateInput = dropdownMenu.property("value");
      // Change the information on the page
      init(stateInput, states);
  }

  // Default state input is none selected (show all)
  var stateInput = "ALL";
  init(stateInput, states);

  // Initialize page to display information all states
  function init(stateInput, states) {
      // Get the index of the subject
      //indexID = names.indexOf(subjectID);
      //console.log(data.metadata[indexID]);

      // // Select the demographic info on the HTML document
      var demoInfo = d3.select("#sample-metadata");

      // Clear old demographic info
      demoInfo.selectAll("ul").remove(); 

      // Insert demographic info
      demoInfo.append("ul").text(`Looking at: ${stateInput}`);
      // demoInfo.append("ul").text(`BBTYPE: ${data.metadata[indexID].bbtype}`);
      // demoInfo.append("ul").text(`ETHNICITY: ${data.metadata[indexID].ethnicity}`);
      // demoInfo.append("ul").text(`GENDER: ${data.metadata[indexID].gender}`);
      // demoInfo.append("ul").text(`LOCATION: ${data.metadata[indexID].location}`);
      // demoInfo.append("ul").text(`BWFREQ: ${data.metadata[indexID].wfreq}`);
      // demoInfo.append("ul").text(`ID: ${data.metadata[indexID].id}`);

      // Create charts
      // Get the data and collect the top 10 samples
      var x = restaurantsSorted.map(x => x[1]);
      var xSliced = x.slice(0,10);
      console.log(xSliced);
      var y = restaurantsSorted.map(x => x[0]);
      var ySliced = y.slice(0,10).reverse();
      console.log(ySliced);
      var text = restaurantsSorted.map(x => x[0]);
      var textSliced = text.slice(0,10).reverse();
      
      // Bar graph
      var trace1 = {
        x: xSliced.reverse(),
        y: ySliced.map(item => (item.toString())),
        text: textSliced,
        type: "bar",
        name: "Fast Food",
        orientation: "h"
      }
      
      // Bar graph layout
      var layout1 = {
          yaxis: {
              type: "category",
              title: "Restaurant Name"
          },
          title: "Top 10 Restaurants"
      }
    
      Plotly.newPlot("bar", [trace1], layout1);

  //     // Bubble Chart
  //     var trace2 = {
  //         x: y,
  //         y: x,
  //         mode: "markers",
  //         marker: {
  //             color: y,
  //             size: x
  //         },
  //         text: text
  //     }
  //     var layout2 = {
  //         xaxis: {
  //             title: "OTU ID"
  //         },
  //         title: "Bacteria Cultures Per Sample"
  //     }
  //     Plotly.newPlot("bubble", [trace2], layout2);

      // Gauge
      var trace3 = {
              domain: { x: [0, 1], y: [0, 1] },
              value: x.reduce(function(a, b){return a + b;}, 0),
              //value: 10,
              title: { text: "Total Number of Restaurants" },
              type: "indicator",
              mode: "gauge+number",
              gauge: {
                  axis: {
                      visible: true,
                      range: [0, 10000],
                      tick0: 0,
                      dtick: 1000
                  }
                  
              }
      }
      var layout3 = {
          yaxis: {
            tickmode: "linear",
            tick0: 0,
            dtick: 1
          }
      }
      Plotly.newPlot("gauge", [trace3], layout3);
  } 

});
