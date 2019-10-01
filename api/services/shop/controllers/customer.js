'use strict';

const configs = require(`${__dirname}/../../../configs/config.json`);
const passwordMiddleware = require(`${__dirname}/../../../middleware/gen_password.js`);
const jwtMiddleware = require(`${__dirname}/../../../middleware/jwt.js`);
const mongoose = require('mongoose');
const customerModel = mongoose.model('Customer');
const sendPasswordMail = require(`${__dirname}/../../../middleware/send_password_email.js`);

const isArrayEmpty = array => array === undefined || array.length == 0 ? true : false;
const isObjectEmpty = object => object === null || !Object.keys(object).length ? true : false;



module.exports.selectAllCustomers = async (req, res) => {
  try {
    let customers = await customerModel.find({}, '-__v');
    isArrayEmpty(customers) ? res.status(404).send({ status: 'customers_not_found' }) : res.status(200).send(customers);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
};



module.exports.selectCustomerById = async (req, res) => {
  const customerId = req.params.customer_id;

  if (mongoose.Types.ObjectId.isValid(customerId)) {
    try {
      let customer = await customerModel.findById(customerId, '-__v');
      if (isObjectEmpty(customer)) {
        res.status(404).send({ status: 'customer_not_found' });
      } else {
        res.status(200).send(customer);
      }
    } catch (err) {
      res.status(400).send({ error: err.message });
    }
  } else {
    res.status(400).send({ error: 'invalid_id' });
  }
};



module.exports.createCustomer = async (req, res) => {
  if (isObjectEmpty(req.body)) {
    res.status(204).send({ status: 'payload_is_empty' });
  } else {
    const customerData = req.body;
    const password = passwordMiddleware.genHashPassword(customerData.password);
    customerData.password = password.password;
    customerData.salt = password.salt;
    customerData.created_at = new Date().toISOString();

    try {
      let createdCustomer = await customerModel.create(customerData);

      res.status(200).send({
        status: 'customer_was_created',
        customer_id: createdCustomer._id
      });

    } catch (err) {
      if (err.name === 'MongoError' && err.code === 11000) {
        const pathRegex = err.message.match(/(?<=\bindex:\s)(\w+)/)
        const path = pathRegex ? pathRegex[1] : '';
        res.status(422).send({ status: 'key_already_exists', fields: path });
      } else if (err.name === 'ValidationError') {
        res.status(400).send({ status: 'fields_are_required', fields: Object.keys(err.errors)});
      } else {
        res.status(400).send({ error: err.message });
      }
    }
  }
};



module.exports.updateCustomerById = async (req, res) => {
  if (isObjectEmpty(req.body)) {
    res.status(204).send({ status: 'payload_is_empty' });
  } else {
    const customerId = req.params.customer_id;

    if (mongoose.Types.ObjectId.isValid(customerId)) {
      const customerData = req.body;

      if (customerData.password !== undefined) {
        const password = passwordMiddleware.genHashPassword(customerData.password);
        customerData.password = password.password;
        customerData.salt = password.salt;
      }

      customerData.updated_at = new Date().toISOString();

      const data = {
        $set: customerData
      };

      const options = {
        upsert: false,
        new: false,
        runValidators: true
      };

      try {
        let updatedCustomer = await customerModel.findByIdAndUpdate(customerId, data, options);

        if (isObjectEmpty(updatedCustomer)) {
          res.status(404).send({ status: 'customer_not_found' });
        } else {
          res.status(200).send({
            status: 'customer_was_updated',
            customer_id: updatedCustomer._id
          });
        }
      } catch (err) {
        if (err.name === 'MongoError' && err.code === 11000) {
          const pathRegex = err.message.match(/(?<=\bindex:\s)(\w+)/)
          const path = pathRegex ? pathRegex[1] : '';
          res.status(422).send({ status: 'key_already_exists', fields: path });
        } else if (err.name === 'ValidationError') {
          res.status(400).send({ status: 'fields_are_required', fields: Object.keys(err.errors)});
        } else {
          res.status(400).send({ error: err.message });
        }
      }
    } else {
      res.status(400).send({ error: 'invalid_id' });
    }
  }
};



module.exports.deleteCustomerById = async (req, res) => {
  const customerId = req.params.customer_id;

  if (mongoose.Types.ObjectId.isValid(customerId)) {
    try {
      let deletedCustomer = await customerModel.findByIdAndDelete(customerId);

      if (isObjectEmpty(deletedCustomer)) {
        res.status(404).send({ status: 'customer_not_found' });
      } else {
        res.status(200).send({
          status: 'customer_was_deleted',
          customer_id: deletedCustomer._id
        });
      }
    } catch (err) {
      res.status(400).send({ error: err.message });
    }
  } else {
    res.status(400).send({ error: 'invalid_id' });
  }
};



module.exports.signUp = async (req, res) => {
  if (isObjectEmpty(req.body)) {
    res.status(204).send({ status: 'payload_is_empty' });
  } else {
    const customerData = req.body;
    const password = passwordMiddleware.genHashPassword(customerData.password);
    customerData.password = password.password;
    customerData.salt = password.salt;
    customerData.created_at = new Date().toISOString();

    try {
      let createdCustomer = await customerModel.create(customerData);

      res.status(200).send({
        status: 'customer_was_created',
        customer_id: createdCustomer._id
      });

    } catch (err) {
      if (err.name === 'MongoError' && err.code === 11000) {
        res.status(422).send({ status: 'key_already_exists' });
      } else {
        res.status(400).send({ error: err.message });
      }
    }
  }
};



module.exports.signIn = async (req, res) => {
  if (isObjectEmpty(req.body)) {
    res.status(204).send({ status: 'payload_is_empty' });
  } else {
    let customer = await customerModel.findOne({ login: req.body.login }, 'login password salt');

    if (isObjectEmpty(customer)) {
      // res.status(404).send({ status: 'customer_not_found' });
      res.status(401).send({ status: 'invalid_login_or_password' });
    } else {
      try {
        const computedPassword = passwordMiddleware.getHashPassword(req.body.password, customer.salt);
        const customerPassword = customer.password;

        if (computedPassword === customerPassword) {
          const customerJwt = jwtMiddleware.createJWT({ _id: customer._id, login: customer.login });

          await customerModel.findByIdAndUpdate(customer._id, { token: customerJwt } );

          res.status(200).send({ msg: customerJwt });
        } else {
          res.status(401).send({ status: 'invalid_login_or_password' });
        }
      } catch (err) {
        res.status(400).send({ error: err.message });
      }
    }
  }
};



module.exports.signOut = async (req, res) => {
  let token = req.headers['x-access-token'] || req.headers['authorization'];

  if (token.startsWith('Bearer ')) {
    token = token.split(' ')[1];

    const decodedToken = jwtMiddleware.decode(token);

    if (decodedToken !== null) { // check another variants.
      try {
        let customer = await customerModel.findOneAndUpdate({ _id: decodedToken._id }, { token: null });
        if (isObjectEmpty(customer)) {
          res.status(404).send({ status: 'customer_not_found' });
        } else {
          res.status(200).send({ status: 'customer_sing_out' });
        }
      } catch (err) {
        res.status(400).send({ error: err.message });
      }
    } else {
      res.status(400).send({ error: 'invalid_token' });
    }
  } else {
    res.status(400).send({ error: 'not_jwt_auth' });
  }
};

module.exports.forgotPassword = async (req, res) => {
  if (isObjectEmpty(req.body)) {
    res.status(204).send({ status: 'payload_is_empty' });
  } else {
    let customer = await customerModel.findOne({ login: req.body.login }, '_id email');

    const randomCode = passwordMiddleware.getRandomCode(8);
    const expTime = Date.now() + 60000;

    if (isObjectEmpty(customer)) {
      res.status(404).send({ status: 'customer_not_found' });
    } else {
      try {
        await customerModel.findByIdAndUpdate(customer._id, { reset_password_code: randomCode, reset_password_expires: expTime } );

        sendPasswordMail.sendRestoreCode(customer.email, randomCode);

        res.status(200).send({ status: randomCode });
      } catch (err) {
        res.status(400).send({ error: err.message });
      }
    }
  }
};

module.exports.restorePasswoed = async (req, res) => {
  if (isObjectEmpty(req.body)) {
    res.status(204).send({ status: 'payload_is_empty' });
  } else {
    let customer = await customerModel.findOne({ login: req.body.login });

    if (isObjectEmpty(customer)) {
      res.status(404).send({ status: 'customer_not_found' });
    } else {
      if (customer.reset_password_code === req.body.code && customer.reset_password_expires > Date.now()) {
        try {
          const passwordData = passwordMiddleware.genHashPassword(req.body.password);
          await customerModel.findByIdAndUpdate(customer._id, { password: passwordData.password, salt: passwordData.salt, reset_password_code: null, reset_password_expires: null, token: null } );

          sendPasswordMail.sendRestoreMessage(customer.email);

          res.status(200).send({ status: 'password_has_been_changed' });
        } catch (err) {
          res.status(400).send({ error: err.message });
        }
      } else {
        res.status(400).send({ status: 'code_is_invalid_or_has_expired' });
      }
    }
  }
};
