const User = require('./models/user');
const hashPassword = require('./server').hash;
const comparePassword = require('./server').compare;

// describe("Fetch User Object From Remote Database.", function() {
//     it('wrong email so cannot find user', async function () {
//         const email = "????";

//         const user = await User.findOne({ email });
    
//         expect(user).toBe(null);
//     })
// });

describe("Check if Login Password Module Is Working Properly", function() {
    test("Should check the password hashing and comparison", async function() {
        const password = "*#(!@#_*313i20891>>";
        const hashedPassword = await hashPassword(password);
        const isValid = await comparePassword(password, hashedPassword);
        
        expect(isValid).toBe(true);
    });
});