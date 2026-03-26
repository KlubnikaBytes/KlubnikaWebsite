import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/logo.png';
import './Navbar.css';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [user, setUser] = useState(null);
    const location = useLocation();
    const menuRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);

        const storedUser = localStorage.getItem('user');
        if (storedUser && storedUser !== 'undefined') {
            try { setUser(JSON.parse(storedUser)); }
            catch { localStorage.removeItem('user'); }
        }

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close menu on route change
    useEffect(() => { setMenuOpen(false); }, [location]);

    // Close menu on outside click
    useEffect(() => {
        const handleClick = (e) => {
            if (menuOpen && menuRef.current && !menuRef.current.contains(e.target)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, [menuOpen]);

    // Prevent body scroll when menu open
    useEffect(() => {
        document.body.style.overflow = menuOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [menuOpen]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        window.location.reload();
    };

    const navLinks = [
        { label: 'Home', href: '/', isLink: true },
        { label: 'About Us', href: '/#about', isLink: false },
        { label: 'Services', href: '/#services', isLink: false },
        { label: 'Blog', href: '/#blog', isLink: false },
        { label: 'Contact', href: '/contact', isLink: true },
        { label: 'Careers', href: '/careers', isLink: true },
    ];

    return (
        <nav className={`navbar ${scrolled ? 'scrolled' : ''}`} ref={menuRef}>
            <div className="container navbar-container">
                {/* Brand */}
                <Link to="/" className="navbar-brand" onClick={() => setMenuOpen(false)}>
                    <img src={logo} alt="Klubnika Bytes" className="brand-icon" />
                    Klubnika Bytes
                </Link>

                {/* Desktop Links */}
                <div className="navbar-links desktop-links">
                    {navLinks.map(link =>
                        link.isLink
                            ? <Link key={link.label} to={link.href}>{link.label}</Link>
                            : <a key={link.label} href={link.href}>{link.label}</a>
                    )}

                    {user ? (
                        <div className="navbar-user">
                            <div className="user-profile-wrapper">
                                <div className="user-profile-trigger">
                                    <div className="user-avatar">{user.name.charAt(0).toUpperCase()}</div>
                                    <span className="user-name">{user.name.split(' ')[0]}</span>
                                    <svg className="dropdown-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="6 9 12 15 18 9"></polyline>
                                    </svg>
                                </div>
                                <div className="dropdown-menu">
                                    <button onClick={handleLogout} className="dropdown-item logout-action">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                                            <polyline points="16 17 21 12 16 7"></polyline>
                                            <line x1="21" y1="12" x2="9" y2="12"></line>
                                        </svg>
                                        Logout
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="navbar-auth">
                            <Link to="/login" className="login-btn">Login</Link>
                            <Link to="/signup" className="signup-btn">Sign Up</Link>
                        </div>
                    )}
                </div>

                {/* Hamburger Button */}
                <button
                    className={`hamburger ${menuOpen ? 'open' : ''}`}
                    onClick={() => setMenuOpen(prev => !prev)}
                    aria-label="Toggle navigation menu"
                    aria-expanded={menuOpen}
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </div>

            {/* Mobile Menu */}
            <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
                <div className="mobile-menu-inner">
                    <div className="mobile-nav-links">
                        {navLinks.map(link =>
                            link.isLink
                                ? <Link key={link.label} to={link.href} className="mobile-nav-link" onClick={() => setMenuOpen(false)}>{link.label}</Link>
                                : <a key={link.label} href={link.href} className="mobile-nav-link" onClick={() => setMenuOpen(false)}>{link.label}</a>
                        )}
                    </div>

                    <div className="mobile-menu-footer">
                        {user ? (
                            <div className="mobile-user-section">
                                <div className="mobile-user-info">
                                    <div className="user-avatar large">{user.name.charAt(0).toUpperCase()}</div>
                                    <div>
                                        <p className="mobile-user-name">{user.name}</p>
                                        <p className="mobile-user-email">{user.email}</p>
                                    </div>
                                </div>
                                <button onClick={handleLogout} className="mobile-logout-btn">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                                        <polyline points="16 17 21 12 16 7"></polyline>
                                        <line x1="21" y1="12" x2="9" y2="12"></line>
                                    </svg>
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="mobile-auth-btns">
                                <Link to="/login" className="mobile-login-btn" onClick={() => setMenuOpen(false)}>Login</Link>
                                <Link to="/signup" className="mobile-signup-btn" onClick={() => setMenuOpen(false)}>Sign Up</Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Overlay */}
            {menuOpen && <div className="menu-overlay" onClick={() => setMenuOpen(false)} />}
        </nav>
    );
};

export default Navbar;
