const Express = require('express')
const bodyParser = require('body-parser')
const axios = require("axios");

const app = new Express()
const dotenv = require("dotenv");
dotenv.config();

app.use(bodyParser.urlencoded({extended: true}))

const {SLACK_TOKEN: slackToken, PORT: port} = process.env

if (!slackToken) {
  console.error('missing environment variables SLACK_TOKEN')
  process.exit(1)
}

app.post('/', (req, res) => {
    var toSearchFor = req.body.text;
    toSearchFor = toSearchFor.replace(/@|\./gm, "-");
    axios.get('https://infinite-dawn-28655.herokuapp.com/pronunciations/' + toSearchFor)
    .then(function (response) {
        let message = {
            "attachments": [
                {
                    "fallback": "HowYouSay says- " + req.body.text + " - " + response.data.audio_public_path,
                    "pretext": "Learn how to say " + req.body.text,
                    "title": req.body.text,
                    "title_link": response.data.audio_public_path,
                    "text": "Click the link and learn to pronounce it correctly",
                    "color": "#7CD197"
                }
            ]
        };
        return res.json(message);
    })
    .catch(function (error) {
        return res.json({
            "response_type": "ephemeral",
            "text": "Sorry, we couldn't find the pronounciation for " + req.body.text + ". Please try again."
          })
    });
})

app.listen(port, () => {
  console.log(`Server started at localhost:${port}`)
})