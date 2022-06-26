import Fastify from 'fastify';
import FastifyWebSocket from 'fastify-websocket';

const index = `<!DOCTYPE HTML>
<html>
	<head>
		<meta charset='utf-8' />
	</head>
	<body>
		<script>
const socket = new WebSocket('ws://' + location.host);

socket.addEventListener('open', () => {
	console.log('Socket open.');

	socket.send('Test');
});

socket.addEventListener('close', () => {
	console.log('Socket closed.');
});

socket.addEventListener('error', () => {
	console.log('Socket encountered an error!');
});

socket.addEventListener('message', event => {
	console.log('Received message:', event.data);
});
		</script>
	</body>
</html>`;

export default function server({ port, host }){
	const server = new Fastify({
		logger: {
			level: 'error',
		}
	});

	server.register(FastifyWebSocket);
	
	server.route({
		method: 'GET',
		url: '/',
		handler(request, reply){
			reply.header('content-type', 'text/html');
			reply.send(index);
		},
		wsHandler(connection, request){
			try{
				connection.socket.on('message', message => {
					connection.socket.send(`You sent ${message}`);
				});
			}catch(err){
				console.error(err);
			}
		},
	});
	
	
	server.listen(port, host, (error, url) => {
		if(error){
			console.error(error);
			process.exit(1);
		}
		
		console.log('Server listening. View live at', url);
	});
}