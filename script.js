const galleryData = [
    {
        id: 1,
        title: "Cataratas del Iguazú",
        region: "norte",
        image: "assets/images/iguazu.jpg",
        largeImage: "assets/images/iguazu-large.jpg",
        description: "Una de las siete maravillas naturales del mundo"
    },
    {
        id: 2,
        title: "Cerro de los Siete Colores",
        region: "norte",
        image: "assets/images/cerro-siete-colores.jpg",
        largeImage: "assets/images/cerro-siete-colores-large.jpg",
        description: "Formación geológica en Purmamarca, Jujuy"
    },
    {
        id: 3,
        title: "Glaciar Perito Moreno",
        region: "patagonia",
        image: "assets/images/glaciar-perito-moreno.jpg",
        largeImage: "assets/images/glaciar-perito-moreno-large.jpg",
        description: "Impresionante glaciar en el Parque Nacional Los Glaciares"
    },
    {
        id: 4,
        title: "Quebrada de Humahuaca",
        region: "norte",
        image: "assets/images/quebrada-humahuaca.jpg",
        largeImage: "assets/images/quebrada-humahuaca-large.jpg",
        description: "Patrimonio de la Humanidad en la provincia de Jujuy"
    },
    {
        id: 5,
        title: "Bariloche y sus lagos",
        region: "patagonia",
        image: "assets/images/bariloche.jpg",
        largeImage: "assets/images/bariloche-large.jpg",
        description: "Panorámica de los lagos y montañas de Bariloche"
    },
    {
        id: 6,
        title: "Salinas Grandes",
        region: "norte",
        image: "assets/images/salinas-grandes.jpg",
        largeImage: "assets/images/salinas-grandes-large.jpg",
        description: "Inmensas salinas entre Jujuy y Salta"
    },
    {
        id: 7,
        title: "Cerro Fitz Roy",
        region: "patagonia",
        image: "assets/images/fitz-roy.jpg",
        largeImage: "assets/images/fitz-roy-large.jpg",
        description: "Majestuosa montaña en El Chaltén"
    },
    {
        id: 8,
        title: "Viñedos de Mendoza",
        region: "centro",
        image: "assets/images/mendoza.jpg",
        largeImage: "assets/images/mendoza-large.jpg",
        description: "Campos de viñedos con la cordillera de fondo"
    }
];

class GalleryApp {
    constructor() {
        this.currentFilter = 'all';
        this.currentImageIndex = 0;
        this.filteredImages = [];
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.renderGallery();
        this.setupFormValidation();
        this.loadTheme();
    }

