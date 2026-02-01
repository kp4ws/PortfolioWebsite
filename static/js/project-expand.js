document.addEventListener('DOMContentLoaded', function () {
  const toggleButtons = document.querySelectorAll('.expand-toggle');

  toggleButtons.forEach(button => {
    button.addEventListener('click', function (e) {
      e.preventDefault();
      toggleDetails(this);
    });
  });

  // Handle close buttons
  const closeButtons = document.querySelectorAll('.details-close');
  closeButtons.forEach(button => {
    button.addEventListener('click', function (e) {
      e.preventDefault();
      const article = this.closest('.project-card');
      const toggleButton = article.querySelector('.expand-toggle');
      toggleDetails(toggleButton);
    });
  });

  function toggleDetails(button) {
    const isExpanded = button.getAttribute('aria-expanded') === 'true';
    const article = button.closest('.project-card');
    const details = article.querySelector('.project-details');

    if (!details) return;

    // Toggle the expanded state
    button.setAttribute('aria-expanded', !isExpanded);
    details.classList.toggle('expanded');
  }
});
