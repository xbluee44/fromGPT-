// FormGPT Main JavaScript
class FormGPT {
    constructor() {
        this.currentAPI = 'chatgpt';
        this.messages = [];
        this.isRecording = false;
        this.mediaRecorder = null;
        this.audioChunks = [];
        this.init();
    }

    init() {
        this.initParticles();
        this.initTypedText();
        this.initEventListeners();
        this.initAnimations();
        this.loadConversationHistory();
    }

    // Initialize floating particles background
    initParticles() {
        const particlesContainer = document.getElementById('particles');
        if (!particlesContainer) return;

        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 5 + 's';
            particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
            particlesContainer.appendChild(particle);

            // Animate particle movement
            anime({
                targets: particle,
                translateX: () => anime.random(-100, 100),
                translateY: () => anime.random(-100, 100),
                scale: () => anime.random(0.5, 1.5),
                opacity: () => anime.random(0.3, 0.8),
                duration: () => anime.random(10000, 20000),
                easing: 'linear',
                loop: true,
                direction: 'alternate'
            });
        }
    }

    // Initialize typed text animation
    initTypedText() {
        const typedElement = document.getElementById('typed-text');
        if (typedElement) {
            new Typed('#typed-text', {
                strings: [
                    'Advanced AI Assistant',
                    'Multi-Model Chat Platform',
                    'Content Creation Hub',
                    'Your AI-Powered Workspace'
                ],
                typeSpeed: 80,
                backSpeed: 40,
                backDelay: 2000,
                loop: true,
                showCursor: true,
                cursorChar: '|'
            });
        }
    }

    // Initialize event listeners
    initEventListeners() {
        // API selector buttons
        document.querySelectorAll('.api-selector').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.selectAPI(e.target.dataset.api);
            });
        });

        // Message input
        const messageInput = document.getElementById('message-input');
        const sendBtn = document.getElementById('send-btn');
        
        if (messageInput) {
            messageInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage();
                }
            });
        }

        if (sendBtn) {
            sendBtn.addEventListener('click', () => this.sendMessage());
        }

        // File upload
        const uploadArea = document.querySelector('.upload-area');
        const fileInput = document.getElementById('file-input');
        
        if (uploadArea && fileInput) {
            uploadArea.addEventListener('click', () => fileInput.click());
            uploadArea.addEventListener('dragover', (e) => {
                e.preventDefault();
                uploadArea.classList.add('border-blue-400', 'bg-blue-50');
            });
            uploadArea.addEventListener('dragleave', () => {
                uploadArea.classList.remove('border-blue-400', 'bg-blue-50');
            });
            uploadArea.addEventListener('drop', (e) => {
                e.preventDefault();
                uploadArea.classList.remove('border-blue-400', 'bg-blue-50');
                this.handleFileUpload(e.dataTransfer.files);
            });
            
            fileInput.addEventListener('change', (e) => {
                this.handleFileUpload(e.target.files);
            });
        }

        // Voice recording
        const voiceBtn = document.getElementById('voice-btn');
        if (voiceBtn) {
            voiceBtn.addEventListener('click', () => this.toggleVoiceRecording());
        }

        // Mobile menu
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        if (mobileMenuBtn) {
            mobileMenuBtn.addEventListener('click', () => this.toggleMobileMenu());
        }
    }

    // Initialize animations
    initAnimations() {
        // Animate feature cards on scroll
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    anime({
                        targets: entry.target,
                        translateY: [50, 0],
                        opacity: [0, 1],
                        duration: 800,
                        easing: 'easeOutQuart',
                        delay: anime.stagger(100)
                    });
                }
            });
        }, observerOptions);

        document.querySelectorAll('.feature-card').forEach(card => {
            observer.observe(card);
        });
    }

    // API Selection
    selectAPI(apiName) {
        this.currentAPI = apiName;
        
        // Update UI
        document.querySelectorAll('.api-selector').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-api="${apiName}"]`).classList.add('active');

        // Show notification
        this.showNotification(`Switched to ${apiName.toUpperCase()} API`, 'info');
    }

    // Send message
    async sendMessage() {
        const messageInput = document.getElementById('message-input');
        const sendBtn = document.getElementById('send-btn');
        
        if (!messageInput || !messageInput.value.trim()) return;

        const message = messageInput.value.trim();
        messageInput.value = '';
        
        // Disable send button temporarily
        sendBtn.disabled = true;

        // Add user message to chat
        this.addMessage(message, 'user');

        // Show typing indicator
        this.showTypingIndicator();

        try {
            // Simulate API call (replace with actual API integration)
            const response = await this.simulateAIResponse(message);
            this.hideTypingIndicator();
            this.addMessage(response, 'ai');
        } catch (error) {
            this.hideTypingIndicator();
            this.addMessage('Sorry, I encountered an error. Please try again.', 'ai');
            console.error('API Error:', error);
        } finally {
            sendBtn.disabled = false;
        }
    }

    // Add message to chat
    addMessage(content, sender) {
        const chatMessages = document.getElementById('chat-messages');
        if (!chatMessages) return;

        const messageDiv = document.createElement('div');
        messageDiv.className = 'message-bubble flex items-start space-x-3';

        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        if (sender === 'user') {
            messageDiv.innerHTML = `
                <div class="flex-1">
                    <div class="bg-blue-600 text-white rounded-lg p-4 ml-12">
                        <p>${this.escapeHtml(content)}</p>
                    </div>
                    <span class="text-xs text-gray-500 mt-1 block text-right">You • ${timestamp}</span>
                </div>
                <div class="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"/>
                    </svg>
                </div>
            `;
        } else {
            messageDiv.innerHTML = `
                <div class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                </div>
                <div class="flex-1">
                    <div class="bg-gray-800 rounded-lg p-4">
                        <p class="text-gray-300">${this.escapeHtml(content)}</p>
                    </div>
                    <span class="text-xs text-gray-500 mt-1 block">FormGPT • ${timestamp}</span>
                </div>
            `;
        }

        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        // Store message in history
        this.messages.push({
            content: content,
            sender: sender,
            timestamp: new Date().toISOString(),
            api: this.currentAPI
        });

        // Save to localStorage
        this.saveConversationHistory();
    }

    // Show typing indicator
    showTypingIndicator() {
        const chatMessages = document.getElementById('chat-messages');
        if (!chatMessages) return;

        const typingDiv = document.createElement('div');
        typingDiv.id = 'typing-indicator';
        typingDiv.className = 'message-bubble flex items-start space-x-3';
        typingDiv.innerHTML = `
            <div class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
            </div>
            <div class="flex-1">
                <div class="bg-gray-800 rounded-lg p-4">
                    <div class="flex space-x-1">
                        <div class="typing-indicator w-2 h-2 bg-gray-400 rounded-full"></div>
                        <div class="typing-indicator w-2 h-2 bg-gray-400 rounded-full" style="animation-delay: 0.2s;"></div>
                        <div class="typing-indicator w-2 h-2 bg-gray-400 rounded-full" style="animation-delay: 0.4s;"></div>
                    </div>
                </div>
            </div>
        `;

        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Hide typing indicator
    hideTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    // Simulate AI response (replace with actual API calls)
    async simulateAIResponse(message) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

        const responses = {
            chatgpt: [
                "I understand you're asking about that topic. Let me provide you with a comprehensive analysis based on the latest information available.",
                "That's an interesting question! I can help you explore various aspects of this subject and provide detailed insights.",
                "Based on my analysis, I can offer you several perspectives on this matter. Would you like me to elaborate on any specific point?",
                "I've processed your request and can provide you with relevant information. Let me know if you need any clarification."
            ],
            grok: [
                "Ah, I see what you're getting at! This is quite fascinating from both a technical and philosophical perspective.",
                "Let me break this down for you in a way that's both informative and engaging. There's a lot to unpack here.",
                "That's a thought-provoking question! I can approach this from multiple angles to give you a well-rounded perspective.",
                "Interesting! This reminds me of several related concepts. Let me connect the dots for you."
            ],
            emergent: [
                "Analyzing your query through multiple contextual lenses, I can provide you with synthesized insights.",
                "From an emergent systems perspective, this presents several fascinating patterns and implications.",
                "Let me process this through my analytical frameworks to give you a comprehensive response.",
                "This is quite intriguing when viewed through the lens of complex adaptive systems."
            ]
        };

        const apiResponses = responses[this.currentAPI] || responses.chatgpt;
        return apiResponses[Math.floor(Math.random() * apiResponses.length)];
    }

    // Handle file upload
    async handleFileUpload(files) {
        if (!files || files.length === 0) return;

        const file = files[0];
        const maxSize = 10 * 1024 * 1024; // 10MB limit

        if (file.size > maxSize) {
            this.showNotification('File size exceeds 10MB limit', 'error');
            return;
        }

        // Show upload progress
        this.showNotification(`Uploading ${file.name}...`, 'info');

        try {
            // Simulate file processing
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Add file analysis message
            this.addMessage(`I've analyzed the uploaded file: ${file.name} (${(file.size / 1024).toFixed(2)}KB). I can help you extract information, summarize content, or answer questions about this file.`, 'ai');
            
            this.showNotification('File uploaded successfully', 'success');
        } catch (error) {
            this.showNotification('File upload failed', 'error');
            console.error('File upload error:', error);
        }
    }

    // Voice recording functionality
    async toggleVoiceRecording() {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            this.showNotification('Voice recording not supported in this browser', 'error');
            return;
        }

        const voiceRecordingIndicator = document.getElementById('voice-recording');
        
        if (!this.isRecording) {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                this.mediaRecorder = new MediaRecorder(stream);
                this.audioChunks = [];

                this.mediaRecorder.ondataavailable = (event) => {
                    this.audioChunks.push(event.data);
                };

                this.mediaRecorder.onstop = () => {
                    const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
                    this.processVoiceMessage(audioBlob);
                };

                this.mediaRecorder.start();
                this.isRecording = true;
                
                if (voiceRecordingIndicator) {
                    voiceRecordingIndicator.classList.remove('hidden');
                }
                
                this.showNotification('Recording started', 'info');
            } catch (error) {
                this.showNotification('Microphone access denied', 'error');
                console.error('Microphone error:', error);
            }
        } else {
            if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
                this.mediaRecorder.stop();
                this.mediaRecorder.stream.getTracks().forEach(track => track.stop());
            }
            
            this.isRecording = false;
            
            if (voiceRecordingIndicator) {
                voiceRecordingIndicator.classList.add('hidden');
            }
            
            this.showNotification('Recording stopped', 'info');
        }
    }

    // Process voice message
    async processVoiceMessage(audioBlob) {
        this.showNotification('Processing voice message...', 'info');
        
        try {
            // Simulate voice processing
            await new Promise(resolve => setTimeout(resolve, 3000));
            
            this.addMessage('I received your voice message. I can process audio content and respond to spoken queries. What would you like to know?', 'ai');
            
            this.showNotification('Voice message processed', 'success');
        } catch (error) {
            this.showNotification('Voice processing failed', 'error');
            console.error('Voice processing error:', error);
        }
    }

    // Mobile menu toggle
    toggleMobileMenu() {
        // Implementation for mobile menu
        this.showNotification('Mobile menu toggled', 'info');
    }

    // Utility functions
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `fixed top-20 right-6 z-50 px-6 py-4 rounded-lg shadow-lg transform translate-x-full transition-transform duration-300`;
        
        const colors = {
            info: 'bg-blue-600 text-white',
            success: 'bg-green-600 text-white',
            error: 'bg-red-600 text-white',
            warning: 'bg-yellow-600 text-black'
        };
        
        notification.className += ` ${colors[type] || colors.info}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Animate out and remove
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    saveConversationHistory() {
        try {
            localStorage.setItem('formgpt_conversation', JSON.stringify(this.messages));
        } catch (error) {
            console.error('Failed to save conversation:', error);
        }
    }

    loadConversationHistory() {
        try {
            const saved = localStorage.getItem('formgpt_conversation');
            if (saved) {
                this.messages = JSON.parse(saved);
                // Display recent messages
                const recentMessages = this.messages.slice(-10);
                recentMessages.forEach(msg => {
                    if (msg.sender !== 'typing') {
                        this.addMessageToChat(msg.content, msg.sender, false);
                    }
                });
            }
        } catch (error) {
            console.error('Failed to load conversation:', error);
        }
    }

    addMessageToChat(content, sender, scroll = false) {
        // This is a simplified version for loading history
        // Full implementation is in addMessage method
    }
}

// Initialize FormGPT when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.formGPT = new FormGPT();
});

// Social Media Downloader Functions
class SocialDownloader {
    constructor() {
        this.downloadQueue = [];
        this.isProcessing = false;
    }

    async downloadFromURL(url, platform) {
        try {
            // Validate URL based on platform
            if (!this.validateURL(url, platform)) {
                throw new Error('Invalid URL for selected platform');
            }

            // Add to queue
            const downloadItem = {
                id: Date.now(),
                url: url,
                platform: platform,
                status: 'pending',
                progress: 0
            };

            this.downloadQueue.push(downloadItem);
            this.updateDownloadUI();
            
            if (!this.isProcessing) {
                this.processQueue();
            }

            return downloadItem.id;
        } catch (error) {
            console.error('Download error:', error);
            throw error;
        }
    }

    validateURL(url, platform) {
        const patterns = {
            tiktok: /^(https?:\/\/)?(www\.)?(tiktok\.com|vm\.tiktok\.com)\/.+/,
            youtube: /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/,
            spotify: /^(https?:\/\/)?(open\.)?spotify\.com\/.+/,
            instagram: /^(https?:\/\/)?(www\.)?instagram\.com\/.+/
        };

        return patterns[platform]?.test(url) || false;
    }

    async processQueue() {
        if (this.isProcessing || this.downloadQueue.length === 0) return;

        this.isProcessing = true;
        const item = this.downloadQueue.find(item => item.status === 'pending');
        
        if (item) {
            item.status = 'processing';
            this.updateDownloadUI();

            try {
                // Simulate download process
                for (let progress = 0; progress <= 100; progress += 10) {
                    item.progress = progress;
                    this.updateDownloadUI();
                    await new Promise(resolve => setTimeout(resolve, 200));
                }

                item.status = 'completed';
                item.progress = 100;
                this.updateDownloadUI();

                // Show success notification
                window.formGPT?.showNotification(`${item.platform} download completed!`, 'success');
            } catch (error) {
                item.status = 'failed';
                this.updateDownloadUI();
                window.formGPT?.showNotification('Download failed', 'error');
            }
        }

        this.isProcessing = false;
        
        // Process next item
        setTimeout(() => this.processQueue(), 1000);
    }

    updateDownloadUI() {
        // This would update the download queue UI
        // Implementation depends on the specific page structure
    }
}

// AI Website Builder Functions
class AIWebsiteBuilder {
    constructor() {
        this.templates = this.loadTemplates();
        this.currentProject = null;
    }

    loadTemplates() {
        return [
            { id: 1, name: 'Business Landing', category: 'business', description: 'Professional landing page for businesses' },
            { id: 2, name: 'Portfolio Site', category: 'portfolio', description: 'Creative portfolio for designers and artists' },
            { id: 3, name: 'E-commerce Store', category: 'commerce', description: 'Online store with product listings' },
            { id: 4, name: 'Blog Template', category: 'blog', description: 'Clean blog layout with articles' },
            { id: 5, name: 'Restaurant Site', category: 'restaurant', description: 'Restaurant with menu and booking' },
            { id: 6, name: 'Tech Startup', category: 'startup', description: 'Modern startup landing page' },
            { id: 7, name: 'Personal Website', category: 'personal', description: 'Personal branding website' },
            { id: 8, name: 'Event Landing', category: 'event', description: 'Event promotion and registration' }
        ];
    }

    async generateWebsite(prompt, templateId = null) {
        try {
            // Show loading state
            window.formGPT?.showNotification('Generating website...', 'info');

            // Simulate AI processing
            await new Promise(resolve => setTimeout(resolve, 3000));

            // Generate mock website structure
            const website = {
                id: Date.now(),
                prompt: prompt,
                template: templateId,
                pages: [
                    {
                        name: 'index',
                        title: 'Home',
                        content: this.generateHTML(prompt),
                        css: this.generateCSS(),
                        js: this.generateJS()
                    }
                ],
                timestamp: new Date().toISOString()
            };

            this.currentProject = website;
            
            window.formGPT?.showNotification('Website generated successfully!', 'success');
            return website;
        } catch (error) {
            window.formGPT?.showNotification('Website generation failed', 'error');
            throw error;
        }
    }

    generateHTML(prompt) {
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI Generated Website</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <header>
        <nav>
            <h1>Welcome to Your AI Generated Site</h1>
            <ul>
                <li><a href="#home">Home</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#contact">Contact</a></li>
            </ul>
        </nav>
    </header>
    
    <main>
        <section id="hero">
            <h2>Generated based on: "${prompt}"</h2>
            <p>This website was created by AI using your description.</p>
            <button>Get Started</button>
        </section>
        
        <section id="features">
            <h3>Features</h3>
            <div class="feature-grid">
                <div class="feature">AI Powered</div>
                <div class="feature">Responsive Design</div>
                <div class="feature">Modern UI</div>
            </div>
        </section>
    </main>
    
    <footer>
        <p>&copy; 2025 AI Generated Website</p>
    </footer>
    
    <script src="script.js"></script>
</body>
</html>`;
    }

    generateCSS() {
        return `/* AI Generated Styles */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Inter', sans-serif;
    line-height: 1.6;
    color: #333;
}

header {
    background: #0066ff;
    color: white;
    padding: 1rem 0;
}

nav {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

nav ul {
    display: flex;
    list-style: none;
    gap: 2rem;
}

nav a {
    color: white;
    text-decoration: none;
}

#hero {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 4rem 2rem;
    text-align: center;
}

#hero h2 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
}

#hero button {
    background: white;
    color: #667eea;
    padding: 1rem 2rem;
    border: none;
    border-radius: 5px;
    font-size: 1.1rem;
    cursor: pointer;
    margin-top: 2rem;
}

#features {
    padding: 4rem 2rem;
    max-width: 1200px;
    margin: 0 auto;
}

.feature-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
    margin-top: 2rem;
}

.feature {
    background: #f4f4f4;
    padding: 2rem;
    border-radius: 10px;
    text-align: center;
}

footer {
    background: #333;
    color: white;
    text-align: center;
    padding: 2rem;
}`;
    }

    generateJS() {
        return `// AI Generated JavaScript
document.addEventListener('DOMContentLoaded', function() {
    console.log('AI Generated Website Loaded');
    
    // Add some basic interactivity
    const button = document.querySelector('#hero button');
    if (button) {
        button.addEventListener('click', function() {
            alert('Welcome to your AI generated website!');
        });
    }
    
    // Smooth scrolling for navigation
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});`;
    }
}

// Initialize additional modules
window.socialDownloader = new SocialDownloader();
window.aiBuilder = new AIWebsiteBuilder();