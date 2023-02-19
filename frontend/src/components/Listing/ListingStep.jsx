import React from 'react';

import Geocode from "react-geocode";
import { useNavigate, useSearchParams } from 'react-router-dom';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';

import getHours from 'date-fns/getHours'

import ListingTitle from './ListingTitle';
import ListingBoxStep1 from './ListingBoxStep1';
import ListingBoxStep2 from './ListingBoxStep2';
import ListingBoxStep3 from './ListingBoxStep3';

import FetchHelper from '../../util/FetchHelper';
import googleApiKey from '../../util/googleApiKey';

Geocode.setApiKey(googleApiKey);

const listingBoxsx = {
  padding: 2,
  marginTop: 10,
  width: 500,
  maxHeight: 1000,
  backgroundColor: 'grey.100',
  border: 1,
  borderColor: 'grey.400',
  borderRadius: 1,
  boxShadow: 1,
  marginLeft: "auto",
  marginRight: "auto"
}

const steps = ['Enter address', 'Details', 'Price and Availability'];

function ListingStep ({ isLoaded }) {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set());
  const [searchParams] = useSearchParams();
  const today = new Date();
  const listingID = searchParams.get('id');

  React.useEffect(() => {
    if (listingID != null) {
      FetchHelper('GET', '/listings/' + listingID, null, true)
        .then((data) => {
          setAddress(data.address);
          setTypeOfSpot(data.space_type);
          setAccess(data.amenity_24_7);
          setSheltered(data.amenity_sheltered);
          setSecurityGate(data.amenity_security_gates);
          setDescription(data.description);
          setInstruction(data.instruction);
          setTitle(data.name)
          setDailyPrice(data.price_daily);
          setHourlyPrice(data.price_hourly);

          console.log(data)
        })
    }
  },[listingID])

  // step 1
  const [address, setAddress] = React.useState('');
  const [coordinates, setCoordinates] = React.useState('');
  const [postcode, setPostcode] = React.useState('');

  // step 2
  const [typeOfSpot, setTypeOfSpot] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [instruction, setInstruction] = React.useState('');
  const [access, setAccess] = React.useState(false);
  const [sheltered, setSheltered] = React.useState(false);
  const [securityGate, setSecurityGate] = React.useState(false);

  // step 3
  const [hourlyPrice, setHourlyPrice] = React.useState(0);
  const [dailyPrice, setDailyPrice]  = React.useState(0);
  const [startTime, setStartTime] = React.useState(0);
  const [endTime, setEndTime] = React.useState(0);
  const [startDate, setStartDate] = React.useState(today);
  const [endDate, setEndDate] = React.useState(today);
  const [title, setTitle] = React.useState('');
  const [monday, setMonday] = React.useState(true);
  const [tuesday, setTuesday] = React.useState(true);
  const [wednesday, setWednesday] = React.useState(true);
  const [thursday, setThursday] = React.useState(true);
  const [friday, setFriday] = React.useState(true);
  const [saturday, setSaturday] = React.useState(true);
  const [sunday, setSunday] = React.useState(true);
  const [photo, setPhoto] = React.useState("");

  const handleCheckbox = (event, func) => {
    func(event.target.checked);
  };

  const uploadListing = () => {
    const body = JSON.stringify({
      name: title,
      address: address,
      price_daily: parseInt(dailyPrice),
      price_hourly: parseInt(hourlyPrice),
      // needs to be 1 string
      photo_link: photo,
      space_type: typeOfSpot,
      amenity_24_7: access,
      amenity_sheltered: sheltered,
      amenity_security_gates: securityGate,
      description,
      instruction,
      monday: monday ? 1: 0,
      tuesday: tuesday ? 1: 0,
      wednesday: wednesday ? 1: 0,
      thursday: thursday ? 1: 0,
      friday: friday ? 1: 0,
      saturday: saturday ? 1: 0,
      sunday: sunday ? 1: 0,
      starttime: getHours(startTime),
      endtime: getHours(endTime),
      coordinates,
      postcode
    })
    console.log(body)
    if (listingID === null) {
      FetchHelper('POST', '/listings/new', body, true)
        .catch(err => {
          alert(err);
        });
    } else {
      FetchHelper('PUT', '/listings/' + listingID, body, true)
        .catch(err => {
          alert(err);
        });
    } 
  }

	let activepage;

	if (activeStep === 0) {
		activepage = <ListingBoxStep1 address={address} setAddress={setAddress} />;
	} else if  (activeStep === 1) {
		activepage = <ListingBoxStep2 
                    typeOfSpot={typeOfSpot} 
                    setTypeOfSpot={setTypeOfSpot}
                    description={description} 
                    setDescription={setDescription}
                    instruction={instruction}
                    setInstruction={setInstruction}
                    setAccess={setAccess}
                    access={access}
                    setSheltered={setSheltered}
                    sheltered={sheltered}
                    setSecurityGate={setSecurityGate}
                    securityGate={securityGate}
                    handleCheckbox={handleCheckbox}
                    />;
	} else {
		activepage = <ListingBoxStep3 
                    postcode={postcode}      
                    setHourlyPrice={setHourlyPrice}
                    hourlyPrice={hourlyPrice}
                    setDailyPrice={setDailyPrice} 
                    dailyPrice={dailyPrice}
                    startTime={startTime} 
                    setStartTime={setStartTime} 
                    endTime={endTime} 
                    setEndTime={setEndTime}
                    title={title} 
                    setTitle={setTitle}
                    handleCheckbox={handleCheckbox}
                    setMonday={setMonday}
                    setTuesday={setTuesday}
                    setWednesday={setWednesday}
                    setThursday={setThursday}
                    setFriday={setFriday}
                    setSaturday={setSaturday}
                    setSunday={setSunday}
                    setPhoto={setPhoto}
                    />;
	}

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const handleNext = async () => {
    let newSkipped = skipped;

    if (activeStep === 0) {
      if (address === "") {
        alert("You must enter a valid address!")
        return;
      } 

      // check address has valid coordinates and postcode
      try {
        await Geocode.fromAddress(address);
      } catch (_) {
        setCoordinates('');
        alert("Could not find a valid address!");
        return;
      }

      Geocode.fromAddress(address).then(
        (response) => {
          const isPost = (element) => element.types.includes('postal_code');
          const postcodeIndex = response.results[0].address_components.findIndex(isPost);
          if (postcodeIndex === -1) {
            alert("Could not find a postcode for the address!");
            setActiveStep(0);
            return;
          }
          setPostcode(parseInt(response.results[0].address_components[postcodeIndex].short_name));
          const { lat, lng } = response.results[0].geometry.location;
          setCoordinates(`${lat} ${lng}`);
        }
      );

    } else if (activeStep === 1) {
      if (typeOfSpot === "") {
        alert("You must choose a type of your car space!")
        return;
      }
    } else if (activeStep === 2) {
		  if (title === "") {
        alert("You must give your listing a title!");
        return;
      }

      if (hourlyPrice <= 0 || dailyPrice <= 0 || hourlyPrice >= dailyPrice) {
        alert("You must set a valid price!");
        return;
      }

      if (endTime <= startTime) {
        console.log("startTime: " + startTime);
        console.log("endTime: " + endTime);
        alert("End time must be after start time");
        return;
      }

      uploadListing();
    }

    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      sx={listingBoxsx}
    >
      <ListingTitle/>

      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => {
          const stepProps = {};
          const labelProps = {};
          if (isStepSkipped(index)) {
            stepProps.completed = false;
          }
          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      {activeStep === steps.length ? (
        <React.Fragment>
          <Typography sx={{ mt: 2, mb: 1 }} textAlign="center">
						Your car space has been listed!
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Box sx={{ flex: '1 1 auto' }} />
            <Button onClick={() => navigate('/listing')}>View all listings</Button>
          </Box>
        </React.Fragment>
      ) : (
        <React.Fragment>
          { activepage }
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Button
              color="inherit"
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Back
            </Button>
            <Box sx={{ flex: '1 1 auto' }} />

            <Button onClick={handleNext}>
              {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
            </Button>
          </Box>
        </React.Fragment>
      )}
    </Box>
  );
}

export default ListingStep;
