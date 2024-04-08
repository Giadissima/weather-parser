import { LocationObj, PapaparseResult } from "../types/types";

import { Logger } from "winston";
import { createReadStream } from "fs";
import { join } from "path";
import { parse } from "papaparse";

export class CsvHelper {
  results: Map<string, LocationObj> = new Map();
  logger: Logger;
  csvLogger: Logger;
  filePath: string;

  constructor(
    results: Map<string, LocationObj>,
    csvLogger: Logger,
    logger: Logger,
    filePath: string = join("data", "weather_stations.csv")
  ) {
    this.results = results;
    this.csvLogger = csvLogger;
    this.logger = logger;
    this.filePath = filePath;
    this.readCsv();
  }

  processChunkAsync = async (chunkData: string[][]) => {
    for (const line of chunkData) {
      const [city, temperature] = line[0].split(";");
      const temp: number = parseInt(temperature, 10);
      this.csvLogger.debug(`${city}, ${temp}`);
      if (isNaN(temp) || !city || city === "") {
        this.logger.error(`error parsing this line: ${line}`);
        console.error(`error parsing this line: ${line}`);
        continue;
      }
      if (!this.results.has(city)) {
        // Se la chiave non esiste, inserisce l'oggetto
        this.results.set(city, {
          minT: temp,
          maxT: temp,
          sommaT: temp,
          countDuplicates: 1,
        });
        this.logger.debug(`Oggetto inserito con chiave "${city}".`);
        console.log(`Oggetto inserito con chiave "${city}".`);
      } else {
        const map: LocationObj = this.results.get(city)!;
        this.results.set(city, {
          minT: map.minT > temp ? temp : map.minT,
          maxT: map.maxT < temp ? temp : map.maxT,
          sommaT: temp + map.sommaT,
          countDuplicates: map.countDuplicates + 1,
        });
      }
      this.logger.debug(`Oggetto sommato con chiave "${city}".`);
      console.log(`Oggetto sommato con chiave "${city}".`);
    }
    console.log(`Elaborati ${chunkData.length} record`);
  };

  print_results() {
    this.logger.info("starting printing results");

    for (const [key, value] of this.results.entries()) {
      this.logger.info(key, value);
      console.log(key, value);
    }
    console.log("Finito!");
  }

  readCsv(): void {
    parse(createReadStream(this.filePath), {
      chunk: async (results: PapaparseResult, parser) => {
        await this.processChunkAsync(results.data);
      },
      complete: () => {
        this.print_results();
      },
      error: (error) => {
        console.error("Errore durante l'elaborazione:", error);
      },
    });
  }
}
