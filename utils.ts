import { dirname, join } from "path";

/**
 * This function ensures that the program works with correct paths both as an executable and as source code
 * @param {string} path - the passed path where the file we want to open is located, for example "log/logProgram.log"
 * @returns {string} correct path to use
 */
export function createPath(path:string){
  if (process.execPath.includes('weather-parser')) // if you runned the executable
    return join(dirname(process.execPath), path); // It is crucial to always use the `path.join` method instead of manually
    //concatenating the path with slashes because if the application is run on a different operating system, it may not work correctly.
  return join(__dirname, path); // else you runned the source code
}