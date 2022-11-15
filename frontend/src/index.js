import "core-js/stable";
import "regenerator-runtime/runtime";
import parse from "./parse";
import SchemaRenderer from "./render";

const API_ENDPOINT = "http://localhost:8000/dependencies";

// entry-point
main();

function main() {
  // hide the loading indicator initially
  document.getElementById("loader").style.visibility = "hidden";

  const visualizeButton = document.getElementById("myBtn");
  const uriTextBox = document.getElementById("connectionUri");
  const chargeInput = document.getElementById("charge");
  const linkDistanceInput = document.getElementById("distance");
  const selectedTableContainer = document.getElementById("selected-table");

  const renderer = new SchemaRenderer(
    chargeInput.value,
    linkDistanceInput.value,
    // eslint-disable-next-line no-console
    (event, node) => {
      // first, erase any contents within
      while (selectedTableContainer.firstChild) {
        selectedTableContainer.removeChild(selectedTableContainer.firstChild);
      }
      const t = document.createElement("table");
      t.append(constructSelectedTableRow("Table:", node.name));
      t.append(constructSelectedTableRow("Schema:", node.schema));
      t.append(constructSelectedTableRow("Links:", node.edges));
      selectedTableContainer.appendChild(t);
    }
  );

  visualizeButton.addEventListener("click", () =>
    onVisualize(uriTextBox.value, renderer)
  );

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

function constructSelectedTableRow(statName, statValue) {
  const tr = document.createElement("tr");
  const leftCell = document.createElement("td");
  leftCell.classList.add("stat-name");
  leftCell.textContent = statName;
  tr.appendChild(leftCell);
  const rightCell = document.createElement("td");
  rightCell.textContent = statValue;
  tr.appendChild(rightCell);
  return tr;
}

function onVisualize(uriTextBoxValue, renderer) {
  const loadingIndicator = document.getElementById("loader");
  loadingIndicator.style.visibility = "visible";

  const encodedConnUri = encodeURIComponent(uriTextBoxValue);
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
}

function setupAndRender(dependencies, renderer) {
  const { nodes, links } = parse(dependencies);
  const schemaSet = new Set(nodes.map(n => n.schema));
  // this will track whether a given schema is selected
  const schemaSelectionMap = new Map();
  schemaSet.forEach(schema => {
    // initially, every schema is selected
    schemaSelectionMap.set(schema, true);
  });

  document.getElementById("table_count").textContent = nodes.length;
  document.getElementById("link_count").textContent = links.length;
  document.getElementById("schema_count").textContent = schemaSet.size;

  const recomputeSchema = () => {
    const updatedDependencies = dependencies.filter(dependency =>
      areSchemasSelected(dependency, schemaSelectionMap)
    );
    return parse(updatedDependencies);
  };

  const schemaList = document.getElementById("schemas");
  // without this, subsequent "Visualize" hits will result in duplicates
  while (schemaList.firstChild) {
    schemaList.removeChild(schemaList.firstChild);
  }
  schemaSet.forEach(schema => {
    const para = document.createElement("p");

    const input = constructInput(schema, e => {
      schemaSelectionMap.set(schema, e.target.checked);
      renderer.updateSchema(recomputeSchema());
    });
    const label = constructLabel(schema);

    para.appendChild(input);
    para.appendChild(label);

    schemaList.appendChild(para);
  });

  // don't forget to do first-time render!
  renderer.updateSchema({ nodes, links });
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

function constructInput(schema, changeListener) {
  const input = document.createElement("input");
  input.setAttribute("type", "checkbox");
  input.setAttribute("id", schema);
  input.setAttribute("name", schema);
  input.setAttribute("value", schema);
  input.setAttribute("checked", true);
  input.addEventListener("change", changeListener);
  return input;
}

function constructLabel(schema) {
  const label = document.createElement("label");
  label.setAttribute("for", schema);
  label.style.fontFamily = "monospace";
  label.textContent = schema;
  return label;
}
