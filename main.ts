import * as Papa from 'papaparse';
import * as fs from 'fs';

import { LocationObj } from "./types/types";

let results: Map<string, LocationObj>=new Map();


  // Qui caricheremo tutti i valori parsati del .csv
  
  // TODO prendere il tempo iniziale dell'esecuzione
  //TODO: Parsare il CSV

  //TODO: Se la riga parsata del csv è presente nella mappa, allora aggiungere un valore al counter, verificare il min e max e sommare la media
  //TODO: Se la città non è presente allora result.set e si aggiunge

  //TODO: Finito il parse, si scorre la mappa e si scrive tutti i valori richiesti (dividendo la media per il counter)
  // TODO: stampare quanto ci ha messo

const processChunkAsync = async (chunkData: any[]) => {
  // Simula un'elaborazione asincrona (es. salvataggio in un database)
  console.log(chunkData);
  console.log(`Elaborati ${chunkData.length} record`);
};

function print_results(){
  console.log("Finito!")
}

function readCsv():void{
  Papa.parse(fs.createReadStream('data/weather_stations.csv'), {
      chunk: async (results, parser) => {
        // Puoi mettere in pausa e riprendere il parser se necessario
        parser.pause();
        await processChunkAsync(results.data);
        parser.resume();
      },
      complete: () => {
        print_results()
      },
      error: (error) => {
        console.error('Errore durante l\'elaborazione:', error);
      },
  });
}


readCsv();