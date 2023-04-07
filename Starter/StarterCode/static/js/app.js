// Create variable to hold url. Make it const so I don't accidentally change it at some point
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

// Get JSON and print to console to double-check
d3.json(url).then(function(data) {
  console.log(data);
});

// Start dashboard 
function init() {

    // Select dropdown using d3
    let dropdown = d3.select("#selDataset");
    // Get sample names and fill dropdown
    d3.json(url).then((data) => {
        // Create variable for sample names
        let names = data.names;
        // Add to dropdown
        names.forEach((id) => {
            // Print each id in loop
            console.log(id);
            dropdown.append("option")
            .text(id)
            .property("value",id);
        });
        // Set the first sample from the list
        let first_sample = names[0];
        // Log this value
        console.log(first_sample);

        
        // Setup initial plots
       fillMetadata(first_sample);
        createBarChart(first_sample);
        createBubbleChart(first_sample);

    });
};

// Create function to fill metadata
function fillMetadata(sample) {

    // Retrieve data using d3
    d3.json(url).then((data) => {
        let metadata = data.metadata;
        // Filter based on sample value
        let value = metadata.filter(result => result.id == sample);
        // Print filtered values to console
        console.log(value)
        // Get first index
        let valueData = value[0];
        // Used to clear data (***stackoverflow***)
        d3.select("#sample-metadata").html("");
        // Use .entries to add key value pairs 
        Object.entries(valueData).forEach(([key,value]) => {
            // Print each key value pairs to console as they are added
            console.log(key,value);
            d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);
        });
    });

};

// Create function for making Bar Plot
function createBarChart(sample) {
   
    // Retrieve data using d3
    d3.json(url).then((data) => {
        let sampleInfo = data.samples;
        // Filter based on sample value
        let value = sampleInfo.filter(result => result.id == sample);
        // Get first index
        let valueData = value[0];
        // Grab otu_ids, lables, and sample values
        let otu_ids = valueData.otu_ids;
        let otu_labels = valueData.otu_labels;
        let sample_values = valueData.sample_values;
        // Print data to console
        console.log(otu_ids,otu_labels,sample_values);
        // Grab top 10 OTUs
        let yticks = otu_ids.slice(0,10).map(id => `OTU ${id}`).reverse();
        let xticks = sample_values.slice(0,10).reverse();
        let labels = otu_labels.slice(0,10).reverse();
        // Create trace variable for plotly (***Plotly Documentation***)
        let trace = {
            x: xticks,
            y: yticks,
            text: labels,
            type: "bar",
            orientation: "h",
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: "Jet"
            }
        };
        // Create layout variable for plotly
        let layout = {
            title: "Most Present Bacteria"
        };
        // Use Plotly to plot 
        Plotly.newPlot("bar", [trace], layout)
    });
};

// Create function for making Bubble Chart
function createBubbleChart(sample) {
    // Retrieve data using d3
    d3.json(url).then((data) => {
        let sampleInfo = data.samples;
        // Filter based on sample value
        let value = sampleInfo.filter(result => result.id == sample);
        // Get first index
        let valueData = value[0];
        // Grab otu_ids, lables, and sample values
        let otu_ids = valueData.otu_ids;
        let otu_labels = valueData.otu_labels;
        let sample_values = valueData.sample_values;
        // Print data to console
        console.log(otu_ids,otu_labels,sample_values);
        // Create trace variable for plotly
        let trace1 = {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: "Jet"
            }
        };
        // Create layout variable for plotly (***Plotly Documentation***)
        let layout = {
            title: "Bacteria Count in Sample",
            hovermode: "closest",
            xaxis: {title: "OTU ID"},
            yaxis: {title: "# of Bacteria"}
        };
        // Use Plotly to plot 
        Plotly.newPlot("bubble", [trace1], layout)
    });
};

// Create function to update dashboard 
function optionChanged(value) { 

    // Print updated value
    console.log(value); 
    // Update these with the value 
    fillMetadata(value);
    createBarChart(value);
    createBubbleChart(value)
};

// Call the initialize function
init();