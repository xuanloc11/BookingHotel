const CONTROL_CHARACTER_PATTERN = /[\u0000-\u001F\u007F]/g;
const HTML_ANGLE_PATTERN = /[<>]/g;
const MULTISPACE_PATTERN = /\s+/g;

export function sanitizeTextInput(value: string): string {
  return value
    .normalize("NFKC")
    .replace(CONTROL_CHARACTER_PATTERN, "")
    .replace(HTML_ANGLE_PATTERN, "")
    .replace(MULTISPACE_PATTERN, " ")
    .trim();
}

export function sanitizePhoneNumber(value: string): string {
  return value.replace(/[^\d+()\-\s.]/g, "").replace(MULTISPACE_PATTERN, " ").trim();
}
