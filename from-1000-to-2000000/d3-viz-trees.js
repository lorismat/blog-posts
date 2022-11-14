// ref article
// https://observablehq.com/@martgnz/using-flatbush-for-faster-canvas-maps
//
// canvas with d3
// https://bocoup.com/blog/d3js-and-canvas
//

// canvas setup
const margin = 10;
const dpi = 3;

let width = 700;
let height = 400;

// svg setup
const svg = d3.select("#dataviz-svg")
    .append("svg")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("viewBox", `-${margin} -${margin} ${width+2*margin} ${height+2*margin}`);

// Canvas size retrieves the same size as the SVG which is responsive
let widthCanvas = parseInt($("#dataviz-svg").css("width").slice(0, -2));
let heightCanvas = parseInt($("#dataviz-svg").css("height").slice(0, -2));

// canvas setup
const c = d3.select("#dataviz-canvas")
    .append("canvas")
    .style("width", `${widthCanvas}px`)
    .style("height", `${heightCanvas}px`)
    .attr("width", widthCanvas * dpi)
    .attr("height", heightCanvas * dpi);
const ctx = c.node().getContext('2d');

const maskCity = d3.json("../static/data/trees/rennes-ville.json");
const trees = d3.json("../static/data/trees/rennes-geojson.json");

let projection, projectionCanvas;
let path;

// drawing trees on a specific projection
// projection will be reused to draw the city in svg
trees.then(function(data) {

    projection = d3.geoMercator()
        .fitSize([width, height], data)

    projectionCanvas = d3.geoMercator()
        .fitSize([widthCanvas * dpi, heightCanvas * dpi], data)

    pathSvg = d3.geoPath().projection(projection);
    pathCanvas = d3.geoPath().projection(projectionCanvas).context(ctx);

    dataSample = data.geometries;

    // Sampling 1,000 trees out of 68,000 for svg drawing
    // sampling by 
    // 1. assigning a unique id to all observations
    // 2. sorting them in ascending
    // 3. filtering first 1000

    dataSample.forEach(assigningId);

    function assigningId(item, index) {
        item["uid"] = Math.floor(Math.random() * 10000000);
    }
    dataSample = d3.sort(dataSample, (a, b) => d3.ascending(a.uid, b.uid)).slice(0, 1000);


    function mousemove(event, d) {

        const pointer = d3.pointer(event, this);

        d3.selectAll(".dot")
            .attr("fill-opacity", 0.3)

        d3.selectAll("text")
            .style("display", "none")

        d3.select(this.firstChild)
            .attr("fill-opacity", 1)
            .attr("stroke", "#000")
            .attr("stroke-width", 1)

        const info = d3.select(this)
            .append("text")
            .attr("transform", `translate(${pointer[0]},${pointer[1]})`)
            .attr("x", 5)
            .attr("y", 10)
            .attr("font-size", 8)
            .attr("font-weight", "normal")
            .text(`[${d.coordinates[1].toFixed(2)},${d.coordinates[0].toFixed(2)}]`)

    }

    function mouseleave() {
        d3.selectAll(".dot")
            .attr("stroke-width", 0)
            .attr("fill-opacity", 1)

        d3.selectAll("text")
            .style("display", "none")
    }

    const dots = svg.selectAll("g")
        .data(dataSample)
        .join("g")
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)

    dots.append("circle")
        .attr("fill", "green")
        .attr("fill-opacity", 0.8)
        .attr("class", "dot")
        .attr("transform", d => `translate(${projection(d.coordinates)})`)
        .attr("r", 2)

    // drawing 68,000 dots in canvas
    data["geometries"].forEach(function(d, i) {
        ctx.beginPath();
        ctx.arc(projectionCanvas(d["coordinates"])[0], projectionCanvas(d["coordinates"])[1], 2, 0, 2 * Math.PI, false);
        ctx.fillStyle = "rgba(39, 174, 96,0.6)";
        ctx.fill();
        ctx.closePath();
    })
})

// adding Timeout to draw backgrounds
setTimeout(
    function() {
        maskCity.then(function(data) {
            // creating the mask for svg
            svg.append("path")
                .datum(topojson.feature(data, data.objects["rennes-ville"]))
                .attr("fill", "none")
                .attr("stroke", "#000")
                .attr("stoke-opacity", 1)
                .attr("stroke-width", 0.2)
                .attr("d", pathSvg);

            // creating the mask for canvas
            zones = topojson.feature(data, data.objects["rennes-ville"]).features;

            for (let i = 0; i < zones.length; i++) {
                const shape = zones[i];
                // paint municipalities
                ctx.beginPath();
                ctx.strokeStyle = 'rgba(50,50,50,0.5)';
                pathCanvas(shape);
                ctx.stroke();
            }

        })
    }, 3000);
