const db = new Mongo().getDB("app");

const testcol = db.getCollection("test");

testcol.createIndex({ test: 1 }, { unique: true });
