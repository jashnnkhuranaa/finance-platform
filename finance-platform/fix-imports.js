// fix-imports.js
const fs = require("fs");
const path = require("path");

const directoryPath = path.join(__dirname, "components");

function fixImports(dir) {
  fs.readdirSync(dir).forEach((file) => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      fixImports(filePath);
    } else if (file.endsWith(".jsx")) {
      let content = fs.readFileSync(filePath, "utf8");

      // Convert named imports to default imports (if needed)
      const namedImportRegex = /import\s*{([^}]+)}\s*from\s*["'](.*?)["'];/g;
      content = content.replace(namedImportRegex, (match, imports, path) => {
        const importNames = imports
          .trim()
          .split(",")
          .map((name) => name.trim());
        return importNames
          .map((name) => `import ${name} from "${path}";`)
          .join("\n");
      });

      fs.writeFileSync(filePath, content, "utf8");
      console.log(`Updated imports: ${filePath}`);
    }
  });
}

fixImports(directoryPath);
