export const validate_import_alias = (input: string) => {
  if (input.startsWith(".") || input.startsWith("/")) {
    return "Import alias can't start with '.' or '/'";
  }
  return;
};
