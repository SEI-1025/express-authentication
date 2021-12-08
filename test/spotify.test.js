const expect = require('chai').expect;
const request = require('supertest');
const app = require('../server');


describe('Spotify API', function() {
  it('should return a 200 response', function(done) {
    request(app).get('/test-albums').expect(200, done);
  });

  it('should return a 200 response', function(done) {
    request(app).get('/test-albums-tracks').expect(200, done);
  });
  it('should return a 200 response', function(done) {
    request(app).get('/test-search').expect(200, done);
  });
});
