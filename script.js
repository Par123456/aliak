// Global Variables
let currentSlide = 0;
let slideInterval;
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin123';

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeWebsite();
});

// Initialize Website
function initializeWebsite() {
    setTimeout(() => {
        hideLoadingScreen();
    }, 1500);
    
    initializeSlider();
    loadAllData();
    setupNavigation();
    setupEventListeners();
}

// Hide Loading Screen
function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        loadingScreen.classList.add('hidden');
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }
}

// Initialize Slider
function initializeSlider() {
    const slides = document.querySelectorAll('.slide');
    const dotsContainer = document.querySelector('.slider-dots');
    
    // Create dots
    slides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.className = 'dot';
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });
    
    // Auto play
    slideInterval = setInterval(() => {
        changeSlide(1);
    }, 5000);
}

// Change Slide
function changeSlide(direction) {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');
    
    currentSlide += direction;
    
    if (currentSlide >= slides.length) {
        currentSlide = 0;
    } else if (currentSlide < 0) {
        currentSlide = slides.length - 1;
    }
    
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
    
    resetSlideInterval();
}

// Go to specific slide
function goToSlide(index) {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');
    
    currentSlide = index;
    
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
    
    resetSlideInterval();
}

// Reset slide interval
function resetSlideInterval() {
    clearInterval(slideInterval);
    slideInterval = setInterval(() => {
        changeSlide(1);
    }, 5000);
}

// Setup Navigation
function setupNavigation() {
    const navLinks = document.querySelectorAll('.main-nav a');
    const footerLinks = document.querySelectorAll('.footer-col ul li a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', handleNavigation);
    });
    
    footerLinks.forEach(link => {
        link.addEventListener('click', handleNavigation);
    });
    
    // Handle hash changes
    window.addEventListener('hashchange', handleHashChange);
    
    // Handle initial hash
    if (window.location.hash) {
        handleHashChange();
    }
}

// Handle Navigation
function handleNavigation(e) {
    e.preventDefault();
    const page = this.getAttribute('data-page') || this.getAttribute('href').replace('#', '');
    
    // Update active nav link
    document.querySelectorAll('.main-nav a').forEach(link => {
        link.classList.remove('active');
    });
    this.classList.add('active');
    
    // Show page
    showPage(page);
    
    // Update URL hash
    window.location.hash = page;
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Handle Hash Change
function handleHashChange() {
    const page = window.location.hash.replace('#', '') || 'home';
    showPage(page);
    
    // Update active nav link
    document.querySelectorAll('.main-nav a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-page') === page || link.getAttribute('href') === `#${page}`) {
            link.classList.add('active');
        }
    });
}

// Show Page
function showPage(pageName) {
    const pages = document.querySelectorAll('.page-section');
    
    pages.forEach(page => {
        page.classList.remove('active');
    });
    
    const targetPage = document.getElementById(`${pageName}Page`);
    if (targetPage) {
        targetPage.classList.add('active');
    }
}

// Setup Event Listeners
function setupEventListeners() {
    // Close modal on outside click
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('adminModal');
        if (event.target === modal) {
            closeAdminModal();
        }
    });
}

// Load All Data
async function loadAllData() {
    await Promise.all([
        loadNews(),
        loadEvents(),
        loadAnnouncements(),
        loadAbsent(),
        loadCouncilMembers(),
        loadAssociationMembers()
    ]);
}

// Load News
async function loadNews() {
    try {
        const response = await fetch('api.php?action=getNews');
        const data = await response.json();
        
        if (data.success) {
            displayNews(data.data);
        }
    } catch (error) {
        console.error('Error loading news:', error);
        displayNews(getDefaultNews());
    }
}

