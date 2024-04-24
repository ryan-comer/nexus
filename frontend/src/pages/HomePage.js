import { Typography, Box, Grid } from "@mui/material";
import BotList from "../components/BotList";

export default function HomePage() {
    return (
        <Box sx={{marginX: '1%'}}>
            <Typography variant="h3">Home</Typography>
            <Box sx={{height: '1px', marginBottom: '15px', backgroundColor: 'gray', width: '100%', borderRadius: '2px'}} />
            <Typography variant="h4">Welcome to the Nexus!</Typography>
            <Typography variant="body1">The Nexus is a platform that does a little bit of everything. Explore the tabs above to learn more about the features that are available.</Typography>
        </Box>
    );
}