var express = require('express');
var router = express.Router();
var noticiasModel = require('./../models/noticiasModel');
var usuariosModel = require('./../models/usuariosModel');
var mensajesModel = require('./../models/mensajesModel');
var md5 = require('md5');
var cloudinary = require('cloudinary').v2;
var util = require('util');
const { traceDeprecation } = require('process');
const destroy = util.promisify(cloudinary.uploader.destroy)
const nodemailer = require("nodemailer");

router.post('/contacto',async(req,res)=>{
    const email = {
        to:"juanicuesta1996@gmail.com",
        subject:'Contacto web',
        html:`${req.body.nombre} se contacto a traves de la web y quiere mas informacion a este correo: ${req.body.email}<br> Ademas,
        hizo el siguiente comentario: ${req.body.mensaje} <br> Su tel es: ${req.body.telefono}`
    }
    const transport = nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: "036c369dad100f",
            pass: "bdd3580007e157"
        }
    });
    await transport.sendMail(email)
    res.status(201).json({
        error: false,
        message: 'Mensaje enviado'
    });
})

router.get('/noticias',async function(req,res,next){

    let noticias = await noticiasModel.getNoticias()

    noticias = noticias.map(noticia => {
        if(noticia.img_id){
            const imagen = cloudinary.url(noticia.img_id)
            return{
                ...noticia,
                imagen
            }
        }else{
            return{
                ...noticia,
                imagen: ''
            }
        }
    });
    res.json(noticias)
});

router.post('/noticias/agregar',async function(req,res,next){
    let rows = await noticiasModel.insertNoticia(req.body);
    res.json(rows);
});

router.post('/mensajes/agregar',async function(req,res,next){
    let rows = await mensajesModel.insertMensaje(req.body)
    res.json(rows);
});

router.post('/noticias/modificar/:id',async function(req,res,next){
    console.log(req.body.img_delete,req.body.img_id)
    let obj ={};

    if(req.body.img_delete){
        await(destroy(req.body.img_id)).then((response)=>console.log(response))
        obj = {
            titulo: req.body.titulo,
            subtitulo: req.body.subtitulo,
            cuerpo: req.body.cuerpo,
            img_id: ""
        }
    }else{
        obj = {
            titulo: req.body.titulo,
            subtitulo: req.body.subtitulo,
            cuerpo: req.body.cuerpo,
            img_id: req.body.img_id
        }
    }

    let rows = await noticiasModel.modificarNoticiaById(obj,req.params.id);
    res.json(rows);
});

router.get('/noticias/:id',async function(req,res,next){
    noticiasModel.getNoticiaById(req.params.id).then((response)=>res.json(response))
})

router.post('/noticias/eliminar/:id',async function(req,res,next){
    var id = req.params.id;

    let noticia = await noticiasModel.getNoticiaById(id);
    if(noticia.img_id){
        await(destroy(noticia.img_id))
    }
    let response = await noticiasModel.deleteNoticiaById(id);
    res.json(response)
})

router.get('/noticias/eliminarimagen/:id',async(req,res,next)=>{
    var id = req.params.id;
    await(destroy(id)).then((response)=>res.json(response))
});

router.post('/usuarios',async function(req,res,next){

    const username = req.body.username
    const password = req.body.password
    const user = await usuariosModel.getUserByUsernameAndPassword(username,password)
    res.json(user)
});

router.get('/mensajes',async function(req,res,next){
    let mensajes = await mensajesModel.getMensajes()
    res.json(mensajes)
});

router.post('/mensajes/eliminar/:id',async function(req,res,next){
    var id = req.params.id;
    let response = await mensajesModel.deleteMensajeById(id);
    res.json(response)
})

module.exports = router;