// Get Default News
function getDefaultNews() {
    return [
        {
            id: 1,
            title: 'برگزاری مسابقات ورزشی بین کلاسی',
            content: 'مسابقات ورزشی بین کلاسی در رشته‌های فوتبال، والیبال و بسکتبال از تاریخ 15 آبان ماه آغاز می‌شود.',
            date: '1403/08/10',
            author: 'مدیریت مدرسه'
        },
        {
            id: 2,
            title: 'کسب مقام اول المپیاد ریاضی استانی',
            content: 'دانش‌آموز پایه نهم مدرسه ما موفق به کسب رتبه اول المپیاد ریاضی در سطح استان شد.',
            date: '1403/08/08',
            author: 'مسئول آموزش'
        },
        {
            id: 3,
            title: 'برگزاری کارگاه آموزشی برنامه‌نویسی',
            content: 'کارگاه آموزش رایگان برنامه‌نویسی پایتون ویژه دانش‌آموزان علاقه‌مند در روزهای پنج‌شنبه برگزار می‌شود.',
            date: '1403/08/05',
            author: 'معاون پرورشی'
        }
    ];
}

// Display News
function displayNews(newsArray) {
    const container = document.getElementById('newsContainer');
    if (!container) return;
    
    container.innerHTML = '';
    
    newsArray.slice(0, 6).forEach(news => {
        const newsCard = `
            <div class="news-card">
                <div class="news-image">
                    <i class="fas fa-newspaper"></i>
                </div>
                <div class="news-content">
                    <div class="news-meta">
                        <span><i class="far fa-calendar"></i> ${news.date}</span>
                        <span><i class="far fa-user"></i> ${news.author}</span>
                    </div>
                    <h3>${news.title}</h3>
                    <p>${news.content.substring(0, 150)}...</p>
                    <a href="#" class="read-more">ادامه مطلب <i class="fas fa-arrow-left"></i></a>
                </div>
            </div>
        `;
        container.innerHTML += newsCard;
    });
}

// Load Events
async function loadEvents() {
    try {
        const response = await fetch('api.php?action=getEvents');
        const data = await response.json();
        
        if (data.success) {
            displayEvents(data.data);
        }
    } catch (error) {
        console.error('Error loading events:', error);
        displayEvents(getDefaultEvents());
    }
}

// Get Default Events
function getDefaultEvents() {
    return [
        {
            id: 1,
            title: 'جشن دهه فجر',
            date: '1403/11/22',
            location: 'سالن ورزشی مدرسه',
            description: 'برگزاری برنامه‌های ویژه به مناسبت دهه مبارک فجر'
        },
        {
            id: 2,
            title: 'اردوی علمی - تفریحی',
            date: '1403/09/15',
            location: 'تفرجگاه بیستون',
            description: 'اردوی یک روزه دانش‌آموزان به همراه برنامه‌های علمی و تفریحی'
        },
        {
            id: 3,
            title: 'مسابقات قرآنی',
            date: '1403/09/20',
            location: 'نمازخانه مدرسه',
            description: 'برگزاری مسابقات حفظ و قرائت قرآن کریم'
        }
    ];
}

// Display Events
function displayEvents(eventsArray) {
    const container = document.getElementById('eventsContainer');
    if (!container) return;
    
    container.innerHTML = '';
    
    eventsArray.slice(0, 6).forEach(event => {
        const eventCard = `
            <div class="event-card">
                <div class="event-date">
                    <i class="far fa-calendar-alt"></i> ${event.date}
                </div>
                <h3>${event.title}</h3>
                <p>${event.description}</p>
                <div class="event-location">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${event.location}</span>
                </div>
            </div>
        `;
        container.innerHTML += eventCard;
    });
}

// Load Announcements
async function loadAnnouncements() {
    try {
        const response = await fetch('api.php?action=getAnnouncements');
        const data = await response.json();
        
        if (data.success) {
            displayAnnouncements(data.data);
        }
    } catch (error) {
        console.error('Error loading announcements:', error);
        displayAnnouncements(getDefaultAnnouncements());
    }
}

