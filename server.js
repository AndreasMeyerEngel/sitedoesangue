// Configurando o servidor
const express = require("express")
const server = express()

// Configurar o servidor para apresentar arquivos estáticos
server.use(express.static('public'))

// Habilitar body do formulario
server.use(express.urlencoded({extended: true}))

// Configurar conexão com banco de dados
const Pool = require('pg').Pool
const db = new Pool({
    user: 'postgres',
    password: '2535senha',
    host: 'localhost',
    port: 5432,
    database: 'doe'
})

// Configurando a template engine
const nunjucks =  require("nunjucks")
nunjucks.configure("./", {
    express: server,
    noCache: true,
})


//Configurar a apresentação da página
server.get("/", function (req, res) {
    
    db.query("SELECT * FROM donors", function(err, result) {
        if (err) return res.send("Erro de banco de dados.")

        const donors = result.rows
        return res.render("index.html", { donors })
    })
})

server.post("/", function(req, res) {
    //pegar dados do formulário.
    const name = req.body.name
    const email = req.body.email
    const blood = req.body.blood

    if (name == "" || email == "" || blood == "") {
        return res.send("Todos os campos são obrigatórios.")
    }

//Colocando valores dentro do banco de dados
    const query = 
    `INSERT INTO donors ("name", "email", "blood") 
    VALUES ($1, $2, $3)`

    const values = [name, email, blood]

    db.query(query, values, function(err) {
        // fluxo de erro
        if (err) return res.send("Erro no banco de dados.")

        // fluxo ideal
        return res.redirect("/")
    })

    
})

// Ligar o servidor e permitir o acesso na porta 3000
server.listen(3000, function () {
    console.log("Iniciando o servidor")
})