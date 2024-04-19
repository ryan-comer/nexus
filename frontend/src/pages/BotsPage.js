import { Typography, Box, Container, Grid } from "@mui/material";
import BotCard from "../components/BotCard";

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

export default function BotsPage(props) {
    return (
        <Box sx={{marginX: '1%'}}>
            <Typography variant="h3">Bots</Typography>
            <Box sx={{height: '1px', marginBottom: '15px', backgroundColor: 'gray', width: '100%', borderRadius: '2px'}} />
            <Grid container spacing={3}>
                {bots.map((bot) => (
                    <Grid item xs={6} sm={3} md={2}>
                        <BotCard key={bot.id} {...bot} />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}