import { Typography, Box } from "@mui/material";
import BotList from "../components/BotList";

export default function BotsPage(props) {
    return (
        <Box sx={{marginX: '1%'}}>
            <Typography variant="h3">Bots</Typography>
            <Box sx={{height: '1px', marginBottom: '15px', backgroundColor: 'gray', width: '100%', borderRadius: '2px'}} />
            <Typography variant="body">You can configure the bots using the settings button for each bot. To start and stop a bot, use the respective buttons on each bot. The status field will tell you if the bot is running or not. Here are the bots that are available on Nexus:</Typography>
            <BotList/>
        </Box>
    );
}