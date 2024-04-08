import { CsvHelper } from "./src/csv";
import { LocationObj } from "./types/types";
import { LogHelper } from "./log";
import { Logger } from "winston";
import { join } from "path";

const loggerFilePath = join(__dirname, "log", "logProgram.log");
const csvLoggerFilepath = join(__dirname, "log", "csvLogger.log");

// Qui caricheremo tutti i valori parsati del .csv

// TODO: prendere il tempo iniziale dell'esecuzione
// TODO: Parsare il CSV

// TODO: Se la riga parsata del csv è presente nella mappa, allora aggiungere un valore al counter, verificare il min e max e sommare la media
// TODO: Se la città non è presente allora result.set e si aggiunge

// TODO: Finito il parse, si scorre la mappa e si scrive tutti i valori richiesti (dividendo la media per il counter)
// TODO: stampare quanto ci ha messo

function main() {
  let results: Map<string, LocationObj> = new Map();

  const logger: LogHelper = new LogHelper(loggerFilePath);
  const csvLogger: LogHelper = new LogHelper(csvLoggerFilepath);
  const LoggerStream: Logger = logger.createLogger();
  const csvStream: Logger = csvLogger.createLogger();
  const csvParser: CsvHelper = new CsvHelper(results, csvStream, LoggerStream);
}

main();
