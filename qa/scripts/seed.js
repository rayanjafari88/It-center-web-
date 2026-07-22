const { seedQaRecords } = require("./qa-lib");

const result = seedQaRecords();
console.log(`Seeded QA users: ${result.users}`);
console.log(`Seeded QA employees: ${result.employees}`);

