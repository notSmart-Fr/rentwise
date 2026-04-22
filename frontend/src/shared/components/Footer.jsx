import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="relative mt-auto border-t border-white/5 bg-bg-base overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>
      
      <div className="container mx-auto px-6 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand Column */}
          <div className="flex flex-col gap-6">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-linear-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
                <span className="text-white text-xl font-black">R</span>
              </div>
              <span className="text-2xl font-black tracking-tighter text-white">Rent<span className="text-primary italic">Wise</span></span>
            </Link>
            <p className="text-text-secondary text-sm leading-relaxed opacity-70">
              The smartest way to rent in the city. Connecting premium properties with verified tenants since 2024.
            </p>
            <div className="flex gap-4 mt-2">
              {[
                { name: 'twitter', icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> },
                { name: 'instagram', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg> },
                { name: 'linkedin', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg> }
              ].map(social => (
                <button key={social.name} className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-text-muted hover:text-white hover:bg-primary/20 hover:border-primary/20 transition-all active:scale-90 shadow-sm" aria-label={social.name}>
                  {social.icon}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-6">
            <h4 className="text-sm font-black uppercase tracking-[0.2em] text-white">Platform</h4>
            <nav className="flex flex-col gap-3">
              {['Explore Properties', 'How it Works', 'Rent Insurance', 'Verified Owners'].map(item => (
                <Link key={item} to="/" className="text-text-secondary text-sm hover:text-primary transition-colors hover:translate-x-1 duration-300 transform inline-block">
                  {item}
                </Link>
              ))}
            </nav>
          </div>

          {/* Support */}
          <div className="flex flex-col gap-6">
            <h4 className="text-sm font-black uppercase tracking-[0.2em] text-white">Support</h4>
            <nav className="flex flex-col gap-3">
              {['Help Center', 'Safety Information', 'Cancellation Options', 'Report a Fix'].map(item => (
                <Link key={item} to="/" className="text-text-secondary text-sm hover:text-primary transition-colors hover:translate-x-1 duration-300 transform inline-block">
                  {item}
                </Link>
              ))}
            </nav>
          </div>

          {/* Newsletter */}
          <div className="flex flex-col gap-6">
            <h4 className="text-sm font-black uppercase tracking-[0.2em] text-white">Stay Updated</h4>
            <p className="text-text-secondary text-sm opacity-70">Get the latest property alerts directly to your inbox.</p>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="email@example.com"
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white w-full outline-none focus:border-primary transition-colors"
              />
              <button className="bg-primary hover:bg-primary-hover text-white p-3 rounded-xl transition-all active:scale-95 shadow-lg shadow-primary/20">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-text-muted text-[10px] font-bold uppercase tracking-widest">
            © 2026 RentWise Technologies. All rights reserved.
          </p>
          <div className="flex gap-8">
            {['Privacy Policy', 'Terms of Service', 'Cookie Settings'].map(item => (
              <Link key={item} to="/" className="text-text-muted text-[10px] font-bold uppercase tracking-widest hover:text-white transition-colors">
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
