import { Logger, createLogger, format, transports } from "winston";

import { truncateSync } from "fs";

export class LogHelper {
  /*
    Questa classe racchiude le funzionalità utili per il logging,
    tra cui il delete del contenuto del file e la creazione dello stream
    attraverso l'utilizzo della libreria winston 

    PROBLEMA DA CONSIDERARE: in realtà, non era richiesto un logger,
    ho voluto crearlo perché il terminale quando ha a che fare con tanti
    log potrebbe tagliare il contenuto (come è successo a me), 
    però non è nemmeno questo il modo completo per operare su tantissimi file, infatti,
    se il file diventa troppo grande potrebbe essere utile considerare come miglioria il
    creare diversi file ogni ad esempio 10000 righe in automatico
  */
  loggerFilePath: string;
  constructor(loggerFilePath: string) {
    this.loggerFilePath = loggerFilePath;
    this.deleteContent(); // ogni volta che viene avviato lo script, viene svuotato il file
  }

  deleteContent = () => {
    // questa funzione cancella l'intero contenuto del file.log
    try {
      truncateSync(this.loggerFilePath, 0);
    } catch (error:any) {
      console.log(error);
      if(error.code === 'ENOENT'){
        console.log("file not found");
      }
    }
  };

  /**
   * crea lo stream del logger attraverso la libreria winston e lo restituisce
   * @returns winston.Logger 
   * */
  createLogger = (): Logger => createLogger({
    level: "debug",
    format: format.simple(),
    transports: [new transports.File({ filename: this.loggerFilePath })],
  });
}
