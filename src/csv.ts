import { LocationObj, PapaparseResult } from "../types/types";

import { Logger } from "winston";
import { createReadStream } from "fs";
import { join } from "path";
import { parse } from "papaparse";

export class CsvHelper {
  results: Map<string, LocationObj> = new Map();
  logger: Logger;
  filePath: string;

  constructor(
    results: Map<string, LocationObj>,
    logger: Logger,
    filePath: string = join(__dirname, "..", "data", "weather_stations.csv")
  ) {
    this.results = results;
    this.logger = logger;
    this.filePath = filePath;
    this.readCsv();
  }

  readCsv() {
    /**
     * Questa funzione parsa il contenuto del file csv attraverso la libreria papaparse, 
     * che offre un modo completo per gestire i file in asincrono attraverso la metodologia chunk-by-chunk,
     * ovvero prende un buffer di tot byte che può essere anche specificato e fa il parse di quelle linee in asincrono.
     * Ha anche delle callback in caso di errore e quando viene completata l'operazione richiamabili
     * per un parsing efficace e pratico
     */
    parse(createReadStream(this.filePath), {
      chunk: async (results: PapaparseResult) => { 
        // con l'opzione chunk, il parser prende tot byte e li parsa, rendendo più efficiente
        // l'operazione rispetto a un approccio step-by-step
        await this.processChunkAsync(results.data);
      },
      complete: () => {
        this.print_results();
      },
      error: (error) => {
        console.error("Error during processing: ", error);
      },
    });
  }

  processChunkAsync = async (chunkData: string[][]) => {
    /**
     * @async
     * Questa funzione asincrona permette di prendere il chunk del file attuale
     * parsato da papaparse, la sua scompattazione linea per linea e l'inserimento
     * dei valori in una mappa
     */
    for (const line of chunkData) {
      const [city, temperature] = line[0].split(";");
      const temp: number = parseInt(temperature, 10);
      // se ci sono stati errori di parsing (la linea non ha i valori oppure errore di 
      // lettura), restituisce un errore generisco e dice a quale linea l'ha avuto
      if (isNaN(temp) || !city || city === "") {
        this.logger.error(`error parsing this line: ${line}`);
        continue;
      }
      // Se la chiave non esiste, inserisce l'oggetto
      if (!this.results.has(city)) {
        this.results.set(city, {
          minT: temp,
          maxT: temp,
          sommaT: temp,
          countDuplicates: 1,
        });
        this.logger.debug(`Added obj with key "${city}".`);
      } else {
        const map: LocationObj = this.results.get(city)!;
        this.results.set(city, {
          minT: map.minT > temp ? temp : map.minT, // tramite l'operatore terniario ho controllato in una riga se la temperatura della mappa salvata precedentemente è ancora la vera temperatura minima o se va sovrascritta
          maxT: map.maxT < temp ? temp : map.maxT, // tramite l'operatore terniario ho controllato in una riga se la temperatura della mappa salvata precedentemente è ancora la vera temperatura massima o se va sovrascritta
          sommaT: temp + map.sommaT, // questo campo servirà per fare la media delle temperature
          countDuplicates: map.countDuplicates + 1, // incrementa il numero di duplicati trovati corrispondenti a quella città
        });
        this.logger.debug(`Founded duplicate with key "${city}" and updated successfully.`);
      }
    }
  };

  print_results() {
    /**
     * Una volta completato il parsing, vengono stampati come da richiesta a schermo i risultati
     */
    this.logger.debug("starting printing results");

    for (const [key, value] of this.results.entries()) {
      /* ? We might consider, for a better display, using a different separator than "-" to avoid confusion
        with negative numbers, and to truncate the average to the second decimal place. */
      console.log(`${key}: ${value.minT} - ${value.sommaT/value.countDuplicates} - ${value.maxT}`);
      this.logger.info(`${key}: ${value.minT} - ${value.sommaT/value.countDuplicates} - ${value.maxT}`)
    }

    this.logger.debug("finished printing results");
  }
}
