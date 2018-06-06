const options = { 
    "swaggerDefinition" : {
    "info": {
        "description": "Swagger documentation for Pelias API",
        "title": "Pelias API",
        "version": "1.0.0"
    }
    },
    "basedir": __dirname,
    "files": ["../routes/*.js"]
};

module.exports = options;