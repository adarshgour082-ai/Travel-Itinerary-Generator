// ============================================
// Travel Itinerary Generator - Final JavaScript
// Works with n8n Webhook (TEXT response only)
// ============================================

document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("itinerary-form");
    const messageContainer = document.getElementById("message-container");
    const submitBtn = document.getElementById("submit-btn");

    const popupOverlay = document.getElementById("response-popup-overlay");
    const popupContent = document.getElementById("popup-content");
    const popupCloseBtn = document.getElementById("popup-close-btn");

    // --------------------------------------------
    // FORM SUBMIT
    // --------------------------------------------
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        clearMessage();

        const validation = validateForm();
        if (!validation.isValid) {
            showMessage(validation.errorMessage, "error");
            return;
        }

        await sendToWebhook();
    });

    // --------------------------------------------
    // SEND DATA TO N8N WEBHOOK
    // --------------------------------------------
    async function sendToWebhook() {

        const webhookUrl = form.getAttribute("action");

        const formData = {
            destination: document.getElementById("destination").value.trim(),
            days: document.getElementById("days").value,
            budget: document.getElementById("budget").value,
            travelMode: document.getElementById("travelMode").value,
            travelers: document.getElementById("travelers").value,
            email: document.getElementById("email").value.trim(),
            preferences: document.getElementById("preferences").value.trim()
        };

        const originalText = submitBtn.textContent;
        submitBtn.textContent = "Generating...";
        submitBtn.disabled = true;

        showMessage("Generating your itinerary, please wait...", "success");

        try {
            const response = await fetch(webhookUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            // 🔥 IMPORTANT: n8n sends TEXT, not JSON
            const textResponse = await response.text();

            showPopup(
                textResponse || "No response received from server.",
                response.ok
            );

        } catch (error) {
            showPopup(
                "Error connecting to server. Please try again later.",
                false
            );
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            clearMessage();
        }
    }

    // --------------------------------------------
    // POPUP FUNCTIONS
    // --------------------------------------------
    function showPopup(text, isSuccess) {
        popupContent.textContent = text;
        popupOverlay.classList.remove("popup-error");

        if (!isSuccess) {
            popupOverlay.classList.add("popup-error");
        }

        popupOverlay.classList.add("popup-open");
        popupOverlay.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
        popupCloseBtn.focus();
    }

    function closePopup() {
        popupOverlay.classList.remove("popup-open", "popup-error");
        popupOverlay.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
    }

    popupCloseBtn.addEventListener("click", closePopup);

    popupOverlay.addEventListener("click", (e) => {
        if (e.target === popupOverlay) closePopup();
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && popupOverlay.classList.contains("popup-open")) {
            closePopup();
        }
    });

    // --------------------------------------------
    // FORM VALIDATION
    // --------------------------------------------
    function validateForm() {

        const destination = document.getElementById("destination").value.trim();
        const days = parseInt(document.getElementById("days").value);
        const budget = parseFloat(document.getElementById("budget").value);
        const travelMode = document.getElementById("travelMode").value;
        const travelers = parseInt(document.getElementById("travelers").value);
        const email = document.getElementById("email").value.trim();

        if (!destination) {
            return { isValid: false, errorMessage: "Please enter a destination." };
        }

        if (isNaN(days) || days < 1 || days > 30) {
            return { isValid: false, errorMessage: "Days must be between 1 and 30." };
        }

        if (isNaN(budget) || budget < 0) {
            return { isValid: false, errorMessage: "Please enter a valid budget." };
        }

        if (!travelMode) {
            return { isValid: false, errorMessage: "Please select mode of travel." };
        }

        if (isNaN(travelers) || travelers < 1 || travelers > 20) {
            return { isValid: false, errorMessage: "Travelers must be between 1 and 20." };
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return { isValid: false, errorMessage: "Please enter a valid email address." };
        }

        return { isValid: true };
    }

    // --------------------------------------------
    // MESSAGE HELPERS
    // --------------------------------------------
    function showMessage(msg, type) {
        messageContainer.textContent = msg;
        messageContainer.className = "";
        messageContainer.classList.add(type);
        messageContainer.style.display = "block";
    }

    function clearMessage() {
        messageContainer.textContent = "";
        messageContainer.className = "";
        messageContainer.style.display = "none";
    }

});

