document.addEventListener("DOMContentLoaded", () => {
    // Retrieve appointment data from localStorage
    const appointmentDataString = localStorage.getItem('appointmentData')
    
    if (!appointmentDataString) {
      console.error("No appointment data found")
      return
    }
    
    const appointmentData = JSON.parse(appointmentDataString)
    
    // Format the date from MM/DD/YYYY to more readable format
    const dateParts = appointmentData.date.split('/')
    if (dateParts.length === 3) {
      const month = parseInt(dateParts[0])
      const day = parseInt(dateParts[1])
      const year = dateParts[2]
      
      // Convert month number to name
      const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ]
      
      // Add ordinal suffix to day
      const dayWithSuffix = day + getDaySuffix(day)
      
      // Get day of week
      const dateObj = new Date(year, month - 1, day)
      const dayOfWeek = [
        "Sunday", "Monday", "Tuesday", "Wednesday", 
        "Thursday", "Friday", "Saturday"
      ][dateObj.getDay()]
      
      // Update the date display
      document.querySelector('.day p').textContent = `${dayOfWeek} ${dayWithSuffix} ${monthNames[month - 1]}, ${year}`
    }
    
    // Update time display
    const timeText = appointmentData.time
    // Determine time of day (Morning, Afternoon, Evening)
    let timeOfDay = "Morning"
    if (timeText.includes("PM")) {
      const hour = parseInt(timeText)
      if (hour >= 12 && hour < 5) {
        timeOfDay = "Afternoon"
      } else {
        timeOfDay = "Evening"
      }
    }
    document.querySelector('.time p').textContent = `${timeOfDay}, ${timeText}`
    
    // Update from location
    const fromLocationParts = appointmentData.fromLocation.split(',')
    if (fromLocationParts.length >= 1) {
      document.querySelector('.from .p1').textContent = getRegion(fromLocationParts[0].trim())
      document.querySelector('.from .p2').textContent = appointmentData.fromLocation
    } else {
      document.querySelector('.from .p2').textContent = appointmentData.fromLocation
    }
    
    // Update to location
    const toLocationParts = appointmentData.toLocation.split(',')
    if (toLocationParts.length >= 1) {
      document.querySelector('.to .p1').textContent = getRegion(toLocationParts[0].trim())
      document.querySelector('.to .p2').textContent = appointmentData.toLocation
    } else {
      document.querySelector('.to .p2').textContent = appointmentData.toLocation
    }
    
    // Update specific information
    if (appointmentData.fromSpecificInfo) {
      document.querySelector('.specific-info1 p').textContent = appointmentData.fromSpecificInfo
    }
    
    if (appointmentData.toSpecificInfo) {
      document.querySelector('.specific-info2 p').textContent = appointmentData.toSpecificInfo
    }
    
    // Clear localStorage after use (optional)
    // localStorage.removeItem('appointmentData')
  })
  
  // Helper function to add ordinal suffix to day number
  function getDaySuffix(day) {
    if (day > 3 && day < 21) return 'th'
    switch (day % 10) {
      case 1: return 'st'
      case 2: return 'nd'
      case 3: return 'rd'
      default: return 'th'
    }
  }
  
// Define location arrays
const northLocations = ['Diego', 'Tunapuna', 'Piarco', 'Arouca'];
const southLocations = ['San Fernando', 'Penal', 'Debe', 'Siparia', 'Point Fortin'];
const eastLocations = ['Sangre Grande', 'Arima', 'Manzanilla', 'Mayaro', 'Toco'];
const westLocations = ['Port of Spain', 'Carenage', 'Diego Martin', 'Petit Valley'];
const centralLocations = ['Chaguanas', 'Couva', 'Cunupia', 'Freeport'];



function getRegion(location) {
  if (northLocations.includes(location)) return 'North';
  if (southLocations.includes(location)) return 'South';
  if (eastLocations.includes(location)) return 'East';
  if (westLocations.includes(location)) return 'West';
  if (centralLocations.includes(location)) return 'Central';

  return 'Unknown';
}

// Handle change event for dropdowns
function handleLocationChange(event) {
  const location = event.target.value;
  const region = getRegion(location);
  console.log(`Selected location "${location}" is in the ${region} region.`);
}

document.getElementById('fromLocation').addEventListener('change', handleLocationChange);
document.getElementById('toLocation').addEventListener('change', handleLocationChange);
