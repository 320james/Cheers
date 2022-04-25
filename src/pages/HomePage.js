import React from 'react';
import { useEffect, useState } from "react";
import axios from "axios";

import Banner from '../components/Banner/Banner';
import { homeBanner } from '../Data/bannerData';
import { Grid } from "@material-ui/core";
import Announcement from '../components/ForHome/Announcement';
import styled from "styled-components";
import PostLayout from '../components/ForHome/PostLayout';
import { announcementData } from '../Data/announcementData';


function HomePage(prop) {

    const [userName, setUserName] = useState("");
    const [title, setTitle] = useState("");
    const [date, setDate] = useState("");
    const [message, setMessage] = useState("");


    useEffect(() => {
        async function fetchData() {
            // Get data
            const announcements = await getAnnouncementsFromDatabase();
            announcements.sort((a, b) => a.time_posted.localeCompare(b.time_posted));
            const mostRecentAnnoucement = announcements[0];
            setUserName(mostRecentAnnoucement.user_name);
            setTitle(mostRecentAnnoucement.title);
            setMessage(mostRecentAnnoucement.content);
            setDate(new Date(mostRecentAnnoucement.time_posted).toDateString());
            console.log(announcements[0].title);
        }
        fetchData();
    }, []);

    return (
        <>
            <Banner {...homeBanner} />
            <AnnouncementContainer>
                <Announcement
                    name={userName}
                    topic={title}
                    message={message}
                    date={date}
                />
            </AnnouncementContainer>
            <PostLayout />

        </>
    );
}

async function getAnnouncementsFromDatabase() {
    const res = await axios({
        method: "get",
        url: `/api/messages/`,
        headers: { "Content-Type": "application/json" },
    });
    return res.data;
}

const AnnouncementContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
`



export default HomePage;