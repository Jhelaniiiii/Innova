document.addEventListener("DOMContentLoaded", () => {
    // Initialize variables
    const calendarGrid = document.querySelector(".calendar-grid")
    const monthDisplay = document.querySelector(".month-display")
    const yearDisplay = document.querySelector(".year-display")
    const prevMonthBtn = document.querySelector(".prev-month")
    const nextMonthBtn = document.querySelector(".next-month")
    const yearModal = document.getElementById("yearModal")
    const closeModal = document.querySelector(".close-modal")
    const yearSelector = document.querySelector(".year-selector")
  
    // Summary elements
    const summaryDate = document.getElementById("summaryDate")
    const summaryTime = document.getElementById("summaryTime")
    const summaryLocation = document.getElementById("summaryLocation")
    const summaryDestination = document.getElementById("summaryDestination")
  
    // Input elements
    const fromLocationInput = document.getElementById("fromLocation")
    const toLocationInput = document.getElementById("toLocation")
    const specificInfo1 = document.getElementById("specificInfo1")
    const specificInfo2 = document.getElementById("specificInfo2")
  
    const daysOfWeek = ["S", "M", "T", "W", "T", "F", "S"]
    const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"]
    const fullMonthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ]
  
    // Current month and year being displayed
    let currentMonth = new Date().getMonth() // Current month
    let currentYear = new Date().getFullYear() // Current year
  
    // Initialize summary with "Not Specified" values
    summaryDate.textContent = "Not Specified"
    summaryTime.textContent = "Not Specified"
    summaryLocation.textContent = "Not Specified"
    summaryDestination.textContent = "Not Specified"
  
    // Clear any pre-filled input values
    fromLocationInput.value = ""
    toLocationInput.value = ""
  
    // Function to update the summary date
    function updateSummaryDate(day, month, year) {
      const formattedDate = `${(month + 1).toString().padStart(2, "0")}/${day.toString().padStart(2, "0")}/${year}`
      summaryDate.textContent = formattedDate
      animateElement(summaryDate)
    }
  
    // Function to generate calendar for a specific month and year
    function generateCalendar(year, month) {
      // Clear existing calendar
      calendarGrid.innerHTML = ""
  
      // Add days of week
      daysOfWeek.forEach((day) => {
        const dayElement = document.createElement("div")
        dayElement.className = "calendar-day day-name"
        dayElement.textContent = day
        calendarGrid.appendChild(dayElement)
      })
  
      // Get first day of month and total days
      const firstDate = new Date(year, month, 1)
      const lastDate = new Date(year, month + 1, 0)
      const firstDay = firstDate.getDay() // 0 for Sunday, 1 for Monday, etc.
      const totalDays = lastDate.getDate()
  
      // Update calendar header
      monthDisplay.textContent = monthNames[month]
      yearDisplay.textContent = year
  
      // Add empty spaces for days before the 1st
      for (let i = 0; i < firstDay; i++) {
        const emptyDay = document.createElement("div")
        emptyDay.className = "calendar-day empty"
        calendarGrid.appendChild(emptyDay)
      }
  
      // Add the actual days
      for (let i = 1; i <= totalDays; i++) {
        const dayElement = document.createElement("div")
        dayElement.className = "calendar-day"
        dayElement.textContent = i
  
        // Store the day value as a data attribute for easier access
        dayElement.dataset.day = i
  
        // Add click event to select day
        dayElement.addEventListener("click", function () {
          // Remove selected class from all days
          document.querySelectorAll(".calendar-day").forEach((day) => {
            if (!day.classList.contains("day-name") && !day.classList.contains("empty")) {
              day.classList.remove("selected")
            }
          })
  
          // Add selected class to clicked day
          this.classList.add("selected")
  
          // Update summary date
          updateSummaryDate(i, month, year)
        })
  
        calendarGrid.appendChild(dayElement)
      }
    }
  
    // Function to animate an element to draw attention
    function animateElement(element) {
      element.classList.add("highlight")
      setTimeout(() => {
        element.classList.remove("highlight")
      }, 1500)
    }
  
    // Function to generate year options for the modal
    function generateYearOptions() {
      yearSelector.innerHTML = ""
  
      // Generate years from current year - 5 to current year + 5
      const startYear = currentYear - 5
      const endYear = currentYear + 5
  
      for (let year = startYear; year <= endYear; year++) {
        const yearOption = document.createElement("div")
        yearOption.className = "year-option"
        if (year === currentYear) {
          yearOption.classList.add("selected")
        }
        yearOption.textContent = year
  
        yearOption.addEventListener("click", () => {
          // Update current year
          currentYear = year
  
          // Regenerate calendar
          generateCalendar(currentYear, currentMonth)
  
          // Update summary date if a day is selected
          const selectedDay = document.querySelector(".calendar-day.selected")
          if (selectedDay && !selectedDay.classList.contains("day-name") && !selectedDay.classList.contains("empty")) {
            const day = Number.parseInt(selectedDay.dataset.day)
            updateSummaryDate(day, currentMonth, currentYear)
          }
  
          // Close modal
          yearModal.style.display = "none"
        })
  
        yearSelector.appendChild(yearOption)
      }
    }
  
    // Initialize calendar for current month and year
    generateCalendar(currentYear, currentMonth)
  
    // Generate year options
    generateYearOptions()
  
    // Add event listeners for month navigation
    prevMonthBtn.addEventListener("click", () => {
      currentMonth--
      if (currentMonth < 0) {
        currentMonth = 11
        currentYear--
      }
      generateCalendar(currentYear, currentMonth)
  
      // Update summary date if a day is selected
      const selectedDay = document.querySelector(".calendar-day.selected")
      if (selectedDay && !selectedDay.classList.contains("day-name") && !selectedDay.classList.contains("empty")) {
        const day = Number.parseInt(selectedDay.dataset.day)
        updateSummaryDate(day, currentMonth, currentYear)
      }
    })
  
    nextMonthBtn.addEventListener("click", () => {
      currentMonth++
      if (currentMonth > 11) {
        currentMonth = 0
        currentYear++
      }
      generateCalendar(currentYear, currentMonth)
  
      // Update summary date if a day is selected
      const selectedDay = document.querySelector(".calendar-day.selected")
      if (selectedDay && !selectedDay.classList.contains("day-name") && !selectedDay.classList.contains("empty")) {
        const day = Number.parseInt(selectedDay.dataset.day)
        updateSummaryDate(day, currentMonth, currentYear)
      }
    })
  
    // Add event listener for year display to open modal
    yearDisplay.addEventListener("click", () => {
      // Regenerate year options to ensure current year is highlighted
      generateYearOptions()
  
      // Show modal
      yearModal.style.display = "block"
  
      // Scroll to selected year
      const selectedYear = document.querySelector(".year-option.selected")
      if (selectedYear) {
        selectedYear.scrollIntoView({ block: "center" })
      }
    })
  
    // Add event listener for month display to cycle through months
    monthDisplay.addEventListener("click", () => {
      currentMonth = (currentMonth + 1) % 12
      generateCalendar(currentYear, currentMonth)
  
      // Update summary date if a day is selected
      const selectedDay = document.querySelector(".calendar-day.selected")
      if (selectedDay && !selectedDay.classList.contains("day-name") && !selectedDay.classList.contains("empty")) {
        const day = Number.parseInt(selectedDay.dataset.day)
        updateSummaryDate(day, currentMonth, currentYear)
      }
    })
  
    // Close modal when clicking the close button
    closeModal.addEventListener("click", () => {
      yearModal.style.display = "none"
    })
  
    // Close modal when clicking outside the modal content
    window.addEventListener("click", (event) => {
      if (event.target === yearModal) {
        yearModal.style.display = "none"
      }
    })
  
    // Time slot selection handling
    const timeSlots = document.querySelectorAll(".time-slot")
    timeSlots.forEach((slot) => {
      // Remove the 'selected' class from all time slots initially
      slot.classList.remove("selected")
  
      slot.addEventListener("click", function () {
        // Remove selected class from all slots
        timeSlots.forEach((s) => s.classList.remove("selected"))
        // Add selected class to clicked slot
        this.classList.add("selected")
        // Update summary time with animation
        summaryTime.textContent = this.textContent
        animateElement(summaryTime)
      })
    })
  
    // From location input handling
    fromLocationInput.addEventListener("input", function () {
      // Update summary location with animation
      if (this.value.trim() !== "") {
        const locationText = this.value.length > 15 ? this.value.substring(0, 15) + "..." : this.value
        summaryLocation.textContent = locationText
      } else {
        summaryLocation.textContent = "Not Specified"
      }
      animateElement(summaryLocation)
    })
  
    // To location input handling
    toLocationInput.addEventListener("input", function () {
      // Update summary destination with animation
      if (this.value.trim() !== "") {
        const destinationText = this.value.length > 15 ? this.value.substring(0, 15) + "..." : this.value
        summaryDestination.textContent = destinationText
      } else {
        summaryDestination.textContent = "Not Specified"
      }
      animateElement(summaryDestination)
    })
  
    // Button handlers
    document.querySelector(".book-btn").addEventListener("click", () => {
      // Check if all required fields are filled
      const missingFields = []
  
      if (summaryDate.textContent === "Not Specified") missingFields.push("Date")
      if (summaryTime.textContent === "Not Specified") missingFields.push("Time")
      if (fromLocationInput.value.trim() === "") missingFields.push("From Location")
      if (toLocationInput.value.trim() === "") missingFields.push("To Location")
  
      if (missingFields.length > 0) {
        alert(`Please fill in the following required fields:\n${missingFields.join("\n")}`)
        return
      }
  
      // Get all the booking details
      const date = summaryDate.textContent
      const time = summaryTime.textContent
      const location = fromLocationInput.value
      const destination = toLocationInput.value
  
      // Get specific information
      const info1 = specificInfo1.value
      const info2 = specificInfo2.value
  
      // Create booking confirmation message
      let confirmationMessage = `Booking confirmed!\n\n`
      confirmationMessage += `Date: ${date}\n`
      confirmationMessage += `Time: ${time}\n`
      confirmationMessage += `From: ${location}\n`
      confirmationMessage += `To: ${destination}\n\n`
  
      if (info1.trim() !== "") {
        confirmationMessage += `Specific Information: ${info1}\n`
      }
  
      if (info2.trim() !== "") {
        confirmationMessage += `Additional Notes: ${info2}\n`
      }
  
      alert(confirmationMessage)
    })
  
    document.querySelector(".cancel-btn").addEventListener("click", () => {
      if (confirm("Are you sure you want to cancel?")) {
        // Reset all inputs
        fromLocationInput.value = ""
        toLocationInput.value = ""
        specificInfo1.value = ""
        specificInfo2.value = ""
  
        // Reset summary
        summaryDate.textContent = "Not Specified"
        summaryTime.textContent = "Not Specified"
        summaryLocation.textContent = "Not Specified"
        summaryDestination.textContent = "Not Specified"
  
        // Remove selected class from all days
        document.querySelectorAll(".calendar-day").forEach((day) => {
          if (!day.classList.contains("day-name") && !day.classList.contains("empty")) {
            day.classList.remove("selected")
          }
        })
  
        // Remove selected class from all time slots
        timeSlots.forEach((slot) => {
          slot.classList.remove("selected")
        })
  
        // Animate reset fields
        animateElement(summaryDate)
        animateElement(summaryTime)
        animateElement(summaryLocation)
        animateElement(summaryDestination)
      }
    })
    document.querySelector(".book-btn").addEventListener("click", () => {
      // Check if all required fields are filled
      const missingFields = []
    
      if (summaryDate.textContent === "Not Specified") missingFields.push("Date")
      if (summaryTime.textContent === "Not Specified") missingFields.push("Time")
      if (fromLocationInput.value.trim() === "") missingFields.push("From Location")
      if (toLocationInput.value.trim() === "") missingFields.push("To Location")
    
      if (missingFields.length > 0) {
        alert(`Please fill in the following required fields:\n${missingFields.join("\n")}`)
        return
      }
    
      // Get all the booking details
      const date = summaryDate.textContent
      const time = summaryTime.textContent
      const fromLocation = fromLocationInput.value
      const toLocation = toLocationInput.value
      const fromSpecificInfo = specificInfo1.value
      const toSpecificInfo = specificInfo2.value
    
      // Store the data in localStorage
      const appointmentData = {
        date,
        time,
        fromLocation,
        toLocation,
        fromSpecificInfo,
        toSpecificInfo
      }
      
      localStorage.setItem('appointmentData', JSON.stringify(appointmentData))
      
      // Continue to confirmation page
      window.location.href = "bookapptconfirmation copy.html"
    })
  })
  
  