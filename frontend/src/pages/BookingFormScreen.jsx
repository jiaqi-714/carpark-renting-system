import React from 'react';

import { useSearchParams } from 'react-router-dom'

import VehicleForm from '../components/BookingForm/VehicleForm'
import PaymentForm from '../components/BookingForm/PaymentForm'
import BookingSuccess from '../components/BookingForm/BookingSuccess'
import PaymentFail from '../components/BookingForm/PaymentFail';

import { useContext, Context } from '../context';

let updateTimeout = null;

function BookingFormScreen () {  
  const { getters } = useContext(Context);
  const hours = getters.totalHrs;

  const [searchParams] = useSearchParams();
  const [step, setStep] = React.useState('vehicle');
  const [bookingID, setBookingID] = React.useState('');
  
  // booking information
  const [carNum, setCarNum] = React.useState('');
  const [carType, setCarType] = React.useState('');
  const [cardNum, setCardNum] = React.useState('');

  const [paymentSuccess, setPaymentSuccess] = React.useState(true);

  React.useEffect(() => {
    setStep(searchParams.get('step'));
    setBookingID(searchParams.get('bookingid'));
  }, [searchParams]);

  const resetTimer = () => {
    updateTimeout = setTimeout(() => {
      setPaymentSuccess(false);
    // Expired booking after 30 sec for testing purposes
    }, 30 * 1000)
  };

  React.useEffect(() => {
    resetTimer();
    return () => {
      clearTimeout(updateTimeout);
      setPaymentSuccess(true);
    }
  }, []);

  // Render payment form page according to query string step
  return (
    <>
      { step === 'vehicle' ? 
        <VehicleForm 
          carNum={carNum}
          carType={carType}
          setCarNum={setCarNum}
          setCarType={setCarType}
          bookingID={bookingID}
        /> 
      : step === 'payment' ? 
        <PaymentForm 
          cardNum={cardNum}
          carNum={carNum}
          carType={carType}
          setCardNum={setCardNum}
          totalHrs={hours}
          bookingID={bookingID}
          updateTimeout={updateTimeout}
        /> 
      : step === 'success' && 
        <BookingSuccess
          bookingID={bookingID}
        /> 
      }
      {/* payment fail modal */}
      {!paymentSuccess &&
        <PaymentFail />
      }
    </>
  )
}

export default BookingFormScreen;
