import "core-js/stable";
import "regenerator-runtime/runtime";
import parse from "./parse";
import SchemaRenderer from "./render";

const API_ENDPOINT = "http://localhost:8000/dependencies";

// entry-point
main();

const constructStatsHtml = ({ nodes, links }) => {
  const n = nodes.length;
  const e = links.length;
  const s = [...new Set(nodes.map(n => n.schema))].length;
  return `<table>
    <tr><td>Tables:</td><td>${n}</td></tr>
    <tr><td>Edges:</td><td>${e}</td></tr>
    <tr><td>Schemas:</td><td>${s}</td></tr>
  </table>`;
};

function main() {
  const visualizeButton = document.getElementById("myBtn");
  const uriTextBox = document.getElementById("connectionUri");
  const loadingIndicator = document.getElementById("loader");
  const chargeInput = document.getElementById("charge");
  const linkDistanceInput = document.getElementById("distance");
  const simulationInfoElement = document.getElementById("simulation_info");

  const renderer = new SchemaRenderer(
    chargeInput.value,
    linkDistanceInput.value
  );
  let downloadedSchema = null;

  // hide the loading indicator initially
  loadingIndicator.style.visibility = "hidden";

  // when the "Visualize" button is clicked
  visualizeButton.addEventListener("click", () => {
    loadingIndicator.style.visibility = "visible";
    const connUri = uriTextBox.value;
    const encodedConnUri = encodeURIComponent(connUri);
    fetch(`${API_ENDPOINT}?connection_uri=${encodedConnUri}`)
      .then(response => response.json())
      .then(data => {
        loadingIndicator.style.visibility = "hidden";
        downloadedSchema = data.dependencies;
        const parsedSchema = parse(downloadedSchema);
        simulationInfoElement.innerHTML = constructStatsHtml(parsedSchema);
        renderer.updateSchema(parsedSchema);
      })
      .catch(error => {
        loadingIndicator.style.visibility = "hidden";
        // TODO: show nice error message
        // eslint-disable-next-line no-console
        console.log(error);
      });
  });

  // when user presses "Enter" key with focus on the database uri form input
  uriTextBox.addEventListener("keypress", e => {
    if (e.key === "Enter") {
      // we dont want to reload the page, dawg!
      e.preventDefault();
      // but we do want to simulate a button click!
      visualizeButton.click();
    }
  });

  // re-render (but dont re-download) when particle charge is modified
  chargeInput.addEventListener("change", e => {
    renderer.updateCharge(e.target.value);
  });

  // re-render (but dont re-download) when link distance is modified
  linkDistanceInput.addEventListener("change", e => {
    renderer.updateLinkDistance(e.target.value);
  });
}
