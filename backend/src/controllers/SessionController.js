const connection = require('../database/connection');

var configJwt = require('../security/config');

var jwt = require('jsonwebtoken');

module.exports = {

  async create(req, res) {

    const { id } = req.body;

    const ong = await connection('ongs')
      .where('id', id)
      .select('name')
      .first();

    if (!ong) {
      return res.status(400).json({ error: 'No ONG found with this ID' })
    }

    var token = jwt.sign({ id: ong }, configJwt.secret, {
      expiresIn: configJwt.expiresIn //Tempo que expira a chave
    });
    res.status(200).send({ auth: true, ong, token: token });
  

    //return res.json(ong);
  }

}