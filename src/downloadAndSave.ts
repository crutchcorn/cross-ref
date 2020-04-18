import {createQueryBuilder, ObjectLiteral} from "typeorm";
import {Affiliation, Author, Work} from "./entities";
import fetch from "node-fetch";
import { v3 as uuidv3 } from 'uuid';
import dayjs from 'dayjs';

const lastYear = dayjs().subtract(1, 'year').format('YYYY-MM-DD');

const APIRef = `http://api.crossref.org/works?query=animal&filter=from-pub-date:${lastYear}&select=DOI,title,author,created`;
const UUIDConst = `3bbcee75-cecc-5b56-8031-b6641c1ed1f1`;

interface ApiAffiliation {
    name: string
}

interface ApiAuthor {
    given: string,
    family: string,
    sequence: string,
    affiliation: ApiAffiliation[]
}

interface APIReply {
    message: {
        items: {
            DOI: string,
            title: string[],
            author: ApiAuthor[]
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

const insertAffiliations = (affiliations: ApiAffiliation[]) => {
    return createQueryBuilder()
        .insert()
        .into(Affiliation)
        .values(affiliations)
        .onConflict(`("name") DO NOTHING`)
        .execute();
}

type FilledAuthor = Omit<ApiAuthor, 'affiliation'> & {affiliation: ObjectLiteral[]};
const insertAuthors = (authors: FilledAuthor[]) => {
    return createQueryBuilder()
        .insert()
        .into(Author)
        .values(authors)
        .onConflict(`("uuid") DO NOTHING`)
        .execute();
}

export const downloadNewInfoFn = async () => {
    const res = await fetch(APIRef, {
        headers: {
            "User-Agent": "PostmanRuntime/7.24.1",
            'user-agent': "PostmanRuntime/7.24.1"
        },
    });
    const json = await res.json() as APIReply;
    const {message: {items}} = json;

    const works = await Promise.all(items.map(async item => {
        const authors = item.author ? await Promise.all(item.author.map(async author =>
            {
                const affiliations = author.affiliation?.length ? await insertAffiliations(author.affiliation) : {identifiers: []};
                // This is to ensure that we can simply "Insert many" without having to worry about collision
                const uuid = uuidv3(JSON.stringify(author), UUIDConst)

                console.log(uuid);

                return {
                    ...author,
                    affiliation: affiliations.identifiers,
                    uuid
                }
            }
        )) : []

        const {identifiers: authorIds} = authors?.length ?  await insertAuthors(authors) : {identifiers: []}

        const created = new Date(item.created.timestamp);

        return {
            doi: item.DOI,
            title: item.title,
            created,
            author: authorIds
        }
    }))

    await createQueryBuilder()
        .insert()
        .into(Work)
        .values(works)
        .onConflict(`("doi") DO NOTHING`)
        .execute();
}
