import * as Papa from 'papaparse';
import * as fs from 'fs';
import * as path from 'path';
import * as winston from 'winston';

import { LocationObj, PapaparseResult } from "./types/types";

let results: Map<string, LocationObj>=new Map();
const loggerFilePath = path.join(__dirname, 'logProgram.log');
const csvLoggerFilepath = path.join(__dirname, 'csvLogger.log');
let logger: winston.Logger;
let csvLogger: winston.Logger;

  // Qui caricheremo tutti i valori parsati del .csv
  
  // TODO prendere il tempo iniziale dell'esecuzione
  //TODO: Parsare il CSV

  //TODO: Se la riga parsata del csv è presente nella mappa, allora aggiungere un valore al counter, verificare il min e max e sommare la media
  //TODO: Se la città non è presente allora result.set e si aggiunge

  //TODO: Finito il parse, si scorre la mappa e si scrive tutti i valori richiesti (dividendo la media per il counter)
  // TODO: stampare quanto ci ha messo

const createLogger = ()=>{
  logger = winston.createLogger({
    level: 'debug',
    format: winston.format.json(),
    transports: [
      new winston.transports.File({ filename: 'logProgram.log' })
    ]
  });
  csvLogger = winston.createLogger({
    level: 'debug',
    format: winston.format.json(),
    transports: [
      new winston.transports.File({ filename: 'csvLogger.log' })
    ]
  });
}
const processChunkAsync = async (chunkData: string[][]) => {
  for (const line of chunkData){
    const [city, temperature] = line[0].split(';');
    const temp: number = parseInt(temperature, 10);
    csvLogger.debug(`${city}, ${temp}`);
    if(isNaN(temp)){
      logger.error(`error parsing this line: ${line}`)
      console.error(`error parsing this line: ${line}`);
      continue;
    }
    if (!results.has(city)) {
      // Se la chiave non esiste, inserisce l'oggetto
      results.set(city, {
        minT: temp,
        maxT: temp,
        sommaT: temp,
        countDuplicates: 1
      });
      logger.debug(`Oggetto inserito con chiave "${city}".`)
      console.log(`Oggetto inserito con chiave "${city}".`);
    } else {
      const map:LocationObj = results.get(city)!;
      results.set(city, {
        minT: map.minT>temp ? temp: map.minT,
        maxT: map.maxT<temp ? temp: map.maxT,
        sommaT: temp+map.sommaT,
        countDuplicates: map.countDuplicates+1
      })
    }
    logger.debug(`Oggetto sommato con chiave "${city}".`)
    console.log(`Oggetto sommato con chiave "${city}".`);
  }
  console.log(`Elaborati ${chunkData.length} record`);
};

function print_results(){
  logger.info("starting printing results");

  for (const [key, value] of results.entries()) {
    logger.info(key, value);
    console.log(key, value);
  }
  console.log("Finito!")
}

function readCsv():void{
  Papa.parse(fs.createReadStream('data/weather_stations.csv'), {
    chunk: async (results: PapaparseResult, parser) => {
      await processChunkAsync(results.data);
    },
    complete: () => {
      print_results()
    },
    error: (error) => {
      console.error('Errore durante l\'elaborazione:', error);
    },
  });
}

createLogger();
readCsv();