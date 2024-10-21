const express = require('express');
const router = express.Router();
const db = require("../db.js")
const bcrypt = require("bcrypt")

/* GET home page. */

router.get('/new', (request, response) => {
  response.render("newUser.ejs", {title: "Novo Usuário", user: {}})
})

router.get('/edit/:userId', (request, response) => {
   db.findUserById(request.params.userId)
    .then(user => response.render("newUser.ejs", {title: "Editando usuário", user, signal: false}))
    .catch(error => response.render("error.ejs", {message: "Não foi possível editar o usuário, tente novamente mais tarde", error}))
})

router.get('/delete/:userId', (request, response) => {
  const id = request.params.customerId
  db.deleteUser(id)
    .then(result => response.redirect("/users"))
    .catch(error => response.render("error.ejs", {message: "Não foi possível deletar o usuário, tente novamente mais tarde", error}))
})

router.post('/new', async (request, response) => {
  const id = request.body.id;

  console.log(request.body)
  if (!request.body.name)
    return response.redirect("/users/new?error=O campo nome é obrigatório.")

  if (!id && !request.body.password)
    return response.redirect("/users/new?error=O usuário tem que ter senha!")

  const name = request.body.name
  const email = request.body.email
  const profile = request.body.profile
  const password = request.body.password

  const newUser = {name, email, profile}
  if(password)
    newUser.password = bcrypt.hashSync(password, 12)

  console.log(newUser)
  const promise = id 
    ? db.updateUser(id, newUser)
    : db.insertUser(newUser)

    console.log(newUser)

  promise
    .then(result => response.redirect("/"))
    .catch(error => response.render("error.ejs", {message: "Não foi possível criar ou modificar usuário, tente novamente mais tarde", error}))
})

router.get('/:page?', async (req, res, next) => {
  const page = parseInt(req.params.page);
  try{
    const qty = await db.countUsers()
    const pagesQty = Math.ceil(qty/db.PAGE_SIZE)
    const users = await db.findUsers(page)
    res.render('users', { title: 'Lista de usuários', customers: users, qty, pagesQty, page });
  }
  catch(error){
    res.render("error", {message: "Não foi possível entrar na tela de cadastro de usuários, tente novamente mais tarde", error})
    console.log(error)
  }
});

module.exports = router;
