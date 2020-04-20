import "reflect-metadata";
import inquirer from 'inquirer';
import {createConnection} from "typeorm"
import ora from "ora";
import {downloadNewInfoFn} from "./downloadAndSave";
import {exportToCSVFn} from "./exportToCSV";

const downloadNewInfo = 'Download new information';
const exportToCSV = 'Export to CSV'

createConnection()
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
                exportToCSVFn();
                return;
        }
    })
