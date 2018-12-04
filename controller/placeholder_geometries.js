const _ = require('lodash');
const logger = require('pelias-logger').get('api');
const geolib = require('geolib');
const mgetService = require('../service/mget');
const Debug = require('../helper/debug');
const debugLog = new Debug('controller:placeholder_geometries');

function setup(apiConfig, esclient, should_execute) {
    function controller( req, res, next ){
        // bail early if req/res don't pass conditions for execution
        const initialTime = debugLog.beginTimer(req);

        if (!should_execute(req, res)) {
            return next();
        }

        // Convert results from placeholder service to expected payload format
        // for mgetService
        const cmd = res.data.map( function(doc) {
            return {
                _index: apiConfig.indexName,
                _type: doc.layer,
                _id: doc._id
            };
        });

        mgetService( esclient, cmd, (err, docs) => {
            if (err) {
                // push err.message or err onto req.errors
                req.errors.push( _.get(err, 'message', err));

            } else {

        res.meta = {
            query_type: 'fallback'
        };

        res.data = res.data.map( function(doc) {
                    var matchingDoc = docs.find( esDoc => esDoc._id === doc._id);
                    if(matchingDoc && matchingDoc.hasOwnProperty('polygon')) {
                        doc.polygon = matchingDoc.polygon;
                    }
                    return doc;
        });

        const messageParts = [
            '[controller:placeholder_geometries]',
            `[result_count:${_.defaultTo(res.data, []).length}]`
        ];

        logger.info(messageParts.join(' '));
        debugLog.push(req, messageParts[1].slice(1,-1));
        debugLog.push(req, res.data);
    }

        debugLog.stopTimer(req, initialTime);
        return next();
    });

    }

    return controller;
}

module.exports = setup;