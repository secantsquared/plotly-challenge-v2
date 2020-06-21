// inialize menu in the Page
function __menu__() {
  d3.json("samples.json").then(data => {
    // Add data to dropdown __menu__
    var dropdown__menu__ = d3.select("#selDataset");
    var __menu__Names = data.names;
    __menu__Names.forEach(name => {
      var __menu__Name = dropdown__menu__
        .append("option")
        .attr("value", name)
        .text(name);
    });
    //Append from the data
    var values = data.samples[0].sample_values;
    var labels = data.samples[0].otu_ids;
    var hover_text = data.samples[0].otu_labels;

    //Top ten slicing
    var top_10_values = values.slice(0, 10).reverse();
    var top_10_labels = labels.slice(0, 10).reverse();
    var top_10_hover_text = hover_text.slice(0, 10).reverse();
    var bar_chart_div = d3.select("#bar");

    //Trace 1
    var trace1 = {
      y: top_10_labels.map(object => "OTU " + object),
      x: top_10_values,
      text: top_10_hover_text,
      type: "bar",
      orientation: "h"
    };

    var layout = {
      margin: {
        t: 20,
        b: 20
      }
    };

    var bar_chart_data = [trace1];

    Plotly.newPlot("bar", bar_chart_data, layout);

    //Trace 2
    var trace2 = {
      // Use otu ids for the x values.
      x: labels,
      // Use sample values for the y values.
      y: values,
      // Use otu labels for the text values.
      text: hover_text,
      mode: "markers",
      marker: {
        // Use sample values for the marker size.
        size: values,
        // Use otu ids for the marker colors.
        color: labels
      }
    };

    var bubble_plot_data = [trace2];

    Plotly.newPlot("bubble", bubble_plot_data);

    //Metadata/ demographic information.
    var sample_meta_data = d3.select("#sample-metadata");
    var first_name = data.metadata[0];

    //Key value pair from the metadata JSON object
    Object.entries(first_name).forEach(([key, value]) => {
      sample_meta_data.append("p").text(`${key}: ${value}`);
    });
  });
}

//Update all of the plots as a new sample is selected.
// Updated plots and metadata for newly selected value
function optionChanged(select_value) {
  d3.json("samples.json").then(data => {
    // Filter data by matching id for samples to the select_value
    var samples = data.samples;
    var filtered_sample = samples.filter(sample => sample.id === select_value);

    // Update values for barchart
    var values = filtered_sample[0].sample_values;
    // Use otu_ids as the labels for the bar chart.
    var labels = filtered_sample[0].otu_ids;
    // Use otu_labels as the hover_text for the chart.
    var hover_text = filtered_sample[0].otu_labels;

    var top_10_values = values.slice(0, 10).reverse();
    var top_10_labels = labels.slice(0, 10).reverse();
    var top_10_hover_text = hover_text.slice(0, 10).reverse();
    var bar_chart_div = d3.select("#bar");

    // Use restlye to update bar chart
    Plotly.restyle("bar", "y", [top_10_labels.map(object => "OTU " + object)]);
    Plotly.restyle("bar", "x", [top_10_values]);
    Plotly.restyle("bar", "text", [top_10_hover_text]);

    // Use restyle to update bubbleplot
    Plotly.restyle("bubble", "x", [labels]);
    Plotly.restyle("bubble", "y", [values]);
    Plotly.restyle("bubble", "size", [values]);
    Plotly.restyle("bubble", "text", [hover_text]);
    Plotly.restyle("bubble", "color", [labels]);

    // Build metadata based on the filter
    var sample_meta_data = d3.select("#sample-metadata");
    sample_meta_data.html("");
    var demographics = data.metadata;
    var filtered_meta_data = demographics.filter(
      sample => sample.id === parseInt(select_value)
    );

    // Display each key value pair from the metadata JSON object
    // somewhere on the page.
    Object.entries(filtered_meta_data[0]).forEach(([key, value]) => {
      sample_meta_data.append("p").text(`${key}: ${value}`);
    });
  });
}
__menu__();
