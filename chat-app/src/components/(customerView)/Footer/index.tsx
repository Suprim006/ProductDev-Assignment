"use client";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-[#F5EFE7] text-[#213555] py-12">

      <div className="mt-12 pt-6 border-t border-[#3E5879] text-center"></div>

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description Column */}
          <div className="col-span-1">
            <Link href="/" className="inline-block mb-4">
              <div className="flex items-center">
                <Image
                  src="/images/logo/AI-Solutions.svg"
                  alt="AI Solution Logo"
                  width={140}
                  height={40}
                  className="w-auto h-10"
                />
              </div>
            </Link>
            <p className="text-[#213555] text-sm mb-6">
              Empowering businesses with cutting-edge AI solutions that transform challenges into opportunities.
            </p>
            
            {/* Social Media Icons */}
            <div className="flex space-x-4">
              {[
                { icon: 'facebook', href: '#' },
                { icon: 'twitter', href: '#' },
                { icon: 'linkedin', href: '#' },
                { icon: 'github', href: '#' }
              ].map((social) => (
                <a
                  key={social.icon}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#3E5879] hover:text-[#213555] transition-colors duration-300"
                >
                  {/* Replace with actual SVG icons or use an icon library */}
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="24" 
                    height="24" 
                    viewBox="0 0 24 24" 
                    fill="currentColor"
                  >
                    {/* Placeholder icon path - replace with actual social media icons
                    <path d={${social.icon === 'facebook' 
                      ? 'M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm3 8h-1.35c-.538 0-.65.221-.65.778v1.222h2l-.209 2h-1.791v7h-3v-7h-2v-2h2v-2.308c0-1.769.931-2.692 3.029-2.692h1.971v3z'
                      : social.icon === 'twitter'
                      ? 'M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z'
                      : social.icon === 'linkedin'
                      ? 'M4.98 3.5c0 1.38-1.11 2.5-2.48 2.5s-2.48-1.12-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.012-7.593-9.988-3.714v-2.155z'
                      : 'M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z'
                    }
                    /> */}
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links Column */}
          <div>
            <h3 className="text-xl font-semibold mb-6 text-[#213555]">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { name: 'Home', href: '/' },
                { name: 'Articles', href: '/articles' },
                { name: 'Events', href: '/events' },
                { name: 'Portfolio', href: '/portfolio' }
              ].map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href} 
                    className="text-[#3E5879] hover:text-[#213555] transition-colors duration-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Column */}
          <div>
            <h3 className="text-xl font-semibold mb-6 text-[#213555]">Services</h3>
            <ul className="space-y-3">
              {[
                { name: 'AI Consulting', href: '/services/consulting' },
                { name: 'Machine Learning', href: '/services/ml' },
                { name: 'Data Analysis', href: '/services/data-analysis' },
                { name: 'AI Solutions', href: '/services/solutions' }
              ].map((service) => (
                <li key={service.name}>
                  <Link 
                    href={service.href} 
                    className="text-[#3E5879] hover:text-[#213555] transition-colors duration-300"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h3 className="text-xl font-semibold mb-6 text-[#213555]">Contact Us</h3>
            <div className="space-y-3 text-[#3E5879]">
              <p>Sunderland, UK</p>
              <p>Support Email: support@ai-solution.com</p>
              <p>Sales Email: sales@ai-solution.com</p>
              <p>Phone:  +44 (0) 1234 567890</p>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-12 pt-6 border-t border-[#3E5879] text-center">
          <p className="text-sm text-[#213555]">
            © {new Date().getFullYear()} AI Solution. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
