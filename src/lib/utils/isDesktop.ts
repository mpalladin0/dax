import { browser } from '$app/env';

export function isDesktop() {
	if (!browser) return false;
	if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
		return false;
	} else return true;
}
