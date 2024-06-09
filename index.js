#!/usr/bin/env node
import inquirer from "inquirer";
let myBalance = 10000;
const username = "AbbasAsad";
const password = "abbas123";
let transactionHistory = [];
async function main() {
    console.log("Welcome to PayPal!");
    const loginAnswer = await inquirer.prompt([
        {
            name: "username",
            message: "Enter your username",
            type: "input",
        },
        {
            name: "password",
            message: "Enter your password",
            type: "password",
        },
    ]);
    if (loginAnswer.username === username && loginAnswer.password === password) {
        console.log("Login successful!");
        while (true) {
            const optionAns = await inquirer.prompt([
                {
                    name: "option",
                    message: "What would you like to do?",
                    type: "list",
                    choices: ["Send Money", "Request Money", "Check Balance", "View Transaction History", "Logout"],
                },
            ]);
            if (optionAns.option === "Send Money") {
                const sendMoney = await inquirer.prompt([
                    {
                        name: "amount",
                        message: "Enter the amount to send",
                        type: "number",
                        validate(value) {
                            const valid = !isNaN(value) && value > 0;
                            return valid || "Please enter a positive number";
                        },
                    },
                    {
                        name: "recipient",
                        message: "Enter the recipient's email",
                        type: "input",
                        validate(value) {
                            const valid = /\S+@\S+\.\S+/.test(value);
                            return valid || "Please enter a valid email address";
                        },
                    },
                ]);
                if (sendMoney.amount > myBalance) {
                    console.log("Insufficient balance to send money.");
                }
                else {
                    myBalance -= sendMoney.amount;
                    transactionHistory.push({ type: "Send", amount: sendMoney.amount, to: sendMoney.recipient, date: new Date() });
                    console.log(`You sent $${sendMoney.amount} to ${sendMoney.recipient}. Your remaining balance is: $${myBalance}`);
                }
            }
            else if (optionAns.option === "Request Money") {
                const requestMoney = await inquirer.prompt([
                    {
                        name: "amount",
                        message: "Enter the amount to request",
                        type: "number",
                        validate(value) {
                            const valid = !isNaN(value) && value > 0;
                            return valid || "Please enter a positive number";
                        },
                    },
                    {
                        name: "sender",
                        message: "Enter the sender's email",
                        type: "input",
                        validate(value) {
                            const valid = /\S+@\S+\.\S+/.test(value);
                            return valid || "Please enter a valid email address";
                        },
                    },
                ]);
                transactionHistory.push({ type: "Request", amount: requestMoney.amount, from: requestMoney.sender, date: new Date() });
                console.log(`You requested $${requestMoney.amount} from ${requestMoney.sender}.`);
            }
            else if (optionAns.option === "Check Balance") {
                console.log(`Your balance is: $${myBalance}`);
            }
            else if (optionAns.option === "View Transaction History") {
                console.log("Transaction History:");
                if (transactionHistory.length === 0) {
                    console.log("No transactions found.");
                }
                else {
                    transactionHistory.forEach((transaction, index) => {
                        console.log(`${index + 1}. ${transaction.type} $${transaction.amount} ${transaction.type === "Send" ? 'to' : 'from'} ${transaction.to || transaction.from} on ${transaction.date}`);
                    });
                }
            }
            else if (optionAns.option === "Logout") {
                console.log("You have been logged out.");
                break;
            }
        }
    }
    else {
        console.log("Incorrect username or password.");
    }
}
main();
