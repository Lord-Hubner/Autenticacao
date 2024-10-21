const {connect} = require("./db.js")

async function findUserByUsername(name){
    const connection = await connect()

    return connection
        .collection('users')
        .findOne({name})
}

async function findUserByEmail(email){
    const connection = await connect()

    return connection
        .collection('users')
        .findOne({email})
}

async function generatePassword(){
    const chars = 'abcdefghijklmnopqrstuvxyz0123456789ABCDEFGHIJKLMNOPQRSTUVXYZ'
    let password = ''

    for(let i=0;i<10;i++){
        password += chars.charAt(Math.random() * 61)
    }
    return password
}

module.exports = {
    findUserByUsername,
    findUserByEmail,
    generatePassword
}