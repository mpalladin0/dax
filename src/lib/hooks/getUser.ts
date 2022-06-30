import { generateUUID } from 'three/src/math/MathUtils.js';

function makeStorageUser() {
	const user = {
		id: generateUUID(),
		lastRoom: ''
	};

	return user;
}

function makeUser(user: string) {
	const userStr = JSON.parse(user) as ReturnType<typeof makeStorageUser>;
	// const connection = getConnection();

	// connection.socket?.on('connect', () => {
	// 	if (connection.isDesktop) connection.socket?.emit('desktop connection', userStr.id);
	// });

	return {
		...userStr
		// connection
	};
}

export type User = ReturnType<typeof makeUser>;
export function getUser() {
	const user = localStorage.getItem('user');
	if (user) return makeUser(user);
	else {
		localStorage.setItem('user', JSON.stringify(makeStorageUser()));
		return makeUser(localStorage.getItem('user')!);
	}
}
