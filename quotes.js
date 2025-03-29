document.addEventListener('DOMContentLoaded', function() {
    // Navigation button functionality
    const navButtons = document.querySelectorAll('.nav-button');
    
    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            navButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');
        });
    });

    // Logout button functionality
    const logoutButton = document.querySelector('.logout-button');
    
    logoutButton.addEventListener('click', () => {
        // In a real application, this would handle logout logic
        alert('Logging out...');
    });

    // Email click handler
    const emailLinks = document.querySelectorAll('.email a');
    
    emailLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // This will open the default email client
            console.log('Opening email client for:', link.textContent);
        });
    });

    // Add quote status indicators (if needed)
    function addQuoteStatus() {
        const quoteCards = document.querySelectorAll('.quote-card');
        quoteCards.forEach(card => {
            const statusBadge = document.createElement('span');
            statusBadge.className = 'status-badge';
            statusBadge.textContent = 'Pending';
            card.querySelector('.quote-header').appendChild(statusBadge);
        });
    }

    // Uncomment to add status badges
    // addQuoteStatus();
});