import { io, Socket } from 'socket.io-client';

const memoizeSocket = ({ userId, type }: { userId: string; type: SocketType }): Promise<Socket> => {
	let cache = new Map<string, Socket>();

	return new Promise((resolve, reject) => {
		if (cache.has(userId)) {
			console.log('Returning existing socket..');
			return resolve(cache.get(userId)!);
		} else {
			console.log('Creating new socket..');
			const connectionType = `${type.toLowerCase()} connection`;
			const socket = io('https://dax.server.michaelpalladino.io', {
				withCredentials: true,
				extraHeaders: {
					userid: userId,
					connection_type: type.toLowerCase()
				}
			});

			console.log(`[Dax] Attempting to establish a ${connectionType}.`);

			socket.on('connect', () => {
				const connectionType = type.toLowerCase();
				socket.emit(`${connectionType} connection`, (response: string) => {
					if (response === 'ok') {
						console.log(`[Dax: ${type.toLowerCase()}] Connected to server.`);
						cache.set(userId, socket);
						return resolve(socket);
					} else {
						return reject(new Error(`Could not connect to server: ${response}`));
					}
				});
			});
		}
	});
};

const socketsCache = new Map<string, Promise<Socket>>();

export const getSocket = ({
	userId,
	type
}: {
	userId: string;
	type: SocketType;
}): Promise<Socket> => {
	if (!socketsCache.has(userId)) {
		const socketPromise = memoizeSocket({ userId, type });
		socketsCache.set(userId, socketPromise);
	}

	return socketsCache.get(userId)!;
};

// const socket = async (userId: string, type: SocketType) =>
// 	memoizeSocket({
// 		type,
// 		userId
// 	})

// const socket = (userId: string, type: SocketType) => {
// 	const memoSocket = memoizeSocket({ userId })();

// 	if (type === 'DESKTOP') {
// 		memoSocket.emit('desktop connection', async (response) => {
// 			console.log('[Dax] Connected to server.', response);
// 			if ((await response) === 'ok') return memoSocket;
// 			else return memoSocket;
// 		});
// 	}

// 	if (type === 'PHONE') {
// 		memoSocket.emit('mobile connection', async (response) => {
// 			console.log('[Dax] Connected to server.');
// 			if ((await response) === 'ok') return memoSocket;
// 			else return memoSocket;
// 		});
// 	}

// 	return memoSocket;
// };
/**
 *
 * @param url
 * @returns a memoized connection object
 */

export type DaxSocket = Socket;
type SocketType = 'DESKTOP' | 'CONTROLLER';
// export const getSocket = ({ userId, type }: { userId: string; type: SocketType }) =>
// 	memoizeSocket({
// 		type,
// 		userId
// 	});

async function test() {}

// export const getSocket = ({
// 	userId,
// 	type
// }: {
// 	userId: string;
// 	type: SocketType;
// }): Promise<DaxSocket> =>
// 	new Promise((resolve, reject) => {
// 		const memoSocket = memoizeSocket({ userId })();

// 		if (type === 'DESKTOP') {
// 			memoSocket.emit('desktop connection', (response: any) => {
// 				console.log(response);
// 				console.log('[Dax] Connected to server.', response);
// 				if (response === 'ok') return resolve(memoSocket as DaxSocket) as unknown as DaxSocket;
// 				else return reject(new Error('Could not connect to server'));
// 			});
// 		}

// 		if (type === 'PHONE') {
// 			memoSocket.emit('mobile connection', (response: any) => {
// 				console.log(response);
// 				console.log('[Dax] Connected to server.', response);
// 				if (response === 'ok') return resolve(memoSocket as DaxSocket) as unknown as DaxSocket;
// 				else return reject(new Error('Could not connect to server'));
// 			});
// 		}
// 	});
