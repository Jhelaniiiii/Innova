document.addEventListener("DOMContentLoaded", () => {
  // Mobile sidebar functionality
  const mobileMenuToggle = document.getElementById("mobileMenuToggle")
  const closeSidebar = document.getElementById("closeSidebar")
  const sidebar = document.getElementById("sidebar")
  const overlay = document.getElementById("overlay")
  const searchBar = document.querySelector(".search-bar-search")
  const contentWrapper = document.querySelector(".content-wrapper")
  const paginationContainer = document.getElementById("pagination")

  function toggleSidebar() {
    sidebar.classList.toggle("active")
    overlay.classList.toggle("active")
    document.body.classList.toggle("sidebar-open")
  }

  if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener("click", toggleSidebar)
  }

  if (closeSidebar) {
    closeSidebar.addEventListener("click", toggleSidebar)
  }

  if (overlay) {
    overlay.addEventListener("click", toggleSidebar)
  }

  // Close sidebar when window is resized to desktop size
  window.addEventListener("resize", () => {
    if (window.innerWidth > 768 && sidebar && sidebar.classList.contains("active")) {
      sidebar.classList.remove("active")
      if (overlay) overlay.classList.remove("active")
      document.body.classList.remove("sidebar-open")
    }
  })

  // Navigation button functionality
  const navButtons = document.querySelectorAll(".nav-button")

  // Set initial active state based on current page
  const currentPath = window.location.pathname
  navButtons.forEach((button) => {
    const href = button.getAttribute("href")
    if (href && (currentPath.endsWith(href) || currentPath.split("/").pop() === href)) {
      button.classList.add("active")
    }

    button.addEventListener("click", () => {
      // Remove active class from all buttons
      navButtons.forEach((btn) => btn.classList.remove("active"))
      // Add active class to clicked button
      button.classList.add("active")

      // Close sidebar on mobile when a nav item is clicked
      if (window.innerWidth <= 768 && sidebar) {
        sidebar.classList.remove("active")
        if (overlay) overlay.classList.remove("active")
        document.body.classList.remove("sidebar-open")
      }
    })
  })

  // Tab functionality
  const tabButtons = document.querySelectorAll(".tab-button")
  const tabPanes = document.querySelectorAll(".tab-pane")

  // Set initial active tab (Approved tab)
  function initializeTabs() {
    // First, remove active class from all tabs
    tabButtons.forEach((btn) => btn.classList.remove("active"))
    tabPanes.forEach((pane) => pane.classList.remove("active"))

    // Set the first tab (Approved) as active by default
    const approvedTab = document.querySelector('[data-tab="approved"]')
    if (approvedTab) {
      approvedTab.classList.add("active")
      const approvedPane = document.getElementById("approved-tab")
      if (approvedPane) {
        approvedPane.classList.add("active")
      }
    }
  }

  // Initialize tabs when DOM is loaded
  initializeTabs()

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // Remove active class from all buttons and panes
      tabButtons.forEach((btn) => btn.classList.remove("active"))
      tabPanes.forEach((pane) => pane.classList.remove("active"))

      // Add active class to clicked button
      button.classList.add("active")

      // Show corresponding tab pane
      const tabId = button.getAttribute("data-tab")
      const tabPane = document.getElementById(`${tabId}-tab`)
      if (tabPane) {
        tabPane.classList.add("active")
      }
    })
  })

  // Logout button functionality
  const logoutButton = document.querySelector(".logout-button")

  if (logoutButton) {
    logoutButton.addEventListener("click", () => {
      alert("Logging out...")
    })
  }

  // Get all quotes
  const quotesLists = document.querySelectorAll(".quotes-list")
  if (quotesLists.length === 0) return // Exit if no quotes lists found

  // Process each quotes list
  quotesLists.forEach((quotesList) => {
    const quotes = Array.from(quotesList.querySelectorAll(".quote-card"))

    // Add visible class to all quotes initially
    quotes.forEach((quote) => {
      quote.classList.add("visible")
    })
  })

  const noResultsMessage = document.getElementById("noResults")

  // Search functionality
  const searchInput = document.getElementById("searchInput")
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const searchTerm = e.target.value.toLowerCase().trim()
      let totalVisibleQuotes = 0

      // Get the active tab pane
      const activeTabPane = document.querySelector(".tab-pane.active")
      if (!activeTabPane) return

      // Get quotes in the active tab
      const activeQuotesList = activeTabPane.querySelector(".quotes-list")
      if (!activeQuotesList) return

      const quotes = Array.from(activeQuotesList.querySelectorAll(".quote-card"))

      // Filter quotes based on search term
      quotes.forEach((quote) => {
        const text = quote.textContent.toLowerCase()
        const isVisible = text.includes(searchTerm)

        quote.classList.toggle("visible", isVisible)
        quote.style.display = isVisible ? "block" : "none"

        if (isVisible) {
          totalVisibleQuotes++
        }
      })

      // Show/hide no results message
      if (noResultsMessage) {
        noResultsMessage.style.display = totalVisibleQuotes === 0 ? "flex" : "none"
      }
    })
  }

  // Pagination functionality for quotes
  let currentPage = 1
  let itemsPerPage = getItemsPerPage() // Responsive items per page

  // Function to determine items per page based on screen size
  function getItemsPerPage() {
    if (window.innerWidth <= 576) {
      return 3 // Show fewer items on small screens
    } else if (window.innerWidth <= 992) {
      return 4 // Show more items on medium screens
    } else {
      return 5 // Show most items on large screens
    }
  }

  // Update pagination for the active tab
  function updatePagination() {
    if (!paginationContainer) return

    // Get the active tab pane
    const activeTabPane = document.querySelector(".tab-pane.active")
    if (!activeTabPane) return

    // Get quotes in the active tab
    const activeQuotesList = activeTabPane.querySelector(".quotes-list")
    if (!activeQuotesList) return

    const quotes = Array.from(activeQuotesList.querySelectorAll(".quote-card.visible"))
    const totalPages = Math.ceil(quotes.length / itemsPerPage)

    const pageNumbers = paginationContainer.querySelector(".page-numbers")
    if (!pageNumbers) return

    const pageButtons = pageNumbers.querySelectorAll(".pagination-btn")
    const ellipsis = pageNumbers.querySelector(".ellipsis")
    const prevBtn = document.getElementById("prevBtn")
    const nextBtn = document.getElementById("nextBtn")

    // Update page buttons
    pageButtons.forEach((button, index) => {
      if (index === 0) {
        button.textContent = "1"
        button.style.display = totalPages > 0 ? "flex" : "none"
      } else if (index === pageButtons.length - 1) {
        button.textContent = totalPages.toString()
        button.style.display = totalPages > 1 ? "flex" : "none"
      } else {
        let pageNum
        if (currentPage <= 3) {
          pageNum = index + 1
        } else if (currentPage >= totalPages - 2) {
          pageNum = totalPages - (pageButtons.length - 2) + index
        } else {
          pageNum = currentPage - 1 + index
        }

        button.textContent = pageNum.toString()
        button.style.display = pageNum > 1 && pageNum < totalPages ? "flex" : "none"
      }

      button.classList.toggle("active", Number.parseInt(button.textContent) === currentPage)
    })

    // Show/hide ellipsis
    if (ellipsis) {
      ellipsis.style.display = totalPages > 5 ? "inline-block" : "none"
    }

    // Enable/disable prev/next buttons
    if (prevBtn) {
      prevBtn.disabled = currentPage === 1
    }

    if (nextBtn) {
      nextBtn.disabled = currentPage === totalPages || totalPages === 0
    }

    // Hide pagination if no results
    paginationContainer.style.display = totalPages > 0 ? "flex" : "none"
  }

  // Function to display quotes for current page
  function displayQuotes() {
    // Get the active tab pane
    const activeTabPane = document.querySelector(".tab-pane.active")
    if (!activeTabPane) return

    // Get quotes in the active tab
    const activeQuotesList = activeTabPane.querySelector(".quotes-list")
    if (!activeQuotesList) return

    const quotes = Array.from(activeQuotesList.querySelectorAll(".quote-card.visible"))

    // Hide all quotes first
    quotes.forEach((quote) => {
      quote.style.display = "none"
    })

    // Calculate start and end index for current page
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = Math.min(startIndex + itemsPerPage, quotes.length)

    // Show quotes for current page
    for (let i = startIndex; i < endIndex; i++) {
      if (quotes[i]) {
        quotes[i].style.display = "block"
      }
    }
  }

  // Function to change page
  function changePage(newPage) {
    currentPage = newPage
    displayQuotes()
    updatePagination()

    // Scroll to top of content when changing pages
    if (contentWrapper) {
      contentWrapper.scrollTop = 0
    }
  }

  // Initialize pagination
  if (paginationContainer) {
    updatePagination()
    displayQuotes()

    // Pagination event listeners
    const prevBtn = document.getElementById("prevBtn")
    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        if (currentPage > 1) changePage(currentPage - 1)
      })
    }

    const nextBtn = document.getElementById("nextBtn")
    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        // Get the active tab pane
        const activeTabPane = document.querySelector(".tab-pane.active")
        if (!activeTabPane) return

        // Get quotes in the active tab
        const activeQuotesList = activeTabPane.querySelector(".quotes-list")
        if (!activeQuotesList) return

        const quotes = Array.from(activeQuotesList.querySelectorAll(".quote-card.visible"))
        const totalPages = Math.ceil(quotes.length / itemsPerPage)

        if (currentPage < totalPages) changePage(currentPage + 1)
      })
    }

    // Add event listeners to page number buttons
    document.querySelectorAll(".page-numbers .pagination-btn").forEach((button) => {
      button.addEventListener("click", (e) => {
        const newPage = Number.parseInt(e.target.textContent)
        if (!isNaN(newPage)) changePage(newPage)
      })
    })
  }

  // Update pagination and display quotes when tab changes
  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      currentPage = 1 // Reset to first page when changing tabs
      updatePagination()
      displayQuotes()
    })
  })

  // Update items per page when window is resized
  window.addEventListener("resize", () => {
    const newItemsPerPage = getItemsPerPage()
    if (newItemsPerPage !== itemsPerPage) {
      itemsPerPage = newItemsPerPage
      displayQuotes()
      updatePagination()
    }
  })

  // Add keyboard navigation for accessibility
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      // Get the active tab pane
      const activeTabPane = document.querySelector(".tab-pane.active")
      if (!activeTabPane) return

      // Get quotes in the active tab
      const activeQuotesList = activeTabPane.querySelector(".quotes-list")
      if (!activeQuotesList) return

      const quotes = Array.from(activeQuotesList.querySelectorAll(".quote-card.visible"))
      const totalPages = Math.ceil(quotes.length / itemsPerPage)

      if (currentPage < totalPages) changePage(currentPage + 1)
    }

    if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      if (currentPage > 1) changePage(currentPage - 1)
    }
  })
})
