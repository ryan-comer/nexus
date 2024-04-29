import { Box, Typography, Grid, Button } from "@mui/material";
import { Refresh as RefreshIcon } from "@mui/icons-material";
import NewsList from "../components/NewsList";
import NewsSources from "../components/NewsSources";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setFeed } from "../features/news/feedslice";
import { getFeed } from "../services/NewsService";

export default function NewsPage() {
    const [showSources, setShowSources] = useState(false);

    const feed = useSelector((state) => state.news.feed);
    const dispatch = useDispatch();

    useEffect(() => {
        if (feed.length > 0) {
            return;
        }

        refreshFeed();
    }, []);

    function refreshFeed() {
        dispatch(setFeed([]));

        getFeed().then((data) => {
            dispatch(setFeed(data));
        });
    }

    return (
        <Box sx={{marginX: '1%'}}>
            {showSources && 
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
                    <NewsSources onClose={() => setShowSources(false)}/>
                </Box>
            }
            <Typography variant="h3">News</Typography>
            <Box sx={{height: '1px', marginBottom: '15px', backgroundColor: 'gray', width: '100%', borderRadius: '2px'}} />
            <Grid container columnSpacing={1}>
                <Grid item>
                    <Button variant='contained' size='small' onClick={refreshFeed}><RefreshIcon/></Button>
                </Grid>
                <Grid item>
                    <Button variant='contained' size='small' onClick={() => setShowSources(true)}>Set Sources</Button>
                </Grid>
            </Grid>
            <NewsList feed={feed}/>
        </Box>
    );
}