/*=========== Active link=============*/
const navlink = document.querySelectorAll('.nav__link');

function activeLink() {
    navlink.forEach((a) => a.classList.remove('active-link'));
    this.classList.add('active-link');
}

navlink.forEach((a) => a.addEventListener('click', activeLink));



/*============= Background header ==========*/
function scrollHeader() {
    const header = document.getElementById('header');
    //when the scroll is greater than 50 viewpoint height, add the scroll-header class to header tag
    if (this.scrollY >= 50) header.classList.add('scroll-header');
    else header.classList.remove('scroll-header');
}

window.addEventListener('scroll', scrollHeader);





/*============= Mixitup Filter ==========*/
let mixerProjects = mixitup('.projects__container', {
    selectors: {
        target: '.project__item',
    },
    animation: {
        duration: 300,
    },
});

/*Active work*/
const linkWork = document.querySelectorAll('.category__btn');

function activeWork() {
    linkWork.forEach((a) => a.classList.remove('active-work'));
    this.classList.add('active-work');
}

linkWork.forEach((a) => a.addEventListener('click', activeWork));


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
const counter = document.querySelector(".count-number");
async function updateCounter() {
    try {
        const response = await fetch("https://g37as1k6b9.execute-api.us-east-1.amazonaws.com/api-stage/countVisitors")

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
updateCounter();