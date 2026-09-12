document.addEventListener("DOMContentLoaded", () => {
  // Alternar menú de navegación móvil
  const menuToggle = document.getElementById("menu-toggle");
  const navMenu = document.getElementById("nav-menu");

  if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", () => {
      navMenu.classList.toggle("open");
    });
  }

  // Actualización dinámica de fechas en el pie de página
  const currentYearSpan = document.getElementById("current-year");
  const lastModifiedSpan = document.getElementById("last-modified");

  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }
  if (lastModifiedSpan) {
    lastModifiedSpan.textContent = document.lastModified;
  }

  // Carga asíncrona de datos JSON
  const membersContainer = document.getElementById("members-container");
  const btnGrid = document.getElementById("btn-grid");
  const btnList = document.getElementById("btn-list");

  if (membersContainer) {
    fetchMembers();
  }

  async function fetchMembers() {
    try {
      const response = await fetch("data/members.json");
      if (!response.ok) {
        throw new Error("Error al cargar datos de los miembros");
      }
      const members = await response.json();
      displayMembers(members);
    } catch (error) {
      console.error(error);
      membersContainer.innerHTML = "<p>No se pudo cargar el directorio de miembros.</p>";
    }
  }

  function displayMembers(members) {
    membersContainer.innerHTML = "";
    const membershipNames = { 1: "Miembro Base", 2: "Membresía Plata", 3: "Membresía Oro" };

    members.forEach((member) => {
      const card = document.createElement("section");
      card.className = "member-card";

      card.innerHTML = `
        <img src="images/${member.image}" alt="Logo de ${member.name}" loading="lazy">
        <h3>${member.name}</h3>
        <p class="tagline">${member.tagline || ''}</p>
        <p><strong>Dirección:</strong> ${member.address}</p>
        <p><strong>Teléfono:</strong> ${member.phone}</p>
        <p><a href="${member.website}" target="_blank" rel="noopener noreferrer">${member.website.replace('https://', '')}</a></p>
        <span class="level level-${member.membership_level}">${membershipNames[member.membership_level] || 'Miembro'}</span>
      `;

      membersContainer.appendChild(card);
    });
  }

  // Conmutador de vista Cuadrícula / Lista
  if (btnGrid && btnList) {
    btnGrid.addEventListener("click", () => {
      membersContainer.classList.add("grid");
      membersContainer.classList.remove("list");
      btnGrid.classList.add("active");
      btnList.classList.remove("active");
    });

    btnList.addEventListener("click", () => {
      membersContainer.classList.add("list");
      membersContainer.classList.remove("grid");
      btnList.classList.add("active");
      btnGrid.classList.remove("active");
    });
  }
});