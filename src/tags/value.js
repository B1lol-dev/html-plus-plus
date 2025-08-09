// Handler for the <value for="..."> tag
export function handleValue(element, localScope, renderer) {
  const expression = element.getAttribute("for");

  const result = renderer.evaluate(expression, localScope);

  // Display the result.
  // If the result is a state object (which has a .value property), show that.
  // Otherwise, show the result itself (e.g., for loop variables).
  if (result && typeof result === 'object' && result.hasOwnProperty('value')) {
    element.textContent = result.value;
  } else {
    element.textContent = result;
  }
}