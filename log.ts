import { createLogger, format, transports } from "winston";

import { truncateSync } from "fs";

export class LogHelper {
  loggerFilePath: string;
  constructor(loggerFilePath: string) {
    this.loggerFilePath = loggerFilePath;
  }

  truncateLogger = () => {
    try {
      truncateSync(this.loggerFilePath, 0);
    } catch (error:any) {
      console.log(error);
      if(error.code === 'ENOENT'){
        console.log("file not found");
      }
    }
  };

  createLogger = () => {
    this.truncateLogger();
    return createLogger({
      level: "debug",
      format: format.simple(),
      transports: [new transports.File({ filename: this.loggerFilePath })],
    });
  };
}
