const sessionManager = require("./sessionManager");

const SESSION_STEPS = require("../constants/sessionSteps");

module.exports = async (ctx, session) => {

    switch (session.step) {

        case SESSION_STEPS.NAME:

            console.log("مرحله دریافت نام کشور");

            break;

        case SESSION_STEPS.CODE:

            console.log("مرحله دریافت کد کشور");

            break;

        case SESSION_STEPS.FLAG:

            console.log("مرحله دریافت پرچم");

            break;

    }

};