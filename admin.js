// Check admin authentication on page load
document.addEventListener('DOMContentLoaded', function() {
    checkAdminAuth();
    initializeAdmin();
});

// Initialize Admin Panel
function initializeAdmin() {
    setupAdminNavigation();
    loadAdminData();
    updateDashboardStats();
}

// Setup Admin Navigation
function setupAdminNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
            
            const section = this.getAttribute('data-section');
            showSection(section);
        });
    });
}

// Show Section
function showSection(sectionName) {
    const sections = document.querySelectorAll('.admin-section');
    sections.forEach(section => section.classList.remove('active'));
    
    const targetSection = document.getElementById(`${sectionName}Section`);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // Update title
    const titles = {
        dashboard: 'داشبورد',
        news: 'مدیریت اخبار',
        events: 'مدیریت رویدادها',
        announcements: 'مدیریت اطلاعیه‌ها',
        absent: 'مدیریت غایبین',
        council: 'مدیریت شورای دانش‌آموزی',
        association: 'مدیریت انجمن اولیاء و مربیان'
    };
    
    document.getElementById('sectionTitle').textContent = titles[sectionName] || 'پنل مدیریت';
}

// Load Admin Data
async function loadAdminData() {
    await Promise.all([
        loadAdminNews(),
        loadAdminEvents(),
        loadAdminAnnouncements(),
        loadAdminAbsent(),
        loadAdminCouncil(),
        loadAdminAssociation()
    ]);
}

// Update Dashboard Stats
async function updateDashboardStats() {
    try {
        const [news, events, announcements, absent] = await Promise.all([
            fetch('api.php?action=getNews').then(r => r.json()),
            fetch('api.php?action=getEvents').then(r => r.json()),
            fetch('api.php?action=getAnnouncements').then(r => r.json()),
            fetch('api.php?action=getAbsent').then(r => r.json())
        ]);
        
        document.getElementById('newsCount').textContent = news.data?.length || 0;
        document.getElementById('eventsCount').textContent = events.data?.length || 0;
        document.getElementById('announcementsCount').textContent = announcements.data?.length || 0;
        document.getElementById('absentCount').textContent = absent.data?.length || 0;
    } catch (error) {
        console.error('Error updating stats:', error);
    }
}

// Toggle Sidebar (Mobile)
function toggleSidebar() {
    const sidebar = document.querySelector('.admin-sidebar');
    sidebar.classList.toggle('show');
}

// ============= NEWS MANAGEMENT =============

// Load Admin News
async function loadAdminNews() {
    try {
        const response = await fetch('api.php?action=getNews');
        const data = await response.json();
        
        if (data.success) {
            displayAdminNews(data.data);
        }
    } catch (error) {
        console.error('Error loading news:', error);
    }
}

