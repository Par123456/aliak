<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

// Data directory
$dataDir = __DIR__ . '/data';
if (!file_exists($dataDir)) {
    mkdir($dataDir, 0755, true);
}

// Data files
$newsFile = $dataDir . '/news.json';
$eventsFile = $dataDir . '/events.json';
$announcementsFile = $dataDir . '/announcements.json';
$absentFile = $dataDir . '/absent.json';
$councilFile = $dataDir . '/council.json';
$associationFile = $dataDir . '/association.json';

// Initialize data files with default data
function initializeDataFiles() {
    global $newsFile, $eventsFile, $announcementsFile, $absentFile, $councilFile, $associationFile;
    
    // News
    if (!file_exists($newsFile)) {
        $defaultNews = [
            [
                'id' => 1,
                'title' => 'برگزاری مسابقات ورزشی بین کلاسی',
                'content' => 'مسابقات ورزشی بین کلاسی در رشته‌های فوتبال، والیبال و بسکتبال از تاریخ 15 آبان ماه آغاز می‌شود. تمامی دانش‌آموزان می‌توانند در این مسابقات شرکت کنند.',
                'date' => '1403/08/10',
                'author' => 'مدیریت مدرسه'
            ],
            [
                'id' => 2,
                'title' => 'کسب مقام اول المپیاد ریاضی استانی',
                'content' => 'دانش‌آموز پایه نهم مدرسه ما موفق به کسب رتبه اول المپیاد ریاضی در سطح استان شد. این افتخار بزرگی برای مدرسه ماست.',
                'date' => '1403/08/08',
                'author' => 'مسئول آموزش'
            ],
            [
                'id' => 3,
                'title' => 'برگزاری کارگاه آموزشی برنامه‌نویسی',
                'content' => 'کارگاه آموزش رایگان برنامه‌نویسی پایتون ویژه دانش‌آموزان علاقه‌مند در روزهای پنج‌شنبه برگزار می‌شود.',
                'date' => '1403/08/05',
                'author' => 'معاون پرورشی'
            ]
        ];
        file_put_contents($newsFile, json_encode($defaultNews, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
    }
    
    // Events
    if (!file_exists($eventsFile)) {
        $defaultEvents = [
            [
                'id' => 1,
                'title' => 'جشن دهه فجر',
                'date' => '1403/11/22',
                'location' => 'سالن ورزشی مدرسه',
                'description' => 'برگزاری برنامه‌های ویژه به مناسبت دهه مبارک فجر'
            ],
            [
                'id' => 2,
                'title' => 'اردوی علمی - تفریحی',
                'date' => '1403/09/15',
                'location' => 'تفرجگاه بیستون',
                'description' => 'اردوی یک روزه دانش‌آموزان به همراه برنامه‌های علمی و تفریحی'
            ],
            [
                'id' => 3,
                'title' => 'مسابقات قرآنی',
                'date' => '1403/09/20',
                'location' => 'نمازخانه مدرسه',
                'description' => 'برگزاری مسابقات حفظ و قرائت قرآن کریم'
            ]
        ];
        file_put_contents($eventsFile, json_encode($defaultEvents, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
    }
    
    // Announcements
    if (!file_exists($announcementsFile)) {
        $defaultAnnouncements = [
            [
                'id' => 1,
                'title' => 'تعطیلی مدرسه در روز پنج‌شنبه',
                'content' => 'به اطلاع می‌رساند روز پنج‌شنبه به دلیل برگزاری جلسه شورای معلمان، مدرسه تعطیل می‌باشد.',
                'date' => '1403/08/10'
            ],
            [
                'id' => 2,
                'title' => 'شروع ثبت‌نام کلاس‌های تقویتی',
                'content' => 'ثبت‌نام کلاس‌های تقویتی درس ریاضی و علوم از روز شنبه در دفتر مدرسه آغاز می‌شود.',
                'date' => '1403/08/09'
            ],
            [
                'id' => 3,
                'title' => 'فراخوان شرکت در المپیاد علمی',
                'content' => 'دانش‌آموزان علاقه‌مند به شرکت در المپیادهای علمی می‌توانند تا پایان هفته نام‌نویسی کنند.',
                'date' => '1403/08/08'
            ]
        ];
        file_put_contents($announcementsFile, json_encode($defaultAnnouncements, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
    }
    
    // Absent
    if (!file_exists($absentFile)) {
        $defaultAbsent = [
            [
                'id' => 1,
                'name' => 'علی احمدی',
                'class' => 'هفتم الف',
                'duration' => '3 روز',
                'reason' => 'بیماری',
                'date' => '1403/08/07'
            ],
            [
                'id' => 2,
                'name' => 'محمد رضایی',
                'class' => 'هشتم ب',
                'duration' => '2 روز',
                'reason' => 'مسافرت',
                'date' => '1403/08/08'
            ],
            [
                'id' => 3,
                'name' => 'حسین کریمی',
                'class' => 'نهم الف',
                'duration' => '1 روز',
                'reason' => 'بیماری',
                'date' => '1403/08/09'
            ],
            [
                'id' => 4,
                'name' => 'رضا محمدی',
                'class' => 'هفتم ب',
                'duration' => '4 روز',
                'reason' => 'بیماری',
                'date' => '1403/08/06'
            ]
        ];
        file_put_contents($absentFile, json_encode($defaultAbsent, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
    }
    
    // Council
    if (!file_exists($councilFile)) {
        $defaultCouncil = [
            'main' => [
                [
                    'id' => 1,
                    'name' => 'امیرحسین نوروزی',
                    'position' => 'رئیس شورا',
                    'class' => 'نهم الف',
                    'field' => 'ریاضی'
                ],
                [
                    'id' => 2,
                    'name' => 'محمدرضا کاظمی',
                    'position' => 'نایب رئیس',
                    'class' => 'نهم ب',
                    'field' => 'تجربی'
                ],
                [
                    'id' => 3,
                    'name' => 'علی اکبری',
                    'position' => 'دبیر',
                    'class' => 'هشتم الف',
                    'field' => 'ریاضی'
                ],
                [
                    'id' => 4,
                    'name' => 'حسین محمودی',
                    'position' => 'مسئول فرهنگی',
                    'class' => 'هشتم ب',
                    'field' => 'تجربی'
                ],
                [
                    'id' => 5,
                    'name' => 'رضا احمدیان',
                    'position' => 'مسئول ورزشی',
                    'class' => 'نهم ج',
                    'field' => 'ریاضی'
                ]
            ],
            'alternate' => [
                [
                    'id' => 6,
                    'name' => 'مهدی جعفری',
                    'position' => 'عضو علی‌البدل',
                    'class' => 'هشتم ج',
                    'field' => 'تجربی'
                ],
                [
                    'id' => 7,
                    'name' => 'سعید مرادی',
                    'position' => 'عضو علی‌البدل',
                    'class' => 'هفتم الف',
                    'field' => 'ریاضی'
                ],
                [
                    'id' => 8,
                    'name' => 'امیر حسینی',
                    'position' => 'عضو علی‌البدل',
                    'class' => 'هفتم ب',
                    'field' => 'تجربی'
                ]
            ]
        ];
        file_put_contents($councilFile, json_encode($defaultCouncil, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
    }
    
    // Association
    if (!file_exists($associationFile)) {
        $defaultAssociation = [
            [
                'id' => 1,
                'name' => 'سید محمد حسینی',
                'position' => 'رئیس انجمن / مدیر مدرسه',
                'phone' => '0913-123-4567'
            ],
            [
                'id' => 2,
                'name' => 'احمد رضایی',
                'position' => 'نایب رئیس / نماینده اولیاء',
                'phone' => '0913-234-5678'
            ],
            [
                'id' => 3,
                'name' => 'محمود کریمی',
                'position' => 'دبیر / معاون آموزشی',
                'phone' => '0913-345-6789'
            ],
            [
                'id' => 4,
                'name' => 'علیرضا احمدی',
                'position' => 'خزانه‌دار / نماینده اولیاء',
                'phone' => '0913-456-7890'
            ],
            [
                'id' => 5,
                'name' => 'حسن محمودی',
                'position' => 'عضو / نماینده معلمان',
                'phone' => '0913-567-8901'
            ],
            [
                'id' => 6,
                'name' => 'رضا نوری',
                'position' => 'عضو / نماینده اولیاء',
                'phone' => '0913-678-9012'
            ]
        ];
        file_put_contents($associationFile, json_encode($defaultAssociation, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
    }
}

// Helper functions
function readJSON($file) {
    if (!file_exists($file)) {
        return [];
    }
    $content = file_get_contents($file);
    return json_decode($content, true) ?: [];
}

function writeJSON($file, $data) {
    return file_put_contents($file, json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
}

function getNextId($data) {
    if (empty($data)) return 1;
    $ids = array_column($data, 'id');
    return max($ids) + 1;
}

function sendResponse($success, $data = null, $message = '') {
    echo json_encode([
        'success' => $success,
        'data' => $data,
        'message' => $message
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

// Initialize files
initializeDataFiles();

// Get request data
$action = $_GET['action'] ?? $_POST['action'] ?? '';
$requestData = json_decode(file_get_contents('php://input'), true);

// Handle actions
switch ($action) {
    // ============= NEWS =============
    case 'getNews':
        $news = readJSON($newsFile);
        sendResponse(true, $news);
        break;
    
    case 'addNews':
        $news = readJSON($newsFile);
        $newItem = [
            'id' => getNextId($news),
            'title' => $requestData['title'] ?? '',
            'content' => $requestData['content'] ?? '',
            'date' => $requestData['date'] ?? date('Y/m/d'),
            'author' => $requestData['author'] ?? 'مدیریت مدرسه'
        ];
        $news[] = $newItem;
        writeJSON($newsFile, $news);
        sendResponse(true, $newItem, 'خبر با موفقیت اضافه شد');
        break;
    
    case 'updateNews':
        $news = readJSON($newsFile);
        $id = $requestData['id'] ?? 0;
        foreach ($news as &$item) {
            if ($item['id'] == $id) {
                $item['title'] = $requestData['title'] ?? $item['title'];
                $item['content'] = $requestData['content'] ?? $item['content'];
                $item['date'] = $requestData['date'] ?? $item['date'];
                $item['author'] = $requestData['author'] ?? $item['author'];
                break;
            }
        }
        writeJSON($newsFile, $news);
        sendResponse(true, null, 'خبر با موفقیت بروزرسانی شد');
        break;
    
    case 'deleteNews':
        $news = readJSON($newsFile);
        $id = $requestData['id'] ?? 0;
        $news = array_filter($news, function($item) use ($id) {
            return $item['id'] != $id;
        });
        $news = array_values($news);
        writeJSON($newsFile, $news);
        sendResponse(true, null, 'خبر با موفقیت حذف شد');
        break;
    
    // ============= EVENTS =============
    case 'getEvents':
        $events = readJSON($eventsFile);
        sendResponse(true, $events);
        break;
    
    case 'addEvent':
        $events = readJSON($eventsFile);
        $newItem = [
            'id' => getNextId($events),
            'title' => $requestData['title'] ?? '',
            'description' => $requestData['description'] ?? '',
            'date' => $requestData['date'] ?? date('Y/m/d'),
            'location' => $requestData['location'] ?? ''
        ];
        $events[] = $newItem;
        writeJSON($eventsFile, $events);
        sendResponse(true, $newItem, 'رویداد با موفقیت اضافه شد');
        break;
    
    case 'updateEvent':
        $events = readJSON($eventsFile);
        $id = $requestData['id'] ?? 0;
        foreach ($events as &$item) {
            if ($item['id'] == $id) {
                $item['title'] = $requestData['title'] ?? $item['title'];
                $item['description'] = $requestData['description'] ?? $item['description'];
                $item['date'] = $requestData['date'] ?? $item['date'];
                $item['location'] = $requestData['location'] ?? $item['location'];
                break;
            }
        }
        writeJSON($eventsFile, $events);
        sendResponse(true, null, 'رویداد با موفقیت بروزرسانی شد');
        break;
    
    case 'deleteEvent':
        $events = readJSON($eventsFile);
        $id = $requestData['id'] ?? 0;
        $events = array_filter($events, function($item) use ($id) {
            return $item['id'] != $id;
        });
        $events = array_values($events);
        writeJSON($eventsFile, $events);
        sendResponse(true, null, 'رویداد با موفقیت حذف شد');
        break;
    
    // ============= ANNOUNCEMENTS =============
    case 'getAnnouncements':
        $announcements = readJSON($announcementsFile);
        sendResponse(true, $announcements);
        break;
    
    case 'addAnnouncement':
        $announcements = readJSON($announcementsFile);
        $newItem = [
            'id' => getNextId($announcements),
            'title' => $requestData['title'] ?? '',
            'content' => $requestData['content'] ?? '',
            'date' => $requestData['date'] ?? date('Y/m/d')
        ];
        $announcements[] = $newItem;
        writeJSON($announcementsFile, $announcements);
        sendResponse(true, $newItem, 'اطلاعیه با موفقیت اضافه شد');
        break;
    
    case 'updateAnnouncement':
        $announcements = readJSON($announcementsFile);
        $id = $requestData['id'] ?? 0;
        foreach ($announcements as &$item) {
            if ($item['id'] == $id) {
                $item['title'] = $requestData['title'] ?? $item['title'];
                $item['content'] = $requestData['content'] ?? $item['content'];
                $item['date'] = $requestData['date'] ?? $item['date'];
                break;
            }
        }
        writeJSON($announcementsFile, $announcements);
        sendResponse(true, null, 'اطلاعیه با موفقیت بروزرسانی شد');
        break;
    
    case 'deleteAnnouncement':
        $announcements = readJSON($announcementsFile);
        $id = $requestData['id'] ?? 0;
        $announcements = array_filter($announcements, function($item) use ($id) {
            return $item['id'] != $id;
        });
        $announcements = array_values($announcements);
        writeJSON($announcementsFile, $announcements);
        sendResponse(true, null, 'اطلاعیه با موفقیت حذف شد');
        break;
    
    // ============= ABSENT =============
    case 'getAbsent':
        $absent = readJSON($absentFile);
        sendResponse(true, $absent);
        break;
    
    case 'addAbsent':
        $absent = readJSON($absentFile);
        $newItem = [
            'id' => getNextId($absent),
            'name' => $requestData['name'] ?? '',
            'class' => $requestData['class'] ?? '',
            'duration' => $requestData['duration'] ?? '',
            'reason' => $requestData['reason'] ?? '',
            'date' => $requestData['date'] ?? date('Y/m/d')
        ];
        $absent[] = $newItem;
        writeJSON($absentFile, $absent);
        sendResponse(true, $newItem, 'غایب با موفقیت اضافه شد');
        break;
    
    case 'updateAbsent':
        $absent = readJSON($absentFile);
        $id = $requestData['id'] ?? 0;
        foreach ($absent as &$item) {
            if ($item['id'] == $id) {
                $item['name'] = $requestData['name'] ?? $item['name'];
                $item['class'] = $requestData['class'] ?? $item['class'];
                $item['duration'] = $requestData['duration'] ?? $item['duration'];
                $item['reason'] = $requestData['reason'] ?? $item['reason'];
                $item['date'] = $requestData['date'] ?? $item['date'];
                break;
            }
        }
        writeJSON($absentFile, $absent);
        sendResponse(true, null, 'غایب با موفقیت بروزرسانی شد');
        break;
    
    case 'deleteAbsent':
        $absent = readJSON($absentFile);
        $id = $requestData['id'] ?? 0;
        $absent = array_filter($absent, function($item) use ($id) {
            return $item['id'] != $id;
        });
        $absent = array_values($absent);
        writeJSON($absentFile, $absent);
        sendResponse(true, null, 'غایب با موفقیت حذف شد');
        break;
    
    // ============= COUNCIL =============
    case 'getCouncil':
        $council = readJSON($councilFile);
        if (!isset($council['main'])) $council['main'] = [];
        if (!isset($council['alternate'])) $council['alternate'] = [];
        sendResponse(true, $council);
        break;
    
    case 'addCouncil':
        $council = readJSON($councilFile);
        if (!isset($council['main'])) $council['main'] = [];
        if (!isset($council['alternate'])) $council['alternate'] = [];
        
        $type = $requestData['type'] ?? 'main';
        $allMembers = array_merge($council['main'], $council['alternate']);
        
        $newItem = [
            'id' => getNextId($allMembers),
            'name' => $requestData['name'] ?? '',
            'position' => $requestData['position'] ?? '',
            'class' => $requestData['class'] ?? '',
            'field' => $requestData['field'] ?? ''
        ];
        
        $council[$type][] = $newItem;
        writeJSON($councilFile, $council);
        sendResponse(true, $newItem, 'عضو شورا با موفقیت اضافه شد');
        break;
    
    case 'updateCouncil':
        $council = readJSON($councilFile);
        $id = $requestData['id'] ?? 0;
        $type = $requestData['type'] ?? 'main';
        
        foreach ($council[$type] as &$item) {
            if ($item['id'] == $id) {
                $item['name'] = $requestData['name'] ?? $item['name'];
                $item['position'] = $requestData['position'] ?? $item['position'];
                $item['class'] = $requestData['class'] ?? $item['class'];
                $item['field'] = $requestData['field'] ?? $item['field'];
                break;
            }
        }
        writeJSON($councilFile, $council);
        sendResponse(true, null, 'عضو شورا با موفقیت بروزرسانی شد');
        break;
    
    case 'deleteCouncil':
        $council = readJSON($councilFile);
        $id = $requestData['id'] ?? 0;
        $type = $requestData['type'] ?? 'main';
        
        $council[$type] = array_filter($council[$type], function($item) use ($id) {
            return $item['id'] != $id;
        });
        $council[$type] = array_values($council[$type]);
        writeJSON($councilFile, $council);
        sendResponse(true, null, 'عضو شورا با موفقیت حذف شد');
        break;
    
    // ============= ASSOCIATION =============
    case 'getAssociation':
        $association = readJSON($associationFile);
        sendResponse(true, $association);
        break;
    
    case 'addAssociation':
        $association = readJSON($associationFile);
        $newItem = [
            'id' => getNextId($association),
            'name' => $requestData['name'] ?? '',
            'position' => $requestData['position'] ?? '',
            'phone' => $requestData['phone'] ?? ''
        ];
        $association[] = $newItem;
        writeJSON($associationFile, $association);
        sendResponse(true, $newItem, 'عضو انجمن با موفقیت اضافه شد');
        break;
    
    case 'updateAssociation':
        $association = readJSON($associationFile);
        $id = $requestData['id'] ?? 0;
        foreach ($association as &$item) {
            if ($item['id'] == $id) {
                $item['name'] = $requestData['name'] ?? $item['name'];
                $item['position'] = $requestData['position'] ?? $item['position'];
                $item['phone'] = $requestData['phone'] ?? $item['phone'];
                break;
            }
        }
        writeJSON($associationFile, $association);
        sendResponse(true, null, 'عضو انجمن با موفقیت بروزرسانی شد');
        break;
    
    case 'deleteAssociation':
        $association = readJSON($associationFile);
        $id = $requestData['id'] ?? 0;
        $association = array_filter($association, function($item) use ($id) {
            return $item['id'] != $id;
        });
        $association = array_values($association);
        writeJSON($associationFile, $association);
        sendResponse(true, null, 'عضو انجمن با موفقیت حذف شد');
        break;
    
    default:
        sendResponse(false, null, 'عملیات نامعتبر است');
}
?>
