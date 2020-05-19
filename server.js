const express = require("express")
const server = express()
const nunjucks = require("nunjucks")
server.use(express.urlencoded({ extended: true }))

server.use(express.static('public'))
nunjucks.configure("./", {
  express: server,
  noCache: true,
})

server.listen(3000, function () {
  console.log("Servidor on-line")
})

const Pool = require('pg').Pool
const db = new Pool({
  user: 'postgres',
  password: '0000',
  host: 'localhost',
  port: 5432,
  database: 'doe',

})

server.get("/", function (require, response) {
  db.query("SELECT * FROM donors", function(err, result){
    if (err) return response.send("Erro em buscar do banco de dados.")
     const donors = result.rows
    return response.render("index.html", { donors })
  })
 
})

server.post("/", function (require, response) {
  const name = require.body.name
  const email = require.body.email
  const blood = require.body.blood

  if (name == "" || email == "" || blood == "") {
    return response.send("Todos os campos sao obrigatorios!")

  }

  const query = `
  INSERT INTO donors ("name","email","blood") 
  VALUES ($1,$2,$3)`

  const values = [name, email, blood]

  db.query(query, values, function (err) {
    if (err) return response.send("Erro no banco de dados")

    return response.redirect("/")

  })

})