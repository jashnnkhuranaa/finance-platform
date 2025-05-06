// fix-files.js
const fs = require("fs");
const path = require("path");

const directoryPath = path.join(__dirname, "components"); // Components folder path

function fixFiles(dir) {
  fs.readdirSync(dir).forEach((file) => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      fixFiles(filePath); // Recursively check subfolders
    } else if (file.endsWith(".jsx")) {
      let content = fs.readFileSync(filePath, "utf8");

      // Remove CommonJS boilerplate
      content = content.replace(/"use strict";\n/g, "");
      content = content.replace(
        /var __importDefault = \(this && this\.__importDefault\) \|\| function \(mod\) \{[^}]+\};/g,
        ""
      );
      content = content.replace(
        /Object\.defineProperty\(exports, "__esModule", \{ value: true \}\);/g,
        ""
      );
      content = content.replace(/exports\.\w+\s*=\s*void 0;/g, "");

      // Fix invalid export default statements
      content = content.replace(
        /export default \w+;\s*(__importDefault\(require\("([^"]+)"\)\)|require\("([^"]+)"\));/g,
        'import $2$3 from "$2$3";'
      );

      // Remove stray };
      content = content.replace(/\n\};\n/g, "\n");

      // Fix incomplete const declarations
      content = content.replace(/const \w+_1 =\n/g, "");

      // Convert require to import
      const requireRegex =
        /const (\w+)_1 = (?:__importDefault\(require|require)\("([^"]+)"\)\);/g;
      content = content.replace(requireRegex, 'import $1 from "$2";');

      // Replace named exports with default export
      const namedExportRegex = /exports\.(\w+)\s*=\s*\w+;/g;
      if (content.match(namedExportRegex)) {
        content = content.replace(namedExportRegex, "");
        content = content.replace(
          /const (\w+)\s*=/,
          "const $1 =\n\nexport default $1;"
        );
      }

      // Fix CommonJS references (e.g., react_1.useState)
      content = content.replace(/\(0,\s*(\w+)_1\.(\w+)\)/g, "$2");

      // Fix module usage
      content = content.replace(/(\w+)_1\.(\w+)/g, "$2");

      // Fix link import naming
      content = content.replace(
        /import link from "next\/link";/,
        'import Link from "next/link";'
      );

      fs.writeFileSync(filePath, content, "utf8");
      console.log(`Updated: ${filePath}`);
    }
  });
}

fixFiles(directoryPath);
