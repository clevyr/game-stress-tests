const { Command } = require('commander');

const program = new Command();

const argToInt = (v) => Number.parseInt(v, 10);

program
  .requiredOption('-u, --url <url>', 'Url to use for testing')
  .option('-l, --limit <limit>', 'Max number of users for stress testing', argToInt, 1)
  .option('-o, --offset <offset>', 'Use users after nth offset', argToInt, 0)
  .option('-h, --headless', 'Run the test in headless mode', false)
  .option('-i, --iterations <iterations>', 'Run a given number of iterations', argToInt, Number.MAX_SAFE_INTEGER)
  .option('--send-every <sendEvery>', 'Send a message every x milliseconds', argToInt, 3000);

program.parse();
module.exports = program.opts();
