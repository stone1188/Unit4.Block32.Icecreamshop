const pg = require("pg");
const express = require("express");
const client = new pg.Client(
     process.env.DATABASE_URL || "postgres://localhost/icecream_db"
);
const app = express();

app.use(require("morgan")("dev"));
app.use(express.json());

//CREATE 
app.post("/api/flavors", async (req, res, next) => {
     try {
          const SQL = `
            INSERT INTO flavors(name)
            VALUES ($1)
            RETURNING *
        `;
          const response = await client.query(SQL, [req.body.txt]);
          res.send(response.rows[0]);
     } catch (error) {
          next(error);
     }
});

//READ
app.get("/api/flavors", async (req, res, next) => {
     try {
          const SQL = `SELECT * from flavors;`;
          const response = await client.query(SQL);
          res.send(response.rows);
     } catch (error) {
          next(error); 
     }
});

app.get("/api/flavors/:id", async (req, res, next) => {
    const objectId = req.params.id;
     try {
          const SQL = `SELECT * from flavors WHERE id = $1;`;
          const response = await client.query(SQL, [objectId]);
          res.send(response.rows[0]);
     } catch (error) {
          next(error);
     }
});

//UPDATE
app.put("/api/flavors/:id", async(req, res, next)=> {
    try {
        const SQL = `
            UPDATE flavors
            SET name=$1, is_favorite=$2, updated_at= now()
            WHERE id=$3
        `;

        const response = await client.query(SQL, [
            reg.body.name,
            req.body.is_favorite,
            req.params.id,
        ]);
        res.send(response.rows[0]);
    } catch (error) {
        next(error);
    }

});

//DELETE
app.delete("/api/flavors/:id", async (req, res, next) => {
        try {
            const SQL = `
                DELETE from flavors
                WHERE id = $1
            `;
               const response = await client.query(SQL, [req.params.id]);
               res.sendStatus(204);
          } catch (error) {
               next(error);
          }
     });

const init = async () => {
    await client.connect();
    console.log('connected to database');

    let SQL = `
        DROP TABLE IF EXISTS flavors;
        CREATE TABLE flavors(
            id SERIAL PRIMARY KEY,
            created_at TIMESTAMP DEFAULT now(),
            updated_at TIMESTAMP DEFAULT now(),
            is_favorite BOOLEAN DEFAULT FALSE,
            name VARCHAR(255)
        );
    `;


    await client.query(SQL);
    console.log("Table created");

    SQL = `
            INSERT INTO flavors(name, is_favorite) VALUES('vanilla', TRUE);
            INSERT INTO flavors(name) VALUES('chocolate');
            INSERT INTO flavors(name) VALUES('strawberry');
            INSERT INTO flavors(name) VALUES('mint');
    `;
    
    await client.query(SQL);
    console.log("table seeded");

    const port = process.env.PORT || 3000;
    app.listen(port, () => console.log(`listening on port ${port}`));
};
init();