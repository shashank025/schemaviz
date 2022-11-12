import "core-js/stable";
import "regenerator-runtime/runtime";
import parse from "./parse";
import SchemaRenderer from "./render";

const API_ENDPOINT = "http://localhost:8000/dependencies";

// entry-point
main();

function main() {
  const visualizeButton = document.getElementById("myBtn");
  const uriTextBox = document.getElementById("connectionUri");
  const loadingIndicator = document.getElementById("loader");
  const chargeInput = document.getElementById("charge");
  const linkDistanceInput = document.getElementById("distance");

  const renderer = new SchemaRenderer(
    chargeInput.value,
    linkDistanceInput.value
  );

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
        setupAndRender(data.dependencies, renderer);
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

function setupAndRender(dependencies, renderer) {
  const { nodes, links } = parse(dependencies);
  const tableCountTd = document.getElementById("table_count");
  tableCountTd.textContent = nodes.length;

  const linkCountTd = document.getElementById("link_count");
  linkCountTd.textContent = links.length;

  const schemaSet = new Set(nodes.map(n => n.schema));

  // this will track whether a given schema is selected
  const schemaSelectionMap = new Map();
  schemaSet.forEach(schema => {
    // initially, every schema is selected
    schemaSelectionMap.set(schema, true);
  });

  const schemaCountTd = document.getElementById("schema_count");
  schemaCountTd.textContent = schemaSet.size;

  const schemaListingContainer = document.getElementById("schemas");
  schemaSet.forEach(schema => {
    const para = document.createElement("p");

    const input = constructInput(schema, e => {
      schemaSelectionMap.set(schema, e.target.checked);
      const updatedDependencies = dependencies.filter(dependency =>
        areSchemasSelected(dependency, schemaSelectionMap)
      );
      const updatedSchema = parse(updatedDependencies);
      renderer.updateSchema(updatedSchema);
    });
    const label = constructLabel(schema);

    para.appendChild(input);
    para.appendChild(label);

    schemaListingContainer.appendChild(para);
  });

  // don't forget to do first-time render!
  renderer.updateSchema({ nodes, links });
}

function constructInput(schema, changeListener) {
  const input = document.createElement("input");
  input.setAttribute("type", "checkbox");
  input.setAttribute("name", schema);
  input.setAttribute("value", schema);
  input.setAttribute("checked", true);
  input.addEventListener("change", changeListener);
  return input;
}

function constructLabel(schema) {
  const label = document.createElement("label");
  label.setAttribute("for", schema);
  label.textContent = schema;
  return label;
}

// select a dependency only if both its source and target schemas selected
function areSchemasSelected(dependency, schemaSelectionMap) {
  const { sourceSchema, targetSchema } = dependency;
  return (
    schemaSelectionMap.get(sourceSchema) &&
    targetSchema &&
    schemaSelectionMap.get(targetSchema)
  );
}
