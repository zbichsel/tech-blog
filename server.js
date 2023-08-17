// Setup -- Requiring packages
const path = require('path');
const express = require('express');
const session = require('express-session');
const helpers = require('./utils/helpers');
const routes = require('./controllers');
const exphbs = require('express-handlebars');

// !-- Sequelize --!
const sequelize = require('./config/connection');
const SequelizeStore = require('connect-session-sequelize');

// !-- PORT --!
const app = express();
const PORT = process.env.PORT || 3001;

// !-- Handlebars Setup --!
const hbs = exphbs.create({ helpers });

// !-- Sessions --!
const sess = {
    secret: 'Super super secret',
    cookie: {
        maxAge: 300000,
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
    },
    resave: false,
    saveUninitialized: true,
    store: new SequelizeStore({
        db: sequelize
    })
};

app.use(session(sess));

// !-- Informing Express.js which template engine to use --!
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(routes);

sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => console.log('Now listening!'));
});