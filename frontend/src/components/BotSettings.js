import { Typography, Box, Grid, IconButton, Button, TextField, Tooltip } from "@mui/material";
import { Close as CloseIcon } from '@mui/icons-material';
import { saveBotSettings } from "../services/BotService";
import { useState } from "react";

export default function BotSettings(props) {
    const [settings, setSettings] = useState([...props.bot.settings])
    const [showMessage, setShowMessage] = useState(false);
    const [error, setError] = useState(null);

    function save() {
        saveBotSettings(props.bot.name, settings).then(() => {
            setShowMessage(true);
            setTimeout(() => {
                setShowMessage(false);
            }, 2000);

            props.onSave();
        }).catch((error) => {
            setError(error.response.data);
            setTimeout(() => {
                setError(null);
            }, 4000);
        });
    }

    // Reset settings to default values
    function defaults() {
        const newSettings = settings.map((setting) => {
            return {...setting, value: setting.default}
        });

        setSettings(newSettings);
    }

    // Update an individual setting
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
                            <Tooltip title={setting.description}>
                                <TextField variant="standard" type="number" value={setting.value} onChange={(e) => updateSetting(setting.name, e.target.value)} sx={{
                                    maxWidth: '100px'
                                }}/>
                            </Tooltip>
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
            {error &&
                <Typography 
                    sx={{
                        color: 'red'
                    }}
                >{error}</Typography>
            }
            <Box sx={{padding: '10px', display: 'flex', justifyContent: 'right'}}>
                <Button sx={{marginRight: '10px'}} variant="contained" size="small" onClick={defaults}>Defaults</Button>
                <Button variant="contained" size="small" onClick={save}>Save</Button>
            </Box>
        </Box>
    )
}