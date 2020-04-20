import {createQueryBuilder, getManager, ObjectLiteral} from "typeorm";
import {Affiliation, Author, Work} from "./entities";
import fetch from "node-fetch";
import {v3 as uuidv3} from 'uuid';
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

const insertAffiliations = async (affiliations: ApiAffiliation[]) => {
    if (!affiliations.length) return [];
    return await Promise.all(affiliations.map(async affiliation => {
        let affil = new Affiliation();
        affil.name = affiliation.name
        try {
            await affil.save();
        } catch (e) {
            affil = (await getManager().findOne(Affiliation, affiliation.name))!;
        }
        return affil;
    }))
}

type FilledAuthor = Omit<ApiAuthor, 'affiliation'> & { uuid: string, affiliation: Affiliation[] };
const insertAuthors = async (authors: FilledAuthor[]) => {
    if (!authors.length) return [];
    return await Promise.all(authors.map(async author => {
        let auth = new Author();
        auth.uuid = author.uuid;
        auth.given = author.given;
        auth.family = author.family;
        auth.sequence = author.sequence;
        auth.affiliation = author.affiliation;
        try {
            await auth.save();
        } catch (e) {
            auth = (await getManager().findOne(Author, author.uuid))!;
        }
        return auth;
    }))
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
        const authors = item.author ? await Promise.all(item.author.map(async author => {
                const affiliations = await insertAffiliations(author.affiliation);

                // This is to ensure that we can simply "Insert many" without having to worry about collision
                const uuid = uuidv3(JSON.stringify(author), UUIDConst)

                return {
                    ...author,
                    affiliation: affiliations,
                    uuid
                }
            }
        )) : []

        const authorIds = await insertAuthors(authors) as any[];

        const created = new Date(item.created.timestamp);

        const work = new Work();

        work.doi = item.DOI;
        work.title = item.title;
        work.created = created;
        work.author = authorIds;

        return work;
    }))

    for (const work of works) {
        try {
            work.save();
        } catch (e) {}
    }
}
