import { Button, CardActionArea, CardActions } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';

function Root() {
  return (
    <div className="m-6 space-y-8">
      <div className="flex justify-center">
        <div className="flex justify-around w-2/3">
          <h1 className="text-5xl">Welcome Mustafa!</h1>
          <Button variant="outlined">Add sections</Button>
        </div>
      </div>

      <div id="my-sections" >
        <Card sx={{ maxWidth: 345 }}>
          <CardActionArea>
            <CardMedia
              component="img"
              height="140"
              image="pmp.jpg"
              alt="green iguana"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
              SWE387 - SEC 1
              </Typography>
              
            </CardContent>
          </CardActionArea>
          <CardActions >
            <a href="/classAttendance">
              <Button size="small" variant='outlined' color="primary">
                Open
              </Button>
            </a>
          </CardActions>
        </Card>
      </div>
    </div>
  )
}



export default Root
