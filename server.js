require('dotenv').config();

const express = require('express');
const port = 3000;
const app = express();
const mongoose = require('mongoose');

mongoose.connect(process.env.CONNECTIONSTRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    }).then(()=> {
        console.log('Connected to the database');
        app.emit('ready');
    })
    .catch(e => console.log(e));
    // Possibilidade de renderizar pagina de erro

const session = require('express-session');
const MongoStore = require('connect-mongo');
const flashMessages = require('connect-flash');

const routes = require('./routes');
const path = require('path');
const helmet = require('helmet');
const csrf = require('csurf');
const { globalMiddleware, checkCsrfError, csrfMiddleware } = require('./src/middlewares/middleware');

app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.resolve(__dirname, 'public')));

const sessionOptions = session({
    secret: 'vaicorinthians123',
    saveUninitialized: false,
    resave: false,
    store: MongoStore.create({ 
        mongoUrl: process.env.CONNECTIONSTRING,
        ttl: 7 * 24 * 60 * 60,
        autoRemove: 'native'
    }),
});

app.use(sessionOptions);
app.use(flashMessages());

app.set('views', path.resolve(__dirname, 'src', 'views'));
app.set('view engine', 'ejs');

app.use(csrf());
// Our own middlewares
app.use(globalMiddleware);
app.use(csrfMiddleware);
app.use(checkCsrfError);
app.use(routes);


app.on('ready', ()=>{
    app.listen(port, ()=> {
        console.log(`Acessar http://localhost:${port}`);
        console.log(`Servidor executando na porta ${port}`);
    });
})

