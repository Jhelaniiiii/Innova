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

    // Sort jobs by payment amount (highest to lowest)
    const jobsList = document.querySelector('.jobs-list');
    const jobs = Array.from(jobsList.children);
    
    function sortJobsByPayment() {
        jobs.sort((a, b) => {
            const amountA = parseFloat(a.querySelector('.payment').textContent
                .match(/\$([0-9,]+(\.[0-9]{2})?)/)[1].replace(',', ''));
            const amountB = parseFloat(b.querySelector('.payment').textContent
                .match(/\$([0-9,]+(\.[0-9]{2})?)/)[1].replace(',', ''));
            return amountB - amountA; // Sort highest to lowest
        });

        jobs.forEach(job => {
            jobsList.appendChild(job);
        });
    }

    // Calculate and display total earnings
    function calculateTotalEarnings() {
        const total = jobs.reduce((sum, job) => {
            const amount = parseFloat(job.querySelector('.payment').textContent
                .match(/\$([0-9,]+(\.[0-9]{2})?)/)[1].replace(',', ''));
            return sum + amount;
        }, 0);

        const totalElement = document.createElement('div');
        totalElement.className = 'total-earnings';
        totalElement.innerHTML = `<strong>Total Earnings:</strong> $${total.toFixed(2)}`;
        document.querySelector('.main-content').insertBefore(
            totalElement, 
            document.querySelector('.jobs-list')
        );
    }

    // Initial sort and calculations
    sortJobsByPayment();
    calculateTotalEarnings();
});