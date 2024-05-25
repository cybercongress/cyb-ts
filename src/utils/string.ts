export function shortenString(string: string, length = 300) {
  return string.length > length ? `${string.slice(0, length)}...` : string;
}

export function replaceQuotes(string: string) {
  return string.replace(/"/g, "'");
}

export function serializeString(input: string): string {
  return input
    .replace(/\\/g, '\\\\') // Escape backslashes
    .replace(/"/g, '\\"') // Escape double quotes
    .replace(/'/g, "\\'") // Escape single quotes
    .replace(/\n/g, '\\n') // Escape newlines
    .replace(/\r/g, '\\r'); // Escape carriage returns
}

export function deserializeString(serialized: string): string {
  return serialized
    .replace(/\\r/g, '\r') // Unescape carriage returns
    .replace(/\\n/g, '\n') // Unescape newlines
    .replace(/\\'/g, "'") // Unescape single quotes
    .replace(/\\"/g, '"') // Unescape double quotes
    .replace(/\\\\/g, '\\'); // Unescape backslashes
}
