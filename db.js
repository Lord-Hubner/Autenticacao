const { MongoClient, ObjectId } = require('mongodb');

const PAGE_SIZE = 5

async function connect(){
    if (global.connection) return global.connection;

    const client = new MongoClient(process.env.MONGODB_CONNECTION);

    try{      
        await client.connect();
        global.connection = client.db("aulaMongo");
        console.log("Connected!");
    }
    catch(err){
        console.error(err);
        global.connection = null;
    }

    return global.connection;
}

async function countCustomer(){
    const connection = await connect()

    return connection
    .collection("aulaMongo")
    .countDocuments()
}

async function findCustomers(pages = 1){
    const totalSkip = (pages - 1) * PAGE_SIZE
    const connection = await connect()

    return connection
        .collection("aulaMongo")
        .find({})
        .skip(totalSkip)
        .limit(PAGE_SIZE)
        .toArray()
}

async function insertCustomer(customer){
    const connection = await connect()

    return connection
        .collection("aulaMongo")
        .insertOne(customer);
}

async function updateCustomer(id, customer){
    const connection = await connect()
    const objectId = ObjectId.createFromHexString(id)

    return connection
        .collection("aulaMongo")
        .updateOne({_id: objectId}, {$set: customer})
}

async function deleteCustomer(id){
    const connection = await connect()
    const objectId = ObjectId.createFromHexString(id)

    return connection
        .collection("aulaMongo")
        .deleteOne({_id: objectId})
}

async function findCustomerById(id){
    const connection = await connect()
    const objectId = ObjectId.createFromHexString(id);

    return connection
        .collection("aulaMongo")
        .findOne({ _id: objectId }); 
}


///////////////////////////////
//Usuários
///////////////////////////////

async function countUsers(){
    const connection = await connect()

    return connection
    .collection("users")
    .countDocuments()
}

async function findUsers(pages = 1){
    const totalSkip = (pages - 1) * PAGE_SIZE
    const connection = await connect()

    return connection
        .collection("users")
        .find({})
        .skip(totalSkip)
        .limit(PAGE_SIZE)
        .toArray()
}

async function insertUser(user){
    const connection = await connect()

    return connection
        .collection("users")
        .insertOne(user);
}

async function updateUser(id, user){
    const connection = await connect()
    const objectId = ObjectId.createFromHexString(id)

    return connection
        .collection("users")
        .updateOne({_id: objectId}, {$set: user})
}

async function deleteUser(id){
    const connection = await connect()
    const objectId = ObjectId.createFromHexString(id)

    return connection
        .collection("users")
        .deleteOne({_id: objectId})
}

async function findUserById(id){
    const connection = await connect()
    const objectId = ObjectId.createFromHexString(id);

    return connection
        .collection("users")
        .findOne({ _id: objectId }); 
}

module.exports = {
    connect,
    PAGE_SIZE,
    countCustomer,
    findCustomers, 
    insertCustomer, 
    updateCustomer, 
    deleteCustomer, 
    findCustomerById, 
    countUsers,
    findUsers,
    insertUser,
    updateUser,
    deleteUser,
    findUserById,
}