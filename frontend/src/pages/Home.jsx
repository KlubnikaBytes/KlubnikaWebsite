import React from 'react';
import Hero from '../components/Hero';
import AboutHome from '../components/AboutHome';
import Services from '../components/Services';
import Testimonials from '../components/Testimonials';
import Blog from '../components/Blog';

const Home = () => {
    return (
        <>
            <Hero />
            <AboutHome />
            <Services />
            <Testimonials />
            <Blog />
        </>
    );
};

export default Home;
