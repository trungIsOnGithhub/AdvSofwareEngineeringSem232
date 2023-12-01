const jwt = require('jsonwebtoken');
const requester = require('./commonTest').requester;

const TESTING_ENDPOINT = "/login";

ACCESS_TOKEN_SECRET = "33e63cdbf2c1b7c12bdef634d08f82bedc42a252963dfade0401af3c354cf3fa";

const testLoginData = [
    {
        email: "teacher@gmail.com",
        password: "teacher",
        fullname: "Phuc",
        desiredOutput: "Wrong Credentials!!",
        desiredStatus: 401
    },
    // {
    //     email: "teacher@gmail.com",
    //     password: "teacher",
    //     desiredOutput: "Wrong Credentials!!",
    //     desiredStatus: 401
    // },
    // {
    //     email: "hai@gmail.com",
    //     password: "hai69",
    //     desiredOutput: "Wrong Credentials!!",
    //     desiredStatus: 401
    // },
];

describe(`Testing POST: ${TESTING_ENDPOINT}`, function() {
    let response = null;
    let called = false;
    let index = 0;

    while (index < testLoginData.length) {
        const userLogin = testLoginData[index];

        if (!called) {
            const testMessage = `Get response data |Number ${index+1}|--|Email: ${userLogin.email}|--|Password: ${userLogin.password}|--|Desired Output: ${userLogin.desiredOutput}|`;

            test(testMessage, function(done) {
                requester
                    .post(TESTING_ENDPOINT)
                    .set({
                       'Content-Type': 'application/json',
                       'Accept': 'application/json'
                    })
                    .send(userLogin)
                    .expect(userLogin.desiredStatus)
                    .then( async function(res) {
                        response = res;

                        // if (userLogin.desiredStatus !== 200) {       

                           
                        //     // console.log("++++++++++");
                        //     done();

                        //     return;
                        // }
                        // else if (userLogin.desiredStatus === 200) {
                        //     // let verifiedData = await jwt.verify(res.body.token, ACCESS_TOKEN_SECRET);

                        //     // expect(verifiedData.email).toEqual(userLogin.email);

                        //     // expect(res.body.user).toBeDefined();
                        //     // console.log("---------------");
                        //     done();

                        //     return;
                        // }

                        // throw new Error(`Unknown Response Body: ${JSON.stringify(res.body)}`);
                        done();
                    } )
                    .catch(function(err) {
                        console.log("Exception Occured in Testing : ", err)
                        done(err);
                    });
            });

            called = true;
            // test("Should test whether returned status matched!", function() {
            //     expect(responseBody.fullname).toEqual(userLogin.fullname);
            // });
        }
        else {
            const testMessage = `Data |Email: ${userLogin.email}| |Password: ${userLogin.password}|`;

            test(`Start test ${testMessage}`, function() {
                expect(response).toBeDefined();
            });

            test("1: Should test response body available", function() {
                expect(response.body).toBeDefined();
            });
    
            test("2: Should test response status matched", function() {
                expect(response.status).toEqual(userLogin.desiredStatus);
            });

            test("3: Should test response body error message available if fail", function() {
                if (response.status > 300) {
                    expect(response.body.error).toBeDefined();
                }
            });

            test("4: Should test response body token message available if success", function() {
                if (response.status === 200) {
                    expect( typeof(response.body.token) ).toBe("string");
                }
            });

            test("5: Should test response body error message match if fail", function() {
                if (response.status > 300) {
                    expect(response.body.error.toLowerCase()).toBe( getErrorTextByStatus(userLogin.desiredStatus) );
                }
            });

            test("6: Should test whether response data matched if success!", function() {
                if (response.status == 200) {
                    expect(response.body.fullname).toEqual(userLogin.fullname);
                }
            });

            test("7: Should for Allow Header Authorization in response!", function() {
                expect(response.header['access-control-allow-headers']).toEqual("Content-Type, Authorization");
            });
            // else if (response.status === 200) {
            //     test("3: Should test whether response data contain token!", function() {
            //         expect( typeof(res.body.token) ).toBe("string");
            //     });

            response = null;
            called = false;
            ++index;
        }
    }
});

function getErrorTextByStatus(status) {
    switch(status) {
        case 400:
            return "bad request";
        case 404:
            return "not found";
        case 401:
            return "invalid credentials";
    }

    return "Unknown Error";
}