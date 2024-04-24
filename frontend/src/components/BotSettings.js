import { Typography, Box, Grid, IconButton, Button, TextField } from "@mui/material";
import { Close as CloseIcon } from '@mui/icons-material';
import { saveBotSettings } from "../services/BotService";
import { useState } from "react";

export default function BotSettings(props) {
    const [settings, setSettings] = useState([...props.bot.settings])
    const [showMessage, setShowMessage] = useState(false);

    function save() {
        saveBotSettings(props.bot.name, settings).then(() => {
            setShowMessage(true);
            setTimeout(() => {
                setShowMessage(false);
            }, 2000);
        }).catch((error) => {
            console.error(error);
        });
    }

    function updateSetting(name, value) {
        let settingsCopy = [...settings];
        let settingIndex = settingsCopy.findIndex((s) => s.name === name);
        settingsCopy[settingIndex] = {...settingsCopy[settingIndex], value: value}
        setSettings(settingsCopy);
    }

    return (
        <Box>
            <Box sx={{display: 'flex', justifyContent: 'right'}}>
                <IconButton onClick={props.onClose}>
                    <CloseIcon/>
                </IconButton>
            </Box>
            <Typography sx={{
                marginBottom: '10px'
            }} variant="h4">{props.bot.name} Settings</Typography>
            {settings.map((setting) => {
                return (
                    <Grid container spacing={2} key={setting.name}>
                        <Grid item xs={6}>
                            <Typography>{setting.label}</Typography>
                        </Grid>
                        {setting.type === 'NUMBER' &&
                        <Grid item xs={6}>
                            <TextField type="number" defaultValue={setting.value} onChange={(e) => updateSetting(setting.name, e.target.value)} sx={{
                                maxWidth: '100px'
                            }}/>
                        </Grid>
                        }
                    </Grid>
                )
            })}
            {showMessage &&
                <Typography 
                    sx={{
                        color: 'green'
                    }}
                >Settings applied!</Typography>
            }
            <Box sx={{padding: '10px', display: 'flex', justifyContent: 'right'}}>
                <Button variant="contained" size="small" onClick={save}>Save</Button>
            </Box>
        </Box>
    )
}