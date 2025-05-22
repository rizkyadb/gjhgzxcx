import React, { useState, useEffect } from 'react';
import { Rocket, Menu, X } from 'lucide-react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { address } = useAccount();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [mobileMenuOpen]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ${
          isScrolled ? 'bg-black/80 backdrop-blur-md py-3' : 'bg-transparent py-5'
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Rocket className="h-8 w-8 text-cyan-glow mr-2" />
              <span className="font-orbitron text-xl font-bold text-white">
                <span className="text-cyan-glow">$</span>CIGAR
              </span>
            </div>

            <nav className="hidden md:flex items-center space-x-8">
              {['Mission', 'Story', 'Technology', 'Community', 'Join'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="font-exo text-gray-300 hover:text-cyan-glow transition-colors relative group"
                >
                  {item}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-cyan-glow group-hover:w-full transition-all duration-300"></span>
                </a>
              ))}
            </nav>

            <div className="hidden md:block">
              <ConnectButton />
            </div>

            <button
              className="md:hidden text-white"
              onClick={toggleMobileMenu}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6 text-cyan-glow" />
              ) : (
                <Menu className="h-6 w-6 text-cyan-glow" />
              )}
            </button>
          </div>
        </div>
      </header>

      <div
        className={`fixed top-0 left-0 w-full h-full bg-black backdrop-blur-md z-50 transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        } md:hidden`}
      >
        <div className="flex flex-col min-h-screen">
          <div className="flex justify-end p-4">
            <button
              onClick={toggleMobileMenu} 
              className="text-cyan-glow hover:text-cyan-glow/80 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <nav className="flex flex-col items-center flex-grow overflow-hidden">
            {['Mission', 'Story', 'Technology', 'Community', 'Join'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="font-exo text-xl text-gray-300 hover:text-cyan-glow transition-colors py-4"
                onClick={toggleMobileMenu}
              >
                {item}
              </a>
            ))}
            <div className="mt-6 w-full px-4 flex justify-center">
              <ConnectButton />
            </div>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Header;