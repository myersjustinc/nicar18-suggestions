import anchorme from 'anchorme';
import sanitizeHtml from 'sanitize-html';

export default function sanitizeFormValue(rawValue) {
  const sanitized = sanitizeHtml(rawValue, {
    allowedTags: [],
    allowedAttributes: []
  });
  const withBreaks = sanitized.replace(/\n/g, '<br>');
  const withLinks = anchorme(withBreaks, {
    truncate: 30,
    attributes: [
      {name: 'target', value: '_blank'},
      {name: 'rel', value: 'noopener noreferrer'}
    ]
  });
  return withLinks;
}
