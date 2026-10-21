"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

export interface PageTransitionLoaderProps {
    img: {
        src: string,
        alt?: string
    };
    title?: string;
    message?: string

}

export default function PageTransitionLoader({ title, message, img }: PageTransitionLoaderProps) {
	const router = useRouter();
	// Start hidden: the full-screen blurred overlay must never cover the
	// initial page load - its backdrop-filter is expensive on low-end devices
	// and it delays the first paint of real content (LCP). It is only shown
	// for client-side route transitions.
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		let hideTimer: ReturnType<typeof setTimeout> | undefined;

		const show = () => {
			if (hideTimer) clearTimeout(hideTimer);
			setLoading(true);
		};
		const hide = () => {
			if (hideTimer) clearTimeout(hideTimer);
			hideTimer = setTimeout(() => setLoading(false), 450);
		};

		router.events.on("routeChangeStart", show);
		router.events.on("routeChangeComplete", hide);
		router.events.on("routeChangeError", hide);

		return () => {
			router.events.off("routeChangeStart", show);
			router.events.off("routeChangeComplete", hide);
			router.events.off("routeChangeError", hide);
			if (hideTimer) clearTimeout(hideTimer);
		};
	}, [router.isReady, router.events]);

	return (
		<AnimatePresence>
			{loading && (
				<motion.div
					key="page-transition-loader"
					className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
					exit={{ opacity: 0, transition: { duration: 0.5, ease: "easeInOut" } }}
				>
					<div className="absolute inset-0 bg-paper/85 backdrop-blur-3xl" />

					<div className="absolute top-0 left-0 h-1 w-full overflow-hidden">
						<motion.div
							className="h-full w-2/5 bg-gradient-to-r from-accent to-accent-300 rounded-r-full"
							animate={{ x: ["-120%", "320%"] }}
							transition={{ repeat: Infinity, duration: 1.1, ease: "easeInOut" }}
						/>
					</div>

					<motion.div
						className="relative flex flex-col items-center gap-2"
						initial={{ opacity: 0, y: 14 }}
						animate={{ opacity: 1, y: 0, transition: { duration: 0.3 } }}
					>
						<div className="relative">
							<Image
								src={img.src}
								alt={img.alt || "Page Loading image"}
								width={120}
								height={40}
								className="relative drop-shadow"
							/>
						</div>

						<div className="flex flex-col items-center gap-1.5">
							{title && (
								<span className="font-display font-semibold   text-primary text-sm sm:text-base">
									{title}
								</span>
							)}
						</div>

						<div className=" flex items-center gap-3">
							<div className="grid  w-full place-items-center overflow-x-scroll rounded-lg p-2 lg:overflow-visible  text-accent">
								<div className="inline-flex" role="status" aria-label="loading">
									<svg
										className="animate-spin shrink-0 size-6 text-foreground"
										width="24"
										height="24"
										viewBox="0 0 24 24"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
										aria-hidden="true"
									>
										<path
											d="M24 12C24 18.6274 18.6274 24 12 24C5.37258 24 0 18.6274 0 12C0 5.37258 5.37258 0 12 0C18.6274 0 24 5.37258 24 12ZM3.13375 12C3.13375 16.8967 7.10331 20.8662 12 20.8662C16.8967 20.8662 20.8662 16.8967 20.8662 12C20.8662 7.10331 16.8967 3.13375 12 3.13375C7.10331 3.13375 3.13375 7.10331 3.13375 12Z"
											fill="currentColor"
											opacity=".2"
										/>
										<path
											d="M12 0C9.62662 -2.83022e-08 7.30655 0.703788 5.33316 2.02236C3.35977 3.34094 1.8217 5.21509 0.913446 7.4078C0.00519403 9.60051 -0.232446 12.0133 0.230577 14.3411C0.693599 16.6689 1.83649 18.8071 3.51472 20.4853L5.73062 18.2694C4.49065 17.0294 3.64622 15.4496 3.30412 13.7297C2.96201 12.0098 3.13759 10.2271 3.80866 8.60703C4.47972 6.98694 5.61613 5.60222 7.07418 4.62798C8.53222 3.65375 10.2464 3.13375 12 3.13375L12 0Z"
											fill="currentColor"
										/>
									</svg>
								</div>
								{message && <span className="text-sm text-primary mt-4">{message}</span>}
							</div>
						</div>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}