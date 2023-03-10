"use strict";

// TODO: If clicked off menu, make menu go away

function toggleMenu(nav)
{
    const hamburger = document.getElementById('hamburger');
    const navLinks = nav ?? document.getElementById('nav-links');

    hamburger.innerHTML = navLinks.classList.contains("active") ? "<i class='icon-font fas fa-bars'></i>" : "<i class='icon-font fas fa-times'></i>";
    navLinks.classList.toggle('active');
}

function toggleNav(nav) {
    if (!nav.classList.contains("active"))
    {
        return;
    }
    toggleMenu(nav);
}