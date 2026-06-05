import React, { useState, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { X, Send } from 'lucide-react';

export default function ContactForm({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const overlayRef = useRef<HTMLDivElement>(null);
  const formContainerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline();
    tl.to(overlayRef.current, {
      opacity: 1,
      duration: 0.5,
      ease: 'power2.out'
    }).from('.form-element', {
      y: 30,
      opacity: 0,
      stagger: 0.1,
      duration: 0.6,
      ease: 'power3.out'
    }, "-=0.3");
  }, []);

  const handleClose = () => {
    gsap.to(overlayRef.current, {
      opacity: 0,
      duration: 0.4,
      ease: 'power2.in',
      onComplete: onClose
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    // Mock API call
    setTimeout(() => {
      setStatus('success');
      setTimeout(handleClose, 2000);
    }, 1500);
  };

  return (
    <div 
      ref={overlayRef} 
      className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 backdrop-blur-md opacity-0"
    >
      <div 
        className="absolute inset-0 cursor-pointer"
        onClick={handleClose}
      ></div>
      
      <div 
        ref={formContainerRef}
        className="relative w-full max-w-2xl bg-[#111] border border-white/10 rounded-3xl p-8 md:p-12 shadow-[0_0_80px_rgba(168,144,255,0.15)] z-10"
      >
        <button 
          onClick={handleClose}
          className="absolute top-6 right-6 text-white/50 hover:text-white p-2 bg-white/5 hover:bg-white/10 rounded-full transition-all hover:rotate-90 form-element"
        >
          <X size={24} />
        </button>

        <div className="mb-10 form-element">
          <div className="text-[#a890ff] text-xs uppercase font-bold tracking-widest mb-4 flex items-center gap-3">
            <span className="w-8 h-[2px] bg-[#a890ff]"></span>
            Get In Touch
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-bold uppercase tracking-tighter text-white">Let's start a <span className="text-outline">project</span></h2>
        </div>

        {status === 'success' ? (
          <div className="py-20 text-center form-element">
            <div className="w-20 h-20 bg-[#25D366]/20 rounded-full flex items-center justify-center mx-auto mb-6 text-[#25D366]">
              <Send size={40} />
            </div>
            <h3 className="text-2xl font-display font-bold uppercase text-white mb-2">Message Sent</h3>
            <p className="text-gray-400 font-mono text-sm uppercase">I will get back to you shortly.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-element relative">
              <input 
                type="text" 
                required
                className="w-full bg-transparent border-b border-white/20 pb-4 pt-6 px-2 text-white placeholder-transparent focus:outline-none focus:border-[#a890ff] peer transition-colors"
                placeholder="Name"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
              <label className="absolute left-2 top-6 text-gray-500 text-sm uppercase font-bold tracking-widest peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#a890ff] transition-all peer-valid:-top-2 peer-valid:text-xs peer-valid:text-gray-400 pointer-events-none">Your Name</label>
            </div>

            <div className="form-element relative">
              <input 
                type="email" 
                required
                className="w-full bg-transparent border-b border-white/20 pb-4 pt-6 px-2 text-white placeholder-transparent focus:outline-none focus:border-[#a890ff] peer transition-colors"
                placeholder="Email"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
              />
              <label className="absolute left-2 top-6 text-gray-500 text-sm uppercase font-bold tracking-widest peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#a890ff] transition-all peer-valid:-top-2 peer-valid:text-xs peer-valid:text-gray-400 pointer-events-none">Your Email</label>
            </div>

            <div className="form-element relative">
              <textarea 
                required
                rows={4}
                className="w-full bg-transparent border-b border-white/20 pb-4 pt-6 px-2 text-white placeholder-transparent focus:outline-none focus:border-[#a890ff] peer transition-colors resize-none"
                placeholder="Message"
                value={formData.message}
                onChange={e => setFormData({...formData, message: e.target.value})}
              ></textarea>
              <label className="absolute left-2 top-6 text-gray-500 text-sm uppercase font-bold tracking-widest peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#a890ff] transition-all peer-valid:-top-2 peer-valid:text-xs peer-valid:text-gray-400 pointer-events-none">Project Details</label>
            </div>

            <div className="form-element pt-6">
              <button 
                type="submit" 
                disabled={status === 'submitting'}
                className="w-full py-6 bg-[#f1f1f1] text-black uppercase font-bold tracking-widest hover:bg-[#a890ff] hover:text-white transition-colors duration-300 flex items-center justify-center gap-4 group"
              >
                {status === 'submitting' ? 'Sending...' : 'Send Message'}
                <ArrowUpRight className="group-hover:rotate-45 transition-transform" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

const ArrowUpRight = ({ className = "" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
);
