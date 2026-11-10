import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import { coreVerticals } from '../data/expertise';
import './Navbar.css';

const Navbar = ({ onOpenTechStack }) => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const location = useLocation();
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const userMenuRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll);

    const storedUser = localStorage.getItem('user');
    if (storedUser && storedUser !== 'undefined') {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem('user');
      }
    }

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu & user dropdown on route change
  useEffect(() => {
    setMenuOpen(false);
    setUserDropdownOpen(false);
  }, [location]);

  // Scroll Spy for Home page section links (#about, #expertise, #presence, #blog)
  useEffect(() => {
    if (location.pathname !== '/') {
      setActiveSection(location.pathname);
      return;
    }

    const sectionIds = ['blog', 'presence', 'expertise', 'about'];

    const handleScrollSpy = () => {
      // If at very top, highlight home
      if (window.scrollY < 180) {
        setActiveSection('home');
        return;
      }

      const navbarOffset = 110;
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= navbarOffset && rect.bottom > navbarOffset) {
            setActiveSection(id);
            return;
          }
        }
      }
    };

    if (location.hash) {
      setActiveSection(location.hash.replace('#', ''));
    } else if (window.scrollY < 180) {
      setActiveSection('home');
    }

    window.addEventListener('scroll', handleScrollSpy, { passive: true });
    return () => window.removeEventListener('scroll', handleScrollSpy);
  }, [location.pathname, location.hash]);

  // Close menus on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (menuOpen && menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
      if (userDropdownOpen && userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [menuOpen, userDropdownOpen]);

  // Lock body scroll and set menu open class
  useEffect(() => {
    if (menuOpen) {
      document.body.classList.add('kb-menu-open');
      document.body.style.overflow = 'hidden';
    } else {
      document.body.classList.remove('kb-menu-open');
      document.body.style.overflow = '';
    }
    return () => {
      document.body.classList.remove('kb-menu-open');
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const handleLogout = (e) => {
    if (e) {
      if (e.preventDefault) e.preventDefault();
      if (e.stopPropagation) e.stopPropagation();
    }
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    setUser(null);
    setUserDropdownOpen(false);
    window.location.href = '/';
  };

  const navLinks = [
    { label: 'Home', href: '/', isLink: true },
    { label: 'About Us', href: '/#about', isLink: false },
    { label: 'Expertise', href: '/#expertise', isLink: false },
    { label: 'Presence', href: '/#presence', isLink: false },
    { label: 'Blog', href: '/#blog', isLink: false },
    { label: 'Contact', href: '/contact', isLink: true },
    { label: 'Careers', href: '/careers', isLink: true },
  ];

  const handleLinkClick = (e, link) => {
    setMenuOpen(false);

    if (link.href.startsWith('/#')) {
      e.preventDefault();
      const targetId = link.href.replace('/#', '');

      if (location.pathname === '/') {
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          setActiveSection(targetId);
          window.history.replaceState(null, '', `/#${targetId}`);
        }
      } else {
        // From outside homepage (e.g. /contact, /careers): navigate to homepage with hash
        navigate(`/#${targetId}`);
      }
    } else if (link.href === '/') {
      e.preventDefault();
      if (location.pathname === '/') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setActiveSection('home');
        window.history.replaceState(null, '', '/');
      } else {
        navigate('/');
      }
    } else if (link.isLink) {
      e.preventDefault();
      navigate(link.href);
    }
  };

  const isLinkActive = (link) => {
    if (location.pathname === '/') {
      if (link.href === '/') return activeSection === 'home';
      if (link.href.startsWith('/#')) {
        const id = link.href.replace('/#', '');
        return activeSection === id;
      }
      return false;
    }
    return location.pathname === link.href;
  };

  return (
    <nav className={`kb-navbar ${scrolled ? 'scrolled' : ''}`} ref={menuRef}>
      <div className="container kb-nav-inner">
        {/* Brand with natural, un-squished logo */}
        <Link to="/" className="kb-nav-brand" onClick={() => setMenuOpen(false)}>
          <img src={logo} alt="Klubnika Bytes" className="kb-nav-logo-img" />
          <span className="kb-nav-brand-name">Klubnika Bytes</span>
        </Link>

        {/* Desktop Links */}
        <div className="kb-nav-desktop-menu">
          <div className="kb-nav-links">
            {navLinks.map((link) => {
              const active = isLinkActive(link);

              if (link.label === 'Expertise') {
                return (
                  <div key={link.label} className="kb-nav-dropdown-wrap">
                    <a
                      href={link.href}
                      onClick={(e) => handleLinkClick(e, link)}
                      className={`kb-nav-link kb-nav-dropdown-trigger ${active ? 'active' : ''}`}
                    >
                      <span>{link.label}</span>
                      <svg className="kb-nav-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </a>
                    <div className="kb-nav-dropdown-menu">
                      <div className="kb-dropdown-header">CORE BUSINESS VERTICALS</div>
                      <div className="kb-dropdown-items">
                        {coreVerticals.map((vert) => (
                          <Link
                            key={vert.id}
                            to={`/expertise/${vert.slug}`}
                            className="kb-dropdown-item-link"
                            onClick={() => setMenuOpen(false)}
                          >
                            <span className="kb-dropdown-item-num">{vert.number}</span>
                            <div className="kb-dropdown-item-text">
                              <span className="kb-dropdown-item-title">{vert.title}</span>
                              <span className="kb-dropdown-item-desc">{vert.tagline}</span>
                            </div>
                          </Link>
                        ))}
                      </div>
                      <div className="kb-dropdown-footer">
                        <a
                          href="/#expertise"
                          className="kb-dropdown-all-btn"
                          onClick={(e) => handleLinkClick(e, { href: '/#expertise', label: 'Expertise' })}
                        >
                          View Capabilities Overview →
                        </a>
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link)}
                  className={`kb-nav-link ${active ? 'active' : ''}`}
                >
                  <span>{link.label}</span>
                </a>
              );
            })}
          </div>

          {/* Auth Area */}
          <div className="kb-nav-auth">
            {user ? (
              <div className="kb-user-profile-wrapper" ref={userMenuRef}>
                <button
                  type="button"
                  className={`kb-user-trigger ${userDropdownOpen ? 'active' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setUserDropdownOpen((prev) => !prev);
                  }}
                  aria-expanded={userDropdownOpen}
                  aria-haspopup="true"
                  aria-label="User profile options"
                >
                  <div className="kb-user-avatar">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="kb-user-name">
                    {user.name ? user.name.split(' ')[0] : 'Member'}
                  </span>
                  <svg
                    className={`kb-dropdown-arrow ${userDropdownOpen ? 'rotated' : ''}`}
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
                <div
                  className={`kb-user-dropdown ${userDropdownOpen ? 'open' : ''}`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="kb-dropdown-user-info">
                    <span className="kb-dropdown-user-name">{user.name || 'Member'}</span>
                    <span className="kb-dropdown-user-email">{user.email || ''}</span>
                  </div>
                  <button
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleLogout(e);
                    }}
                    onClick={handleLogout}
                    className="kb-dropdown-logout-btn"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                      <polyline points="16 17 21 12 16 7" />
                      <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="kb-auth-actions">
                <Link to="/login" className="kb-btn-login">
                  Login
                </Link>
                <Link to="/signup" className="kb-btn-signup">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Hamburger */}
        <button
          className={`kb-hamburger ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      <div className={`kb-mobile-menu ${menuOpen ? 'open' : ''}`}>
        <div className="kb-mobile-menu-inner">
          <div className="kb-mobile-links">
            {navLinks.map((link) => {
              const active = isLinkActive(link);
              return (
                <a
                  key={link.label}
                  href={link.href}
                  className={`kb-mobile-link ${active ? 'active' : ''}`}
                  onClick={(e) => handleLinkClick(e, link)}
                >
                  {link.label}
                </a>
              );
            })}
          </div>

          <div className="kb-mobile-auth-footer">
            {user ? (
              <div className="kb-mobile-user">
                <div className="kb-mobile-user-details">
                  <div className="kb-user-avatar large">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div>
                    <div className="kb-mobile-user-name">{user.name}</div>
                    <div className="kb-mobile-user-email">{user.email}</div>
                  </div>
                </div>
                <button onClick={handleLogout} className="kb-mobile-logout-btn">
                  Logout
                </button>
              </div>
            ) : (
              <div className="kb-mobile-auth-buttons">
                <Link
                  to="/login"
                  className="kb-mobile-login-btn"
                  onClick={() => setMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="kb-mobile-signup-btn"
                  onClick={() => setMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Backdrop Overlay */}
      {menuOpen && <div className="kb-menu-overlay" onClick={() => setMenuOpen(false)} />}
    </nav>
  );
};

export default Navbar;
