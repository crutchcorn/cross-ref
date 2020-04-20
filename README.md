# Cross Ref API Browser

This project enables you to [get articles about animals for the past year on CrossRef](https://www.crossref.org/). It's a CLI
program that supports two actions:

1) Downloading the data to a local SQLite database
2) Exporting that data to a CSV file

# Usage

## Pre-requisits

Because the CLI utility was written in NodeJS, [you'll need to first install it for your platform](https://nodejs.org/en/download/)

Once that's done, you'll want to clone the repo:

```
git clone https://github.com/crutchcorn/cross-ref.git
```

Finally, open the folder and install the dependenices:

```
cd cross-ref
npm i
```

## Using the CLI

Once you have the program setup, simply run `npm start`. It will provide the two options to you.

If you choose to download the new data, it will save that data to SQLite. You're able to then inspect the database in `src/data.sqlite` in any DB inspector

If you choose to export to CSV, it will save to `output.csv` in the `src` folder.
