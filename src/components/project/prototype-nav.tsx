import Link from "next/link";
import type { PrototypeLink } from "@/lib/prototype/agent-prototype-data";

type PrototypeNavProps = {
  links: PrototypeLink[];
  activeHref?: string;
};

function getLinkClasses(link: PrototypeLink, activeHref?: string) {
  const isSecondary = link.kind === "secondary";
  const isActive = link.href === activeHref;

  if (isSecondary) {
    return "rounded-full border border-foreground/10 bg-white/65 px-4 py-2 text-sm font-medium text-foreground/65 transition hover:border-foreground/25 hover:text-foreground";
  }

  if (isActive) {
    return "rounded-full border border-foreground bg-foreground px-4 py-2 text-sm font-semibold text-background shadow-[0_12px_30px_rgba(29,20,13,0.12)]";
  }

  return "rounded-full border border-foreground/10 bg-white/80 px-4 py-2 text-sm font-medium text-foreground/80 transition hover:border-foreground/30 hover:text-foreground";
}

export function PrototypeNav({ links, activeHref }: PrototypeNavProps) {
  return (
    <nav className="flex flex-wrap gap-3">
      {links.map((link) => (
        <Link key={link.href} href={link.href} className={getLinkClasses(link, activeHref)}>
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
