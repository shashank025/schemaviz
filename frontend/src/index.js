import axios from "axios";
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

  // hide the loading indicator initially
  loadingIndicator.style.visibility = "hidden";

  // when the "Visualize" button is clicked
  visualizeButton.addEventListener("click", () => {
    loadingIndicator.style.visibility = "visible";
    const connUri = uriTextBox.value;
    const encodedConnUri = encodeURIComponent(connUri);
    axios
      .get(`${API_ENDPOINT}?connection_uri=${encodedConnUri}`)
      .then(response => {
        loadingIndicator.style.visibility = "hidden";
        const parsed = parse(response.data.dependencies);
        const renderer = new SchemaRenderer(parsed);
        renderer.render();
      })
      .catch(error => {
        loadingIndicator.style.visibility = "hidden";
        // TODO: show nice error message
        console.log(error);
      });
  });

  // when user presses Enter key with focus in the text input form field
  uriTextBox.addEventListener("keypress", e => {
    if (e.key === "Enter") {
      // we dont want to reload the page, dawg!
      e.preventDefault();
      // but we do want to simulate a button click!
      visualizeButton.click();
    }
  });
}
