import axios from "axios";
import "core-js/stable";
import "regenerator-runtime/runtime";
import parse from "./parse";
import SchemaRenderer from "./render";

const API_ENDPOINT = "http://localhost:8000/dependencies";

// entry-point
main();

function main() {
  // when the "Visualize" button is clicked
  document.querySelector("#myBtn").addEventListener("click", () => {
    const connUri = document.getElementById("connectionUri").value;
    const encodedConnUri = encodeURIComponent(connUri);
    axios
      .get(`${API_ENDPOINT}?connection_uri=${encodedConnUri}`)
      .then(response => {
        const parsed = parse(response.data.dependencies);
        const renderer = new SchemaRenderer(parsed);
        renderer.render();
      })
      .catch(error => {
        console.log(error);
      });
  });
  // TODO: handle Enter button press in the text input box
}
