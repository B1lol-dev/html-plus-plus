// This object will hold all our application data in a simple key-value format.
// It is not exported, so it can only be accessed via State.get and State.set.
const applicationData = {};

// This will store the function that needs to be called whenever the data changes.
let renderCallback = function() {};

// This is the public State object that the rest of the app will use.
export const State = {
  /**
   * Sets a value in our application data store.
   * @param {string} key - The name of the data to set, e.g., "counter".
   * @param {*} value - The new value for the data.
   */
  set: function(key, value) {
    console.log(`Setting state: ${key} =`, value);
    applicationData[key] = value;

    // After changing the data, we call the render function to update the UI.
    renderCallback();
  },

  /**
   * Gets a value from our application data store.
   * @param {string} key - The name of the data to get.
   * @returns {*} The current value.
   */
  get: function(key) {
    return applicationData[key];
  },

  /**
   * Returns all data (mostly for debugging purposes).
   */
  getAll: function() {
    return applicationData;
  }
};

/**
 * Reads the initial data from the <state> tags in the HTML.
 * @param {function} onStateChange - The function to run when State.set() is called.
 */
export function initState(onStateChange) {
  // Store the callback function that will be called on state changes.
  renderCallback = onStateChange;

  const stateTags = document.querySelectorAll("state");

  stateTags.forEach(function(tag) {
    const id = tag.getAttribute("id");
    if (!id) {
      return; // Skip tag if it has no id
    }

    const type = tag.getAttribute("type") || "string";
    const valueAttr = tag.getAttribute("value");
    let initialValue;

    if (type === "number") {
      initialValue = Number(valueAttr);
    } else if (type === "boolean") {
      initialValue = valueAttr === "true";
    } else if (type === "json") {
      initialValue = JSON.parse(valueAttr);
    } else {
      initialValue = valueAttr;
    }
    
    // Store the initial value in our data store.
    // We don't use State.set here to avoid triggering a render for each tag.
    applicationData[id] = initialValue;
  });
}
