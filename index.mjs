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
//lists authors and categories in the dropdown menu from the database
app.get('/', async (req, res) => {
    let sql1 = `SELECT authorId, firstName, lastName
                FROM q_authors
                ORDER BY lastName`;
    const [rows1] = await conn.query(sql1);
    let sql2 = `SELECT DISTINCT category
                FROM q_quotes
                ORDER BY category`;
    const [rows2] = await conn.query(sql2);
    res.render("index", {"authors":rows1, "quotes":rows2});
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
});//searchByKeyword

app.get('/searchByAuthor', async (req, res) => {
    let userAuthorId = req.query.authorId;
    let sql = `SELECT authorId, firstName, lastName, quote
                FROM q_quotes
                NATURAL JOIN q_authors
                WHERE authorId = ?`;
    let sqlParams = [`${userAuthorId}`];
    const [rows] = await conn.query(sql, sqlParams);
    // console.log(rows);
    res.render("results",{"quotes":rows});
});//searchByAuthor

app.get('/api/author/:id', async (req, res) => {
    let authorId = req.params.id;
    let sql = `SELECT *
              FROM q_authors
              WHERE authorId = ?`;           
    let [rows] = await conn.query(sql, [authorId]);
    res.send(rows)
});

app.get('/searchByCategory', async (req, res) => {
    let userCategory = req.query.category;
    let sql = `SELECT authorId, firstName, lastName, quote
                FROM q_quotes
                NATURAL JOIN q_authors
                WHERE category = ?`;
    let sqlParams = [`${userCategory}`];
    const [rows] = await conn.query(sql, sqlParams);
    res.render("results",{"quotes":rows});
});//searchByCategory

app.listen(3000, ()=>{
    console.log("Express server running");
});