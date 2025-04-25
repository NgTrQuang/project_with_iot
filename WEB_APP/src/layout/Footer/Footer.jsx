import React from 'react';
import FooterLogo from './FooterLogo';
import FooterSocialLinks from './FooterSocialLinks';
import FooterLinkSection from './FooterLinkSection';

const Footer = () => {
  return (
    <footer className="bg-white pt-16 pb-12 border-t border-gray-100">
      <div className="container grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Logo and Social Media */}
        <div className="space-y-4">
          <FooterLogo />
          <p className="text-gray-500">
            We're here for you, aiming to provide the best experience for our customers.
          </p>
          <FooterSocialLinks />
        </div>

        {/* Solutions and Support Sections */}
        <div className="grid grid-cols-2 gap-4 md:gap-8">
          <FooterLinkSection
            title="Solutions"
            links={[
              { text: 'Marketing', href: '#' },
              { text: 'Analytics', href: '#' },
              { text: 'E-Commerce', href: '#' },
              { text: 'Insights', href: '#' },
            ]}
          />
          <FooterLinkSection
            title="Support"
            links={[
              { text: 'Pricing', href: '#' },
              { text: 'Guides', href: '#' },
              { text: 'About Us', href: '#' },
            ]}
          />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