// Display Admin News
function displayAdminNews(newsArray) {
    const tbody = document.getElementById('newsTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    if (newsArray.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 40px; color: var(--light-text);">هیچ خبری یافت نشد</td></tr>';
        return;
    }
    
    newsArray.forEach(news => {
        const row = `
            <tr>
                <td>${news.id}</td>
                <td>${news.title}</td>
                <td>${news.date}</td>
                <td>${news.author}</td>
                <td>
                    <button class="btn-edit" onclick='editNews(${JSON.stringify(news)})'>
                        <i class="fas fa-edit"></i> ویرایش
                    </button>
                    <button class="btn-delete" onclick="deleteNews(${news.id})">
                        <i class="fas fa-trash"></i> حذف
                    </button>
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

// Open Add News Modal
function openAddNewsModal() {
    const modal = createModal('افزودن خبر جدید', `
        <form class="admin-form" onsubmit="submitNews(event)">
            <div class="admin-form-group">
                <label>عنوان خبر *</label>
                <input type="text" name="title" required>
            </div>
            <div class="admin-form-group">
                <label>محتوای خبر *</label>
                <textarea name="content" required></textarea>
            </div>
            <div class="admin-form-group">
                <label>تاریخ *</label>
                <input type="text" name="date" value="1403/08/10" required>
            </div>
            <div class="admin-form-group">
                <label>نویسنده *</label>
                <input type="text" name="author" value="مدیریت مدرسه" required>
            </div>
            <div class="admin-form-actions">
                <button type="button" class="btn-cancel" onclick="closeModal()">انصراف</button>
                <button type="submit" class="btn-submit">ذخیره</button>
            </div>
        </form>
    `);
    
    showModal(modal);
}

// Submit News
async function submitNews(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const newsData = Object.fromEntries(formData);
    
    try {
        const response = await fetch('api.php?action=addNews', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newsData)
        });
        
        const result = await response.json();
        
        if (result.success) {
            showToast('خبر با موفقیت اضافه شد', 'success');
            closeModal();
            loadAdminNews();
            updateDashboardStats();
        } else {
            showToast('خطا در افزودن خبر', 'error');
        }
    } catch (error) {
        console.error('Error submitting news:', error);
        showToast('خطا در ارتباط با سرور', 'error');
    }
}

// Edit News
function editNews(news) {
    const modal = createModal('ویرایش خبر', `
        <form class="admin-form" onsubmit="updateNews(event, ${news.id})">
            <div class="admin-form-group">
                <label>عنوان خبر *</label>
                <input type="text" name="title" value="${news.title}" required>
            </div>
            <div class="admin-form-group">
                <label>محتوای خبر *</label>
                <textarea name="content" required>${news.content}</textarea>
            </div>
            <div class="admin-form-group">
                <label>تاریخ *</label>
                <input type="text" name="date" value="${news.date}" required>
            </div>
            <div class="admin-form-group">
                <label>نویسنده *</label>
                <input type="text" name="author" value="${news.author}" required>
            </div>
            <div class="admin-form-actions">
                <button type="button" class="btn-cancel" onclick="closeModal()">انصراف</button>
                <button type="submit" class="btn-submit">بروزرسانی</button>
            </div>
        </form>
    `);
    
    showModal(modal);
}

// Update News
async function updateNews(event, id) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const newsData = Object.fromEntries(formData);
    newsData.id = id;
    
    try {
        const response = await fetch('api.php?action=updateNews', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newsData)
        });
        
        const result = await response.json();
        
        if (result.success) {
            showToast('خبر با موفقیت بروزرسانی شد', 'success');
            closeModal();
            loadAdminNews();
        } else {
            showToast('خطا در بروزرسانی خبر', 'error');
        }
    } catch (error) {
        console.error('Error updating news:', error);
        showToast('خطا در ارتباط با سرور', 'error');
    }
}

// Delete News
async function deleteNews(id) {
    if (!confirm('آیا از حذف این خبر اطمینان دارید؟')) return;
    
    try {
        const response = await fetch('api.php?action=deleteNews', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id })
        });
        
        const result = await response.json();
        
        if (result.success) {
            showToast('خبر با موفقیت حذف شد', 'success');
            loadAdminNews();
            updateDashboardStats();
        } else {
            showToast('خطا در حذف خبر', 'error');
        }
    } catch (error) {
        console.error('Error deleting news:', error);
        showToast('خطا در ارتباط با سرور', 'error');
    }
}

// ============= EVENTS MANAGEMENT =============

// Load Admin Events
async function loadAdminEvents() {
    try {
        const response = await fetch('api.php?action=getEvents');
        const data = await response.json();
        
        if (data.success) {
            displayAdminEvents(data.data);
        }
    } catch (error) {
        console.error('Error loading events:', error);
    }
}

// Display Admin Events
function displayAdminEvents(eventsArray) {
    const tbody = document.getElementById('eventsTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    if (eventsArray.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 40px; color: var(--light-text);">هیچ رویدادی یافت نشد</td></tr>';
        return;
    }
    
    eventsArray.forEach(event => {
        const row = `
            <tr>
                <td>${event.id}</td>
                <td>${event.title}</td>
                <td>${event.date}</td>
                <td>${event.location}</td>
                <td>
                    <button class="btn-edit" onclick='editEvent(${JSON.stringify(event)})'>
                        <i class="fas fa-edit"></i> ویرایش
                    </button>
                    <button class="btn-delete" onclick="deleteEvent(${event.id})">
                        <i class="fas fa-trash"></i> حذف
                    </button>
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

// Open Add Event Modal
function openAddEventModal() {
    const modal = createModal('افزودن رویداد جدید', `
        <form class="admin-form" onsubmit="submitEvent(event)">
            <div class="admin-form-group">
                <label>عنوان رویداد *</label>
                <input type="text" name="title" required>
            </div>
            <div class="admin-form-group">
                <label>توضیحات *</label>
                <textarea name="description" required></textarea>
            </div>
            <div class="admin-form-group">
                <label>تاریخ *</label>
                <input type="text" name="date" value="1403/09/15" required>
            </div>
            <div class="admin-form-group">
                <label>مکان *</label>
                <input type="text" name="location" required>
            </div>
            <div class="admin-form-actions">
                <button type="button" class="btn-cancel" onclick="closeModal()">انصراف</button>
                <button type="submit" class="btn-submit">ذخیره</button>
            </div>
        </form>
    `);
    
    showModal(modal);
}

// Submit Event
async function submitEvent(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const eventData = Object.fromEntries(formData);
    
    try {
        const response = await fetch('api.php?action=addEvent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(eventData)
        });
        
        const result = await response.json();
        
        if (result.success) {
            showToast('رویداد با موفقیت اضافه شد', 'success');
            closeModal();
            loadAdminEvents();
            updateDashboardStats();
        } else {
            showToast('خطا در افزودن رویداد', 'error');
        }
    } catch (error) {
        console.error('Error submitting event:', error);
        showToast('خطا در ارتباط با سرور', 'error');
    }
}

// Edit Event
function editEvent(eventObj) {
    const modal = createModal('ویرایش رویداد', `
        <form class="admin-form" onsubmit="updateEvent(event, ${eventObj.id})">
            <div class="admin-form-group">
                <label>عنوان رویداد *</label>
                <input type="text" name="title" value="${eventObj.title}" required>
            </div>
            <div class="admin-form-group">
                <label>توضیحات *</label>
                <textarea name="description" required>${eventObj.description}</textarea>
            </div>
            <div class="admin-form-group">
                <label>تاریخ *</label>
                <input type="text" name="date" value="${eventObj.date}" required>
            </div>
            <div class="admin-form-group">
                <label>مکان *</label>
                <input type="text" name="location" value="${eventObj.location}" required>
            </div>
            <div class="admin-form-actions">
                <button type="button" class="btn-cancel" onclick="closeModal()">انصراف</button>
                <button type="submit" class="btn-submit">بروزرسانی</button>
            </div>
        </form>
    `);
    
    showModal(modal);
}

// Update Event
async function updateEvent(event, id) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const eventData = Object.fromEntries(formData);
    eventData.id = id;
    
    try {
        const response = await fetch('api.php?action=updateEvent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(eventData)
        });
        
        const result = await response.json();
        
        if (result.success) {
            showToast('رویداد با موفقیت بروزرسانی شد', 'success');
            closeModal();
            loadAdminEvents();
        } else {
            showToast('خطا در بروزرسانی رویداد', 'error');
        }
    } catch (error) {
        console.error('Error updating event:', error);
        showToast('خطا در ارتباط با سرور', 'error');
    }
}

