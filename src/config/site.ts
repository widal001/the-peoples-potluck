// Shared site configuration

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

export const navItems: (NavItem | NavDropdown)[] = [
  {
    label: "Browse",
    items: [
      { label: "Side Dishes", href: "/side-dishes/" },
      { label: "Desserts", href: "/desserts/" },
      { label: "Plates & Cutlery", href: "/plates-cutlery/" },
      { label: "Drinks", href: "/drinks/" },
    ],
  },
  { label: "Make a Plate", href: "/plate/" },
  { label: "About", href: "/about/" },
];

export const siteConfig = {
  companyName: "The People's Potluck",
  logoHref: "/",
};

// Default footer configuration
export const footerConfig: FooterProps = {
  companyName: siteConfig.companyName,
  links: [
    { label: "Side Dishes", href: "/side-dishes/" },
    { label: "Desserts", href: "/desserts/" },
    { label: "Plates & Cutlery", href: "/plates-cutlery/" },
    { label: "Drinks", href: "/drinks/" },
    { label: "About", href: "/about/" },
  ],
  showContactSection: true,
  contactTitle: "Make me a plate",
  contactTagline: "Get a random selection from the potluck.",
  contactButtonHref: "/plate/",
};
