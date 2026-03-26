import React, { useState, useEffect } from 'react';
import './Testimonials.css';

const testimonialsData = [
    {
        quote: "Klubnika Bytes delivered a mission-critical system that handled our peak traffic without a single millisecond of latency. Their engineering standards are world-class.",
        author: "Marcus Thorne",
        role: "CTO, CloudScale Systems",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=crop&w=150&q=80"
    },
    {
        quote: "Their digital transformation strategy didn't just modernize our stack; it fundamentally optimized our operational overhead by 35% within the first quarter.",
        author: "Alena Kovic",
        role: "VP of Engineering, NexaCorp",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?fit=crop&w=150&q=80"
    },
    {
        quote: "Precision, transparency, and technical mastery. The team at Klubnika Bytes functions as a seamless extension of our own internal engineering unit.",
        author: "Julian Vance",
        role: "Head of Product, FinTech Global",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?fit=crop&w=150&q=80"
    }
];

const Testimonials = () => {
    const [current, setCurrent] = useState(0);

    // Auto-advance testimonials
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev === testimonialsData.length - 1 ? 0 : prev + 1));
        }, 8000);
        return () => clearInterval(timer);
    }, []);

    const setSlide = (index) => setCurrent(index);

    return (
        <section id="testimonials" className="testimonials-section-premium">
            <div className="testimonials-container">
                <header className="testimonials-header">
                    <span className="corp-tag">Success Stories</span>
                    <h2 className="testimonials-main-title">Trusted by <span>Industry Leaders</span></h2>
                </header>

                <div className="testimonial-stage">
                    {/* Large Quote Watermark for Design Depth */}
                    <div className="quote-watermark">“</div>

                    <div className="testimonial-window">
                        {testimonialsData.map((t, index) => (
                            <div
                                key={index}
                                className={`testimonial-slide ${index === current ? 'active' : ''}`}
                            >
                                <p className="testimonial-text">{t.quote}</p>

                                <div className="testimonial-author-block">
                                    <img src={t.image} alt={t.author} className="author-img" />
                                    <div className="author-details">
                                        <h4 className="author-name">{t.author}</h4>
                                        <p className="author-position">{t.role}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Navigation UI */}
                    <div className="testimonial-nav">
                        {testimonialsData.map((_, i) => (
                            <button
                                key={i}
                                className={`nav-dot ${i === current ? 'active' : ''}`}
                                onClick={() => setSlide(i)}
                                aria-label={`View testimonial ${i + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Testimonials;