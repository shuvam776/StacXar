import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { fetchVideos } from '../api/videoApi';
import type { Video } from '../api/videoApi';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
    const [videos, setVideos] = useState<Video[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Replace this with your actual Cloudinary 3D video URL
    const FALLBACK_VIDEO_URL = "https://res.cloudinary.com/demo/video/upload/v1687430064/samples/cld-sample-video.mp4";

    useEffect(() => {
        fetchVideos().then(vids => {
            if (vids.length === 0) {
                // Return a dummy video object if no videos are found
                setVideos([{
                    _id: 'fallback',
                    url: FALLBACK_VIDEO_URL,
                    title: 'Welcome to StacXar',
                    public_id: 'fallback_video'
                } as Video]);
            } else {
                setVideos(vids);
            }
            setLoading(false);
        });
    }, []);

    if (loading) return (
        <div style={{ background: '#0a0a0a', color: '#fff', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'sans-serif' }}>
            <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                Loading Experience...
            </motion.div>
        </div>
    );

    return (
        <div style={{
            background: '#0a0a0a',
            height: '100vh',
            overflowY: 'scroll',
            scrollSnapType: 'y mandatory',
            overflowX: 'hidden'
        }}>
            <nav style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                padding: '24px 40px',
                display: 'flex',
                justifyContent: 'space-between',
                zIndex: 50,
                mixBlendMode: 'difference',
                color: 'white',
                boxSizing: 'border-box'
            }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-1px' }}>StacXar</div>
                <button
                    onClick={() => navigate('/login')}
                    style={{
                        background: 'white',
                        color: 'black',
                        border: 'none',
                        padding: '10px 24px',
                        borderRadius: '100px',
                        cursor: 'pointer',
                        fontWeight: 600,
                        fontSize: '0.9rem'
                    }}
                >
                    Get Started
                </button>
            </nav>

            {videos.length === 0 ? (
                <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: 'white', background: '#0a0a0a' }}>
                    <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>No Content Yet</h2>
                    <p style={{ color: '#888' }}>Upload a video from the backend to activate the showcase.</p>
                </div>
            ) : (
                videos.map((video, index) => (
                    <VideoSection key={video._id} video={video} index={index} />
                ))
            )}

            <footer style={{
                position: 'fixed',
                bottom: 20,
                width: '100%',
                textAlign: 'center',
                color: 'rgba(255,255,255,0.4)',
                fontSize: '0.8rem',
                zIndex: 40,
                pointerEvents: 'none'
            }}>
                © 2026 StacXar. Redefining Visuals.
            </footer>
        </div>
    );
};

const VideoSection = ({ video, index }: { video: Video, index: number }) => {
    return (
        <motion.section
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: false, margin: "-10%" }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            style={{
                height: '100vh',
                width: '100vw',
                position: 'relative',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                overflow: 'hidden',
                scrollSnapAlign: 'start'
            }}
        >
            <video
                src={video.url}
                autoPlay
                loop
                muted
                playsInline
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    filter: 'brightness(0.6)'
                }}
            />
            <div style={{
                position: 'relative',
                zIndex: 10,
                textAlign: 'center',
                color: 'white',
                maxWidth: '80%'
            }}>
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 1, ease: [0.22, 1, 0.36, 1] }}
                >
                    <h2 style={{
                        fontSize: 'clamp(3rem, 8vw, 6rem)',
                        lineHeight: 1,
                        marginBottom: '1rem',
                        fontWeight: 800,
                        letterSpacing: '-0.02em'
                    }}>
                        {video.title || `Vision ${index + 1}`}
                    </h2>
                    <p style={{
                        fontSize: 'clamp(1rem, 2vw, 1.5rem)',
                        color: 'rgba(255,255,255,0.8)',
                        maxWidth: '600px',
                        margin: '0 auto'
                    }}>
                        Experience the motion. Deep dive into the visual spectrum.
                    </p>
                </motion.div>
            </div>
        </motion.section>
    );
};

export default Home;
