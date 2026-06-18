const translations = {
  en: {
    skip: "Skip to main content",
    home: "Home",
    courses: "Courses",
    resources: "Resources",
    contact: "Contact",
    menuOpen: "Open menu",
    menuClose: "Close menu",
    theme: "Change color theme",
    eyebrow: "Math, technology, and better questions",
    heroTitle: "Welcome. You belong in math class.",
    heroCopy: "I’m Mr. Mendez. This is our classroom hub for weekly assignments, course resources, and the support you need to keep moving forward.",
    findClass: "Find your class",
    contactMe: "Contact Mr. Mendez",
    announcement: "Class announcement",
    classesTitle: "Choose your course",
    classesCopy: "Assignments and resources are organized by course, not by student name.",
    openCourse: "Open course →",
    resourcesTitle: "Tools for learning",
    resourcesCopy: "Reliable places to practice, graph, review, and submit work.",
    viewResources: "View all resources →",
    currentWeek: "Current week",
    priorWeeks: "Previous weeks",
    assignment: "Open assignment ↗",
    noWork: "No assignments have been posted for this week yet.",
    loadError: "Course information could not load. Refresh the page or check Google Classroom.",
    courseUpdated: "Course content is updated weekly.",
    keyInfoEnglish: "Weekly assignment details remain in English.",
    response: "I respond to district email during school days. Please allow up to one school day for a reply.",
    privacyTitle: "Student privacy comes first",
    privacyCopy: "This public website never posts student names, student contact information, grades, or Google Classroom join codes.",
    emailTitle: "District email",
    emailCopy: "The best public way for students, families, and colleagues to reach me.",
    backHome: "Back to home",
    footer: "Classroom hub for Mr. Mendez",
    languageName: "ES"
  },
  es: {
    skip: "Saltar al contenido principal",
    home: "Inicio",
    courses: "Cursos",
    resources: "Recursos",
    contact: "Contacto",
    menuOpen: "Abrir menú",
    menuClose: "Cerrar menú",
    theme: "Cambiar el tema de color",
    eyebrow: "Matemáticas, tecnología y mejores preguntas",
    heroTitle: "Bienvenidos. Aquí todos pertenecen.",
    heroCopy: "Soy el Sr. Mendez. Este es nuestro centro de clase para tareas semanales, recursos del curso y el apoyo necesario para seguir avanzando.",
    findClass: "Encuentra tu clase",
    contactMe: "Contactar al Sr. Mendez",
    announcement: "Anuncio de la clase",
    classesTitle: "Elige tu curso",
    classesCopy: "Las tareas y los recursos están organizados por curso, no por nombre del estudiante.",
    openCourse: "Abrir curso →",
    resourcesTitle: "Herramientas para aprender",
    resourcesCopy: "Lugares confiables para practicar, graficar, repasar y entregar trabajos.",
    viewResources: "Ver todos los recursos →",
    currentWeek: "Semana actual",
    priorWeeks: "Semanas anteriores",
    assignment: "Abrir tarea ↗",
    noWork: "Todavía no se han publicado tareas para esta semana.",
    loadError: "No se pudo cargar la información del curso. Actualiza la página o revisa Google Classroom.",
    courseUpdated: "El contenido del curso se actualiza semanalmente.",
    keyInfoEnglish: "Los detalles de las tareas semanales permanecen en inglés.",
    response: "Respondo al correo del distrito durante los días escolares. Por favor, espere hasta un día escolar para recibir una respuesta.",
    privacyTitle: "La privacidad estudiantil es primero",
    privacyCopy: "Este sitio público nunca publica nombres, datos de contacto, calificaciones ni códigos de acceso de Google Classroom.",
    emailTitle: "Correo del distrito",
    emailCopy: "La mejor manera pública para que estudiantes, familias y colegas se comuniquen conmigo.",
    backHome: "Volver al inicio",
    footer: "Centro de clase del Sr. Mendez",
    languageName: "EN"
  }
};

