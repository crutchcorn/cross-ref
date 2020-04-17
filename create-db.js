const sqlite3 = require('sqlite3');

new sqlite3.Database("./data.sqlite",
    sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
    (err) => {
        // do your thing
    });
