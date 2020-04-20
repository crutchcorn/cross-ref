import {getRepository} from "typeorm";
import {Work} from "./entities";
const fs = require('fs');
const path = require('path');

export const exportToCSVFn = async () => {
    const filename = path.join(__dirname, 'output.csv');

    const workRepository = getRepository(Work);
    const works = await workRepository.find({relations: ['author', 'author.affiliation']})
    const csvHeader = [
        'DOI',
        'Title',
        'Created',
        'AuthorGiven',
        'AuthorFamily',
        'AuthorAffiliation',
        'SecondaryAuthorGiven',
        'SecondaryAuthorFamily',
        'SecondaryAuthorAffiliation',
    ].join(',');
    const csvRows = works.map(work => {
        let primaryAuthor = work.author.find(author => author.sequence === 'first') || work.author[0] || {};
        const affiliation = primaryAuthor.affiliation ? primaryAuthor?.affiliation[0]?.name || '' : '';
        const returnArr = [
            work.doi,
            work.title.join('- '),
            work.created.toISOString(),
            primaryAuthor.given || '',
            primaryAuthor.family || '',
            affiliation
        ];
        if (work.author.length > 1) {
            const otherAuthor = work.author.find(author => author.sequence !== 'first')!;
            const secondAffiliation = otherAuthor.affiliation ? otherAuthor?.affiliation[0]?.name || '' : '';
            returnArr.push(otherAuthor.given);
            returnArr.push(otherAuthor.family);
            returnArr.push(secondAffiliation);
        } else {
            returnArr.push('');
            returnArr.push('');
            returnArr.push('');
        }
        return returnArr.join(',');
    })

    const data = `${csvHeader}\n${csvRows.join('\n')}`;

    fs.writeFileSync(filename, data);
}
