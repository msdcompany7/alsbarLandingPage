const ALLOWED_TAGS = new Set([
  "p",
  "br",
  "strong",
  "em",
  "ul",
  "ol",
  "li",
  "h2",
  "h3",
  "a",
]);

const VOID_TAGS = new Set(["br"]);

function isSafeHref(href: string) {
  const value = href.trim();
  if (!value) {
    return false;
  }

  const lower = value.toLowerCase();
  if (
    lower.startsWith("javascript:") ||
    lower.startsWith("data:") ||
    lower.startsWith("vbscript:")
  ) {
    return false;
  }

  return /^(https?:\/\/|mailto:|tel:|#|\/)/i.test(value);
}

function escapeAttribute(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;");
}

function sanitizeAnchorAttributes(attrs: string) {
  const hrefMatch = attrs.match(/\bhref\s*=\s*("([^"]*)"|'([^']*)'|([^\s>]+))/i);
  if (!hrefMatch) {
    return "";
  }

  const href = hrefMatch[2] ?? hrefMatch[3] ?? hrefMatch[4] ?? "";
  if (!isSafeHref(href)) {
    return "";
  }

  return ` href="${escapeAttribute(href)}" target="_blank" rel="noopener noreferrer"`;
}

export function sanitizeHtml(html: string) {
  if (!html) {
    return "";
  }

  let result = html
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "");

  result = result.replace(/<\/?([a-zA-Z][\w-]*)\b([^>]*)>/g, (match, rawTag, rawAttrs) => {
    const tag = rawTag.toLowerCase();
    if (!ALLOWED_TAGS.has(tag)) {
      return "";
    }

    const isClosing = match.startsWith("</");
    if (isClosing) {
      return `</${tag}>`;
    }

    if (VOID_TAGS.has(tag)) {
      return `<${tag}>`;
    }

    if (tag === "a") {
      const anchorAttrs = sanitizeAnchorAttributes(rawAttrs);
      return anchorAttrs ? `<a${anchorAttrs}>` : "<a>";
    }

    return `<${tag}>`;
  });

  return result;
}
