import { CsvHelper } from "./src/csv";
import { LocationObj } from "./types/types";
import { LogHelper } from "./log";
import { Logger } from "winston";
import { createPath } from "./utils";
import { join } from "path";

const loggerFilePath = createPath(join("log", "logProgram.log"));

function main() {
  /* 
  I've decided to use a map: a practical and efficient structure also suitable for large amounts of data.
  All results are stored in RAM, even if they are many, it doesn't take up much memory. If it were still
  a problem, a potential code change (I don't call it an improvement because it frees up RAM but at the
  expense of program performance) is to store everything in separate files on the hard drive. 
  Since maps are structures similar to dictionaries, i.e., stored as key-value pairs, they offer functions
  to understand if an object with the same key already exists, a useful feature for this project and one that I will use later.
  */
  let results: Map<string, LocationObj> = new Map();
  const logger: LogHelper = new LogHelper(loggerFilePath);
  const LoggerStream: Logger = logger.createLogger();
  
  /* The parameter `process.argv[2]` represents the command-line input. If it is not passed, it will be `undefined`, and the
  class will take the default path that I have defined (by default, I have placed a CSV file in the `data` folder). */
  new CsvHelper(results, LoggerStream, process.argv[2]);
}

main();
