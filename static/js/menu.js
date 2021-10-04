"use strict";

const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

function toggleMenu()
{
    hamburger.innerHTML = navLinks.classList.contains("active") ? "<i class='icon-font fas fa-bars'></i>" : "<i class='icon-font fas fa-times'></i>";
    navLinks.classList.toggle('active');
}

function toggleNav() {
    if (!navLinks.classList.contains("active"))
    {
        return;
    }
    toggleMenu();
}