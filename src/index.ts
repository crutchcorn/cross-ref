import "reflect-metadata";
import inquirer from 'inquirer';
import {ConnectionOptions, createConnection} from "typeorm"
import {Affiliation, Author, Work} from "./entities";
import ora from "ora";
import {downloadNewInfoFn} from "./downloadAndSave";

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
        switch (answers.command) {
            case downloadNewInfo:
                const oraInst = ora('Loading unicorns').start();
                downloadNewInfoFn()
                    .then(() => {
                        oraInst.stop();
                    })
                    .catch((e) => {
                        console.error(e);
                        oraInst.stop();
                    })
                break;
            case exportToCSV:
            default:
                return;
        }
    })
