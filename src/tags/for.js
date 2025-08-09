// Handler for the <for each="..." in="..."> tag
export function handleFor(element, localScope, renderer) {
  const itemVariableName = element.getAttribute("each");
  const arrayExpression = element.getAttribute("in");

  // To avoid re-reading innerHTML every time, we cache the template on the element itself.
  if (!element.template) {
    element.template = element.innerHTML;
  }

  const array = renderer.evaluate(arrayExpression, localScope);
  
  element.innerHTML = "";

  if (Array.isArray(array)) {
    // Use a DocumentFragment for efficient DOM additions.
    const fragment = document.createDocumentFragment();

    array.forEach(function(item, index) {
      const newScope = { ...localScope };
      newScope[itemVariableName] = item;
      newScope["index"] = index;

      const wrapper = document.createElement("div");
      wrapper.innerHTML = element.template;
      
      renderer.renderNode(wrapper, newScope);

      while(wrapper.firstChild) {
        fragment.appendChild(wrapper.firstChild);
      }
    });

    element.appendChild(fragment);
  }
}