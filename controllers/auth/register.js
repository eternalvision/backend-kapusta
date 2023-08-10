const { Conflict } = require('http-errors')
const gravatar = require('gravatar')

const { Auth } = require('../../models')

const register = async (req, res) => {
  const { name, password, email } = req.body

  const user = await Auth.findOne({ email })
  if (user) {
    throw new Conflict(`Email ${email} in use`)
  }
  const avatarURL = gravatar.url(email, { protocol: 'https' })
  const newUser = new Auth({ name, email, avatarURL })
  await newUser.setPassword(password)
  await newUser.save()

  res.status(201).json({
    status: 'Created',
    code: 201,
    data: {
      user: {
        name,
        email,
        avatarURL
      }
    }
  })
}

module.exports = register