const jwt = require('jsonwebtoken');
const requester = require('./commonTest').requester;

ACCESS_TOKEN_SECRET = "33e63cdbf2c1b7c12bdef634d08f82bedc42a252963dfade0401af3c354cf3fa";

const TESTING_ENDPOINT = "/login";

const testLoginData = [
    {
        email: "a@a.a",
        password: "aaa",
        desiredOutput: "Successful Login!!",
        desiredStatus: 200
    },
    {
        email: "a@a.a",
        password: "aaa",
        desiredOutput: "Successful Login!!",
        desiredStatus: 200
    },
    {
        emails: "",
        password: "",
        desiredOutput: "No Valid Email Field!!",
        desiredStatus: 400
    },
];

describe(`Testing POST: ${TESTING_ENDPOINT}`, function() {
    for (let index in testLoginData) {
            let userLogin = testLoginData[index];

            beforeEach(function () {  
                console.log(`Student Login Scenario Number ${index+1}`);
                console.log(`Desired Output: ${userLogin.desiredOutput}`);
            });
        
            afterEach(function () {
                console.log(`Plain Email: ${userLogin.email}`);
                console.log(`Plain Password: ${userLogin.password}`);
            });
    
            test(`Should test student login Number ${index+1}`, function(done) {
                requester
                    .post(TESTING_ENDPOINT)
                    .set('Content-Type', 'application/json')
                    .set('Accept', 'application/json')
                    .send(userLogin)
                    .expect(userLogin.desiredStatus)
                    .then( async function(res) {
                        if (userLogin.desiredStatus !== 200) {
                            expect(res.body).toBeDefined();         

                            expect(res.body.error).toBeDefined();

                            expect(res.body.error).toBe( getErrorTextByStatus(userLogin.desiredStatus) );
                        }
                        else {
                            expect(res.body).toBeDefined();

                            expect( typeof(res.body.token) ).toBe("string");

                            let verifiedData = await jwt.verify(res.body.token, ACCESS_TOKEN_SECRET);

                            expect(verifiedData.email).toEqual(userLogin.email);
                        }
                        console.log(res.body.token);

                        done();
                    } )
                    .catch(function(err) {
                        console.log("Exception Occured in Testing : ", err)
                        done();
                    }  )
            });
    }
});

function getErrorTextByStatus(status) {
    switch(status) {
        case 400:
            return "Bad Request";
        case 404:
            return "Not Found";
        case 404:
            return "Access denied";
    }

    return "Unknown Error";
}