const CONTROL_CHARACTER_PATTERN = /[\u0000-\u001F\u007F]/g;
const HTML_ANGLE_PATTERN = /[<>]/g;
const MULTISPACE_PATTERN = /\s+/g;
const SCRIPT_PATTERN = /javascript:|data:|vbscript:|on\w+=/gi;

export function sanitizeTextInput(value: string): string {
  return value
    .normalize("NFKC")
    .replace(CONTROL_CHARACTER_PATTERN, "")
    .replace(HTML_ANGLE_PATTERN, "")
    .replace(SCRIPT_PATTERN, "")
    .replace(MULTISPACE_PATTERN, " ")
    .trim();
}

export function sanitizeUrl(url: string): string {
  const sanitized = url.trim();
  // Prevent javascript:, data:, and vbscript: URIs to protect against XSS in links/images
  if (/^(javascript|data|vbscript):/i.test(sanitized)) {
    return "";
  }
  return sanitized;
}

export function sanitizePhoneNumber(value: string): string {
  return value.replace(/[^\d+()\-\s.]/g, "").replace(MULTISPACE_PATTERN, " ").trim();
}
