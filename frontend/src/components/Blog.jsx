import React from 'react';
import './Blog.css';

const blogPosts = [
    {
        category: 'Architecture',
        readTime: '8 min read',
        image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800',
        title: 'Scalable Microservices: Beyond the Basics',
        description: 'An analysis of distributed systems, service mesh integration, and maintaining consistency in high-concurrency environments.',
        date: 'March 14, 2026',
        link: '#'
    },
    {
        category: 'Security',
        readTime: '12 min read',
        image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800',
        title: 'The Zero-Trust Paradigm Shift',
        description: 'Strategies for transitioning enterprise infrastructure to identity-centric security models without disrupting operational workflows.',
        date: 'March 10, 2026',
        link: '#'
    },
    {
        category: 'Innovation',
        readTime: '6 min read',
        image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800',
        title: 'Predictive Analytics in Global Logistics',
        description: 'How machine learning models are optimizing supply chain transparency and reducing operational latency.',
        date: 'March 05, 2026',
        link: '#'
    }
];

const Blog = () => {
    return (
        <section id="blog" className="blog-section-v2">
            <div className="blog-container">
                <header className="blog-header-v2">
                    <span className="accent-line"></span>
                    <h2 className="blog-title-v2">Engineering <span>Insights</span></h2>
                    <p className="blog-desc-v2">Technical leadership and tactical advice for the modern stack.</p>
                </header>

                <div className="blog-grid-v2">
                    {blogPosts.map((post, index) => (
                        <article key={index} className="premium-card">
                            <div className="card-image-wrapper">
                                <img src={post.image} alt={post.title} className="card-img" />
                                <div className="card-overlay">
                                    <span className="glass-tag">{post.category}</span>
                                </div>
                            </div>

                            <div className="card-body-v2">
                                <div className="card-meta-v2">
                                    <span>{post.date}</span>
                                    <span className="dot"></span>
                                    <span>{post.readTime}</span>
                                </div>
                                <h3 className="card-title-v2">{post.title}</h3>
                                <p className="card-text-v2">{post.description}</p>

                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Blog;