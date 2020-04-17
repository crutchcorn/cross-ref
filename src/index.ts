import "reflect-metadata";
import inquirer from 'inquirer';
import {ConnectionOptions, createConnection} from "typeorm"
import {Affiliation, Author, Work} from "./entities";

const options: ConnectionOptions = {
    type: "sqlite",
    database: `${__dirname}/data.sqlite`,
    entities: [Affiliation, Author, Work],
    logging: true
}

const downloadNewInfo = 'Download new information';
const exportToCSV = 'Export to CSV'

createConnection(options)
    .then(() => inquirer.prompt([
            {
                type: 'list',
                name: 'command',
                message: 'What do you want to do?',
                choices: [
                    downloadNewInfo,
                    exportToCSV,
                ]
            },
        ])
    )
    .then((answers: any) => {
        answers = answers as string[]
        switch (answers) {
            case downloadNewInfo:
                return;
            case exportToCSV:
            default:
                return;
        }
    })
