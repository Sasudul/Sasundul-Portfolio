import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import QRCode from 'react-qr-code';
export default function CvModal() {
  const [isOpen, setIsOpen] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      gsap.to(overlayRef.current, { opacity: 1, duration: 0.4, ease: 'power2.out', display: 'flex' });
      gsap.fromTo(contentRef.current, 
        { y: 50, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.5)', delay: 0.1 }
      );
    } else {
      gsap.to(contentRef.current, { y: 20, opacity: 0, scale: 0.95, duration: 0.3, ease: 'power2.in' });
      gsap.to(overlayRef.current, { opacity: 0, duration: 0.4, ease: 'power2.in', onComplete: () => {
        if (overlayRef.current) overlayRef.current.style.display = 'none';
      } });
    }
  }, [isOpen]);

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 left-8 z-30 px-6 py-3 bg-white text-black font-mono text-sm tracking-widest uppercase rounded-full shadow-2xl hover:scale-105 transition-transform cursor-pointer"
      >
        Get CV
      </button>

      {/* Modal Overlay */}
      <div 
        ref={overlayRef}
        className="fixed inset-0 z-50 hidden items-center justify-center bg-black/60 backdrop-blur-md"
        onClick={() => setIsOpen(false)}
      >
        <div 
          ref={contentRef}
          className="relative flex flex-col items-center gap-8 p-10 bg-[#0d0d0d] border border-white/10 rounded-3xl shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button 
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
          >
            ✕
          </button>

          <h3 className="text-xl font-medium tracking-widest text-white">SCAN FOR CV</h3>

          <div className="flex flex-col md:flex-row gap-8 items-center">
            {/* QR Code */}
            <div className="flex flex-col items-center gap-3">
              <span className="text-xs tracking-widest uppercase opacity-60 font-mono text-white">QR Code</span>
              <div className="p-4 bg-white rounded-xl shadow-inner">
                <QRCode value="https://tinyurl.com/3c4vevb9" size={160} />
              </div>
            </div>

            {/* Direct Download Button */}
            <div className="flex flex-col items-center justify-center gap-3 w-48">
              <span className="text-xs tracking-widest uppercase opacity-60 font-mono text-white text-center">or Download directly</span>
              <a 
                href="https://www.dropbox.com/scl/fi/qn0un34g4gtqh03ip6aqo/Sasundul_Wanasinghe_Outcome_Based_CV.pdf?rlkey=lydcz8ke4k2rhxzdl742e3gfk&st=va4vb2xi&dl=1"
                className="w-full py-4 bg-white/10 hover:bg-white text-white hover:text-black transition-colors rounded-xl font-mono text-sm tracking-widest uppercase flex items-center justify-center gap-2 border border-white/20 hover:border-transparent"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download PDF
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
