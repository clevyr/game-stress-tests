const generateBot = require('./generate-bot');
const testUser = require('./test-user');
const opts = require('./options');

async function run() {
  if (opts.limit > process.getMaxListeners()) {
    process.setMaxListeners(opts.limit);
  }

  const startAt = opts.offset;
  const endAt = opts.offset + opts.limit;
  for (let i = startAt; i <= endAt; i++) {
    testUser(generateBot(i));
  }
}

module.exports = run;

// If called directly via CLI, instead of via module
if (require.main === module) {
  run();
}
