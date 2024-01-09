import sqlite from 'better-sqlite3';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { writeFile } from 'fs/promises';

const dbPath = path.resolve("./src/db/", 'dogs.db');
const imgPath = path.resolve("./public/img/dog/");

export async function post({ request }) {
    console.log("POST")
    const formData = await request.formData();
    console.log(formData);
    let imgFileName = "";
    let idImg = ""; 
    await Promise.all(
        formData
          .getAll('image')
          .map(async (file: File) => {
            imgFileName = file.name; 
            let suffix = file.name.substring(file.name.lastIndexOf('.'), file.name.length);
            idImg = uuidv4() + suffix;
            writeFile(
                path.resolve(imgPath, idImg),
                new Uint8Array(await file.arrayBuffer())
            ) 
          })         
      );
      await Promise.all(
        formData.getAll("id").map(idDog => {
            let db = new sqlite(dbPath);
            const updates = db.prepare('UPDATE Dog SET idImg = ?, imgFileName = ? WHERE id = ?')
                     .run(idImg, imgFileName, idDog); 
            db.close();
        })
      ); 
    return {
        body: JSON.stringify({
            success: "ok",
            errorMessage: "Image saved"
        })
      };
  }