import { initState, State } from "./state.js";
import { Renderer } from "./renderer.js";
import { handleIf } from "./tags/if.js";
import { handleFor } from "./tags/for.js";
import { handleValue } from "./tags/value.js";
import { handleWhile } from "./tags/while.js";
import { handleDoWhile } from "./tags/do-while.js";

// Make our State object global, so it can be accessed
// from event handlers in the HTML, like onclick="State.set(...)".
window.State = State;

document.addEventListener("DOMContentLoaded", function () {
  // Create a map that connects tag names to their handler functions.
  const tagHandlerMap = {
    value: handleValue,
    if: handleIf,
    for: handleFor,
    while: handleWhile,
    "do-while": handleDoWhile,
  };

  // Create a new instance of the renderer.
  // Pass it the map of handlers and the global state object.
  const renderer = new Renderer(tagHandlerMap, State);

  // Initialize the state by reading data from the <state> tags.
  // We pass it a function that will be called every time the state changes.
  initState(function () {
    console.log("State changed. Re-rendering the page.");
    // This function is the callback. It tells the renderer to update the entire `body`.
    renderer.renderNode(document.body);
  });

  console.log("System initialized. Performing initial render.");
  renderer.renderNode(document.body);
});
