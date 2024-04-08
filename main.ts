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
  ho deciso di utilizzare una mappa: una struttura pratica e efficiente utile anche per
  grandi quantità di dati. I risultati vengono tutti memorizzati in RAM, anche se sono tanti
  non occupa molta memoria, se dovesse comunque essere un problema, un eventuale cambio di
  codice (non la chiamo miglioria perché libera la RAM ma a discapito delle prestazioni del programma) è
  memorizzare il tutto in file separati sull'HD.
  Siccome le mappe sono strutture simili a dizionari, ovvero memorizzate come coppia chiave valore,
  offrono delle funzioni per capire se esiste già un oggetto con la stessa chiave,
  una funzionalità utile per questo progetto e che userò in seguito.
  */
  let results: Map<string, LocationObj> = new Map();
  const logger: LogHelper = new LogHelper(loggerFilePath);
  const LoggerStream: Logger = logger.createLogger();
  new CsvHelper(results, LoggerStream);
}

main();
