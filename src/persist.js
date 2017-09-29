import fs from 'graceful-fs';
import os from 'os';
import path from 'path';

export const writeToFileIfChanged = (filename, content) => {
  // Create the containing folder, as required
  const dirName = path.dirname(filename);
  if (!fs.existsSync(dirName)) {
    const sep = path.sep;
    const initDir = path.isAbsolute(dirName) ? sep : '';
    dirName.split(sep).reduce(function (parentDir, childDir) {
      const curDir = path.resolve(parentDir, childDir);
      if (!fs.existsSync(curDir)) {
        fs.mkdirSync(curDir);
      }
      return curDir;
    }, initDir);
  }

  if (fs.existsSync(filename)) {
    const currentInput = fs.readFileSync(filename, 'utf-8');

    if (currentInput !== content) {
      writeFile(filename, content);
    }
  } else {
    writeFile(filename, content);
  }
};

const writeFile = (filename, content) => {
  //Replace new lines with OS-specific new lines
  content = content.replace(/\n/g, os.EOL);

  fs.writeFileSync(filename, content, 'utf8');
};