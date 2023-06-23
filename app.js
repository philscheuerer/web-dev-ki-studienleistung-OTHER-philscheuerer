const express = require("express");
const logger = require("./utils/logger");
const session = require("express-session");
const bodyParser = require('body-parser');
const handlebars = require("express-handlebars");

const dotenv = require("dotenv");
dotenv.config();
const app = express();
const fileUpload = require('express-fileupload');
app.use(fileUpload());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: "This is a secret!",
    cookie: {
        maxAge: 3600000
    },
    resave: false,
    saveUninitialized: false
}));

//turn on serving static files (required for delivering images to client)
app.use(express.static("public"));

app.engine('.hbs', handlebars.engine({extname: '.hbs'}));
app.set('view engine', '.hbs');
app.set('views', './views');

const routes = require("./routes");
app.use("/", routes);

app.listen(process.env.PORT, () => {
    console.log(`Web App template listening on ${process.env.PORT}`);
});

module.exports = app;
