import * as fs from 'fs';
import * as winston from 'winston';

export class LogHelper{
  loggerFilePath: string;
  constructor(loggerFilePath: string){
    this.loggerFilePath = loggerFilePath;
  }

  truncateLogger = ()=>{
    fs.truncateSync(this.loggerFilePath, 0);
  }
  
  createLogger = ()=>{
    this.truncateLogger();
    return winston.createLogger({
      level: 'debug',
      format: winston.format.simple(),
      transports: [
        new winston.transports.File({ filename: this.loggerFilePath })
      ]
    });
  }

}