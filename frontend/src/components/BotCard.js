import { Box, Card, CardContent, Typography, CardActions, Button, IconButton } from "@mui/material";
import { Settings as SettingsIcon } from '@mui/icons-material';

export default function BotCard(props) {
    const statusColors = {
        'RUNNING': 'green',
        'STOPPED': 'red'
    };

    return (
        <Card>
            <CardContent>
                <Box sx={{display: 'flex', width: '100%', justifyContent: 'right'}}>
                    <IconButton onClick={props.onSettings}>
                        <SettingsIcon/>
                    </IconButton>
                </Box>
                <Typography gutterBottom variant="h5" component="div" noWrap>
                    {props.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" height="100px" sx={{overflow: "hidden"}}>
                    {props.description}
                </Typography>
                <Box sx={{border: "1px solid", borderRadius: '5px', borderColor: statusColors[props.status] || 'gray'}}>
                    <Typography variant="body2" color="text.secondary">
                        Status: {props.status}
                    </Typography>
                </Box>
            </CardContent>
            <CardActions>
                <Button variant="contained" size="small" onClick={props.onStart}>Start</Button>
                <Button variant="contained" size="small" onClick={props.onStop}>Stop</Button>
            </CardActions>
        </Card>
    );
}