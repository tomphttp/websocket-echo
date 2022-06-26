import { Command, Option } from 'commander';
import { createServer } from 'http';
import { Server } from 'node-static';
import { WebSocketServer } from 'ws';

const program = new Command();

program
	.description('Start the basic WebSocket server')
	.addOption(
		new Option('--h, --host <string>', 'Listening host').default('localhost')
	)
	.addOption(
		new Option('--p, --port <number>', 'Listening port').default(80).env('PORT')
	)
	.action(function server({ port, host }) {
		const staticServer = new Server('public');
		const httpServer = createServer();

		httpServer.on('request', async (req, res) => {
			staticServer.serve(req, res);
		});

		const wsServer = new WebSocketServer({
			backlog: true,
			server: httpServer,
			path: '/ws',
		});

		wsServer.on('connection', client => {
			console.log('Client connected');

			client.on('message', data => {
				client.send(`You sent: ${data}`);
			});
		});

		httpServer.on('listening', () =>
			console.log(`Listening on http://${host}:${port}`)
		);

		httpServer.listen({
			port,
			host,
		});
	});

program.parse(process.argv);
