import { chmodSync, existsSync } from "fs";
import path from "path";

if (process.platform !== "win32") {
  const exePath = path.join(__dirname, "..", "..", "server", "xs-check-lsp");
  if (existsSync(exePath)) {
    chmodSync(exePath, 0o755);
  }
}
