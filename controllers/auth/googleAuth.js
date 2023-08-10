const queryString = require('query-string');
const jwt = require("jsonwebtoken");
const axios = require('axios');
const { v4 } = require('uuid');
const SECRET_KEY = process.env.SECRET_KEY;
const { Auth } = require("../../models");

exports.googleAuth = async (req, res) => {
  const stringifiedParams = queryString.stringify({
    client_id: process.env.GOOGLE_CLIENT_ID,
    redirect_uri: `${process.env.BASE_URL}/auth/google-redirect`,
    scope: [
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/userinfo.profile",
    ].join(" "),
    response_type: "code",
    access_type: "offline",
    prompt: "consent",
  });

  return res.redirect(
    `https://accounts.google.com/o/oauth2/v2/auth?${stringifiedParams}`
  );
};

exports.googleRedirect = async (req, res) => {
  const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
  const urlObj = new URL(fullUrl);
  const urlParams = queryString.parse(urlObj.search);
  const code = urlParams.code;
  const tokenData = await axios({
    url: `https://oauth2.googleapis.com/token`,
    method: 'post',
    data: {
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: `${process.env.BASE_URL}/auth/google-redirect`,
      grant_type: 'authorization_code',
      code,
    },
  });
  const userData = await axios({
    url: 'https://www.googleapis.com/oauth2/v2/userinfo',
    method: 'get',
    headers: {
      Authorization: `Bearer ${tokenData.data.access_token}`,
    },
  });

  const { email, name } = userData.data;
  const user = await Auth.findOne({ email });
  if (user) {
    const { _id } = user;
    const payload = {
      _id,
    };
    const token = jwt.sign(payload, SECRET_KEY);
    await Auth.findByIdAndUpdate(user._id, { token });
    const newUser = await Auth.findOne({ token });

    return res.redirect(
      `${process.env.FRONTEND_URL}google-redirect?useremail=${newUser.email}`,
    );
  }

  const password = v4();
  const newUser = new Auth({ name, email });
  newUser.setPassword(password);
  await newUser.save();

  const { _id } = newUser;
  const payload = {
    _id,
  };
  const token = jwt.sign(payload, SECRET_KEY);
  await Auth.findByIdAndUpdate(_id, { token });
  
  return res.redirect(
    `${process.env.FRONTEND_URL}google-redirect?useremail=${user.email}`,
  );
};