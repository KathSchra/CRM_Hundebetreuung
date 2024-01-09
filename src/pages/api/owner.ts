import type { APIRoute } from 'astro';
import { dateTimeFormat } from 'astro/dist/core/logger/core';
import sqlite from 'better-sqlite3';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const dbPath = path.resolve("./src/db/", 'dogs.db');

export async function get({ params, request }) {

    let db = new sqlite(dbPath);
    let ownerFromDb = await db.prepare('SELECT * FROM Owner ORDER BY surname ASC').all();
    db.close();
    // console.log(ownerFromDb);
    return {
        body: JSON.stringify({
            ownerObject: {
                owner: ownerFromDb,
                success: "ok",
                errorMessage: ""
            }
        })
    };
}

export async function post({ params, request }) {
    let body = await request.json();  
    if (
      body.hasOwnProperty("prename") &&
      body.hasOwnProperty("surname") &&
      body.hasOwnProperty("telephone") &&
      body.hasOwnProperty("mail") &&
      body.hasOwnProperty("zipcode") &&
      body.hasOwnProperty("street") &&
      body.hasOwnProperty("city")
    ) {
      let id = uuidv4();
      let prename = body.prename;
      let surname = body.surname;
      let telephone = body.telephone;
      let mail = body.mail;
      let zipcode = body.zipcode;
      let street = body.street;
      let city = body.city;
  
      let db = new sqlite(dbPath);
  
      // Abrufen der vorherigen Kundennummer aus der Datenbank
      let preCustomerNoResult = await db
        .prepare("SELECT customerNo FROM Owner ORDER BY created_at DESC LIMIT 1").get();
      let preCustomerNo = preCustomerNoResult ? preCustomerNoResult.customerNo: 10000; //wenn noch kein Datensatz in der Datenbank vorhanden ist, wird der erste Wert hier initialisiert
  
      let customerNo = parseInt(preCustomerNo, 10) + 1; //neue Kundennummer um 1 erhöhen
      let created_at = Date.now(); // wird benötigt um die Owner-Tabelle chronologisch zu sortieren ORDER BY created_at DESC
  
      let added = db
        .prepare(
          "INSERT INTO Owner (id, prename, surname, telephone, mail, zipcode, street, city, customerNo, created_at) VALUES (?,?,?,?,?,?,?,?,?,?)"
        )
        .run(
          id,
          prename,
          surname,
          telephone,
          mail,
          zipcode,
          street,
          city,
          customerNo,
          created_at
        );
  
      console.log(added);
  
      db.close();
  
      return {
        body: JSON.stringify({
          success: "ok",
          message: "new owner added",
          id: id,
        }),
      };
    } else {
      return {
        body: JSON.stringify({
          success: "error",
          message: "attributes missing",
        }),
      };
    }
  }
  
export async function put({ params, request }) {
     let owner = await request.json();
    if (owner.hasOwnProperty("id")
    && owner.hasOwnProperty("prename")
    && owner.hasOwnProperty("surname")
    && owner.hasOwnProperty("telephone")
    && owner.hasOwnProperty("mail")
    && owner.hasOwnProperty("zipcode")
    && owner.hasOwnProperty("street")
    && owner.hasOwnProperty("city")
    && owner.hasOwnProperty("customerNo")
    
    ) {
        let db = new sqlite(dbPath);
        const updates = db.prepare('UPDATE Owner SET prename = ?, surname = ?, telephone = ?, mail = ?, zipcode = ?, street = ?, city = ?, created_at = ?  WHERE id = ?')
            .run( owner.prename, owner.surname, owner.telephone, owner.mail, owner.zipcode, owner.street, owner.city, owner.created_at, owner.id);
        db.close();
        console.log("updates");
        console.log(updates);
        return {
            body: JSON.stringify({
                success: "ok",
                message: updates.changes + " owner updated"
            })
        };
    } else {
        return {
            body: JSON.stringify({
                success: "error",
                message: "attributes missing"
            })
        }
    }
}

export async function del({ params, request }) { 
    let body = await request.json(); 
    if (body.hasOwnProperty("id")) {
        let db = new sqlite(dbPath);
        const updates = db.prepare('DELETE  FROM Owner WHERE id = ?')
            .run(body.id);
        console.log("updates");
        console.log(updates);

        db.close();
        return {
            body: JSON.stringify({
                success: "ok",
                message: updates.changes + " owner deleted"
            })
        };
    } else {
        return {
            body: JSON.stringify({
                success: "error",
                message: "attributes missing"
            })
        }
    }
}


