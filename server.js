const path = require('path');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
const config = require('./config/config.js');

const mongoConnect = require('./utils/database').mongoConnect;

const graphqlSchema = require('./graphql/schema');
const graphqlResolver = require('./graphql/resolvers');
const auth = require('./middleware/auth');

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

app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin','*');
	res.setHeader(
		'Access-Control-Allow-Methods',
		'OPTIONS, GET, POST, PUT, PATCH, DELETE'
	);
	res.setHeader(
		'Access-Control-Allow-Headers',
		'Content-Type, Authorization'
	);

	// Without the following if statement, the graphql requests from front-end will get an error "Method Not Allowed".
	// because the browser send option request before sending GET, POST, PUT, PATCH, DELETE requests.
	// The problem is express graphql automatically declines any thing which is GET, POST, PUT, PATCH, DELETE request.
	if (req.method === 'OPTIONS') {
		return res.sendStatus(200);
	}
	next();
});

// REST
app.use('/', webbrowseRoutes);
app.use('/admin', adminRoutes);
app.use('/api', apiRoutes);

// This middle is now run on every request that reaches graphql endpoint
app.use(auth);

// GRAPHQL
app.use('/graphql', graphqlHTTP({
		schema: graphqlSchema,
		rootValue: graphqlResolver,
		graphql: true,
		customFormatErrorFn: err => {
			console.log(JSON.stringify(err));
			const locations = err.locations || {};
			const data = err.originalError || err.originalError.data || {};
			const message = err.message || 'An error occurred!';
			const code = err.originalError.code || 500;
			return ({
				message: message,
				locations: locations,
				status: code,
				data: data
			});
		  }
	}),
);

mongoConnect(() => {
	app.listen(config.node_port, function (req, res) {
	 		console.log(`${config.app_name} listening on port ${config.node_port}`);
		})
});