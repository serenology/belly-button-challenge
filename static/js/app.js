// Global variable to hold the fetched data
let globalData;

d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then((data) => {
  // Store the fetched data in the global variable
  globalData = data;

  // Populate dropdown menu
  var dropdownMenu = d3.select("#selDataset");
  data.names.forEach((name) => {
    dropdownMenu.append("option").text(name).property("value", name);
  });

  // Initial chart rendering with the first dataset
  updateCharts(data.names[0]);
});

// Define updateCharts function outside of the .then() to make it globally accessible
function updateCharts(sampleId) {
  var samples = globalData.samples.filter(obj => obj.id === sampleId)[0];
  
  // Bar chart data
  var barSampleValues = samples.sample_values.slice(0, 10).reverse();
  var barOtuIds = samples.otu_ids.slice(0, 10).reverse().map(otuID => `OTU ${otuID}`);
  var barOtuLabels = samples.otu_labels.slice(0, 10).reverse();
  
  // Bar chart
  var barTrace = {
    x: barSampleValues,
    y: barOtuIds,
    text: barOtuLabels,
    type: 'bar',
    orientation: 'h'
  };
  var barLayout = {
    title: "Top 10 OTUs Found",
  };
  Plotly.newPlot("bar", [barTrace], barLayout);
  
  // Bubble chart data
  var bubbleOtuIds = samples.otu_ids;
  var bubbleSampleValues = samples.sample_values;
  var bubbleOtuLabels = samples.otu_labels;
  
  // Bubble chart
  var bubbleTrace = {
    x: bubbleOtuIds,
    y: bubbleSampleValues,
    text: bubbleOtuLabels,
    mode: 'markers',
    marker: {
      size: bubbleSampleValues,
      color: bubbleOtuIds,
      colorscale: "Earth"
    }
  };
  var bubbleLayout = {
    title: 'Bacteria Cultures Per Sample',
    showlegend: false,
    height: 600,
    width: 1200
  };
  Plotly.newPlot("bubble", [bubbleTrace], bubbleLayout);

  // Find and display the metadata for the selected sampleId
  var metadata = globalData.metadata.filter(obj => obj.id == sampleId)[0];
  var metadataDisplay = d3.select("#sample-metadata");
  metadataDisplay.html(""); // Clear existing metadata
  Object.entries(metadata).forEach(([key, value]) => {
    metadataDisplay.append("h5").text(`${key.toUpperCase()}: ${value}`);
  });
}

// Function to handle dropdown selection change
function optionChanged(newSampleId) {
  updateCharts(newSampleId);
}
