export function isBlank(v: string | undefined | null): boolean {
  if (v === undefined) {
    return true;
  }

  if (v === null) {
    return true;
  }

  if (v === "") {
    return true;
  }

  return false;
}
