"use client";

import { ShoppingCart } from "lucide-react";
import { coupangLink } from "@/lib/coupang";

type CoupangAffiliateLinkProps = {
  query: string;
  affiliateUrl?: string | null;
  className?: string;
  iconClassName?: string;
  label?: string;
  onNavigate?: () => void;
};

/** Coupang Partners link — must use <a referrerPolicy="unsafe-url"> per partner requirements. */
export default function CoupangAffiliateLink({
  query,
  affiliateUrl,
  className,
  iconClassName = "w-3 h-3",
  label = "득템",
  onNavigate,
}: CoupangAffiliateLinkProps) {
  const href = coupangLink(query, affiliateUrl);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      referrerPolicy="unsafe-url"
      onClick={(e) => {
        e.stopPropagation();
        onNavigate?.();
      }}
      className={className}
    >
      <ShoppingCart className={iconClassName} />
      {label}
    </a>
  );
}