// Delete Event
async function deleteEvent(id) {
    if (!confirm('آیا از حذف این رویداد اطمینان دارید؟')) return;
    
    try {
        const response = await fetch('api.php?action=deleteEvent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id })
        });
        
        const result = await response.json();
        
        if (result.success) {
            showToast('رویداد با موفقیت حذف شد', 'success');
            loadAdminEvents();
            updateDashboardStats();
        } else {
            showToast('خطا در حذف رویداد', 'error');
        }
    } catch (error) {
        console.error('Error deleting event:', error);
        showToast('خطا در ارتباط با سرور', 'error');
    }
}

// ============= ANNOUNCEMENTS MANAGEMENT =============

// Load Admin Announcements
async function loadAdminAnnouncements() {
    try {
        const response = await fetch('api.php?action=getAnnouncements');
        const data = await response.json();
        
        if (data.success) {
            displayAdminAnnouncements(data.data);
        }
    } catch (error) {
        console.error('Error loading announcements:', error);
    }
}

// Display Admin Announcements
function displayAdminAnnouncements(announcementsArray) {
    const tbody = document.getElementById('announcementsTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    if (announcementsArray.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 40px; color: var(--light-text);">هیچ اطلاعیه‌ای یافت نشد</td></tr>';
        return;
    }
    
    announcementsArray.forEach(announcement => {
        const row = `
            <tr>
                <td>${announcement.id}</td>
                <td>${announcement.title}</td>
                <td>${announcement.date}</td>
                <td>
                    <button class="btn-edit" onclick='editAnnouncement(${JSON.stringify(announcement)})'>
                        <i class="fas fa-edit"></i> ویرایش
                    </button>
                    <button class="btn-delete" onclick="deleteAnnouncement(${announcement.id})">
                        <i class="fas fa-trash"></i> حذف
                    </button>
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

// Open Add Announcement Modal
function openAddAnnouncementModal() {
    const modal = createModal('افزودن اطلاعیه جدید', `
        <form class="admin-form" onsubmit="submitAnnouncement(event)">
            <div class="admin-form-group">
                <label>عنوان اطلاعیه *</label>
                <input type="text" name="title" required>
            </div>
            <div class="admin-form-group">
                <label>محتوای اطلاعیه *</label>
                <textarea name="content" required></textarea>
            </div>
            <div class="admin-form-group">
                <label>تاریخ *</label>
                <input type="text" name="date" value="1403/08/10" required>
            </div>
            <div class="admin-form-actions">
                <button type="button" class="btn-cancel" onclick="closeModal()">انصراف</button>
                <button type="submit" class="btn-submit">ذخیره</button>
            </div>
        </form>
    `);
    
    showModal(modal);
}

// Submit Announcement
async function submitAnnouncement(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const announcementData = Object.fromEntries(formData);
    
    try {
        const response = await fetch('api.php?action=addAnnouncement', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(announcementData)
        });
        
        const result = await response.json();
        
        if (result.success) {
            showToast('اطلاعیه با موفقیت اضافه شد', 'success');
            closeModal();
            loadAdminAnnouncements();
            updateDashboardStats();
        } else {
            showToast('خطا در افزودن اطلاعیه', 'error');
        }
    } catch (error) {
        console.error('Error submitting announcement:', error);
        showToast('خطا در ارتباط با سرور', 'error');
    }
}

// Edit Announcement
function editAnnouncement(announcement) {
    const modal = createModal('ویرایش اطلاعیه', `
        <form class="admin-form" onsubmit="updateAnnouncement(event, ${announcement.id})">
            <div class="admin-form-group">
                <label>عنوان اطلاعیه *</label>
                <input type="text" name="title" value="${announcement.title}" required>
            </div>
            <div class="admin-form-group">
                <label>محتوای اطلاعیه *</label>
                <textarea name="content" required>${announcement.content}</textarea>
            </div>
            <div class="admin-form-group">
                <label>تاریخ *</label>
                <input type="text" name="date" value="${announcement.date}" required>
            </div>
            <div class="admin-form-actions">
                <button type="button" class="btn-cancel" onclick="closeModal()">انصراف</button>
                <button type="submit" class="btn-submit">بروزرسانی</button>
            </div>
        </form>
    `);
    
    showModal(modal);
}

// Update Announcement
async function updateAnnouncement(event, id) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const announcementData = Object.fromEntries(formData);
    announcementData.id = id;
    
    try {
        const response = await fetch('api.php?action=updateAnnouncement', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(announcementData)
        });
        
        const result = await response.json();
        
        if (result.success) {
            showToast('اطلاعیه با موفقیت بروزرسانی شد', 'success');
            closeModal();
            loadAdminAnnouncements();
        } else {
            showToast('خطا در بروزرسانی اطلاعیه', 'error');
        }
    } catch (error) {
        console.error('Error updating announcement:', error);
        showToast('خطا در ارتباط با سرور', 'error');
    }
}

// Delete Announcement
async function deleteAnnouncement(id) {
    if (!confirm('آیا از حذف این اطلاعیه اطمینان دارید؟')) return;
    
    try {
        const response = await fetch('api.php?action=deleteAnnouncement', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id })
        });
        
        const result = await response.json();
        
        if (result.success) {
            showToast('اطلاعیه با موفقیت حذف شد', 'success');
            loadAdminAnnouncements();
            updateDashboardStats();
        } else {
            showToast('خطا در حذف اطلاعیه', 'error');
        }
    } catch (error) {
        console.error('Error deleting announcement:', error);
        showToast('خطا در ارتباط با سرور', 'error');
    }
}

// ============= ABSENT MANAGEMENT =============

// Load Admin Absent
async function loadAdminAbsent() {
    try {
        const response = await fetch('api.php?action=getAbsent');
        const data = await response.json();
        
        if (data.success) {
            displayAdminAbsent(data.data);
        }
    } catch (error) {
        console.error('Error loading absent:', error);
    }
}

// Display Admin Absent
function displayAdminAbsent(absentArray) {
    const tbody = document.getElementById('absentTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    if (absentArray.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 40px; color: var(--light-text);">هیچ غایبی ثبت نشده</td></tr>';
        return;
    }
    
    absentArray.forEach(student => {
        const row = `
            <tr>
                <td>${student.id}</td>
                <td>${student.name}</td>
                <td>${student.class}</td>
                <td>${student.duration}</td>
                <td>${student.reason}</td>
                <td>
                    <button class="btn-edit" onclick='editAbsent(${JSON.stringify(student)})'>
                        <i class="fas fa-edit"></i> ویرایش
                    </button>
                    <button class="btn-delete" onclick="deleteAbsent(${student.id})">
                        <i class="fas fa-trash"></i> حذف
                    </button>
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

// Open Add Absent Modal
function openAddAbsentModal() {
    const modal = createModal('افزودن غایب جدید', `
        <form class="admin-form" onsubmit="submitAbsent(event)">
            <div class="admin-form-group">
                <label>نام دانش‌آموز *</label>
                <input type="text" name="name" required>
            </div>
            <div class="admin-form-group">
                <label>کلاس *</label>
                <select name="class" required>
                    <option value="">انتخاب کنید</option>
                    <option value="هفتم الف">هفتم الف</option>
                    <option value="هفتم ب">هفتم ب</option>
                    <option value="هفتم ج">هفتم ج</option>
                    <option value="هشتم الف">هشتم الف</option>
                    <option value="هشتم ب">هشتم ب</option>
                    <option value="هشتم ج">هشتم ج</option>
                    <option value="نهم الف">نهم الف</option>
                    <option value="نهم ب">نهم ب</option>
                    <option value="نهم ج">نهم ج</option>
                </select>
            </div>
            <div class="admin-form-group">
                <label>مدت غیبت *</label>
                <input type="text" name="duration" placeholder="مثال: 3 روز" required>
            </div>
            <div class="admin-form-group">
                <label>دلیل غیبت *</label>
                <input type="text" name="reason" required>
            </div>
            <div class="admin-form-group">
                <label>تاریخ *</label>
                <input type="text" name="date" value="1403/08/10" required>
            </div>
            <div class="admin-form-actions">
                <button type="button" class="btn-cancel" onclick="closeModal()">انصراف</button>
                <button type="submit" class="btn-submit">ذخیره</button>
            </div>
        </form>
    `);
    
    showModal(modal);
}

// Submit Absent
async function submitAbsent(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const absentData = Object.fromEntries(formData);
    
    try {
        const response = await fetch('api.php?action=addAbsent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(absentData)
        });
        
        const result = await response.json();
        
        if (result.success) {
            showToast('غایب با موفقیت اضافه شد', 'success');
            closeModal();
            loadAdminAbsent();
            updateDashboardStats();
        } else {
            showToast('خطا در افزودن غایب', 'error');
        }
    } catch (error) {
        console.error('Error submitting absent:', error);
        showToast('خطا در ارتباط با سرور', 'error');
    }
}

// Edit Absent
function editAbsent(student) {
    const modal = createModal('ویرایش غایب', `
        <form class="admin-form" onsubmit="updateAbsent(event, ${student.id})">
            <div class="admin-form-group">
                <label>نام دانش‌آموز *</label>
                <input type="text" name="name" value="${student.name}" required>
            </div>
            <div class="admin-form-group">
                <label>کلاس *</label>
                <select name="class" required>
                    <option value="${student.class}">${student.class}</option>
                    <option value="هفتم الف">هفتم الف</option>
                    <option value="هفتم ب">هفتم ب</option>
                    <option value="هفتم ج">هفتم ج</option>
                    <option value="هشتم الف">هشتم الف</option>
                    <option value="هشتم ب">هشتم ب</option>
                    <option value="هشتم ج">هشتم ج</option>
                    <option value="نهم الف">نهم الف</option>
                    <option value="نهم ب">نهم ب</option>
                    <option value="نهم ج">نهم ج</option>
                </select>
            </div>
            <div class="admin-form-group">
                <label>مدت غیبت *</label>
                <input type="text" name="duration" value="${student.duration}" required>
            </div>
            <div class="admin-form-group">
                <label>دلیل غیبت *</label>
                <input type="text" name="reason" value="${student.reason}" required>
            </div>
            <div class="admin-form-group">
                <label>تاریخ *</label>
                <input type="text" name="date" value="${student.date}" required>
            </div>
            <div class="admin-form-actions">
                <button type="button" class="btn-cancel" onclick="closeModal()">انصراف</button>
                <button type="submit" class="btn-submit">بروزرسانی</button>
            </div>
        </form>
    `);
    
    showModal(modal);
}

// Update Absent
async function updateAbsent(event, id) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const absentData = Object.fromEntries(formData);
    absentData.id = id;
    
    try {
        const response = await fetch('api.php?action=updateAbsent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(absentData)
        });
        
        const result = await response.json();
        
        if (result.success) {
            showToast('غایب با موفقیت بروزرسانی شد', 'success');
            closeModal();
            loadAdminAbsent();
        } else {
            showToast('خطا در بروزرسانی غایب', 'error');
        }
    } catch (error) {
        console.error('Error updating absent:', error);
        showToast('خطا در ارتباط با سرور', 'error');
    }
}