const state = {
  language: localStorage.getItem("mendez-language") || "en",
  theme: localStorage.getItem("mendez-theme") || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"),
  site: null,
  course: null
};

function applyTheme() {
  document.documentElement.dataset.theme = state.theme;
  document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
    button.setAttribute("aria-label", translations[state.language].theme);
    button.innerHTML = state.theme === "dark"
      ? '<svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.66 6.34l1.41-1.41"/></svg>'
      : '<svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8Z"/></svg>';
  });
}

function applyLanguage() {
  const copy = translations[state.language];
  document.documentElement.lang = state.language;
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const value = copy[element.dataset.i18n];
    if (value) element.textContent = value;
  });
  document.querySelectorAll("[data-language-toggle]").forEach((button) => {
    button.textContent = copy.languageName;
    button.setAttribute("aria-label", state.language === "en" ? "Ver información clave en español" : "View key information in English");
  });
  document.querySelectorAll("[data-menu-toggle]").forEach((button) => {
    const expanded = button.getAttribute("aria-expanded") === "true";
    button.setAttribute("aria-label", expanded ? copy.menuClose : copy.menuOpen);
  });
  if (state.site) {
    document.querySelectorAll("[data-announcement-text]").forEach((element) => {
      element.textContent = state.language === "es" ? state.site.announcementEs : state.site.announcement;
    });
    renderCourses(state.site.courses);
  }
  if (state.course) {
    document.querySelectorAll("[data-course-name]").forEach((element) => { element.textContent = state.language === "es" ? state.course.nameEs : state.course.name; });
    document.querySelectorAll("[data-course-description]").forEach((element) => { element.textContent = state.language === "es" ? state.course.descriptionEs : state.course.description; });
  }
  applyTheme();
}

function setupControls() {
  document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
      state.theme = state.theme === "dark" ? "light" : "dark";
      localStorage.setItem("mendez-theme", state.theme);
      applyTheme();
    });
  });

  document.querySelectorAll("[data-language-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
      state.language = state.language === "en" ? "es" : "en";
      localStorage.setItem("mendez-language", state.language);
      applyLanguage();
    });
  });

  const menuButton = document.querySelector("[data-menu-toggle]");
  const mobileNav = document.getElementById("mobile-navigation");
  if (!menuButton || !mobileNav) return;
  const links = [...mobileNav.querySelectorAll("a")];

  const setMenu = (open) => {
    menuButton.setAttribute("aria-expanded", String(open));
    mobileNav.classList.toggle("open", open);
    mobileNav.hidden = !open;
    document.body.classList.toggle("menu-open", open);
    applyLanguage();
    if (open) links[0]?.focus();
    else menuButton.focus();
  };

  menuButton.addEventListener("click", () => setMenu(menuButton.getAttribute("aria-expanded") !== "true"));
  links.forEach((link) => link.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menuButton.getAttribute("aria-expanded") === "true") setMenu(false);
    if (event.key === "Tab" && menuButton.getAttribute("aria-expanded") === "true") {
      const focusable = [menuButton, ...links];
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  });
}

async function fetchJson(path) {
  const response = await fetch(path, { cache: "no-store" });
  if (!response.ok) throw new Error(`Unable to load ${path}`);
  return response.json();
}

function safeExternalLink(url) {
  try {
    const value = new URL(url, location.href);
    return ["https:", "http:"].includes(value.protocol) ? value.href : null;
  } catch { return null; }
}

function renderCourses(courses) {
  document.querySelectorAll("[data-course-grid]").forEach((grid) => {
    grid.innerHTML = courses.map((course, index) => `
      <a class="course-card reveal" href="${course.url}" style="animation-delay:${index * 70}ms">
        <span class="course-number" aria-hidden="true">${course.shortLabel}</span>
        <h3>${state.language === "es" ? course.nameEs : course.name}</h3>
        <p>${state.language === "es" ? course.descriptionEs : course.description}</p>
        <span class="card-action" data-i18n="openCourse">${translations[state.language].openCourse}</span>
      </a>`).join("");
  });
}

