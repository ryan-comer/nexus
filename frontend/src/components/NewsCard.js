import { Card, CardContent, CardMedia, Typography, Grid } from '@mui/material';
import { useTheme } from '@mui/material';

export default function NewsCard(props) {

    const theme = useTheme();

    // Open the article in the default browser
    function openArticle() {
        window.require('electron').shell.openExternal(props.link);
    }

    // Change the background color on hover
    function onHover(e) {
        e.currentTarget.style.backgroundColor = theme.palette.action.hover;
    }

    function onLeave(e) {
        e.currentTarget.style.backgroundColor = theme.palette.background.paper;
    }

    // Input date is an array of integers
    // Output is a string in the format "Month Day, Year"
    // Example: [2021, 10, 12] -> "October 12, 2021"
    function formatDate(date) {
        const months = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"];

        return months[date[1] - 1] + " " + date[2] + ", " + date[0];
    }

    return (
        <Card style={{
            cursor: 'pointer'
        }}
        onClick={openArticle}
        onMouseOver={onHover}
        onMouseLeave={onLeave}>
            <CardContent>
                <Typography variant="h4" textAlign='left'>{props.source}</Typography>
                <Grid container columnSpacing={2}>
                    <Grid item xs={4}>
                        <CardMedia
                            component="img"
                            image={props.image}
                            alt="News Image"
                        />
                    </Grid>
                    <Grid item xs={8}>
                        <Grid container direction="column" rowSpacing={1}>
                            <Grid item xs={12}>
                                <Typography variant="h5">{props.title}</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="body2">{
                                    formatDate(props.published_parsed)
                                }</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="body1" sx={{
                                    maxHeight: '150px',
                                    overflow: 'hidden',
                                }}>{props.description.replace(/<\/?[^>]+(>|$)/g, "")}</Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
}