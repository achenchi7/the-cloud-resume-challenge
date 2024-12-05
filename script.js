
// Window scroll
$(window).on("scroll", function() {
    var scrollTop = $(window).scrollTop();
    if(scrollTop >= 100){
        $('body').addClass('fixed-header');
    } else {
        $('body').removeClass('fixed-header')
    }
});

//Document Ready
$(document).ready(function() {

    //Typing animation
    new Typed('#type-it', {
        Strings: ['Cloud-Engineer', 'DevOps-Engineer'],
        typeSpeed: 100,
        loop: true
    });
});

/*=============== EMAIL JS ===============*/
/*const contactForm = document.getElementById('contact-form'),
      contactMessage = document.getElementById('contact-message')

const sendEmail = (e) =>{
    e.preventDefault()

    // serviceID - templateID - #form - publicKey
    emailjs.sendForm('service_suimnoj','template_bzkrnso','#contact-form','uAIl64g81Xm7yxa9I')
    .then(() =>{
        //show sent message
        contactMessage.textContent = 'Message sent successfully ✅'

        // Remove message after five seconds
        setTimeout(() =>{
            contactMessage.textContent = ''
        }, 5000)
    
        //clear input fields
        contactForm.reset()
    
    }, () =>{
        //show error message
        contactMessage.textContent = 'Message not sent (service error) ❌'
    })
      
}

contactForm.addEventListener('submit', sendEmail)*/


document.addEventListener("DOMContentLoaded", () => {
    const counter = document.querySelector(".count-number"); // Target the counter element

    async function updateCounter() {
        console.log("Fetching visitor count..."); // Debugging
        try {
            const response = await fetch("https://g37as1k6b9.execute-api.us-east-1.amazonaws.com/api-stage/countVisitors");

            if (response.ok) {
                const data = await response.json();
                console.log("API Response:", data); // Log response for debugging
                if (data && data.visitors !== undefined) {
                    counter.textContent = `This page has been viewed ${data.visitors} times.`; // Update the counter
                } else {
                    counter.textContent = "Visitor count unavailable.";
                    console.error("Visitor count not found in response:", data);
                }
            } else {
                counter.textContent = "Error fetching visitor count.";
                console.error(`HTTP error! Status: ${response.status}`);
            }
        } catch (error) {
            counter.textContent = "An error occurred while fetching visitor count.";
            console.error("Error during fetch:", error);
        }
    }

    updateCounter(); // Call the function to update the counter
});



