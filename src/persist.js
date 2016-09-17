import fs from 'graceful-fs';
import crypto from 'crypto';

export const writeToFileIfChanged = (filename, content) => {
  try {
    const currentInput = fs.readFileSync(filename, 'utf-8');
    const oldHash = crypto.createHash('md5').update(currentInput).digest("hex");
    const newHash = crypto.createHash('md5').update(content).digest("hex");
    // the definitions haven't changed - ignore this
    if (oldHash === newHash) {
      return false;
    }
  } catch(e) {
  } finally {
    fs.writeFileSync(filename, content);
  }
};
