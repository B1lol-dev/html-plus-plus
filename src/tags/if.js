// Handler for the <if condition="..."> tag
export function handleIf(element, localScope, renderer) {
  let elseTag = null;
  if (element.nextElementSibling && element.nextElementSibling.tagName === "ELSE") {
    elseTag = element.nextElementSibling;
  }

  const condition = element.getAttribute("condition");

  const isConditionTrue = renderer.evaluate(condition, localScope);

  if (isConditionTrue) {
    element.style.display = ""; // An empty string resets the display to its default (e.g., "block" or "inline")
    if (elseTag !== null) {
      elseTag.style.display = "none";
    }
    // Important: we must now render any special tags *inside* the visible <if> tag.
    renderer.renderNode(element, localScope);
  } else {
    element.style.display = "none";
    if (elseTag !== null) {
      elseTag.style.display = "";
      // Important: we must now render any special tags *inside* the visible <else> tag.
      renderer.renderNode(elseTag, localScope);
    }
  }
}