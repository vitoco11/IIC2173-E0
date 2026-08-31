const express = require('express');
const { Pool } = require('pg');

const app = express();
const PORT = 3000;

// middleware para que la api pueda leer objetos json 
app.use(express.json());

// Si fuera local ponemos nuestro usuario y contraseña postgres
// Con docker es distinto esto, dejamos usuario y contraseña unos genericos.
// El contenedor crea un entorno postgres en blanco
const pool = new Pool({
    user: 'postgres',
    host: 'db',  // no es localhost, sino el nombre del contenedor de postgres que pusimos en docker-compose.yml
    database: 'energyshark',
    password: 'admin',
    port: 5432,
});

// creamos la tabla inicial automáticamente
const initDB = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS eventos (
                idpk VARCHAR(255) PRIMARY KEY,
                data JSONB,
                receivedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log("Tabla de base de datos lista.");
    } catch (error) {
        console.error("Error conectando a la BD.", error.message);
    }
};
initDB();

// endpoint POSTE aquí ponemos los eventos que nos llega del conector.js
app.post('/eventos', async (req, res) => {
    const evento = req.body; 
    
    try {
        await pool.query(
            'INSERT INTO eventos (idpk, data) VALUES ($1, $2) ON CONFLICT (idpk) DO NOTHING',
            [evento.idpk, evento]
        );
        console.log(`Guardado en la BD. ID: ${evento.idpk}`);
        res.status(200).send("Evento guardado exitosamente");
    } catch (error) {
        console.error("Error guardando en BD:", error.message);
        res.status(500).send("Error interno");
    }
});

// endpoint GET para que podamos verificar que el master está vivo y escuchando que se ocupa para el healthcheck del docker-compose
app.get('/', (req, res) => res.status(200).send("Master esta escuchando"));

app.listen(PORT, () => {
    console.log(`Master escuchando en el puerto ${PORT}`);
});

