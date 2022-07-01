import { browser } from '$app/env';

export const isMobile = () => {
	if (!browser) return false;
	if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
		return true;
	} else return false;
};
