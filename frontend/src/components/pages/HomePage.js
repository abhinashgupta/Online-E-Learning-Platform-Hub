import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import CourseCard from '../CourseCard'; 

const HomePage = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                setLoading(true);
                const { data } = await api.get('/courses');
                // Display only the first 6 courses on the homepage
                setCourses(data.slice(0, 6));
            } catch (err) {
                setError('Failed to load courses. Please try again later.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    return (
        <div className="bg-white">
            {/* Hero Section */}
            <section className="bg-indigo-700 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">Unlock Your Potential</h1>
                    <p className="mt-4 text-lg md:text-xl text-indigo-200 max-w-2xl mx-auto">
                        Join thousands of learners on EduHub and gain new skills with our flexible, expert-led online courses.
                    </p>
                    <div className="mt-8">
                        <Link
                            to="/courses"
                            className="inline-block bg-white text-indigo-600 hover:bg-indigo-50 font-bold py-3 px-8 rounded-lg text-lg transition-transform transform hover:scale-105"
                        >
                            Explore Courses
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h2 className="text-3xl font-extrabold text-gray-900">Why Choose EduHub?</h2>
                        <p className="mt-4 text-lg text-gray-600">A better way to learn, designed for your success.</p>
                    </div>
                    <div className="mt-12 grid gap-10 md:grid-cols-3">
                        <div className="text-center">
                            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-600 text-white mx-auto">
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                            </div>
                            <h3 className="mt-5 text-lg font-medium text-gray-900">Expert Instructors</h3>
                            <p className="mt-2 text-base text-gray-600">Learn from industry professionals who are passionate about teaching.</p>
                        </div>
                        <div className="text-center">
                            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-600 text-white mx-auto">
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                            <h3 className="mt-5 text-lg font-medium text-gray-900">Flexible Learning</h3>
                            <p className="mt-2 text-base text-gray-600">Learn at your own pace, anytime, anywhere. Fit learning into your life.</p>
                        </div>
                        <div className="text-center">
                             <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-600 text-white mx-auto">
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                            <h3 className="mt-5 text-lg font-medium text-gray-900">Career-Oriented</h3>
                            <p className="mt-2 text-base text-gray-600">Gain practical, in-demand skills that will help you achieve your career goals.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Courses Section */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h2 className="text-3xl font-extrabold text-gray-900">Featured Courses</h2>
                        <p className="mt-4 text-lg text-gray-600">Start learning from our most popular courses.</p>
                    </div>
                    <div className="mt-12">
                        {loading ? (
                            <p className="text-center">Loading courses...</p>
                        ) : error ? (
                            <p className="text-center text-red-500">{error}</p>
                        ) : (
                            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                                {courses.map(course => (
                                    <CourseCard key={course._id} course={course} />
                                ))}
                            </div>
                        )}
                    </div>
                     <div className="mt-12 text-center">
                        <Link
                            to="/courses"
                            className="inline-block bg-indigo-100 text-indigo-700 hover:bg-indigo-200 font-semibold py-3 px-6 rounded-lg text-lg"
                        >
                            View All Courses
                        </Link>
                    </div>
                </div>
            </section>
            
            {/* Final CTA Section */}
            <section className="bg-gray-800">
                <div className="max-w-3xl mx-auto text-center py-16 px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-extrabold text-white">Ready to Dive In?</h2>
                    <p className="mt-4 text-lg text-gray-300">Create your account and start learning today. The first step to your new career is just a click away.</p>
                    <Link
                        to="/register"
                        className="mt-8 w-full inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-indigo-600 bg-white hover:bg-gray-50 sm:w-auto"
                    >
                        Sign Up for Free
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default HomePage;