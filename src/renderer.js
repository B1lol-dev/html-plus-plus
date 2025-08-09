/**
 * Safely executes a JavaScript expression from a string.
 * This function is the heart of our "magic", allowing code in HTML attributes.
 * @param {string} expression - The string of code to execute, e.g., "counter + 1" or "user.name".
 * @param {object} localScope - Local variables available only in this part of the code (e.g., a loop variable).
 * @param {object} globalState - The global state object, available everywhere.
 * @returns {*} The result of the executed code.
 */
export function evaluate(expression, localScope = {}, globalState = {}) {
  if (!expression) {
    return undefined;
  }

  // We combine the global state and local variables into a single `context` object.
  // This creates the "scope" for our expression.
  const context = { ...globalState, ...localScope };

  // Get all variable names (keys) and their values from the context.
  const keys = Object.keys(context);
  const values = Object.values(context);

  try {
    // `new Function` is a safe way to execute code from a string.
    // We create a new function whose arguments are all our variables,
    // and whose body is our expression with a `return` statement.
    // Example: new Function("counter", "num", "return num + counter.value")
    const func = new Function(...keys, `return ${expression}`);

    // We call the created function, passing it the actual variable values.
    return func(...values);
  } catch (error) {
    // If there's an error in the expression, log it and return undefined.
    console.error(`Failed to evaluate expression: "${expression}"`, { context, error });
    return undefined;
  }
}

/**
 * The Renderer class is responsible for drawing the HTML.
 */
export class Renderer {
  constructor(tagHandlers, globalState) {
    // A map where the key is the tag name (lowercase) and the value is the handler function.
    this.tagHandlers = tagHandlers;
    // The global state object, which will be needed for evaluating expressions.
    this.globalState = globalState;

    // Bind the renderNode method to this instance to ensure `this` is correct when passed in callbacks.
    this.renderNode = this.renderNode.bind(this);

    // Create a convenient `evaluate` function directly on the renderer instance.
    // Now handlers don't need to know about the global state; they just call `renderer.evaluate()`.
    this.evaluate = function(expression, localScope = {}) {
      return evaluate(expression, localScope, this.globalState.getAll());
    }
  }

  /**
   * Recursively traverses the DOM tree and applies handlers to special tags.
   * @param {HTMLElement} rootNode - The node to start traversing from (e.g., document.body).
   * @param {object} localScope - Local variables for this branch of the DOM.
   */
  renderNode(rootNode, localScope = {}) {
    // Get a static list of child elements.
    // It's important to work with a copy, not a "live" collection, because handlers can change the DOM.
    const children = Array.from(rootNode.children);

    children.forEach(childElement => {
      const tagName = childElement.tagName.toLowerCase();
      const handler = this.tagHandlers[tagName];

      if (handler) {
        // If there is a handler for this tag, call it.
        // The handler itself is responsible for what to do with the tag and its content.
        handler(childElement, localScope, this);
      } else {
        // If it's a normal tag (div, p, li), just go deeper inside it
        // to find and process special tags there.
        this.renderNode(childElement, localScope);
      }
    });
  }
}