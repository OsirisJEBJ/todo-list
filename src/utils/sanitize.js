import DOMPurify from "dompurify";

export function sanitizeInput(value) {
  return DOMPurify.sanitize(value, { 
    ALLOWED_TAGS: [], 
    ALLOWED_ATTR: []

});
}
