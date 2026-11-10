import React from 'react';
import SectionHeader from './common/SectionHeader';
import PhotoDuotone from './common/PhotoDuotone';
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
    <section id="blog" className="kb-blog-section">
      <div className="container">
        <SectionHeader
          eyebrow="TECHNICAL LEADERSHIP"
          title="Engineering Insights"
          lead="Technical leadership and tactical advice for modern digital systems, architecture and operational frameworks."
          center={true}
        />

        <div className="kb-blog-grid">
          {blogPosts.map((post, index) => (
            <article key={index} className="kb-blog-card">
              <div className="kb-blog-image-wrapper">
                <PhotoDuotone
                  src={post.image}
                  alt={post.title}
                  aspectRatio="16/9"
                />
                <div className="kb-blog-tag-wrap">
                  <span className="kb-blog-category-tag">{post.category}</span>
                </div>
              </div>

              <div className="kb-blog-body">
                <div className="kb-blog-meta">
                  <span>{post.date}</span>
                  <span className="kb-blog-dot" />
                  <span>{post.readTime}</span>
                </div>
                <h3 className="kb-blog-title">{post.title}</h3>
                <p className="kb-blog-desc">{post.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Blog;
