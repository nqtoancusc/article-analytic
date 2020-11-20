const path = require('path');
const express = require('express');
const fs = require('fs');
/*	
// Production
const https = require('https');
*/

const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const multer = require('multer');
const { graphqlHTTP } = require('express-graphql');

const mongoConnect = require('./utils/database').mongoConnect;

const graphqlSchema = require('./graphql/schema');
const graphqlResolver = require('./graphql/resolvers');
const auth = require('./middleware/auth');

const webbrowseRoutes = require('./routes/webbrowse');
const adminRoutes = require('./routes/admin');
const apiRoutes = require('./routes/api');

const app = express();

/*	
// Production	
const privateKey = fs.readFileSync('server.key');
const certificate = fs.readFileSync('server.cert');
*/

const fileStorage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'upload');
	},
	filename: (req, file, cb) => {
		cb(null, new Date().toString() + '-' + file.originalname);
	}
});

app.set('view engine','ejs');
app.set('views','views');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(multer({ storage: fileStorage }).single('image'));
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

const accessLogStream = fs.createWriteStream(
	path.join(__dirname, 'access.log'),
	{ flags: 'a'}
);

// Use helmet as a middleware to set secure response headers for all incomming request
app.use(helmet());

// Compression package help redure size of css, javascript,... files. Image files are not compressed.
app.use(compression());

// Morgan for logging.
app.use(morgan('combined', { stream: accessLogStream }));

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
	app.listen(process.env.NODE_PORT, function (req, res) {
			console.log(`Listening on port ${process.env.NODE_PORT || 3000}`);
		})

	/*	
	// Production	
	https
		.createServer({ key: privateKey, cert: certificate }, app)
		.listen(process.env.NODE_PORT || 3000);
	*/
});