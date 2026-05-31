import { BikeIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { footerData } from "../assets/assets";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-green-950 to-black text-white mt-24">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Brand */}
          <div>
            <Link
              to="/"
              className="flex items-center gap-3 mb-5"
            >
              <div className="w-11 h-11 rounded-2xl bg-white/10 flex items-center justify-center">
                <BikeIcon className="size-6 text-orange-400" />
              </div>

              <span className="text-2xl font-bold">
                Instacart
              </span>
            </Link>

            <p className="text-sm leading-relaxed text-white/70 mb-6">
              {footerData.brand.description}
            </p>

            {/* Socials */}
            <div className="flex gap-3">
              {footerData.brand.socials.map((social, i) => (
                <a
                  key={i}
                  href={social.link}
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-xl bg-white/10 hover:bg-orange-500 transition-all duration-300 flex items-center justify-center hover:scale-110"
                >
                  <social.icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Dynamic Sections */}
          {footerData.sections.map((section, i) => (
            <div key={i}>
              
              <h3 className="text-sm font-semibold uppercase tracking-wider mb-5 text-orange-400">
                {section.title}
              </h3>

              <ul className="space-y-3">
                {section.links.map((link, idx) => (
                  <li key={idx}>
                    {link.to ? (
                      <Link
                        to={link.to}
                        className="text-sm text-white/70 hover:text-white transition-colors"
                      >
                        {link.label}
                      </Link>
                    ) : (
                      <a
                        href={link.href}
                        className="text-sm text-white/70 hover:text-white transition-colors"
                      >
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-5 text-orange-400">
              Contact Us
            </h3>

            <ul className="space-y-4">
              {footerData.contact.map((item, i) => {
                const Icon = item.icon;

                return (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-sm text-white/70"
                  >
                    <div className="mt-0.5">
                      <Icon className="size-4 text-orange-400" />
                    </div>

                    <span>{item.text}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 mt-14 pt-6">

          {/* Bottom */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            
            <p className="text-xs text-white/50 text-center sm:text-left">
              © 2026 Instacart. All rights reserved.
            </p>

            <div className="flex items-center gap-5 flex-wrap justify-center">
              {footerData.bottom.links.map((link, i) => (
                <a
                  key={i}
                  href={link.href}
                  className="text-xs text-white/50 hover:text-white transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;