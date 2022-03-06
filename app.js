import { Command, Option } from 'commander';
import server from './cli/server.js';

const program = new Command();

program
.command('server')
.description('Start the WebSocket server')
.addOption(new Option('--h, --host <string>', 'Listening host').default('localhost'))
.addOption(new Option('--p, --port <number>', 'Listening port').default(80).env('PORT'))
.action(server)
;

program.parse(process.argv);