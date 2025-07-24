import path from 'path'
import { fileURLToPath } from 'url';
import { Client } from 'pg';
import sqlite3 from 'sqlite3'




const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)


const BASE_DIR = path.resolve();
const SQLITE_PATH = 'sqlite://' + path.join(BASE_DIR, 'dev-data.db');


const connectDB = async()=>{
    const DB_URI = process.env.DATABASE_URI || SQLITE_PATH;
    try{
        const pgClient = new Client({
            connectionString: DB_URI,
        });
        await pgClient.connect();
        console.log("Connected to PostgreSQL");
        global.dbClient = pgClient;
    }catch(err){
        console.warn('PostreSQL connection Failed:', err.message);
        const dbPath = path.join(__dirname, '../../dev-data.db');
        const sqliteDB = new sqlite3.Database(dbPath, (err)=>{
            if(err){
                console.error('SQLite connection failed:', err.message);
            }else{
                console.log(`SQLite connceted at ${dbPath}`)
            }
        });
        global.sqliteDB=sqliteDB;


    }

}

export default connectDB;
