import fastifyStatic from '@fastify/static';
import { Command, Option } from 'commander';
import fastify from 'fastify';
import websocketPlugin from 'fastify-websocket';
import { resolve } from 'path';
import { cwd } from 'process';

const program = new Command();

program
	.description('Start the WebSocket server')
	.addOption(
		new Option('--h, --host <string>', 'Listening host').default('localhost')
	)
	.addOption(
		new Option('--p, --port <number>', 'Listening port').default(80).env('PORT')
	)
	.action(function server({ port, host }) {
		const server = fastify({
			logger: {
				level: 'error',
			},
		});

		server.register(websocketPlugin, {
			logLevel: 'error',
		});

		server.register(fastifyStatic, {
			root: resolve(cwd(), 'public'),
		});

		server.get('/ws', { websocket: true }, connection => {
			console.log('Client connected');

			connection.socket.on('message', message => {
				connection.socket.send(`You sent ${message}`);
			});
		});

		server.listen(
			{
				port,
				host,
			},
			(error, url) => {
				if (error) {
					console.error(error);
					process.exit(1);
				}

				console.log('Server listening. View live at', url);
			}
		);
	});

program.parse(process.argv);
