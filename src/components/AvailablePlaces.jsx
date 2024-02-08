import { useEffect, useState } from 'react';
import Places from './Places.jsx';
import Error from "./Error.jsx"
import { sortPlacesByDistance } from '../loc.js';
import { fetchAvailablePlaces } from '../http.js';

export default function AvailablePlaces({ onSelectPlace }) {

  const[availablePlaces, setAvailablePlaces] = useState([]);
  const[isFetching,setIsFetching] = useState(false);
  const[error,setError] = useState(null);

useEffect(()=>{
  async function fetchPlaces (){
 
    setIsFetching(true);

 try{
    
    const places =  await fetchAvailablePlaces();

     navigator.geolocation.getCurrentPosition((position)=>{

    const sortedPlaces = sortPlacesByDistance(places, position.coords.latitude, position.coords.longitude);

    setAvailablePlaces(sortedPlaces);
    setIsFetching(false);

     })
   }
   catch(error){
          setError({message:error.message || "Could not fetch places, please try again!!"});
          setIsFetching(false);
   }
 
  }
  fetchPlaces();
  },[])

  if(error){
    return <Error title="An error occured!" message={error.message}/>
  }
 
 
  return (
    <Places
      title="Available Places"
      places={availablePlaces}
      isLoading = {isFetching}
      loadingText="Loading places..."
      fallbackText="No places available."
      onSelectPlace={onSelectPlace}
    />

  );
}