// Get Default Announcements
function getDefaultAnnouncements() {
    return [
        {
            id: 1,
            title: 'تعطیلی مدرسه در روز پنج‌شنبه',
            content: 'به اطلاع می‌رساند روز پنج‌شنبه به دلیل برگزاری جلسه شورای معلمان، مدرسه تعطیل می‌باشد.',
            date: '1403/08/10'
        },
        {
            id: 2,
            title: 'شروع ثبت‌نام کلاس‌های تقویتی',
            content: 'ثبت‌نام کلاس‌های تقویتی درس ریاضی و علوم از روز شنبه در دفتر مدرسه آغاز می‌شود.',
            date: '1403/08/09'
        },
        {
            id: 3,
            title: 'فراخوان شرکت در المپیاد علمی',
            content: 'دانش‌آموزان علاقه‌مند به شرکت در المپیادهای علمی می‌توانند تا پایان هفته نام‌نویسی کنند.',
            date: '1403/08/08'
        }
    ];
}

// Display Announcements
function displayAnnouncements(announcementsArray) {
    const container = document.getElementById('announcementsContainer');
    if (!container) return;
    
    container.innerHTML = '';
    
    announcementsArray.slice(0, 5).forEach(announcement => {
        const announcementCard = `
            <div class="announcement-card">
                <div class="announcement-icon">
                    <i class="fas fa-bullhorn"></i>
                </div>
                <div class="announcement-content">
                    <h3>${announcement.title}</h3>
                    <p>${announcement.content}</p>
                    <div class="announcement-meta">
                        <i class="far fa-calendar"></i> ${announcement.date}
                    </div>
                </div>
            </div>
        `;
        container.innerHTML += announcementCard;
    });
}

// Load Absent Students
async function loadAbsent() {
    try {
        const response = await fetch('api.php?action=getAbsent');
        const data = await response.json();
        
        if (data.success) {
            displayAbsent(data.data);
        }
    } catch (error) {
        console.error('Error loading absent:', error);
        displayAbsent(getDefaultAbsent());
    }
}

// Get Default Absent
function getDefaultAbsent() {
    return [
        {
            id: 1,
            name: 'علی احمدی',
            class: 'هفتم الف',
            duration: '3 روز',
            reason: 'بیماری',
            date: '1403/08/07'
        },
        {
            id: 2,
            name: 'محمد رضایی',
            class: 'هشتم ب',
            duration: '2 روز',
            reason: 'مسافرت',
            date: '1403/08/08'
        },
        {
            id: 3,
            name: 'حسین کریمی',
            class: 'نهم الف',
            duration: '1 روز',
            reason: 'بیماری',
            date: '1403/08/09'
        },
        {
            id: 4,
            name: 'رضا محمدی',
            class: 'هفتم ب',
            duration: '4 روز',
            reason: 'بیماری',
            date: '1403/08/06'
        }
    ];
}

// Display Absent Students
function displayAbsent(absentArray) {
    const container = document.getElementById('absentContainer');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (absentArray.length === 0) {
        container.innerHTML = '<p style="text-align: center; padding: 40px; color: var(--light-text);">در حال حاضر دانش‌آموز غایبی وجود ندارد.</p>';
        return;
    }
    
    absentArray.forEach(student => {
        const absentCard = `
            <div class="absent-card" data-class="${student.class}">
                <div class="absent-header">
                    <div class="absent-avatar">
                        <i class="fas fa-user"></i>
                    </div>
                    <div class="absent-info">
                        <h3>${student.name}</h3>
                        <div class="absent-class">
                            <i class="fas fa-door-open"></i> کلاس ${student.class}
                        </div>
                    </div>
                </div>
                <div class="absent-details">
                    <div class="absent-detail-item">
                        <i class="fas fa-clock"></i>
                        <span>مدت غیبت: ${student.duration}</span>
                    </div>
                    <div class="absent-detail-item">
                        <i class="fas fa-info-circle"></i>
                        <span>دلیل: ${student.reason}</span>
                    </div>
                    <div class="absent-detail-item">
                        <i class="far fa-calendar"></i>
                        <span>تاریخ: ${student.date}</span>
                    </div>
                </div>
            </div>
        `;
        container.innerHTML += absentCard;
    });
}

