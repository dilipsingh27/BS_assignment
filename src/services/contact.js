const { Contact } = require("../models");
const { Sequelize } = require("sequelize");

exports.contactIdentify = async (email, phoneNumber) => {
  try {
    // checking if contact with requested email or phoneNumber already exists and it's primary contact
    const existingContact = await Contact.findOne({
      where: {
        [Sequelize.Op.or]: [{ email }, { phoneNumber }],
        linkPrecedence: "primary",
      },
    });

    // If contact already exists
    if (!existingContact) {
      // If contact doesn't exist, creating a new primary contact
      const primaryContact = await Contact.create({
        email,
        phoneNumber,
        linkPrecedence: "primary",
      });

      // Returning the response with the new primary contact details
      return {
        contact: {
          primaryContactId: primaryContact.id,
          emails: [email],
          phoneNumbers: [phoneNumber],
          secondaryContactIds: [],
        },
      };
    } else {
      // checking if it's already in database, no need to insert again
      const isExist = await Contact.findOne({
        where: {
            [Sequelize.Op.and]: [{ email }, { phoneNumber }],
        },
      });

      if(!isExist) {
        // creating a secondary contact
        await Contact.create({
        email,
        phoneNumber,
        linkedId: existingContact.id,
        linkPrecedence: 'secondary',
        });
      }

      const primaryContactId = existingContact.linkPrecedence === "primary"
                              ? existingContact.id : existingContact.linkedId;
      const secondaryContacts = await Contact.findAll({
        where: {
          linkedId: primaryContactId,
        },
      });

      let emails = [];
      if (existingContact.email !== email) {
        emails = secondaryContacts.map((contact) => contact.email);
      }
      emails.unshift(existingContact.email);

      let phoneNumbers = [];
      if (existingContact.phoneNumber !== phoneNumber) {
        phoneNumbers = secondaryContacts.map((contact) => contact.phoneNumber);
      }
      phoneNumbers.unshift(existingContact.phoneNumber);

      const secondaryContactIds = secondaryContacts.map(
        (contact) => contact.id
      );

      return {
        contacts: {
          primaryContactId,
          emails,
          phoneNumbers,
          secondaryContactIds,
        },
      };
    }
  } catch (error) {
    console.log(error);
  }
};
