const sgMail = require('@sendgrid/mail')
require('dotenv').config()

const { SENDGRID_API_KEY } = process.env

sgMail.setApiKey(SENDGRID_API_KEY)

const sendMessage = async(data) => {
  const msg = { ...data, from: 'leskovecmaksim@gmail.com' }
  try {
    await sgMail.send(msg)
    return true
  } catch (error) {
    error.message = 'Something wrong with message, try again'
    throw error
  }
}

module.exports = sendMessage