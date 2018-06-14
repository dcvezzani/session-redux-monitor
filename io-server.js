import socketIo from 'socket.io';
import { io as ioMonitor } from './io-client';

let store = {history: {}};

export const io = (server) => {
	const monitorServer = socketIo(server, { path: '/io.redux.monitor'});
	const reactClient = socketIo(server, { path: '/io4'});

	monitorServer.on('connection', function(feClient) {
		console.log('Client connected...', feClient.handshake.headers.origin);

		feClient.on('join', function(data) {
			console.log(`join`, data);
			feClient.emit('joined', 'Greetings program (monitor)');
		});

		ioMonitor(feClient, store);
	});
	
	reactClient.on('connection', function(feClient) {
		console.log('Client connected...', feClient.handshake.headers.origin);

		feClient.on('join', function(data) {
			console.log(`join`, data);
			feClient.emit('joined', 'Greetings program (react)');
		});

		feClient.on('room', function(room) {
		  feClient.join(room);
		  console.log("room joined", room);
		});  

		feClient.on('frontend:state', (data) => {
			const label = `${data.timestamp};[FE] ${data.action.type}`;
			store.history[label] = data;
			monitorServer.emit('frontend:state', {labels: Object.keys(store.history), ...data});
		});
	});  
};

