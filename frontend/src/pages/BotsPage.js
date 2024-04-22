import { Typography, Box, Container, Grid } from "@mui/material";
import BotCard from "../components/BotCard";

import { useEffect, useState } from "react";
import axios from "axios";

export default function BotsPage(props) {
    const [bots, setBots] = useState([]);
    const nexusBackendPort = window.nexusBackendPort;
    console.log(`Nexus backend port: ${nexusBackendPort}`);

    useEffect(() => {
        axios.get(`http://localhost:${nexusBackendPort}/bots`)
            .then((response) => {
                setBots(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    function startBot(name) {
        axios.post(`http://localhost:${nexusBackendPort}/bots/start`, {name: name})
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
        axios.post(`http://localhost:${nexusBackendPort}/bots/stop`, {name: name})
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