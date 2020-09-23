const path = require('path');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
const config = require('./config/config.js');

const mongoConnect = require('./utils/database').mongoConnect;

const graphqlSchema = require('./graphql/schema');
const graphqlResolver = require('./graphql/resolvers');

const webbrowseRoutes = require('./routes/webbrowse');
const adminRoutes = require('./routes/admin');
const apiRoutes = require('./routes/api');

// environment variables
process.env.NODE_ENV = 'development';

// uncomment below line to test this code against staging environment
// process.env.NODE_ENV = 'staging';

app.set('view engine','ejs');
app.set('views','views');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/graphql', graphqlHTTP({
		schema: graphqlSchema,
		rootValue: graphqlResolver
	}),
);

app.use('/', webbrowseRoutes);
app.use('/admin', adminRoutes);
app.use('/api', apiRoutes);

mongoConnect(() => {
	app.listen(config.node_port, function (req, res) {
	 		console.log(`${config.app_name} listening on port ${config.node_port}`);
		})
});