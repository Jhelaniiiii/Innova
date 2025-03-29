document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('wireTransferForm');
    const amountInput = document.getElementById('amount');

    // Initialize summary with exact values from the image
    updateSummary({
        total: 4000.00,
        fee: 450.00,
        transfer: 3550.00
    });

    // Format amount input with currency
    amountInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/[^0-9.]/g, '');
        if (value) {
            value = parseFloat(value).toFixed(2);
            e.target.value = value;
            
            // Calculate fees (11.25% of total amount)
            const total = parseFloat(value);
            const fee = total * 0.1125;
            const transfer = total - fee;
            
            updateSummary({
                total: total,
                fee: fee,
                transfer: transfer
            });
        }
    });

    function updateSummary({ total, fee, transfer }) {
        // Format numbers to match the exact format in the image
        const formatCurrency = (amount) => {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }).format(amount);
        };

        // Update the summary panel with the formatted values
        document.querySelector('.total-amount .amount').textContent = formatCurrency(total);
        document.querySelector('.fee p').textContent = formatCurrency(fee);
        document.querySelector('.transfer-amount p').textContent = formatCurrency(transfer);

        // Update estimated arrival date
        const arrivalDate = new Date();
        arrivalDate.setDate(arrivalDate.getDate() + 3); // Add 3 days
        const formattedDate = arrivalDate.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
        document.querySelector('.estimated-arrival p').textContent = 
            `${formattedDate} (1-3 days)`;
    }

    // Handle form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Basic form validation
        const requiredFields = [
            'senderName',
            'senderBank',
            'senderAccount',
            'recipientName',
            'recipientBank',
            'recipientAccount',
            'amount',
            'securityCode'
        ];

        let isValid = true;
        requiredFields.forEach(field => {
            const element = document.getElementById(field);
            if (!element.value) {
                isValid = false;
                element.classList.add('error');
            } else {
                element.classList.remove('error');
            }
        });

        // Validate security code format (6 digits)
        const securityCode = document.getElementById('securityCode').value;
        if (!/^\d{6}$/.test(securityCode)) {
            isValid = false;
            document.getElementById('securityCode').classList.add('error');
            alert('Please enter a valid 6-digit security code');
            return;
        }

        if (isValid) {
            // In a real application, this would submit the transfer
            console.log('Processing transfer...');
        }
    });

    // Format account number inputs
    const accountInputs = [
        document.getElementById('senderAccount'),
        document.getElementById('recipientAccount')
    ];

    accountInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
            e.target.value = value;
        });
    });
});