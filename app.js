const express = require("express");
const request = require("request");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const port = process.env.PORT || 5000;

// body parser
app.use(bodyParser.urlencoded({ extended: true }));

// static folder
app.use(express.static(path.join(__dirname, "public")));

// handle signup route
app.post("/signup", (req, res) => {
  const { firstName, lastName, email } = req.body;

  //make sure fields are filled
  if (!firstName || !lastName || !email) {
    res.redirect("/fail.html");
    return;
  }

  // construct req data
  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  };

  const postData = JSON.stringify(data);

  const options = {
    url: "https://us19.api.mailchimp.com/3.0/lists/<YOUR LIST CODE>",
    method: "POST",
    headers: {
      Authorization: "auth <YOUR API KEY>"
    },
    body: postData
  };

  request(options, (err, response, body) => {
    if (err) {
      console.log(err);
      res.redirect("/fail.html");
    } else {
      if (response.statusCode === 200) {
        res.redirect("/success.html");
      } else {
        res.redirect("/fail.html");
      }
    }
  });
});

app.listen(port, console.log(`server started on ${port}`));
