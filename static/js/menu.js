const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

function hamburgerMenu()
{
    hamburger.innerHTML = navLinks.classList.contains("active") ? "<i class='icon-font fas fa-bars'></i>" : "<i class='icon-font fas fa-times'></i>";
    navLinks.classList.toggle('active');
}

hamburger.addEventListener('click', hamburgerMenu, false);