// Delete Absent
async function deleteAbsent(id) {
    if (!confirm('آیا از حذف این مورد اطمینان دارید؟')) return;
    
    try {
        const response = await fetch('api.php?action=deleteAbsent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id })
        });
        
        const result = await response.json();
        
        if (result.success) {
            showToast('مورد با موفقیت حذف شد', 'success');
            loadAdminAbsent();
            updateDashboardStats();
        } else {
            showToast('خطا در حذف مورد', 'error');
        }
    } catch (error) {
        console.error('Error deleting absent:', error);
        showToast('خطا در ارتباط با سرور', 'error');
    }
}

// ============= COUNCIL MANAGEMENT =============

// Load Admin Council
async function loadAdminCouncil() {
    try {
        const response = await fetch('api.php?action=getCouncil');
        const data = await response.json();
        
        if (data.success) {
            displayAdminCouncil(data.data.main, data.data.alternate);
        }
    } catch (error) {
        console.error('Error loading council:', error);
    }
}

// Display Admin Council
function displayAdminCouncil(mainMembers, alternateMembers) {
    const mainTbody = document.getElementById('councilMainTableBody');
    const alternateTbody = document.getElementById('councilAlternateTableBody');
    
    if (mainTbody) {
        mainTbody.innerHTML = '';
        if (mainMembers.length === 0) {
            mainTbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 40px; color: var(--light-text);">هیچ عضو اصلی ثبت نشده</td></tr>';
        } else {
            mainMembers.forEach(member => {
                mainTbody.innerHTML += createCouncilRow(member, 'main');
            });
        }
    }
    
    if (alternateTbody) {
        alternateTbody.innerHTML = '';
        if (alternateMembers.length === 0) {
            alternateTbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 40px; color: var(--light-text);">هیچ عضو علی‌البدل ثبت نشده</td></tr>';
        } else {
            alternateMembers.forEach(member => {
                alternateTbody.innerHTML += createCouncilRow(member, 'alternate');
            });
        }
    }
}