// Filter Absent Students
function filterAbsent() {
    const classFilter = document.getElementById('classFilter').value;
    const searchInput = document.getElementById('searchAbsent').value.toLowerCase();
    const absentCards = document.querySelectorAll('.absent-card');
    
    absentCards.forEach(card => {
        const studentClass = card.getAttribute('data-class');
        const studentName = card.querySelector('.absent-info h3').textContent.toLowerCase();
        
        const classMatch = !classFilter || studentClass === classFilter;
        const searchMatch = !searchInput || studentName.includes(searchInput);
        
        if (classMatch && searchMatch) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Load Council Members
async function loadCouncilMembers() {
    try {
        const response = await fetch('api.php?action=getCouncil');
        const data = await response.json();
        
        if (data.success) {
            displayCouncilMembers(data.data.main, data.data.alternate);
        }
    } catch (error) {
        console.error('Error loading council members:', error);
        const defaultData = getDefaultCouncil();
        displayCouncilMembers(defaultData.main, defaultData.alternate);
    }
}

// Get Default Council
function getDefaultCouncil() {
    return {
        main: [
            {
                id: 1,
                name: 'امیرحسین نوروزی',
                position: 'رئیس شورا',
                class: 'نهم الف',
                field: 'ریاضی'
            },
            {
                id: 2,
                name: 'محمدرضا کاظمی',
                position: 'نایب رئیس',
                class: 'نهم ب',
                field: 'تجربی'
            },
            {
                id: 3,
                name: 'علی اکبری',
                position: 'دبیر',
                class: 'هشتم الف',
                field: 'ریاضی'
            },
            {
                id: 4,
                name: 'حسین محمودی',
                position: 'مسئول فرهنگی',
                class: 'هشتم ب',
                field: 'تجربی'
            },
            {
                id: 5,
                name: 'رضا احمدیان',
                position: 'مسئول ورزشی',
                class: 'نهم ج',
                field: 'ریاضی'
            }
        ],
        alternate: [
            {
                id: 6,
                name: 'مهدی جعفری',
                position: 'عضو علی‌البدل',
                class: 'هشتم ج',
                field: 'تجربی'
            },
            {
                id: 7,
                name: 'سعید مرادی',
                position: 'عضو علی‌البدل',
                class: 'هفتم الف',
                field: 'ریاضی'
            },
            {
                id: 8,
                name: 'امیر حسینی',
                position: 'عضو علی‌البدل',
                class: 'هفتم ب',
                field: 'تجربی'
            }
        ]
    };
}

// Display Council Members
function displayCouncilMembers(mainMembers, alternateMembers) {
    const mainContainer = document.getElementById('councilMainContainer');
    const alternateContainer = document.getElementById('councilAlternateContainer');
    
    if (mainContainer) {
        mainContainer.innerHTML = '';
        mainMembers.forEach(member => {
            mainContainer.innerHTML += createMemberCard(member);
        });
    }
    
    if (alternateContainer) {
        alternateContainer.innerHTML = '';
        alternateMembers.forEach(member => {
            alternateContainer.innerHTML += createMemberCard(member);
        });
    }
}

// Create Member Card
function createMemberCard(member) {
    return `
        <div class="member-card">
            <div class="member-avatar">
                <i class="fas fa-user-graduate"></i>
            </div>
            <h3>${member.name}</h3>
            <div class="member-position">${member.position}</div>
            <div class="member-details">
                <div class="member-detail">
                    <i class="fas fa-door-open"></i>
                    <span>کلاس ${member.class}</span>
                </div>
                <div class="member-detail">
                    <i class="fas fa-book"></i>
                    <span>رشته ${member.field}</span>
                </div>
            </div>
        </div>
    `;
}

// Load Association Members
async function loadAssociationMembers() {
    try {
        const response = await fetch('api.php?action=getAssociation');
        const data = await response.json();
        
        if (data.success) {
            displayAssociationMembers(data.data);
        }
    } catch (error) {
        console.error('Error loading association members:', error);
        displayAssociationMembers(getDefaultAssociation());
    }
}

// Get Default Association
function getDefaultAssociation() {
    return [
        {
            id: 1,
            name: 'سید محمد حسینی',
            position: 'رئیس انجمن / مدیر مدرسه',
            phone: '0913-123-4567'
        },
        {
            id: 2,
            name: 'احمد رضایی',
            position: 'نایب رئیس / نماینده اولیاء',
            phone: '0913-234-5678'
        },
        {
            id: 3,
            name: 'محمود کریمی',
            position: 'دبیر / معاون آموزشی',
            phone: '0913-345-6789'
        },
        {
            id: 4,
            name: 'علیرضا احمدی',
            position: 'خزانه‌دار / نماینده اولیاء',
            phone: '0913-456-7890'
        },
        {
            id: 5,
            name: 'حسن محمودی',
            position: 'عضو / نماینده معلمان',
            phone: '0913-567-8901'
        },
        {
            id: 6,
            name: 'رضا نوری',
            position: 'عضو / نماینده اولیاء',
            phone: '0913-678-9012'
        }
    ];
}

// Display Association Members
function displayAssociationMembers(membersArray) {
    const container = document.getElementById('associationContainer');
    if (!container) return;
    
    container.innerHTML = '';
    
    membersArray.forEach(member => {
        const memberCard = `
            <div class="member-card">
                <div class="member-avatar">
                    <i class="fas fa-user-tie"></i>
                </div>
                <h3>${member.name}</h3>
                <div class="member-position">${member.position}</div>
                <div class="member-details">
                    <div class="member-detail">
                        <i class="fas fa-phone"></i>
                        <span>${member.phone}</span>
                    </div>
                </div>
            </div>
        `;
        container.innerHTML += memberCard;
    });
}

// Toggle Mobile Menu
function toggleMobileMenu() {
    const nav = document.querySelector('.main-nav');
    nav.style.display = nav.style.display === 'block' ? 'none' : 'block';
}

// Open Admin Modal
function openAdminModal() {
    const modal = document.getElementById('adminModal');
    modal.classList.add('show');
}

// Close Admin Modal
function closeAdminModal() {
    const modal = document.getElementById('adminModal');
    modal.classList.remove('show');
    document.getElementById('adminLoginForm').reset();
}

// Admin Login
async function adminLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('adminUsername').value;
    const password = document.getElementById('adminPassword').value;
    
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        sessionStorage.setItem('adminLoggedIn', 'true');
        closeAdminModal();
        showToast('ورود موفقیت‌آمیز بود', 'success');
        
        setTimeout(() => {
            window.location.href = 'admin.html';
        }, 1000);
    } else {
        showToast('نام کاربری یا رمز عبور اشتباه است', 'error');
    }
}

// Submit Contact Form
function submitContactForm(event) {
    event.preventDefault();
    
    showToast('پیام شما با موفقیت ارسال شد', 'success');
    event.target.reset();
}

// Show Toast Notification
function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type} show`;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && !this.hasAttribute('data-page')) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// Check if admin is logged in
function checkAdminAuth() {
    const isLoggedIn = sessionStorage.getItem('adminLoggedIn');
    if (!isLoggedIn) {
        window.location.href = 'index.html';
    }
}

// Logout Admin
function logoutAdmin() {
    sessionStorage.removeItem('adminLoggedIn');
    window.location.href = 'index.html';
}
