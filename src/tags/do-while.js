// Handler for the <do-while condition="..."> tag
export function handleDoWhile(element, localScope, renderer) {
  let showElement = false;

  // This tag must be displayed at least once.
  // We use a `_hasRenderedOnce` flag to track the first render.
  if (!element._hasRenderedOnce) {
    showElement = true;
    element._hasRenderedOnce = true; // Set the flag
  } else {
    // For all subsequent renders, it behaves like a <while> or <if> tag.
    const condition = element.getAttribute("condition");
    showElement = renderer.evaluate(condition, localScope);
  }

  element.style.display = showElement ? "" : "none";

  if (showElement) {
    renderer.renderNode(element, localScope);
  }
}
