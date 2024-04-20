import { Typography, Box, Container, Grid } from "@mui/material";
import BotCard from "../components/BotCard";

import { useEffect, useState } from "react";
import axios from "axios";

/*
const bots = [
    {
        id: 1,
        name: "Anti-AFK Bot",
        description: "This bot prevents you from going AFK by moving your character every few minutes.",
        status: "Running"
    },
    {
        id: 2,
        name: "Bot 2",
        description: "This is the second bot",
        status: "Stopped"
    },
    {
        id: 3,
        name: "Bot 3",
        description: "This is the third bot",
        status: "Stopped"
    }
]
*/

export default function BotsPage(props) {
    const [bots, setBots] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:5000/bots")
            .then((response) => {
                setBots(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    function startBot(name) {
        axios.post(`http://localhost:5000/bots/start`, {name: name})
            .then((response) => {
                console.log(response.data);
                setBots(bots.map((bot) => {
                    if (bot.name === name) {
                        return {...bot, status: "RUNNING"};
                    }
                    return bot;
                }));
            })
            .catch((error) => {
                console.error(error);
            });
    }

    function stopBot(name) {
        axios.post(`http://localhost:5000/bots/stop`, {name: name})
            .then((response) => {
                console.log(response.data);
                setBots(bots.map((bot) => {
                    if (bot.name === name) {
                        return {...bot, status: "STOPPED"};
                    }
                    return bot;
                }));
            })
            .catch((error) => {
                console.error(error);
            });
    }

    return (
        <Box sx={{marginX: '1%'}}>
            <Typography variant="h3">Bots</Typography>
            <Box sx={{height: '1px', marginBottom: '15px', backgroundColor: 'gray', width: '100%', borderRadius: '2px'}} />
            <Grid container spacing={3}>
                {bots.map((bot) => (
                    <Grid item xs={6} sm={3} md={2} key={bot.name}>
                        <BotCard {...bot} onStart={() => startBot(bot.name)} onStop={() => stopBot(bot.name)}/>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}