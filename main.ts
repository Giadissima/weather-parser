import { LocationObj } from "./types/types";

function main(){

  // Qui caricheremo tutti i valori parsati del .csv
  let results: Map<string, LocationObj>=new Map();
  
  //TODO: Parsare il CSV

  //TODO: Se la riga parsata del csv è presente nella mappa, allora aggiungere un valore al counter, verificare il min e max e sommare la media
  //TODO: Se la città non è presente allora result.set e si aggiunge

  //TODO: Finito il parse, si scorre la mappa e si scrive tutti i valori richiesti (dividendo la media per il counter)

}

function readCsv():Promise<void>{
}

main();