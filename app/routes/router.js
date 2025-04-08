const express = require("express");
const usuarioModel = require("../models/usuarioModel");
const router = express.Router();
const {body, validationResult} = require('express-validator')

const { verificarUsuAutenticado, limparSessao, gravarUsuAutenticado, verificarUsuAutorizado } = require("../models/autenticador_middleware");

const usuarioController = require("../controllers/usuarioController")


router.get("/", verificarUsuAutenticado, function (req, res) {
    res.render("pages/index", req.session.autenticado);
});

router.get("/login", function(req, res) {
    res.render("pages/login", { listaErros: null });
});

router.post(
    "/login",
    usuarioController.regrasValidacaoFormLogin,
    gravarUsuAutenticado,
    function (req, res) {
      usuarioController.logar(req, res);
});

router.get("/cadastro", function (req, res) {
    res.render("pages/cadastro", { listaErros: null, valores: { nome_usu: "", nomeusu_usu: "", email_usu: "", senha_usu: "" } });
});

router.post("/cadastro",
    usuarioController.validacaoFormularioCadastro,
    async function (req, res) {
        usuarioController.cadastrar(req, res);
});

router.get("/perfil", (req, res)=>{
    res.render("pages/perfil")

})

router.get("/teste", async (req, res) =>{
    // //requisitar model
    // const usuario = require("../models/usuarioModel")

    // //teste do findAll
    // //let resultados = usuarioModel.findAll();

    // //teste do create

    // let dadosParaInserir = {"nome":"Cecilia", "senha":"ceci1234", "email":"cecilia@gmail.com"}

    // let resultadoInsert = await usuarioModel.create(dadosParaInserir);
    // let resultados = await usuarioModel.findAll()

    const usuarioController = require("../controllers/usuarioController")

    console.log(usuarioController.validacaoFormularioCadastro)
    
})


module.exports = router