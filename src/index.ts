import "reflect-metadata";
import inquirer from 'inquirer';
import axios from 'axios';
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



const APIRef = `http://api.crossref.org/works?query=animal&filter=from-pub-date:2019-04-17&select=DOI,title,author,created`;
// console.log(`${__dirname}/data.sqlite`)

interface APIReply {
    message: {
        items: {
            DOI: string,
            title: string[],
            author: {
                given: string,
                family: string,
                sequence: string,
                affiliation: {name: string}[]
            }[]
            created: {
                "date-parts": [
                    [
                        number,
                        number,
                        number
                    ]
                ],
                "date-time": string,
                timestamp: number
            }
        }[]
    }
}

const downloadNewInfoFn = async () => {
    const {data} = await axios.get<APIReply>(APIRef);
    const {message: {items}} = data;

}

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
        answers = answers as string[]
        switch (answers) {
            case downloadNewInfo:
                return;
            case exportToCSV:
            default:
                return;
        }
    })
