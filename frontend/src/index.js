import axios from "axios";
import "core-js/stable";
import "regenerator-runtime/runtime";
import parse from "./parse";
import SchemaRenderer from "./render";

const API_ENDPOINT = "http://localhost:8000/dependencies";

// entry-point
main();

function main() {
  const visualizeButton = document.querySelector("#myBtn");

  // when the "Visualize" button is clicked
  visualizeButton.addEventListener("click", () => {
    const connUri = document.getElementById("connectionUri").value;
    const encodedConnUri = encodeURIComponent(connUri);
    // TODO: start a spinner that stops when this call finishes
    axios
      .get(`${API_ENDPOINT}?connection_uri=${encodedConnUri}`)
      .then(response => {
        const parsed = parse(response.data.dependencies);
        const renderer = new SchemaRenderer(parsed);
        renderer.render();
      })
      .catch(error => {
        // TODO: show nice error message
        console.log(error);
      });
  });

  // when user presses Enter key with focus in the text input form field
  document.querySelector("#connectionUri").addEventListener("keypress", e => {
    if (e.key === "Enter") {
      // we dont want to reload the page, dawg!
      e.preventDefault();
      // but we do want to simulate a button click!
      visualizeButton.click();
    }
  });
}
