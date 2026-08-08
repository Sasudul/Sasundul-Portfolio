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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');

    try {
      const response = await fetch("https://formsubmit.co/ajax/sasuduln@gmail.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
          _subject: `New Portfolio Inquiry from ${formData.name}`
        })
      });

      if (response.ok) {
        setStatus('success');
        setTimeout(handleClose, 3000);
      } else {
        setStatus('idle');
        alert("Could not send message automatically. Please email sasuduln@gmail.com directly.");
      }
    } catch (error) {
      console.error("Contact Form Error:", error);
      setStatus('idle');
      alert("Could not send message automatically. Please email sasuduln@gmail.com directly.");
    }
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
        className="relative w-full max-w-2xl bg-[#0a0a0a] border border-white/15 rounded-3xl p-8 md:p-12 shadow-2xl z-10"
      >
        <button
          onClick={handleClose}
          className="absolute top-6 right-6 text-white/50 hover:text-white p-2 bg-white/5 hover:bg-white/10 rounded-full transition-all hover:rotate-90 form-element cursor-pointer"
        >
          <X size={24} />
        </button>

        <div className="mb-10 form-element">
          <div className="text-white/60 text-xs font-mono uppercase font-bold tracking-widest mb-4 flex items-center gap-3">
            <span className="w-8 h-[1.5px] bg-white/40"></span>
            Get In Touch
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-bold uppercase tracking-tighter text-white">Let's start a <span className="text-white/60">project</span></h2>
        </div>

        {status === 'success' ? (
          <div className="py-16 text-center form-element">
            <div className="w-20 h-20 bg-[#25D366]/20 border border-[#25D366]/40 rounded-full flex items-center justify-center mx-auto mb-6 text-[#25D366]">
              <Send size={36} />
            </div>
            <h3 className="text-2xl font-display font-bold uppercase text-white mb-2">Message Sent Successfully!</h3>
            <p className="text-white/60 font-mono text-sm uppercase">Thank you! I will get back to your inbox shortly.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-element relative">
              <input
                type="text"
                required
                className="w-full bg-transparent border-b border-white/20 pb-4 pt-6 px-2 text-white placeholder-transparent focus:outline-none focus:border-white peer transition-colors font-sans"
                placeholder="Name"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
              />
              <label className="absolute left-2 top-6 text-white/40 text-xs font-mono uppercase font-bold tracking-widest peer-focus:-top-2 peer-focus:text-xs peer-focus:text-white transition-all peer-valid:-top-2 peer-valid:text-xs peer-valid:text-white/60 pointer-events-none">Your Name</label>
            </div>

            <div className="form-element relative">
              <input
                type="email"
                required
                className="w-full bg-transparent border-b border-white/20 pb-4 pt-6 px-2 text-white placeholder-transparent focus:outline-none focus:border-white peer transition-colors font-sans"
                placeholder="Email"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
              />
              <label className="absolute left-2 top-6 text-white/40 text-xs font-mono uppercase font-bold tracking-widest peer-focus:-top-2 peer-focus:text-xs peer-focus:text-white transition-all peer-valid:-top-2 peer-valid:text-xs peer-valid:text-white/60 pointer-events-none">Your Email Address</label>
            </div>

            <div className="form-element relative">
              <textarea
                required
                rows={4}
                className="w-full bg-transparent border-b border-white/20 pb-4 pt-6 px-2 text-white placeholder-transparent focus:outline-none focus:border-white peer transition-colors resize-none font-sans"
                placeholder="Message"
                value={formData.message}
                onChange={e => setFormData({ ...formData, message: e.target.value })}
              ></textarea>
              <label className="absolute left-2 top-6 text-white/40 text-xs font-mono uppercase font-bold tracking-widest peer-focus:-top-2 peer-focus:text-xs peer-focus:text-white transition-all peer-valid:-top-2 peer-valid:text-xs peer-valid:text-white/60 pointer-events-none">Project Details & Inquiry</label>
            </div>

            <div className="form-element pt-6">
              <button
                type="submit"
                disabled={status === 'submitting'}
                className="w-full py-5 bg-white text-black uppercase font-bold font-mono tracking-widest hover:bg-white/80 transition-all duration-300 flex items-center justify-center gap-4 group rounded-xl cursor-pointer"
              >
                {status === 'submitting' ? 'Sending Message...' : 'Send Message'}
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
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
);
