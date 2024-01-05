// generate code
const generateCode = () => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const codeLength = 8;

    let code = "";
    for (let i = 0; i < codeLength; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        code += characters[randomIndex];
    }

    return code;
};

// check phone number
const validatePhone = (paramPhone) => {
    var vValidRegex = /((0|\+)+([0-9]{9,11})\b)/g;
    if (paramPhone.match(vValidRegex)) {
        return true;
    } else {
        return false;
    }
};

// check email
const validateEmail = (paramEmail) => {
    var vValidRegex =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (paramEmail.match(vValidRegex)) {
        return true;
    } else {
        return false;
    }
};

// log with colors
const reset = "\x1b[0m";
const log = {
    white: (text) => console.log("\x1b[45m\x1b[37m" + text + reset),
    green: (text) => console.log("\x1b[41m\x1b[32m" + text + reset),
    red: (text) => console.log("\x1b[43m\x1b[31m" + text + reset),
    blue: (text) => console.log("\x1b[46m\x1b[34m" + text + reset),
    yellow: (text) => console.log("\x1b[33m" + text + reset),
};

module.exports = { generateCode, validatePhone, validateEmail, log };
