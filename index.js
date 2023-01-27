#!/usr/bin/env node

import chalk from "chalk";
import figlet from "figlet";
import inquirer from "inquirer";
import axios from "axios";
import boxen from "boxen";
import clear from "clear";
import dotenv from "dotenv";

dotenv.config();

console.log(chalk.blue.bold(figlet.textSync("News App", { horizontalLayout: "full" })));
const options = ["business", "entertainment", "general", "health", "science", "sports", "technology", "QUIT"];

const askForNews = () => {
    inquirer.prompt([
        {
            type: "list",
            name: "news",
            message: "What news would you like to view?",
            choices: options
        },{
            type:"input",
            name:"language",
            message:"Enter the language of news you want to view('en' for English,'hi' for Hindi and so on.....)",
            when: (answers) => answers.news !== "QUIT"
        }
    ]).then(answers => {
        if (answers.news === "QUIT") {
            console.log("Thank you for using News App.Exiting......");
            setTimeout(function(){clear();}, 3000);

        } else {
            getNews(answers.news);
        }
    });
};

const getNews = (category) => {
    const apiKey=process.env.APIKEY;
    const url = `https://newsapi.org/v2/top-headlines?country=in&category=${category}&apiKey=${apiKey}&pageSize=5`;
    axios.get(url).then(response => {
        const articles = response.data.articles;
        console.log(chalk.blue.bold(`\n${category.toUpperCase()} NEWS\n`));
        //set every news in a border 


        for (let article of articles) {
            console.log(boxen((chalk.green.bold("Headline: " + article.title))
             +"\n"+(chalk.green("Description: " +article.description))
             +"\n"+(chalk.blue("URL: " + article.url))
             +"\n"+(chalk.greenBright("Published At: " + article.publishedAt))
             
             ,{ padding: 0.4,
             margin:{
                top:1
             },
             borderStyle: "round",
             borderColor: "green",}));
        }
        askForNews();
        
    }).catch(error => {
        console.log(error);
    });
};

askForNews()