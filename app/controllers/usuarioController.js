const usuarioModel = require('../models/usuarioModel')
const moment = require("moment");
const {body, validationResult} = require('express-validator')
const bcrypt = require("bcryptjs");
var salt = bcrypt.genSaltSync(12);

const usuarioController = {
    
    //Validação 
    validacaoFormularioCadastro : [
        body('nome')
            .isLength({min:3, max:45})
            .withMessage("O nome deve ter de 3 a 45 letras"),
        body('email')
            .isEmail()
            .withMessage('O email deve ser válido'),
        body('senha')
            .isStrongPassword()
            .withMessage('A senha deve possuir no minimo 8 caracteres: com letra maiuscula e minuscula, número e caractere especial'),
        body('c-senha')
        .custom((value, {req}) => {
            if(value != req.body.senha){
                throw new Error('As senhas não coincidem')
            } else {
                return true
            }
        })
    ],

    regrasValidacaoFormLogin: [
        body("nome")
            .isLength({ min: 4, max: 45 })
            .withMessage("O nome de usuário/e-mail deve ter de 8 a 45 caracteres"),
        body("senha")
            .isStrongPassword()
            .withMessage("A senha deve ter no mínimo 8 caracteres (mínimo 1 letra maiúscula, 1 caractere especial e 1 número)")
    ],


    //Métodos

    logar: (req, res) => {
        const erros = validationResult(req);
        if (!erros.isEmpty()) {
            console.log(erros)
            return res.render("pages/login", { listaErros: erros })
        }
        if (req.session.autenticado != null) {
            res.redirect("/perfil");
        } else {
            res.render("pages/login", { listaErros: erros })
        }
    },

    inserirUsuario: async (req, res) => {

        //Recuperar dados da validação
        const listaErros = validationResult(req)

        //verificar se há erros
        if(listaErros.isEmpty()){
            //Não há erros - insert
            //criar objeto de dados no formulário

            let dadosParaInserir = {"nome":req.body.nome, "email":req.body.email, "senha":req.body.senha};

            //executar o insert
            let resultadoInsert = await usuarioModel.create(dadosParaInserir)

            if(resultadoInsert){
                if(resultadoInsert.insertId > 0){
                    //insert realizado
                res.redirect("/perfil")
                }else {
                    res.render("pages/cadastro", {"listaErros":null, "valores":req.body, "falha":"Falha ao inserir"})
                }
                
            }else {
                //falha ao inserir
                console.log(resultadoInsert)
                res.render("pages/cadastro", {"listaErros":null, "valores":req.body, "falha":"Falha ao inserir"})
            }
        } else{
            //há erros 
            console.log(listaErros);
            res.render("pages/cadastro", {"listaErros":listaErros, "valores":req.body, "falha":null})
        }
    }

}

module.exports = usuarioController;