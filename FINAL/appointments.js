document.addEventListener('DOMContentLoaded', function() {
    // Mobile sidebar functionality
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const closeSidebar = document.getElementById('closeSidebar');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    
    function toggleSidebar() {
        sidebar.classList.toggle('active');
        overlay.classList.toggle('active');
        mobileMenuToggle.classList.toggle('active');
        document.body.classList.toggle('sidebar-open');
        
        // Prevent scrolling when sidebar is open
        if (sidebar.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }
    
    function closeSidebarFunc() {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
        document.body.classList.remove('sidebar-open');
        document.body.style.overflow = '';
    }
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', toggleSidebar);
    }
    
    if (closeSidebar) {
        closeSidebar.addEventListener('click', closeSidebarFunc);
    }
    
    if (overlay) {
        overlay.addEventListener('click', closeSidebarFunc);
    }
    
    // Close sidebar when window is resized to desktop size
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            closeSidebarFunc();
        }
    });

	// Add ripple effect to nav buttons
	document.querySelectorAll('.nav-button').forEach(button => {
	    button.addEventListener('click', function(e) {
	        let x = e.clientX - e.target.getBoundingClientRect().left;
	        let y = e.clientY - e.target.getBoundingClientRect().top;
	        
	        let ripple = document.createElement('span');
	        ripple.style.left = `${x}px`;
	        ripple.style.top = `${y}px`;
	        ripple.classList.add('ripple');
	        
	        this.appendChild(ripple);
	        
	        setTimeout(() => {
	            ripple.remove();
	        }, 1000);
	    });
	});
    // Navigation button functionality
    const navButtons = document.querySelectorAll('.nav-button');
    
    // Set initial active state based on current page
    const currentPath = window.location.pathname;
    navButtons.forEach(button => {
        const href = button.getAttribute('href');
        if (href && (currentPath.endsWith(href) || currentPath.split('/').pop() === href)) {
            button.classList.add('active');
        }
        
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            navButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');
            
            // Close sidebar on mobile when a nav item is clicked
            if (window.innerWidth <= 768 && sidebar) {
                sidebar.classList.remove('active');
                if (overlay) overlay.classList.remove('active');
                document.body.classList.remove('sidebar-open');
            }
        });
    });

    // Logout button functionality
    const logoutButton = document.querySelector('.logout-button');
    
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            // Redirect to logout servlet or page
            window.location.href = 'logout.jsp';
        });
    }

    // Get all appointments
    const appointmentsList = document.getElementById('appointmentsList');
    if (!appointmentsList) return; // Exit if no appointments list found
    
    const appointments = Array.from(appointmentsList.querySelectorAll('.appointment-card'));
    const noResultsMessage = document.getElementById('noResults');
    
    // Check if there are fewer than 5 cards and hide search bar if so
    if (appointments.length < 5 && searchBar) {
        searchBar.style.display = 'none';
        
        // Adjust content wrapper margin to account for hidden search bar
        if (contentWrapper) {
            contentWrapper.style.marginTop = 'var(--header-height)';
            contentWrapper.style.height = 'calc(100vh - var(--header-height))';
        }
    }
    
    // Pagination variables
    let currentPage = 1;
    const itemsPerPage = getItemsPerPage(); // Responsive items per page
    let totalPages = Math.ceil(appointments.length / itemsPerPage);
    
    // Function to determine items per page based on screen size
    function getItemsPerPage() {
        if (window.innerWidth <= 576) {
            return 3; // Show fewer items on small screens
        } else if (window.innerWidth <= 992) {
            return 4; // Show more items on medium screens
        } else {
            return 5; // Show most items on large screens
        }
    }
    
    // Update items per page when window is resized
    let filteredAppointments = [...appointments]; // Start with all appointments
    
    window.addEventListener('resize', function() {
        const newItemsPerPage = getItemsPerPage();
        let itemsPerPage = getItemsPerPage();
        if (newItemsPerPage !== itemsPerPage) {
            itemsPerPage = newItemsPerPage;
            totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);
            displayAppointments();
            updatePagination();
        }
    });
    
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    if (searchInput && appointments.length >= 5) {
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase().trim();
            
            // Filter appointments based on search term
            filteredAppointments = appointments.filter(appointment => {
                const text = appointment.textContent.toLowerCase();
                return text.includes(searchTerm);
            });
            
            // Reset to first page when searching
            currentPage = 1;
            
            // Update pagination based on filtered results
            totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);
            updatePagination();
            
            // Display filtered appointments
            displayAppointments();
            
            // Show/hide no results message
            if (noResultsMessage) {
                noResultsMessage.style.display = filteredAppointments.length === 0 ? 'flex' : 'none';
            }
        });
    }

    // Function to display appointments for current page
    function displayAppointments() {
        // Hide all appointments first
        appointments.forEach(appointment => {
            appointment.classList.remove('visible');
            appointment.style.display = 'none';
        });
        
        // Calculate start and end index for current page
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = Math.min(startIndex + itemsPerPage, filteredAppointments.length);
        
        // Show appointments for current page
        for (let i = startIndex; i < endIndex; i++) {
            filteredAppointments[i].classList.add('visible');
            filteredAppointments[i].style.display = 'block';
        }
    }

    // Function to update pagination UI
    function updatePagination() {
        const paginationContainer = document.getElementById('pagination');
        if (!paginationContainer) return;
        
        const totalFilteredPages = Math.ceil(filteredAppointments.length / itemsPerPage);
        const pageNumbers = paginationContainer.querySelector('.page-numbers');
        if (!pageNumbers) return;
        
        const pageButtons = pageNumbers.querySelectorAll('.pagination-btn');
        const ellipsis = pageNumbers.querySelector('.ellipsis');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');

        // Update page buttons
        pageButtons.forEach((button, index) => {
            if (index === 0) {
                button.textContent = '1';
                button.style.display = totalFilteredPages > 0 ? 'flex' : 'none';
            } else if (index === pageButtons.length - 1) {
                button.textContent = totalFilteredPages.toString();
                button.style.display = totalFilteredPages > 1 ? 'flex' : 'none';
            } else {
                let pageNum;
                if (currentPage <= 3) {
                    pageNum = index + 1;
                } else if (currentPage >= totalFilteredPages - 2) {
                    pageNum = totalFilteredPages - (pageButtons.length - 2) + index;
                } else {
                    pageNum = currentPage - 1 + index;
                }
                
                button.textContent = pageNum.toString();
                button.style.display = (pageNum > 1 && pageNum < totalFilteredPages) ? 'flex' : 'none';
            }
            
            button.classList.toggle('active', parseInt(button.textContent) === currentPage);
        });

        // Show/hide ellipsis
        if (ellipsis) {
            ellipsis.style.display = (totalFilteredPages > 5) ? 'inline-block' : 'none';
        }

        // Enable/disable prev/next buttons
        if (prevBtn) {
            prevBtn.disabled = currentPage === 1;
        }
        
        if (nextBtn) {
            nextBtn.disabled = currentPage === totalFilteredPages || totalFilteredPages === 0;
        }
        
        // Hide pagination if no results
        paginationContainer.style.display = totalFilteredPages > 0 ? 'flex' : 'none';
    }

    // Function to change page
    function changePage(newPage) {
        currentPage = newPage;
        displayAppointments();
        updatePagination();
        
        // Scroll to top of content when changing pages
        if (contentWrapper) {
            contentWrapper.scrollTop = 0;
        }
    }

    // Initialize pagination
    if (document.getElementById('pagination')) {
        updatePagination();
        displayAppointments();

        // Pagination event listeners
        const prevBtn = document.getElementById('prevBtn');
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                if (currentPage > 1) changePage(currentPage - 1);
            });
        }

        const nextBtn = document.getElementById('nextBtn');
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                const totalFilteredPages = Math.ceil(filteredAppointments.length / itemsPerPage);
                if (currentPage < totalFilteredPages) changePage(currentPage + 1);
            });
        }

        // Add event listeners to page number buttons
        document.querySelectorAll('.page-numbers .pagination-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const newPage = parseInt(e.target.textContent);
                if (!isNaN(newPage)) changePage(newPage);
            });
        });
    } else {
        // If no pagination, show all appointments
        appointments.forEach(appointment => {
            appointment.style.display = 'block';
        });
    }

    // Add touch swipe functionality for mobile pagination
    let touchStartX = 0;
    let touchEndX = 0;
    
    if (appointmentsList) {
        appointmentsList.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, false);
        
        appointmentsList.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, false);
    }
    
    function handleSwipe() {
        const swipeThreshold = 100; // Minimum distance for swipe
        
        if (touchEndX < touchStartX - swipeThreshold) {
            // Swipe left - next page
            const totalFilteredPages = Math.ceil(filteredAppointments.length / itemsPerPage);
            if (currentPage < totalFilteredPages) changePage(currentPage + 1);
        }
        
        if (touchEndX > touchStartX + swipeThreshold) {
            // Swipe right - previous page
            if (currentPage > 1) changePage(currentPage - 1);
        }
    }
    
    // Add keyboard navigation for accessibility
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            const totalFilteredPages = Math.ceil(filteredAppointments.length / itemsPerPage);
            if (currentPage < totalFilteredPages) changePage(currentPage + 1);
        }
        
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            if (currentPage > 1) changePage(currentPage - 1);
        }
    });
});