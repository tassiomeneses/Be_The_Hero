const express = require("express");
const { celebrate, Segments, Joi } = require("celebrate");

const OngController = require("./controllers/OngController");
const IncidentController = require("./controllers/IncidentController");
const ProfileController = require("./controllers/ProfileController");
const SessionController = require("./controllers/SessionController");
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.json());

const routes = express.Router();

//var authentication = require('./app/security/authentication');
var verifyToken = require('./security/verifyToken');

//Todo request a api passará por essa função de callback primeiramente e podemos usar para log do lado do servidor
routes.use(verifyToken, function(req, res, next){
    console.log('Alguém está fazendo requisição a api ;)');
    next();
});

routes.post("/sessions", celebrate({
  [Segments.BODY]:
    Joi.object().keys({
      id: Joi.string().required().length(8),
    }),
}), SessionController.create);

routes.get("/ongs", OngController.index);

routes.post("/ongs", celebrate({
  [Segments.BODY]:
    Joi.object().keys({
      name: Joi.string().required(),
      email: Joi.string().required().email(),
      whatsapp: Joi.string().required().min(10).max(11),
      city: Joi.string().required(),
      uf: Joi.string().required().length(2),
    })
}), OngController.create);

routes.get("/profile", celebrate({
  [Segments.HEADERS]:
    Joi.object({
      authorization: Joi.string().required(),
    }).unknown(),
}), ProfileController.index);

routes.get("/incidents", celebrate({
  [Segments.QUERY]: Joi.object().keys({
    page: Joi.number(),
  })
}), IncidentController.index);

routes.post("/incidents", celebrate({
  [Segments.HEADERS]:
    Joi.object({
      authorization: Joi.string().required().length(8)
    }).unknown(),
  [Segments.BODY]:
    Joi.object().keys({
      title: Joi.string().required(),
      description: Joi.string().required(),
      value: Joi.number().required()
    })
}), IncidentController.create);

routes.delete("/incidents/:id", celebrate({
  [Segments.PARAMS]:
    Joi.object().keys({
      id: Joi.number().required()
    })
}), IncidentController.delete);

module.exports = routes;
