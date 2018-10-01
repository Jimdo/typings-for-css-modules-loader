import fs from 'graceful-fs';
import os from 'os';

export const writeToFileIfChanged = (filename, content, options) => {
  if (fs.existsSync(filename)) {
    const currentInput = fs.readFileSync(filename, 'utf-8');

    if (currentInput !== content) {
      writeFile(filename, content, options);
    }
  } else {
    writeFile(filename, content, options);
  }
};

const writeFile = (filename, content, options) => {
  //Replace new lines with OS-specific new lines
  content = content.replace(/\n/g, options.EOL || os.EOL);

  fs.writeFileSync(filename, content, 'utf8');
};