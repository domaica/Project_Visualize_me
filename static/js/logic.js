// Creating map object
var myMap = L.map("map", {
  center: [39.82, -98.57],
  zoom: 5
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

// Assemble API query URL
// var url = baseURL + date + complaint + limit;

// Variable to hold state names for dropdown menu
var states = [""];
var restaurants = {};

// Grab the data with d3
d3.csv("fast_food_v2.csv").then(function(response) {
console.log("CSV", response)
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
      markers.addLayer(L.marker(location)
        // Popup content  
        .bindPopup("<h4 style=font-size:20px;><strong>" + response[i].name + "</h4> <h5>" 
        + response[i].address + "<br>"  + response[i].city  + ", " + response[i].state + "</h5>"
        ));
    }

    // Get state names for drop down
    if (!(states.includes(response[i].state))) {
      states.push(response[i].state);
    }

    // Get restaurant names and count for top 10
    if (!(response[i].name in restaurants)) {
      // console.log(response[i].name)
      restaurants[response[i].name] = 1;
    }
    else {
      restaurants[response[i].name]++;
    }
  }
  console.log("Names counted", restaurants)
  console.log("States", states);

  // Sort restaurants from greatest to least frequency
  // https://stackoverflow.com/questions/25500316/sort-a-dictionary-by-value-in-javascript
  var restaurantsSorted = Object.keys(restaurants).map(function(key) {
    return [key, restaurants[key]];
  });
  
  // Sort the array based on the second element
  restaurantsSorted.sort(function(first, second) {
    return second[1] - first[1];
  });
  // });
  // numero de restaurantes por estado 
  console.log("# rest sorted", restaurantsSorted);

  // Add our marker cluster layer to the map
  myMap.addLayer(markers);

  // // Drop down selection and graphs
  // // Get names to update dropdown menu
  // Get a reference to the drop down menu
  var menu = d3.select("#selDataset");
  // Sort the states in alphabetical order
  states.sort();
  states[0] = "ALL_USA";
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
      console.log("STATE INPUT", stateInput)
      init(stateInput);
  }


  // Default state input is none selected (show all)
  var stateInput = "ALL_USA";
  // init(stateInput, states);
  init(stateInput);

  // Initialize page to display information all states
  // function init(stateInput, states) {
    function init(stateInput) {
      // Get the index of the subject
      //indexID = names.indexOf(subjectID);
      //console.log(data.metadata[indexID]);

      // // Select the demographic info on the HTML document
      var demoInfo = d3.select("#sample-metadata");

      // Clear old demographic info
      demoInfo.selectAll("p").remove(); 

      // Insert demographic info
      demoInfo.append("p").text(`Looking at: ${stateInput}`);

      var x = restaurantsSorted.map(x => x[1]);
      var xSliced = x.slice(0,10);
      console.log(xSliced);
      var y = restaurantsSorted.map(x => x[0]);
      var ySliced = y.slice(0,10).reverse();
      console.log(ySliced);
      var text = restaurantsSorted.map(x => x[0]);
      var textSliced = text.slice(0,10).reverse();
      
      // Bar graph
      var colors = ["red", "orange", "yellow","lightgreen","yellowgreen","green",
      "lightblue","turquoise","blue","navy"];
  
      var trace1 = {
        x: xSliced,
        y: ySliced.map(item => (item.toString())),
        marker: {
          color: colors,
          line: {
            width: 1,
          },
        },
        // horizontal bar type
        orientation: "h",
        type: "bar",
      };
      
      // // Bar graph layout
      // var layout1 = {
      //     yaxis: {
      //         type: "category",
      //         title: "Restaurant Name"
      //     },
      //     title: "Top 10 Restaurants by selected State"
      // }
      var stateInput = "ALL_USA";
      var layout1 = {
        // hoverinfo: otu_labels,
        title: {
          
          text: "<b>Top 10 fast food chains by selected State</b>",
          font: {
            size: 16,
            xanchor: "left",
            yanchor: "top",
          },
        },
        autosize: false,
        width: 600,
        height: 500,
        // paper_bgcolor: "#FBF6FD",
        margin: {
          l: 70,
          r: 20,
          b: 100,
          t: 70,
          pad: 4,
        },
        yaxis: {
          autorange: "reversed",
          automargin: true,
          font: {
             family: "Helvetica",
          },
          tickfont: {
            size: 14,
          },
        },
        xaxis: {
          title: {
            text: "<b># of restaurants</b>",
            font: {
               family: "Helvetica",
              size: 18,
            },
          },
          tickfont: {
            size: 13,
          },
          range: [0, 1300],
          tick0: 0,
          dtick: 200
        },
      };


      Plotly.newPlot("bar", [trace1], layout1);


      // Gauge
//       var trace3 = {
//               domain: { x: [0, 1], y: [0, 1] },
//               // value: wfreq,
//               value: x.reduce(function(a, b){return a + b;}, 0),
//               // value: x,
//               title: { text: "<b>Total Number of Restaurants by selected State</b><br> ",
//                   font: {size: 16},
//               },

//               type: "indicator",
//               mode: "gauge+number",
//               gauge: {
//                   axis: {
//                       visible: true,
//                       range: [0, 10000],
//                       tick0: 0,
//                       dtick: 1000
//                   }
//               },
//               threshold: {
//                 line: { color: "red", width: 4 },
//                 thickness: 0.75,
//                 value: 5000
//               },
//       }
//       var layout3 = {
//         width: 550, 
//       height: 350,
//       paper_bgcolor: "#FBF6FD",
//       font: {size: 15},
//       margin: {
//         l: 40,
//         r: 40,
//         b: 20,
//         t: 100,
//         pad: 5,
//       },
//           yaxis: {
//             tickmode: "linear",
//             tick0: 0,
//             dtick: 1
//           }
//       }
//       Plotly.newPlot("gauge", [trace3], layout3);
//   } 

// });


if (stateInput=="ALL_USA") {
  var trace3 = {
          domain: { x: [0, 1], y: [0, 1] },
          value: x.reduce(function(a, b){return a + b;}, 0),
          //value: 10,
          title: { text: "<b>Total Number of Restaurants by selected State</b><br> ",
              font: {size: 16},
          },
          type: "indicator",
          mode: "gauge+number",
          //mode: "gauge",
          gauge: {
              axis: {
                  visible: true,
                  range: [0, 10000],
                  tick0: 0,
                  dtick: 1000
              }
              
          }
  }
}
else {
  var trace3 = {
    domain: { x: [0, 1], y: [0, 1] },
    value: x.reduce(function(a, b){return a + b;}, 0),
    //value: 10,
    title: { text: "<b>Total Number of Restaurants by selected State</b><br> ",
    font: {size: 16},
      },
    type: "indicator",
    mode: "gauge+number",
    //mode: "gauge",
    gauge: {
        axis: {
            visible: true,
            range: [0, 3000],
            tick0: 0,
            dtick: 300
        }
        
    }
  }
}
      var layout3 = {
        width: 550, 
      height: 350,
      paper_bgcolor: "#FBF6FD",
      font: {size: 15},
      margin: {
        l: 40,
        r: 70,
        b: 20,
        t: 100,
        pad: 5,
      },
          yaxis: {
            tickmode: "linear",
            tick0: 0,
            dtick: 1
          }
      }
      Plotly.newPlot("gauge", [trace3], layout3);
  } 


restaurants = {};
//states = [];

});
