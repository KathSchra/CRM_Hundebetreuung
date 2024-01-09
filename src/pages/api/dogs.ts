import type { APIRoute } from 'astro';
import sqlite from 'better-sqlite3';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const dbPath = path.resolve("./src/db/", 'dogs.db');

export async function get({ params, request }) {

    let db = new sqlite(dbPath);
    let dogsFromDb = await db.prepare('SELECT * FROM Dog  ORDER BY name ASC').all();
    db.close();
    console.log(dogsFromDb);
    return {
        body: JSON.stringify({
            dogObject: {
                dogs: dogsFromDb,
                success: "ok",
                errorMessage: ""
            }
        })
    };
}

export async function post({ params, request }) {
    let body = await request.json();
    if (body.hasOwnProperty("name")
        && body.hasOwnProperty("race")
        && body.hasOwnProperty("age")
        && body.hasOwnProperty("gender")
        && body.hasOwnProperty("castration")
        && body.hasOwnProperty("chip")
        && body.hasOwnProperty("start")
        && body.hasOwnProperty("end")
        && body.hasOwnProperty("ownerId")) {
        let id = uuidv4();
        let name = body.name;
        let race = body.race;
        let age = body.age;
        let gender = body.gender;
        let castration = body.castration;
        let chip = body.chip;
        let start = body.start;
        let end = body.end;
        let ownerId = body.ownerId;
        let db = new sqlite(dbPath);
        let added = db.prepare("INSERT INTO Dog (id, name, race, age, gender, castration, chip, start, end, ownerId) VALUES (?,?,?,?,?,?,?,?,?,?)")
            .run(id, name, race, age, gender, castration, chip, start, end, ownerId);
        console.log(added);
        db.close();
        return {
            body: JSON.stringify({
                success: "ok",
                message: "new dog added"
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

export async function put({ params, request }) {
       let dog = await request.json();
    if (dog.hasOwnProperty("id")
        && dog.hasOwnProperty("name")
        && dog.hasOwnProperty("race")
        && dog.hasOwnProperty("age")
        && dog.hasOwnProperty("gender")
        && dog.hasOwnProperty("castration")
        && dog.hasOwnProperty("chip")
        && dog.hasOwnProperty("start")
        && dog.hasOwnProperty("end")
        && dog.hasOwnProperty("ownerId")) {
        let db = new sqlite(dbPath);
        const updates = db.prepare('UPDATE Dog SET name = ?, race = ?, age = ?, gender = ?, castration = ?, chip = ?, start = ?, end = ?, ownerId = ? WHERE id = ?')
            .run(dog.name, dog.race, dog.age, dog.gender, dog.castration, dog.chip, dog.start, dog.end, dog.ownerId, dog.id);
        db.close();
        console.log("updates");
        console.log(updates);
        return {
            body: JSON.stringify({
                success: "ok",
                message: updates.changes + " dog updated"
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
        const updates = db.prepare('DELETE FROM Dog WHERE id = ? OR ownerId= ?')
            .run(body.id, body.id);
        console.log("updates");
        console.log(updates);

        db.close();
        return {
            body: JSON.stringify({
                success: "ok",
                message: updates.changes + " dog deleted"
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


