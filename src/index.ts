import "reflect-metadata";
import { ConnectionOptions, createConnection } from "typeorm"
import inquirer from 'inquirer';

const options: ConnectionOptions = {
    type: "sqlite",
    database: `${__dirname}/data.sqlite`,
    entities: [ ],
    logging: true
}

// const APIRef = `http://api.crossref.org/works?query=animal&filter=from-pub-date:2019-11-01&select=DOI,title,author,created`;
// console.log(`${__dirname}/data.sqlite`)

inquirer.prompt([
    {
        type: 'list',
        name: 'command',
        message: 'What do you want to do?',
        choices: [
            'Download new information',
            'Export to CSV',
        ]
    },
]).then(answers => console.log(answers))