// Create Council Row
function createCouncilRow(member, type) {
    return `
        <tr>
            <td>${member.id}</td>
            <td>${member.name}</td>
            <td>${member.position}</td>
            <td>${member.class}</td>
            <td>${member.field}</td>
            <td>
                <button class="btn-edit" onclick='editCouncil(${JSON.stringify(member)}, "${type}")'>
                    <i class="fas fa-edit"></i> ویرایش
                </button>
                <button class="btn-delete" onclick="deleteCouncil(${member.id}, '${type}')">
                    <i class="fas fa-trash"></i> حذف
                </button>
            </td>
        </tr>
    `;
}

// Open Add Council Modal
function openAddCouncilModal() {
    const modal = createModal('افزودن عضو شورای دانش‌آموزی', `
        <form class="admin-form" onsubmit="submitCouncil(event)">
            <div class="admin-form-group">
                <label>نام عضو *</label>
                <input type="text" name="name" required>
            </div>
            <div class="admin-form-group">
                <label>سمت *</label>
                <input type="text" name="position" placeholder="مثال: رئیس شورا" required>
            </div>
            <div class="admin-form-group">
                <label>کلاس *</label>
                <select name="class" required>
                    <option value="">انتخاب کنید</option>
                    <option value="هفتم الف">هفتم الف</option>
                    <option value="هفتم ب">هفتم ب</option>
                    <option value="هفتم ج">هفتم ج</option>
                    <option value="هشتم الف">هشتم الف</option>
                    <option value="هشتم ب">هشتم ب</option>
                    <option value="هشتم ج">هشتم ج</option>
                    <option value="نهم الف">نهم الف</option>
                    <option value="نهم ب">نهم ب</option>
                    <option value="نهم ج">نهم ج</option>
                </select>
            </div>
            <div class="admin-form-group">
                <label>رشته *</label>
                <select name="field" required>
                    <option value="">انتخاب کنید</option>
                    <option value="ریاضی">ریاضی</option>
                    <option value="تجربی">تجربی</option>
                </select>
            </div>
            <div class="admin-form-group">
                <label>نوع عضویت *</label>
                <select name="type" required>
                    <option value="main">عضو اصلی</option>
                    <option value="alternate">عضو علی‌البدل</option>
                </select>
            </div>
            <div class="admin-form-actions">
                <button type="button" class="btn-cancel" onclick="closeModal()">انصراف</button>
                <button type="submit" class="btn-submit">ذخیره</button>
            </div>
        </form>
    `);
    
    showModal(modal);
}

