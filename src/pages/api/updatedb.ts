import type { APIRoute } from 'astro';
import sqlite from 'better-sqlite3';
import path from 'path';


const dbPath = path.resolve("./src/db/", 'dogs.db');

const initDog = () => {
  let db = new sqlite(dbPath , sqlite.OPEN_READWRITE, (err) => {
    if (err) {
        console.error(err.message);
    }
    verbose: console.log
  });
  db.exec("CREATE TABLE IF NOT EXISTS Dog ('id' TEXT, 'name' TEXT, 'race' TEXT, 'age' TEXT, 'gender' INT, 'castration' INT, 'start' TEXT , 'end' TEXT, 'chip' TEXT, 'ownerId' TEXT, 'idImg' TEXT, 'imgFileName' TEXT)");
  db.close();
}

const initOwner = () => {
  let db = new sqlite(dbPath , sqlite.OPEN_READWRITE, (err) => {
    if (err) {
        console.error(err.message);
    }
    verbose: console.log
  });
  db.exec("CREATE TABLE IF NOT EXISTS Owner ('id' TEXT, 'prename' TEXT, 'surname' TEXT, 'telephone' TEXT, 'mail' TEXT, 'zipcode' TEXT, 'street' TEXT, 'city' TEXT, 'customerNo' INT, 'created_at' TEXT)");
  db.close();
}

export async function get() {
initDog(); 
initOwner(); 

  return {
    body: JSON.stringify(
      {
        success: "ok",
        errorMessage: "" 
      })
  };
}
  
