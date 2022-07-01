import { Connection } from '../Connection';

const memoizeConnection = () => {
	let cache = new Array<Connection>(1);
	return () => {
		if (cache[0]) {
			return cache[0];
		} else {
			let connection = new Connection('https://dax-server.michaelpalladino.io');
			cache[0] = connection;
			return connection;
		}
	};
};

const connection = memoizeConnection();
/**
 *
 * @param url
 * @returns a memoized connection object
 */
export const getConnection = (url?: string) => connection();
