
#> bounding rectangle
path: '/v1/search?text=a&boundary.rect.min_lat=-40.659'

#? 200 ok
response.statusCode.should.be.equal 400
response.should.have.header 'charset', 'utf8'
response.should.have.header 'content-type', 'application/json; charset=utf-8'

#? valid geocoding block
should.exist json.geocoding
should.exist json.geocoding.version
should.exist json.geocoding.attribution
should.exist json.geocoding.query
should.exist json.geocoding.engine
should.exist json.geocoding.engine.name
should.exist json.geocoding.engine.author
should.exist json.geocoding.engine.version
should.exist json.geocoding.timestamp

#? valid geojson
json.type.should.be.equal 'FeatureCollection'
json.features.should.be.instanceof Array

#? expected errors
should.exist json.geocoding.errors
json.geocoding.errors.should.eql [ 'parameters boundary.rect.min_lat, boundary.rect.max_lat, boundary.rect.min_lon and boundary.rect.max_lon must all be specified' ]

#? expected warnings
should.not.exist json.geocoding.warnings

#? inputs
json.geocoding.query['text'].should.eql 'a'
json.geocoding.query['size'].should.eql 10
should.not.exist json.geocoding.query['boundary.rect.min_lat']
should.not.exist json.geocoding.query['boundary.rect.max_lat']
should.not.exist json.geocoding.query['boundary.rect.min_lon']
should.not.exist json.geocoding.query['boundary.rect.max_lon']