// Submit Council
async function submitCouncil(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const councilData = Object.fromEntries(formData);
    
    try {
        const response = await fetch('api.php?action=addCouncil', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(councilData)
        });
        
        const result = await response.json();
        
        if (result.success) {
            showToast('عضو شورا با موفقیت اضافه شد', 'success');
            closeModal();
            loadAdminCouncil();
        } else {
            showToast('خطا در افزودن عضو شورا', 'error');
        }
    } catch (error) {
        console.error('Error submitting council:', error);
        showToast('خطا در ارتباط با سرور', 'error');
    }
}

// Edit Council
function editCouncil(member, type) {
    const modal = createModal('ویرایش عضو شورا', `
        <form class="admin-form" onsubmit="updateCouncil(event, ${member.id}, '${type}')">
            <div class="admin-form-group">
                <label>نام عضو *</label>
                <input type="text" name="name" value="${member.name}" required>
            </div>
            <div class="admin-form-group">
                <label>سمت *</label>
                <input type="text" name="position" value="${member.position}" required>
            </div>
            <div class="admin-form-group">
                <label>کلاس *</label>
                <select name="class" required>
                    <option value="${member.class}">${member.class}</option>
                    <option value="هفتم الف">هفتم الف</option>
                    <option value="هفتم ب">هفتم ب</option>
                    <option value="هفتم ج">هفتم ج</option>
                    <option value="هشتم الف">هشتم الف</option>
                    <option value="هشتم ب">هشتم ب</option>
                    <option value="هشتم ج">هشتم ج</option>
                    <option value="نهم الف">نهم الف</option>
                    <option value="نهم ب">نهم ب</option>
                    <option value="نهم ج">نهم ج</option>
                </select>
            </div>
            <div class="admin-form-group">
                <label>رشته *</label>
                <select name="field" required>
                    <option value="${member.field}">${member.field}</option>
                    <option value="ریاضی">ریاضی</option>
                    <option value="تجربی">تجربی</option>
                </select>
            </div>
            <div class="admin-form-actions">
                <button type="button" class="btn-cancel" onclick="closeModal()">انصراف</button>
                <button type="submit" class="btn-submit">بروزرسانی</button>
            </div>
        </form>
    `);
    
    showModal(modal);
}

