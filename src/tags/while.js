// Handler for the <while condition="..."> tag

// ! IMPORTANT: A real `while` loop in a UI will almost always freeze the browser.
// For safety, we are making this tag a complete copy (alias) of the <if> tag.
// It will show its content as long as the condition is true, but it will not block the page.

import { handleIf } from "./if.js";

export const handleWhile = handleIf;
