import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import p1 from 'public/images/collage.webp';
import { Card, CardContent, Typography, Grid, Button, Avatar } from '@mui/material';
import { findAllLandingPagePosts } from "./api/landingPage";
import { getUserFromSession } from "@/pages/api/user";

export async function getServerSideProps(ctx) {
    const user = await getUserFromSession(ctx);
    return {
        props: {
            user: user,
            landingPageEntries: await findAllLandingPagePosts()
        }
    };
}

function Post({ title, content, date }) {
    return (
        <Card style={{ marginBottom: '20px', backgroundColor: '#C8E6C9' }}>
            <CardContent>
                <Typography variant="h6">{title}</Typography>
                <Typography variant="body2">Date: {date}</Typography>
                <Typography variant="body1">{content}</Typography>
            </CardContent>
        </Card>
    );
}

function LandingPage(props) {
    const postsSection = () => {
        const postsSection = document.getElementById('posts-section');
        if (postsSection) {
            postsSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const stakeholdersSection = () => {
        const stakeholdersSection = document.getElementById('stakeholders-section');
        if (stakeholdersSection) {
            stakeholdersSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const storiesSection = () => {
        const storiesSection = document.getElementById('stories-section');
        if (storiesSection) {
            storiesSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const [overlapHeight, setOverlapHeight] = useState(0);
    const overlapRef = useRef(null);

    useEffect(() => {
        if (overlapRef.current) {
            setOverlapHeight(overlapRef.current.clientHeight);
        }
    }, []);


    return (
        <div style={{ position: 'relative' }}>
            <div
                className="img-grid"
                style={{
                    position: 'relative',
                    width: '100vw',
                    height: '100vh',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                }}
            >
                <Image
                    src={p1}
                    layout="fill"
                    objectFit="cover"
                    alt=""
                />
                <Typography
                    variant="h1"
                    style={{
                        position: 'absolute',
                        top: '15%',
                        bottom: `calc(60% + ${overlapHeight}px)`,
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        color: 'black',
                        textAlign: 'center',
                        zIndex: 1,
                        fontFamily: 'Arial, sans-serif',
                        fontSize: 'clamp(1rem, 5vw, 4rem)',
                    }}
                >
                    Welcome to Vision Aid Partners
                </Typography>
                <Typography
                    ref={overlapRef}
                    variant="h1"
                    style={{
                        position: 'absolute',
                        top: '45%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        color: 'black',
                        textAlign: 'center',
                        zIndex: 1,
                        fontFamily: 'Arial, sans-serif',
                        fontSize: 'clamp(0.8rem, 3vw, 1.5rem)',
                        maxWidth: '80%',
                    }}
                >
                    <a href="https://visionaid.org/" style={{ textDecoration: 'underline', color: 'inherit' }}>Vision-Aid</a> enables, educates, and empowers the visually impaired. Vision-Aid, leveraging its network
                    of resource centers across India and a robust suite of online programs, offers a comprehensive range
                    of devices, training, and services. These initiatives aim to provide holistic vision enhancement and
                    rehabilitation programs for adults and children who are blind or have low vision. Vision Aid Partners include the many
                    partners we work with including pre-eminent organizations in both India and the United States to realize Vision Aid&apos;s mission.
                </Typography>

                <Button
                    variant="contained"
                    onClick={postsSection}
                    style={{
                        zIndex: 1,
                        left: '50%',
                        position: 'absolute',
                        bottom: '30%',
                        transform: 'translateX(-50%)',
                        backgroundColor: '#205c24',
                        color: 'white',
                        borderRadius: 20,
                        padding: '10px 20px',
                        fontSize: 'clamp(0.8rem, 2vw, 1rem)',
                        minWidth: '200px',
                    }}
                >
                    Go to posts
                </Button>

                <Button
                    variant="contained"
                    onClick={stakeholdersSection}
                    style={{
                        zIndex: 1,
                        left: '50%',
                        position: 'absolute',
                        bottom: '20%',
                        transform: 'translateX(-50%)',
                        backgroundColor: '#205c24',
                        color: 'white',
                        borderRadius: 20,
                        padding: '10px 20px',
                        fontSize: 'clamp(0.8rem, 2vw, 1rem)',
                        minWidth: '200px',
                    }}
                >
                    Vision-Aid Stakeholders
                </Button>

                <Button
                    variant="contained"
                    onClick={storiesSection}
                    style={{
                        zIndex: 1,
                        left: '50%',
                        position: 'absolute',
                        bottom: '10%',
                        transform: 'translateX(-50%)',
                        backgroundColor: '#205c24',
                        color: 'white',
                        borderRadius: 20,
                        padding: '10px 20px',
                        fontSize: 'clamp(0.8rem, 2vw, 1rem)',
                        minWidth: '200px',
                    }}
                >
                    More stories!
                </Button>

            </div>
            <div id="stakeholders-section">
                <br></br>
                <Typography variant="h4" style={{ marginBottom: '20px' }}>Vision-Aid Stakeholders</Typography>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <Avatar
                            alt="Stakeholder 1"
                            src="/images/stakeholder1.jpg"
                            sx={{ width: 100, height: 100, margin: '0 auto' }}
                        />
                        <Typography variant="h6" align="center" gutterBottom>
                            Ms. Devi Udayakumar
                        </Typography>
                        <Typography variant="body1" align="center">
                            Designation: Head, Low Vision Rehabilitation Programs
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Avatar
                            alt="Stakeholder 2"
                            src="/images/stakeholder2.jpg"
                            sx={{ width: 100, height: 100, margin: '0 auto' }}
                        />
                        <Typography variant="h6" align="center" gutterBottom>
                            Ms. Janani Sankaran
                        </Typography>
                        <Typography variant="body1" align="center">
                            Designation: Program Manager, Low Vision Rehabilitation Programs
                        </Typography>
                    </Grid>
                </Grid>
            </div>
            <div id="posts-section">
                <br></br>
                <Grid container spacing={2}>
                    {(props.landingPageEntries || []).map((post, index) => (
                        <Grid item xs={12} key={index}>
                            <Post
                                title={post.title}
                                content={post.content}
                                date={new Date(post.creationDate).toLocaleTimeString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                            />
                        </Grid>
                    ))}
                </Grid>
            </div>
            <div id="stories-section">
                <br></br>
                <Typography variant="h4" style={{ marginBottom: '20px' }}>More Stories</Typography>
                <Typography variant="h6" style={{ marginBottom: '20px' }}>
                    <a href="https://visionaid.org/news/report-on-visit-to-vision-aid-resource-center-pune-on-march-2nd-2024/" style={{ textDecoration: 'underline', color: 'inherit' }}>Report on Visit to Vision-Aid Resource Center, Pune on March 2nd, 2024</a>
                </Typography>
                <Typography variant="h6" style={{ marginBottom: '20px' }}>
                    <a href="https://visionaid.org/news/celebrating-low-vision-awareness-month-at-vision-aid/" style={{ textDecoration: 'underline', color: 'inherit' }}>Celebrating Low Vision Awareness Month at Vision-Aid</a>
                </Typography>
            </div>
        </div>
    );
}

export default LandingPage;
