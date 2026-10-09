import type { ReactNode } from "react";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader, siteHeaderPropsFromLayout } from "@/components/layout/site-header";
import type { LayoutContent } from "@/lib/content/types";

/**
 * Shared chrome: the header, the page, and the terminus.
 *
 * The header is driven by the shared layout content (`layout-<locale>`
 * singleton merged over code defaults): nav links become its items, the nav
 * CTA becomes its primary action, and the CMS wordmarks win over any
 * pass-through props via `siteHeaderPropsFromLayout`.
 *
 * There is no page-wide background layer in this world. The grounds belong to
 * the bands that carry them, the trace network is drawn inside the bands that
 * want it, and the resolve between them belongs to whichever band changes — so
 * the layout is three pieces and nothing else.
 */
export function SiteLayout({ children, layout }: { children: ReactNode; layout?: LayoutContent; }) {
	return (
		<>
			<SiteHeader {...siteHeaderPropsFromLayout(layout)} />
			<main id="main" className="relative z-10 -mt-16">
				{children}
			</main>
			<SiteFooter footer={layout} />
		</>
	);
}
