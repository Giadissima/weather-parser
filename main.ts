import { CsvHelper } from "./src/csv";
import { LocationObj } from "./types/types";
import { LogHelper } from "./log";
import { Logger } from "winston";
import { join } from "path";

const loggerFilePath = join(__dirname,  "log", "logProgram.log");

// TODO: prendere il tempo iniziale dell'esecuzione
// TODO: stampare quanto ci ha messo

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
  new CsvHelper(results, LoggerStream);
}

main();
