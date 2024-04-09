import { LocationObj, PapaparseResult } from "../types/types";
import { createReadStream, existsSync } from "fs";

import { Logger } from "winston";
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

  /**
  * This function parses the content of the CSV file using the PapaParse library,
  * which provides a comprehensive way to handle files asynchronously through the
  * chunk-by-chunk methodology. It takes a buffer of a certain number of bytes,
  * which can also be specified, and asynchronously parses those lines. It also
  * has callbacks for error handling and when the operation is completed, which
  * can be invoked for efficient and practical parsing.
  */
  readCsv() {
    console.time('Measure time')
    
    if(!existsSync(this.filePath)){
      console.error("no such file in path: ", this.filePath, "make sure to write the correct path");
      return;
    }

    parse(createReadStream(this.filePath), {
      chunk: async (results: PapaparseResult) => {
        // With the `chunk` option, the parser takes a specified number of bytes and
        // parses them, making the operation more efficient compared to a step-by-step approach.
        await this.processChunkAsync(results.data);
      },
      complete: () => {
        this.print_results();
        console.timeEnd('Measure time');
      },
      error: (error) => {
        console.error("Error during processing: ", error);
        this.logger.error("Error during processing: ", error);
      },
    });
  }


  /**
  * @async
  * @param {string[][]} chunkData - the chunk of data passed by papaparse
  * 
  * This asynchronous function allows you to take the chunk of the current file parsed by
  * PapaParse, decompress it line by line, and insert the values into a map.
  */
  processChunkAsync = async (chunkData: string[][]): Promise<void> => {
    for (const line of chunkData) {
      const [city, temperature] = line[0].split(";");
      const temp: number = parseInt(temperature, 10);

      // If there were parsing errors (e.g., the line does not contain values or there is a reading error),
      // it returns a generated error and indicates at which line the error occurred.
      if (isNaN(temp) || !city || city === "") {
        this.logger.error(`error parsing this line: ${line}`);
        continue;
      }

      // If the key does not exist, it inserts the object.
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
          minT: map.minT > temp ? temp : map.minT, // Using the ternary operator, I checked in one line whether the temperature in the previously saved map is still the true minimum temperature or if it needs to be overwritten.
          maxT: map.maxT < temp ? temp : map.maxT, // Using the ternary operator, I checked in one line whether the temperature in the previously saved map is still the true maximum temperature or if it needs to be overwritten.
          sommaT: temp + map.sommaT, // This field will be used to calculate the average temperature.
          countDuplicates: map.countDuplicates + 1, // It increments the number of duplicates found corresponding to that city.
        });
        this.logger.debug(`Founded duplicate with key "${city}" and updated successfully.`);
      }
    }
  };

  /**
   * Once the parsing is completed, the results are printed to the screen as requested.
   */
  print_results() {
    this.logger.debug("starting printing results");

    for (const [key, value] of this.results.entries()) {
      /* ? We might consider, for a better display, using a different separator than "-" to avoid confusion
        with negative numbers, and to truncate the average to the second decimal place. */
      console.log(`${key}: ${value.minT} - ${value.sommaT/value.countDuplicates} - ${value.maxT}`);
      this.logger.info(`${key}: ${value.minT} - ${value.sommaT/value.countDuplicates} - ${value.maxT}`)
    }

    this.logger.debug("finished printing results");
    console.log("If you want to view the results in a file, please refer to the file `log/logProgram.log`.")
  }
}
