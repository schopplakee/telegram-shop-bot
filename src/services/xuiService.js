const axios = require("axios");

let cookie = null;

async function login() {

  if (cookie) {
    return cookie;
  }

  const response = await axios.post(

    `${process.env.XUI_URL}/login`,

    new URLSearchParams({

      username: process.env.XUI_USERNAME,

      password: process.env.XUI_PASSWORD,

    }),

    {

      headers: {

        "Content-Type": "application/x-www-form-urlencoded",

      },

      maxRedirects: 0,

      validateStatus: () => true,

    }

  );

  console.log("STATUS:", response.status);
  console.log("HEADERS:", response.headers);

  cookie = response.headers["set-cookie"]?.join("; ");

  return cookie;

}

module.exports = {

  login,

};