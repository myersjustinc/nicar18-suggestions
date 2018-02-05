import sanitizeHtml from 'sanitize-html';

export default function sanitizeFormValue(rawValue) {
  const sanitized = sanitizeHtml(rawValue, {
    allowedTags: [],
    allowedAttributes: []
  });
  return sanitized.replace(/\n/g, '<br>');
}
