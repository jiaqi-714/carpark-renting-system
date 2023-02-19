import React from 'react';

import ListingBox from '../components/Listing/ListingStep'

function AddNewListing ({ isLoaded }) {
	return (
		<div>
			<ListingBox 
				isLoaded={isLoaded}
			/>
		</div>
	)
}

export default AddNewListing;
