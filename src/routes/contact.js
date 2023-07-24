const express = require('express');
const router = express.Router();

const { contactIdentify} = require("../controllers/contact.js");

router.post('/identify', contactIdentify);

module.exports = {
    contactRoute: router,
};

