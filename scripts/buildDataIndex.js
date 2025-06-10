// scripts/buildDataIndex.js
import { readdirSync, writeFileSync, statSync } from "fs";
import { join } from "path";

const dataDir = "public/data";
const folders = readdirSync(dataDir).filter((f) =>
  statSync(join(dataDir, f)).isDirectory()
);

// Root-level index.json
writeFileSync(join(dataDir, "index.json"), JSON.stringify(folders, null, 2));

// Folder-level index.json
folders.forEach((folder) => {
  const files = readdirSync(join(dataDir, folder)).filter((f) =>
    f.endsWith(".json")
  );
  writeFileSync(
    join(dataDir, folder, "index.json"),
    JSON.stringify(files, null, 2)
  );
});

console.log("✅ data indexes generated");
