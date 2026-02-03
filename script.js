// ============================================
// Travel Itinerary Generator - JavaScript
// Academic Capstone Project: Cursor AI - Vibe Code Mastery Cycle 2
// ============================================

// Wait for the DOM (Document Object Model) to fully load before executing code
// This ensures all HTML elements are available before we try to access them
document.addEventListener('DOMContentLoaded', function() {
    
    // ============================================
    // Get References to HTML Elements
    // ============================================
    
    // Select the form element using its ID
    const form = document.getElementById('itinerary-form');
    
    // Select the message container where we'll display success/error messages
    const messageContainer = document.getElementById('message-container');
    
    // ============================================
    // Form Submit Event Listener
    // ============================================
    
    // Get references to popup elements
    const popupOverlay = document.getElementById('response-popup-overlay');
    const popupContent = document.getElementById('popup-content');
    const popupCloseBtn = document.getElementById('popup-close-btn');
    const submitBtn = document.getElementById('submit-btn');
    
    // Add an event listener to handle when the form is submitted
    form.addEventListener('submit', function(event) {
        // Always prevent default - we send data via fetch to get a response
        event.preventDefault();
        
        // Clear any previous messages first
        clearMessage();
        
        // Validate all form fields
        const validationResult = validateForm();
        
        if (!validationResult.isValid) {
            showMessage(validationResult.errorMessage, 'error');
            return;
        }
        
        // Validation passed: send to webhook and wait for response
        sendToWebhookAndShowResponse();
    });
    
    // ============================================
    // Send to Webhook and Display Response
    // ============================================
    
    /**
     * Sends form data to the n8n webhook URL, waits for the response,
     * and displays it in a scrollable popup.
     */
    async function sendToWebhookAndShowResponse() {
        const webhookUrl = form.getAttribute('action');
        
        // Build form data (same fields as the form – n8n can read JSON or form-encoded body)
        const formData = {
            destination: document.getElementById('destination').value.trim(),
            days: document.getElementById('days').value,
            budget: document.getElementById('budget').value,
            travelMode: document.getElementById('travelMode').value,
            travelers: document.getElementById('travelers').value,
            email: document.getElementById('email').value.trim(),
            preferences: document.getElementById('preferences').value.trim() || ''
        };
        
        // Show loading state on the button
        const originalButtonText = submitBtn.textContent;
        submitBtn.textContent = 'Generating…';
        submitBtn.disabled = true;
        
        showMessage('Sending your request. Please wait…', 'success');
        
        try {
            // Send POST request and wait for the response
            // Using JSON; if your n8n workflow expects form-encoded data, use: body: new URLSearchParams(formData)
            const response = await fetch(webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            
            // Parse the response body (JSON or plain text)
            let responseData;
            if (response.status === 204) {
                responseData = '(No content returned)';
            } else {
                const contentType = response.headers.get('content-type');
                if (contentType && contentType.includes('application/json')) {
                    responseData = await response.json();
                } else {
                    responseData = await response.text();
                }
            }
            
            // Format content for display
            let displayContent;
            if (typeof responseData === 'object' && responseData !== null) {
                displayContent = JSON.stringify(responseData, null, 2);
            } else {
                displayContent = String(responseData || '(Empty response)');
            }
            
            // Show the response in the popup
            showPopup(displayContent, response.ok);
            
        } catch (error) {
            // Network or other error
            showPopup(
                'Error: ' + (error.message || 'Could not reach the server. Please check your connection and the webhook URL.'),
                false
            );
        } finally {
            // Restore the button
            submitBtn.textContent = originalButtonText;
            submitBtn.disabled = false;
            clearMessage();
        }
    }
    
    // ============================================
    // Popup: Show, Close, and Helpers
    // ============================================
    
    /**
     * Shows the popup with the given content.
     * @param {string} content - Text or HTML to show in the scrollable area
     * @param {boolean} isSuccess - If true, uses success styling; otherwise error styling
     */
    function showPopup(content, isSuccess) {
        popupContent.textContent = content;
        popupOverlay.classList.remove('popup-error');
        if (!isSuccess) {
            popupOverlay.classList.add('popup-error');
        }
        popupOverlay.classList.add('popup-open');
        popupOverlay.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        
        // Focus the close button for accessibility
        popupCloseBtn.focus();
    }
    
    /**
     * Hides the popup and restores page scroll.
     */
    function closePopup() {
        popupOverlay.classList.remove('popup-open', 'popup-error');
        popupOverlay.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }
    
    // Close button click
    popupCloseBtn.addEventListener('click', closePopup);
    
    // Clicking the overlay (outside the modal) also closes the popup
    popupOverlay.addEventListener('click', function(event) {
        if (event.target === popupOverlay) {
            closePopup();
        }
    });
    
    // Close with Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && popupOverlay.classList.contains('popup-open')) {
            closePopup();
        }
    });
    
    // ============================================
    // Form Validation Function
    // ============================================
    
    /**
     * Validates all required form fields
     * @returns {Object} An object with isValid (boolean) and errorMessage (string)
     */
    function validateForm() {
        
        // Get all form field values and trim whitespace
        const destination = document.getElementById('destination').value.trim();
        const days = document.getElementById('days').value.trim();
        const budget = document.getElementById('budget').value.trim();
        const travelMode = document.getElementById('travelMode').value;
        const travelers = document.getElementById('travelers').value.trim();
        const email = document.getElementById('email').value.trim();
        
        // ============================================
        // Validate Destination Field
        // ============================================
        if (destination === '') {
            return {
                isValid: false,
                errorMessage: 'Please enter a destination or location.'
            };
        }
        
        // ============================================
        // Validate Number of Days Field
        // ============================================
        if (days === '') {
            return {
                isValid: false,
                errorMessage: 'Please enter the number of days for your trip.'
            };
        }
        
        // Convert to number and check if it's valid
        const daysNumber = parseInt(days);
        if (isNaN(daysNumber) || daysNumber < 1 || daysNumber > 30) {
            return {
                isValid: false,
                errorMessage: 'Please enter a valid number of days (between 1 and 30).'
            };
        }
        
        // ============================================
        // Validate Budget Field
        // ============================================
        if (budget === '') {
            return {
                isValid: false,
                errorMessage: 'Please enter your budget amount.'
            };
        }
        
        // Convert to number and check if it's valid
        const budgetNumber = parseFloat(budget);
        if (isNaN(budgetNumber) || budgetNumber < 0) {
            return {
                isValid: false,
                errorMessage: 'Please enter a valid budget amount (must be 0 or greater).'
            };
        }
        
        // ============================================
        // Validate Mode of Travel Field
        // ============================================
        if (travelMode === '') {
            return {
                isValid: false,
                errorMessage: 'Please select a mode of travel.'
            };
        }
        
        // ============================================
        // Validate Number of Travelers Field
        // ============================================
        if (travelers === '') {
            return {
                isValid: false,
                errorMessage: 'Please enter the number of travelers.'
            };
        }
        
        // Convert to number and check if it's valid
        const travelersNumber = parseInt(travelers);
        if (isNaN(travelersNumber) || travelersNumber < 1 || travelersNumber > 20) {
            return {
                isValid: false,
                errorMessage: 'Please enter a valid number of travelers (between 1 and 20).'
            };
        }
        
        // ============================================
        // Validate Email Field
        // ============================================
        if (email === '') {
            return {
                isValid: false,
                errorMessage: 'Please enter your email address.'
            };
        }
        
        // Validate email format using a regular expression pattern
        // This pattern checks for: text@text.text format
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            return {
                isValid: false,
                errorMessage: 'Please enter a valid email address (e.g., example@email.com).'
            };
        }
        
        // ============================================
        // All Validations Passed
        // ============================================
        // If we reach here, all fields are valid
        return {
            isValid: true,
            errorMessage: ''
        };
    }
    
    // ============================================
    // Display Message Function
    // ============================================
    
    /**
     * Displays a message to the user (success or error)
     * @param {string} message - The message text to display
     * @param {string} type - The message type: 'success' or 'error'
     */
    function showMessage(message, type) {
        // Remove any existing message classes
        messageContainer.classList.remove('success', 'error');
        
        // Add the appropriate class based on message type
        // This will apply the correct styling (green for success, red for error)
        messageContainer.classList.add(type);
        
        // Set the message text content
        messageContainer.textContent = message;
        
        // Scroll to the message container so the user can see it
        messageContainer.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'nearest' 
        });
    }
    
    // ============================================
    // Clear Message Function
    // ============================================
    
    /**
     * Clears any existing message from the message container
     */
    function clearMessage() {
        // Remove all message classes
        messageContainer.classList.remove('success', 'error');
        
        // Clear the message text
        messageContainer.textContent = '';
    }
    
});
