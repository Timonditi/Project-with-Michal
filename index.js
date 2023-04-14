// Get references to the search form and property list
const searchForm = document.querySelector('#property-search');
const propertyList = document.querySelector('#propertyList');
const priceInput = document.querySelector('#price');
const priceOutput = document.querySelector('#price-output');

// Listen for form submission
searchForm.addEventListener('submit', (event) => {
  // Prevent the form from submitting and reloading the page
  event.preventDefault();

  // Get the form data
  const formData = new FormData(searchForm);
  const location = formData.get('location');
  const price = formData.get('price');
  const buyOrRent = formData.get('buy') || formData.get('rent');

  // Make a request to the server with the form data
  fetch(`http://localhost:3000/locations`)
    .then(response => response.json())
    .then(locations => {
      // Filter the locations based on the form data
      const filteredLocations = locations.filter(locationObj => {
        if (location !== 'All locations' && locationObj.name !== location) {
          return false;
        }
        for (let i = 0; i < locationObj.houses.length; i++) {
          const house = locationObj.houses[i];
          const housePrice = parseInt(house.price.replace(/[^\d]/g, ''));
          if (housePrice > price) {
            return false;
          }
          if (buyOrRent === 'buy' && house.type.includes('rental')) {
            return false;
          }
          if (buyOrRent === 'rent' && house.type.includes('sale')) {
            return false;
          }
        }
        return true;
      });

      // Clear the property list
      propertyList.innerHTML = '';

      // Display each house in the list
      filteredLocations.forEach(locationObj => {
        const locationName = locationObj.name;
        locationObj.houses.forEach(house => {
          const div = document.createElement('div');
          div.textContent = `${locationName}: ${house.type} - ${house.price}`;
          propertyList.appendChild(div);
        });
      });
    })
    .catch(error => {
      console.error(error);
    });
});
priceInput.addEventListener('input', () => {
  // Update the price output element with the new value
  priceOutput.textContent = `${priceInput.value}`;
});
//
  