// Update Council
async function updateCouncil(event, id, type) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const councilData = Object.fromEntries(formData);
    councilData.id = id;
    councilData.type = type;
    
    try {
        const response = await fetch('api.php?action=updateCouncil', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(councilData)
        });
        
        const result = await response.json();
        
        if (result.success) {
            showToast('عضو شورا با موفقیت بروزرسانی شد', 'success');
            closeModal();
            loadAdminCouncil();
        } else {
            showToast('خطا در بروزرسانی عضو شورا', 'error');
        }
    } catch (error) {
        console.error('Error updating council:', error);
        showToast('خطا در ارتباط با سرور', 'error');
    }
}

// Delete Council
async function deleteCouncil(id, type) {
    if (!confirm('آیا از حذف این عضو اطمینان دارید؟')) return;
    
    try {
        const response = await fetch('api.php?action=deleteCouncil', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id, type })
        });
        
        const result = await response.json();
        
        if (result.success) {
            showToast('عضو با موفقیت حذف شد', 'success');
            loadAdminCouncil();
        } else {
            showToast('خطا در حذف عضو', 'error');
        }
    } catch (error) {
        console.error('Error deleting council:', error);
        showToast('خطا در ارتباط با سرور', 'error');
    }
}

// ============= ASSOCIATION MANAGEMENT =============

// Load Admin Association
async function loadAdminAssociation() {
    try {
        const response = await fetch('api.php?action=getAssociation');
        const data = await response.json();
        
        if (data.success) {
            displayAdminAssociation(data.data);
        }
    } catch (error) {
        console.error('Error loading association:', error);
    }
}

