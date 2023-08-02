function copyEmail() {
  
}

function toggleMenu() {
  const menu = document.getElementById('nav-list');
  console.log(menu, 'menu');
  const closeIcon = document.querySelector('.closeIcon');
  const menuIcon = document.querySelector('.menuIcon');

  if (menu.classList.contains('showMenu')) {
    menu.classList.remove('showMenu');
    closeIcon.style.display = 'none';
    menuIcon.style.display = 'block';
  } else {
    menu.classList.add('showMenu');
    closeIcon.style.display = 'block';
    menuIcon.style.display = 'none';
  }
  /* menu.classList.append("showMenu"); */
}

document.addEventListener('DOMContentLoaded', function() {
  const navbarLinks = document.querySelectorAll('nav a');
  const sections = document.querySelectorAll('section');

  // Function to check if an element is in the viewport
  function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    const windowHeight =
      window.innerHeight || document.documentElement.clientHeight;
    const windowWidth =
      window.innerWidth || document.documentElement.clientWidth;
    const vertInView =
      rect.top <= windowHeight / 2 && rect.bottom >= windowHeight / 2;
    const horInView =
      rect.left <= windowWidth / 2 && rect.right >= windowWidth / 2;
    return vertInView && horInView;
  }

  // Function to update the active link based on the current section in the viewport
  function updateActiveLink() {
    sections.forEach((section) => {
      const sectionId = section.getAttribute('id');
      const correspondingLink = document.querySelector(
        `nav a[href="#${sectionId}"]`
      );

      if (isInViewport(section)) {
        // Remove the "active" class from all links
        navbarLinks.forEach((link) => {
          link.classList.remove('active');
        });

        // Add the "active" class to the corresponding link
        correspondingLink.classList.add('active');
      }
    });
  }

  // Update active link on initial page load
  updateActiveLink();

  // Update active link on scroll
  window.addEventListener('scroll', updateActiveLink);

  // Handle link click events
  navbarLinks.forEach((link) => {
    link.addEventListener('click', function(event) {
      const href = this.getAttribute('href');
      if (href[0] === '#') event.preventDefault(); // Prevent default link navigation

      const targetSectionId = this.getAttribute('href');

      // Remove the "active" class from all links
      navbarLinks.forEach((link) => {
        link.classList.remove('active');
      });
      this.classList.add('active');
      // Add the "active" class to the clicked link

      // Scroll to the target section after a small delay (e.g., 300ms)
      document.querySelector(targetSectionId).scrollIntoView({
        behavior: 'smooth',
      });
    });
  });
});
