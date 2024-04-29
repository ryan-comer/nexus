import { Box, Typography, Grid, CircularProgress } from '@mui/material';
//import dummy_news from '../dummy/news.json';
import NewsCard from './NewsCard';

export default function NewsList(props) {
    return (
        <Box>
            {props.feed.length === 0 && 
                <Box>
                    <Typography variant="h5">Loading News Feed...</Typography>
                    <CircularProgress />
                </Box>
            }
            {props.feed.length > 0 &&
            <Grid container spacing={2}>
                {props.feed.map((news) => (
                    <Grid item key={news.title} xs={12}>
                        <NewsCard {...news} />
                    </Grid>
                ))}
            </Grid>
            }
        </Box>
    );
}