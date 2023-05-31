const express = require('express');
const mysql = require('mysql');
const cors = require('cors')

const app = express();
const port = process.env.PORT || 3000;

app.use(cors())
app.use(express.json());


const db = mysql.createConnection({
    host: "localhost",
    user: "root", 
    password: "senha",
    database: "nodemysql"
});

db.connect((err) => {
    if(err) {
        throw err;
    }
    console.log("conectado ao banco de dados mysql")
})

//inserindo dados

app.post('/books', (req, res) => {
    const {title, pages} = req.body
    if(!title || !pages){
        return res.status(422).json({msg: "Prencha todos os campos"});
    }
    const sql = `INSERT INTO books (title, pages) VALUES ("${title}", ${pages})`;
    db.query(sql, (err, result) => {
        if(err){
            throw err
        }
        res.json({msg: "Livro cadastrado com sucesso!", id: result.insertId})
    })
})

// 3 -  Resgatando dados

app.get('/books', (req, res) => {
    const sql = "SELECT * FROM books";

    db.query(sql, (err, result) => {
        if(err){
            throw err
        }

        res.json({books: result})
    })
})

// 4 - Resgate de dados específicos

app.get('/books/search', (req, res) => {
    const {title} = req.query;
    const sql = `SELECT * FROM books WHERE title LIKE '%${title}'`;

    db.query(sql, (err, result) => {
        if(err){
            throw err;
        }

        res.json({books: result})
    })

})

//5 - Editando dados

app.patch('/books/:id', (req, res) => {
    const {title, pages} = req.body;

    const {id} = req.params;

    const sqlcheck = `SELECT * FROM books WHERE id = ${id}`;

    db.query(sqlcheck, (err, result) => {
        if(err){
            throw err;
        }

        if(result.length === 0){
            res.status(404).json({message: 'Livro não encontrado!'})
        } else {
            const sql = `UPDATE books SET title = "${title}", pages = ${pages} where id = ${id}`;

            db.query(sql, (err, result) => {
                if(err){
                    throw err;
                }

                res.json({message: "Livro atualizado com sucesso!"})
            })
        }
    })
});

//5 - Deletando dados

app.delete('/books/:id', (req, res) => {
    const {id} = req.params;

    const sqlcheck = `SELECT * FROM books WHERE id = ${id}`;

    db.query(sqlcheck, (err, result) => {
        if(err){
            throw err;
        }

        if(result.length === 0){
            res.status(404).json({message: 'Livro não encontrado!'})
        } else {
            const sql = `DELETE from books where id = ${id}`;

            db.query(sql, (err, result) => {
                if(err){
                    throw err;
                }

                res.json({message: "Livro removido com sucesso!"})
            })
        }
    })
});

//7 - pool connection

const db1 = mysql.createPool({
    connectionLimit: 10,
    host: "localhost",
    user: "root", 
    password: "senha",
    database: "nodemysql"
});


app.listen((port), () => {
    console.log(`servidor conectado na porta ${port}`);

   
})