import { io, Socket } from 'socket.io-client';

const memoizeSocket = ({ userId }: { userId: string }) => {
	let cache = new Array<Socket>(1);

	return () => {
		if (cache[0]) {
			return cache[0];
		} else {
			let socket = io('https://dax.server.michaelpalladino.io', {
				extraHeaders: {
					userid: userId
				}
			});

			cache[0] = socket;
			return socket;
		}
	};
};

const socket = (userId: string, type: SocketType) => {
	const memoSocket = memoizeSocket({ userId })();

	if (type === 'DESKTOP') {
		memoSocket.emit('desktop connection', async (response) => {
			console.log('[Dax] Connected to server.', response);
			if ((await response) === 'ok') return memoSocket;
			else return memoSocket;
		});
	}

	if (type === 'PHONE') {
		memoSocket.emit('mobile connection', async (response) => {
			console.log('[Dax] Connected to server.');
			if ((await response) === 'ok') return memoSocket;
			else return memoSocket;
		});
	}

	return memoSocket;
};
/**
 *
 * @param url
 * @returns a memoized connection object
 */

export type DaxSocket = ReturnType<typeof socket>;
type SocketType = 'DESKTOP' | 'PHONE';
export const getSocket = ({ userId, type }: { userId: string; type: SocketType }): DaxSocket =>
	socket(userId, type) as unknown as DaxSocket;
