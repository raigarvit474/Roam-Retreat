document.addEventListener('DOMContentLoaded', () => {
    const listingElement = document.querySelector('.row[data-listing-id]');
    const pricePerNight = listingElement.getAttribute('data-listing-price');
    const gstRate = 0.18;

    const basePriceSpan = document.getElementById('basePrice');
    const gstAmountSpan = document.getElementById('gstAmount');
    const totalPriceSpan = document.getElementById('totalPrice');
    const startDatePicker = document.getElementById('startDate');
    const endDatePicker = document.getElementById('endDate');

    const hiddenStartDate = document.getElementById('hiddenStartDate');
    const hiddenEndDate = document.getElementById('hiddenEndDate');
    const hiddenTotalPrice = document.getElementById('hiddenTotalPrice');

    let startFlatpickr;
    let endFlatpickr;

    function calculateTotalPrice() {
        const startDate = flatpickr.parseDate(startDatePicker.value, "Y-m-d");
        const endDate = flatpickr.parseDate(endDatePicker.value, "Y-m-d");

        if (startDate && endDate) {
            const timeDifference = endDate - startDate;
            const days = Math.ceil(timeDifference / (1000 * 3600 * 24));

            if (days > 0) {
                const basePrice = days * pricePerNight;
                const gstAmount = basePrice * gstRate;
                const totalPrice = basePrice + gstAmount;

                basePriceSpan.textContent = basePrice.toFixed(2);
                gstAmountSpan.textContent = gstAmount.toFixed(2);
                totalPriceSpan.textContent = totalPrice.toFixed(2);

                hiddenStartDate.value = startDatePicker.value;
                hiddenEndDate.value = endDatePicker.value;
                hiddenTotalPrice.value = totalPrice.toFixed(2);
            } else {
                basePriceSpan.textContent = "0.00";
                gstAmountSpan.textContent = "0.00";
                totalPriceSpan.textContent = "0.00";
            }
        }
    }

    startFlatpickr = flatpickr(startDatePicker, {
        minDate: 'today',
        onChange: function(selectedDates) {
            if (selectedDates.length > 0) {
                const minEndDate = new Date(selectedDates[0]);
                minEndDate.setDate(minEndDate.getDate() + 1);
                endFlatpickr.set('minDate', minEndDate);
                calculateTotalPrice();
            }
        }
    });

    endFlatpickr = flatpickr(endDatePicker, {
        minDate: 'today',
        onChange: function() {
            calculateTotalPrice();
        }
    });
});
