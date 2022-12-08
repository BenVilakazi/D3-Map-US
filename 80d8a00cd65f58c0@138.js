// https://observablehq.com/@mbostock/u-s-voronoi-map-o-matic@138
function _1(md){return(
md`# U.S. Voronoi Map-o-Matic`
)}

function _map(d3,projection,html,topojson,us,data,svg,mesh)
{
  const path = d3.geoPath();
  const project = d3.geoPath(projection);
  return html`<svg viewBox="0 0 975 610" style="width: 100%; height: auto;">
  <path fill="#ddd" d="${path(topojson.feature(us, {type: "GeometryCollection", geometries: us.objects.states.geometries.filter(d => d.id !== "02" && d.id !== "15")}))}"></path>
  <path fill="none" stroke="#fff" stroke-linejoin="round" stroke-linecap="round" d="${path(topojson.mesh(us, us.objects.states, (a, b) => a !== b))}"></path>
  <g text-anchor="middle" font-family="sans-serif" font-size="10">${data.map(({name, longitude, latitude}) => svg`
    <g transform="translate(${projection([longitude, latitude]).join(",")})">
      <circle r="2"></circle>
      <text y="-6">${name}</text>
    </g>`)}
  </g>
  <path d="${project(mesh)}" fill="none" stroke="red"></path>
</svg>`;
}


function _3(md){return(
md`Edit the text below to change the displayed map. The columns are: *name*, *longitude*, *latitude*. Download your map using the cell menu <svg viewBox="0 0 8 14" fill="currentColor" stroke="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" width="8" height="14"><circle r="1.5" cx="4" cy="2"></circle><circle r="1.5" cx="4" cy="7"></circle><circle r="1.5" cx="4" cy="12"></circle></svg> to the left of the map above.`
)}

function* _source(html,d3,sampleData)
{
  const textarea = html`<textarea rows=1>${d3.csvFormatRows(sampleData)}`;
  textarea.style = `
  display: block;
  boxSizing: border-box;
  width: calc(100% + 28px);
  font: var(--monospace-font, var(--mono_fonts, monospace));
  border: none;
  padding: 6px 10px;
  margin: 0 -14px;
  background: #f5f5f5;
  tabSize: 2;
  outline: none;
`;
  textarea.oninput = () => {
    textarea.style.height = "initial";
    textarea.style.height = `${textarea.scrollHeight - 12}px`;
  };
  yield textarea;
  textarea.oninput();
}


function _5(md){return(
md`---

## Appendix`
)}

function _mesh(d3,data){return(
d3.geoVoronoi(data.map(({longitude, latitude}) => [longitude, latitude])).cellMesh()
)}

function _data(d3,source){return(
d3.csvParseRows(source, ([name, longitude, latitude]) => ({name, longitude: +longitude, latitude: +latitude}))
)}

async function _sampleData(d3,FileAttachment){return(
d3.csvParse(await FileAttachment("us-state-capitals.csv").text(), ({name, longitude, latitude}) => [name, +longitude, +latitude])
)}

function _projection(d3){return(
d3.geoAlbers().scale(1300).translate([487.5, 305])
)}

function _us(FileAttachment){return(
FileAttachment("states-albers-10m.json").json()
)}

function _topojson(require){return(
require("topojson-client@3")
)}

function _d3(require){return(
require("d3-dsv@1", "d3-geo@1", "d3-geo-voronoi@1")
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["us-state-capitals.csv", {url: new URL("./files/20a582cf0b12e055db5b187df696d488717f809e51f8e459484d52f9af0591b6e76f4fa741ece1fd498a3ebbe002d06dd279d67ff08493ee0ff101daab66c789.csv", import.meta.url), mimeType: "text/csv", toString}],
    ["states-albers-10m.json", {url: new URL("./files/0d8fa65dce2397df03b75fb4fabbc7d79e2794ef64f018bdd1dd43460bc3795743e69dbf1d7456791cbef424e272d5cd33f49e3e445ce78f9a53ef5e5755e16e.json", import.meta.url), mimeType: "application/json", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("map")).define("map", ["d3","projection","html","topojson","us","data","svg","mesh"], _map);
  main.variable(observer()).define(["md"], _3);
  main.variable(observer("viewof source")).define("viewof source", ["html","d3","sampleData"], _source);
  main.variable(observer("source")).define("source", ["Generators", "viewof source"], (G, _) => G.input(_));
  main.variable(observer()).define(["md"], _5);
  main.variable(observer("mesh")).define("mesh", ["d3","data"], _mesh);
  main.variable(observer("data")).define("data", ["d3","source"], _data);
  main.variable(observer("sampleData")).define("sampleData", ["d3","FileAttachment"], _sampleData);
  main.variable(observer("projection")).define("projection", ["d3"], _projection);
  main.variable(observer("us")).define("us", ["FileAttachment"], _us);
  main.variable(observer("topojson")).define("topojson", ["require"], _topojson);
  main.variable(observer("d3")).define("d3", ["require"], _d3);
  return main;
}
