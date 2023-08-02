function copyEmail() {}

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

document.addEventListener('DOMContentLoaded', function () {
  const navbarLinks = document.querySelectorAll('nav a');
  const sections = document.querySelectorAll('section');

  const tocLinks = document.querySelectorAll('.toc_anchor');
  const headingSections = document.querySelectorAll('.markdown-body h2, h3');

  /* const sections = document.querySelectorAll('section'); */
  // Function to check if an element is in the viewport
  function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    const windowHeight =
      window.innerHeight || document.documentElement.clientHeight;
    const vertInView =
      rect.top <= windowHeight / 2 && rect.bottom >= windowHeight / 2;
    return vertInView;
  }

  // Function to update the active link based on the current section in the viewport
  function updateActiveLink(sections, highlightActive) {
    sections.forEach((section) => {
      const sectionId = section.getAttribute('id');
      /* const correspondingLink = document.querySelector( */
      /*   `nav a[href="#${sectionId}"]` */
      /* ); */
      const correspondingLink = document.querySelector(
        `a[href="#${sectionId}"]`
      );

      if (isInViewport(section)) {
        // Remove the "active" class from all links
        navbarLinks.forEach((link) => {
          link.classList.remove(highlightActive);
        });

        // Add the "active" class to the corresponding link
        correspondingLink.classList.add(highlightActive);
      }
    });
  }

  function updateTocActiveLink(sections, highlightActive) {
    sections.forEach((section) => {
      const sectionId = section.getAttribute('id');
      /* const correspondingLink = document.querySelector( */
      /*   `nav a[href="#${sectionId}"]` */
      /* ); */
      const correspondingLink = document.querySelector(
        `a[href="#${sectionId}"]`
      );

      const rect = section.getBoundingClientRect();
      const windowHeight =
        window.innerHeight || document.documentElement.clientHeight;
      const vertInView =
        windowHeight / 12 <= rect.top && windowHeight / 12 + 250 >= rect.bottom;
      /* && rect.bottom >= windowHeight / 4; */

      if (vertInView) {
        // Remove the "active" class from all links
        tocLinks.forEach((link) => {
          link.classList.remove(highlightActive);
        });
        correspondingLink.classList.add(highlightActive);
        // Add the "active" class to the corresponding link
      }
    });
  }

  // Update active link on initial page load
  updateActiveLink(sections, 'active');
  updateTocActiveLink(headingSections, 'toc_highlight');

  // Update active link on scroll
  window.addEventListener('scroll', function () {
    updateActiveLink(sections, 'active');
  });

  window.addEventListener('scroll', function () {
    updateTocActiveLink(headingSections, 'toc_highlight');
  });

  // Handle link click events
  navbarLinks.forEach((link) => {
    link.addEventListener('click', function (event) {
      const href = this.getAttribute('href');
      if (href[0] === '#') event.preventDefault(); // Prevent default link navigation

      const targetSectionId = this.getAttribute('href');

      // Remove the "active" class from all links
      navbarLinks.forEach((link) => {
        link.classList.remove('active');
      });
      this.classList.add('active');
      // Add the "active" class to the clicked link

      scrollToSection(targetSectionId, 95);
      /* overflow-x: visible; */
    });
  });

  tocLinks.forEach((link) => {
    link.addEventListener('click', function (event) {
      const href = this.getAttribute('href');
      if (href[0] === '#') event.preventDefault(); // Prevent default link navigation

      const targetSectionId = this.getAttribute('href');

      // Remove the "active" class from all links
      tocLinks.forEach((link) => {
        link.classList.remove('toc_highlight');
      });
      this.classList.add('toc_highlight');
      // Add the "active" class to the clicked link

      // Scroll to the target section after a small delay (e.g., 300ms)
      /* document.querySelector(targetSectionId).scrollIntoView({ */
      /*   behavior: 'smooth', */
      /* }); */
      scrollToSection(targetSectionId, 100);
    });
  });

  // Function to scroll a section into view and place it at a certain window height
  function scrollToSection(sectionId, offsetFromTop) {
    console.log(sectionId)
    const section = document.querySelector(sectionId);
    console.log(section)
    if (section) {
      const rect = section.getBoundingClientRect();
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      const targetScrollPosition = rect.top + scrollTop - offsetFromTop;

      // Scroll to the target position
      window.scroll({
        top: targetScrollPosition,
        behavior: 'smooth', // Use 'auto' for instant scroll without animation
      });
    }
  }
  // Example: Scroll to 'section2' and place it at 100 pixels from the top of the window
});
