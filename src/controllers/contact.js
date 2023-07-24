const {contactIdentify} = require("../services/contact.js");

exports.contactIdentify = async (req, res) => {
    try {
        const { email, phoneNumber } = req.body;
        const contact = await contactIdentify(email, phoneNumber);
        res.status(200).json(contact);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}