// Display Admin Association
function displayAdminAssociation(membersArray) {
    const tbody = document.getElementById('associationTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    if (membersArray.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 40px; color: var(--light-text);">هیچ عضوی ثبت نشده</td></tr>';
        return;
    }
    
    membersArray.forEach(member => {
        const row = `
            <tr>
                <td>${member.id}</td>
                <td>${member.name}</td>
                <td>${member.position}</td>
                <td>${member.phone}</td>
                <td>
                    <button class="btn-edit" onclick='editAssociation(${JSON.stringify(member)})'>
                        <i class="fas fa-edit"></i> ویرایش
                    </button>
                    <button class="btn-delete" onclick="deleteAssociation(${member.id})">
                        <i class="fas fa-trash"></i> حذف
                    </button>
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

// Open Add Association Modal
function openAddAssociationModal() {
    const modal = createModal('افزودن عضو انجمن', `
        <form class="admin-form" onsubmit="submitAssociation(event)">
            <div class="admin-form-group">
                <label>نام عضو *</label>
                <input type="text" name="name" required>
            </div>
            <div class="admin-form-group">
                <label>سمت *</label>
                <input type="text" name="position" placeholder="مثال: رئیس انجمن" required>
            </div>
            <div class="admin-form-group">
                <label>شماره تماس *</label>
                <input type="text" name="phone" placeholder="0913-123-4567" required>
            </div>
            <div class="admin-form-actions">
                <button type="button" class="btn-cancel" onclick="closeModal()">انصراف</button>
                <button type="submit" class="btn-submit">ذخیره</button>
            </div>
        </form>
    `);
    
    showModal(modal);
}

// Submit Association
async function submitAssociation(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const associationData = Object.fromEntries(formData);
    
    try {
        const response = await fetch('api.php?action=addAssociation', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(associationData)
        });
        
        const result = await response.json();
        
        if (result.success) {
            showToast('عضو انجمن با موفقیت اضافه شد', 'success');
            closeModal();
            loadAdminAssociation();
        } else {
            showToast('خطا در افزودن عضو', 'error');
        }
    } catch (error) {
        console.error('Error submitting association:', error);
        showToast('خطا در ارتباط با سرور', 'error');
    }
}

// Edit Association
function editAssociation(member) {
    const modal = createModal('ویرایش عضو انجمن', `
        <form class="admin-form" onsubmit="updateAssociation(event, ${member.id})">
            <div class="admin-form-group">
                <label>نام عضو *</label>
                <input type="text" name="name" value="${member.name}" required>
            </div>
            <div class="admin-form-group">
                <label>سمت *</label>
                <input type="text" name="position" value="${member.position}" required>
            </div>
            <div class="admin-form-group">
                <label>شماره تماس *</label>
                <input type="text" name="phone" value="${member.phone}" required>
            </div>
            <div class="admin-form-actions">
                <button type="button" class="btn-cancel" onclick="closeModal()">انصراف</button>
                <button type="submit" class="btn-submit">بروزرسانی</button>
            </div>
        </form>
    `);
    
    showModal(modal);
}

// Update Association
async function updateAssociation(event, id) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const associationData = Object.fromEntries(formData);
    associationData.id = id;
    
    try {
        const response = await fetch('api.php?action=updateAssociation', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(associationData)
        });
        
        const result = await response.json();
        
        if (result.success) {
            showToast('عضو انجمن با موفقیت بروزرسانی شد', 'success');
            closeModal();
            loadAdminAssociation();
        } else {
            showToast('خطا در بروزرسانی عضو', 'error');
        }
    } catch (error) {
        console.error('Error updating association:', error);
        showToast('خطا در ارتباط با سرور', 'error');
    }
}

// Delete Association
async function deleteAssociation(id) {
    if (!confirm('آیا از حذف این عضو اطمینان دارید؟')) return;
    
    try {
        const response = await fetch('api.php?action=deleteAssociation', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id })
        });
        
        const result = await response.json();
        
        if (result.success) {
            showToast('عضو با موفقیت حذف شد', 'success');
            loadAdminAssociation();
        } else {
            showToast('خطا در حذف عضو', 'error');
        }
    } catch (error) {
        console.error('Error deleting association:', error);
        showToast('خطا در ارتباط با سرور', 'error');
    }
}

// ============= MODAL HELPERS =============

// Create Modal
function createModal(title, content) {
    return `
        <div class="admin-modal show">
            <div class="admin-modal-content">
                <div class="admin-modal-header">
                    <h2>${title}</h2>
                    <button class="close-admin-modal" onclick="closeModal()">&times;</button>
                </div>
                ${content}
            </div>
        </div>
    `;
}

// Show Modal
function showModal(modalHTML) {
    const container = document.getElementById('modalContainer');
    container.innerHTML = modalHTML;
}

// Close Modal
function closeModal() {
    const container = document.getElementById('modalContainer');
    container.innerHTML = '';
}
