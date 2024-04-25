import { Box, Grid } from "@mui/material";

import BotCard from "./BotCard";
import BotSettings from "./BotSettings";

import { getBots, startBot, stopBot } from "../services/BotService";
import { useDispatch, useSelector } from "react-redux";
import { setBots } from "../features/bots/botslice";
import { useState, useEffect } from "react";

export default function BotList(props) {
    const bots = useSelector((state) => state.bot.bots);
    const dispatch = useDispatch();

    const [botSettings, setBotSettings] = useState(null);

    useEffect(() => {
        getBots().then((response) => {
            dispatch(setBots(response));
        });
    }, []);

    function startBotByName(name) {
        startBot(name).then(() => {
            getBots().then((response) => {
                dispatch(setBots(response));
            });
        }).catch((error) => {
            console.error(error);
        });
    }

    function stopBotByName(name) {
        stopBot(name).then(() => {
            getBots().then((response) => {
                dispatch(setBots(response));
            });
        }).catch((error) => {
            console.error(error);
        });
    }

    // Show a popup window with bot settings
    function showBotSettings(bot) {
        setBotSettings(bot)
    }

    return (
    <Box>
        {botSettings && 
        <Box sx={{
            position: 'fixed',
            padding: '20px',
            width: 'auto',
            minWidth: '300px',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            border: '2px solid gray',
            backgroundColor: 'white',
            borderRadius: '5px',
            boxShadow: 24,
            zIndex: 1000
        }}>
            <BotSettings bot={botSettings} onClose={() => setBotSettings(null)}/>
        </Box>}
        <Grid container spacing={3}>
            {bots.map((bot) => (
                <Grid item xs={6} sm={3} md={2} key={bot.name}>
                    <BotCard {...bot} 
                    onStart={() => startBotByName(bot.name)} 
                    onStop={() => stopBotByName(bot.name)}
                    onSettings={() => showBotSettings(bot)}/>
                </Grid>
            ))}
        </Grid>
    </Box>
    )
}