    setupEventListeners() {
        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');
        
        navToggle?.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });

        const darkModeToggle = document.getElementById('dark-mode-toggle');
        darkModeToggle?.addEventListener('click', () => {
            this.toggleDarkMode();
        });

        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleFilterClick(e.target);
            });
        });

        // Lightbox
        const lightbox = document.getElementById('lightbox');
        const lightboxClose = document.querySelector('.lightbox-close');
        const lightboxPrev = document.querySelector('.lightbox-prev');
        const lightboxNext = document.querySelector('.lightbox-next');

        lightboxClose?.addEventListener('click', () => this.closeLightbox());
        lightboxPrev?.addEventListener('click', () => this.showPreviousImage());
        lightboxNext?.addEventListener('click', () => this.showNextImage());
        
        lightbox?.addEventListener('click', (e) => {
            if (e.target === lightbox) this.closeLightbox();
        });

        document.addEventListener('keydown', (e) => {
            if (lightbox.style.display === 'block') {
                if (e.key === 'Escape') this.closeLightbox();
                if (e.key === 'ArrowLeft') this.showPreviousImage();
                if (e.key === 'ArrowRight') this.showNextImage();
            }
        });
    }

    handleFilterClick(button) {
        const filter = button.dataset.filter;
        
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        button.classList.add('active');
        
        this.currentFilter = filter;
        this.renderGallery();
    }

    renderGallery() {
        const galleryGrid = document.querySelector('.gallery-grid');
        if (!galleryGrid) return;

        this.filteredImages = this.currentFilter === 'all' 
            ? galleryData 
            : galleryData.filter(img => img.region === this.currentFilter);

        galleryGrid.innerHTML = this.filteredImages.map(image => `
            <div class="gallery-item" data-id="${image.id}">
                <img src="${image.image}" alt="${image.title}" loading="lazy">
                <div class="item-info">
                    <h3>${image.title}</h3>
                    <p>${image.description}</p>
                </div>
            </div>
        `).join('');

        galleryGrid.querySelectorAll('.gallery-item').forEach((item, index) => {
            item.addEventListener('click', () => {
                this.openLightbox(index);
            });
        });

        setTimeout(() => {
            galleryGrid.querySelectorAll('.gallery-item').forEach(item => {
                item.style.animation = 'fadeInUp 0.6s ease';
            });
        }, 100);
    }

    openLightbox(index) {
        this.currentImageIndex = index;
        const image = this.filteredImages[index];
        
        const lightbox = document.getElementById('lightbox');
        const lightboxImage = document.getElementById('lightbox-image');
        const lightboxCaption = document.querySelector('.lightbox-caption');
        
        lightboxImage.src = image.largeImage;
        lightboxImage.alt = image.title;
        lightboxCaption.textContent = image.description;
        
        lightbox.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    closeLightbox() {
        const lightbox = document.getElementById('lightbox');
        lightbox.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    showPreviousImage() {
        this.currentImageIndex = this.currentImageIndex > 0 
            ? this.currentImageIndex - 1 
            : this.filteredImages.length - 1;
        this.openLightbox(this.currentImageIndex);
    }

    showNextImage() {
        this.currentImageIndex = this.currentImageIndex < this.filteredImages.length - 1 
            ? this.currentImageIndex + 1 
            : 0;
        this.openLightbox(this.currentImageIndex);
    }

    toggleDarkMode() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        const toggleBtn = document.getElementById('dark-mode-toggle');
        toggleBtn.textContent = newTheme === 'dark' ? '☀️' : '🌙';
    }

    loadTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        
        const toggleBtn = document.getElementById('dark-mode-toggle');
        toggleBtn.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
    }

    setupFormValidation() {
        const form = document.querySelector('.contact-form');
        if (!form) return;

        const inputs = {
            name: {
                validate: (value) => value.length >= 2,
                message: 'El nombre debe tener al menos 2 caracteres'
            },
            email: {
                validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
                message: 'Ingresa un email válido'
            },
            phone: {
                validate: (value) => !value || /^\+?[\d\s-]{10,}$/.test(value),
                message: 'Ingresa un teléfono válido'
            }
        };

        Object.keys(inputs).forEach(fieldName => {
            const input = document.getElementById(fieldName);
            const messageEl = input?.closest('.form-group')?.querySelector('.validation-message');
            
            input?.addEventListener('input', () => {
                this.validateField(input, messageEl, inputs[fieldName]);
            });
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (this.validateForm(form, inputs)) {
                this.submitForm(form);
            }
        });
    }

    validateField(input, messageEl, rules) {
        const isValid = rules.validate(input.value);
        
        if (messageEl) {
            messageEl.textContent = isValid ? '' : rules.message;
            messageEl.style.color = isValid ? 'green' : '#e74c3c';
        }
        
        input.style.borderColor = isValid ? 'green' : '#e74c3c';
        return isValid;
    }

    validateForm(form, rules) {
        let isValid = true;
        
        Object.keys(rules).forEach(fieldName => {
            const input = document.getElementById(fieldName);
            const messageEl = input?.closest('.form-group')?.querySelector('.validation-message');
            
            if (!this.validateField(input, messageEl, rules[fieldName])) {
                isValid = false;
            }
        });
        
        return isValid;
    }

    async submitForm(form) {
        const submitBtn = form.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;
        
        submitBtn.textContent = 'Enviando...';
        submitBtn.disabled = true;
        
        try {
            await fetch('https://jsonplaceholder.typicode.com/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(Object.fromEntries(new FormData(form)))
            });
            
            alert('¡Mensaje enviado con éxito!');
            form.reset();
            
        } catch (error) {
            alert('Error al enviar el mensaje. Intenta nuevamente.');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new GalleryApp();
});

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.8s ease forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.gallery-item, .form-group').forEach(el => {
        observer.observe(el);
    });
});

