import sanitizeHtml from 'sanitize-html';

export function sanitizeArticleHtml(html: string): string {
  if (!html) return '';

  return sanitizeHtml(html, {
    allowedTags: [
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'p', 'b', 'i', 'strong', 'em', 'strike', 's', 'u',
      'a', 'ul', 'ol', 'li', 'blockquote', 'hr', 'br',
      'img', 'iframe', 'figure', 'figcaption', 'code', 'pre',
      'table', 'thead', 'tbody', 'tr', 'th', 'td', 'div', 'span',
    ],
    allowedAttributes: {
      a: ['href', 'name', 'target', 'rel', 'class'],
      img: ['src', 'alt', 'title', 'width', 'height', 'loading', 'class'],
      iframe: [
        'src', 'width', 'height', 'frameborder', 'allow',
        'allowfullscreen', 'title', 'class',
      ],
      div: ['class'],
      span: ['class'],
      p: ['class'],
      h1: ['class'],
      h2: ['class'],
      h3: ['class'],
      h4: ['class'],
      blockquote: ['class'],
    },
    allowedIframeHostnames: ['www.youtube.com', 'youtube.com', 'www.youtube-nocookie.com', 'player.vimeo.com'],
    transformTags: {
      a: sanitizeHtml.simpleTransform('a', { rel: 'noopener noreferrer' }),
    },
  });
}
