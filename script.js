
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
const contactForm = document.getElementById('contact-form'),
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

contactForm.addEventListener('submit', sendEmail)


// JS code to display views
/*const counter = document.querySelector(".count-number");
async function updateCounter() {
    try {
        const response = await fetch("https://ezv1ti2rw2.execute-api.us-east-1.amazonaws.com/api-stage/countVisitors")

        if (response.ok) {
            const data = await response.json();
            counter.textContent = `Number of page visits: ${data.visits}`;
        } else {
            console.error("Failed to update counter:", response.statusText)
        }
    } catch (error) {
        console.error("An error occurred:", error);
    }
}
updateCounter();*/

document.addEventListener("DOMContentLoaded", () => {
    const counter = document.querySelector(".count-number");

    async function updateCounter() {
        console.log("Fetching visitor count...");  // Debugging line
        try {
            const response = await fetch("https://ezv1ti2rw2.execute-api.us-east-1.amazonaws.com/api-stage/countVisitors");

            if (response.ok) {
                const data = await response.json();
                console.log(data);  // Log the entire response object to check the data
                if (data && data.visits) {
                    counter.textContent = `This page has been viewed ${data.visits} times`;  // Update the counter
                } else {
                    console.error("Visitor count not found in response:", data);
                }
            } else {
                console.error("Failed to update counter. Status:", response.statusText);
            }
        } catch (error) {
            console.error("An error occurred while fetching the visitor count:", error);
        }
    }

    updateCounter();
});


