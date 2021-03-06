var type_mapping = require('../helper/type_mapping');
var sanitizeAll = require('../sanitizer/sanitizeAll');
// middleware
module.exports.middleware = (_api_pelias_config) => {
  var sanitizers = {
        singleScalarParameters: require('../sanitizer/_single_scalar_parameters')(),
        debug: require('../sanitizer/_debug')(),
        quattroshapes_deprecation: require('../sanitizer/_deprecate_quattroshapes')(),
        text: require('../sanitizer/_text')(),
        size: require('../sanitizer/_size')(/* use defaults*/),
        layers: require('../sanitizer/_targets')('layers', type_mapping.layer_mapping),
        sources: require('../sanitizer/_targets')('sources', type_mapping.source_mapping),
        // depends on the layers and sources sanitizers, must be run after them
        sources_and_layers: require('../sanitizer/_sources_and_layers')(),
        private: require('../sanitizer/_flag_bool')('private', false),
        location_bias: require('../sanitizer/_location_bias')(_api_pelias_config.defaultParameters),
        geo_search: require('../sanitizer/_geo_search')(),
        geometries: require('../sanitizer/_geometries')(),
        boundary_country: require('../sanitizer/_boundary_country')(),
        categories: require('../sanitizer/_categories')(),
        // this can go away once geonames has been abrogated
        geonames_warnings: require('../sanitizer/_geonames_warnings')(),
        request_language: require('../sanitizer/_request_language')()
      };

  return ( req, res, next ) => {
    sanitizeAll.runAllChecks(req, sanitizers);
    next();
  };

};
