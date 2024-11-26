import express from 'express';
import mysql from 'mysql2/promise';

const app = express();
 
app.set('view engine', 'ejs');
app.use(express.static('public'));

//for Express to get values using POST method
app.use(express.urlencoded({extended:true}));

//setting up database connection pool
const pool = mysql.createPool({
    host: "walid-elgammal.online",
    user: "walidelg_webuser2",
    password: "Cst-336",
    database: "walidelg_quotes2",
    connectionLimit: 10,
    waitForConnections: true
});
const conn = await pool.getConnection();

//routes
app.get('/', (req, res) => {
   res.render('index')
});

app.get("/allAuthors", async(req, res) => {
    let sql = "SELECT * FROM q_authors";
    const [rows] = await conn.query(sql);
    res.send(rows);
});//allAuthors

app.get('/searchByKeyword', async (req, res) => {
    let keyword = req.query.keyword;
    let sql = `SELECT authorId, firstName, lastName, quote
                FROM q_quotes
                NATURAL JOIN q_authors
                WHERE quote LIKE ?`;
    let sqlParams = [`%${keyword}%`];
    const [rows] = await conn.query(sql, sqlParams);
    // console.log(rows);
    res.render("results",{"quotes":rows});
});

app.get('/searchByAuthor', async (req, res) => {
    let userAuthorId = req.query.authorId;
    let sql = `SELECT authorId, firstName, lastName, quote
                FROM q_quotes
                NATURAL JOIN q_authors
                WHERE authorId = ?`;
    let sqlParams = [`%${userAuthorId}%`];
    console.log("userAuthorId: ", userAuthorId);
    const [rows] = await conn.query(sql, sqlParams);
    console.log(rows);
    res.render("results",{"quotes":rows});
});

app.listen(3000, ()=>{
    console.log("Express server running");
})