import React from 'react';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import FormControl from '@mui/material/FormControl';

import FetchHelper from '../../util/FetchHelper';

function ListingBoxStep3 ({ postcode, setHourlyPrice, setDailyPrice, startTime, setStartTime, endTime, setEndTime, title, setTitle, handleCheckbox, setMonday, setTuesday, setWednesday, setThursday, setFriday, setSaturday, setSunday, setPhoto, hourlyPrice, dailyPrice }) {
  const [photoBlob, setPhotoBlob] = React.useState('');
  const [avgHourly, setAvgHourly] = React.useState('none');
  const [avgDaily, setAvgDaily] = React.useState('none');

  const handleChange = (func, event) => {
    func(event.target.value);
  };

  const handleTime = (func, newValue) => {
    func(newValue);
  };

  const uploadPhoto = (e) => {
    setPhotoBlob(e.target.files[0]);
  }

  const savePhoto = () => {
    // convert photoblob to base64
    let reader = new FileReader();
    reader.onloadend = function() {
      setPhoto(reader.result);
    }
    reader.readAsDataURL(photoBlob);
  }

  React.useEffect(() => {
    FetchHelper('GET', `/analysis/price/${postcode}`)
      .then(data => {
        if (data !== 'error') {
          setAvgHourly("$" + data.hourly_price);
          setAvgDaily("$" + data.daily_price);
        }
      })

  }, []);

  return (
    <div>
      <Typography variant='body1' component="div" mt={2}>
        Please enter the title of your car space
      </Typography>
      <TextField
        label="Title"
        value={title}
        fullWidth
        onChange={(e) => handleChange(setTitle, e)}
      />

      <Typography variant='h6' mt={2} component="div">
        Edit price
      </Typography>
      <Grid container rowSpacing={1} columnSpacing={5}>
        <Grid item xs={6}>
          <FormControl>
            <TextField
              label="Hourly price"
              type="number"
              InputLabelProps={{
                shrink: true,
              }}
              variant="standard"
              value={hourlyPrice}
              onChange={(e) => handleChange(setHourlyPrice, e)}
            />
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Daily price"
            type="number"
            InputLabelProps={{
              shrink: true,
            }}
            variant="standard"
            value={dailyPrice}
            onChange={(e) => handleChange(setDailyPrice, e)}
          />
        </Grid>
        <Grid item xs={6}>
          <Typography variant='body2' component="div" mt={1}>
            Average hourly rate: {avgHourly}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant='body2' component="div" mt={1}>
            Average daily rate: {avgDaily}
          </Typography>
        </Grid>
      </Grid>

			<Typography variant='h5' component="div" mt={4} mb={2}>
        Available Time
      </Typography>

      <Grid container rowSpacing={3} columnSpacing={1}>
        <Grid item xs={5.5}>
          <TimePicker
            label="Start Time"
            value={startTime}
            disablePast={true}
            onChange={(e) => handleTime(setStartTime, e)}
            renderInput={(params) => <TextField {...params} />}
          />
        </Grid>
        <Grid item xs={1}>
        <Typography variant='body1' mt={2} component="div" align="center">
          to
        </Typography>
        </Grid>
        <Grid item xs={5.5}>
          <TimePicker
            label="End Time"
            value={endTime}
            onChange={(e) => handleTime(setEndTime, e)}
            renderInput={(params) => <TextField {...params} />}
          />
        </Grid>
      </Grid>

      <Typography variant='h5' component="div" mt={3}>
        Days of week
      </Typography>

      <FormControlLabel control={<Checkbox defaultChecked />} label="M" onChange={(e) => {handleCheckbox(e, setMonday)}}    />
      <FormControlLabel control={<Checkbox defaultChecked />} label="T" onChange={(e) => {handleCheckbox(e, setTuesday)}}   />
      <FormControlLabel control={<Checkbox defaultChecked />} label="W" onChange={(e) => {handleCheckbox(e, setWednesday)}} />
      <FormControlLabel control={<Checkbox defaultChecked />} label="T" onChange={(e) => {handleCheckbox(e, setThursday)}}  />
      <FormControlLabel control={<Checkbox defaultChecked />} label="F" onChange={(e) => {handleCheckbox(e, setFriday)}}    />
      <FormControlLabel control={<Checkbox defaultChecked />} label="Sat" onChange={(e) => {handleCheckbox(e, setSaturday)}} />
      <FormControlLabel control={<Checkbox defaultChecked />} label="Sun" onChange={(e) => {handleCheckbox(e, setSunday)}}    />

      <Typography variant='h5' component="div">
				Upload Photo
      </Typography>

      <label htmlFor="contained-button-file">
        <input accept="image/png, image/jpg, image/jpeg" id="contained-button-file" multiple type="file" onChange={uploadPhoto}/>
      </label>
      <Button variant="contained" component="span" onClick={savePhoto}>
        Save Image
      </Button>
    </div>
  );
}

export default ListingBoxStep3;
