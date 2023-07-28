const { Contact } = require("../models");
const { Sequelize } = require("sequelize");

// function to find all secondary Info for a given primary contact recursively
const getAllSecondaryContacts = async (
  primaryContactId,
  secondaryContactsInfo = []
) => {
  const secondaryContacts = await Contact.findAll({
    where: {
      linkedId: primaryContactId,
    },
  });

  for (const secondaryContact of secondaryContacts) {
    const secondaryContactInfo = {
      email: secondaryContact.email,
      phoneNumber: secondaryContact.phoneNumber,
      id: secondaryContact.id,
    };
    secondaryContactsInfo.push(secondaryContactInfo);
    await getAllSecondaryContacts(secondaryContact.id, secondaryContactsInfo);
  }
  return secondaryContactsInfo;
};

// function to find the primary contact and all secondary contact Info from requested contact
const getPrimaryAndSecondaryContacts = async (contact) => {
  if (contact.linkPrecedence === "primary") {
    const secondaryContactInfo = await getAllSecondaryContacts(contact.id);
    return { primaryContact: contact, secondaryContactInfo };
  } else if (contact.linkedId) {
    const nextContact = await Contact.findByPk(contact.linkedId);
    return getPrimaryAndSecondaryContacts(nextContact);
  } else {
    return { primaryContact: null, secondaryContactInfo: [] };
  }
};

exports.contactIdentify = async (email, phoneNumber) => {
  try {
    if ((email === null || email==="") && (phoneNumber === null || phoneNumber==="")) {
      {
        return {
          contacts: {
            primaryContactId: null,
            emails: [],
            phoneNumbers: [],
            secondaryContactIds: [],
          },
      }
    }
  }
    // checking if contact with requested email or phoneNumber already exists
    const existingContact = await Contact.findOne({
      where: {
        [Sequelize.Op.or]: [{ email }, { phoneNumber }],
      },
    });

    // if contact doesn't exist, creating a new primary contact
    if (!existingContact) {
      const primaryContact = await Contact.create({
        email,
        phoneNumber,
        linkPrecedence: "primary",
      });

      // returning the response with the new primary contact details
      return {
        contact: {
          primaryContactId: primaryContact.id,
          emails: email ? [email] : [],
          phoneNumbers: phoneNumber ? [phoneNumber] : [],
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

      if (!isExist && email !== null && phoneNumber !== null) {
          await Contact.create({
            email,
            phoneNumber,
            linkedId: existingContact.id,
            linkPrecedence: "secondary",
          });
      }
      // finding the primary contact and secondary contacts Info
      const { primaryContact, secondaryContactInfo } = await getPrimaryAndSecondaryContacts(existingContact);
      
      let emails, phoneNumbers;
      const secondaryContactEmails = [...new Set(secondaryContactInfo.map((contact) => contact.email))];
      const uniqueEmails = [...secondaryContactEmails].filter((email) => email !== primaryContact.email);
      const secondaryContactPhoneNumbers = [...new Set(secondaryContactInfo.map((contact) => contact.phoneNumber))];
      const uniquePhoneNumbers = [...secondaryContactPhoneNumbers].filter((phoneNumber) => phoneNumber !== primaryContact.phoneNumber);
      primaryEmail = primaryContact.email ? [primaryContact.email] : [];
      primaryPhoneNumber = primaryContact.phoneNumber ? [primaryContact.phoneNumber] : [];
      
      emails = [...primaryEmail, ...uniqueEmails];
      phoneNumbers = [...primaryPhoneNumber, ...uniquePhoneNumbers];

      return {
        contacts: {
          primaryContactId: primaryContact.id,
          emails,
          phoneNumbers,
          secondaryContactIds: secondaryContactInfo.map((contact) => contact.id),
        },
      };
    }
  } catch (error) {
    throw new Error(error.message);
  }
};
