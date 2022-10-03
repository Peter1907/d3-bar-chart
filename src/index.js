import './style.css';

d3.select('.container').append('h1').text('United States GDP').attr('id', 'title');

const w = 1000;
const h = 600;
const padding = 70;

const svg = d3.select('.svg').append('svg').attr('width', w).attr('height', h).style('background-color', 'white');

fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json')
  .then(response => response.json())
  .then(json => {
    const yScale = d3.scaleLinear().domain([0, d3.max(json.data, (d) => d[1])])
    .range([h - padding, padding]);

    const date = d3.timeParse("%Y-%m-%d");
    const quarter = d3.timeFormat("%q");
    const year = d3.timeFormat("%Y");
    const startDate = date(json.from_date);
    const endDate = date(json.to_date);

    const xScale = d3.scaleTime()
      .domain([startDate, endDate])
      .range([padding, padding + json.data.length * 3.07]);

    var tooltip = d3.select(".container")
      .append("div")
      .attr('id', 'tooltip')
      .style("position", "absolute")
      .style("z-index", "10")
      .style("padding", "10px 30px")
      .style("visibility", "hidden")
      .style("background", "#a4c2e1")
      .style('filter', 'drop-shadow(0 0 5px #303030)');

    svg.selectAll('rect').data(json.data).enter().append('rect').attr("class", "bar")
    .attr('x', (d) => xScale(date(d[0]))).attr('y', (d) => yScale(d[1])).attr('width', '3px')
    .attr('height', (d) => h - (yScale(d[1]) + padding)).attr('fill', '#33adff').attr('data-date', (d) => d[0]).attr('data-gdp', (d) => d[1]);

    d3.selectAll('rect').on('mouseover', () => tooltip.style('visibility', 'visible'))
    .on("mousemove", (d) => {
      return tooltip.attr('data-date', () => d[0]).style("top", "450px").style("left",(d3.event.layerX+20)+"px")
      .text(() => `${year(date(d[0]))} Q${quarter(date(d[0]))}`);
    }).on('mouseout', () => tooltip.style('visibility', 'hidden'));

    svg.append('g').attr('transform', `translate(${padding}, 0)`).call(d3.axisLeft(yScale)).attr('id', 'y-axis');
    svg.append('g').attr('transform', `translate(0, ${h - padding})`).call(d3.axisBottom(xScale)).attr('id', 'x-axis');
  })

