import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="relative mt-auto bg-slate-950 overflow-hidden pt-32">
      {/* Cinematic ambient glow */}
      <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[180px] pointer-events-none opacity-30"></div>
      
      <div className="container mx-auto px-6 py-24 relative z-10 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 lg:gap-12">
          {/* Brand Column */}
          <div className="flex flex-col gap-8">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-500">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-7 h-7">
                    <path d="M3 9.5L12 4L21 9.5" stroke="url(#logo_grad_footer)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M19 13V19.4C19 19.7314 18.7314 20 18.4 20H5.6C5.26863 20 5 19.7314 5 19.4V13" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    <defs>
                        <linearGradient id="logo_grad_footer" x1="3" y1="4" x2="21" y2="20" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#7C3AED" />
                        <stop offset="1" stopColor="#38BDF8" />
                        </linearGradient>
                    </defs>
                </svg>
              </div>
              <span className="text-3xl font-black tracking-tighter text-white uppercase">Rent<span className="text-primary italic">Wise</span></span>
            </Link>
            <p className="text-slate-400 text-base leading-relaxed font-medium">
              Architectural Rental Intelligence. Connecting the city's most prestigious properties with elite residents through the RentWise Design Language.
            </p>
            <div className="flex gap-4 mt-2">
              {[
                { name: 'twitter', icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> },
                { name: 'instagram', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg> },
                { name: 'linkedin', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg> }
              ].map(social => (
                <button key={social.name} className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-primary/20 hover:border-primary/20 transition-all duration-500 active:scale-90 shadow-sm" aria-label={social.name}>
                  {social.icon}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-8">
            <h4 className="text-xs font-black uppercase tracking-[0.3em] text-white">Ecosystem</h4>
            <nav className="flex flex-col gap-4">
              {[
                { name: 'Explore Portfolio', path: '/' },
                { name: 'RentWise Journey', path: '/how-it-works' },
                { name: 'Residency Insurance', path: '/' },
                { name: 'Portfolio Management', path: '/' }
              ].map(item => (
                <Link key={item.name} to={item.path} className="text-slate-400 text-base font-medium hover:text-primary transition-colors hover:translate-x-2 duration-500 transform inline-block">
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Support */}
          <div className="flex flex-col gap-8">
            <h4 className="text-xs font-black uppercase tracking-[0.3em] text-white">Concierge</h4>
            <nav className="flex flex-col gap-4">
              {['Resident Support', 'Safety Protocols', 'Lease Termination', 'Maintenance Portal'].map(item => (
                <Link key={item} to="/" className="text-slate-400 text-base font-medium hover:text-primary transition-colors hover:translate-x-2 duration-500 transform inline-block">
                  {item}
                </Link>
              ))}
            </nav>
          </div>

          {/* Newsletter */}
          <div className="flex flex-col gap-8">
            <h4 className="text-xs font-black uppercase tracking-[0.3em] text-white">Intelligence</h4>
            <p className="text-slate-400 text-base font-medium">Subscribe to market insights and portfolio updates.</p>
            <div className="flex flex-col gap-3">
              <input 
                type="email" 
                placeholder="Intelligence@rentwise.com"
                className="bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-sm text-white w-full outline-none focus:border-primary focus:bg-white/10 transition-all duration-500"
              />
              <button className="bg-white text-slate-950 font-black uppercase tracking-[0.2em] text-[10px] py-5 rounded-2xl transition-all hover:bg-primary hover:text-white active:scale-95 shadow-2xl">
                Activate Subscription
              </button>
            </div>
          </div>
        </div>

        <div className="mt-32 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 pb-12">
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em]">
            © 2026 RentWise Platform. All architectural rights reserved.
          </p>
          <div className="flex gap-10">
            {['Privacy Protocol', 'Service Terms', 'Intelligence Settings'].map(item => (
              <Link key={item} to="/" className="text-slate-600 text-[10px] font-black uppercase tracking-[0.3em] hover:text-white transition-colors duration-500">
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
