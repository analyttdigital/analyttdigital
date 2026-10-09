import { RefObject, useEffect, useState } from "react";

function useScrolled(threshold: number, container?: RefObject<HTMLElement | null>) {
	const [scrolled, setScrolled] = useState(false);
	useEffect(() => {
		const node = container?.current ?? null;
		const target: HTMLElement | Window = node ?? window;
		const read = () => (node ? node.scrollTop : window.scrollY);
		// Turns solid past the threshold and clear again only near the top, so it never flickers at the edge.
		const update = () => {
			const y = read();
			setScrolled((previous) => (previous ? y > threshold / 2 : y > threshold));
		};
		update();
		target.addEventListener("scroll", update, { passive: true });
		return () => target.removeEventListener("scroll", update);
	}, [threshold, container]);
	return scrolled;
}

export default useScrolled;