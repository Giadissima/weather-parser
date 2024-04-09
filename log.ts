import { Logger, createLogger, format, transports } from "winston";

import { truncateSync } from "fs";

export class LogHelper {
  /*
    This class encapsulates useful logging functionalities, including file content deletion
    and stream creation using the Winston library.

    PROBLEM TO CONSIDER: In reality, a logger wasn't required. I decided to create one because
    the terminal might cut off the content when dealing with many logs (as it happened to me).
    However, this isn't the complete solution for operating on a large number of files. In fact,
    if the file becomes too large, it might be useful to consider creating separate files automatically,
    for example, every 10000 lines, as an improvement.
  */
  loggerFilePath: string;
  constructor(loggerFilePath: string) {
    this.loggerFilePath = loggerFilePath;
    this.deleteContent(); // Every time the script is run, the file is emptied.
  }

  deleteContent = () => {
    // This function deletes the entire content of the file.log.
    try {
      truncateSync(this.loggerFilePath, 0);
    } catch (error:any) {
      console.log(error);
      if(error.code === 'ENOENT'){
        console.error("log file not found: will be created");
      } else {
        // Gestisci o registra altri tipi di errori in modo diverso
        console.error("An unexpected error occurred:", error);
      }
    }
  };

  /**
   * It creates the logger stream using the Winston library and returns it.
   * @returns winston.Logger 
   * */
  createLogger = (): Logger => createLogger({
    level: "debug",
    format: format.simple(),
    transports: [new transports.File({ filename: this.loggerFilePath })],
  });
}
