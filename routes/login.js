const express = require('express');
const router = express.Router();
const db = require("../db.js")
const {findUserByUsername, findUserByEmail, generatePassword} = require("../auth.js")
const auth = require('passport')
const sendMail = require('../mail.js');
const passport = require('passport');

/* GET home page. */
router.get('/', (req, res, next) => {

  res.render('login', { title: 'Login', message: req.query.message ? req.query.message : ""})
 
});

router.post('/logout', (req, res, next) => {
    req.logOut(() => {
        res.redirect("/")
    })
})

router.get('/forgot', (req, res, next) =>{
    res.render('forgot', {title: "Recuperação de senha", message: ""})
})

router.post('/forgot', async (req, res, next) =>{
    const email = req.body.email
    if(!email)
        res.render('forgot', {title: "Recuperação de senha", message: "O email é obrigatório"})
    console.log('fefefe')
    const user = await findUserByEmail(email)
    console.log(user)
    if(!user)
        res.render('forgot', {title: "Recuperação de senha", message: "Este email não está cadastrado no sistema"})

    const newPassword = await generatePassword()
    user.password = bcrypt.hashSync(newPassword, 12)

    await db.updateUser(user._id.toString(), user)
    try{
        await sendMail(user.email, 'Senha alterada com sucesso', `
            Olá ${user.name}, sua senha foi alterada com sucesso para ${newPassword}
            
            Use-a para se autenticar novamente em http://localhost:3000/`)

        res.render('login', {title: "Login", message: "Verifique sua caixa de email para descobrir sua nova senha"})
    }
    catch(err){
        res.render('forgot', {title: "Recuperação de senha", message: err.message})
    }
})

router.post('/login', passport.authenticate('local', {
    successRedirect: "/index",
    failureRedirect: "/?message=Usuário ou senha inválidos"
}))

module.exports = router;
