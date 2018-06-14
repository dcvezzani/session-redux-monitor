import socketIo from 'socket.io';
import { io as ioMonitor } from './io-client';

export const io = (server) => {
	const monitorServer = socketIo(server, { path: '/io.redux.monitor'});

	monitorServer.on('connection', function(feClient) {  
		console.log('Client connected...');

		feClient.on('join', function(data) {
			console.log(`join`, data);
			feClient.emit('joined', 'Greetings program');
		});

		ioMonitor(feClient);
	});
};

