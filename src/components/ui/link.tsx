import NextLink, { LinkProps as NextLinkProps } from "next/link";
import { forwardRef, type AnchorHTMLAttributes, type ReactNode } from "react";

export type LinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> &
	NextLinkProps & {
		href: NextLinkProps["href"];
		children: ReactNode;
	};

const isInternalLink = (href: NextLinkProps["href"]): boolean => {
	return (
		typeof href === "string" &&
		(href.startsWith("/") || href.startsWith("#") || href.startsWith("?"))
	);
};

const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(props, ref) {
	const {
		href,
		children,
		target,
		rel,
		...anchorProps
	} = props;

	if (!isInternalLink(href?.toString())) {
		return (
			<a
				{...anchorProps}
				ref={ref}
				href={href?.toString()}
				target={target || "_blank"}
				rel={rel || "noopener noreferrer"}
			>
				{children}
			</a>
		);
	}

	return (
		<NextLink {...props} ref={ref}>
			{children}
		</NextLink>
	);
});

export default Link;
