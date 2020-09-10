const mergeJSON = require("merge-json");

// module variables
const config = require('./config.json');
const defaultConfig = config.development;
const environment = process.env.NODE_ENV || 'development';
const environmentConfig = config[environment];
const finalConfig = mergeJSON.merge(defaultConfig, environmentConfig);

// log global.gConfig
console.log(`global.gConfig: ${JSON.stringify(finalConfig, undefined, finalConfig.json_indentation)}`);

module.exports = finalConfig;