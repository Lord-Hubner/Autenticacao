const express = require('express');
const router = express.Router();
const db = require("../db.js")

/* GET home page. */

router.get('/new', (request, response) => {
  response.render("newCustomer.ejs", {title: "Novo Cadastro", customer: {}, signal: false})
})

router.get('/edit/:customerId', (request, response) => {
   db.findCustomerById(request.params.customerId)
    .then(customer => response.render("newCustomer.ejs", {title: "Editando usuário", customer, signal: false}))
    .catch(error => response.render("error.ejs", {message: "Não foi possível editar o usuário, tente novamente mais tarde", error}))
})

router.get('/delete/:customerId', (request, response) => {
  const id = request.params.customerId
  db.deleteCustomer(id)
    .then(result => response.redirect("/customers"))
    .catch(error => response.render("error.ejs", {message: "Não foi possível deletar o usuário, tente novamente mais tarde", error}))
})

router.post('/new', async (request, response) => {

  console.log(request.body)
  if (!request.body.name)
    return response.redirect("/customers/new?error=O campo nome é obrigatório")

  if (request.body.age && !/[0-9]+/.test(request.body.age))
    return response.redirect("/customers/new?error=O campo idade precisa ser número")

  if (request.body.uf.length > 2){
    console.log(request.body.id)
    console.log("wtf")
    const customer = await db.findCustomerById(request.body.id)
    return response.render("newCustomer.ejs", {title: "Editando usuário", customer: customer, signal: true})   
}

  const id = request.body.id;
  const name = request.body.name
  const cpf = request.body.cpf
  const age = parseInt(request.body.age)
  const city = request.body.city
  const uf = request.body.uf

  console.log("atualizou")

  const customer2 = { name, cpf, age, city, uf}
  const promise = id 
    ? db.updateCustomer(id, customer2)
    : db.insertCustomer(customer2)

    console.log(customer2)

    console.log("estado atual")
  promise
    .then(result => response.redirect("/customers"))
    .catch(error => response.render("error.ejs", {message: "Não foi possível criar ou modificar usuário, tente novamente mais tarde", error}))
})

router.get('/:page?', async (req, res, next) => {
  const page = parseInt(req.params.page);
  try{
    const qty = await db.countCustomer()
    const pagesQty = Math.ceil(qty/db.PAGE_SIZE)
    const customers = await db.findCustomers(page)
    res.render('customers', { title: 'Lista de clientes', customers, qty, pagesQty, page });
  }
  catch(error){
    res.render("error", {message: "Não foi possível entrar na tela de cadastro, tente novamente mais tarde", error})
    console.log(error)
  }
});

module.exports = router;
