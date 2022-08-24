var pool = require('./bd');

async function insertMensaje(obj){
    try{
        var query = "insert into mensajes set ?";
        var rows = await pool.query(query,[obj])
        return rows;
    }catch(error){
        console.log(error);
        throw error;
    }
}

async function getMensajes(){
    try{
        var query = "select * from mensajes";
        var rows = await pool.query(query);
        return rows;
    }catch(error){
        console.log(error);
    }
}

async function deleteMensajeById(id){
    var query = "delete from mensajes where id = ?";
    var rows = await pool.query(query,[id]);
    return rows;
}

module.exports = {insertMensaje,getMensajes,deleteMensajeById}