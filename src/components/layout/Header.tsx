import React, { useState, useEffect } from 'react';
import { Rocket, Menu, X, Copy, ExternalLink, LogOut } from 'lucide-react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useDisconnect, useBalance } from 'wagmi';
import { formatEther } from 'viem';
import { toast } from 'sonner';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const { address, connector } = useAccount();
  const { disconnect } = useDisconnect();
  const { data: balance } = useBalance({ address });

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
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.profile-menu') && !target.closest('.profile-button')) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    setShowProfileMenu(false);
  };

  function truncateEthString(ethString: string, decimals = 4) {
    const [intPart, decimalPart = ''] = ethString.split('.');
    return `${intPart}.${decimalPart.slice(0, decimals).padEnd(decimals, '0')}`;
  }  

  const handleDisconnect = async () => {
    try {
      if (connector?.id === 'metaMask' && window.ethereum) {
        await window.ethereum.request({
          method: 'wallet_revokePermissions',
          params: [{ eth_accounts: {} }],
        });
      }
      disconnect();
      setShowProfileMenu(false);
      setMobileMenuOpen(false);
    } catch (error) {
      console.error('Error during disconnect:', error);
    }
  };

  const copyAddress = async () => {
    if (address) {
      await navigator.clipboard.writeText(address);
      toast.success('Address copied to clipboard!', {
        position: 'bottom-center',
        duration: 2000,
      });
    }
  };

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  const CustomConnectButton = () => (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        mounted,
      }) => {
        const ready = mounted;
        const connected = ready && account && chain;

        return (
          <div
            {...(!ready && {
              'aria-hidden': true,
              style: {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <button onClick={openConnectModal} className="button-primary">
                    Connect Wallet
                  </button>
                );
              }

              if (chain.unsupported) {
                return (
                  <button onClick={openChainModal} className="button-primary text-red-500">
                    Wrong network
                  </button>
                );
              }

              return (
                <div className="relative profile-menu">
                  <button
                    onClick={openAccountModal}
                    className="button-primary px-3 py-2 flex items-center space-x-2 profile-button"
                  >
                    <span>{truncateAddress(account.address)}</span>
                  </button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );

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
              <CustomConnectButton />
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
                onClick={() => {
                  toggleMobileMenu();
                  setShowProfileMenu(false);
                }}
              >
                {item}
              </a>
            ))}
            <div className="mt-6 w-full px-4 flex justify-center">
              <CustomConnectButton />
            </div>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Header;