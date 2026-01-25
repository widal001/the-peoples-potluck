// Shared site configuration
import { getCollectionNavItems } from "./collections";

export interface NavItem {
  label: string;
  href: string;
}

export interface NavDropdown {
  label: string;
  items: NavItem[];
}

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterProps {
  companyName: string;
  links: FooterLink[];
  showContactSection?: boolean;
  contactTitle?: string;
  contactTagline?: string;
  contactButtonHref?: string;
}

// Navigation items - collection links are generated from centralized config
const collectionLinks = getCollectionNavItems();

export const navItems: (NavItem | NavDropdown)[] = [
  {
    label: "Browse",
    items: collectionLinks,
  },
  { label: "Make a plate", href: "/plate/" },
  { label: "About", href: "/about/" },
];

export const siteConfig = {
  companyName: "The People's Potluck",
  logoHref: "/",
};

// Default footer configuration
export const footerConfig: FooterProps = {
  companyName: siteConfig.companyName,
  links: [...collectionLinks, { label: "About", href: "/about/" }],
  showContactSection: true,
  contactTitle: "Make me a plate",
  contactTagline: "Get a random selection from the potluck.",
  contactButtonHref: "/plate/",
};
