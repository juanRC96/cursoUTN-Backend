var usuariosModel = require('./../../models/usuariosModel')
var express = require('express');
var router = express.Router();

/* get homepage */
router.get('/',function(req,res,next){
    res.render('admin/login',{
        layout: 'admin/layout'
    });
});

router.get('/logout',function(req,res,next){
    req.session.destroy();
    res.render('admin/login',{
        layout: 'admin/layout'
    });
});

router.post('/',async(req,res,next)=>{
    try{
        var usuario = req.body.usuario; //juan
        var password = req.body.password; //1234

        var data = await usuariosModel.getUserByUsernameAndPassword(usuario,password);

        if(data != undefined){
            req.session.id_usuario = data.id;
            req.session.nombre = data.usuario;
            res.redirect('/admin/noticias');
        }else{
            res.render('admin/login',{
                layuot: 'admin/layout',
                error:true
            });
        }
    }catch(error){
        console.log(error);
    }
});

module.exports=router;