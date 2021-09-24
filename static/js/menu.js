const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

function hamburgerMenu()
{
    hamburger.innerHTML = navLinks.classList.contains("active") ? "<i class='icon-font fas fa-bars'></i>" : "<i class='icon-font fas fa-times'></i>";
    navLinks.classList.toggle('active');
}

// ** FADE OUT FUNCTION **
function fadeOut() 
{
    navLinks.style.opacity = 1;
    (function fade() 
    {
        if ((navLinks.style.opacity -= 0.1) < 0) 
        {
            hamburger.innerHTML = "<i class='icon-font fas fa-bars'></i>";
            navLinks.classList.toggle('active'); 
            navLinks.style.opacity = 1;
        } else {
            requestAnimationFrame(fade);
        }
    })();
};

hamburger.addEventListener('click', hamburgerMenu, false);
navLinks.addEventListener('click', function() {
    if (!navLinks.classList.contains("active"))
    {
        return;
    }
    fadeOut();
})