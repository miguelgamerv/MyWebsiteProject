// Espera o DOM carregar completamente
document.addEventListener('DOMContentLoaded', function() {
    // Initialize enhanced styles and effects first
    addEnhancedStyles();
    initEnhancedEffects();

    // Botão "Explorar Produtos" no Hero
    const explorarBtnHero = document.getElementById('explorar-produtos-btn');
    if (explorarBtnHero) {
        explorarBtnHero.addEventListener('click', function(e) {
            e.preventDefault();
            // Rolagem suave para a seção "Produtos"
            const produtosSection = document.querySelector('#produtos');
            if (produtosSection) {
                produtosSection.scrollIntoView({ 
                    behavior: 'smooth' 
                });
            }
        });
    }

    // Navegação suave para todos os links do menu
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ 
                    behavior: 'smooth' 
                });
            }
        });
    });

    // Formulário de contato - Enhanced version
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    if (contactForm && formStatus) {
        // Add character counter for textarea
        const textarea = document.getElementById('mensagem');
        if (textarea) {
            const charCounter = document.createElement('div');
            charCounter.className = 'char-counter';
            charCounter.style.cssText = `
                text-align: right;
                font-size: 12px;
                color: var(--text-dark);
                margin-top: 5px;
                transition: color 0.3s ease;
            `;
            textarea.parentNode.appendChild(charCounter);
            
            const updateCounter = () => {
                const length = textarea.value.length;
                const maxLength = 500;
                charCounter.textContent = `${length}/${maxLength} caracteres`;
                
                if (length > maxLength * 0.9) {
                    charCounter.style.color = 'var(--warning-color)';
                } else if (length > maxLength * 0.8) {
                    charCounter.style.color = 'var(--primary-color)';
                } else {
                    charCounter.style.color = 'var(--text-dark)';
                }
            };
            
            textarea.addEventListener('input', updateCounter);
            updateCounter(); // Initialize counter
        }

        // Enhanced form validation
        const validateField = (field) => {
            const value = field.value.trim();
            let isValid = true;
            let errorMessage = '';

            // Remove previous error styling
            field.style.borderColor = '';
            field.style.boxShadow = '';

            if (field.hasAttribute('required') && !value) {
                isValid = false;
                errorMessage = 'Este campo é obrigatório.';
            } else if (field.type === 'email' && value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    isValid = false;
                    errorMessage = 'Por favor, insira um email válido.';
                }
            } else if (field.name === 'nome' && value.length < 2) {
                isValid = false;
                errorMessage = 'Nome deve ter pelo menos 2 caracteres.';
            } else if (field.name === 'mensagem' && value.length < 10) {
                isValid = false;
                errorMessage = 'Mensagem deve ter pelo menos 10 caracteres.';
            }

            // Show error styling
            if (!isValid) {
                field.style.borderColor = 'var(--error-color)';
                field.style.boxShadow = '0 0 10px rgba(220, 53, 69, 0.3)';
                
                // Show error message
                let errorDiv = field.parentNode.querySelector('.field-error');
                if (!errorDiv) {
                    errorDiv = document.createElement('div');
                    errorDiv.className = 'field-error';
                    errorDiv.style.cssText = `
                        color: var(--error-color);
                        font-size: 12px;
                        margin-top: 5px;
                        animation: fadeIn 0.3s ease;
                    `;
                    field.parentNode.appendChild(errorDiv);
                }
                errorDiv.textContent = errorMessage;
            } else {
                // Remove error message
                const errorDiv = field.parentNode.querySelector('.field-error');
                if (errorDiv) {
                    errorDiv.remove();
                }
            }

            return isValid;
        };

        // Real-time validation
        ['nome', 'email', 'mensagem'].forEach(fieldName => {
            const field = document.getElementById(fieldName);
            if (field) {
                field.addEventListener('blur', () => validateField(field));
                field.addEventListener('input', () => {
                    // Clear error styling on input
                    if (field.style.borderColor === 'var(--error-color)') {
                        field.style.borderColor = '';
                        field.style.boxShadow = '';
                    }
                });
            }
        });

        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const nome = document.getElementById('nome');
            const email = document.getElementById('email');
            const mensagem = document.getElementById('mensagem');
            
            // Validate all fields
            const isNomeValid = validateField(nome);
            const isEmailValid = validateField(email);
            const isMensagemValid = validateField(mensagem);
            
            if (!isNomeValid || !isEmailValid || !isMensagemValid) {
                // Show general error
                formStatus.innerHTML = `
                    <i class="fas fa-exclamation-triangle"></i>
                    Por favor, corrija os erros acima antes de enviar.
                `;
                formStatus.className = 'error';
                formStatus.style.display = 'block';
                
                // Hide error after some time
                setTimeout(() => {
                    formStatus.style.display = 'none';
                    formStatus.className = '';
                }, 5000);
                return;
            }
            
            // Show loading state
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalText = submitButton.innerHTML;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
            submitButton.disabled = true;
            
            // Simulate sending delay
            setTimeout(() => {
                // Show success message
                formStatus.innerHTML = `
                    <i class="fas fa-check-circle"></i>
                    Obrigado <strong>${nome.value}</strong>! Sua mensagem foi enviada com sucesso. 
                    A equipe NPLAY entrará em contato em breve.
                `;
                formStatus.className = 'success';
                formStatus.style.display = 'block';
                
                // Reset form
                contactForm.reset();
                
                // Clear character counter
                const charCounter = document.querySelector('.char-counter');
                if (charCounter) {
                    charCounter.textContent = '0/500 caracteres';
                    charCounter.style.color = 'var(--text-dark)';
                }
                
                // Reset button
                submitButton.innerHTML = originalText;
                submitButton.disabled = false;
                
                // Hide success message after some time
                setTimeout(() => {
                    formStatus.style.display = 'none';
                    formStatus.className = '';
                }, 8000);
                
            }, 2000); // Simulate 2 second loading
        });
    }

    // Efeito de destaque nos cards de produtos (main page categories)
    const productCardsHover = document.querySelectorAll('#produtos .product-card'); // Target only main category cards
    productCardsHover.forEach(card => {
        // O hover é primariamente controlado por CSS, mas JS pode adicionar classes se necessário
        // Por agora, o CSS :hover é suficiente
    });

    // Animação de aparecimento ao rolar para secções
    const sections = document.querySelectorAll('.section');
    
    function isElementInViewport(el) {
        if (!el) return false;
        const rect = el.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.85 && // Um pouco mais cedo
            rect.bottom >= 0 // Garante que o elemento ainda está parcialmente visível
        );
    }
    
    function handleScrollAnimations() {
        sections.forEach(section => {
            if (isElementInViewport(section) && !section.classList.contains('visible')) {
                section.classList.add('visible');
            }
        });
    }
    
    // Configuração inicial e event listener para animações de scroll
    sections.forEach(section => {
        // CSS já define opacidade 0 e transform inicial
    });
    window.addEventListener('scroll', handleScrollAnimations);
    handleScrollAnimations(); // Verificar no carregamento inicial
    
    // Efeito de pulsação para o botão principal do Hero
    if (explorarBtnHero) {
        // A animação 'pulse' é definida no CSS e aplicada ao botão.
        // Se precisar controlar via JS:
        // explorarBtnHero.style.animation = 'pulse 2s infinite';
    }
    
    // Efeito de digitação para o título principal do Hero
    const mainTitle = document.querySelector('.hero h2#hero-title');
    if (mainTitle && !mainTitle.dataset.typewriterCompleted) {
        const text = mainTitle.textContent;
        mainTitle.textContent = '';
        let i = 0;
        
        function typeWriter() {
            if (i < text.length) {
                mainTitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100); // Velocidade da digitação
            } else {
                // Mark typewriter effect as completed
                mainTitle.dataset.typewriterCompleted = 'true';
            }
        }
        setTimeout(typeWriter, 500); // Iniciar após um pequeno atraso
    }

    // Atualizar ano no rodapé
    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // Lógica para carregar produtos dinamicamente
    const productsSection = document.querySelector("#produtos");
    const dynamicContentSection = document.querySelector("#dynamic-content");
    const dynamicTitleElement = document.querySelector("#dynamic-title");
    const dynamicProductsGrid = document.querySelector("#dynamic-products");
    const backToProductsBtn = document.querySelector("#back-to-products");

    // Dados dos produtos (atualizados com base na lista completa)
    const productTemplates = {
        cadeiras: {
            title: "Cadeiras Gaming NPLAY",
            products: [
                { 
                    name: "NPLAY Rule 4.0", 
                    image: "",
                    description: "Cadeira gaming premium com suporte até 130 kg. Cor Preto e Vermelho.",
                    price: "€99,97",
                    features: ["Até 130 kg", "Elevador a Gás Classe 4", "Preto e Vermelho"]
                },
                { 
                    name: "NPLAY Rule 4.1", 
                    image: "",
                    description: "Cadeira gaming robusta com suporte até 130 kg. Cor Preto.",
                    price: "€119,99",
                    features: ["Até 130 kg", "Elevador a Gás Classe 4", "Preto"]
                },
                { 
                    name: "NPLAY Rule 2.1", 
                    image: "",
                    description: "Cadeira gaming confortável com suporte até 130 kg. Cor Preto e Vermelho.",
                    price: "€89,99",
                    features: ["Até 130 kg", "Elevador a Gás Classe 4", "Preto e Vermelho"]
                },
                { 
                    name: "NPLAY Rule 6.1", 
                    image: "",
                    description: "Cadeira gaming leve com suporte até 90 kg. Cor Preto.",
                    price: "€15,57",
                    features: ["Até 90 kg", "Elevador Classe 4", "Preto"]
                },
            ],
        },
        mouses: {
            title: "Mouses Gaming NPLAY",
            products: [
                { 
                    name: "NPLAY AIM 1.5", 
                    image: "",
                    description: "Precisão de 3200 DPi para gamers exigentes. Cor Preto.",
                    price: "€14,99",
                    features: ["3200 DPi", "Design ergonómico", "Preto"]
                },
                { 
                    name: "NPLAY AIM 4.5", 
                    image: "",
                    description: "Alta performance com 7200 DPi e design robusto. Cor Preto.",
                    price: "€14,99",
                    features: ["7200 DPi", "Iluminação LED", "Preto"]
                },
                { 
                    name: "NPLAY AIM 4.5 (Branco)", 
                    image: "",
                    description: "Alta performance com 7200 DPi em versão branca elegante.",
                    price: "€14,99",
                    features: ["7200 DPi", "Design moderno", "Branco"]
                },
            ],
        },
        tapetes: {
            title: "Tapetes de Rato NPLAY",
            products: [
                { 
                    name: "NPLAY Glide 8.1", 
                    image: "",
                    description: "Tapete de rato com superfície de pano e base antiderrapante.",
                    price: "€14,99",
                    features: ["Superfície de Pano", "Base Antiderrapante", "Amplo"]
                },
            ],
        },
        teclados: {
            title: "Teclados Gaming NPLAY",
            products: [
                { 
                    name: "NPLAY Conquer 1.0", 
                    image: "",
                    description: "Teclado mecânico com layout em Português. Cor Preto.",
                    price: "€49,99",
                    features: ["Mecânico", "Layout PT-PT", "Preto"]
                },
                { 
                    name: "NPLAY Conquer 2.0", 
                    image: "",
                    description: "Performance mecânica superior, layout Português. Cor Preto.",
                    price: "€59,99",
                    features: ["Mecânico", "Layout PT-PT", "Preto", "RGB"]
                },
                { 
                    name: "NPLAY Conquer 3.0 RGB", 
                    image: "",
                    description: "Mini teclado mecânico compacto com iluminação RGB. Cor Preto.",
                    price: "€39,99",
                    features: ["Mini Teclado", "Mecânico", "RGB", "Preto"]
                },
                { 
                    name: "NPLAY Conquer 3.0 (Branco)", 
                    image: "",
                    description: "Mini teclado compacto e estiloso. Cor Branco.",
                    price: "€39,99",
                    features: ["Mini Teclado", "Design Compacto", "Branco"]
                },
                { 
                    name: "NPLAY Control 3.1", 
                    image: "",
                    description: "Teclado gaming com excelente custo-benefício. Cor Preto.",
                    price: "€19,99",
                    features: ["Design Ergonómico", "Preto", "Compacto"]
                },
            ],
        },
        headsets: {
            title: "Headsets Gaming NPLAY",
            products: [
                { 
                    name: "NPLAY Contact Wireless RGB", 
                    image: "",
                    description: "Headset Over Ear multiplataforma com iluminação RGB.",
                    price: "€59,99",
                    features: ["Wireless", "RGB", "Multiplataforma", "Over Ear"]
                },
                { 
                    name: "NPLAY Contact 4.7 RGB", 
                    image: "",
                    description: "Auscultadores On Ear com fio e iluminação RGB para múltiplas plataformas.",
                    price: "€49,99",
                    features: ["Com Fio", "RGB", "On Ear", "Multiplataforma"]
                },
                { 
                    name: "NPLAY Contact 3.0", 
                    image: "",
                    description: "Auscultadores gaming para PS5 e Xbox Series X/S.",
                    price: "€19,99",
                    features: ["Compatível PS5", "Microfone integrado", "Confortável"]
                },
                { 
                    name: "NPLAY CONTACT 2.1", 
                    image: "",
                    description: "Auscultadores On Ear com fio para PC. Cor Preto.",
                    price: "€19,99",
                    features: ["Com Fio", "On Ear", "PC", "Preto"]
                },
            ],
        },

        comandos: {
            title: "Comandos NPLAY",
            products: [
                { 
                    name: "NPLAY Skill 2.1", 
                    image: "",
                    description: "Comando para PC e PS3. Compatibilidade dupla.",
                    price: "€24,99",
                    features: ["PC e PS3", "Com Fio", "Ergonómico"]
                },
                { 
                    name: "NPLAY Skill 6.0", 
                    image: "",
                    description: "Comando sem fios para Nintendo Switch.",
                    price: "€29,99",
                    features: ["Nintendo Switch", "Sem Fios", "Confortável"]
                },
                { 
                    name: "NPLAY Skill 8.1", 
                    image: "",
                    description: "Comando wireless para PC e PS3.",
                    price: "€29,99",
                    features: ["PC e PS3", "Wireless", "Ergonómico"]
                },
                { 
                    name: "NPLAY Skill 10.0", 
                    image: "",
                    description: "Comando avançado com múltiplas funcionalidades.",
                    price: "€34,99",
                    features: ["Multifuncional", "Alta Qualidade", "Compatibilidade Ampla"]
                },
            ],
        },
        volantes: {
            title: "Volantes NPLAY",
            products: [
                { 
                    name: "NPLAY Drift 1.0", 
                    image: "",
                    description: "Pack de 2 volantes para Nintendo Switch.",
                    price: "€7,99",
                    features: ["Nintendo Switch", "Pack de 2", "Compacto"]
                },
            ],
        },
        mesas: {
            title: "Mesas Gaming NPLAY",
            products: [
                { 
                    name: "NPLAY RGB Command 2.0", 
                    image: "",
                    description: "Mesa gaming com iluminação RGB e design moderno.",
                    price: "€199,99",
                    features: ["RGB", "Ergonómica", "Gestão de Cabos"]
                },
            ],
        },
        "bases-resfriamento": {
            title: "Bases de Resfriamento NPLAY",
            products: [
                { 
                    name: "NPLAY Unstoppable 3.0", 
                    image: "",
                    description: "Suporte cooler para portátil. Cor Preto e Azul.",
                    price: "€24,99",
                    features: ["Base de Suporte", "Portátil", "Preto e Azul"]
                },
            ],
        },
        "outros-recursos": {
            title: "Outros Recursos NPLAY",
            products: [
                { 
                    name: "NPLAY Pasta Térmica MAX1", 
                    image: "",
                    description: "Pasta térmica para aplicações básicas de refrigeração.",
                    price: "€9,99",
                    features: ["Aplicação Fácil", "Boa Condutividade", "Economia"]
                },
                { 
                    name: "NPLAY Pasta Térmica MAX2", 
                    image: "",
                    description: "Pasta térmica de performance média para uso geral.",
                    price: "€14,99",
                    features: ["Performance Média", "Durabilidade", "Versatilidade"]
                },
                { 
                    name: "NPLAY Pasta Térmica MAX3", 
                    image: "",
                    description: "Pasta térmica premium para máxima performance térmica.",
                    price: "€19,99",
                    features: ["Alta Performance", "Condutividade Superior", "Premium"]
                },
            ],
        },
        bundles: {
            title: "Bundles Gaming NPLAY",
            products: [
                { 
                    name: "NPLAY Dominate 4.0", 
                    image: "",
                    description: "Bundle completo com teclado, auscultadores, rato e tapete de rato.",
                    price: "€44,99",
                    features: ["Kit Completo", "Teclado + Auscultadores", "Rato + Tapete"]
                },
            ],
        },

    };

    const showProductsInCategory = (categoryKey) => {
        const categoryData = productTemplates[categoryKey];
        if (categoryData && productsSection && dynamicContentSection && dynamicTitleElement && dynamicProductsGrid) {
            dynamicTitleElement.textContent = categoryData.title;
            dynamicProductsGrid.innerHTML = categoryData.products
                .map(
                    (product) => `
                    <div class="product-card">
                        <div class="product-card__image-container">
                            <img src="${product.image || `https://placehold.co/300x250/2d2d2d/ff3333?text=${encodeURIComponent(product.name)}`}" alt="${product.name}" class="product-card__image">
                            <h3 class="product-card__title">${product.name}</h3>
                        </div>
                        <div class="product-card__content">
                            <p class="product-card__description">${product.description || 'Mais detalhes em breve.'}</p>
                            ${product.price ? `<p class="product-card__price"><strong>Preço:</strong> ${product.price}</p>` : ''}
                            ${product.features && product.features.length > 0 ? `
                                <ul class="product-card__features">
                                    ${product.features.map(feature => `<li><i class="fas fa-check"></i> ${feature}</li>`).join('')}
                                </ul>
                            ` : ''}
                            <a href="#" class="button product-card__button">Ver Produto</a>
                        </div>
                    </div>
                `
                )
                .join("");
            
            productsSection.style.display = "none";
            dynamicContentSection.style.display = "block";
            dynamicContentSection.classList.add('visible'); // For animation
            dynamicContentSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    // Botões das categorias principais
    const categoryButtons = {
        cadeiras: document.querySelector("#btn-cadeiras"),
        mouses: document.querySelector("#btn-mouses"),
        teclados: document.querySelector("#btn-teclados"),
        headsets: document.querySelector("#btn-headsets"),
        tapetes: document.querySelector("#btn-tapetes"),
        comandos: document.querySelector("#btn-comandos"),
        volantes: document.querySelector("#btn-volantes"),
        mesas: document.querySelector("#btn-mesas"),
        "bases-resfriamento": document.querySelector("#btn-bases-resfriamento"),
        "outros-recursos": document.querySelector("#btn-outros-recursos"),
        bundles: document.querySelector("#btn-bundles"),
    };

    Object.keys(categoryButtons).forEach((key) => {
        const button = categoryButtons[key];
        if (button) {
            button.addEventListener("click", (e) => {
                e.preventDefault();
                showProductsInCategory(key);
            });
        }
    });

    // Botão "Voltar" na secção dinâmica
    if (backToProductsBtn && dynamicContentSection && productsSection) {
        backToProductsBtn.addEventListener("click", () => {
            dynamicContentSection.style.display = "none";
            productsSection.style.display = "block"; // Ou 'grid' se for o display original
            productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    }

    // Light/Dark mode toggle logic
    const themeToggleBtn = document.getElementById('toggle-theme');
    if (themeToggleBtn) {
        // Set initial icon based on system or saved preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const savedTheme = localStorage.getItem('theme');
        function setTheme(mode) {
            if (mode === 'light') {
                document.body.classList.add('light-mode');
                themeToggleBtn.textContent = '🌞';
            } else {
                document.body.classList.remove('light-mode');
                themeToggleBtn.textContent = '🌙';
            }
        }
        setTheme(savedTheme || (prefersDark ? 'dark' : 'light'));
        themeToggleBtn.addEventListener('click', function() {
            const isLight = document.body.classList.toggle('light-mode');
            themeToggleBtn.textContent = isLight ? '🌞' : '🌙';
            localStorage.setItem('theme', isLight ? 'light' : 'dark');
        });
    }

    // Remove all inline onerror handlers from images and handle errors via JS
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('error', function() {
            if (!this.dataset.fallback) {
                this.dataset.fallback = 'true';
                this.src = 'https://placehold.co/' + this.width + 'x' + this.height + '/111111/555555?text=Image+Load+Error';
            }
        });
    });
    
    // ======================== ENHANCED ABOUT SECTION FEATURES ========================
    
    // Animated Statistics Counter
    function animateStats() {
        const statNumbers = document.querySelectorAll('.stat-number');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = entry.target;
                    const finalValue = target.getAttribute('data-target');
                    const duration = 2000; // 2 seconds
                    const startTime = performance.now();
                    
                    function updateNumber(currentTime) {
                        const elapsed = currentTime - startTime;
                        const progress = Math.min(elapsed / duration, 1);
                        
                        // Easing function for smooth animation
                        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
                        
                        let currentValue;
                        if (finalValue.includes('+')) {
                            const numValue = parseInt(finalValue.replace('+', ''));
                            currentValue = Math.floor(numValue * easeOutQuart);
                            target.textContent = currentValue + '+';
                        } else {
                            currentValue = Math.floor(parseInt(finalValue) * easeOutQuart);
                            target.textContent = currentValue;
                        }
                        
                        if (progress < 1) {
                            requestAnimationFrame(updateNumber);
                        } else {
                            target.textContent = finalValue;
                        }
                    }
                    
                    requestAnimationFrame(updateNumber);
                    observer.unobserve(target);
                }
            });
        }, { threshold: 0.5 });
        
        statNumbers.forEach(stat => {
            stat.textContent = '0';
            observer.observe(stat);
        });
    }
    
    // Enhanced Card Hover Effects
    function enhanceAboutCards() {
        const cards = document.querySelectorAll('.about-mission-card, .about-vision-card, .about-commitment-card, .feature-card');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                // Add dynamic glow effect
                this.style.boxShadow = `
                    0 20px 40px rgba(255, 51, 51, 0.4),
                    inset 0 1px 0 rgba(255, 255, 255, 0.1)
                `;
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.boxShadow = '';
            });
            
            // Add mouse move parallax effect
            card.addEventListener('mousemove', function(e) {
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 20;
                const rotateY = (centerX - x) / 20;
                
                this.style.transform = `
                    translateY(-5px) 
                    rotateX(${rotateX}deg) 
                    rotateY(${rotateY}deg)
                    scale(1.02)
                `;
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = '';
            });
        });
    }
    
    // Title Animation Enhancement
    function enhanceTitleAnimation() {
        const titleWords = document.querySelectorAll('.title-word');
        
        // Add staggered entrance animation
        titleWords.forEach((word, index) => {
            word.style.opacity = '0';
            word.style.transform = 'translateY(50px)';
            
            setTimeout(() => {
                word.style.transition = 'all 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
                word.style.opacity = '1';
                word.style.transform = 'translateY(0)';
            }, index * 200);
        });
    }
    
    // Banner Image Enhancement
    function enhanceBannerEffects() {
        const bannerContainer = document.querySelector('.about-banner-container');
        if (bannerContainer) {
            // Add click effect
            bannerContainer.addEventListener('click', function() {
                this.style.animation = 'aboutBannerClick 0.6s ease-out';
                setTimeout(() => {
                    this.style.animation = '';
                }, 600);
            });
            
            // Add loading state for image
            const bannerImage = bannerContainer.querySelector('.enhanced-banner');
            if (bannerImage) {
                bannerImage.addEventListener('load', function() {
                    this.style.opacity = '0';
                    this.style.transition = 'opacity 1s ease-in-out';
                    setTimeout(() => {
                        this.style.opacity = '1';
                    }, 100);
                });
                
                bannerImage.addEventListener('error', function() {
                    console.log('Banner image failed to load, using fallback');
                    this.style.border = '2px dashed rgba(255, 51, 51, 0.5)';
                    this.style.background = 'rgba(18, 18, 18, 0.8)';
                });
            }
        }
    }
    
    // Scroll-triggered animations
    function initScrollAnimations() {
        const animateElements = document.querySelectorAll('.about-mission-card, .about-vision-card, .about-commitment-card, .feature-card');
        
        // Only apply animations if JavaScript is enabled and working properly
        const testElement = document.createElement('div');
        const supportsIntersectionObserver = 'IntersectionObserver' in window;
        
        if (!supportsIntersectionObserver) {
            // Fallback: elements remain visible without animation
            return;
        }
        
        const scrollObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    entry.target.classList.remove('js-animate');
                    entry.target.style.animation = 'aboutSlideInUp 0.8s ease-out forwards';
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { 
            threshold: 0.1,
            rootMargin: '50px 0px -50px 0px'
        });
        
        animateElements.forEach(element => {
            // Add animation class and set initial state
            element.classList.add('js-animate');
            element.style.opacity = '0';
            element.style.transform = 'translateY(50px)';
            element.style.transition = 'all 0.8s ease-out';
            scrollObserver.observe(element);
        });
        
        // Fallback: If elements are already in viewport on page load
        setTimeout(() => {
            animateElements.forEach(element => {
                const rect = element.getBoundingClientRect();
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    element.classList.remove('js-animate');
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                    element.style.animation = 'aboutSlideInUp 0.8s ease-out forwards';
                }
            });
        }, 100);
    }
    
    // Performance optimization for mobile
    function optimizeForMobile() {
        const isMobile = window.innerWidth <= 768;
        
        if (isMobile) {
            // Disable complex animations on mobile
            const particles = document.querySelector('.about-particles');
            const scanLines = document.querySelector('.about-scan-lines');
            const bannerEffects = document.querySelector('.banner-effects');
            
            if (particles) particles.style.display = 'none';
            if (scanLines) scanLines.style.display = 'none';
            if (bannerEffects) bannerEffects.style.display = 'none';
        }
    }
    
    // Initialize all About section enhancements
    function initAboutSection() {
        // Wait for DOM to be fully loaded
        setTimeout(() => {
            animateStats();
            enhanceAboutCards();
            enhanceTitleAnimation();
            enhanceBannerEffects();
            initScrollAnimations();
            optimizeForMobile();
        }, 100); // Reduced delay for faster initialization
    }
    
    // Initialize when about section is in view
    const aboutSection = document.getElementById('sobre');
    if (aboutSection) {
        const aboutObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    initAboutSection();
                    aboutObserver.unobserve(entry.target);
                }
            });
        }, { 
            threshold: 0.05,  // Very low threshold for early detection
            rootMargin: '100px 0px'  // Start initialization well before section is visible
        });
        
        aboutObserver.observe(aboutSection);
        
        // Immediate initialization fallback
        setTimeout(() => {
            const rect = aboutSection.getBoundingClientRect();
            if (rect.top < window.innerHeight + 200) {
                initAboutSection();
            }
        }, 500);
    }
    
    // Window resize handler for mobile optimization
    window.addEventListener('resize', optimizeForMobile);
    
    // Menção à parceria com GTZ Bulls (legacy code - keeping for compatibility)
    const legacyAboutSection = document.querySelector('#sobre .text-content');
    if (legacyAboutSection && !document.querySelector('.about-content-grid')) {
        const partnershipParagraph = document.createElement('p');
        partnershipParagraph.innerHTML = 'A NPLAY tem orgulho em ser parceira oficial da equipa de jogadores profissionais <strong>GTZ Bulls</strong>, fornecendo equipamentos de alta performance para competições de e-sports.';
        legacyAboutSection.appendChild(partnershipParagraph);
    }

    // ======================== ENHANCED VISUAL EFFECTS ========================

    // Mouse tracking for product cards
    function initProductCardEffects() {
        const productCards = document.querySelectorAll('.product-card');
        
        productCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;
                
                card.style.setProperty('--mouse-x', `${x}%`);
                card.style.setProperty('--mouse-y', `${y}%`);
            });
        });
    }

    // Enhanced hero section animations
    function initHeroEffects() {
        const heroSection = document.querySelector('.hero');
        const heroTitle = document.querySelector('.hero h2');
        const heroButton = document.querySelector('.hero .button');
        
        if (heroSection) {
            // Parallax effect on scroll
            window.addEventListener('scroll', () => {
                const scrolled = window.pageYOffset;
                const rate = scrolled * -0.5;
                
                if (heroSection.style.transform !== undefined) {
                    heroSection.style.transform = `translateY(${rate}px)`;
                }
            });
        }
        
        // Enhanced button hover effects
        if (heroButton) {
            heroButton.addEventListener('mouseenter', () => {
                heroButton.style.animation = 'none';
                heroButton.style.transform = 'translateY(-3px) scale(1.05)';
            });
            
            heroButton.addEventListener('mouseleave', () => {
                heroButton.style.transform = 'translateY(0) scale(1)';
            });
        }
    }

    // Product grid entrance animations
    function initProductGridAnimations() {
        const productCards = document.querySelectorAll('.product-card');
        
        const cardObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0) rotateX(0)';
                    }, index * 100); // Staggered animation
                    
                    cardObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '50px'
        });
        
        productCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(50px) rotateX(-10deg)';
            card.style.transition = 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            cardObserver.observe(card);
        });
    }

    // Enhanced section animations
    function initEnhancedSectionAnimations() {
        const sections = document.querySelectorAll('.section');
        
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    entry.target.style.transform = 'translateY(0)';
                    entry.target.style.opacity = '1';
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '100px'
        });
        
        sections.forEach(section => {
            sectionObserver.observe(section);
        });
    }

    // Smooth scrolling enhancements
    function enhanceSmoothScrolling() {
        const navLinks = document.querySelectorAll('nav a[href^="#"]');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const offsetTop = targetElement.offsetTop - 80;
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // Inicializa todos os efeitos aprimorados
    function initEnhancedEffects() {
        initProductCardEffects();
        initHeroEffects();
        initProductGridAnimations();
        initEnhancedSectionAnimations();
        enhanceSmoothScrolling();
    }

    // Add CSS for enhanced animations
    function addEnhancedStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .section {
                opacity: 0;
                transform: translateY(30px);
                transition: all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            }
            
            .section.visible {
                opacity: 1;
                transform: translateY(0);
            }
            
            @media (prefers-reduced-motion: reduce) {
                .product-card,
                .section,
                .hero * {
                    animation: none !important;
                    transition: none !important;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // ======================== ENHANCED PRODUCT CARD ANIMATIONS ========================

    // Advanced product card entrance animations
    function initProductCardAnimations() {
        const productCards = document.querySelectorAll('.product-card');
        const productsSection = document.querySelector('#produtos');
        
        // Intersection Observer for entrance animations
        const cardObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    const card = entry.target;
                    
                    // Add stagger delay based on card position
                    const delay = index * 150; // 150ms delay between each card
                    
                    setTimeout(() => {
                        card.classList.add('card-animate-in');
                        
                        // Add floating animation after entrance
                        setTimeout(() => {
                            card.classList.add('card-floating');
                        }, 800);
                        
                    }, delay);
                    
                    cardObserver.unobserve(card);
                }
            });
        }, {
            threshold: 0.2,
            rootMargin: '50px'
        });
        
        // Observe all product cards
        productCards.forEach(card => {
            card.classList.add('card-pre-animation');
            cardObserver.observe(card);
        });
    }

    // 3D Tilt effect for product cards
    function init3DTiltEffect() {
        const productCards = document.querySelectorAll('.product-card');
        
        productCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                
                const mouseX = e.clientX - centerX;
                const mouseY = e.clientY - centerY;
                
                const rotateX = (mouseY / rect.height) * -20; // Max 20deg rotation
                const rotateY = (mouseX / rect.width) * 20;
                
                card.style.transform = `
                    perspective(1000px) 
                    rotateX(${rotateX}deg) 
                    rotateY(${rotateY}deg) 
                    translateZ(20px)
                `;
                
                // Add glow effect at mouse position
                const glowX = ((e.clientX - rect.left) / rect.width) * 100;
                const glowY = ((e.clientY - rect.top) / rect.height) * 100;
                
                card.style.setProperty('--glow-x', `${glowX}%`);
                card.style.setProperty('--glow-y', `${glowY}%`);
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
                card.style.removeProperty('--glow-x');
                card.style.removeProperty('--glow-y');
            });
        });
    }

    // Enhanced button animations for product cards
    function initProductButtonAnimations() {
        const productButtons = document.querySelectorAll('.product-card__button');
        
        productButtons.forEach(button => {
            // Ripple effect on click
            button.addEventListener('click', (e) => {
                const ripple = document.createElement('span');
                const rect = button.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.cssText = `
                    position: absolute;
                    top: ${y}px;
                    left: ${x}px;
                    width: ${size}px;
                    height: ${size}px;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.6);
                    transform: scale(0);
                    animation: ripple 0.6s ease-out;
                    pointer-events: none;
                `;
                
                button.style.position = 'relative';
                button.style.overflow = 'hidden';
                button.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
            
            // Enhanced hover animations
            button.addEventListener('mouseenter', () => {
                button.style.animation = 'buttonPulse 0.3s ease-out';
            });
            
            button.addEventListener('mouseleave', () => {
                button.style.animation = '';
            });
        });
    }

    // Parallax scrolling effect for product cards
    function initProductParallax() {
        const productCards = document.querySelectorAll('.product-card');
        
        function updateParallax() {
            const scrollTop = window.pageYOffset;
            
            productCards.forEach((card, index) => {
                const rect = card.getBoundingClientRect();
                const speed = 0.5 + (index % 3) * 0.2; // Varying speeds
                
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    const yPos = -(scrollTop * speed);
                    card.style.setProperty('--parallax-y', `${yPos * 0.1}px`);
                }
            });
        }
        
        // Throttled scroll listener
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    updateParallax();
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    // Loading shimmer effect for product images
    function initProductImageLoaders() {
        const productImages = document.querySelectorAll('.product-card__image');
        
        productImages.forEach(img => {
            img.addEventListener('load', () => {
                img.classList.add('image-loaded');
            });
            
            // Add loading shimmer if image takes time to load
            if (!img.complete) {
                img.parentNode.classList.add('image-loading');
                
                img.addEventListener('load', () => {
                    img.parentNode.classList.remove('image-loading');
                    img.parentNode.classList.add('image-reveal');
                });
            }
        });
    }

    // Dynamic product feature animations
    function initProductFeatureAnimations() {
        const productCards = document.querySelectorAll('.product-card');
        
        productCards.forEach(card => {
            const features = card.querySelectorAll('.product-card__features li');
            
            card.addEventListener('mouseenter', () => {
                features.forEach((feature, index) => {
                    setTimeout(() => {
                        feature.style.animation = 'featureHighlight 0.3s ease-out';
                    }, index * 100);
                });
            });
            
            card.addEventListener('mouseleave', () => {
                features.forEach(feature => {
                    feature.style.animation = '';
                });
            });
        });
    }

    // Price animation for dynamic content
    function initPriceAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const priceElement = entry.target;
                    const priceText = priceElement.textContent;
                    const price = parseFloat(priceText.replace(/[^\d,]/g, '').replace(',', '.'));
                    
                    if (!isNaN(price)) {
                        animatePrice(priceElement, 0, price, 1000);
                    }
                    
                    observer.unobserve(priceElement);
                }
            });
        }, { threshold: 0.5 });
        
        // Observe price elements (both static and dynamic)
        function observePrices() {
            const priceElements = document.querySelectorAll('.product-card__price');
            priceElements.forEach(price => observer.observe(price));
        }
        
        observePrices();
        
        // Re-observe when dynamic content is loaded
        const dynamicSection = document.querySelector('#dynamic-content');
        if (dynamicSection) {
            const dynamicObserver = new MutationObserver(() => {
                observePrices();
            });
            dynamicObserver.observe(dynamicSection, { childList: true, subtree: true });
        }
    }

    // Helper function to animate price counting
    function animatePrice(element, start, end, duration) {
        const startTime = performance.now();
        const originalText = element.textContent;
        const prefix = originalText.split(/[\d,]/)[0];
        const suffix = originalText.split(/[\d,]/).pop();
        
        function updatePrice(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const currentValue = start + (end - start) * easeOutCubic(progress);
            const formattedValue = currentValue.toFixed(2).replace('.', ',');
            
            element.textContent = `${prefix}${formattedValue}${suffix}`;
            
            if (progress < 1) {
                requestAnimationFrame(updatePrice);
            }
        }
        
        requestAnimationFrame(updatePrice);
    }

    // Easing function
    function easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }

    // Initialize all product card animations
    function initAllProductAnimations() {
        initProductCardAnimations();
        init3DTiltEffect();
        initProductButtonAnimations();
        initProductParallax();
        initProductImageLoaders();
        initProductFeatureAnimations();
        initPriceAnimations();
    }

    // Call initialization
    initAllProductAnimations();

    // Re-initialize animations when dynamic content is loaded
    const originalShowProducts = showProductsInCategory;
    showProductsInCategory = function(categoryKey) {
        originalShowProducts.call(this, categoryKey);
        
        // Wait for DOM update then re-initialize animations
        setTimeout(() => {
            initAllProductAnimations();
        }, 100);
    };

    // Initialize hero title animation
    initHeroTitleAnimation();

    // Hero Title Animation Function - Subtle version
    function initHeroTitleAnimation() {
        const heroTitle = document.getElementById('hero-title');
        if (!heroTitle) return;

        // Simple fade-in animation
        heroTitle.style.opacity = '0';
        heroTitle.style.transform = 'translateY(20px)';
        heroTitle.style.transition = 'all 1.2s ease-out';
        
        // Trigger animation after a short delay
        setTimeout(() => {
            heroTitle.style.opacity = '1';
            heroTitle.style.transform = 'translateY(0)';
        }, 300);

        // Very subtle hover effect
        heroTitle.addEventListener('mouseenter', function() {
            this.style.textShadow = '0 0 20px rgba(255, 51, 51, 0.3)';
            this.style.transition = 'text-shadow 0.3s ease';
        });

        heroTitle.addEventListener('mouseleave', function() {
            this.style.textShadow = 'none';
        });
    }

    // Enhanced Hero Title Glitch Effect (called after character animation)
    function addHeroTitleGlitchEffect() {
        const heroTitle = document.getElementById('hero-title');
        if (!heroTitle) return;

        // Add glitch class temporarily
        heroTitle.classList.add('glitch-effect');
        
        setTimeout(() => {
            heroTitle.classList.remove('glitch-effect');
        }, 500);
    }
});
