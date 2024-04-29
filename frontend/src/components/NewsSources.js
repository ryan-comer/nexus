import { useEffect, useState } from 'react';
import { getSources, saveSources } from '../services/NewsService';
import { Box, Typography, Grid, IconButton, Checkbox, Button } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

export default function NewsSources(props) {
    const [sources, setSources] = useState([]);
    const [showMessage, setShowMessage] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        getSources().then((response) => {
            setSources(response);
        });
    }, []);

    function onCheckboxChange(event, source) {
        let sourcesCopy = [...sources];
        let sourceIndex = sourcesCopy.findIndex((s) => s.name === source.name);
        sourcesCopy[sourceIndex] = {...sourcesCopy[sourceIndex], active: event.target.checked};
        setSources(sourcesCopy);
    }

    function updateSources() {
        saveSources(sources).then(() => {
            setShowMessage(true);
            setTimeout(() => {
                setShowMessage(false);
            }, 2000);
        }).catch((error) => {
            setError(error.response.data);
            setTimeout(() => {
                setError(null);
            }, 4000);
        });
    }

    return (
        <Box>
            <Box sx={{display: 'flex', justifyContent: 'right'}}>
                <IconButton onClick={props.onClose}>
                    <CloseIcon/>
                </IconButton>
            </Box>
            <Typography variant="h4">News Sources</Typography>
            <Box sx={{height: '1px', marginBottom: '15px', backgroundColor: 'gray', width: '100%', borderRadius: '2px'}} />
            <Grid container columnSpacing={1}>
                {sources.map((source) => {
                    return (
                        <Grid item key={source.name} xs={12} md={6}>
                            <Grid container columnSpacing={1}>
                                <Grid item xs={2}>
                                    <Checkbox checked={source.active} onChange={(e) => onCheckboxChange(e, source)}/>
                                </Grid>
                                <Grid item>
                                    <Typography>{source.name}</Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                    );
                })}
            </Grid>
            {showMessage && <Typography sx={{color: 'green'}}>Settings saved successfully</Typography>}
            {error && <Typography sx={{color: 'red'}}>{error}</Typography>}
            <Box sx={{
                display: 'flex',
                justifyContent: 'right',
                marginTop: '20px'
            }}>
                <Button variant='contained' size='small' onClick={updateSources}>Save</Button>
            </Box>
        </Box>
    );
}