function formatRange(week) {
  if (!week.startDate || !week.endDate) return "";
  const options = { month: "short", day: "numeric", timeZone: "UTC" };
  return `${new Date(`${week.startDate}T00:00:00Z`).toLocaleDateString("en-US", options)}–${new Date(`${week.endDate}T00:00:00Z`).toLocaleDateString("en-US", options)}`;
}

function renderDay(day) {
  const url = day.link ? safeExternalLink(day.link) : null;
  return `<li class="day">
    <div class="day-date">${day.dayLabel}<br>${day.dateLabel || ""}</div>
    <div><h3>${day.title}</h3>${day.summary ? `<p>${day.summary}</p>` : ""}</div>
    ${url ? `<a class="assignment-link" href="${url}" target="_blank" rel="noopener noreferrer" data-i18n="assignment">${translations[state.language].assignment}</a>` : ""}
  </li>`;
}

function renderWeek(week, current = false) {
  const days = week.days?.length ? week.days.map(renderDay).join("") : `<li class="empty-state" data-i18n="noWork">${translations[state.language].noWork}</li>`;
  return `<article class="week-card">
    <header class="week-header"><div><h2>${week.label}</h2>${current ? `<span class="pill pill-current" data-i18n="currentWeek">${translations[state.language].currentWeek}</span>` : ""}</div><span class="week-dates">${formatRange(week)}</span></header>
    <ul class="day-list">${days}</ul>
  </article>`;
}

async function loadSiteContent() {
  try {
    const site = await fetchJson("data/site.json");
    state.site = site;
    document.querySelectorAll("[data-announcement-text]").forEach((element) => { element.textContent = state.language === "es" ? site.announcementEs : site.announcement; });
    document.querySelectorAll("[data-school-email]").forEach((element) => {
      element.textContent = site.contact.email;
      if (element.tagName === "A") element.href = `mailto:${site.contact.email}`;
    });
    renderCourses(site.courses);
  } catch (error) {
    console.error(error);
  }
}

async function loadCourse() {
  const root = document.querySelector("[data-course-slug]");
  if (!root) return;
  const slug = root.dataset.courseSlug;
  try {
    const course = await fetchJson(`data/courses/${slug}.json`);
    state.course = course;
    document.title = `${course.name} | Mr. Mendez Math`;
    document.querySelectorAll("[data-course-name]").forEach((element) => { element.textContent = state.language === "es" ? course.nameEs : course.name; });
    document.querySelectorAll("[data-course-description]").forEach((element) => { element.textContent = state.language === "es" ? course.descriptionEs : course.description; });
    const current = course.weeks.find((week) => week.status === "current");
    const archive = course.weeks.filter((week) => week.status === "archived").sort((a, b) => b.startDate.localeCompare(a.startDate));
    const currentRoot = document.querySelector("[data-current-week]");
    const archiveRoot = document.querySelector("[data-archive-weeks]");
    currentRoot.innerHTML = current ? renderWeek(current, true) : `<div class="empty-state" data-i18n="noWork">${translations[state.language].noWork}</div>`;
    archiveRoot.innerHTML = archive.length ? archive.map((week) => renderWeek(week)).join("") : `<div class="empty-state">Prior weeks will appear here.</div>`;
  } catch (error) {
    console.error(error);
    document.querySelector("[data-current-week]").innerHTML = `<div class="error-state" role="alert" data-i18n="loadError">${translations[state.language].loadError}</div>`;
  }
}

function setYear() {
  document.querySelectorAll("[data-year]").forEach((element) => { element.textContent = new Date().getFullYear(); });
}

document.addEventListener("DOMContentLoaded", async () => {
  applyTheme();
  applyLanguage();
  setupControls();
  setYear();
  await Promise.all([loadSiteContent(), loadCourse()]);
  applyLanguage();
});
