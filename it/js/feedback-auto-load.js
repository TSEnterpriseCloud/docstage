// Auto-load script per FeedbackButtonManager
// Questo script carica automaticamente il manager quando la pagina è pronta

(function() {
  'use strict';
  
  console.log('🔄 Auto-loading FeedbackButtonManager...');
  
  // Carica il manager solo se non è già presente
  if (window.feedbackManager) {
    console.log('✅ FeedbackButtonManager già presente');
    return;
  }
  
  // Funzione per caricare lo script del manager
  function loadFeedbackManager() {
    // Qui inseriamo il codice del FeedbackButtonManager direttamente
    // per evitare problemi di caricamento di file esterni
    
    class FeedbackButtonManager {
      constructor() {
        this.isActive = false;
        this.observer = null;
        this.intervalId = null;
        this.originalStyles = new Map();
        this.init();
      }

      init() {
        console.log('🎯 FeedbackButtonManager inizializzato (auto-load)');
        
        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
          this.setup();
        }
      }

      setup() {
        console.log('🔧 Setup FeedbackButtonManager (auto-load)');
        this.observeBodyChanges();
        this.startPeriodicCheck();
        this.listenForChatbotChanges();
      }

      observeBodyChanges() {
        this.observer = new MutationObserver((mutations) => {
          mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
              const hasClass = document.body.classList.contains('chatbot-open');
              console.log('📊 Body class changed (auto-load), chatbot-open:', hasClass);
              this.toggleFeedbackButton(hasClass);
            }
          });
        });

        this.observer.observe(document.body, {
          attributes: true,
          attributeFilter: ['class']
        });
      }

      startPeriodicCheck() {
        this.intervalId = setInterval(() => {
          if (document.body.classList.contains('chatbot-open')) {
            this.ensureFeedbackPosition();
          }
        }, 300); // Controllo più frequente
      }

      listenForChatbotChanges() {
        const chatbotButton = document.querySelector('.chatbot-navbar-button');
        if (chatbotButton) {
          chatbotButton.addEventListener('click', () => {
            console.log('🎯 Chatbot button clicked (auto-load)');
            setTimeout(() => {
              const isOpen = document.body.classList.contains('chatbot-open');
              this.toggleFeedbackButton(isOpen);
            }, 50);
          });
        }
      }

      getFeedbackElements() {
        const selectors = [
          'feedback-button',
          '.pushfeedback__button',
          '[class*="pushfeedback"]',
          '.feedback-widget',
          '.feedback-button',
          '[id*="feedback"]',
          '[class*="feedback"]'
        ];

        let elements = [];
        selectors.forEach(selector => {
          const found = document.querySelectorAll(selector);
          found.forEach(el => {
            if (!elements.includes(el)) {
              elements.push(el);
            }
          });
        });

        return elements;
      }

      toggleFeedbackButton(shouldMove) {
        const elements = this.getFeedbackElements();
        console.log(`🔄 Toggle feedback (auto-load), shouldMove: ${shouldMove}, elements: ${elements.length}`);

        elements.forEach((el, index) => {
          if (shouldMove) {
            this.moveFeedbackButton(el, index);
          } else {
            this.restoreFeedbackButton(el, index);
          }
        });
      }

      moveFeedbackButton(element, index) {
        console.log(`📍 Moving feedback button ${index} (auto-load):`, element);
        
        // Applica stili con massima priorità
        element.style.setProperty('transform', 'translateX(-480px)', 'important');
        element.style.setProperty('transition', 'transform 0.3s ease-in-out', 'important');
        element.style.setProperty('z-index', '9999', 'important');
        
        // Gestione position fixed
        const computed = window.getComputedStyle(element);
        if (computed.position === 'fixed') {
          const currentRight = parseInt(computed.right) || 20;
          element.style.setProperty('right', `${currentRight + 480}px`, 'important');
        }
        
        // Override aggressivo per contrastare il plugin
        setTimeout(() => {
          element.style.setProperty('transform', 'translateX(-480px)', 'important');
        }, 100);
      }

      restoreFeedbackButton(element, index) {
        console.log(`📍 Restoring feedback button ${index} (auto-load):`, element);
        
        element.style.removeProperty('transform');
        element.style.removeProperty('right');
        element.style.removeProperty('transition');
        element.style.removeProperty('z-index');
      }

      ensureFeedbackPosition() {
        const elements = this.getFeedbackElements();
        
        elements.forEach((el, index) => {
          const computed = window.getComputedStyle(el);
          const transform = computed.transform;
          
          if (!transform.includes('translateX(-480px)') && !transform.includes('matrix')) {
            console.log(`🔧 Auto-fixing feedback button position ${index}`);
            this.moveFeedbackButton(el, index);
          }
        });
      }

      destroy() {
        if (this.observer) {
          this.observer.disconnect();
        }
        if (this.intervalId) {
          clearInterval(this.intervalId);
        }
        console.log('🗑️ FeedbackButtonManager destroyed (auto-load)');
      }
    }

    // Inizializza il manager
    const feedbackManager = new FeedbackButtonManager();

    // Esponi globalmente
    window.feedbackManager = {
      manager: feedbackManager,
      debug: () => {
        const elements = feedbackManager.getFeedbackElements();
        console.log('📊 Debug info (auto-load):', {
          elements: elements.length,
          chatbotOpen: document.body.classList.contains('chatbot-open'),
          elements: elements.map(el => ({
            tagName: el.tagName,
            className: el.className,
            id: el.id,
            transform: window.getComputedStyle(el).transform,
            right: window.getComputedStyle(el).right
          }))
        });
      },
      forceMove: () => {
        feedbackManager.toggleFeedbackButton(true);
      },
      forceRestore: () => {
        feedbackManager.toggleFeedbackButton(false);
      }
    };

    console.log('🚀 FeedbackButtonManager auto-loaded!');
  }
  
  // Carica il manager
  loadFeedbackManager();
  
})();
