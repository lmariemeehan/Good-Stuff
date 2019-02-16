const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/";

describe("routes : marco", () => {

//#1
  describe("GET /", () => {

//#2
    it("should return status code 200 along with the string 'polo' in the body.", (done) => {

//#3
      request.get(base, (err, res, body) => {
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual('polo');
//#4
        done();
      });
    });

  });
});