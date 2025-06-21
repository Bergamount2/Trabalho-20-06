document.addEventListener("DOMContentLoaded", () => {
  // Inject the navbar into all pages
  function loadNavbar() {
    const navbar = `
    <nav class="bg-white dark:bg-gray-800 shadow-lg transition-colors sticky top-0 z-50">
        <div class="max-w-6xl mx-auto px-4">
            <div class="flex justify-between items-center py-4">
                <div class="flex items-center space-x-4">
                    <a href="/" class="text-2xl font-bold text-blue-600 dark:text-blue-400">Boas-vindas ao Sistema</a>
                </div>
                <div class="hidden md:flex items-center space-x-4">
                    <a href="about"
                        class="py-2 px-3 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition duration-300 font-medium">Sobre</a>
                    <a href="cadastro"
                        class="py-2 px-3 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition duration-300 font-medium">Cadastro</a>
                    <a href="listagem"
                        class="py-2 px-3 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition duration-300 font-medium">Listagem</a>
                    <button id="bgChooser"
                        class="bg-gray-800 text-white px-4 py-2 rounded-full hover:bg-gray-900 transition cursor-pointer">Escolher Fundo</button>
                    <button id="themeToggle" aria-label="Alternar Dark Mode"
                        class="relative w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition focus:outline-none cursor-pointer flex items-center justify-center"></button>
                </div>
            </div>
        </div>
    </nav>`;
    
    document.body.insertAdjacentHTML('afterbegin', navbar);
  }

  // Load the navbar immediately
  loadNavbar();

  // Theme toggle functionality
  const themeToggle = document.getElementById("themeToggle");
  if (themeToggle) {
    initThemeToggle();
  }

  // Background chooser functionality
  const bgChooser = document.getElementById("bgChooser");
  if (bgChooser) {
    initBackgroundChooser();
  }

  // Initialize saved background
  const savedBg = localStorage.getItem("backgroundImage");
  if (savedBg) {
    applyBackground(savedBg);
  }

  function initThemeToggle() {
    // Create and append centered icons
    themeToggle.innerHTML = `
      <svg id="moonIcon" xmlns="http://www.w3.org/2000/svg" 
        class="w-5 h-5 text-gray-800 dark:text-gray-200 transition-opacity duration-300" 
        fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
        <path d="M3 11.5066C3 16.7497 7.25034 21 12.4934 21C16.2209 21 19.4466 18.8518 21 15.7259C12.4934 15.7259 8.27411 11.5066 8.27411 3C5.14821 4.55344 3 7.77915 3 11.5066Z" 
          stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <svg id="sunIcon" xmlns="http://www.w3.org/2000/svg"
        class="absolute w-5 h-5 text-gray-800 dark:text-yellow-400 transition-opacity duration-300 opacity-0 pointer-events-none"
        fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
        <path d="M3 15C5.48276 15 7.34483 12 7.34483 12C7.34483 12 9.2069 15 11.6897 15C14.1724 15 16.6552 12 16.6552 12C16.6552 12 19.1379 15 21 15"
          stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M3 20C5.48276 20 7.34483 17 7.34483 17C7.34483 17 9.2069 20 11.6897 20C14.1724 20 16.6552 17 16.6552 17C16.6552 17 19.1379 20 21 20"
          stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M19 10C19 6.13401 15.866 3 12 3C8.13401 3 5 6.13401 5 10" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`;

    const moonIcon = document.getElementById("moonIcon");
    const sunIcon = document.getElementById("sunIcon");

    // Set initial theme
    if (localStorage.getItem("theme") === "dark") {
      document.documentElement.classList.add("dark");
      toggleIcons(true);
    }

    themeToggle.addEventListener("click", () => {
      const isDark = document.documentElement.classList.toggle("dark");
      localStorage.setItem("theme", isDark ? "dark" : "light");
      toggleIcons(isDark);
    });

    function toggleIcons(isDark) {
      moonIcon.classList.toggle("opacity-0", isDark);
      moonIcon.classList.toggle("pointer-events-none", isDark);
      sunIcon.classList.toggle("opacity-0", !isDark);
      sunIcon.classList.toggle("pointer-events-none", !isDark);
    }
  }

  function initBackgroundChooser() {
    // Create modal elements if they don't exist
    if (!document.getElementById("modalBackdrop")) {
      const backdrop = document.createElement("div");
      backdrop.id = "modalBackdrop";
      backdrop.className = "fixed inset-0 bg-black bg-opacity-50 z-40 hidden";
      backdrop.onclick = closeBackgroundModal;
      document.body.appendChild(backdrop);
    }

    if (!document.getElementById("backgroundModal")) {
      const modal = document.createElement("div");
      modal.id = "backgroundModal";
      modal.className = "fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-2xl text-center z-50 hidden transition-colors";
      modal.innerHTML = `
        <h3 class="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">Escolha um fundo:</h3>
        <div id="imageOptions" class="flex flex-wrap justify-center gap-4 mb-6"></div>
        <button id="uploadImage" class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg mb-4 w-full transition duration-200">Carregar Imagem</button>
        <button id="closeModal" class="text-gray-600 hover:text-gray-800 font-medium py-2 px-4 rounded-lg border border-gray-300 w-full transition duration-200">Fechar</button>
      `;
      document.body.appendChild(modal);
    }

    const modalBackdrop = document.getElementById("modalBackdrop");
    const backgroundModal = document.getElementById("backgroundModal");
    const imageOptions = document.getElementById("imageOptions");
    const closeModalBtn = document.getElementById("closeModal");
    const uploadImageBtn = document.getElementById("uploadImage");

    const imageUrls = [
      "https://res.cloudinary.com/canonical/image/fetch/f_auto,q_auto,fl_sanitize,c_fill,w_3908,h_2199/https://ubuntu.com/wp-content/uploads/414b/Aiguille169-1.jpg",
      "https://res.cloudinary.com/canonical/image/fetch/f_auto,q_auto,fl_sanitize,c_fill,w_3840,h_2160/https://ubuntu.com/wp-content/uploads/c0e7/Kacper_Slusarczyk_City-1.jpg",
      "https://res.cloudinary.com/canonical/image/fetch/f_auto,q_auto,fl_sanitize,c_fill,w_1920,h_1080/https://ubuntu.com/wp-content/uploads/72a9/trotoar-1.jpg"
    ];

    // Render image options
    imageOptions.innerHTML = imageUrls.map(url => `
      <div class="cursor-pointer group">
        <img src="${url}" class="w-20 h-20 object-cover rounded-lg shadow-md group-hover:ring-2 group-hover:ring-blue-500 transition duration-200" 
          onclick="changeBackground('${url}'); closeBackgroundModal();" />
      </div>
    `).join("");

    // Event listeners
    bgChooser.addEventListener("click", openBackgroundModal);
    closeModalBtn.addEventListener("click", closeBackgroundModal);
    modalBackdrop.addEventListener("click", closeBackgroundModal);
    uploadImageBtn.addEventListener("click", handleImageUpload);

    function openBackgroundModal() {
      modalBackdrop.classList.remove("hidden");
      backgroundModal.classList.remove("hidden");
    }

    function closeBackgroundModal() {
      modalBackdrop.classList.add("hidden");
      backgroundModal.classList.add("hidden");
    }

    function handleImageUpload() {
      const fileInput = document.createElement("input");
      fileInput.type = "file";
      fileInput.accept = "image/*";
      fileInput.style.display = "none";

      fileInput.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            changeBackground(event.target.result);
            closeBackgroundModal();
          };
          reader.readAsDataURL(file);
        }
      };

      document.body.appendChild(fileInput);
      fileInput.click();
      document.body.removeChild(fileInput);
    }

    // Make functions available globally
    window.changeBackground = applyBackground;
    window.closeBackgroundModal = closeBackgroundModal;
  }

  function applyBackground(url) {
    document.body.style.backgroundImage = `url('${url}')`;
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundRepeat = "no-repeat";
    document.body.style.backgroundAttachment = "fixed";
    localStorage.setItem("backgroundImage", url);
  }
});