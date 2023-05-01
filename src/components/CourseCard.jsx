import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Button, CardActionArea, CardActions } from '@mui/material';


export default function CourseCard(props){
    return(
        <Card sx={{ maxWidth: 345 }}>
          <CardActionArea>
            <CardMedia
              component="img"
              height="140"
              image={props.imageUrl}
              alt="green iguana"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
              {props.className}
              </Typography>
              
            </CardContent>
          </CardActionArea>
          <CardActions >
            <a href={`/classAttendance/${props.crn}`}>
              <Button size="small" variant='outlined' color="primary">
                Open
              </Button>
            </a>
          </CardActions>
        </Card>
    )
}