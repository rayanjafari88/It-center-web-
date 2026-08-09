const state = {
  db: null,
  user: null,
  role: null,
  page: "dashboard",
  lang: localStorage.getItem("itcc.lang") || "en",
  theme: localStorage.getItem("itcc.theme") || "system",
  globalQuery: "",
  query: "",
  sort: {},
  pageIndex: {},
  pageSize: 6,
  loadMore: {},
  filters: {},
  dashboardTicketFilter: "all",
  dashboardActivityFilter: "all",
  managerTicketFilters: { status: "", priority: "", assignee: "", category: "" },
  ticketWorkspaceSelectedId: "",
  ticketWorkspaceTab: "Conversation",
  ticketWorkspaceDraft: null,
  taskWorkspaceSelectedId: "",
  taskWorkspaceTab: "Overview",
  peopleWorkspaceSelectedId: "",
  peopleWorkspaceTab: "Overview",
  peopleWorkspaceFilters: { department: "", personType: "", status: "", location: "" },
  accountWorkspaceSelectedId: "",
  accountWorkspaceTab: "Overview",
  accountWorkspaceFilters: { role: "", status: "", accountType: "" },
  workspaceSelected: {},
  workspaceTab: {},
  assetWorkspaceDraft: null,
  notificationFilter: "all",
  settingsTab: "general",
  assignmentGroupEditingId: "",
  visible: {},
  detail: null,
  employeeTaskStatusFilter: localStorage.getItem("itcc.employeeTaskStatusFilter") || "open",
  taskView: localStorage.getItem("itcc.taskView") || "cards",
  calendarView: localStorage.getItem("itcc.calendarView") || "month",
  calendarDate: new Date(),
  expandedGroups: JSON.parse(localStorage.getItem("itcc.groups") || '{"command":true,"operate":true,"govern":true,"system":true}')
};

const labels = {
  en: {
    dashboard: "Command Center",
    users: "User Accounts",
    roles: "Roles",
    employees: "People",
    assets: "Assets",
    transfers: "Lifecycle",
    tickets: "Tickets",
    tasks: "Tasks",
    contracts: "Contracts",
    vendors: "Vendors",
    documents: "Documents",
    attachments: "Attachments",
    comments: "Comments",
    notifications: "Notifications",
    knowledge_base: "Knowledge Base",
    archive_center: "Archive Center",
    trash: "Trash Bin",
    form_templates: "Form Templates",
    employee_portal: "Employee Portal",
    audit_logs: "Audit Feed",
    timeline: "Activity Feed",
    lookup_items: "Lookup Management",
    settings: "Settings",
    add: "Create",
    archive: "Archive",
    edit: "Edit",
    view: "Open",
    export: "Export",
    search: "Search",
    recentActivity: "Live operations feed",
    importantAlerts: "Priority signals",
    linkedRecords: "Context graph"
  },
  ar: {
    dashboard: "\u0645\u0631\u0643\u0632 \u0627\u0644\u0642\u064a\u0627\u062f\u0629",
    users: "\u0627\u0644\u0645\u0633\u062a\u062e\u062f\u0645\u0648\u0646",
    roles: "\u0627\u0644\u0623\u062f\u0648\u0627\u0631",
    employees: "\u0627\u0644\u0645\u0648\u0638\u0641\u0648\u0646",
    assets: "\u0627\u0644\u0623\u0635\u0648\u0644",
    transfers: "\u062f\u0648\u0631\u0629 \u0627\u0644\u0623\u0635\u0644",
    tickets: "\u0627\u0644\u062a\u0630\u0627\u0643\u0631",
    tasks: "\u0627\u0644\u0645\u0647\u0627\u0645",
    contracts: "\u0627\u0644\u0639\u0642\u0648\u062f",
    vendors: "\u0627\u0644\u0645\u0648\u0631\u062f\u0648\u0646",
    documents: "\u0627\u0644\u0645\u0633\u062a\u0646\u062f\u0627\u062a",
    attachments: "\u0627\u0644\u0645\u0631\u0641\u0642\u0627\u062a",
    comments: "\u0627\u0644\u062a\u0639\u0644\u064a\u0642\u0627\u062a",
    notifications: "\u0627\u0644\u0625\u0634\u0639\u0627\u0631\u0627\u062a",
    knowledge_base: "\u0642\u0627\u0639\u062f\u0629 \u0627\u0644\u0645\u0639\u0631\u0641\u0629",
    archive_center: "\u0645\u0631\u0643\u0632 \u0627\u0644\u0623\u0631\u0634\u064a\u0641",
    trash: "\u0633\u0644\u0629 \u0627\u0644\u0645\u062d\u0630\u0648\u0641\u0627\u062a",
    form_templates: "\u0642\u0648\u0627\u0644\u0628 \u0627\u0644\u0646\u0645\u0627\u0630\u062c",
    employee_portal: "\u0628\u0648\u0627\u0628\u0629 \u0627\u0644\u0645\u0648\u0638\u0641",
    audit_logs: "\u0633\u062c\u0644 \u0627\u0644\u062a\u062f\u0642\u064a\u0642",
    timeline: "\u0627\u0644\u0646\u0634\u0627\u0637",
    lookup_items: "\u0625\u062f\u0627\u0631\u0629 \u0627\u0644\u0642\u0648\u0627\u0626\u0645",
    settings: "\u0627\u0644\u0625\u0639\u062f\u0627\u062f\u0627\u062a",
    add: "\u0625\u0646\u0634\u0627\u0621",
    archive: "\u0623\u0631\u0634\u0641\u0629",
    edit: "\u062a\u0639\u062f\u064a\u0644",
    view: "\u0641\u062a\u062d",
    export: "\u062a\u0635\u062f\u064a\u0631",
    search: "\u0628\u062d\u062b",
    recentActivity: "\u062a\u062f\u0641\u0642 \u0627\u0644\u0639\u0645\u0644\u064a\u0627\u062a",
    importantAlerts: "\u0625\u0634\u0627\u0631\u0627\u062a \u0645\u0647\u0645\u0629",
    linkedRecords: "\u0627\u0644\u0633\u064a\u0627\u0642 \u0627\u0644\u0645\u0631\u062a\u0628\u0637"
  }
};

const uiTextAr = {
  "IT Command Center": "مركز قيادة تقنية المعلومات",
  "IT OPERATIONS MANAGEMENT": "إدارة عمليات تقنية المعلومات",
  "OPERATIONS SUITE": "منصة العمليات",
  "SELF SERVICE": "الخدمة الذاتية",
  "Daily Operations": "العمليات اليومية",
  "Administration": "الإدارة",
  "Self service": "الخدمة الذاتية",
  "Your workspace": "مساحة عملك",
  "Run the work": "إدارة العمل",
  "Access & setup": "الوصول والإعداد",
  "Dashboard": "لوحة التحكم",
  "Command Center": "مركز القيادة",
  "Tickets": "التذاكر",
  "Requests / Tickets": "الطلبات / التذاكر",
  "Tasks": "المهام",
  "My Tasks": "مهامي",
  "Archived Tasks": "المهام المؤرشفة",
  "People": "الأشخاص",
  "Assets": "الأصول",
  "My Assets": "أصولي",
  "Documents": "المستندات",
  "Company Documents": "مستندات الشركة",
  "Knowledge": "المعرفة",
  "Knowledge Base": "قاعدة المعرفة",
  "Contracts": "العقود",
  "Vendors": "الموردون",
  "Settings": "الإعدادات",
  "User Accounts": "حسابات المستخدمين",
  "Roles": "الأدوار",
  "Archive Center": "مركز الأرشيف",
  "Trash Bin": "سلة المحذوفات",
  "Audit Feed": "سجل التدقيق",
  "Activity Feed": "سجل النشاط",
  "Lookup Management": "إدارة القوائم",
  "Form Templates": "قوالب النماذج",
  "Global Attachments": "المرفقات العامة",
  "Create": "إنشاء",
  "+ Create": "+ إنشاء",
  "Open": "فتح",
  "Edit": "تعديل",
  "Archive": "أرشفة",
  "Delete": "حذف",
  "Restore": "استعادة",
  "Cancel": "إلغاء",
  "Save": "حفظ",
  "Save Changes": "حفظ التغييرات",
  "Submit": "إرسال",
  "Submit Request": "إرسال طلب",
  "Create Ticket": "إنشاء تذكرة",
  "Create Task": "إنشاء مهمة",
  "Create Person": "إنشاء شخص",
  "Register Asset": "تسجيل أصل",
  "Upload Document": "رفع مستند",
  "Download": "تنزيل",
  "Preview": "معاينة",
  "Share": "مشاركة",
  "Export": "تصدير",
  "Print": "طباعة",
  "More": "المزيد",
  "Search": "بحث",
  "Search My Tasks": "البحث في مهامي",
  "Search tickets, assets, people, vendors...": "ابحث في التذاكر والأصول والأشخاص والموردين...",
  "Jump to module...": "انتقل إلى وحدة...",
  "All Status": "كل الحالات",
  "All Priority": "كل الأولويات",
  "All Category": "كل التصنيفات",
  "All Assignee": "كل المسؤولين",
  "All": "الكل",
  "None": "لا يوجد",
  "No records": "لا توجد سجلات",
  "No records found": "لم يتم العثور على سجلات",
  "No matching tasks": "لا توجد مهام مطابقة",
  "No matching tickets": "لا توجد تذاكر مطابقة",
  "Nothing here": "لا يوجد شيء هنا",
  "No records in this lane.": "لا توجد سجلات في هذا المسار.",
  "Try changing search or filters.": "جرّب تغيير البحث أو عوامل التصفية.",
  "Record not found": "لم يتم العثور على السجل",
  "The selected record may have been archived.": "قد يكون السجل المحدد مؤرشفًا.",
  "← Back to list": "← الرجوع إلى القائمة",
  "← Back": "← رجوع",
  "Back": "رجوع",
  "Overview": "نظرة عامة",
  "Details": "التفاصيل",
  "Conversation": "المحادثة",
  "Comments": "التعليقات",
  "Notes": "الملاحظات",
  "Attachments": "المرفقات",
  "Files": "الملفات",
  "Timeline": "التسلسل الزمني",
  "History": "السجل",
  "Related Records": "السجلات المرتبطة",
  "Documents": "المستندات",
  "Account": "الحساب",
  "Contacts": "جهات الاتصال",
  "Renewals": "التجديدات",
  "Vendor": "المورد",
  "Costs": "التكاليف",
  "Article": "المقال",
  "Published": "منشور",
  "Draft": "مسودة",
  "Archived": "مؤرشف",
  "Pending Review": "بانتظار المراجعة",
  "Open": "مفتوحة",
  "In Progress": "قيد التنفيذ",
  "Waiting": "بانتظار",
  "Resolved": "محلولة",
  "Closed": "مغلقة",
  "Cancelled": "ملغاة",
  "Pending": "معلقة",
  "Completed": "مكتملة",
  "Low": "منخفضة",
  "Medium": "متوسطة",
  "High": "عالية",
  "Critical": "حرجة",
  "Priority": "الأولوية",
  "Status": "الحالة",
  "Category": "التصنيف",
  "Subcategory": "التصنيف الفرعي",
  "Requester": "مقدم الطلب",
  "Assigned To": "مسند إلى",
  "Assigned Group": "المجموعة المسندة",
  "Created Date": "تاريخ الإنشاء",
  "Updated Date": "تاريخ التحديث",
  "Due Date": "تاريخ الاستحقاق",
  "Start Date": "تاريخ البدء",
  "Description": "الوصف",
  "Title": "العنوان",
  "Subject": "الموضوع",
  "Owner": "المالك",
  "Location": "الموقع",
  "Department": "القسم",
  "Job Title": "المسمى الوظيفي",
  "Email": "البريد الإلكتروني",
  "Phone": "الهاتف",
  "Name": "الاسم",
  "Type": "النوع",
  "Version": "الإصدار",
  "Last Updated": "آخر تحديث",
  "Created": "تم الإنشاء",
  "Updated": "تم التحديث",
  "Saved": "تم الحفظ",
  "Could not save": "تعذر الحفظ",
  "Created successfully.": "تم الإنشاء بنجاح.",
  "Updated successfully.": "تم التحديث بنجاح.",
  "Tasks saved successfully.": "تم حفظ المهام بنجاح.",
  "Tickets saved successfully.": "تم حفظ التذاكر بنجاح.",
  "Signed in": "تم تسجيل الدخول",
  "Logout": "تسجيل الخروج",
  "My Profile": "ملفي الشخصي",
  "Preferences": "التفضيلات",
  "Notifications": "الإشعارات",
  "Appearance": "المظهر",
  "Appearance: System": "المظهر: النظام",
  "Arabic": "العربية",
  "English": "English",
  "Language": "اللغة",
  "Dark Mode": "الوضع الداكن",
  "Light": "فاتح",
  "Dark": "داكن",
  "System": "النظام",
  "Card View": "عرض البطاقات",
  "Calendar View": "عرض التقويم",
  "Month": "الشهر",
  "Week": "الأسبوع",
  "Day": "اليوم",
  "Today": "اليوم",
  "Overdue": "متأخرة",
  "Due Today": "مستحقة اليوم",
  "Due This Week": "مستحقة هذا الأسبوع",
  "Upcoming Tasks": "المهام القادمة",
  "Recent Tickets": "آخر التذاكر",
  "Announcements": "الإعلانات",
  "View all": "عرض الكل",
  "Submit a request": "إرسال طلب",
  "How can IT help today?": "كيف يمكن لتقنية المعلومات مساعدتك اليوم؟",
  "Employee Portal": "بوابة الموظف",
  "Priority Summary": "ملخص الأولويات",
  "Attention Queue": "قائمة الانتباه",
  "Recent Activity": "آخر النشاط",
  "Quick Actions": "إجراءات سريعة",
  "Critical Tickets": "التذاكر الحرجة",
  "Overdue Tasks": "المهام المتأخرة",
  "Expiring Contracts": "العقود القريبة من الانتهاء",
  "Assets In Repair": "أصول قيد الإصلاح",
  "Waiting Approvals": "موافقات بانتظار الإجراء",
  "Unassigned Tickets": "تذاكر غير مسندة",
  "Needs Immediate Attention": "تحتاج انتباهًا فوريًا",
  "Overdue Items": "عناصر متأخرة",
  "Expiring Soon": "تنتهي قريبًا",
  "Waiting For Me": "بانتظاري",
  "Unassigned Work": "عمل غير مسند",
  "Operational awareness first": "الأولوية للوعي التشغيلي",
  "Conversation first": "المحادثة أولًا",
  "Execution first": "التنفيذ أولًا",
  "Lifecycle first": "دورة الحياة أولًا",
  "Profile first": "الملف الشخصي أولًا",
  "Document first": "المستند أولًا",
  "Article first": "المقال أولًا",
  "Renewal first": "التجديد أولًا",
  "Relationship first": "العلاقة أولًا",
  "Configuration first": "الإعداد أولًا",
  "Primary action": "الإجراء الأساسي",
  "Required": "مطلوب",
  "Optional": "اختياري",
  "Additional Details": "تفاصيل إضافية",
  "More Information (Optional)": "معلومات إضافية (اختياري)",
  "Attachment": "مرفق",
  "Upload": "رفع",
  "Reply": "رد",
  "Internal Note": "ملاحظة داخلية",
  "Send Reply": "إرسال الرد",
  "Comment added": "تمت إضافة تعليق",
  "Attachment uploaded": "تم رفع المرفق",
  "Task status updated": "تم تحديث حالة المهمة",
  "Task updated": "تم تحديث المهمة",
  "Task archived": "تمت أرشفة المهمة",
  "Not allowed": "غير مسموح",
  "You do not have permission to update this task.": "ليست لديك صلاحية تحديث هذه المهمة.",
  "Forbidden field update": "تحديث حقل غير مسموح",
  "Request failed": "فشل الطلب",
  "Available in a future version": "متاح في إصدار لاحق",
  "This action is available in a future version.": "هذا الإجراء متاح في إصدار لاحق.",
  "This action is planned for a future version.": "هذا الإجراء مخطط لإصدار لاحق.",
  "Coming soon": "قريبًا"
};

Object.assign(uiTextAr, {
  "Filters are active": "\u062a\u0645 \u062a\u0641\u0639\u064a\u0644 \u0639\u0648\u0627\u0645\u0644 \u0627\u0644\u062a\u0635\u0641\u064a\u0629",
  "Reset Filters": "\u0625\u0639\u0627\u062f\u0629 \u0636\u0628\u0637 \u0627\u0644\u062a\u0635\u0641\u064a\u0629",
  "Clear Filters": "\u0645\u0633\u062d \u0627\u0644\u062a\u0635\u0641\u064a\u0629",
  "Pending / Paused": "\u0645\u0639\u0644\u0642\u0629 / \u0645\u062a\u0648\u0642\u0641\u0629",
  "Paused": "\u0645\u062a\u0648\u0642\u0641\u0629",
  "Personal": "\u0634\u062e\u0635\u064a\u0629",
  "Work": "\u0639\u0645\u0644",
  "Moved to Completed": "\u0646\u064f\u0642\u0644\u062a \u0625\u0644\u0649 \u0645\u0643\u062a\u0645\u0644\u0629",
  "Moved to Cancelled": "\u0646\u064f\u0642\u0644\u062a \u0625\u0644\u0649 \u0645\u0644\u063a\u0627\u0629",
  "Open article": "\u0641\u062a\u062d \u0627\u0644\u0645\u0642\u0627\u0644",
  "Back to request": "\u0627\u0644\u0639\u0648\u062f\u0629 \u0625\u0644\u0649 \u0627\u0644\u0637\u0644\u0628",
  "Loading your workspace...": "\u062c\u0627\u0631\u064a \u062a\u062d\u0645\u064a\u0644 \u0645\u0633\u0627\u062d\u0629 \u0639\u0645\u0644\u0643...",
  "Could not load workspace": "\u062a\u0639\u0630\u0631 \u062a\u062d\u0645\u064a\u0644 \u0645\u0633\u0627\u062d\u0629 \u0627\u0644\u0639\u0645\u0644",
  "Suggested articles": "\u0645\u0642\u0627\u0644\u0627\u062a \u0645\u0642\u062a\u0631\u062d\u0629",
  "These may solve the issue before a ticket is needed.": "\u0642\u062f \u062a\u0633\u0627\u0639\u062f\u0643 \u0647\u0630\u0647 \u0627\u0644\u0645\u0642\u0627\u0644\u0627\u062a \u0642\u0628\u0644 \u0625\u0646\u0634\u0627\u0621 \u062a\u0630\u0643\u0631\u0629.",
  "Solved": "\u062d\u0644\u0651\u062a \u0627\u0644\u0645\u0634\u0643\u0644\u0629",
  "Mark read": "\u062a\u0639\u064a\u064a\u0646 \u0643\u0645\u0642\u0631\u0648\u0621",
  "Mark all read": "\u062a\u0639\u064a\u064a\u0646 \u0627\u0644\u0643\u0644 \u0643\u0645\u0642\u0631\u0648\u0621",
  "No notifications": "\u0644\u0627 \u062a\u0648\u062c\u062f \u0625\u0634\u0639\u0627\u0631\u0627\u062a",
  "You are caught up.": "\u0643\u0644 \u0634\u064a\u0621 \u0645\u062d\u062f\u062b.",
  "OPERATIONS SUITE": "منصة العمليات",
  "WORKSPACE": "مساحة العمل",
  "Workspace": "مساحة العمل",
  "Live workspace": "مساحة عمل مباشرة",
  "Board view": "عرض اللوحة",
  "Feed view": "عرض السجل",
  "Split workspace": "مساحة عمل مقسمة",
  "Card view": "عرض البطاقات",
  "Employee": "موظف",
  "IT Manager": "مدير تقنية المعلومات",
  "IT Staff": "فريق تقنية المعلومات",
  "System Admin": "مدير النظام",
  "Save Preferences": "حفظ التفضيلات",
  "Preferences saved": "تم حفظ التفضيلات",
  "Your workspace preferences were updated.": "تم تحديث تفضيلات مساحة العمل.",
  "Choose how your employee workspace opens and appears.": "اختر طريقة فتح مساحة عمل الموظف ومظهرها.",
  "Default landing page": "صفحة البداية الافتراضية",
  "Save Dashboard": "حفظ لوحة التحكم",
  "Customize Dashboard": "تخصيص لوحة التحكم",
  "Primary KPIs": "مؤشرات الأداء الأساسية",
  "Secondary KPIs": "مؤشرات الأداء الثانوية",
  "Work Queue": "قائمة العمل",
  "Priority Signals": "إشارات الأولوية",
  "Focus": "التركيز",
  "Operational Health Charts": "رسوم الصحة التشغيلية",
  "No tasks here.": "لا توجد مهام هنا.",
  "Latest from IT": "آخر أخبار تقنية المعلومات",
  "Self-service help": "مساعدة الخدمة الذاتية",
  "What needs attention": "ما يحتاج إلى انتباه",
  "Latest requests": "آخر الطلبات",
  "Due before month end": "مستحقة قبل نهاية الشهر",
  "Past due and still active": "متأخرة وما زالت نشطة",
  "Daily": "يومي",
  "Weekly": "أسبوعي",
  "Monthly": "شهري",
  "Yearly": "سنوي",
  "One time": "مرة واحدة",
  "one_time": "مرة واحدة",
  "No start date": "لا يوجد تاريخ بدء",
  "No due date": "لا يوجد تاريخ استحقاق"
});

Object.assign(uiTextAr, {
  "IT Operations Management": "إدارة عمليات تقنية المعلومات",
  "A calm command workspace for assets, tickets, contracts, people, documents, and audit history.": "مساحة عمل هادئة لإدارة الأصول والتذاكر والعقود والأشخاص والمستندات وسجل التدقيق.",
  "Audit-ready": "جاهز للتدقيق",
  "Bilingual": "ثنائي اللغة",
  "Dark mode": "الوضع الداكن",
  "Welcome back": "مرحبًا بعودتك",
  "Sign in to your V1 operations workspace.": "سجّل الدخول إلى مساحة عمليات V1.",
  "Username or Email": "اسم المستخدم أو البريد الإلكتروني",
  "Password": "كلمة المرور",
  "Login": "تسجيل الدخول",
  "Demo accounts: admin/admin123, manager/manager123, staff/staff123, employee/admin123.": "حسابات العرض: admin/admin123، manager/manager123، staff/staff123، employee/admin123.",
  "Logged out": "تم تسجيل الخروج",
  "Your local session was cleared.": "تم مسح جلستك المحلية.",
  "Operations Suite": "منصة العمليات",
  "Self Service": "الخدمة الذاتية",
  "Submit a request, check your tickets, see your assigned assets, and find self-service answers without admin tools.": "أرسل طلبًا، وتابع تذاكرك، وراجع أصولك المسندة، وابحث عن إجابات الخدمة الذاتية دون أدوات إدارية.",
  "Ask IT for help or request a service.": "اطلب مساعدة تقنية المعلومات أو خدمة جديدة.",
  "My Tickets": "تذاكري",
  "Track your requests and public replies.": "تابع طلباتك والردود العامة.",
  "See devices currently assigned to you.": "اعرض الأجهزة المسندة إليك حاليًا.",
  "Review your assigned work and due dates.": "راجع الأعمال المسندة إليك وتواريخ الاستحقاق.",
  "Open company documents you can access.": "افتح مستندات الشركة المتاحة لك.",
  "Find published IT guidance.": "ابحث في إرشادات تقنية المعلومات المنشورة.",
  "IT support hours": "ساعات دعم تقنية المعلومات",
  "IT support is available Sunday to Thursday, 8:00 AM to 5:00 PM.": "يتوفر دعم تقنية المعلومات من الأحد إلى الخميس، من 8:00 صباحًا إلى 5:00 مساءً.",
  "DUE TODAY": "مستحقة اليوم",
  "NEXT 7 DAYS": "الأيام السبعة القادمة",
  "NEEDS ATTENTION": "تحتاج إلى انتباه",
  "LATEST FROM IT": "آخر أخبار تقنية المعلومات",
  "SELF-SERVICE HELP": "مساعدة الخدمة الذاتية",
  "WHAT NEEDS ATTENTION": "ما يحتاج إلى انتباه",
  "LATEST REQUESTS": "آخر الطلبات",
  "due": "مستحق",
  "medium": "متوسطة",
  "high": "عالية",
  "low": "منخفضة",
  "critical": "حرجة",
  "pending": "معلقة",
  "in_progress": "قيد التنفيذ",
  "waiting": "بانتظار",
  "completed": "مكتملة",
  "cancelled": "ملغاة",
  "open": "مفتوحة",
  "closed": "مغلقة",
  "resolved": "محلولة"
});

Object.assign(uiTextAr, {
  "Start with what needs attention now.": "ابدأ بما يحتاج إلى الانتباه الآن.",
  "A morning view for triage: urgent work, overdue items, expiring obligations, and decisions waiting on IT.": "عرض صباحي للفرز: الأعمال العاجلة، العناصر المتأخرة، الالتزامات القريبة من الانتهاء، والقرارات المنتظرة من تقنية المعلومات.",
  "Review tickets": "مراجعة التذاكر",
  "Customize": "تخصيص",
  "What needs attention now": "ما يحتاج إلى انتباه الآن",
  "Immediate escalation": "تصعيد فوري",
  "Past due work": "عمل متأخر",
  "Next 30 days": "الأيام الثلاثون القادمة",
  "Unavailable assets": "أصول غير متاحة",
  "Needs decision": "يحتاج قرارًا",
  "Needs owner": "يحتاج مالكًا",
  "Highest value next actions": "الإجراءات التالية الأعلى قيمة",
  "A few records per lane so the dashboard stays focused on action, not reporting.": "عدد قليل من السجلات في كل مسار حتى تبقى اللوحة مركزة على الإجراء وليس التقارير.",
  "Needs immediate attention": "تحتاج انتباهًا فوريًا",
  "Overdue task": "مهمة متأخرة",
  "Past due": "متأخر",
  "Renewal": "تجديد",
  "days remaining": "يومًا متبقيًا",
  "Waiting: Vendor": "بانتظار: المورد",
  "Unassigned": "غير مسندة",
  "Meaningful operational updates": "تحديثات تشغيلية مهمة",
  "See all": "عرض الكل",
  "Create a ticket from the workspace.": "أنشئ تذكرة من مساحة العمل.",
  "Create executable work.": "أنشئ عملًا قابلًا للتنفيذ.",
  "Register an IT asset.": "سجّل أصلًا تقنيًا.",
  "Upload a controlled document.": "ارفع مستندًا محكومًا.",
  "Create a person profile.": "أنشئ ملف شخص.",
  "Ticket updated": "تم تحديث تذكرة",
  "Task completed": "اكتملت مهمة",
  "Asset assigned": "تم إسناد أصل",
  "Document uploaded": "تم رفع مستند",
  "Knowledge article published": "تم نشر مقال معرفي",
  "permanent delete tasks": "حذف نهائي للمهام",
  "update tasks": "تحديث المهام",
  "create tasks": "إنشاء المهام",
  "status change tasks": "تغيير حالة المهام",
  "performed permanent_delete on tasks.": "نفّذ حذفًا نهائيًا على المهام.",
  "performed update on tasks.": "نفّذ تحديثًا على المهام.",
  "performed create on tasks.": "أنشأ مهمة.",
  "performed status_change on tasks.": "غيّر حالة مهمة.",
  "System Admin": "مدير النظام"
});

Object.assign(uiTextAr, {
  "PRIORITY SUMMARY": "ملخص الأولويات",
  "ATTENTION QUEUE": "قائمة الانتباه",
  "RECENT ACTIVITY": "آخر النشاط",
  "QUICK ACTIONS": "إجراءات سريعة",
  "Tickets Workspace": "مساحة عمل التذاكر",
  "Tasks Workspace": "مساحة عمل المهام",
  "Keep the requester conversation, assignment, status, and resolution context in one focused pane.": "اجمع محادثة مقدم الطلب والإسناد والحالة وسياق الحل في مساحة مركزة واحدة.",
  "Focus on the next action, owner, due date, progress, and blockers.": "ركّز على الإجراء التالي والمالك وتاريخ الاستحقاق والتقدم والعوائق.",
  "Use People as the master profile for real humans, relationships, assets, tickets, tasks, documents, and system access.": "استخدم الأشخاص كسجل رئيسي للأفراد والعلاقات والأصول والتذاكر والمهام والمستندات والوصول للنظام.",
  "Show custody and lifecycle state first, then support records, documents, and financial detail.": "اعرض العهدة وحالة دورة الحياة أولًا، ثم سجلات الدعم والمستندات والتفاصيل المالية.",
  "Make the document, file, and publishing context the center of the workspace.": "اجعل المستند والملف وسياق النشر مركز مساحة العمل.",
  "Prioritize readable article content, ownership, review status, and employee usefulness.": "أعط الأولوية لمحتوى المقال المقروء والملكية وحالة المراجعة وفائدة الموظف.",
  "Put renewal health, days remaining, vendor obligation, and cost exposure above deep contract detail.": "ضع صحة التجديد والأيام المتبقية والتزام المورد والتكلفة قبل تفاصيل العقد العميقة.",
  "Show vendor health, support contacts, linked contracts, open tickets, and operational relationship context.": "اعرض صحة المورد وجهات دعم الاتصال والعقود المرتبطة والتذاكر المفتوحة وسياق العلاقة التشغيلية.",
  "Keep administration in focused sections so daily operations stay calm.": "حافظ على الإدارة في أقسام مركزة حتى تبقى العمليات اليومية هادئة.",
  "Ticket list": "قائمة التذاكر",
  "matching": "مطابقة",
  "Search tickets, requester, category...": "ابحث في التذاكر أو مقدم الطلب أو التصنيف...",
  "Change Status": "تغيير الحالة",
  "Cancel reason": "سبب الإلغاء",
  "Cancel Reason": "سبب الإلغاء",
  "Select reason": "اختر السبب",
  "Duplicate": "مكرر",
  "Created by mistake": "أُنشئت بالخطأ",
  "No longer needed": "لم تعد مطلوبة",
  "Other": "أخرى",
  "Cancel Task": "إلغاء المهمة",
  "Assigned To Me": "مسندة إليّ",
  "Recurring": "متكررة",
  "Owner": "المالك",
  "All Owner": "كل المالكين",
  "All Assigned To": "كل المسند إليهم",
  "Search Tasks": "البحث في المهام",
  "New Person": "شخص جديد",
  "Edit Person": "تعديل الشخص",
  "Open User Account": "فتح حساب المستخدم",
  "Person Type": "نوع الشخص",
  "All Person Type": "كل أنواع الأشخاص",
  "All Department": "كل الأقسام",
  "All Location": "كل المواقع",
  "Active": "نشط",
  "Contractor": "متعاقد",
  "Trainee": "متدرب",
  "Intern": "متدرب داخلي",
  "New Asset": "أصل جديد",
  "Edit Asset": "تعديل الأصل",
  "Search Assets": "البحث في الأصول",
  "Search people": "البحث في الأشخاص",
  "Available": "متاح",
  "Assigned": "مسند",
  "In Repair": "قيد الإصلاح",
  "New Document": "مستند جديد",
  "Search Documents": "البحث في المستندات",
  "Search المستندات": "البحث في المستندات",
  "Linked Type": "نوع الارتباط",
  "Uploaded": "مرفوع",
  "Create Article": "إنشاء مقال",
  "Search articles, keywords, tags, category, body...": "ابحث في المقالات والكلمات المفتاحية والوسوم والتصنيف والمحتوى...",
  "Review Status": "حالة المراجعة",
  "All Reviews": "كل المراجعات",
  "Current": "حالي",
  "Needs Review": "تحتاج مراجعة",
  "Expired": "منتهي",
  "Audience": "الجمهور",
  "All Audiences": "كل الجمهور",
  "All Categories": "كل التصنيفات",
  "All Departments": "كل الأقسام",
  "All Owners": "كل المالكين",
  "All Products": "كل المنتجات",
  "All Tags": "كل الوسوم",
  "Employees": "الموظفون",
  "Search contracts, vendors, assets, licenses...": "ابحث في العقود والموردين والأصول والتراخيص...",
  "New Contract": "عقد جديد",
  "All Vendors": "كل الموردين",
  "Contract Type": "نوع العقد",
  "All Types": "كل الأنواع",
  "Renewal Status": "حالة التجديد",
  "All Renewal": "كل التجديدات",
  "Healthy": "سليم",
  "90 Days": "90 يومًا",
  "60 Days": "60 يومًا",
  "30 Days": "30 يومًا",
  "Renewal Settings": "إعدادات التجديد",
  "Pending approval": "بانتظار الموافقة",
  "Renewed": "مجدد",
  "Terminated": "منتهي",
  "Search vendors, contacts, email, category...": "ابحث في الموردين وجهات الاتصال والبريد والتصنيف...",
  "New Vendor": "مورد جديد",
  "Create Contract": "إنشاء عقد",
  "Attention": "يحتاج انتباه",
  "Inactive": "غير نشط",
  "Criticality": "درجة الأهمية",
  "All Criticality": "كل درجات الأهمية",
  "Vendor Owner": "مالك المورد",
  "Support Type": "نوع الدعم",
  "All Support": "كل أنواع الدعم",
  "Country": "الدولة",
  "All Countries": "كل الدول",
  "Rating": "التقييم",
  "All Ratings": "كل التقييمات",
  "Choose the area you want to configure. Settings is an admin console, so daily operational work stays in the main workspaces.": "اختر منطقة الإعداد التي تريد تهيئتها. الإعدادات هي وحدة تحكم إدارية حتى يبقى العمل اليومي داخل مساحات العمل الرئيسية.",
  "Configuration areas": "مناطق الإعداد",
  "General": "عام",
  "Ticket Assignment": "إسناد التذاكر",
  "Assignment Groups": "مجموعات الإسناد",
  "User accounts, roles, audit, archive, trash, templates, and global attachment administration.": "إدارة حسابات المستخدمين والأدوار والتدقيق والأرشيف وسلة المحذوفات والقوالب والمرفقات العامة.",
  "Configure auto-assignment, strategy": "تهيئة الإسناد التلقائي والاستراتيجية"
});

/* Parameterised templates. Keep the {placeholder} tokens in the Arabic value —
   tpl() substitutes them, so word order may differ from English. */
Object.assign(uiTextAr, {
  "{n} matching": "{n} مطابقة",
  "{n} min read": "قراءة {n} دقيقة",
  "{n} views": "{n} مشاهدة",
  "{n} helpful": "{n} مفيد",
  "{n} records": "{n} سجل",
  "{n} days": "{n} يوم",
  "{n} days remaining": "{n} يوم متبقٍ",
  "{n} days overdue": "متأخر {n} يوم",
  "{n} days expired": "منتهٍ منذ {n} يوم",
  "{n} overdue": "{n} متأخر",
  "{n} active contracts": "{n} عقد نشط",
  "Expired {n} days ago": "انتهى منذ {n} يوم",
  "Expires in {n} days": "ينتهي خلال {n} يوم",
  "page {a} of {b}": "صفحة {a} من {b}",
  "Open {module}": "فتح {module}",
  "Search {module}": "البحث في {module}",
  "{module} list": "قائمة {module}",
  "No {module} found": "لا توجد {module}",
  "No {module} selected": "لم يتم اختيار {module}",
  "Appearance: {mode}": "المظهر: {mode}",
  "Last updated {date}": "آخر تحديث {date}"
});

/* Ticket workspace */
Object.assign(uiTextAr, {
  "Ticket list": "قائمة التذاكر",
  "Ticket Information": "معلومات التذكرة",
  "Ticket details": "تفاصيل التذكرة",
  "Ticket Number": "رقم التذكرة",
  "Ticket quick actions": "إجراءات سريعة للتذكرة",
  "Ticket attachments": "مرفقات التذكرة",
  "Ticket created": "تم إنشاء التذكرة",
  "Request summary": "ملخص الطلب",
  "Number": "الرقم",
  "Assignment": "الإسناد",
  "Assignee": "المسؤول",
  "Assign": "إسناد",
  "Waiting Reason": "سبب الانتظار",
  "Waiting reason": "سبب الانتظار",
  "Not waiting": "ليس في الانتظار",
  "Not cancelled": "غير ملغاة",
  "Waiting for Vendor": "بانتظار المورد",
  "Main Category": "التصنيف الرئيسي",
  "Subcategory": "التصنيف الفرعي",
  "Knowledge Suggestions": "اقتراحات المعرفة",
  "No suggestions yet.": "لا توجد اقتراحات بعد.",
  "Watchers": "المتابعون",
  "No active watchers": "لا يوجد متابعون",
  "Add watcher": "إضافة متابع",
  "Link asset": "ربط أصل",
  "Link vendor": "ربط مورد",
  "Link contract": "ربط عقد",
  "Remove Link": "إزالة الرابط",
  "Linked Record": "السجل المرتبط",
  "No conversation yet": "لا توجد محادثة بعد",
  "Start the conversation with the requester.": "ابدأ المحادثة مع مقدم الطلب.",
  "Write a reply to the requester": "اكتب ردًا لمقدم الطلب",
  "Send": "إرسال",
  "No files yet": "لا توجد ملفات بعد",
  "Attachments uploaded by IT or the requester will appear here.": "ستظهر هنا المرفقات التي يرفعها قسم تقنية المعلومات أو مقدم الطلب.",
  "Secondary record detail stays here so the conversation remains the default workspace.": "تبقى التفاصيل الثانوية هنا لتظل المحادثة مساحة العمل الافتراضية.",
  "SLA breached": "تم خرق اتفاقية مستوى الخدمة",
  "Breached": "مخروقة",
  "Open Tickets": "التذاكر المفتوحة",
  "Open Ticket": "فتح التذكرة",
  "Related Tickets": "التذاكر المرتبطة",
  "Summary": "الملخص",
  "Remaining": "المتبقي",
  "Days Remaining": "الأيام المتبقية",
  "Not set": "غير محدد",
  "Not linked": "غير مرتبط",
  "Not recorded": "غير مسجل",
  "Not scheduled": "غير مجدول",
  "Not versioned": "بدون إصدارات",
  "Not rated helpful": "لم يُقيَّم كمفيد"
});

/* Asset workspace */
Object.assign(uiTextAr, {
  "Asset list": "قائمة الأصول",
  "Asset Identity": "هوية الأصل",
  "Asset Number": "رقم الأصل",
  "Asset Name": "اسم الأصل",
  "Asset Documents": "مستندات الأصل",
  "Asset assignment": "إسناد الأصل",
  "Asset assignment form": "نموذج إسناد الأصل",
  "Asset return": "إرجاع الأصل",
  "Assigned custody snapshot": "لمحة عن العهدة المسندة",
  "Operational ownership, physical holder, location, and attention level at a glance.": "الملكية التشغيلية والحائز الفعلي والموقع ومستوى الاهتمام في لمحة واحدة.",
  "Lifecycle State": "حالة دورة الحياة",
  "Lifecycle Actions": "إجراءات دورة الحياة",
  "Current Lifecycle": "دورة الحياة الحالية",
  "Guided workflows": "مسارات عمل موجهة",
  "Assign Asset": "إسناد الأصل",
  "Transfer Asset": "نقل الأصل",
  "Temporary Custody": "عهدة مؤقتة",
  "Return to IT Storage": "إرجاع إلى مخزن تقنية المعلومات",
  "Send to Repair": "إرسال للإصلاح",
  "Mark Lost / Stolen": "تعليم كمفقود / مسروق",
  "Dispose Asset": "التخلص من الأصل",
  "Print Asset Label": "طباعة ملصق الأصل",
  "Print label": "طباعة الملصق",
  "Export asset": "تصدير الأصل",
  "Bulk update": "تحديث جماعي",
  "Open Asset": "فتح الأصل",
  "Create Asset Ticket": "إنشاء تذكرة للأصل",
  "Operational Context": "السياق التشغيلي",
  "Financial / Disposal": "المالية / التخلص",
  "Permanent Custodian": "الحائز الدائم",
  "Current Holder": "الحائز الحالي",
  "Current Holder Type": "نوع الحائز الحالي",
  "Expected Return": "الإرجاع المتوقع",
  "Latest Movement": "آخر حركة",
  "Serial Number": "الرقم التسلسلي",
  "Manufacturer": "الشركة المصنعة",
  "Model": "الطراز",
  "Warranty Status": "حالة الضمان",
  "Supplier": "المورد",
  "Purchase Cost": "تكلفة الشراء",
  "Current Value": "القيمة الحالية",
  "Disposal Reason": "سبب التخلص",
  "Settlement Status": "حالة التسوية",
  "Settlement Date": "تاريخ التسوية",
  "Maintenance History": "سجل الصيانة",
  "Add Maintenance Record": "إضافة سجل صيانة",
  "No maintenance records": "لا توجد سجلات صيانة",
  "Maintenance and repair history will appear here.": "سيظهر هنا سجل الصيانة والإصلاح.",
  "Invoices, warranty files, manuals, photos, and attachments.": "الفواتير وملفات الضمان والأدلة والصور والمرفقات.",
  "Returned and historical assets": "الأصول المُرجعة والتاريخية",
  "No asset history": "لا يوجد سجل للأصل",
  "Asset assignment and return events appear here.": "تظهر هنا أحداث إسناد الأصول وإرجاعها.",
  "Warranty: not set": "الضمان: غير محدد"
});

/* Task workspace */
Object.assign(uiTextAr, {
  "Task list": "قائمة المهام",
  "Task Number": "رقم المهمة",
  "Task Type": "نوع المهمة",
  "Task notes": "ملاحظات المهمة",
  "Task files": "ملفات المهمة",
  "Task created": "تم إنشاء المهمة",
  "Execution Snapshot": "لمحة عن التنفيذ",
  "Execution task filters": "مرشحات مهام التنفيذ",
  "Owner, assignment, due date, progress, and remaining time for the selected task.": "المالك والإسناد وتاريخ الاستحقاق والتقدم والوقت المتبقي للمهمة المحددة.",
  "Progress": "التقدم",
  "Start": "بدء",
  "Complete": "إكمال",
  "Pause Task": "إيقاف المهمة مؤقتًا",
  "Duplicate Task": "تكرار المهمة",
  "Convert to Ticket": "تحويل إلى تذكرة",
  "Set Reminder": "ضبط تذكير",
  "Add Subtask": "إضافة مهمة فرعية",
  "Subtasks": "المهام الفرعية",
  "Subtask title": "عنوان المهمة الفرعية",
  "No subtasks": "لا توجد مهام فرعية",
  "Create subtasks to break work into smaller steps.": "أنشئ مهام فرعية لتقسيم العمل إلى خطوات أصغر.",
  "Checklist and progress": "قائمة التحقق والتقدم",
  "Parent progress reflects completed subtasks.": "يعكس تقدم المهمة الأصلية المهام الفرعية المكتملة.",
  "Capture decisions, updates, blockers, and next steps.": "سجّل القرارات والتحديثات والعوائق والخطوات التالية.",
  "Add internal notes, decisions, or progress updates.": "أضف ملاحظات داخلية أو قرارات أو تحديثات التقدم.",
  "Save Notes": "حفظ الملاحظات",
  "Upload and review files related to this task here.": "ارفع وراجع الملفات المتعلقة بهذه المهمة هنا.",
  "Link tickets, assets, contracts, vendors, people, documents, forms, or knowledge articles.": "اربط التذاكر أو الأصول أو العقود أو الموردين أو الأشخاص أو المستندات أو النماذج أو مقالات المعرفة.",
  "Schedule Context": "سياق الجدولة",
  "Reminder": "تذكير",
  "Duration": "المدة",
  "Recurrence": "التكرار",
  "Pattern": "النمط",
  "Estimated Time": "الوقت المقدر",
  "Actual Time": "الوقت الفعلي",
  "Linked Work": "العمل المرتبط",
  "Latest Activity": "آخر نشاط",
  "Related Module": "الوحدة المرتبطة",
  "More Filters": "مزيد من المرشحات",
  "No tasks": "لا توجد مهام",
  "Assigned, recurring, and completed tasks appear here.": "تظهر هنا المهام المسندة والمتكررة والمكتملة."
});

/* Knowledge base */
Object.assign(uiTextAr, {
  "Knowledge article list": "قائمة مقالات المعرفة",
  "Article Snapshot": "لمحة عن المقال",
  "Article context": "سياق المقال",
  "Article published": "تم نشر المقال",
  "Article ticket created": "تم إنشاء تذكرة للمقال",
  "Current publishing state": "حالة النشر الحالية",
  "The Article Snapshot carries publishing state; this view keeps supporting context concise.": "تحمل لمحة المقال حالة النشر؛ ويبقي هذا العرض السياق المساند موجزًا.",
  "Reading Time": "زمن القراءة",
  "Reading View": "عرض القراءة",
  "Readable knowledge content for support and self-service.": "محتوى معرفي سهل القراءة للدعم والخدمة الذاتية.",
  "Publish": "نشر",
  "Review Schedule": "جدول المراجعة",
  "Review Date": "تاريخ المراجعة",
  "Export PDF": "تصدير PDF",
  "Advanced governance": "حوكمة متقدمة",
  "Table of Contents": "جدول المحتويات",
  "No headings yet": "لا توجد عناوين بعد",
  "Add H1, H2, or H3 headings to generate navigation.": "أضف عناوين H1 أو H2 أو H3 لإنشاء التنقل.",
  "Keywords": "الكلمات المفتاحية",
  "Product": "المنتج",
  "Tags": "الوسوم",
  "Sort By": "ترتيب حسب",
  "Drafts": "المسودات",
  "Favorites": "المفضلة",
  "Most Viewed": "الأكثر مشاهدة",
  "Recently Updated": "المحدثة مؤخرًا",
  "Newest": "الأحدث",
  "Oldest": "الأقدم",
  "Alphabetical": "أبجديًا",
  "All Languages": "كل اللغات",
  "Save Content": "حفظ المحتوى",
  "Drop images, PDFs, videos, DOCX, GIF, SVG, ZIP, or attachments here": "أفلت الصور أو ملفات PDF أو الفيديو أو DOCX أو GIF أو SVG أو ZIP أو المرفقات هنا",
  "Related Assets": "الأصول المرتبطة",
  "Related Vendors": "الموردون المرتبطون",
  "Related Contracts": "العقود المرتبطة",
  "Related Documents": "المستندات المرتبطة",
  "Related Tickets linked to this article will appear here.": "ستظهر هنا التذاكر المرتبطة بهذا المقال.",
  "Related Assets linked to this article will appear here.": "ستظهر هنا الأصول المرتبطة بهذا المقال.",
  "Related Vendors linked to this article will appear here.": "سيظهر هنا الموردون المرتبطون بهذا المقال.",
  "Related Contracts linked to this article will appear here.": "ستظهر هنا العقود المرتبطة بهذا المقال.",
  "No Related Records": "لا توجد سجلات مرتبطة",
  "No related records": "لا توجد سجلات مرتبطة",
  "Bold": "عريض", "Italic": "مائل", "Underline": "تسطير", "Color": "اللون",
  "Highlight": "تظليل", "Bullets": "تعداد نقطي", "Numbers": "تعداد رقمي",
  "Checklist": "قائمة تحقق", "Table": "جدول", "Link": "رابط", "Quote": "اقتباس",
  "Code": "كود", "Divider": "فاصل", "Information": "معلومة", "Danger": "خطر",
  "Success": "نجاح", "Tip": "نصيحة", "Best Practice": "أفضل ممارسة",
  "Requirement": "متطلب", "Procedure": "إجراء"
});

/* Documents */
Object.assign(uiTextAr, {
  "Document Workspace": "مساحة عمل المستندات",
  "Document Snapshot": "لمحة عن المستند",
  "Document record": "سجل المستند",
  "Document Type": "نوع المستند",
  "Document created": "تم إنشاء المستند",
  "Document updated": "تم تحديث المستند",
  "Document information": "معلومات المستند",
  "Core details without repeating the snapshot metadata.": "التفاصيل الأساسية دون تكرار بيانات اللمحة.",
  "Current file state": "حالة الملف الحالية",
  "Current File": "الملف الحالي",
  "No file attached": "لا يوجد ملف مرفق",
  "Primary document file": "ملف المستند الرئيسي",
  "Upload a PDF, Word, Excel, or image file for this document.": "ارفع ملف PDF أو Word أو Excel أو صورة لهذا المستند.",
  "Upload Replacement": "رفع بديل",
  "New version": "إصدار جديد",
  "Upload a replacement or supporting file. Existing upload permissions are preserved.": "ارفع ملفًا بديلًا أو مساندًا. تبقى صلاحيات الرفع الحالية كما هي.",
  "Previous Versions": "الإصدارات السابقة",
  "File history": "سجل الملفات",
  "No previous versions": "لا توجد إصدارات سابقة",
  "Replacement files will appear here after upload.": "ستظهر الملفات البديلة هنا بعد الرفع.",
  "Download History": "سجل التنزيل",
  "Access log": "سجل الوصول",
  "Download history is available in a future version.": "سجل التنزيل متاح في إصدار لاحق.",
  "No documents": "لا توجد مستندات",
  "Signed forms, policies, and certificates appear here.": "تظهر هنا النماذج الموقعة والسياسات والشهادات.",
  "No attachments": "لا توجد مرفقات",
  "Upload PDFs, images, Word, or Excel files.": "ارفع ملفات PDF أو صورًا أو Word أو Excel.",
  "View all attachments": "عرض كل المرفقات",
  "Optional attachment name": "اسم المرفق (اختياري)",
  "Move": "نقل",
  "Visibility": "الظهور",
  "Internal": "داخلي",
  "Approval State": "حالة الاعتماد",
  "No description provided": "لا يوجد وصف",
  "Uncategorized": "غير مصنف"
});

/* Vendors and contracts */
Object.assign(uiTextAr, {
  "Vendor list": "قائمة الموردين",
  "Vendor Snapshot": "لمحة عن المورد",
  "Vendor Name": "اسم المورد",
  "Vendor Rating": "تقييم المورد",
  "Vendor Relationship": "العلاقة مع المورد",
  "Vendor portal sync": "مزامنة بوابة المورد",
  "Relationship health": "صحة العلاقة",
  "Health": "الصحة",
  "Contract Count": "عدد العقود",
  "Covered Assets": "الأصول المشمولة",
  "Linked Assets": "الأصول المرتبطة",
  "Linked Licenses": "التراخيص المرتبطة",
  "Linked Coverage": "التغطية المرتبطة",
  "Last Interaction": "آخر تفاعل",
  "No activity": "لا يوجد نشاط",
  "Contact Vendor": "التواصل مع المورد",
  "Merge": "دمج",
  "Primary Contact": "جهة الاتصال الرئيسية",
  "Add Contact": "إضافة جهة اتصال",
  "Support Email": "بريد الدعم",
  "Support Phone": "هاتف الدعم",
  "Support Hours": "ساعات الدعم",
  "Support Details": "تفاصيل الدعم",
  "Support SLA": "اتفاقية مستوى خدمة الدعم",
  "Business hours": "ساعات العمل",
  "Company Profile": "ملف الشركة",
  "Business Context": "السياق التجاري",
  "Compliance": "الامتثال",
  "Escalation": "التصعيد",
  "Response SLA": "زمن الاستجابة",
  "Portal Available": "البوابة متاحة",
  "Portal": "البوابة",
  "Annual Spend": "الإنفاق السنوي",
  "Certificates": "الشهادات",
  "Contract list": "قائمة العقود",
  "Contract Snapshot": "لمحة عن العقد",
  "Contract Owner": "مالك العقد",
  "Renewal state": "حالة التجديد",
  "Renew": "تجديد",
  "Terminate": "إنهاء",
  "Approval routing": "مسار الاعتماد",
  "Annual Cost": "التكلفة السنوية",
  "Monthly Cost": "التكلفة الشهرية",
  "Financial Summary": "الملخص المالي",
  "Currency": "العملة",
  "End Date": "تاريخ الانتهاء",
  "Reminder Date": "تاريخ التذكير",
  "Auto Renewal": "تجديد تلقائي",
  "Owner Department": "الإدارة المالكة",
  "Related Contracts": "العقود المرتبطة",
  "No renewals or warranties in the next 30 days.": "لا توجد تجديدات أو ضمانات خلال الثلاثين يومًا القادمة."
});

/* People, accounts and shared chrome */
Object.assign(uiTextAr, {
  "People list": "قائمة الأشخاص",
  "People quick actions": "إجراءات سريعة للأشخاص",
  "Profile Context": "سياق الملف الشخصي",
  "Employee profile and operational relationships": "الملف الشخصي للموظف والعلاقات التشغيلية",
  "Employment and reporting details": "تفاصيل التوظيف والتسلسل الإداري",
  "Employee Number": "رقم الموظف",
  "Manager": "المدير",
  "Branch": "الفرع",
  "Org chart": "الهيكل التنظيمي",
  "Export profile": "تصدير الملف",
  "Send onboarding": "إرسال التهيئة",
  "System Access": "الوصول للنظام",
  "Login Account": "حساب الدخول",
  "Login Account Active": "حساب الدخول نشط",
  "Login Account Enabled": "حساب الدخول مفعّل",
  "This person has a linked login account.": "لدى هذا الشخص حساب دخول مرتبط.",
  "No linked person": "لا يوجد شخص مرتبط",
  "No Login": "لا يوجد حساب دخول",
  "Login accounts": "حسابات الدخول",
  "User account list": "قائمة حسابات المستخدمين",
  "Search user accounts": "البحث في حسابات المستخدمين",
  "Account details are read-only here except controlled account actions.": "تفاصيل الحساب للقراءة فقط هنا باستثناء إجراءات الحساب المتحكم بها.",
  "Account Type": "نوع الحساب",
  "Account Status": "حالة الحساب",
  "Username": "اسم المستخدم",
  "Last Login": "آخر تسجيل دخول",
  "Previous login": "تسجيل الدخول السابق",
  "Password Expiry": "انتهاء كلمة المرور",
  "Password Expires": "تنتهي كلمة المرور",
  "No expiry": "بدون انتهاء",
  "Reset Password": "إعادة تعيين كلمة المرور",
  "Disable": "تعطيل",
  "Disable Account": "تعطيل الحساب",
  "Export account": "تصدير الحساب",
  "Force logout": "إجبار تسجيل الخروج",
  "Login history report": "تقرير سجل الدخول",
  "Sessions": "الجلسات",
  "Security": "الأمان",
  "Enabled": "مفعّل",
  "Disabled": "معطّل",
  "Is System": "نظامي",
  "Role": "الدور",
  "Cost Center": "مركز التكلفة",
  "Created By": "أنشئ بواسطة",
  "Updated At": "تاريخ التحديث",
  "Actions": "الإجراءات",
  "Add comment": "إضافة تعليق",
  "No comments": "لا توجد تعليقات",
  "Start the discussion for this record.": "ابدأ النقاش حول هذا السجل.",
  "Write a threaded reply": "اكتب ردًا في المحادثة",
  "Save edit": "حفظ التعديل",
  "Previous": "السابق",
  "Next": "التالي",
  "Yes": "نعم",
  "No": "لا",
  "Normal": "عادي",
  "Standard": "قياسي",
  "Temporary": "مؤقت",
  "Signed": "موقّع",
  "Approved": "معتمد",
  "Configure": "تهيئة",
  "Search modules": "البحث في الوحدات",
  "Notification center": "مركز الإشعارات",
  "Notification filter": "مرشح الإشعارات",
  "Mark all as read": "تعليم الكل كمقروء",
  "Ticket assignments, updates, overdue tasks, renewals, and warranty signals.": "إسناد التذاكر والتحديثات والمهام المتأخرة والتجديدات وإشارات الضمان.",
  "Focused list view with sorting, filters, pagination, export, and column control.": "عرض قائمة مركّز مع الترتيب والمرشحات والتصفح والتصدير والتحكم بالأعمدة.",
  "Links to assets, tickets, documents, contracts, vendors, and employees appear here.": "تظهر هنا الروابط بالأصول والتذاكر والمستندات والعقود والموردين والموظفين.",
  "Reusable operational forms prepared for V1 workflows.": "نماذج تشغيلية قابلة لإعادة الاستخدام معدّة لمسارات الإصدار الأول.",
  "Primary focus": "التركيز الرئيسي",
  "Supporting context": "السياق المساند",
  "Start common work": "ابدأ الأعمال الشائعة",
  "Capture a new support request.": "سجّل طلب دعم جديد.",
  "Add work for IT follow-up.": "أضف عملًا لمتابعة تقنية المعلومات.",
  "Add a new device or inventory item.": "أضف جهازًا أو عنصر مخزون جديدًا.",
  "Publish or file an operational document.": "انشر أو احفظ مستندًا تشغيليًا.",
  "More actions coming soon": "مزيد من الإجراءات قريبًا",
  "All Role": "كل الأدوار",
  "All Account Type": "كل أنواع الحسابات",
  "All Task Type": "كل أنواع المهام",
  "All Related Module": "كل الوحدات المرتبطة",
  "All Recurring": "كل المتكررة",
  "All Due Date": "كل تواريخ الاستحقاق",
  "All Created By": "كل المنشئين"
});

/* Lookup values, departments, locations and job titles */
Object.assign(uiTextAr, {
  "Human Resources": "الموارد البشرية",
  "Finance": "المالية",
  "Information Technology": "تقنية المعلومات",
  "IT Operations": "عمليات تقنية المعلومات",
  "Operations": "العمليات",
  "Riyadh HQ": "المقر الرئيسي - الرياض",
  "Jeddah Branch": "فرع جدة",
  "IT Storage": "مخزن تقنية المعلومات",
  "IT Inventory": "مخزون تقنية المعلومات",
  "Operations floor": "صالة العمليات",
  "Accountant": "محاسب",
  "Operations Lead": "قائد العمليات",
  "IT Support Specialist": "أخصائي دعم تقني",
  "HR Specialist": "أخصائي موارد بشرية",
  "Software Licensing": "تراخيص البرمجيات",
  "Hardware Support": "دعم الأجهزة",
  "Laptop": "حاسب محمول",
  "Monitor": "شاشة",
  "Printer": "طابعة",
  "Scanner": "ماسح ضوئي",
  "Mobile Phone": "هاتف محمول",
  "Keyboard": "لوحة مفاتيح",
  "Person": "شخص",
  "User": "مستخدم",
  "Asset": "أصل",
  "Ticket": "تذكرة",
  "Task": "مهمة",
  "Contract": "عقد",
  "Document": "مستند",
  "Service": "خدمة",
  "Support": "دعم",
  "Maintenance": "صيانة",
  "Parts": "قطع غيار",
  "Warranty": "ضمان",
  "License": "ترخيص",
  "Subscription": "اشتراك",
  "Approval": "اعتماد",
  "External Company": "شركة خارجية",
  "Device usage agreement": "اتفاقية استخدام الجهاز",
  "VPN request": "طلب شبكة افتراضية",
  "Email request": "طلب بريد إلكتروني",
  "Access request": "طلب صلاحية",
  "Accounts & Access / MFA Issue": "الحسابات والصلاحيات / مشكلة التحقق الثنائي",
  "Accounts & Access / Password Reset": "الحسابات والصلاحيات / إعادة تعيين كلمة المرور",
  "Accounts & Access / Shared Folder Access": "الحسابات والصلاحيات / الوصول لمجلد مشترك",
  "Hardware & Devices / Printer": "الأجهزة والمعدات / طابعة",
  "Hardware & Devices / Scanner": "الأجهزة والمعدات / ماسح ضوئي",
  "Network & Connectivity / VPN": "الشبكة والاتصال / شبكة افتراضية",
  "Service Requests / Equipment Request": "طلبات الخدمة / طلب معدات",
  "Service Requests / License Request": "طلبات الخدمة / طلب ترخيص",
  "Service Requests / New Laptop": "طلبات الخدمة / حاسب محمول جديد",
  "Software & Applications": "البرمجيات والتطبيقات",
  "Software & Applications / Outlook": "البرمجيات والتطبيقات / أوتلوك",
  "Software & Applications / ERP": "البرمجيات والتطبيقات / نظام تخطيط الموارد",
  "Accounts & Access": "الحسابات والصلاحيات",
  "Hardware & Devices": "الأجهزة والمعدات",
  "Network & Connectivity": "الشبكة والاتصال",
  "Service Requests": "طلبات الخدمة"
});

/* Remaining chrome, and the lowercase codes that leak out of data fields where
   a label was expected (category/type/module values stored as raw codes). */
Object.assign(uiTextAr, {
  "Updated {when}": "آخر تحديث {when}",
  "{n} contracts": "{n} عقد",
  "not dated": "بدون تاريخ",
  "Not rated": "غير مقيَّم",
  "Lifecycle": "دورة الحياة",
  "Warning": "تحذير",
  "Upload Attachment": "رفع مرفق",
  "Status:": "الحالة:",
  "Updated:": "آخر تحديث:",
  "Replies:": "الردود:",
  "SLA & Portal": "اتفاقية الخدمة والبوابة",
  "Login success": "نجاح تسجيل الدخول",
  "Login Success": "نجاح تسجيل الدخول",
  "Assignment updated": "تم تحديث الإسناد",
  "No file": "لا يوجد ملف",
  "Company document": "مستند الشركة",
  "Assigned": "مسند",
  "Unassigned": "غير مسند",
  "No linked record": "لا يوجد سجل مرتبط",
  "Valid until": "صالح حتى",
  "1 star": "نجمة واحدة",
  "2 stars": "نجمتان",
  "3 stars": "٣ نجوم",
  "4 stars": "٤ نجوم",
  "5 stars": "٥ نجوم",
  "30 Days": "٣٠ يومًا",
  "60 Days": "٦٠ يومًا",
  "90 Days": "٩٠ يومًا",
  // raw codes rendered where a label was expected
  "users": "المستخدمون",
  "tickets": "التذاكر",
  "tasks": "المهام",
  "assets": "الأصول",
  "documents": "المستندات",
  "contracts": "العقود",
  "vendors": "الموردون",
  "employees": "الموظفون",
  "transfers": "التنقلات",
  "attachments": "المرفقات",
  "comments": "التعليقات",
  "notifications": "الإشعارات",
  "roles": "الأدوار",
  "settings": "الإعدادات",
  "timeline": "المسار الزمني",
  "trash": "سلة المحذوفات",
  "dashboard": "لوحة التحكم",
  "ticket": "تذكرة",
  "task": "مهمة",
  "asset": "أصل",
  "document": "مستند",
  "contract": "عقد",
  "employee": "موظف",
  "company": "شركة",
  "create": "إنشاء",
  "view": "عرض",
  "uploaded": "تم الرفع",
  "draft": "مسودة",
  "approved": "معتمد",
  "outlook": "أوتلوك",
  "erp": "نظام تخطيط الموارد",
  "laptop": "حاسب محمول",
  "printer": "طابعة",
  "vpn": "شبكة افتراضية",
  "network": "شبكة",
  "hardware": "أجهزة",
  "access": "صلاحيات",
  "email": "بريد إلكتروني",
  "head_office": "المقر الرئيسي",
  "hr_specialist": "أخصائي موارد بشرية",
  "microsoft-365": "مايكروسوفت ٣٦٥",
  "remote-work": "العمل عن بُعد"
});

/* Activity / audit feed titles and the last of the shared chrome */
Object.assign(uiTextAr, {
  "{entity} created": "تم إنشاء {entity}",
  "{entity} updated": "تم تحديث {entity}",
  "{entity} archived": "تمت أرشفة {entity}",
  "{entity} restored": "تمت استعادة {entity}",
  "{entity} moved to trash": "تم نقل {entity} إلى سلة المحذوفات",
  "{entity} activity": "نشاط {entity}",
  "Status changed": "تم تغيير الحالة",
  "Comment added": "تمت إضافة تعليق",
  "Attachment uploaded": "تم رفع مرفق",
  "Asset entered maintenance": "دخل الأصل الصيانة",
  "Contract reminder": "تذكير بالعقد",
  "Activity recorded in the command center.": "تم تسجيل النشاط في مركز القيادة.",
  "Change details are available in Audit Feed.": "تفاصيل التغيير متاحة في سجل التدقيق.",
  "login": "تسجيل دخول",
  "logout": "تسجيل خروج",
  "update": "تحديث",
  "archive": "أرشفة",
  "restore": "استعادة",
  "delete": "حذف",
  "upload": "رفع",
  "comment": "تعليق",
  "assign": "إسناد",
  "Login": "تسجيل الدخول",
  "Logout": "تسجيل الخروج",
  "Update": "تحديث",
  "Create": "إنشاء",
  "Archive": "أرشفة",
  "Restore": "استعادة",
  "Delete": "حذف",
  "Upload": "رفع",
  "Upload file": "رفع ملف",
  "Preview": "معاينة",
  "Download": "تنزيل",
  "Remove": "إزالة",
  "Open": "فتح",
  "Open Vendor Workspace": "فتح مساحة عمل المورد",
  "Create Vendor Ticket": "إنشاء تذكرة للمورد",
  "Supporting files": "الملفات المساندة",
  "Linked files": "الملفات المرتبطة",
  "No Attachments": "لا توجد مرفقات",
  "Upload PDFs, images, Word, or Excel files for this article.": "ارفع ملفات PDF أو صورًا أو Word أو Excel لهذا المقال.",
  "File Name": "اسم الملف",
  "Uploaded By": "رفعه",
  "Date": "التاريخ",
  "Size": "الحجم",
  "Type": "النوع",
  "File": "ملف",
  "Not dated": "بدون تاريخ",
  "Not updated": "لم يُحدَّث",
  "Contact": "جهة الاتصال",
  "Portal URL": "رابط البوابة",
  "Vendor Summary": "ملخص المورد",
  "Assigned to Unassigned": "مسند إلى: غير محدد",
  "Inventory": "المخزون",
  "unscheduled": "غير مجدول",
  "due": "الاستحقاق",
  "record": "سجل",
  "Article": "مقال",
  "Draft": "مسودة",
  "Published": "منشور",
  "Unread": "غير مقروء",
  "Read": "مقروء",
  "{n} files": "{n} ملف",
  "{n} attachments": "{n} مرفق",
  "Ends {date}": "ينتهي في {date}",
  "Tickets": "التذاكر",
  "Files": "الملفات"
});

/* Modal and guided-form chrome */
Object.assign(uiTextAr, {
  "Create {module}": "إنشاء {module}",
  "New {module}": "{module} جديد",
  "Save Changes": "حفظ التغييرات",
  "Guided form": "نموذج موجّه",
  "Start with the required basics.": "ابدأ بالأساسيات المطلوبة.",
  "Primary details": "التفاصيل الأساسية",
  "The minimum information needed to save this record.": "الحد الأدنى من المعلومات اللازمة لحفظ هذا السجل.",
  "Advanced options": "خيارات متقدمة",
  "Optional fields for lifecycle, metadata, internal notes, and less common configuration.": "حقول اختيارية لدورة الحياة والبيانات الوصفية والملاحظات الداخلية والإعدادات الأقل شيوعًا.",
  "Related records": "السجلات المرتبطة",
  "Connect this record to existing people, assets, tickets, vendors, contracts, or documents.": "اربط هذا السجل بأشخاص أو أصول أو تذاكر أو موردين أو عقود أو مستندات موجودة.",
  "Approval status": "حالة الاعتماد",
  "Current approval state for this record.": "حالة الاعتماد الحالية لهذا السجل.",
  "Attachments and file details": "المرفقات وتفاصيل الملفات",
  "Add filenames or upload-related information after the core record is clear.": "أضف أسماء الملفات أو معلومات الرفع بعد اكتمال بيانات السجل الأساسية.",
  "Current lifecycle state.": "حالة دورة الحياة الحالية.",
  "Auto-generated when blank": "يُنشأ تلقائيًا عند تركه فارغًا",
  "Short, clear title": "عنوان قصير وواضح",
  "Use a short, searchable title.": "استخدم عنوانًا قصيرًا قابلًا للبحث.",
  "Official name": "الاسم الرسمي",
  "Use the official display name.": "استخدم الاسم الرسمي للعرض.",
  "Create the request with only the details needed for triage. Optional routing and internal fields stay below.": "أنشئ الطلب بالتفاصيل اللازمة للفرز فقط. تبقى حقول التوجيه والحقول الداخلية الاختيارية بالأسفل.",
  "Create executable work with owner, priority, and due date first.": "أنشئ عملًا قابلًا للتنفيذ بتحديد المالك والأولوية وتاريخ الاستحقاق أولًا.",
  "Create the asset identity and custody basics. Lifecycle fields remain available when needed.": "أنشئ هوية الأصل وأساسيات العهدة. تبقى حقول دورة الحياة متاحة عند الحاجة.",
  "Choose the closest option so routing and reporting stay clean.": "اختر أقرب خيار للحفاظ على دقة التوجيه والتقارير.",
  "Choose the main classification.": "اختر التصنيف الرئيسي.",
  "Use the lowest priority that accurately reflects urgency.": "استخدم أقل أولوية تعكس درجة الإلحاح بدقة.",
  "Leave blank if the team should triage first.": "اتركه فارغًا إذا كان على الفريق الفرز أولًا.",
  "Describe the request, problem, or context...": "صف الطلب أو المشكلة أو السياق...",
  "Add enough context for the next person to act.": "أضف سياقًا كافيًا ليتمكن الشخص التالي من التصرف.",
  "Add optional notes...": "أضف ملاحظات اختيارية...",
  "Attachment names": "أسماء المرفقات",
  "Must be unique when available": "يجب أن يكون فريدًا عند توفره",
  "Serial number": "الرقم التسلسلي",
  "Start date": "تاريخ البدء",
  "Choose Main Category": "اختر التصنيف الرئيسي",
  "Submit a request": "إرسال طلب",
  "Create Ticket": "إنشاء تذكرة",
  "Create Service Account": "إنشاء حساب خدمة",
  "New Service Account": "حساب خدمة جديد",
  "Account Details": "تفاصيل الحساب",
  "Service and API accounts can exist without a linked person.": "يمكن أن توجد حسابات الخدمة وواجهات البرمجة دون شخص مرتبط.",
  "Account name": "اسم الحساب",
  "Confirm Password": "تأكيد كلمة المرور",
  "Expiry Date": "تاريخ الانتهاء",
  "Linked Person Optional": "الشخص المرتبط (اختياري)",
  "Linked Person": "الشخص المرتبط",
  "New Account": "حساب جديد",
  "People actions": "إجراءات الأشخاص",
  "Account actions": "إجراءات الحساب",
  "Enable Account": "تفعيل الحساب",
  "Edit": "تعديل",
  "Register Person": "تسجيل شخص",
  "Export list": "تصدير القائمة",
  "Create Account": "إنشاء حساب",
  "Account Purpose": "الغرض من الحساب",
  "Who is this login for?": "لمن هذا الحساب؟",
  "Employee Account": "حساب موظف",
  "A login that belongs to a person.": "حساب دخول يخص شخصًا.",
  "Service Account": "حساب خدمة",
  "A service or API login with no person behind it.": "حساب خدمة أو واجهة برمجة دون شخص مرتبط.",
  "Person": "الشخص",
  "Attach the login to an existing person, or add a new one here.": "اربط الحساب بشخص موجود أو أضف شخصًا جديدًا هنا.",
  "Existing Person": "شخص موجود",
  "Pick someone already in People.": "اختر شخصًا موجودًا في صفحة الأشخاص.",
  "New Person": "شخص جديد",
  "Create the People record with this account.": "أنشئ سجل الشخص مع هذا الحساب.",
  "Sign-in credentials and role. These fields are the same for every account.": "بيانات تسجيل الدخول والدور. هذه الحقول واحدة لكل الحسابات.",
  "Register and manage every login here — employee accounts and service accounts alike.": "سجّل وأدر جميع حسابات الدخول هنا — حسابات الموظفين وحسابات الخدمة على حد سواء.",
  "Create the master People record. Login access is registered from User Accounts.": "أنشئ سجل الشخص الرئيسي. يتم تسجيل الوصول بتسجيل الدخول من صفحة حسابات المستخدمين.",
  "Choose the person this account belongs to.": "اختر الشخص الذي يخصه هذا الحساب.",
  "Person name is required.": "اسم الشخص مطلوب.",
  "Person email is required.": "بريد الشخص الإلكتروني مطلوب.",
  "Department is required.": "القسم مطلوب.",
  "Account name is required.": "اسم الحساب مطلوب.",
  "Username is required.": "اسم المستخدم مطلوب.",
  "Role is required.": "الدور مطلوب.",
  "Account type is required.": "نوع الحساب مطلوب.",
  "Password is required.": "كلمة المرور مطلوبة.",
  "Confirm Password is required.": "تأكيد كلمة المرور مطلوب.",
  "Password and Confirm Password must match.": "يجب أن تتطابق كلمة المرور مع تأكيدها.",
  "Account type": "نوع الحساب",
  "Manage authentication accounts only. Create real people from People, then add System Access there.": "إدارة حسابات المصادقة فقط. أنشئ الأشخاص من صفحة الأشخاص ثم أضف الوصول للنظام هناك.",
  "Customize Dashboard": "تخصيص لوحة التحكم",
  "Personalization": "التخصيص",
  "Choose the widgets, order, density, and default landing page for your account only.": "اختر العناصر وترتيبها والكثافة وصفحة البداية الافتراضية لحسابك فقط.",
  "Widgets": "العناصر",
  "Show, hide, and reorder dashboard sections.": "إظهار وإخفاء وإعادة ترتيب أقسام لوحة التحكم.",
  "Health Score": "مؤشر الصحة",
  "Primary KPIs": "المؤشرات الرئيسية",
  "Secondary KPIs": "المؤشرات الثانوية",
  "Work Queue": "قائمة العمل",
  "Default landing page": "صفحة البداية الافتراضية",
  "Default dashboard density": "كثافة لوحة التحكم الافتراضية",
  "Default recent activity count": "عدد الأنشطة الأخيرة الافتراضي",
  "Restore Default Layout": "استعادة التخطيط الافتراضي",
  "Save": "حفظ",
  "Cancel": "إلغاء"
});

/* Lookup option values shown in selects */
Object.assign(uiTextAr, {
  "Access & Accounts": "الحسابات والصلاحيات",
  "Hardware": "الأجهزة",
  "Software": "البرمجيات",
  "Network": "الشبكة",
  "New Request": "طلب جديد",
  "General": "عام",
  "Other requests": "طلبات أخرى",
  "Password reset": "إعادة تعيين كلمة المرور",
  "Permissions": "الصلاحيات",
  "Account access": "الوصول للحساب",
  "Mobile device": "جهاز محمول",
  "Peripherals": "ملحقات",
  "Application issue": "مشكلة في تطبيق",
  "Software installation": "تثبيت برنامج",
  "License request": "طلب ترخيص",
  "Internet": "الإنترنت",
  "WiFi": "شبكة لاسلكية",
  "Connectivity issue": "مشكلة اتصال",
  "New laptop": "حاسب محمول جديد",
  "New monitor": "شاشة جديدة",
  "Email account": "حساب بريد إلكتروني",
  "Hardware & Devices": "الأجهزة والمعدات",
  "General Questions": "أسئلة عامة",
  "Desktop": "حاسب مكتبي",
  "Custom": "مخصص",
  "Project": "مشروع",
  "Follow-up": "متابعة",
  "IT Operational": "تشغيلي لتقنية المعلومات",
  "Head Office": "المقر الرئيسي",
  "Branch Riyadh": "فرع الرياض",
  "Branch Jeddah": "فرع جدة",
  "Remote": "عن بُعد",
  "Warehouse": "المستودع",
  "Sold to Employee": "بيع لموظف",
  "Reserved": "محجوز",
  "Pending Return": "بانتظار الإرجاع",
  "Lost": "مفقود",
  "Stolen": "مسروق",
  "Retired": "متقاعد",
  "Disposed": "تم التخلص منه",
  "Rejected": "مرفوض",
  "Action required": "يتطلب إجراء",
  "active": "نشط",
  "inactive": "غير نشط",
  "archived": "مؤرشف",
  "overdue": "متأخر",
  "done": "منجز",
  "new": "جديد",
  "good": "جيد",
  "fair": "مقبول",
  "damaged": "تالف",
  "lost": "مفقود",
  "waiting_approval": "بانتظار الاعتماد",
  "Quarterly": "ربع سنوي",
  "At due time": "عند موعد الاستحقاق",
  "1 day before": "قبل يوم واحد",
  "3 days before": "قبل ٣ أيام",
  "7 days before": "قبل ٧ أيام",
  "30 days before": "قبل ٣٠ يومًا",
  "60 days before": "قبل ٦٠ يومًا",
  "90 days before": "قبل ٩٠ يومًا",
  "Scrapped": "تم إتلافه",
  "Donated": "تم التبرع به",
  "Recycled": "تم تدويره",
  "Not Required": "غير مطلوب",
  "Not selected": "لم يتم الاختيار",
  "on_leave": "في إجازة",
  "renewal_due": "التجديد مستحق",
  "expired": "منتهٍ",
  "signed": "موقّع",
  "Locked": "مقفل",
  "Password Expired": "انتهت كلمة المرور",
  "preferred": "مفضّل",
  "under_review": "قيد المراجعة",
  "Licensing": "التراخيص",
  "Cloud": "السحابة",
  "Consulting": "الاستشارات",
  "Template": "قالب"
});

/* Field labels and helper text inside the create/edit forms */
Object.assign(uiTextAr, {
  "Create the renewal-critical contract details first.": "أنشئ تفاصيل العقد الحرجة للتجديد أولًا.",
  "Create the vendor relationship basics first.": "أنشئ أساسيات العلاقة مع المورد أولًا.",
  "Create the document record first; links and file details can be added below.": "أنشئ سجل المستند أولًا؛ يمكن إضافة الروابط وتفاصيل الملف بالأسفل.",
  "Create article content with publication details first.": "أنشئ محتوى المقال مع تفاصيل النشر أولًا.",
  "Create reusable form structure for documents and requests.": "أنشئ بنية نموذج قابلة لإعادة الاستخدام للمستندات والطلبات.",
  "Create the master People record first. Login access is optional.": "أنشئ سجل الشخص الرئيسي أولًا. الوصول بتسجيل الدخول اختياري.",
  "Who needs help or owns this request.": "من يحتاج المساعدة أو يملك هذا الطلب.",
  "Assigned IT staff": "موظف تقنية المعلومات المسند",
  "Related asset": "الأصل المرتبط",
  "Ticket number": "رقم التذكرة",
  "Internal notes": "ملاحظات داخلية",
  "Visible to IT only.": "مرئي لتقنية المعلومات فقط.",
  "Task title": "عنوان المهمة",
  "The person accountable for completion.": "الشخص المسؤول عن الإنجاز.",
  "Due date": "تاريخ الاستحقاق",
  "When this work should be finished.": "الموعد الذي يجب إنهاء هذا العمل فيه.",
  "Related type": "النوع المرتبط",
  "Related record": "السجل المرتبط",
  "Task number": "رقم المهمة",
  "Task type": "نوع المهمة",
  "Progress %": "نسبة التقدم %",
  "Estimated hours": "الساعات المقدرة",
  "Actual hours": "الساعات الفعلية",
  "Asset category": "تصنيف الأصل",
  "Brand": "العلامة التجارية",
  "Must be unique when available.": "يجب أن يكون فريدًا عند توفره.",
  "Where the item or person is primarily based.": "المكان الأساسي للعنصر أو الشخص.",
  "Current holder person": "الشخص الحائز الحالي",
  "Who currently has custody.": "من لديه العهدة حاليًا.",
  "Permanent custodian": "الحائز الدائم",
  "The official custodian for this asset.": "الحائز الرسمي لهذا الأصل.",
  "Asset number": "رقم الأصل",
  "Asset attention": "مستوى الاهتمام بالأصل",
  "Condition": "الحالة الفنية",
  "Current holder type": "نوع الحائز الحالي",
  "Current holder name": "اسم الحائز الحالي",
  "Expected return date": "تاريخ الإرجاع المتوقع",
  "Purchase date": "تاريخ الشراء",
  "Warranty end date": "تاريخ انتهاء الضمان",
  "Purchase cost": "تكلفة الشراء",
  "Current value": "القيمة الحالية",
  "Disposal reason": "سبب التخلص",
  "Disposed to": "جهة التخلص",
  "Disposed to name": "اسم جهة التخلص",
  "Settlement status": "حالة التسوية",
  "Settlement date": "تاريخ التسوية",
  "Disposal notes": "ملاحظات التخلص",
  "Invoice / attachment names": "أسماء الفواتير / المرفقات",
  "Basic Information": "المعلومات الأساسية",
  "Employee no": "الرقم الوظيفي",
  "Business unit": "وحدة العمل",
  "Phone country code": "رمز الهاتف الدولي",
  "Mobile number": "رقم الجوال",
  "Import Excel": "استيراد Excel",
  "Export Excel": "تصدير Excel",
  "Import people from Excel": "استيراد الأشخاص من Excel",
  "Choose a file built on the same template as the export.": "اختر ملفًا مبنيًا على قالب التصدير نفسه.",
  "Apply import": "تنفيذ الاستيراد",
  "Import complete": "اكتمل الاستيراد",
  "Nothing to import": "لا يوجد ما يمكن استيراده",
  "Rows read": "الصفوف المقروءة",
  "Employee number is required": "الرقم الوظيفي مطلوب",
  "Unique. Used to match rows on Excel import.": "فريد. يُستخدم لمطابقة الصفوف عند الاستيراد من Excel.",
  "Export list (CSV)": "تصدير القائمة (CSV)",
  "The workbook has been downloaded.": "تم تنزيل الملف.",
  "Could not export": "تعذّر التصدير",
  "Could not import": "تعذّر الاستيراد",
  "To create": "سيتم إنشاؤها",
  "To update": "سيتم تحديثها",
  "Skipped": "تم تخطيها",
  "Person type": "نوع الشخص",
  "Job title": "المسمى الوظيفي",
  "Choose whether this person needs login access.": "اختر ما إذا كان هذا الشخص يحتاج وصولًا بتسجيل الدخول.",
  "No Login Account": "بدون حساب دخول",
  "Create only the People master record.": "أنشئ سجل الشخص الرئيسي فقط.",
  "Create sign-in access when Save Person is pressed.": "أنشئ وصول تسجيل الدخول عند الضغط على حفظ الشخص.",
  "Temporary Password": "كلمة مرور مؤقتة",
  "Require password change on first login": "طلب تغيير كلمة المرور عند أول تسجيل دخول",
  "Send welcome email": "إرسال بريد ترحيبي",
  "This account will be created when you save.": "سيتم إنشاء هذا الحساب عند الحفظ.",
  "Linked To": "مرتبط بـ",
  "This Person": "هذا الشخص",
  "Save Person": "حفظ الشخص",
  "Select the vendor responsible for this contract.": "اختر المورد المسؤول عن هذا العقد.",
  "End date": "تاريخ الانتهاء",
  "Used for renewal and expiry alerts.": "يُستخدم لتنبيهات التجديد والانتهاء.",
  "Renewal reminder": "تذكير التجديد",
  "Renewal reminder date": "تاريخ تذكير التجديد",
  "Cost": "التكلفة",
  "Vendor name": "اسم المورد",
  "Contact person": "شخص الاتصال",
  "Use a valid work email address.": "استخدم بريدًا إلكترونيًا مؤسسيًا صالحًا.",
  "Service types": "أنواع الخدمات",
  "Select the document or form type.": "اختر نوع المستند أو النموذج.",
  "Linked type": "النوع المرتبط",
  "Linked record": "السجل المرتبط",
  "Signed document file": "ملف المستند الموقّع",
  "Write the article content here...": "اكتب محتوى المقال هنا...",
  "Write the article content employees or IT will read.": "اكتب محتوى المقال الذي سيقرأه الموظفون أو تقنية المعلومات.",
  "Fields": "الحقول",
  "List the fields this template should include.": "اذكر الحقول التي يجب أن يتضمنها هذا القالب."
});

/* Employee request wizard: steps, subcategories and service-request options */
Object.assign(uiTextAr, {
  "Choose Subcategory": "اختر التصنيف الفرعي",
  "More Information": "معلومات إضافية",
  "(Optional)": "(اختياري)",
  "Subject": "الموضوع",
  "Write a short title for your question or request.": "اكتب عنوانًا قصيرًا لسؤالك أو طلبك.",
  "How do I connect to the meeting room screen?": "كيف أتصل بشاشة قاعة الاجتماعات؟",
  "Tell IT what happened, what you expected, and anything you already tried.": "أخبر تقنية المعلومات بما حدث، وما كنت تتوقعه، وما جربته بالفعل.",
  "Suggested articles": "مقالات مقترحة",
  "These may solve the issue before a ticket is needed.": "قد تحل هذه المقالات المشكلة قبل الحاجة إلى تذكرة.",
  "Attachment": "مرفق",
  "Item name": "اسم العنصر",
  "Quantity": "الكمية",
  "+ Add Another Item": "+ إضافة عنصر آخر",

  // Accounts & Access
  "Password Reset": "إعادة تعيين كلمة المرور",
  "Account Locked": "الحساب مقفل",
  "MFA Issue": "مشكلة في التحقق الثنائي",
  "Email Access": "الوصول للبريد الإلكتروني",
  "Shared Folder Access": "الوصول لمجلد مشترك",

  // Hardware & Devices
  "Mobile Device": "جهاز محمول",
  "Keyboard / Mouse": "لوحة مفاتيح / فأرة",
  "Docking Station": "قاعدة توصيل",
  "Headset": "سماعة رأس",
  "Other Device": "جهاز آخر",

  // Software & Applications
  "Teams": "تيمز",
  "Office": "أوفيس",
  "Browser": "المتصفح",
  "PDF Software": "برنامج PDF",
  "Other Application": "تطبيق آخر",

  // Network & Connectivity
  "Shared Folder": "مجلد مشترك",
  "Network Drive": "محرك شبكة",
  "Other Network Issue": "مشكلة شبكة أخرى",

  // Service Requests
  "New Laptop": "حاسب محمول جديد",
  "New Software": "برنامج جديد",
  "Software Installation": "تثبيت برنامج",
  "Access Request": "طلب صلاحية",
  "License Request": "طلب ترخيص",
  "Equipment Request": "طلب معدات",
  "Other Request": "طلب آخر",
  "Other": "أخرى",

  // Service request pickers
  "Equipment requested": "المعدات المطلوبة",
  "Select everything you need. IT will receive one request.": "اختر كل ما تحتاجه. ستصل تقنية المعلومات طلب واحد.",
  "Licenses requested": "التراخيص المطلوبة",
  "Select every license you need in this request.": "اختر كل ترخيص تحتاجه في هذا الطلب.",
  "License name": "اسم الترخيص",
  "Software to install": "البرامج المطلوب تثبيتها",
  "Select all programs you need installed.": "اختر كل البرامج التي تحتاج تثبيتها.",
  "Software name": "اسم البرنامج",
  "Software requested": "البرامج المطلوبة",
  "Access requested": "الصلاحيات المطلوبة",
  "Select all systems or access types you need.": "اختر كل الأنظمة أو أنواع الصلاحيات التي تحتاجها.",
  "Access name": "اسم الصلاحية",
  "Request items": "عناصر الطلب",
  "Add each item or service you need in this request.": "أضف كل عنصر أو خدمة تحتاجها في هذا الطلب.",
  "Request item": "عنصر الطلب",
  "Requested items": "العناصر المطلوبة",

  // Selectable items
  "Keyboard": "لوحة مفاتيح",
  "Mouse": "فأرة",
  "USB Drive": "ذاكرة USB",
  "HDMI Cable": "كابل HDMI",
  "Ethernet Cable": "كابل شبكة",
  "Webcam": "كاميرا ويب",
  "Other Item": "عنصر آخر",
  "Microsoft Project": "مايكروسوفت بروجكت",
  "Visio": "فيزيو",
  "Adobe Acrobat": "أدوبي أكروبات",
  "AutoCAD": "أوتوكاد",
  "Other License": "ترخيص آخر",
  "Chrome": "كروم",
  "Adobe Reader": "أدوبي ريدر",
  "Zoom": "زووم",
  "Other Software": "برنامج آخر",
  "Email Group": "مجموعة بريدية",
  "Other Access": "صلاحية أخرى",
  "+ Add Another {item}": "+ إضافة {item} آخر",
  "Item": "عنصر",
  "License": "ترخيص",
  "Access": "صلاحية",
  "Drop a file here or browse": "أفلت ملفًا هنا أو تصفح",
  "PDF, image, Word, or Excel file": "ملف PDF أو صورة أو Word أو Excel"
});

// Ticket assignment routing and "open on behalf of".
Object.assign(uiTextAr, {
  "Who is this request for?": "لمن هذا الطلب؟",
  "Open the ticket on behalf of the employee who needs help.": "افتح التذكرة نيابةً عن الموظف الذي يحتاج المساعدة.",
  "Search employees": "ابحث عن موظف",
  "Open a ticket": "فتح تذكرة",
  "On behalf": "نيابةً عن",
  "Opened by IT on behalf of the requester": "فتحها فريق تقنية المعلومات نيابةً عن مقدم الطلب",
  "{requester} (opened by {author})": "{requester} (فتحها {author})",
  "This ticket will be created on behalf of {name}, who will be notified and able to follow it.": "سيتم إنشاء هذه التذكرة نيابةً عن {name}، وسيتم إشعاره وسيتمكن من متابعتها.",
  "A ticket was opened for you": "تم فتح تذكرة لك",
  "Auto assignment routing": "التوجيه التلقائي للإسناد",
  "Automatically route new employee tickets to the right IT user based on category, workload, or fallback rules.": "توجيه تذاكر الموظفين الجديدة تلقائيًا إلى الشخص المناسب في تقنية المعلومات حسب التصنيف أو حجم العمل أو قواعد الاحتياط.",
  "Enable Auto Assignment": "تشغيل الإسناد التلقائي",
  "Assignment Strategy": "استراتيجية الإسناد",
  "Fallback Assignee": "المسؤول الاحتياطي",
  "Used when no category rule or active IT Staff match is available.": "يُستخدم عند عدم وجود قاعدة تصنيف أو موظف تقنية معلومات نشط مطابق.",
  "Category Assignment Rules": "قواعد إسناد التصنيفات",
  "Set an owner per main category, then override individual subcategories only where they differ. Subcategories left on \"Inherit\" follow their main category.": "حدد مسؤولًا لكل تصنيف رئيسي، ثم استثنِ التصنيفات الفرعية التي تختلف فقط. التصنيفات الفرعية المتروكة على \"موروث\" تتبع تصنيفها الرئيسي.",
  "Use fallback": "استخدام الاحتياطي",
  "Specific user": "مستخدم محدد",
  "Assignment group": "مجموعة إسناد",
  "Inherit — {owner}": "موروث — {owner}",
  "Inherit — use fallback": "موروث — استخدام الاحتياطي",
  "Manual Only": "يدوي فقط",
  "By Category": "حسب التصنيف",
  "Least Open Tickets": "الأقل تذاكر مفتوحة",
  "Round Robin": "بالتناوب",
  "Save Ticket Assignment": "حفظ إسناد التذاكر",
  "Reset to Manual Only": "إعادة التعيين إلى يدوي فقط",
  "Auto-assigned": "مُسند تلقائيًا",
  "{n} subcategory": "تصنيف فرعي واحد",
  "{n} subcategories": "{n} تصنيفات فرعية",
  "{n} override": "استثناء واحد",
  "{n} overrides": "{n} استثناءات",
  "No subcategories yet. Add them in Lookup Management.": "لا توجد تصنيفات فرعية بعد. أضفها من إدارة القوائم.",
  "{routed} of {total} main categories routed": "تم توجيه {routed} من {total} تصنيفات رئيسية",
  "{n} subcategory override": "استثناء واحد لتصنيف فرعي",
  "{n} subcategory overrides": "{n} استثناءات لتصنيفات فرعية",
  "Auto assignment is off": "الإسناد التلقائي متوقف",
  "No rules yet — every ticket uses the fallback": "لا توجد قواعد بعد — كل تذكرة تستخدم الاحتياطي",
  "Parent value": "القيمة الرئيسية",
  "Nest this value under a main category. Ticket categories use this to build the routing tree.": "أدرج هذه القيمة تحت تصنيف رئيسي. تستخدم تصنيفات التذاكر ذلك لبناء شجرة التوجيه.",
  "None (this is a main value)": "بدون (هذه قيمة رئيسية)",
  "Unsaved changes": "تغييرات غير محفوظة",
  "Saving...": "جارٍ الحفظ...",
  "Saved": "تم الحفظ",
  "Not saved": "لم يتم الحفظ",
  "No results found": "لا توجد نتائج",
  "Mail is not set up yet, so here is your code:": "لم يتم إعداد البريد بعد، لذا هذا هو رمزك:",
  "No code? Check the address is the one your workplace has on file, or ask IT to confirm you are registered.": "لم يصلك رمز؟ تأكد أن البريد هو المسجّل لدى جهة عملك، أو راجع تقنية المعلومات للتأكد من تسجيلك.",
  "Overview": "نظرة عامة",
  "What needs attention": "ما يحتاج إلى انتباه",
  "Service Desk": "مكتب الخدمة",
  "Run the work": "إدارة العمل",
  "People & Assets": "الموظفون والأصول",
  "Who and what": "الأشخاص والعُهد",
  "Knowledge & Records": "المعرفة والسجلات",
  "Reference material": "مواد مرجعية",
  "Suppliers": "الموردون",
  "Contracts & vendors": "العقود والموردون",
  "Access & setup": "الصلاحيات والإعداد",
  "My Workspace": "مساحة عملي",
  "Requests & tasks": "الطلبات والمهام",
  "My Resources": "مواردي",
  "Assets & guides": "العُهد والأدلة",
  "Try a different keyword or clear filters.": "جرّب كلمة أخرى أو امسح عوامل التصفية.",
  "Clear filters": "مسح عوامل التصفية"
});

function trText(value) {
  const text = String(value ?? "");
  if (state.lang !== "ar") return text;
  const normalized = text.replace(/\s+/g, " ").trim();
  if (!normalized) return text;
  if (state.lang === "ar") {
    const daysRemaining = normalized.match(/^(\d+)\s+days?\s+remaining$/i);
    if (daysRemaining) return `${text.match(/^\s*/)?.[0] || ""}${daysRemaining[1]} يومًا متبقيًا${text.match(/\s*$/)?.[0] || ""}`;
    const hoursAgo = normalized.match(/^(\d+)\s+hours?\s+ago$/i);
    if (hoursAgo) return `${text.match(/^\s*/)?.[0] || ""}منذ ${hoursAgo[1]} ساعة${text.match(/\s*$/)?.[0] || ""}`;
    const minutesAgo = normalized.match(/^(\d+)\s+minutes?\s+ago$/i);
    if (minutesAgo) return `${text.match(/^\s*/)?.[0] || ""}منذ ${minutesAgo[1]} دقيقة${text.match(/\s*$/)?.[0] || ""}`;
    const groupedComments = normalized.match(/^(\d+)\s+new comments on\s+(.+)$/i);
    if (groupedComments) return `${text.match(/^\s*/)?.[0] || ""}${groupedComments[1]} \u062a\u0639\u0644\u064a\u0642\u0627\u062a \u062c\u062f\u064a\u062f\u0629 \u0639\u0644\u0649 ${groupedComments[2]}${text.match(/\s*$/)?.[0] || ""}`;
    const groupedTickets = normalized.match(/^(\d+)\s+new tickets waiting review$/i);
    if (groupedTickets) return `${text.match(/^\s*/)?.[0] || ""}${groupedTickets[1]} \u062a\u0630\u0627\u0643\u0631 \u062c\u062f\u064a\u062f\u0629 \u0628\u0627\u0646\u062a\u0638\u0627\u0631 \u0627\u0644\u0645\u0631\u0627\u062c\u0639\u0629${text.match(/\s*$/)?.[0] || ""}`;
    const duplicateEmployeeNo = normalized.match(/^Employee number (.+) already exists$/i);
    if (duplicateEmployeeNo) return `الرقم الوظيفي ${duplicateEmployeeNo[1]} مستخدم بالفعل`;
    const statusChanged = normalized.match(/^Status changed to (.+)\.$/i);
    if (statusChanged) return `${text.match(/^\s*/)?.[0] || ""}\u062a\u0645 \u062a\u063a\u064a\u064a\u0631 \u0627\u0644\u062d\u0627\u0644\u0629 \u0625\u0644\u0649 ${trText(statusChanged[1])}.${text.match(/\s*$/)?.[0] || ""}`;
    const taskMoved = normalized.match(/^Task updated and moved to (.+)\.$/i);
    if (taskMoved) return `${text.match(/^\s*/)?.[0] || ""}\u062a\u0645 \u062a\u062d\u062f\u064a\u062b \u0627\u0644\u0645\u0647\u0645\u0629 \u0648\u0646\u0642\u0644\u0647\u0627 \u0625\u0644\u0649 ${trText(taskMoved[1])}.${text.match(/\s*$/)?.[0] || ""}`;
  }
  const translated = uiTextAr[normalized] || uiTextAr[labelizeRaw(normalized)] || uiTextAr[Object.keys(uiTextAr).find((key) => key.toLowerCase() === normalized.toLowerCase())];
  if (!translated) {
    // Summary lines are assembled by joining parts with " | ". The joined string
    // is never in the dictionary, so translate each segment on its own.
    for (const separator of [" | ", " / "]) {
      if (!normalized.includes(separator)) continue;
      const parts = normalized.split(separator);
      const mapped = parts.map((part) => trText(part));
      if (mapped.some((part, index) => part !== parts[index])) return mapped.join(separator);
    }
    return text;
  }
  const leading = text.match(/^\s*/)?.[0] || "";
  const trailing = text.match(/\s*$/)?.[0] || "";
  return `${leading}${translated}${trailing}`;
}

function labelizeRaw(value) {
  return String(value ?? "").replace(/_/g, " ").replace(/([A-Z])/g, " $1").replace(/^./, (char) => char.toUpperCase());
}

// Builds a string from a translatable template so word order can differ per
// language. Concatenating a translated fragment onto an English one leaves
// half-translated text like "Open الأصول" or "14 matching".
function tpl(template, vars = {}) {
  let out = trText(template);
  for (const [key, value] of Object.entries(vars)) {
    out = out.split(`{${key}}`).join(String(value ?? ""));
  }
  return out;
}

// Renders any stored date in the active locale instead of leaking an ISO string.
function displayDate(value, withTime = false) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  const locale = state.lang === "ar" ? "ar" : "en";
  return withTime ? date.toLocaleString(locale) : date.toLocaleDateString(locale);
}

// Field labels sit in a CSS grid, so a bare text node plus a separate
// required-marker span landed on two different rows. Wrap them as one item.
function fieldLabel(label, required) {
  return `<span class="field-label-text">${label ?? ""}${required || ""}</span>`;
}

function localizeRenderedUi(root = document.body) {
  if (state.lang !== "ar" || !root) return;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement;
      if (!parent) return NodeFilter.FILTER_REJECT;
      if (["SCRIPT", "STYLE", "TEXTAREA", "CODE", "PRE"].includes(parent.tagName)) return NodeFilter.FILTER_REJECT;
      if (parent.closest("[data-no-localize], .record-title, .user-name, .profile-avatar")) return NodeFilter.FILTER_REJECT;
      const value = node.nodeValue.replace(/\s+/g, " ").trim();
      if (uiTextAr[value]) return NodeFilter.FILTER_ACCEPT;
      if ([" | ", " / "].some((sep) => value.includes(sep) && value.split(sep).some((part) => uiTextAr[part]))) return NodeFilter.FILTER_ACCEPT;
      return NodeFilter.FILTER_REJECT;
    }
  });
  const textNodes = [];
  while (walker.nextNode()) textNodes.push(walker.currentNode);
  textNodes.forEach((node) => { node.nodeValue = trText(node.nodeValue); });
  $$("input[placeholder], textarea[placeholder]", root).forEach((field) => { field.placeholder = trText(field.placeholder); });
  $$("[title], [aria-label]", root).forEach((node) => {
    if (node.title) node.title = trText(node.title);
    const aria = node.getAttribute("aria-label");
    if (aria) node.setAttribute("aria-label", trText(aria));
  });
  $$(".eyebrow, .command-lane-head strong, .ticket-overview-label", root).forEach((node) => {
    node.textContent = trText(node.textContent);
  });
}

// Modals, menus and dialogs are injected into their hosts long after render(),
// and only some of the code paths that open them called localizeRenderedUi.
// Watching the hosts localizes every overlay regardless of who opened it.
let localizingOverlay = false;
function watchOverlayLocalization() {
  const observer = new MutationObserver((records) => {
    if (localizingOverlay || state.lang !== "ar") return;
    const content = $("#content");
    // Some labels are filled with `el.textContent = "..."`, which adds a text
    // node rather than an element, so localize the parent in that case.
    const added = records
      .flatMap((record) => [...record.addedNodes])
      .map((node) => (node.nodeType === 3 ? node.parentElement : node))
      .filter((node) => node && node.nodeType === 1 && !(content && content.contains(node)));
    if (!added.length) return;
    localizingOverlay = true;
    try {
      added.forEach((node) => localizeRenderedUi(node));
    } finally {
      localizingOverlay = false;
    }
  });
  // Menus render into their hosts, but openModal() appends the backdrop
  // straight to <body>. Watching the whole body subtree also covers content
  // injected into an overlay that is already open — the request wizard swaps
  // in its subcategory cards without reopening the modal. #content is skipped
  // because render() localizes it directly.
  observer.observe(document.body, { childList: true, subtree: true });
}

const modules = ["dashboard", "employee_portal", "users", "roles", "employees", "assets", "transfers", "tickets", "tasks", "contracts", "vendors", "documents", "attachments", "comments", "notifications", "knowledge_base", "archive_center", "trash", "form_templates", "audit_logs", "timeline", "settings", "lookup_items"];
const perms = ["view", "create", "edit", "archive", "approve", "export", "admin"];
const boardModules = new Set(["tickets", "tasks"]);
const feedModules = new Set(["timeline", "audit_logs", "transfers"]);
const cardModules = new Set(["employees", "assets", "contracts", "vendors", "documents", "knowledge_base", "form_templates"]);
const workspaceModules = new Set(["assets", "contracts", "vendors", "documents", "knowledge_base", "form_templates"]);
const templates = ["Asset assignment form", "Asset return form", "Asset handover form", "Device usage agreement", "Access request form", "VPN request form", "Maintenance report", "Lost or damaged asset declaration"];

const adminStructureModules = ["users", "roles", "settings", "audit_logs", "archive_center", "trash", "lookup_items", "form_templates", "attachments"];
const assetContextModules = ["transfers"];
// TODO Product Owner: Vendors remain first-level temporarily until the final Contracts/Vendors navigation decision is approved.
// Grouped by the job being done rather than one flat list, so the sidebar reads as
// a short set of areas instead of nine unrelated destinations.
const navGroups = [
  { id: "overview", label: "Overview", items: ["dashboard"] },
  { id: "service_desk", label: "Service Desk", items: ["tickets", "tasks"] },
  { id: "people_assets", label: "People & Assets", items: ["employees", "assets"] },
  { id: "knowledge", label: "Knowledge & Records", items: ["knowledge_base", "documents"] },
  { id: "suppliers", label: "Suppliers", items: ["contracts", "vendors"] },
  { id: "admin", label: "Administration", items: ["settings"] }
];

const navGroupMeta = {
  overview: { label: "Overview", helper: "What needs attention" },
  service_desk: { label: "Service Desk", helper: "Run the work" },
  people_assets: { label: "People & Assets", helper: "Who and what" },
  knowledge: { label: "Knowledge & Records", helper: "Reference material" },
  suppliers: { label: "Suppliers", helper: "Contracts & vendors" },
  admin: { label: "Administration", helper: "Access & setup" },
  employee: { label: "My Workspace", helper: "Requests & tasks" },
  employee_resources: { label: "My Resources", helper: "Assets & guides" }
};

const employeeNavGroups = [
  { id: "employee", label: "My Workspace", items: ["employee_portal", "tickets", "tasks"] },
  { id: "employee_resources", label: "My Resources", items: ["assets", "documents", "knowledge_base"] }
];

// Ticket categories live in db.lookupItems as a two-level tree: parent rows have
// parentCode === "", child rows carry their parent's code. Admins manage them from
// Settings > Lookup Management without a code change.
function ticketCategoryItems(includeInactive = false) {
  return (state.db.lookupItems || [])
    .filter((item) => item.type === "ticket_category" && (includeInactive || item.active !== false) && !item.archivedAt && !item.deletedAt)
    .sort((a, b) => Number(a.sortOrder || 0) - Number(b.sortOrder || 0) || String(a.nameEn).localeCompare(String(b.nameEn)));
}

function ticketCategoryParents() {
  return ticketCategoryItems().filter((item) => !item.parentCode);
}

function ticketCategoryChildren(parentCode) {
  return parentCode ? ticketCategoryItems().filter((item) => item.parentCode === parentCode) : [];
}

function ticketCategoryByCode(code, includeInactive = true) {
  return code ? ticketCategoryItems(includeInactive).find((item) => item.code === String(code)) || null : null;
}

function ticketCategoryParentByName(name) {
  const wanted = String(name || "").trim().toLowerCase();
  return ticketCategoryParents().find((item) => [item.nameEn, item.nameAr].some((label) => String(label || "").trim().toLowerCase() === wanted)) || null;
}

function ticketCategoryLabel(code) {
  const item = ticketCategoryByCode(code);
  if (!item) return "";
  const parent = item.parentCode ? ticketCategoryByCode(item.parentCode) : null;
  return parent ? `${lookupLabel(parent)} / ${lookupLabel(item)}` : lookupLabel(item);
}

// Keyed by ticket_category parent code, with the pre-migration display names kept
// as aliases so custom or renamed categories still resolve an icon.
const employeeTicketCategoryIcons = {
  accounts_access: "key_round",
  hardware_devices: "laptop",
  software_applications: "app_window",
  network_connectivity: "network",
  service_requests: "wrench",
  general_questions: "circle_help",
  "Accounts & Access": "key_round",
  "Hardware & Devices": "laptop",
  "Software & Applications": "app_window",
  "Network & Connectivity": "network",
  "Service Requests": "wrench",
  "General Questions": "circle_help"
};

// Keyed by ticket_category child code.
const employeeServiceRequestOptions = {
  service_requests_equipment_request: { title: "Equipment requested", helper: "Select everything you need. IT will receive one request.", itemLabel: "item", customFieldLabel: "Item name", addLabel: "Item", outputLabel: "Equipment requested", items: ["Laptop", "Monitor", "Keyboard", "Mouse", "USB Drive", "HDMI Cable", "Ethernet Cable", "Docking Station", "Webcam", "Headset", "Other Item"] },
  service_requests_license_request: { title: "Licenses requested", helper: "Select every license you need in this request.", itemLabel: "license", customFieldLabel: "License name", addLabel: "License", outputLabel: "Licenses requested", items: ["Microsoft Project", "Visio", "Adobe Acrobat", "AutoCAD", "Other License"] },
  service_requests_software_installation: { title: "Software to install", helper: "Select all programs you need installed.", itemLabel: "software name", customFieldLabel: "Software name", addLabel: "Software", outputLabel: "Software requested", items: ["Teams", "Chrome", "Adobe Reader", "Zoom", "Other Software"] },
  service_requests_access_request: { title: "Access requested", helper: "Select all systems or access types you need.", itemLabel: "access type", customFieldLabel: "Access name", addLabel: "Access", outputLabel: "Access requested", items: ["Shared Folder", "VPN", "ERP", "Email Group", "Other Access"] },
  service_requests_other_request: { title: "Request items", helper: "Add each item or service you need in this request.", itemLabel: "request item", customFieldLabel: "Request item", addLabel: "Item", outputLabel: "Requested items", items: [], alwaysCustom: true }
};

const employeeTaskBuiltInCategories = ["Work", "Personal", "Learning", "Finance", "Health"];

const dashboardWidgetCatalog = [
  ["health", "Health Score"],
  ["primaryKpis", "Primary KPIs"],
  ["secondaryKpis", "Secondary KPIs"],
  ["workQueue", "Work Queue"],
  ["signals", "Priority Signals"],
  ["activity", "Activity Feed"],
  ["focus", "Focus"],
  ["assetOwnership", "Asset Ownership"],
  ["charts", "Operational Health Charts"]
];
const dashboardDefaultOrder = dashboardWidgetCatalog.map(([id]) => id);

const iconPaths = {
  dashboard: '<path d="M3 13h8V3H3v10Z"/><path d="M13 21h8V11h-8v10Z"/><path d="M13 3h8v6h-8V3Z"/><path d="M3 21h8v-6H3v6Z"/>',
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  roles: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/>',
  employees: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  assets: '<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/>',
  transfers: '<path d="M7 7h11l-4-4"/><path d="M17 17H6l4 4"/><path d="M18 7v10"/><path d="M6 7v10"/>',
  tickets: '<path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M13 5v2"/><path d="M13 17v2"/><path d="M13 11v2"/>',
  tasks: '<path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>',
  contracts: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/>',
  vendors: '<path d="M3 21h18"/><path d="M5 21V7l8-4v18"/><path d="M19 21V11l-6-4"/><path d="M9 9h1"/><path d="M9 13h1"/><path d="M9 17h1"/>',
  documents: '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/>',
  audit_logs: '<path d="M12 3a9 9 0 1 0 9 9"/><path d="M12 7v5l3 3"/><path d="M19 3v5h-5"/>',
  timeline: '<path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>',
  settings: '<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.09a2 2 0 0 1-1-1.74v-.51a2 2 0 0 1 1-1.72l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2Z"/><circle cx="12" cy="12" r="3"/>',
  search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 7 3 7H3s3 0 3-7"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
  moon: '<path d="M12 3a6 6 0 0 0 9 7 9 9 0 1 1-9-7Z"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>',
  plus: '<path d="M5 12h14"/><path d="M12 5v14"/>',
  columns: '<path d="M12 3v18"/><rect width="18" height="18" x="3" y="3" rx="2"/>',
  download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M7 10l5 5 5-5"/><path d="M12 15V3"/>',
  filter: '<path d="M22 3H2l8 9.46V19l4 2v-8.54Z"/>',
  more: '<circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>',
  empty: '<path d="M21 15V6"/><path d="M18.5 3.5 21 6l-2.5 2.5"/><path d="M3 15v3a3 3 0 0 0 3 3h12"/><path d="M3 9V6a3 3 0 0 1 3-3h9"/>',
  close: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>'
};

Object.assign(iconPaths, {
  attachments: '<path d="m21.44 11.05-8.49 8.49a6 6 0 0 1-8.49-8.49l8.49-8.49a4 4 0 1 1 5.66 5.66l-8.49 8.49a2 2 0 1 1-2.83-2.83l8.49-8.49"/>',
  "chevron-up": '<path d="m18 15-6-6-6 6"/>',
  "chevron-down": '<path d="m6 9 6 6 6-6"/>',
  preview: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',
  key_round: '<path d="M2 18a6 6 0 1 0 10.62-3.8L22 4.82V2h-2.82l-1.4 1.4V6h-2.6v2.6h-2.6l-2.38 2.38A6 6 0 0 0 2 18Z"/><circle cx="7" cy="18" r="1"/>',
  laptop: '<path d="M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9"/><path d="M2 20h20"/><path d="M6 16h12"/>',
  app_window: '<rect width="18" height="14" x="3" y="5" rx="2"/><path d="M3 9h18"/><path d="M8 5v4"/>',
  package_open: '<path d="M12 22v-9"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="m3.3 17 8.7 5 8.7-5"/><path d="M3.3 7 12 2l8.7 5"/><path d="M3.3 7v10"/>',
  network: '<rect width="6" height="6" x="9" y="2" rx="1"/><rect width="6" height="6" x="16" y="16" rx="1"/><rect width="6" height="6" x="2" y="16" rx="1"/><path d="M12 8v4"/><path d="M5 16v-2a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v2"/>',
  wrench: '<path d="M14.7 6.3a4 4 0 0 0-5 5L3 18v3h3l6.7-6.7a4 4 0 0 0 5-5l-2.4 2.4-2.8-2.8 2.2-2.6Z"/>',
  circle_help: '<circle cx="12" cy="12" r="10"/><path d="M9.1 9a3 3 0 1 1 5.8 1c0 2-3 2-3 4"/><path d="M12 17h.01"/>',
  edit: iconPaths.timeline,
  delete: iconPaths.trash,
  comments: '<path d="M21 15a4 4 0 0 1-4 4H7l-4 4V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4Z"/>',
  notifications: iconPaths.bell,
  knowledge_base: '<path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3Z"/>',
  archive_center: '<rect width="20" height="5" x="2" y="3" rx="1"/><path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"/><path d="M10 12h4"/>',
  trash: '<path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/>',
  form_templates: iconPaths.documents,
  employee_portal: iconPaths.employees
});
iconPaths.delete = iconPaths.trash;

const personTypes = ["Employee", "IT Staff", "IT Manager", "Contractor", "Trainee", "Intern"];
const accountTypes = ["Employee", "Temporary", "Service", "API"];
const assetStatuses = ["available", "reserved", "assigned", "temporary_custody", "in_repair", "pending_return", "lost", "stolen", "retired", "disposed", "archived"];
const assetAttentionLevels = ["normal", "warning", "action_required", "critical"];
const assetHolderTypeValues = ["Person", "IT Storage", "Vendor", "Warehouse", "Other"];
const assetDisposalReasons = ["Sold to Employee", "Scrapped", "Donated", "Recycled", "Other"];
const assetDisposedToTypes = ["Person", "Vendor", "Other"];
const assetSettlementStatuses = ["Not Required", "Pending", "Completed"];

const schemas = {
  users: [["name", "Account name", null, { required: true }], ["username", "Username", null, { required: true }], ["email", "Email", "email"], ["password", "Password", "password", { required: true }], ["roleId", "Role", "roles", { required: true }], ["accountType", "Account type", "account_types", { default: "Service", required: true }], ["status", "Account Status", "lookup:user_status", { default: "active" }], ["expiryDate", "Expiry Date", "date"], ["requirePasswordChange", "Require password change on first login", "checkbox", { default: true }]],
  roles: [["name", "Role name", null, { required: true }], ["description", "Description", "textarea"]],
  employees: [["employeeNo", "Employee no", null, { required: true, help: "Unique. Used to match rows on Excel import." }], ["name", "Name", null, { required: true }], ["personType", "Person type", "person_types", { default: "Employee" }], ["departmentId", "Department", "departments", { required: true }], ["jobTitle", "Job title", "lookup:job_title"], ["location", "Location", "lookup:location"], ["businessUnit", "Business unit", "lookup:business_unit"], ["managerId", "Manager", "employees", { advanced: true }], ["email", "Email", "email", { required: true }], ["phoneCountryCode", "Phone country code", "lookup:phone_country_code", { default: "+966" }], ["phone", "Mobile number"], ["status", "Status", "lookup:employee_status", { default: "active" }]],
  assets: [["assetNumber", "Asset number", null, { advanced: true, placeholder: "Auto-generated when blank" }], ["type", "Asset category", "lookup:asset_category", { required: true }], ["brand", "Brand", "lookup:brand"], ["model", "Model", "lookup:asset_model"], ["serialNumber", "Serial number", null, { required: true }], ["status", "Status", "asset_statuses", { default: "available" }], ["attention", "Asset attention", "asset_attention", { default: "normal" }], ["condition", "Condition", "lookup:asset_condition", { default: "good" }], ["location", "Location", "lookup:location"], ["departmentId", "Department", "departments"], ["permanentCustodianId", "Permanent custodian", "employees"], ["currentHolderType", "Current holder type", "holder_types", { default: "Person" }], ["currentOwnerId", "Current holder person", "employees"], ["currentHolderName", "Current holder name"], ["expectedReturnDate", "Expected return date", "date"], ["supplierId", "Vendor", "vendors"], ["purchaseDate", "Purchase date", "date", { advanced: true }], ["warrantyEndDate", "Warranty end date", "date", { advanced: true }], ["cost", "Purchase cost", "number", { advanced: true }], ["currentValue", "Current value", "number", { advanced: true }], ["disposalReason", "Disposal reason", "disposal_reasons", { advanced: true }], ["disposedToType", "Disposed to", "disposed_to_types", { advanced: true }], ["disposedToName", "Disposed to name", null, { advanced: true }], ["settlementStatus", "Settlement status", "settlement_statuses", { advanced: true }], ["settlementDate", "Settlement date", "date", { advanced: true }], ["disposalNotes", "Disposal notes", "textarea", { advanced: true }], ["attachmentsText", "Invoice / attachment names", "textarea", { advanced: true }], ["notes", "Notes", "textarea", { advanced: true }]],
  transfers: [["movementType", "Action", "lookup:transfer_action", { required: true }], ["assetId", "Asset", "assets", { required: true }], ["fromEmployeeId", "From employee", "employees"], ["fromLocation", "From location", "lookup:location"], ["toEmployeeId", "To employee", "employees"], ["toLocation", "To location", "lookup:location"], ["date", "Date", "date", { default: () => today() }], ["performedBy", "Performed by", "users", { default: () => state.user?.id }], ["condition", "Asset condition", "lookup:asset_condition"], ["notes", "Notes", "textarea"], ["attachmentsText", "Attachment names", "textarea", { advanced: true }], ["relatedDocumentId", "Related document", "documents", { advanced: true }]],
  tickets: [["ticketNumber", "Ticket number", null, { advanced: true, placeholder: "Auto-generated when blank" }], ["requesterId", "Requester", "employees", { required: true }], ["subcategoryCode", "Category", "ticket_category_tree", { required: true }], ["priority", "Priority", "lookup:ticket_priority", { default: "medium", required: true }], ["status", "Status", "lookup:ticket_status", { default: "open" }], ["assignedToId", "Assigned IT staff", "it_users"], ["relatedAssetId", "Related asset", "assets"], ["approvalStatus", "Approval status", "lookup:approval_status", { advanced: true, default: "Draft" }], ["description", "Description", "textarea", { required: true }], ["waitingReason", "Waiting reason", "lookup:ticket_waiting_reason", { advanced: true, itOnly: true }], ["cancelReason", "Cancel reason", "lookup:ticket_cancel_reason", { advanced: true, itOnly: true }], ["internalNotes", "Internal notes", "textarea", { advanced: true, itOnly: true }], ["attachmentsText", "Attachment names", "textarea", { advanced: true }]],
  tasks: [["title", "Task title", null, { required: true }], ["taskNumber", "Task number", null, { advanced: true, placeholder: "Auto-generated when blank" }], ["taskType", "Task type", "lookup:task_type", { default: "Personal" }], ["ownerId", "Owner", "users", { required: true, default: () => state.user?.id }], ["assignedToId", "Assigned To", "users"], ["departmentId", "Department", "departments"], ["priority", "Priority", "lookup:task_priority", { default: "medium", required: true }], ["status", "Status", "lookup:task_status", { advanced: true, default: "pending" }], ["startDate", "Start date", "date"], ["dueDate", "Due date", "date", { required: true }], ["progress", "Progress %", "number"], ["estimatedHours", "Estimated hours", "number"], ["actualHours", "Actual hours", "number"], ["recurrence", "Recurrence", "lookup:task_recurrence", { default: "One Time" }], ["reminder", "Reminder", "lookup:task_reminder", { default: "None" }], ["description", "Description", "textarea", { advanced: true }], ["notes", "Notes", "textarea", { advanced: true }], ["approvalStatus", "Approval status", "lookup:approval_status", { advanced: true, default: "Draft" }], ["relatedType", "Related type", "lookup:linked_type", { advanced: true }], ["relatedId", "Related record", "linked_record:relatedType", { advanced: true }]],
  contracts: [["name", "Name", null, { required: true }], ["type", "Type", "lookup:contract_type", { required: true }], ["vendorId", "Vendor", "vendors", { required: true }], ["startDate", "Start date", "date"], ["endDate", "End date", "date", { required: true }], ["status", "Status", "lookup:contract_status", { default: "active" }], ["renewalReminderPeriod", "Renewal reminder", "lookup:renewal_reminder_period"], ["renewalReminderDate", "Renewal reminder date", "date", { advanced: true }], ["cost", "Cost", "number", { advanced: true }], ["attachmentsText", "Attachment names", "textarea", { advanced: true }], ["notes", "Notes", "textarea", { advanced: true }]],
  vendors: [["name", "Vendor name", null, { required: true }], ["contactPerson", "Contact person"], ["phone", "Phone"], ["email", "Email", "email"], ["servicesText", "Service types", "lookup_multi:vendor_service_type"], ["status", "Status", "lookup:vendor_status", { default: "active" }], ["rating", "Rating", "lookup:vendor_rating"], ["notes", "Notes", "textarea", { advanced: true }]],
  documents: [["title", "Title", null, { required: true }], ["templateType", "Template", "templates", { required: true }], ["linkedType", "Linked type", "lookup:linked_type"], ["linkedId", "Linked record", "linked_record:linkedType"], ["approvalStatus", "Approval status", "lookup:approval_status", { default: "Draft" }], ["status", "Status", "lookup:document_type", { default: "draft" }], ["signedFileName", "Signed document file", null, { advanced: true }], ["notes", "Notes", "textarea", { advanced: true }]],
  knowledge_base: [["category", "Category", "lookup:kb_category", { required: true }], ["title", "Title", null, { required: true }], ["body", "Article", "textarea", { required: true }], ["tagsText", "Tags", "textarea"], ["published", "Status", "lookup:kb_status", { default: "Draft" }]],
  form_templates: [["name", "Name", null, { required: true }], ["approvalStatus", "Approval status", "lookup:approval_status", { default: "Draft" }], ["fieldsText", "Fields", "textarea"]],
  lookup_items: [["type", "Lookup list", "lookup_types", { required: true }], ["nameEn", "Name English", null, { required: true }], ["nameAr", "Name Arabic"], ["code", "Code", null, { required: true }], ["parentCode", "Parent value", "lookup_parent_codes", { help: "Nest this value under a main category. Ticket categories use this to build the routing tree." }], ["module", "Related module", "modules"], ["color", "Color", "color"], ["icon", "Icon", null, { advanced: true }], ["sortOrder", "Sort order", "number"], ["active", "Active", "checkbox", { default: true }]]
};

const columns = {
  users: ["name", "username", "email", "role", "accountType", "status"],
  roles: ["name", "description", "isSystem"],
  employees: ["name", "department", "jobTitle", "email", "status"],
  assets: ["assetNumber", "type", "model", "status", "owner", "warrantyEndDate"],
  transfers: ["asset", "movementType", "from", "to", "date", "condition"],
  tickets: ["ticketNumber", "requester", "assignedTo", "priority", "status", "description"],
  tasks: ["title", "owner", "dueDate", "status", "priority", "related"],
  contracts: ["name", "vendor", "endDate", "cost", "status"],
  vendors: ["name", "contactPerson", "services", "rating"],
  documents: ["title", "templateType", "approvalStatus", "status", "linked"],
  attachments: ["filename", "entityType", "entityId", "uploader", "uploadedAt", "size"],
  notifications: ["title", "type", "entityType", "createdAt", "unread"],
  knowledge_base: ["title", "category", "published", "tags"],
  form_templates: ["name", "approvalStatus", "fields"]
};

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const t = (key) => labels[state.lang][key] || trText(key);
const icon = (name, cls = "") => `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${iconPaths[name] || iconPaths.more}</svg>`;

function displayLabel(key) {
  if (isEmployeeUser()) {
    if (key === "employee_portal") return trText("Dashboard");
    if (key === "tickets") return trText("Requests / Tickets");
    if (key === "assets") return trText("My Assets");
    if (key === "tasks") return trText("My Tasks");
    if (key === "archived_tasks") return trText("Archived Tasks");
    if (key === "documents") return trText("Company Documents");
  }
  if (key === "profile") return trText("My Profile");
  if (key === "preferences") return trText("Preferences");
  if (key === "notification_preferences") return trText("Notifications");
  return t(key);
}

function singularDisplayLabel(key) {
  return trText({
    employees: "Person",
    users: "User Account",
    assets: "Asset",
    contracts: "Contract",
    vendors: "Vendor",
    documents: "Document",
    knowledge_base: "Article",
    form_templates: "Template",
    lookup_items: "Lookup value"
  }[key] || labelize(singular(key)));
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
}

function look(type, idValue) {
  if (!idValue) return "";
  return state.db.lookups?.[type]?.[idValue] || idValue;
}

function rows(name) {
  const key = name === "audit_logs" ? "auditLogs" : name;
  if (name === "archive_center") return state.db.archiveCenter || [];
  if (name === "trash") return state.db.trashBin || [];
  if (name === "knowledge_base") return (state.db.knowledgeBase || []).filter((row) => !row.archivedAt);
  if (name === "form_templates") return (state.db.formTemplates || []).filter((row) => !row.archivedAt);
  if (name === "lookup_items") return (state.db.lookupItems || []).filter((row) => row.type !== "department" && !row.archivedAt && !row.deletedAt);
  return (state.db[key] || []).filter((row) => !row.archivedAt && !row.deletedAt);
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function fieldDefault(options = {}) {
  return typeof options.default === "function" ? options.default() : options.default;
}

function lookupOptions(type, includeInactive = false) {
  const configured = (state.db.lookupItems || [])
    .filter((item) => item.type !== "department" && item.type === type && (includeInactive || item.active !== false) && !item.archivedAt && !item.deletedAt)
    .sort((a, b) => Number(a.sortOrder || 0) - Number(b.sortOrder || 0) || String(a.nameEn).localeCompare(String(b.nameEn)));
  if (configured.length) return configured;
  const fallback = {
    task_type: ["Personal", "IT Operational", "Project", "Follow-up", "Recurring"],
    task_status: ["pending", "in_progress", "waiting", "completed", "cancelled", "archived"],
    task_priority: ["low", "medium", "high", "critical"],
    task_recurrence: ["One Time", "Daily", "Weekly", "Monthly", "Quarterly", "Yearly", "Custom"],
    task_reminder: ["None", "At due time", "1 day before", "3 days before", "7 days before", "Custom"]
  }[type] || [];
  return fallback.map((name, index) => ({ id: `${type}_${index}`, type, code: name, nameEn: name, sortOrder: index + 1, active: true }));
}

function lookupLabel(item) {
  return state.lang === "ar" ? (item.nameAr || trText(item.nameEn || item.code)) : (item.nameEn || item.nameAr || item.code);
}

function lookupValue(item) {
  return item.code || item.nameEn;
}

function archivedRows() {
  return ["employees", "assets", "tickets", "tasks", "contracts", "vendors", "documents", "knowledge_base", "form_templates"].flatMap((name) => {
    const key = name === "knowledge_base" ? "knowledgeBase" : name === "form_templates" ? "formTemplates" : name;
    return (state.db[key] || []).filter((row) => row.archivedAt).map((row) => ({ ...row, archiveType: name }));
  });
}

function has(module, perm) {
  return Boolean(state.role?.permissions?.[module]?.[perm]);
}

function canViewPage(module) {
  if (["profile", "preferences", "notification_preferences"].includes(module)) return Boolean(state.user);
  if (isEmployeeUser()) return ["employee_portal", "tickets", "assets", "tasks", "archived_tasks", "documents", "knowledge_base"].includes(module);
  return has(module, "view") || module === "dashboard";
}

function navigationAreaFor(module) {
  if (adminStructureModules.includes(module)) return "Settings";
  if (assetContextModules.includes(module)) return "Assets";
  if (["dashboard", "tickets", "tasks", "employees", "assets", "knowledge_base", "documents", "contracts", "vendors"].includes(module)) return "Daily Operations";
  if (["employee_portal", "archived_tasks"].includes(module) || (isEmployeeUser() && ["tickets", "assets", "tasks", "documents", "knowledge_base"].includes(module))) return "Self Service";
  return "";
}

function breadcrumbFor(module, row = null) {
  const area = trText(navigationAreaFor(module));
  const parts = [area, displayLabel(module)].filter(Boolean);
  if (row) parts.push(primaryTitle(module, row));
  return parts.join(" / ");
}

async function api(path, options = {}) {
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
  const response = await fetch(path, { ...options, headers, credentials: "same-origin" });
  const data = await response.json().catch(() => ({}));
  if (response.status === 401 && !path.startsWith("/api/auth/")) {
    handleSessionExpired();
    throw new Error(trText("Your session has ended. Please sign in again."));
  }
  if (!response.ok) throw new Error(trText(data.error || "Request failed"));
  return data;
}

// A session can end while the page is open - expiry, logout elsewhere, or the
// account being disabled. Return to the sign-in screen rather than failing oddly.
function handleSessionExpired() {
  state.user = null;
  state.role = null;
  $("#app")?.classList.add("hidden");
  $("#login")?.classList.remove("hidden");
}

async function loadState() {
  state.db = await api("/api/state");
  if (state.user) {
    // Keep the cached copy in step with the freshly loaded collections.
    state.user = state.db.users.find((user) => user.id === state.user.id) || state.user;
    state.role = state.db.roles.find((role) => role.id === state.user.roleId) || state.role;
  }
}

// Asks the server who we are. The client cannot answer this itself any more.
async function loadSession() {
  try {
    const result = await api("/api/auth/session");
    state.user = result.user;
    state.role = result.role;
    return true;
  } catch (_) {
    state.user = null;
    state.role = null;
    return false;
  }
}

const systemThemeQuery = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;

function resolvedTheme() {
  return state.theme === "system" ? (systemThemeQuery?.matches ? "dark" : "light") : state.theme;
}

function setAppearanceMode(mode, persist = true) {
  state.theme = ["light", "dark", "system"].includes(mode) ? mode : "system";
  if (persist) localStorage.setItem("itcc.theme", state.theme);
  applyPreferences();
}

function uiLabel(english) {
  return state.lang === "ar" ? trText(english) : english;
}

function resetStaticShellLabels() {
  $(".brand strong") && ($(".brand strong").textContent = uiLabel("IT Command Center"));
  $(".brand small") && ($(".brand small").textContent = uiLabel("Operations Suite"));
  $("#sidebarSearch") && ($("#sidebarSearch").placeholder = uiLabel("Jump to module..."));
  $("#sidebarSearch") && $("#sidebarSearch").setAttribute("aria-label", uiLabel("Search modules"));
  $("#globalSearch") && ($("#globalSearch").placeholder = uiLabel("Search tickets, assets, people, vendors..."));
  $$(".header-create").forEach((button) => { button.textContent = uiLabel("+ Create"); });
  const loginCopy = $("#login .login-copy");
  if (loginCopy) {
    $(".eyebrow", loginCopy) && ($(".eyebrow", loginCopy).textContent = uiLabel("IT Operations Management"));
    $("h1", loginCopy) && ($("h1", loginCopy).textContent = uiLabel("IT Command Center"));
    $(".muted", loginCopy) && ($(".muted", loginCopy).textContent = uiLabel("A calm command workspace for assets, tickets, contracts, people, documents, and audit history."));
    const pills = $$(".login-pills span", loginCopy);
    ["Audit-ready", "Bilingual", "Dark mode"].forEach((label, index) => { if (pills[index]) pills[index].textContent = uiLabel(label); });
  }
  const loginForm = $("#loginForm");
  if (loginForm) {
    $("h2", loginForm) && ($("h2", loginForm).textContent = uiLabel("Welcome back"));
    $(".muted", loginForm) && ($(".muted", loginForm).textContent = uiLabel("Sign in to your V1 operations workspace."));
    // Sign-in is a multi-step flow now, so translate whatever each step actually
    // contains instead of overwriting a fixed set of labels.
    $$("label", loginForm).forEach((label) => {
      const first = label.firstChild;
      if (!first || first.nodeType !== Node.TEXT_NODE) return;
      const trimmed = first.nodeValue.trim();
      if (trimmed) first.nodeValue = first.nodeValue.replace(trimmed, uiLabel(trimmed));
    });
    $$("button, .hint", loginForm).forEach((node) => {
      const trimmed = node.textContent.trim();
      if (trimmed) node.textContent = uiLabel(trimmed);
    });
  }
}

function applyPreferences() {
  const theme = resolvedTheme();
  document.documentElement.dataset.appearance = state.theme;
  document.documentElement.dataset.theme = theme;
  document.body.classList.toggle("dark", theme === "dark");
  document.body.classList.toggle("theme-system", state.theme === "system");
  document.body.classList.toggle("rtl", state.lang === "ar");
  document.documentElement.lang = state.lang;
  document.documentElement.dir = state.lang === "ar" ? "rtl" : "ltr";
  document.body.dir = state.lang === "ar" ? "rtl" : "ltr";
  $("#app")?.setAttribute("dir", state.lang === "ar" ? "rtl" : "ltr");
  $("#login")?.setAttribute("dir", state.lang === "ar" ? "rtl" : "ltr");
  resetStaticShellLabels();
  $("#langToggle").textContent = state.lang === "en" ? "العربية" : "English";
  $("#themeToggle").innerHTML = icon(state.theme === "system" ? "settings" : theme === "dark" ? "sun" : "moon");
  const appearanceLabel = tpl("Appearance: {mode}", { mode: trText(state.theme === "system" ? "System" : labelize(state.theme)) });
  $("#themeToggle").title = appearanceLabel;
  $("#themeToggle").setAttribute("aria-label", appearanceLabel);
  const unread = userNotifications().filter((item) => item.unread).length;
  $("#notificationsButton").innerHTML = `${icon("bell")}${unread ? `<span class="counter">${unread}</span>` : ""}`;
  $("#notificationsButton").classList.toggle("has-dot", unread > 0);
  $("#globalSearchIcon").innerHTML = icon("search");
  localizeRenderedUi(document.body);
}

function userNotifications() {
  if (!state.db || !state.user) return [];
  return [...(state.db.notifications || [])].sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || "")));
}

function initials(name) {
  return String(name || "IT").split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase();
}

function renderShell() {
  applyPreferences();
  $("#userName").textContent = state.user.name;
  $("#roleName").textContent = look("roles", state.user.roleId);
  $("#sidebarUserName").textContent = state.user.name;
  $("#sidebarRoleName").textContent = look("roles", state.user.roleId);
  $("#avatar").textContent = initials(state.user.name);
  $("#breadcrumbs").textContent = breadcrumbFor(state.page);
  const groups = isEmployeeUser() ? employeeNavGroups : navGroups;
  const createTargets = ["tickets", "tasks", "assets", "employees", "contracts", "vendors", "documents"].filter((name) => has(name, "create"));
  $$(".header-create").forEach((button) => button.classList.toggle("hidden", !createTargets.length));
  $("#nav").innerHTML = groups.map((group) => {
    const items = group.items.filter((module) => canViewPage(module) || has(module, "view") || module === "dashboard" || (isEmployeeUser() && module === "archived_tasks"));
    if (!items.length) return "";
    const meta = navGroupMeta[group.id] || { label: group.label, helper: "" };
    const isActiveGroup = items.includes(state.page);
    return `
      <section class="nav-section ${isActiveGroup ? "active-group" : ""}">
        <div class="nav-section-toggle">
          <span>${escapeHtml(trText(meta.label || group.label))}</span>
          <small>${escapeHtml(trText(meta.helper || `${items.length} modules`))}</small>
        </div>
        <div class="nav-section-items">
          ${items.map((module) => `<button class="nav-btn ${state.page === module ? "active" : ""}" data-page="${module}"><span class="nav-icon">${icon(module === "archived_tasks" ? "archive_center" : module)}</span><span class="nav-label">${displayLabel(module)}</span></button>`).join("")}
        </div>
      </section>
    `;
  }).join("");
  const navItems = $$(".nav-btn");
  $$(".nav-btn").forEach((button) => button.addEventListener("click", () => {
    setHomeRoute();
    state.detail = null;
    state.page = button.dataset.page;
    state.query = "";
    render();
  }));
  const sidebarSearch = $("#sidebarSearch");
  if (sidebarSearch) {
    sidebarSearch.value = "";
    sidebarSearch.oninput = (event) => {
      const query = event.target.value.trim().toLowerCase();
      navItems.forEach((button) => {
        const label = button.textContent.trim().toLowerCase();
        button.classList.toggle("hidden", Boolean(query) && !label.includes(query));
      });
      $$(".nav-section").forEach((section) => {
        section.classList.toggle("filtered-empty", !$(".nav-btn:not(.hidden)", section));
      });
    };
  }
}

function applyRouteFromLocation() {
  const [, moduleName, id] = window.location.pathname.split("/");
  const routeModules = ["employees", "users", "assets", "tickets", "tasks", "contracts", "vendors", "documents", "knowledge_base"];
  if (routeModules.includes(moduleName) && id) {
    if (moduleName === "employees" && !isEmployeeUser()) {
      state.detail = null;
      state.page = "employees";
      state.peopleWorkspaceSelectedId = id;
      state.peopleWorkspaceTab = "Overview";
      setHomeRoute();
      return;
    }
    if (moduleName === "users" && !isEmployeeUser()) {
      state.detail = null;
      state.page = "users";
      state.accountWorkspaceSelectedId = id;
      state.accountWorkspaceTab = "Overview";
      setHomeRoute();
      return;
    }
    if (moduleName === "tickets" && !isEmployeeUser()) {
      state.detail = null;
      state.page = "tickets";
      state.ticketWorkspaceSelectedId = id;
      state.ticketWorkspaceTab = "Conversation";
      setHomeRoute();
      return;
    }
    if (moduleName === "tasks" && !isEmployeeUser()) {
      state.detail = null;
      state.page = "tasks";
      state.taskWorkspaceSelectedId = id;
      state.taskWorkspaceTab = "Overview";
      setHomeRoute();
      return;
    }
    if (moduleName === "assets" && !isEmployeeUser()) {
      state.detail = null;
      state.page = "assets";
      state.workspaceSelected.assets = id;
      state.workspaceTab.assets = "Overview";
      state.assetWorkspaceDraft = null;
      setHomeRoute();
      return;
    }
    if (moduleName === "contracts" && !isEmployeeUser()) {
      state.detail = null;
      state.page = "contracts";
      state.workspaceSelected.contracts = id;
      state.workspaceTab.contracts = "Overview";
      setHomeRoute();
      return;
    }
    if (moduleName === "vendors" && !isEmployeeUser()) {
      state.detail = null;
      state.page = "vendors";
      state.workspaceSelected.vendors = id;
      state.workspaceTab.vendors = "Overview";
      setHomeRoute();
      return;
    }
    if (moduleName === "knowledge_base" && !isEmployeeUser()) {
      state.detail = null;
      state.page = "knowledge_base";
      state.workspaceSelected.knowledge_base = id;
      state.workspaceTab.knowledge_base = "Overview";
      setHomeRoute();
      return;
    }
    state.detail = { name: moduleName, id, tab: state.detail?.tab || "Overview" };
    state.page = moduleName;
  } else if (window.location.pathname !== "/") {
    state.detail = null;
  }
}

function setRouteForDetail(name, id) {
  const next = `/${name}/${id}`;
  if (window.location.pathname !== next) history.pushState({ detail: true }, "", next);
}

function setHomeRoute() {
  if (window.location.pathname !== "/") history.pushState({}, "", "/");
}

function render() {
  if (!state.db) return;
  applyRouteFromLocation();
  if (!state.detail && !canViewPage(state.page)) {
    state.page = has("employee_portal", "view") ? "employee_portal" : "dashboard";
  }
  if (state.detail && !canViewPage(state.detail.name)) {
    state.detail = null;
    state.page = has("employee_portal", "view") ? "employee_portal" : "dashboard";
  }
  renderShell();
  if (state.detail) {
    const row = rows(state.detail.name).find((item) => item.id === state.detail.id);
    $("#pageTitle").textContent = primaryTitle(state.detail.name, row || {});
    $("#sectionEyebrow").textContent = `${displayLabel(state.detail.name)} detail`;
    $("#breadcrumbs").textContent = breadcrumbFor(state.detail.name, row || {});
    $("#content").innerHTML = detailPage(state.detail.name, row);
    bindPageActions();
    localizeRenderedUi(document.body);
    return;
  }
  $("#pageTitle").textContent = displayLabel(state.page);
  $("#sectionEyebrow").textContent = state.page === "dashboard" ? trText("Live workspace") : viewModeLabel(state.page);
  $("#content").innerHTML = skeleton();
  afterPaint(() => {
    if (state.page === "dashboard") $("#content").innerHTML = dashboard();
    else if (state.page === "employee_portal") $("#content").innerHTML = employeePortal();
    else if (state.page === "profile") $("#content").innerHTML = profilePage();
    else if (state.page === "preferences") $("#content").innerHTML = preferencesPage();
    else if (state.page === "notification_preferences") $("#content").innerHTML = notificationPreferencesPage();
    else if (state.page === "notifications") $("#content").innerHTML = notificationsPage();
    else if (state.page === "archive_center" || state.page === "trash") $("#content").innerHTML = archivePage(state.page);
    else if (state.page === "users") $("#content").innerHTML = userAccountsWorkspacePage();
    else if (state.page === "employees" && !isEmployeeUser()) $("#content").innerHTML = peopleWorkspacePage();
    else if (state.page === "roles") $("#content").innerHTML = rolesPage();
    else if (state.page === "audit_logs") $("#content").innerHTML = auditFeed();
    else if (state.page === "timeline") $("#content").innerHTML = timelineFeed();
    else if (state.page === "settings") $("#content").innerHTML = settingsPage();
    else if (state.page === "tickets" && isEmployeeUser()) $("#content").innerHTML = employeeTicketsPage();
    else if (state.page === "tickets") $("#content").innerHTML = managerTicketsPage();
    else if (state.page === "tasks" && isEmployeeUser()) $("#content").innerHTML = employeeTasksPage();
    else if (state.page === "tasks") $("#content").innerHTML = tasksWorkspacePage();
    else if (state.page === "archived_tasks" && isEmployeeUser()) $("#content").innerHTML = employeeArchivedTasksPage();
    else if (state.page === "assets" && isEmployeeUser()) $("#content").innerHTML = employeeAssetsPage();
    else if (state.page === "documents" && isEmployeeUser()) $("#content").innerHTML = employeeDocumentsPage();
    else if (state.page === "knowledge_base" && isEmployeeUser()) $("#content").innerHTML = employeeKnowledgeBasePage();
    else if (state.page === "assets") $("#content").innerHTML = assetsWorkspacePage();
    else if (state.page === "contracts") $("#content").innerHTML = contractsWorkspacePage();
    else if (state.page === "vendors") $("#content").innerHTML = vendorsWorkspacePage();
    else if (state.page === "knowledge_base") $("#content").innerHTML = knowledgeWorkspacePage();
    else if (workspaceModules.has(state.page)) $("#content").innerHTML = standardWorkspacePage(state.page);
    else if (boardModules.has(state.page)) $("#content").innerHTML = boardPage(state.page);
    else if (feedModules.has(state.page)) $("#content").innerHTML = timelineFeed(state.page);
    else if (cardModules.has(state.page)) $("#content").innerHTML = cardCollection(state.page);
    else $("#content").innerHTML = tablePage(state.page);
    bindPageActions();
    localizeRenderedUi(document.body);
  });
}

function viewModeLabel(page) {
  if (boardModules.has(page)) return trText("Board view");
  if (feedModules.has(page)) return trText("Feed view");
  if (workspaceModules.has(page)) return trText("Split workspace");
  if (cardModules.has(page)) return trText("Card view");
  return trText("Workspace");
}

function skeleton() {
  return `<div class="skeleton"><div class="skeleton-line" style="width:44%"></div><div class="skeleton-line"></div><div class="skeleton-line" style="width:74%"></div></div>`;
}

// Hidden tabs never run animation frames, so a rAF-only paint leaves the page
// stuck on its skeleton until the tab is focused.
function afterPaint(callback) {
  if (document.visibilityState === "hidden") setTimeout(callback, 0);
  else requestAnimationFrame(callback);
}

function dashboard() {
  const tickets = rows("tickets");
  const tasks = rows("tasks");
  const contracts = rows("contracts");
  const assets = rows("assets");
  const activeTickets = tickets.filter((item) => !["closed", "cancelled"].includes(String(item.status || "").toLowerCase()));
  const overdueTasks = tasks.filter(isDashboardOverdueTask);
  const renewals = contracts.filter(isRenewalSoon);
  const criticalTickets = tickets.filter((item) => String(item.priority || "").toLowerCase() === "critical");
  const assetsInRepair = assets.filter((item) => ["in_repair", "under_maintenance"].includes(String(item.status || "").toLowerCase()));
  const waitingApprovals = [
    ...activeTickets.filter((ticket) => ticket.status === "waiting" && String(ticket.waitingReason || "").toLowerCase() === "approval"),
    ...tasks.filter((task) => String(task.approvalStatus || "").toLowerCase().includes("pending"))
  ];
  const unassignedTickets = activeTickets.filter((ticket) => !ticket.assignedToId);
  const activity = dashboardActivity();
  const priorityCards = [
    { label: "Critical Tickets", value: criticalTickets.length, sub: "Immediate escalation", module: "tickets", field: "priority", valueFilter: "critical", tone: criticalTickets.length ? "danger" : "success" },
    { label: "Overdue Tasks", value: overdueTasks.length, sub: "Past due work", module: "tasks", field: "quick", valueFilter: "overdue", tone: overdueTasks.length ? "danger" : "success" },
    { label: "Expiring Contracts", value: renewals.length, sub: "Next 30 days", module: "contracts", field: "renewal_window", valueFilter: "soon", tone: renewals.length ? "warning" : "success" },
    { label: "Assets In Repair", value: assetsInRepair.length, sub: "Unavailable assets", module: "assets", field: "status", valueFilter: "in_repair", tone: assetsInRepair.length ? "warning" : "success" },
    { label: "Waiting Approvals", value: waitingApprovals.length, sub: "Needs decision", module: "tickets", field: "waitingReason", valueFilter: "approval", tone: waitingApprovals.length ? "warning" : "success" },
    { label: "Unassigned Tickets", value: unassignedTickets.length, sub: "Needs owner", module: "tickets", field: "assignee", valueFilter: "unassigned", tone: unassignedTickets.length ? "warning" : "success" }
  ];
  const immediateItems = [
    ...criticalTickets.map((item) => dashboardQueueRecord("tickets", item, "Critical ticket", item.priority)),
    ...overdueTasks.map((item) => dashboardQueueRecord("tasks", item, "Overdue task", item.priority))
  ].sort((a, b) => b.sort.localeCompare(a.sort)).slice(0, 5);
  const overdueItems = [
    ...overdueTasks.map((item) => dashboardQueueRecord("tasks", item, "Past due", item.dueDate)),
    ...activeTickets.filter((ticket) => ticketSla(ticket).tone === "danger").map((item) => dashboardQueueRecord("tickets", item, "SLA breached", item.status))
  ].slice(0, 5);
  const expiringItems = [
    ...renewals.map((item) => dashboardQueueRecord("contracts", item, "Renewal", remainingDays(item.endDate || item.renewalReminderDate))),
    ...assets.filter((asset) => asset.warrantyEndDate && remainingDays(asset.warrantyEndDate) !== "No date set" && (() => { const days = Math.ceil((new Date(`${asset.warrantyEndDate}T00:00:00`).getTime() - new Date(`${today()}T00:00:00`).getTime()) / 86400000); return days >= 0 && days <= 30; })()).map((item) => dashboardQueueRecord("assets", item, "Warranty", remainingDays(item.warrantyEndDate)))
  ].slice(0, 5);
  const waitingItems = [
    ...activeTickets.filter((ticket) => ticket.status === "waiting").map((item) => dashboardQueueRecord("tickets", item, `Waiting: ${labelize(item.waitingReason || "response")}`, item.priority)),
    ...waitingApprovals.filter((item) => item.title).map((item) => dashboardQueueRecord("tasks", item, "Approval pending", item.priority))
  ].slice(0, 5);
  const unassignedItems = unassignedTickets.map((item) => dashboardQueueRecord("tickets", item, "Unassigned", item.priority)).slice(0, 5);
  const quickActions = [
    ["tickets", "Create Ticket", "Capture a new support request."],
    ["tasks", "Create Task", "Add work for IT follow-up."],
    ["assets", "Register Asset", "Add a new device or inventory item."],
    ["documents", "Upload Document", "Publish or file an operational document."],
    ["employees", "Create Person", "Create a person profile."]
  ].filter(([module]) => has(module, "create"));
  return `<div class="dashboard-personalized command-center-v4">
    <section class="hero-command surface-card">
      <div>
        <p class="eyebrow">Operational command center</p>
        <h3>Start with what needs attention now.</h3>
        <p class="muted">A morning view for triage: urgent work, overdue items, expiring obligations, and decisions waiting on IT.</p>
      </div>
      <div class="hero-actions">
        <button class="btn btn-primary" data-page-jump="tickets">${icon("tickets")}Review tickets</button>
        <button class="btn btn-secondary" data-customize-dashboard>${icon("settings")}Customize</button>
      </div>
    </section>
    <section class="surface-card command-panel command-priority-panel">
      <div class="section-title"><div><p class="eyebrow">Priority summary</p><h3>What needs attention now</h3></div></div>
      <div class="command-priority-grid">${priorityCards.map((item) => commandPriorityCard(item)).join("")}</div>
    </section>
    <section class="surface-card command-panel command-attention-panel">
      <div class="section-title"><div><p class="eyebrow">Attention queue</p><h3>Highest value next actions</h3><p class="muted">A few records per lane so the dashboard stays focused on action, not reporting.</p></div></div>
      <div class="command-attention-grid">
        ${commandAttentionLane("Needs immediate attention", immediateItems, "No critical work right now.")}
        ${commandAttentionLane("Overdue items", overdueItems, "No overdue items.")}
        ${commandAttentionLane("Expiring soon", expiringItems, "No renewals or warranties in the next 30 days.")}
        ${commandAttentionLane("Waiting for me", waitingItems, "Nothing is waiting on IT.")}
        ${commandAttentionLane("Unassigned work", unassignedItems, "All active tickets have owners.")}
      </div>
    </section>
    <div class="command-center-bottom">
      <section class="surface-card command-panel command-activity-panel">
        <div class="section-title"><div><p class="eyebrow">Recent activity</p><h3>Meaningful operational updates</h3></div><button class="btn btn-secondary" data-page-jump="timeline">See all</button></div>
        <div class="dashboard-activity-list">${activity.slice(0, 8).map(dashboardActivityCard).join("") || emptyState("No operational activity", "New work will appear here.")}</div>
      </section>
      <section class="surface-card command-panel command-quick-actions-panel">
        <div class="section-title"><div><p class="eyebrow">Quick actions</p><h3>Start common work</h3></div></div>
        <div class="command-quick-actions">${quickActions.map(([module, label, helper]) => `<button class="command-quick-action" data-command-create="${escapeHtml(module)}"><span>${icon(module)}</span><strong>${escapeHtml(label)}</strong><small>${escapeHtml(helper)}</small></button>`).join("") || emptyState("No create actions", "Your role does not include create permissions.")}</div>
      </section>
    </div>
  </div>`;
}

function metric(label, value, sub, module, field = "", valueFilter = "") {
  const filter = field ? `data-dashboard-open-filter="${module}|${field}|${valueFilter}"` : `data-page-jump="${module}"`;
  const tone = /overdue|critical/i.test(label) ? "danger" : /renewal|waiting/i.test(label) ? "warning" : /progress|open/i.test(label) ? "info" : "neutral";
  return `<button class="card metric dashboard-metric tone-${tone}" ${filter} title="${escapeHtml(sub)}"><span class="dashboard-kpi-icon">${icon(module)}</span><span class="dashboard-kpi-copy"><strong>${value}</strong><small>${escapeHtml(label)}</small><em>${escapeHtml(sub)}</em></span></button>`;
}

function commandPriorityCard(item) {
  const filter = `data-dashboard-open-filter="${escapeHtml(`${item.module}|${item.field}|${item.valueFilter}`)}"`;
  return `<button class="command-priority-card tone-${escapeHtml(item.tone || "neutral")}" ${filter}>
    <span>${icon(item.module)}</span>
    <strong>${item.value}</strong>
    <small>${escapeHtml(item.label)}</small>
    <em>${escapeHtml(item.sub)}</em>
  </button>`;
}

function dashboardQueueRecord(module, item, label, meta = "") {
  const title = module === "tickets" ? `${item.ticketNumber || item.id} - ${ticketSubject(item)}` : primaryTitle(module, item);
  const owner = module === "tickets" ? look("employees", item.requesterId) : module === "tasks" ? look("users", item.assignedToId || item.ownerId) : module === "contracts" ? look("vendors", item.vendorId) : module === "assets" ? look("employees", item.currentOwnerId) || item.location : "";
  return {
    module,
    id: item.id,
    label: trText(label),
    title,
    owner: owner || trText("Unassigned"),
    meta: trText(meta || relativeTime(item.updatedAt || item.createdAt)),
    tone: /critical|overdue|breach|lost|stolen/i.test(`${label} ${meta}`) ? "danger" : /waiting|renewal|warranty|approval|high/i.test(`${label} ${meta}`) ? "warning" : "info",
    sort: String(item.updatedAt || item.createdAt || item.dueDate || item.endDate || "")
  };
}

function commandAttentionLane(title, items, emptyText) {
  return `<section class="command-attention-lane">
    <div class="command-lane-head"><strong>${escapeHtml(title)}</strong><span>${items.length}</span></div>
    <div class="command-lane-list">${items.length ? items.map(commandQueueItem).join("") : `<p class="muted compact-empty">${escapeHtml(emptyText)}</p>`}</div>
  </section>`;
}

function commandQueueItem(item) {
  return `<button class="command-queue-item tone-${escapeHtml(item.tone || "info")}" data-view="${escapeHtml(item.module)}" data-id="${escapeHtml(item.id)}">
    <span class="command-queue-icon">${icon(item.module)}</span>
    <span class="command-queue-copy"><strong>${escapeHtml(item.title)}</strong><small>${escapeHtml(item.owner)} | ${escapeHtml(item.label)}</small></span>
    <em>${escapeHtml(item.meta)}</em>
  </button>`;
}

function isToday(value) { return String(value || "").slice(0, 10) === today(); }
function isTaskDone(task) { return ["done", "completed", "cancelled"].includes(String(task.status || "").toLowerCase()); }
function isDashboardOverdueTask(task) { return !isTaskDone(task) && (task.status === "overdue" || (task.dueDate && task.dueDate < today())); }
function isRenewalSoon(contract) {
  const date = contract.renewalReminderDate || contract.endDate;
  if (!date) return false;
  const days = (new Date(`${date}T00:00:00`).getTime() - new Date(`${today()}T00:00:00`).getTime()) / 86400000;
  return days >= 0 && days <= 30;
}
function remainingDays(dateValue) {
  if (!dateValue) return "No date set";
  const days = Math.ceil((new Date(`${dateValue}T00:00:00`).getTime() - new Date(`${today()}T00:00:00`).getTime()) / 86400000);
  if (days < 0) return tpl("{n} days overdue", { n: Math.abs(days) });
  if (days === 0) return "Due today";
  return tpl("{n} days remaining", { n: days });
}
function dashboardSignalGroups({ contracts, assets, tasks, tickets }) {
  const warrantySoon = assets.filter((asset) => asset.warrantyEndDate && remainingDays(asset.warrantyEndDate) !== "No date set" && (() => { const days = Math.ceil((new Date(`${asset.warrantyEndDate}T00:00:00`).getTime() - new Date(`${today()}T00:00:00`).getTime()) / 86400000); return days >= 0 && days <= 30; })());
  const contractSignals = contracts.filter((contract) => isRenewalSoon(contract) || contract.status === "renewal_due").map((contract) => ({
    module: "contracts", entityType: "contracts", entityId: contract.id, severity: contract.status === "renewal_due" ? "warning" : "info", title: contract.name,
    meta: `${remainingDays(contract.endDate || contract.renewalReminderDate)}${contract.vendorId ? ` | ${look("vendors", contract.vendorId)}` : ""}`
  }));
  const assetSignals = [
    ...assets.filter(assetNeedsAttention).map((asset) => ({ module: "assets", entityType: "assets", entityId: asset.id, severity: assetAttentionBadge(asset), title: asset.assetNumber || asset.name || "Asset", meta: `${assetStatusLabel(asset.status)} | ${assetAttentionLabel(asset)}` })),
    ...warrantySoon.map((asset) => ({ module: "assets", entityType: "assets", entityId: asset.id, severity: "warning", title: asset.assetNumber || asset.name || "Asset", meta: `Warranty | ${remainingDays(asset.warrantyEndDate)}` }))
  ];
  const taskSignals = [...new Map([
    ...tasks.filter((task) => isDashboardOverdueTask(task)).map((task) => [task.id, { module: "tasks", entityType: "tasks", entityId: task.id, severity: "danger", title: task.title, meta: "Overdue task" }]),
    ...tasks.filter((task) => String(task.priority || "").toLowerCase() === "high" && !isTaskDone(task)).map((task) => [task.id, { module: "tasks", entityType: "tasks", entityId: task.id, severity: "warning", title: task.title, meta: "High priority" }])
  ]).values()];
  const vendorSignals = [
    ...tickets.filter((ticket) => ticket.status === "waiting" && String(ticket.waitingReason || "").toLowerCase() === "vendor").map((ticket) => ({ module: "vendors", entityType: "tickets", entityId: ticket.id, severity: "warning", title: ticket.ticketNumber || ticket.id, meta: "Waiting for vendor" })),
    ...contracts.filter((contract) => contract.vendorId && (isRenewalSoon(contract) || contract.status === "renewal_due")).map((contract) => ({ module: "vendors", entityType: "contracts", entityId: contract.id, severity: "info", title: look("vendors", contract.vendorId), meta: `Contract | ${contract.name}` }))
  ];
  return { contracts: contractSignals, assets: assetSignals, tasks: taskSignals, vendors: vendorSignals };
}
function dashboardTickets(tickets) {
  const filter = state.dashboardTicketFilter;
  const visible = filter === "all" ? tickets : tickets.filter((ticket) => ticket.status === filter);
  return [...visible].sort((a, b) => String(b.updatedAt || b.createdAt || "").localeCompare(String(a.updatedAt || a.createdAt || ""))).slice(0, 8);
}
function ticketSubject(ticket) { return String(ticket.subject || ticket.description || ticket.category || "Untitled ticket").split(/\n/)[0].slice(0, 72); }
function ticketSla(ticket) {
  const due = ticket.slaDueDate || ticket.dueDate;
  if (!due) return { label: "Not set", tone: "muted" };
  const hours = Math.ceil((new Date(`${due}T23:59:59`).getTime() - Date.now()) / 3600000);
  if (hours < 0) return { label: "Breached", tone: "danger" };
  if (hours <= 8) return { label: `${hours}h left`, tone: "warning" };
  return { label: `${Math.ceil(hours / 24)}d left`, tone: "success" };
}
function dashboardTicketTable(tickets) {
  return `<div class="dashboard-ticket-table-wrap"><table class="dashboard-ticket-table"><thead><tr><th>Ticket ID</th><th>Subject</th><th>Requester</th><th>Priority</th><th>Status</th><th>Assigned to</th><th>Updated</th><th>SLA remaining</th></tr></thead><tbody>${tickets.map((ticket) => { const sla = ticketSla(ticket); return `<tr data-view="tickets" data-id="${ticket.id}" tabindex="0"><td><strong>${escapeHtml(ticket.ticketNumber || ticket.id)}</strong></td><td>${escapeHtml(ticketSubject(ticket))}</td><td>${escapeHtml(look("employees", ticket.requesterId) || "Unassigned")}</td><td><span class="badge ${badgeClass(ticket.priority)}">${escapeHtml(ticket.priority || "medium")}</span></td><td><span class="badge ${badgeClass(ticket.status)}">${escapeHtml(labelize(ticket.status || "open"))}</span></td><td>${escapeHtml(look("users", ticket.assignedToId) || "Unassigned")}</td><td>${escapeHtml(relativeTime(ticket.updatedAt || ticket.createdAt))}</td><td><span class="dashboard-sla ${sla.tone}">${escapeHtml(sla.label)}</span></td></tr>`; }).join("") || `<tr><td colspan="8">${emptyState("No matching tickets", "Try another status filter.")}</td></tr>`}</tbody></table></div>`;
}
function dashboardSignalGroup(name, items) {
  return `<section class="dashboard-signal-group"><div class="dashboard-signal-head"><span>${icon(name)}</span><strong>${labelize(name)}</strong><small>${items.length}</small></div><div class="signal-list">${items.slice(0, 3).map(signalCard).join("") || `<p class="muted compact-empty">No active signals.</p>`}</div></section>`;
}
function activityType(event) {
  const entity = String(event.entityType || "").toLowerCase();
  if (["transfer", "transfers", "asset", "assets"].includes(entity)) return "assets";
  return entity.replace(/s$/, "") + "s";
}
function dashboardActivity() {
  const operational = /ticket|task|comment|attachment|asset|transfer|contract|vendor|user|status|assign|return/i;
  return (state.db.timeline || []).filter((event) => !/\blogin\b/i.test(`${event.title || ""} ${event.description || ""}`)).filter((event) => operational.test(`${event.title || ""} ${event.description || ""} ${event.entityType || ""}`)).filter((event) => state.dashboardActivityFilter === "all" || activityType(event) === state.dashboardActivityFilter);
}
function dashboardResourceForEvent(event) {
  return ({ ticket: "tickets", task: "tasks", asset: "assets", contract: "contracts", vendor: "vendors", document: "documents", employee: "employees", user: "users", transfer: "transfers", comment: "comments", attachment: "attachments" })[event.entityType] || event.entityType;
}
function moduleForEntityType(type) {
  return ({ ticket: "tickets", task: "tasks", asset: "assets", contract: "contracts", vendor: "vendors", document: "documents", employee: "employees", user: "users", transfer: "transfers", knowledge_base: "knowledge_base", form_template: "form_templates" })[String(type || "").toLowerCase()] || `${type}s`.replace(/ss$/, "s");
}
function dashboardEventTarget(event) {
  const type = String(event.entityType || "").toLowerCase();
  if (["comment", "comments"].includes(type)) {
    const comment = rows("comments").find((item) => item.id === event.entityId);
    if (comment?.entityType && comment?.entityId) return { module: moduleForEntityType(comment.entityType), id: comment.entityId };
  }
  if (["attachment", "attachments"].includes(type)) {
    const attachment = rows("attachments").find((item) => item.id === event.entityId);
    if (attachment?.entityType && attachment?.entityId) return { module: moduleForEntityType(attachment.entityType), id: attachment.entityId };
  }
  return { module: dashboardResourceForEvent(event), id: event.entityId };
}
function dashboardActivityIcon(type) {
  return ({ tickets: "tickets", tasks: "tasks", assets: "assets", contracts: "contracts", vendors: "vendors", users: "users", comments: "comments", attachments: "attachments" })[type] || "timeline";
}
function dashboardActivityCard(event) {
  const type = activityType(event);
  const target = dashboardEventTarget(event);
  return `<button class="dashboard-activity-card" data-view="${escapeHtml(target.module)}" data-id="${escapeHtml(target.id)}"><span class="activity-dot ${badgeClass(event.severity)}">${icon(dashboardActivityIcon(type))}</span><span class="dashboard-activity-copy"><strong>${escapeHtml(event.title)}</strong><small>${escapeHtml(event.description || "Updated record")}</small></span><time>${escapeHtml(relativeTime(event.createdAt))}</time></button>`;
}
function focusCard(item) { return `<button class="focus-card tone-${escapeHtml(item.tone || "neutral")}" ${item.filter ? `data-dashboard-open-filter="${escapeHtml(item.filter)}"` : `data-page-jump="${item.module}"`}><span><strong>${item.count}</strong><small>${escapeHtml(item.label)}</small></span><em>${escapeHtml(item.note)}</em></button>`; }
function assetAttentionCounts(assets) {
  const warrantyExpiring = assets.filter((asset) => asset.warrantyEndDate && (() => { const days = Math.ceil((new Date(`${asset.warrantyEndDate}T00:00:00`).getTime() - new Date(`${today()}T00:00:00`).getTime()) / 86400000); return days >= 0 && days <= 30; })());
  return [
    { label: "Pending Return", count: assets.filter((asset) => asset.status === "pending_return").length, status: "pending_return", tone: "danger" },
    { label: "Temporary Custody", count: assets.filter((asset) => asset.status === "temporary_custody").length, status: "temporary_custody", tone: "warning" },
    { label: "In Repair", count: assets.filter((asset) => ["in_repair", "under_maintenance"].includes(asset.status)).length, status: "in_repair", tone: "warning" },
    { label: "Warranty Expiring", count: warrantyExpiring.length, field: "warranty", value: "expiring", tone: "warning" },
    { label: "Lost / Stolen", count: assets.filter((asset) => ["lost", "stolen"].includes(asset.status)).length, status: "lost_stolen", tone: "danger" },
    { label: "Disposed", count: assets.filter((asset) => asset.status === "disposed").length, status: "disposed", tone: "neutral" }
  ];
}
function assetAttentionCard(item) {
  const filter = item.field === "warranty" ? `data-dashboard-open-filter="assets|warranty|expiring"` : `data-dashboard-open-filter="assets|status|${item.status}"`;
  return `<button class="asset-attention-card" ${filter}><span class="badge ${escapeHtml(item.tone)}">${escapeHtml(item.label)}</span><strong>${item.count}</strong></button>`;
}
function priorityChartData(tickets) { return ["high", "medium", "low"].map((label) => ({ label: labelize(label), value: tickets.filter((ticket) => String(ticket.priority || "").toLowerCase() === label).length, tone: label })); }
function categoryChartData(tickets) { return ["Hardware", "Software", "Access", "Network", "Service Request", "Other"].map((label) => ({ label, value: tickets.filter((ticket) => label === "Other" ? !/(hardware|software|access|network|service request)/i.test(ticket.category || "") : new RegExp(label === "Service Request" ? "service requests?" : label, "i").test(ticket.category || "")).length, tone: label.toLowerCase().replace(" ", "-") })); }
function slaChartData(tickets) { const values = tickets.map(ticketSla); return ["On track", "At risk", "Breached"].map((label) => ({ label, value: values.filter((item) => label === "On track" ? item.tone === "success" : label === "At risk" ? item.tone === "warning" : item.tone === "danger").length, tone: label.toLowerCase().replace(" ", "-") })); }
function assigneeChartData(tickets) { const buckets = new Map(); tickets.forEach((ticket) => { const label = look("users", ticket.assignedToId) || "Unassigned"; buckets.set(label, (buckets.get(label) || 0) + 1); }); return [...buckets.entries()].map(([label, value]) => ({ label, value, tone: "assignee" })).sort((a, b) => b.value - a.value).slice(0, 4); }
function dashboardChart(title, items, type = "") {
  const max = Math.max(1, ...items.map((item) => item.value));
  return `<section class="dashboard-chart"><h4>${escapeHtml(title)}</h4><div class="dashboard-chart-bars">${items.map((item) => {
    const filterValue = type === "priority" ? item.tone : item.label;
    return `<button class="dashboard-chart-row" data-dashboard-open-filter="tickets|chart_${type}|${escapeHtml(filterValue)}"><span>${escapeHtml(item.label)}</span><i><b class="${escapeHtml(item.tone)}" style="width:${Math.max(4, (item.value / max) * 100)}%"></b></i><strong>${item.value}</strong></button>`;
  }).join("")}</div></section>`;
}
function relativeTime(value) { if (!value) return trText("Not updated"); const minutes = Math.max(0, Math.floor((Date.now() - new Date(value).getTime()) / 60000)); if (minutes < 1) return state.lang === "ar" ? "الآن" : "Just now"; if (minutes < 60) return state.lang === "ar" ? `منذ ${minutes} دقيقة` : `${minutes}m ago`; const hours = Math.floor(minutes / 60); if (hours < 24) return state.lang === "ar" ? `منذ ${hours} ساعة` : `${hours}h ago`; const days = Math.floor(hours / 24); return state.lang === "ar" ? `منذ ${days} يوم` : `${days}d ago`; }

function navigateToDashboardFilter(spec) {
  const [module, field, value] = String(spec || "").split("|");
  if (!module) return;
  state.detail = null;
  state.query = "";
  state.page = module;
  if (module === "tickets") {
    state.managerTicketFilters = { status: "", priority: "", assignee: "", category: "", waitingReason: "", resolvedToday: "", chart: null };
    if (field?.startsWith("chart_")) state.managerTicketFilters.chart = { field, value };
    else if (field === "status") state.managerTicketFilters.status = value;
    else if (field === "priority") state.managerTicketFilters.priority = value;
    else if (field === "category") state.managerTicketFilters.category = value;
    else if (field === "assignee") state.managerTicketFilters.assignee = value;
    else if (field === "resolvedToday") {
      state.managerTicketFilters.status = "resolved";
      state.managerTicketFilters.resolvedToday = value;
    }
    else if (field === "waitingReason") {
      state.managerTicketFilters.status = "waiting";
      state.managerTicketFilters.waitingReason = value;
    }
    state.ticketWorkspaceSelectedId = "";
    state.ticketWorkspaceTab = "Conversation";
  } else if (module === "tasks") {
    state.filters.tasks = {};
    if (field === "quick") state.filters.tasks.quick = value;
    else if (field) state.filters.tasks[field] = value;
    state.taskWorkspaceSelectedId = "";
    state.taskWorkspaceTab = "Overview";
  } else if (module === "assets") {
    state.filters.assets = {};
    if (field) state.filters.assets[field] = value;
    state.workspaceSelected.assets = "";
    state.workspaceTab.assets = "Overview";
  } else if (module === "contracts") {
    state.filters.contracts = {};
    if (field === "renewal_window") state.filters.contracts.renewalWindow = value;
    else if (field) state.filters.contracts[field] = value;
    state.workspaceSelected.contracts = "";
    state.workspaceTab.contracts = "Overview";
  } else if (module === "vendors") {
    state.filters.vendors = {};
    if (field) state.filters.vendors[field] = value;
    state.workspaceSelected.vendors = "";
    state.workspaceTab.vendors = "Overview";
  } else if (field) {
    state.filters[module] = value;
  }
  setHomeRoute();
  render();
  requestAnimationFrame(() => window.scrollTo({ top: 0, left: 0, behavior: "instant" }));
}

function navigateToPage(module) {
  state.detail = null;
  state.page = module;
  setHomeRoute();
  render();
  requestAnimationFrame(() => window.scrollTo({ top: 0, left: 0, behavior: "instant" }));
}

function miniColumn(title, items, module) {
  return `<div class="kanban-column compact"><div class="kanban-head"><strong>${escapeHtml(title)}</strong><span>${items.length}</span></div>${items.map((item) => compactCard(module, item)).join("") || emptyState("Nothing here", "No records in this lane.")}</div>`;
}

function signalCard(alert) {
  return `<button class="signal-card signal-card-link severity-${escapeHtml(alert.severity || "info")}" data-view="${escapeHtml(alert.entityType || alert.module)}" data-id="${escapeHtml(alert.entityId || "")}"><span class="badge ${alert.severity}">${escapeHtml(alert.module)}</span><span><strong>${escapeHtml(alert.title)}</strong>${alert.meta ? `<small>${escapeHtml(alert.meta)}</small>` : ""}</span></button>`;
}

function toolbar(name, options = {}) {
  const employeeCardPage = isEmployeeUser() && ["tickets", "assets", "tasks", "documents", "knowledge_base"].includes(name);
  const columnsButton = !employeeCardPage && columns[name] ? `<button class="btn btn-secondary" data-columns="${name}">${icon("columns")}Columns</button>` : "";
  const addLabel = isEmployeeUser() && name === "tickets" ? "Submit Request" : t("add");
  const addButton = has(name, "create") && schemas[name] ? `<button class="btn btn-primary" data-add="${name}">${icon("plus")}${escapeHtml(addLabel)}</button>` : "";
  const exportButton = has(name, "export") ? `<button class="btn btn-secondary" data-export="${name}">${icon("download")}${t("export")}</button>` : "";
  return `
    <div class="toolbar">
      <div>
        <p class="eyebrow">${options.eyebrow || viewModeLabel(name)}</p>
        <h3>${options.title || displayLabel(name)}</h3>
        ${options.subtitle ? `<p class="muted">${escapeHtml(options.subtitle)}</p>` : ""}
      </div>
      <div class="filters">
        <input id="searchBox" placeholder="${t("search")} ${displayLabel(name)}" value="${escapeHtml(state.query)}" />
        ${options.filter ? filterSelect(name, options.filter) : ""}
        ${columnsButton}${exportButton}${addButton}
      </div>
    </div>
  `;
}

function filterSelect(name, field) {
  const source = isEmployeeUser() && name === "tasks" ? rows(name).filter((task) => !isCompletedTask(task)) : rows(name);
  const values = [...new Set(source.map((row) => row[field]).filter(Boolean))];
  const selected = state.filters[name] || "";
  return `<select id="filterBox"><option value="">${escapeHtml(trText("All"))} ${escapeHtml(labelize(field))}</option>${values.map((value) => `<option ${selected === value ? "selected" : ""} value="${escapeHtml(value)}">${escapeHtml(labelize(value))}</option>`).join("")}</select>`;
}

function collection(name) {
  const q = [state.globalQuery, state.query].filter(Boolean).join(" ").toLowerCase();
  let data = rows(name).filter((row) => JSON.stringify(row).toLowerCase().includes(q));
  const activeFilter = state.filters[name];
  if (activeFilter && typeof activeFilter === "object") {
    data = data.filter((row) => Object.entries(activeFilter).every(([field, value]) => !value || String(cellText(name, row, field) ?? row[field] ?? "") === String(value)));
  } else if (activeFilter) {
    data = data.filter((row) => Object.values(row).some((value) => String(value) === activeFilter));
  }
  const sort = state.sort[name];
  if (sort?.key) {
    data = [...data].sort((a, b) => String(cellText(name, a, sort.key)).localeCompare(String(cellText(name, b, sort.key))) * (sort.dir === "desc" ? -1 : 1));
  }
  return data;
}

function cardCollection(name) {
  const data = collection(name);
  const paged = paginate(name, data);
  return `
    ${toolbar(name, { subtitle: collectionSubtitle(name), filter: primaryFilter(name) })}
    <div class="collection-grid">
      ${paged.items.map((row) => collectionCard(name, row)).join("") || emptyState(`No ${displayLabel(name).toLowerCase()} found`, "Try changing search or filters.")}
    </div>
    ${pager(name, data.length, paged)}
  `;
}

function workspaceIdentityMeta(name) {
  return {
    tickets: {
      tone: "conversation",
      eyebrow: "Conversation first",
      title: "Tickets Workspace",
      subtitle: "Keep the requester conversation, assignment, status, and resolution context in one focused pane.",
      focus: "Conversation",
      secondary: "Assignment, SLA, related records, timeline"
    },
    tasks: {
      tone: "execution",
      eyebrow: "Execution first",
      title: "Tasks Workspace",
      subtitle: "Focus on the next action, owner, due date, progress, and blockers.",
      focus: "Next work",
      secondary: "Subtasks, notes, related records, timeline"
    },
    employees: {
      tone: "profile",
      eyebrow: "Profile first",
      title: "People",
      subtitle: "Use People as the master profile for real humans, relationships, assets, tickets, tasks, documents, and system access.",
      focus: "Person profile",
      secondary: "Assets, tickets, tasks, documents, user account"
    },
    assets: {
      tone: "lifecycle",
      eyebrow: "Lifecycle first",
      title: "Assets",
      subtitle: "Show custody and lifecycle state first, then support records, documents, and financial detail.",
      focus: "Custody and lifecycle",
      secondary: "Warranty, repair, disposal, tickets, documents"
    },
    documents: {
      tone: "document",
      eyebrow: "Document first",
      title: "Documents",
      subtitle: "Make the document, file, and publishing context the center of the workspace.",
      focus: "Document content",
      secondary: "Attachments, linked records, timeline"
    },
    knowledge_base: {
      tone: "article",
      eyebrow: "Article first",
      title: "Knowledge Base",
      subtitle: "Prioritize readable article content, ownership, review status, and employee usefulness.",
      focus: "Article body",
      secondary: "Governance, versions, relationships, analytics"
    },
    contracts: {
      tone: "renewal",
      eyebrow: "Renewal first",
      title: "Contracts",
      subtitle: "Put renewal health, days remaining, vendor obligation, and cost exposure above deep contract detail.",
      focus: "Renewal health",
      secondary: "Vendor, assets, documents, costs, timeline"
    },
    vendors: {
      tone: "relationship",
      eyebrow: "Relationship first",
      title: "Vendors",
      subtitle: "Show vendor health, support contacts, linked contracts, open tickets, and operational relationship context.",
      focus: "Vendor relationship",
      secondary: "Contacts, contracts, assets, tickets, documents"
    },
    settings: {
      tone: "configuration",
      eyebrow: "Configuration first",
      title: "Settings",
      subtitle: "Keep administration in focused sections so daily operations stay calm.",
      focus: "Configuration area",
      secondary: "Ticket assignment, groups, lookups, appearance, system"
    }
  }[name] || {
    tone: "default",
    eyebrow: "Workspace",
    title: displayLabel(name),
    subtitle: collectionSubtitle(name) || `Manage ${displayLabel(name).toLowerCase()} in a focused workspace.`,
    focus: "Primary record",
    secondary: "Context, relationships, timeline"
  };
}

function workspaceIdentityHeader(name, actionHtml = "") {
  const meta = workspaceIdentityMeta(name);
  return `
    <div class="toolbar manager-ticket-toolbar workspace-identity-toolbar identity-${escapeHtml(meta.tone)}">
      <div><p class="eyebrow">${escapeHtml(meta.eyebrow)}</p><h3>${escapeHtml(meta.title)}</h3><p class="muted">${escapeHtml(meta.subtitle)}</p></div>
      <div class="filters">${actionHtml}</div>
    </div>
  `;
}

function workspaceIdentityStrip(name, primaryValue = "", secondaryValue = "") {
  const meta = workspaceIdentityMeta(name);
  return `<section class="workspace-identity-strip identity-${escapeHtml(meta.tone)}">
    <span><small>Primary focus</small><strong>${escapeHtml(primaryValue || meta.focus)}</strong></span>
    <span><small>Supporting context</small><strong>${escapeHtml(secondaryValue || meta.secondary)}</strong></span>
  </section>`;
}

function assetsWorkspacePage() {
  const data = assetsWorkspaceCollection();
  const selected = data.find((row) => row.id === state.workspaceSelected.assets) || data[0] || null;
  if (selected) state.workspaceSelected.assets = selected.id;
  return `
    ${workspaceIdentityHeader("assets", has("assets", "create") ? `<button class="btn btn-primary" data-add="assets">${icon("plus")}New Asset</button>` : "")}
    <section class="ticket-workspace asset-workspace">
      <aside class="ticket-workspace-list-panel">
        <div class="ticket-workspace-list-tools"><input id="searchBox" placeholder="Search Assets" value="${escapeHtml(state.query)}" /></div>
        ${assetsWorkspaceFilters()}
        <div class="ticket-workspace-list" aria-label="Asset list">
          ${data.map((asset) => assetWorkspaceItem(asset, selected?.id === asset.id)).join("") || emptyState("No assets found", "Try changing search or filters.")}
        </div>
      </aside>
      <section class="ticket-workspace-detail-panel">${selected ? assetWorkspaceDetail(selected) : emptyState("No asset selected", "Choose an asset from the workspace list.")}</section>
    </section>
  `;
}

function assetsWorkspaceCollection() {
  const q = [state.globalQuery, state.query].filter(Boolean).join(" ").toLowerCase();
  const filters = state.filters.assets && typeof state.filters.assets === "object" ? state.filters.assets : {};
  return rows("assets").filter((asset) => {
    if (q && !JSON.stringify(asset).toLowerCase().includes(q) && !assetDisplayName(asset).toLowerCase().includes(q)) return false;
    if (filters.status === "lost_stolen" && !["lost", "stolen"].includes(asset.status)) return false;
    if (filters.status === "in_repair" && !["in_repair", "under_maintenance"].includes(asset.status)) return false;
    if (filters.status && !["lost_stolen", "in_repair"].includes(filters.status) && asset.status !== filters.status) return false;
    if (filters.attention === "needs_attention" && !assetNeedsAttention(asset)) return false;
    if (filters.custody === "assigned" && !assetPermanentCustodianId(asset) && !assetCurrentHolderId(asset) && !asset.currentOwnerId) return false;
    if (filters.warranty === "expiring" && !assetWarrantyExpiring(asset)) return false;
    if (filters.type && asset.type !== filters.type) return false;
    if (filters.location && asset.location !== filters.location) return false;
    if (filters.currentOwnerId && assetPermanentCustodianId(asset) !== filters.currentOwnerId && assetCurrentHolderId(asset) !== filters.currentOwnerId) return false;
    return true;
  }).sort((a, b) => String(a.assetNumber || "").localeCompare(String(b.assetNumber || "")));
}

function assetsWorkspaceFilters() {
  const filters = state.filters.assets && typeof state.filters.assets === "object" ? state.filters.assets : {};
  const optionSelect = (field, label, values, labeler = (value) => value) => `<label class="manager-ticket-filter"><span>${label}</span><select data-asset-filter="${field}"><option value="">All ${label}</option>${values.map((value) => `<option value="${escapeHtml(value)}" ${String(filters[field] || "") === String(value) ? "selected" : ""}>${escapeHtml(labeler(value))}</option>`).join("")}</select></label>`;
  const assets = rows("assets");
  return `<div class="manager-ticket-filters asset-workspace-filters">
    ${optionSelect("status", "Status", [...new Set(assets.map((asset) => asset.status).filter(Boolean))], assetStatusLabel)}
    ${optionSelect("type", "Category", [...new Set(assets.map((asset) => asset.type).filter(Boolean))])}
    ${optionSelect("location", "Location", [...new Set(assets.map((asset) => asset.location).filter(Boolean))])}
    ${optionSelect("currentOwnerId", "Assigned To", [...new Set(assets.map((asset) => asset.currentOwnerId).filter(Boolean))], (value) => look("employees", value) || value)}
  </div>`;
}

function assetWorkspaceItem(asset, active) {
  const owner = assetCurrentHolderLabel(asset);
  const attention = assetAttentionLabel(asset);
  return `
    <button class="ticket-workspace-item asset-workspace-item ${active ? "active" : ""}" data-asset-workspace-select="${asset.id}">
      <span class="workspace-item-top"><strong>${escapeHtml(asset.assetNumber || asset.id)}</strong><span class="badge ${assetStatusBadge(asset.status)}">${escapeHtml(assetStatusLabel(asset.status))}</span></span>
      <span class="workspace-ticket-subject">${escapeHtml(assetDisplayName(asset))}</span>
      <span class="workspace-item-meta"><span>${escapeHtml(asset.type || "Asset")}</span><span>${escapeHtml(owner)}</span><span>${escapeHtml(asset.location || asset.currentHolderType || "No location")}</span></span>
      <span class="workspace-ticket-indicators">${assetWarrantyBadge(asset)}${attention !== "Normal" ? `<span class="workspace-indicator ${assetAttentionBadge(asset)}">${escapeHtml(attention)}</span>` : ""}</span>
    </button>
  `;
}

function comingSoonButton(label) {
  return `<button type="button" class="btn btn-secondary" data-future-action="This action is planned for a future version." aria-disabled="true" title="Coming soon">${escapeHtml(label)} <span class="badge muted">Coming soon</span></button>`;
}

// Every entry in this menu was a placeholder, so it advertised features that do not
// exist. Kept as a no-op rather than removing the call sites, so a real action can
// be added here later.
function headerMoreComingSoonMenu() {
  return "";
}

function assetWorkspaceDetail(asset) {
  const tab = state.workspaceTab.assets || "Overview";
  const tabs = ["Overview", "Lifecycle", "Maintenance", "Tickets", "Documents", "Timeline"];
  const safeTab = tabs.includes(tab) ? tab : tab === "Assignment" ? "Lifecycle" : "Overview";
  state.workspaceTab.assets = safeTab;
  return `
    <header class="ticket-workspace-detail-head asset-detail-head">
      <div>
        <p class="eyebrow">${escapeHtml(asset.assetNumber || "Asset")}</p>
        <h3>${escapeHtml(assetDisplayName(asset))}</h3>
        <p class="muted">${escapeHtml(asset.type || "Asset")} | ${escapeHtml(assetStatusLabel(asset.status))} | ${escapeHtml(assetCurrentHolderLabel(asset))} | ${escapeHtml(asset.location || "No location")}</p>
      </div>
      <div class="detail-head-actions"><span class="badge ${assetStatusBadge(asset.status)}">${escapeHtml(assetStatusLabel(asset.status))}</span><span class="badge ${assetAttentionBadge(asset)}">${escapeHtml(assetAttentionLabel(asset))}</span>${has("assets", "edit") ? `<button class="btn btn-secondary" data-edit="assets" data-id="${asset.id}">${icon("edit")}Edit Asset</button>` : ""}${has("assets", "archive") ? `<button class="btn btn-warning" data-archive="assets" data-id="${asset.id}">${icon("archive_center")}Archive</button>` : ""}${headerMoreComingSoonMenu(["Bulk update", "Export asset", "Print label"])}</div>
    </header>
    ${assetManagementPanel(asset)}
    ${assetActionsSection(asset)}
    <div class="tabs workspace-tabs">${tabs.map((item) => `<button class="tab ${safeTab === item ? "active" : ""}" data-asset-workspace-tab="${item}">${escapeHtml(item)}</button>`).join("")}</div>
    <div class="ticket-workspace-detail-body">${assetWorkspaceTabContent(asset, safeTab)}</div>
  `;
}

function assetManagementPanel(asset) {
  return `
    ${assetRuleCards(asset)}
    <section class="asset-management-panel">
      <div class="asset-state-head"><p class="eyebrow">Lifecycle State</p><h4>${escapeHtml(assetStatusLabel(asset.status))} custody snapshot</h4><p class="muted">Operational ownership, physical holder, location, and attention level at a glance.</p></div>
      <div class="asset-state-grid">
        <div><small>Asset</small><strong>${escapeHtml(asset.assetNumber || asset.id)}</strong></div>
        <div><small>Lifecycle State</small><strong><span class="badge ${assetStatusBadge(asset.status)}">${escapeHtml(assetStatusLabel(asset.status))}</span></strong></div>
        <div><small>Permanent Custodian</small><strong>${escapeHtml(look("employees", assetPermanentCustodianId(asset)) || "No custodian")}</strong></div>
        <div><small>Current Holder</small><strong>${escapeHtml(assetCurrentHolderLabel(asset))}</strong></div>
        <div><small>Location</small><strong>${escapeHtml(asset.location || "No location")}</strong></div>
        <div><small>Attention</small><strong><span class="badge ${assetAttentionBadge(asset)}">${escapeHtml(assetAttentionLabel(asset))}</span></strong></div>
      </div>
    </section>
  `;
}

function assetActionsSection(asset) {
  const disposed = asset.status === "disposed";
  const actions = [
    ["assign", "Assign Asset"],
    ["transfer", "Transfer Asset"],
    ["temporary_custody", "Temporary Custody"],
    ["return", "Return to IT Storage"],
    ["repair", "Send to Repair"],
    ["lost_stolen", "Mark Lost / Stolen"],
    ["dispose", "Dispose Asset"],
    ["print", "Print Asset Label"],
    ["ticket", "Create Ticket"]
  ];
  return `
    <section class="surface-card asset-actions-panel">
      <div class="section-title"><div><p class="eyebrow">Lifecycle Actions</p><h3>Guided workflows</h3><p class="muted">Use these actions for operational custody, repair, loss, disposal, tickets, and receipts. History is appended automatically.</p></div></div>
      <div class="asset-action-grid">
        ${actions.map(([action, label]) => {
          const blocked = disposed && !["print", "ticket"].includes(action);
          return `<button class="btn ${action === "dispose" ? "btn-warning" : "btn-secondary"}" type="button" ${blocked ? "disabled" : `data-asset-workflow="${action}" data-id="${asset.id}"`}>${escapeHtml(label)}</button>`;
        }).join("")}
      </div>
    </section>
  `;
}

function assetWorkspaceTabContent(asset, tab) {
  if (tab === "Lifecycle") return assetLifecycleTab(asset);
  if (tab === "Tickets") return assetTicketsTab(asset);
  if (tab === "Maintenance") return assetMaintenanceTab(asset);
  if (tab === "Documents") return assetDocumentsTab(asset);
  if (tab === "Timeline") return assetTimelineTab(asset);
  return assetOverviewTab(asset);
}

function assetOverviewTab(asset) {
  const custodian = rows("employees").find((person) => person.id === assetPermanentCustodianId(asset));
  const vendor = rows("vendors").find((item) => item.id === asset.supplierId);
  return `
    <div class="asset-overview-grid">
      ${assetInfoSection("Asset Identity", [["Asset Number", asset.assetNumber], ["Asset Name", assetDisplayName(asset)], ["Category", asset.type], ["Serial Number", asset.serialNumber], ["Manufacturer", asset.brand], ["Model", asset.model]])}
      ${assetInfoSection("Operational Context", [["Permanent Custodian", custodian?.name || "No custodian"], ["Current Holder Type", assetCurrentHolderType(asset)], ["Department", look("departments", asset.departmentId) || "-"], ["Location", asset.location || "-"], ["Warranty Status", assetWarrantyText(asset)], ["Supplier", vendor?.name || asset.supplier || "-"]])}
      ${assetInfoSection("Financial / Disposal", [["Purchase Cost", asset.cost ? `${asset.cost}` : "-"], ["Current Value", asset.currentValue || "-"], ["Disposal Reason", asset.disposalReason || "-"], ["Settlement Status", asset.settlementStatus || "-"], ["Settlement Date", asset.settlementDate || "-"]])}
    </div>
  `;
}

function assetInfoSection(title, fields) {
  return `<section class="surface-card asset-info-section"><div class="section-title"><div><p class="eyebrow">${escapeHtml(title)}</p><h3>${escapeHtml(title)}</h3></div></div><div class="detail-grid">${fields.map(([label, value]) => `<div class="detail-field"><small>${escapeHtml(label)}</small><strong>${escapeHtml(value || "-")}</strong></div>`).join("")}</div></section>`;
}

function assetAssignmentTab(asset) {
  const history = rows("transfers").filter((item) => item.assetId === asset.id && /assign|return|reassign|transfer/i.test(item.movementType || "")).sort((a, b) => String(b.date).localeCompare(String(a.date)));
  return `
    <section class="surface-card asset-info-section">
      <div class="section-title"><div><p class="eyebrow">Current Assignment</p><h3>${escapeHtml(assetCurrentHolderLabel(asset))}</h3><p class="muted">${escapeHtml(look("departments", asset.departmentId) || "No department")} | Assigned date ${escapeHtml(history[0]?.date || "not recorded")}</p></div><div class="record-card-actions"><button class="btn btn-secondary" data-asset-workflow="assign" data-id="${asset.id}" ${asset.status === "disposed" ? "disabled" : ""}>Assign</button><button class="btn btn-secondary" data-asset-workflow="transfer" data-id="${asset.id}" ${asset.status === "disposed" ? "disabled" : ""}>Transfer</button><button class="btn btn-secondary" data-asset-workflow="return" data-id="${asset.id}" ${asset.status === "disposed" ? "disabled" : ""}>Return Asset</button></div></div>
    </section>
    <div class="timeline-feed">${history.map(assetTransferCard).join("") || emptyState("No assignment history", "Assignments, returns, and transfers will appear here.")}</div>
  `;
}

function assetLifecycleTab(asset) {
  const events = rows("transfers").filter((item) => item.assetId === asset.id).sort((a, b) => String(b.date).localeCompare(String(a.date)));
  const currentEvent = events[0];
  return `
    <section class="surface-card asset-lifecycle-current">
      <div class="section-title"><div><p class="eyebrow">Current Lifecycle</p><h3>${escapeHtml(assetStatusLabel(asset.status))}</h3><p class="muted">${escapeHtml(assetCurrentHolderLabel(asset))} | ${escapeHtml(assetCurrentHolderType(asset))} | ${escapeHtml(asset.location || "No location")}</p></div><span class="badge ${assetAttentionBadge(asset)}">${escapeHtml(assetAttentionLabel(asset))}</span></div>
      <div class="detail-grid">
        <div class="detail-field"><small>Permanent Custodian</small><strong>${escapeHtml(look("employees", assetPermanentCustodianId(asset)) || "No custodian")}</strong></div>
        <div class="detail-field"><small>Current Holder</small><strong>${escapeHtml(assetCurrentHolderLabel(asset))}</strong></div>
        <div class="detail-field"><small>Expected Return</small><strong>${escapeHtml(asset.expectedReturnDate || "-")}</strong></div>
        <div class="detail-field"><small>Latest Movement</small><strong>${escapeHtml(currentEvent ? assetTransferMessage(currentEvent) : "No lifecycle movement yet")}</strong></div>
      </div>
    </section>
    <div class="asset-lifecycle-feed">${events.map(assetTransferCard).join("") || emptyState("No lifecycle events", "Purchased, received, assigned, transferred, and returned events will appear here.")}</div>
  `;
}

function assetTicketsTab(asset) {
  const tickets = rows("tickets").filter((ticket) => ticket.relatedAssetId === asset.id || ticket.relatedId === asset.id || JSON.stringify(ticket).includes(asset.assetNumber || asset.id));
  return `
    <section class="surface-card asset-table-card"><div class="section-title"><div><p class="eyebrow">Support</p><h3>Related Tickets</h3></div><button class="btn btn-primary" data-add="tickets">Create Ticket</button></div>
      <div class="asset-mini-table">${tickets.map((ticket) => `<button class="asset-mini-row" data-view="tickets" data-id="${ticket.id}"><span>${escapeHtml(ticket.ticketNumber || ticket.id)}</span><strong>${escapeHtml(ticket.subject || ticket.description || "Ticket")}</strong><span class="badge ${badgeClass(ticket.status)}">${escapeHtml(labelize(ticket.status || "open"))}</span><span class="badge ${badgeClass(ticket.priority)}">${escapeHtml(ticket.priority || "medium")}</span><span>${escapeHtml(look("users", ticket.assignedToId) || "Unassigned")}</span></button>`).join("") || emptyState("No related tickets", "Tickets linked to this asset will appear here.")}</div>
    </section>
  `;
}

function assetMaintenanceTab(asset) {
  const records = rows("transfers").filter((item) => item.assetId === asset.id && /maintenance|repair/i.test(`${item.movementType || ""} ${item.notes || ""}`)).sort((a, b) => String(b.date).localeCompare(String(a.date)));
  return `<section class="surface-card asset-info-section"><div class="section-title"><div><p class="eyebrow">Maintenance</p><h3>Maintenance History</h3><p class="muted">Scheduled, completed, vendor, cost, next maintenance, and warranty repair records can be tracked as lifecycle events in V1.</p></div><button class="btn btn-primary" data-asset-workflow="repair" data-id="${asset.id}" ${asset.status === "disposed" ? "disabled" : ""}>Add Maintenance Record</button></div></section><div class="timeline-feed">${records.map(assetTransferCard).join("") || emptyState("No maintenance records", "Maintenance and repair history will appear here.")}</div>`;
}

function assetDocumentsTab(asset) {
  const docs = rows("documents").filter((doc) => doc.linkedType === "asset" && doc.linkedId === asset.id);
  return `<section class="surface-card asset-info-section"><div class="section-title"><div><p class="eyebrow">Documents</p><h3>Asset Documents</h3><p class="muted">Invoices, warranty files, manuals, photos, and attachments.</p></div><button class="btn btn-primary" data-add="documents">Upload Document</button></div></section><div class="collection-grid">${docs.map((doc) => relatedRecordCard("documents", doc, doc.templateType || doc.status || "Document")).join("") || ""}</div>${attachmentsFor("assets", asset)}`;
}

function assetTimelineTab(asset) {
  const events = [
    ...rows("transfers").filter((item) => item.assetId === asset.id).map((item) => assetTransferEvent(item, asset)),
    ...(state.db.timeline || []).filter((item) => item.entityId === asset.id && ["assets", "asset"].includes(item.entityType)).map((item) => ({ ...item, title: readableEventTitle(item), description: readableEventDescription(item) }))
  ].sort((a, b) => String(b.createdAt || b.date || "").localeCompare(String(a.createdAt || a.date || "")));
  return `<div class="timeline-feed">${events.map(eventCard).join("") || emptyState("No timeline yet", "Human-readable asset events will appear here.")}</div>`;
}

function assetTransferCard(transfer) {
  return `<article class="ticket-activity-item asset-event-card"><span class="ticket-activity-icon">${icon("transfers")}</span><div><strong>${escapeHtml(assetTransferMessage(transfer))}</strong><small>${escapeHtml(look("users", transfer.performedBy) || "System")} | ${escapeHtml(transfer.date || "No date")}</small>${transfer.notes ? `<p class="muted">${escapeHtml(transfer.notes)}</p>` : ""}</div></article>`;
}

function assetTransferEvent(transfer, asset) {
  return { id: transfer.id, title: assetTransferMessage(transfer), description: transfer.notes || `${transfer.from || "Unknown"} to ${transfer.to || "Unknown"}`, entityType: "asset", entityId: asset.id, severity: badgeClass(transfer.condition || asset.status), actorUserId: transfer.performedBy, createdAt: transfer.date || transfer.createdAt };
}

function assetTransferMessage(transfer) {
  const asset = rows("assets").find((item) => item.id === transfer.assetId);
  const actor = look("users", transfer.performedBy) || "IT";
  const action = labelize(transfer.movementType || "Updated");
  const target = transfer.toEmployeeId ? look("employees", transfer.toEmployeeId) : transfer.to;
  if (/temporary/i.test(action) && target) return `Temporary custody started with ${target}.`;
  if (/pending return/i.test(action)) return `${asset?.assetNumber || "Asset"} marked pending return.`;
  if (/disposed|dispose/i.test(action)) return `${asset?.assetNumber || "Asset"} disposed${target ? ` to ${target}` : ""}.`;
  if (/lost/i.test(action)) return `${asset?.assetNumber || "Asset"} marked lost.`;
  if (/stolen/i.test(action)) return `${asset?.assetNumber || "Asset"} marked stolen.`;
  if (/assign/i.test(action) && target) return `${actor} assigned ${asset?.assetNumber || "asset"} to ${target}.`;
  if (/return/i.test(action)) return `${asset?.assetNumber || "Asset"} returned to ${transfer.to || "IT Inventory"}.`;
  if (/maintenance|repair/i.test(action)) return `${asset?.assetNumber || "Asset"} moved to maintenance.`;
  return `${action}: ${asset?.assetNumber || "Asset"} moved from ${transfer.from || "Unknown"} to ${transfer.to || "Unknown"}.`;
}

function assetDisplayName(asset) {
  return [asset.brand, asset.model].filter(Boolean).join(" ") || asset.name || asset.assetNumber || "Asset";
}

function assetStatusOptions() {
  return [["available", "Available"], ["in_inventory", "Available"], ["reserved", "Reserved"], ["assigned", "Assigned"], ["temporary_custody", "Temporary Custody"], ["in_repair", "In Repair"], ["under_maintenance", "In Repair"], ["pending_return", "Pending Return"], ["lost", "Lost"], ["stolen", "Stolen"], ["retired", "Retired"], ["disposed", "Disposed"], ["archived", "Archived"]];
}

function assetStatusLabel(status) {
  return Object.fromEntries(assetStatusOptions())[status] || labelize(status || "available");
}

function assetStatusBadge(status) {
  const normalized = String(status || "").toLowerCase();
  if (["lost", "stolen"].includes(normalized)) return "critical";
  if (["pending_return", "disposed"].includes(normalized)) return "danger";
  if (["temporary_custody", "in_repair", "under_maintenance", "reserved"].includes(normalized)) return "warning";
  if (["assigned"].includes(normalized)) return "success";
  if (["retired", "archived"].includes(normalized)) return "neutral";
  return "info";
}

function assetHolderTypes() {
  return assetHolderTypeValues;
}

function assetPermanentCustodianId(asset) {
  return asset.permanentCustodianId || asset.custodianId || asset.currentOwnerId || "";
}

function assetCurrentHolderType(asset) {
  if (asset.currentHolderType) return asset.currentHolderType;
  if (asset.currentOwnerId) return "Person";
  if (asset.status === "under_maintenance" || asset.status === "in_repair") return "Vendor";
  return "IT Storage";
}

function assetCurrentHolderId(asset) {
  return asset.currentHolderId || asset.currentOwnerId || "";
}

function assetCurrentHolderLabel(asset) {
  const type = assetCurrentHolderType(asset);
  if (type === "Person") return look("employees", assetCurrentHolderId(asset)) || "No person holder";
  if (type === "Vendor") return look("vendors", asset.currentHolderVendorId) || asset.currentHolderName || look("vendors", asset.supplierId) || "Vendor";
  return asset.currentHolderName || type;
}

function assetAttentionLevel(asset) {
  if (["lost", "stolen"].includes(String(asset.status || "").toLowerCase())) return "critical";
  if (["pending_return", "disposed"].includes(asset.status)) return "action_required";
  if (["temporary_custody", "in_repair", "under_maintenance"].includes(asset.status) || assetWarrantyExpiring(asset)) return "warning";
  const stored = String(asset.attention || "").toLowerCase();
  if (stored && stored !== "normal") return stored;
  return "normal";
}

function assetAttentionLabel(asset) {
  return ({ normal: "Normal", warning: "Warning", action_required: "Action Required", critical: "Critical" })[assetAttentionLevel(asset)] || "Normal";
}

function assetAttentionBadge(asset) {
  return ({ normal: "success", warning: "warning", action_required: "danger", critical: "critical" })[assetAttentionLevel(asset)] || "info";
}

function assetNeedsAttention(asset) {
  return assetAttentionLevel(asset) !== "normal" || ["pending_return", "temporary_custody", "in_repair", "under_maintenance", "lost", "stolen", "disposed"].includes(asset.status);
}

function assetWarrantyExpiring(asset) {
  if (!asset.warrantyEndDate) return false;
  const days = Math.ceil((new Date(`${asset.warrantyEndDate}T00:00:00`).getTime() - new Date(`${today()}T00:00:00`).getTime()) / 86400000);
  return days >= 0 && days <= 30;
}

function assetWarrantyText(asset) {
  if (!asset.warrantyEndDate) return "No warranty date";
  const days = Math.ceil((new Date(`${asset.warrantyEndDate}T00:00:00`).getTime() - new Date(`${today()}T00:00:00`).getTime()) / 86400000);
  if (days < 0) return tpl("Expired {n} days ago", { n: Math.abs(days) });
  if (days === 0) return "Expires today";
  if (days <= 30) return tpl("Expires in {n} days", { n: days });
  return `Valid until ${asset.warrantyEndDate}`;
}

function assetRuleCards(asset) {
  const cards = [];
  if (asset.status === "pending_return") {
    cards.push(`<article class="asset-rule-card danger">${icon("warning")}<div><strong>Pending Return</strong><p>Employee left or this asset is expected back.</p></div></article>`);
  }
  if (asset.status === "temporary_custody") {
    cards.push(`<article class="asset-rule-card warning">${icon("transfers")}<div><strong>Temporary Custody</strong><p>${escapeHtml(assetPermanentCustodianId(asset) ? look("employees", assetPermanentCustodianId(asset)) : "No permanent custodian")} remains responsible. Current holder: ${escapeHtml(assetCurrentHolderLabel(asset))}${asset.expectedReturnDate ? `, expected back ${escapeHtml(asset.expectedReturnDate)}` : ""}.</p></div></article>`);
  }
  if (asset.status === "disposed") {
    cards.push(`<article class="asset-rule-card neutral">${icon("archive_center")}<div><strong>Disposed</strong><p>${escapeHtml(asset.disposalReason || "Disposed")} | Settlement: ${escapeHtml(asset.settlementStatus || "Not Required")} | To: ${escapeHtml(asset.disposedToName || asset.disposedToType || "Not recorded")}${asset.settlementDate ? ` | ${escapeHtml(asset.settlementDate)}` : ""}</p></div></article>`);
  }
  if (["lost", "stolen"].includes(asset.status)) {
    cards.push(`<article class="asset-rule-card critical">${icon("warning")}<div><strong>${escapeHtml(assetStatusLabel(asset.status))}</strong><p>Critical attention required. Confirm investigation, settlement, and replacement actions.</p></div></article>`);
  }
  return cards.length ? `<div class="asset-rule-grid">${cards.join("")}</div>` : "";
}

function assetWarrantyBadge(asset) {
  if (!asset.warrantyEndDate) return "";
  const days = Math.ceil((new Date(`${asset.warrantyEndDate}T00:00:00`).getTime() - new Date(`${today()}T00:00:00`).getTime()) / 86400000);
  if (days < 0) return '<span class="workspace-indicator critical">Warranty expired</span>';
  if (days <= 30) return `<span class="workspace-indicator warning">Warranty ${days}d</span>`;
  return "";
}

function updateAssetWorkspaceDraft(input) {
  const asset = rows("assets").find((item) => item.id === state.workspaceSelected.assets);
  if (!asset) return;
  const current = state.assetWorkspaceDraft?.id === asset.id ? state.assetWorkspaceDraft : { id: asset.id, permanentCustodianId: assetPermanentCustodianId(asset), currentHolderType: assetCurrentHolderType(asset), assignedTo: assetCurrentHolderId(asset), currentHolderName: asset.currentHolderName || "", status: asset.status || "available", location: asset.location || "" };
  state.assetWorkspaceDraft = { ...current, [input.dataset.assetDraftField]: input.value };
  if (input.dataset.assetDraftField === "currentHolderType") render();
}

async function saveAssetWorkspaceChanges(event) {
  event.preventDefault();
  const asset = rows("assets").find((item) => item.id === event.currentTarget.dataset.assetManagementForm);
  if (!asset) return;
  const values = Object.fromEntries(new FormData(event.currentTarget).entries());
  const disposing = values.status === "disposed";
  const holderType = disposing ? "Other" : values.currentHolderType || assetCurrentHolderType(asset);
  const holderId = disposing ? "" : values.assignedTo || "";
  const holderName = disposing ? values.currentHolderName || "Disposed" : holderType === "Person" ? look("employees", holderId) || "No person holder" : values.currentHolderName || holderType;
  const changes = [
    ["Permanent Custodian", look("employees", assetPermanentCustodianId(asset)) || "No custodian", look("employees", values.permanentCustodianId) || "No custodian"],
    ["Current Holder Type", assetCurrentHolderType(asset), holderType],
    ["Current Holder", assetCurrentHolderLabel(asset), holderName],
    ["Status", assetStatusLabel(asset.status), assetStatusLabel(values.status)],
    ["Location", asset.location || "Not set", values.location || "Not set"]
  ].filter(([, before, after]) => before !== after);
  if (!changes.length) {
    toast("No changes", "Assignment, status, and location are already up to date.");
    return;
  }
  const summary = changes.map(([label, before, after]) => `${label}: ${before} -> ${after}`).join("\n");
  const ok = await confirmDialog("Save asset changes?", summary, { confirmLabel: "Confirm", confirmClass: "btn-primary" });
  if (!ok) return;
  await api(`/api/assets/${asset.id}`, { method: "PATCH", body: JSON.stringify({
    permanentCustodianId: values.permanentCustodianId || "",
    currentHolderType: holderType,
    currentHolderName: holderType === "Person" ? "" : holderName,
    currentOwnerId: holderType === "Person" ? holderId : "",
    currentHolderId: holderType === "Person" ? holderId : "",
    status: values.status || asset.status,
    attention: assetAttentionLevel({ ...asset, status: values.status || asset.status }),
    location: values.location || ""
  }) });
  state.assetWorkspaceDraft = null;
  toast("Asset updated", "Assignment, status, and location were saved.");
  await loadState();
  render();
}

function openAssetTransferAction(assetId, action) {
  const asset = rows("assets").find((item) => item.id === assetId);
  if (!asset) return;
  const prefill = {
    movementType: action,
    assetId,
    fromEmployeeId: asset.currentOwnerId || "",
    fromLocation: asset.location || "",
    performedBy: state.user?.id,
    date: today(),
    condition: asset.condition || "good"
  };
  if (action === "Return") prefill.toLocation = "IT Inventory";
  if (action === "Maintenance") prefill.toLocation = "IT Workshop";
  openModal("transfers", null, prefill);
}

function openAssetWorkflowDialog(assetId, workflow) {
  const asset = rows("assets").find((item) => item.id === assetId);
  if (!asset) return;
  if (workflow === "print") {
    toast("Asset label ready", `${asset.assetNumber || "Asset"} label can be printed from the browser print dialog when label templates are enabled.`);
    return;
  }
  if (workflow === "ticket") {
    openModal("tickets", null, { relatedAssetId: asset.id, category: asset.type || "Hardware", description: `Support request for ${asset.assetNumber || assetDisplayName(asset)}.` });
    return;
  }
  if (asset.status === "disposed") {
    toast("Asset is disposed", "Disposed assets are read-only for lifecycle operations.");
    return;
  }
  const definition = assetWorkflowDefinition(workflow, asset);
  if (!definition) return;
  $("#menuHost").innerHTML = "";
  const template = $("#modalTemplate").content.cloneNode(true);
  const backdrop = $(".modal-backdrop", template);
  const modal = $(".modal", template);
  modal.classList.add("asset-workflow-modal");
  $(".close", template).innerHTML = icon("close");
  $(".eyebrow", template).textContent = "Asset workflow";
  $("h3", template).textContent = definition.title;
  $(".modal-fields", template).innerHTML = `<div class="form-error" data-form-error hidden></div><div class="asset-workflow-summary"><strong>${escapeHtml(asset.assetNumber || asset.id)}</strong><span>${escapeHtml(assetDisplayName(asset))}</span><small>${escapeHtml(assetStatusLabel(asset.status))} | ${escapeHtml(assetCurrentHolderLabel(asset))}</small></div>${definition.fields}`;
  const submit = $(".modal button[type='submit']", template);
  submit.textContent = definition.confirmLabel || "Continue";
  $$(".close", template).forEach((button) => button.addEventListener("click", () => backdrop.remove()));
  modal.addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const error = validateAssetWorkflow(form, workflow);
    if (error) {
      $("[data-form-error]", form).textContent = error;
      $("[data-form-error]", form).hidden = false;
      return;
    }
    const payload = assetWorkflowPayload(asset, workflow, Object.fromEntries(new FormData(form).entries()));
    const ok = await confirmDialog(definition.confirmTitle || "Confirm asset workflow?", assetWorkflowConfirmation(asset, workflow, payload), { confirmLabel: definition.confirmAction || "Confirm", confirmClass: workflow === "dispose" || workflow === "lost_stolen" ? "btn-danger" : "btn-primary" });
    if (!ok) return;
    try {
      await api("/api/transfers", { method: "POST", body: JSON.stringify(payload) });
      backdrop.remove();
      toast("Asset workflow completed", `${definition.title} was recorded.`);
      await loadState();
      render();
    } catch (err) {
      $("[data-form-error]", form).textContent = err.message;
      $("[data-form-error]", form).hidden = false;
      toast("Workflow failed", err.message);
    }
  });
  document.body.appendChild(template);
}

function workflowField(name, label, type = "text", options = {}) {
  const required = options.required ? ` <span class="required">*</span>` : "";
  const value = options.value || "";
  const placeholder = options.placeholder ? ` placeholder="${escapeHtml(options.placeholder)}"` : "";
  const help = options.help ? `<small class="field-help">${escapeHtml(options.help)}</small>` : "";
  const full = options.full ? "full" : "";
  if (type === "textarea") return `<label class="${full}">${fieldLabel(label, required)}<textarea name="${name}"${placeholder}>${escapeHtml(value)}</textarea>${help}</label>`;
  if (type === "checkbox") return `<label class="checkbox-field ${full}"><span>${fieldLabel(label, required)}</span><input name="${name}" type="checkbox" value="true" ${value ? "checked" : ""} /></label>`;
  if (type === "select") return `<label class="${full}">${fieldLabel(label, required)}<select name="${name}" ${options.required ? "required" : ""}>${(options.options || []).map((item) => Array.isArray(item) ? `<option value="${escapeHtml(item[0])}" ${String(value) === String(item[0]) ? "selected" : ""}>${escapeHtml(item[1])}</option>` : `<option value="${escapeHtml(item)}" ${String(value) === String(item) ? "selected" : ""}>${escapeHtml(item)}</option>`).join("")}</select>${help}</label>`;
  return `<label class="${full}">${fieldLabel(label, required)}<input name="${name}" type="${type}" value="${escapeHtml(value)}" ${options.required ? "required" : ""}${placeholder} />${help}</label>`;
}

function employeeWorkflowOptions() {
  return [["", "Choose employee"], ...rows("employees").map((person) => [person.id, person.name])];
}

function vendorWorkflowOptions() {
  return [["", "Choose vendor"], ...rows("vendors").map((vendor) => [vendor.id, vendor.name])];
}

function assetWorkflowDefinition(workflow, asset) {
  const todayValue = today();
  const note = (text) => `<div class="form-help full"><strong>${escapeHtml(text)}</strong><span>Review the confirmation page before saving. The lifecycle history will be appended.</span></div>`;
  const returnDestinations = asset.status === "temporary_custody" && asset.previousHolderId
    ? ["Previous Holder", "IT Storage", "Department Storage"]
    : ["IT Storage", "Department Storage"];
  const map = {
    assign: {
      title: "Assign Asset",
      confirmAction: "Assign Asset",
      fields: `${note("Step 1 - Choose employee")}${workflowField("toEmployeeId", "Employee", "select", { required: true, options: employeeWorkflowOptions() })}${workflowField("date", "Assignment date", "date", { required: true, value: todayValue })}${workflowField("notes", "Notes", "textarea", { full: true, placeholder: "Condition, accessories, or handover notes" })}`
    },
    transfer: {
      title: "Transfer Asset",
      confirmAction: "Transfer Asset",
      fields: `${workflowField("toEmployeeId", "New employee", "select", { required: true, options: employeeWorkflowOptions() })}${workflowField("reason", "Transfer reason", "text", { required: true })}${workflowField("date", "Transfer date", "date", { required: true, value: todayValue })}${workflowField("notes", "Notes", "textarea", { full: true })}`
    },
    temporary_custody: {
      title: "Temporary Custody",
      confirmAction: "Start Custody",
      fields: `${workflowField("toEmployeeId", "Temporary holder", "select", { required: true, options: employeeWorkflowOptions() })}${workflowField("date", "Start date", "date", { required: true, value: todayValue })}${workflowField("expectedReturnDate", "End date", "date", { required: true })}${workflowField("reason", "Reason", "text", { required: true })}${workflowField("notes", "Notes", "textarea", { full: true })}`
    },
    return: {
      title: "Return to IT Storage",
      confirmAction: "Return Asset",
      fields: `${workflowField("destination", "Destination", "select", { required: true, options: returnDestinations })}${workflowField("reason", "Reason", "text", { required: true })}${workflowField("condition", "Condition", "select", { options: ["good", "new", "damaged", "lost"] })}${workflowField("date", "Return date", "date", { required: true, value: todayValue })}${workflowField("accessories", "Accessories checklist", "textarea", { full: true, placeholder: "Charger, bag, keyboard, mouse..." })}${workflowField("notes", "Notes", "textarea", { full: true })}`
    },
    repair: {
      title: "Send to Repair",
      confirmAction: "Send to Repair",
      fields: `${workflowField("repairType", "Repair type", "select", { required: true, options: ["Internal repair", "Vendor repair"] })}${workflowField("vendorId", "Vendor", "select", { options: vendorWorkflowOptions() })}${workflowField("repairTicket", "Repair ticket")}${workflowField("warrantyRepair", "Warranty repair", "checkbox")}${workflowField("estimatedReturnDate", "Estimated return", "date")}${workflowField("cost", "Estimated cost", "number")}${workflowField("notes", "Repair notes", "textarea", { full: true, required: true })}`
    },
    lost_stolen: {
      title: "Mark Lost / Stolen",
      confirmAction: "Mark Asset",
      fields: `${workflowField("lossType", "Status", "select", { required: true, options: [["lost", "Lost"], ["stolen", "Stolen"]] })}${workflowField("reason", "Reason", "text", { required: true })}${workflowField("policeReport", "Police report reference")}${workflowField("date", "Date", "date", { required: true, value: todayValue })}${workflowField("notes", "Notes", "textarea", { full: true })}`
    },
    dispose: {
      title: "Dispose Asset",
      confirmAction: "Dispose Asset",
      fields: `${workflowField("disposalReason", "Disposal method", "select", { required: true, options: ["Sold to Employee", "Scrapped", "Destroyed", "Recycled", "Donated", "Other"] })}${workflowField("disposedToType", "Disposed to", "select", { required: true, options: ["Person", "Vendor", "Other"] })}${workflowField("disposedToName", "Disposed to name", "text", { required: true })}${workflowField("settlementAmount", "Settlement amount", "number")}${workflowField("settlementStatus", "Settlement status", "select", { options: assetSettlementStatuses })}${workflowField("settlementDate", "Settlement date", "date")}${workflowField("approvalReference", "Approval reference")}${workflowField("documentsText", "Documents", "textarea", { full: true, placeholder: "Final clearance, HR approval, finance settlement, disposal approval" })}${workflowField("notes", "Disposal notes", "textarea", { full: true })}`
    }
  };
  return map[workflow];
}

function validateAssetWorkflow(form, workflow) {
  const data = Object.fromEntries(new FormData(form).entries());
  if (["assign", "transfer", "temporary_custody"].includes(workflow) && !data.toEmployeeId) return "Choose an employee.";
  if (workflow === "temporary_custody" && !data.expectedReturnDate) return "End date is required.";
  if (workflow === "return" && !data.destination) return "Destination is required.";
  if (workflow === "repair" && !data.repairType) return "Repair type is required.";
  if (workflow === "lost_stolen" && !data.lossType) return "Choose Lost or Stolen.";
  if (workflow === "dispose" && (!data.disposalReason || !data.disposedToType || !data.disposedToName)) return "Disposal method, disposed to, and disposed to name are required.";
  return "";
}

function assetWorkflowPayload(asset, workflow, data) {
  const base = {
    assetId: asset.id,
    performedBy: state.user?.id,
    date: data.date || data.settlementDate || today(),
    fromEmployeeId: assetCurrentHolderType(asset) === "Person" ? assetCurrentHolderId(asset) : "",
    fromLocation: asset.location || assetCurrentHolderLabel(asset),
    condition: data.condition || asset.condition || "good",
    notes: data.notes || data.reason || ""
  };
  if (workflow === "assign") return { ...base, movementType: "Assign", toEmployeeId: data.toEmployeeId, permanentCustodianId: data.toEmployeeId, receiptType: "Asset Receipt", receiptName: `Asset receipt - ${asset.assetNumber || asset.id}` };
  if (workflow === "transfer") return { ...base, movementType: "Transfer", toEmployeeId: data.toEmployeeId, permanentCustodianId: data.toEmployeeId, reason: data.reason };
  if (workflow === "temporary_custody") return { ...base, movementType: "Temporary Custody", toEmployeeId: data.toEmployeeId, permanentCustodianId: assetPermanentCustodianId(asset), expectedReturnDate: data.expectedReturnDate, reason: data.reason };
  if (workflow === "return") return { ...base, movementType: "Return", toLocation: data.destination, destination: data.destination, reason: data.reason, accessories: data.accessories, receiptType: "Return Receipt", receiptName: `Return receipt - ${asset.assetNumber || asset.id}` };
  if (workflow === "repair") return { ...base, movementType: "Repair", repairType: data.repairType, vendorId: data.vendorId, to: data.repairType === "Vendor repair" ? look("vendors", data.vendorId) || "Vendor repair" : "Internal repair", repairTicket: data.repairTicket, warrantyRepair: data.warrantyRepair === "true", estimatedReturnDate: data.estimatedReturnDate, cost: data.cost };
  if (workflow === "lost_stolen") return { ...base, movementType: data.lossType === "stolen" ? "Stolen" : "Lost", reason: data.reason, policeReport: data.policeReport };
  if (workflow === "dispose") return { ...base, movementType: "Dispose", to: data.disposedToName, disposalReason: data.disposalReason, disposedToType: data.disposedToType, disposedToName: data.disposedToName, settlementAmount: data.settlementAmount, settlementStatus: data.settlementStatus, settlementDate: data.settlementDate, approvalReference: data.approvalReference, documentsText: data.documentsText };
  return base;
}

function assetWorkflowConfirmation(asset, workflow, payload) {
  const lines = [
    `Asset: ${asset.assetNumber || asset.id} - ${assetDisplayName(asset)}`,
    `Workflow: ${assetWorkflowDefinition(workflow, asset)?.title || labelize(workflow)}`,
    `Current holder: ${assetCurrentHolderLabel(asset)}`,
    payload.toEmployeeId ? `New holder: ${look("employees", payload.toEmployeeId)}` : "",
    payload.toLocation ? `Destination: ${payload.toLocation}` : "",
    payload.estimatedReturnDate || payload.expectedReturnDate ? `Expected return: ${payload.estimatedReturnDate || payload.expectedReturnDate}` : "",
    payload.disposalReason ? `Disposal: ${payload.disposalReason} to ${payload.disposedToName}` : "",
    "Timeline, audit, notifications, and lifecycle history will be recorded."
  ].filter(Boolean);
  return lines.join("\n");
}

function contractsWorkspacePage() {
  const data = contractsWorkspaceCollection();
  const selected = data.find((row) => row.id === state.workspaceSelected.contracts) || data[0] || null;
  if (selected) state.workspaceSelected.contracts = selected.id;
  return `
    ${workspaceIdentityHeader("contracts", has("contracts", "create") ? `<button class="btn btn-primary" data-add="contracts">${icon("plus")}New Contract</button>` : "")}
    <section class="ticket-workspace contract-workspace">
      <aside class="ticket-workspace-list-panel">
        <div class="ticket-workspace-list-tools"><input id="searchBox" placeholder="Search contracts, vendors, assets, licenses..." value="${escapeHtml(state.query)}" /></div>
        ${contractWorkspaceFilters()}
        <div class="ticket-workspace-list" aria-label="Contract list">
          ${data.map((contract) => contractWorkspaceItem(contract, selected?.id === contract.id)).join("") || emptyState("No contracts found", "Try changing search or filters.")}
        </div>
      </aside>
      <section class="ticket-workspace-detail-panel">${selected ? contractWorkspaceDetail(selected) : emptyState("No contract selected", "Choose a contract from the workspace list.")}</section>
    </section>
  `;
}

function contractsWorkspaceCollection() {
  const filters = typeof state.filters.contracts === "object" ? state.filters.contracts : {};
  const query = state.query.toLowerCase().trim();
  return collection("contracts").filter((contract) => {
    if (filters.status && contractLifecycleStatus(contract) !== filters.status && String(contract.status || "") !== filters.status) return false;
    if (filters.vendorId && contract.vendorId !== filters.vendorId) return false;
    if (filters.type && contract.type !== filters.type) return false;
    if (filters.renewal && contractRenewalHealth(contract) !== filters.renewal) return false;
    if (filters.renewalWindow === "soon" && !isRenewalSoon(contract)) return false;
    if (filters.departmentId && contract.ownerDepartmentId !== filters.departmentId && contract.departmentId !== filters.departmentId) return false;
    if (!query) return true;
    const vendor = look("vendors", contract.vendorId);
    const linkedAssets = contractLinkedAssets(contract).map((asset) => `${asset.assetNumber} ${asset.serialNumber} ${asset.model}`).join(" ");
    const licenses = contractLicenses(contract).join(" ");
    return [contractNumber(contract), contract.name, contract.type, contract.status, vendor, linkedAssets, licenses].join(" ").toLowerCase().includes(query);
  }).sort((a, b) => contractDaysRemaining(a) - contractDaysRemaining(b));
}

function contractWorkspaceFilters() {
  const filters = typeof state.filters.contracts === "object" ? state.filters.contracts : {};
  const option = (value, label, selected) => `<option value="${escapeHtml(value)}" ${String(selected) === String(value) ? "selected" : ""}>${escapeHtml(label)}</option>`;
  const statuses = contractStatusOptions();
  const renewal = ["Healthy", "90 Days", "60 Days", "30 Days", "Critical", "Expired"];
  const types = [...new Set(rows("contracts").map((contract) => contract.type).filter(Boolean))].sort();
  return `<div class="manager-ticket-filters contract-workspace-filters">
    <label class="manager-ticket-filter"><span>Status</span><select data-contract-filter="status"><option value="">All Status</option>${statuses.map((value) => option(value, labelize(value), filters.status)).join("")}</select></label>
    <label class="manager-ticket-filter"><span>Vendor</span><select data-contract-filter="vendorId"><option value="">All Vendors</option>${rows("vendors").map((vendor) => option(vendor.id, vendor.name, filters.vendorId)).join("")}</select></label>
    <label class="manager-ticket-filter"><span>Contract Type</span><select data-contract-filter="type"><option value="">All Types</option>${types.map((value) => option(value, value, filters.type)).join("")}</select></label>
    <label class="manager-ticket-filter"><span>Renewal Status</span><select data-contract-filter="renewal"><option value="">All Renewal</option>${renewal.map((value) => option(value, value, filters.renewal)).join("")}</select></label>
    <label class="manager-ticket-filter"><span>Department</span><select data-contract-filter="departmentId"><option value="">All Departments</option>${rows("departments").map((department) => option(department.id, department.name, filters.departmentId)).join("")}</select></label>
  </div>`;
}

function contractWorkspaceItem(contract, active) {
  return `
    <button class="ticket-workspace-item contract-workspace-item ${active ? "active" : ""}" data-contract-workspace-select="${contract.id}">
      <span class="workspace-item-top"><strong>${escapeHtml(contractNumber(contract))}</strong><span class="badge ${badgeClass(contractLifecycleStatus(contract))}">${escapeHtml(contractStatusLabel(contract))}</span></span>
      <span class="workspace-ticket-subject">${escapeHtml(contract.name || "Untitled contract")}</span>
      <span class="workspace-item-meta"><span>${escapeHtml(look("vendors", contract.vendorId) || "No vendor")}</span><span>${escapeHtml(contract.type || "Contract")}</span></span>
      <span class="workspace-ticket-indicators">${contractExpiryBadge(contract)}<span class="workspace-indicator ${contractRenewalBadgeClass(contract)}">${escapeHtml(contractDaysLabel(contract))}</span></span>
    </button>
  `;
}

function contractWorkspaceDetail(contract) {
  const tab = state.workspaceTab.contracts || "Overview";
  const tabs = ["Overview", "Renewals", "Documents", "Related Records", "Timeline"];
  const tabAliases = { Vendor: "Related Records", Assets: "Related Records", Costs: "Overview" };
  const safeTab = tabs.includes(tabAliases[tab] || tab) ? (tabAliases[tab] || tab) : "Overview";
  state.workspaceTab.contracts = safeTab;
  return `
    <header class="ticket-workspace-detail-head contract-detail-head">
      <div>
        <p class="eyebrow">${escapeHtml(contractNumber(contract))}</p>
        <h3>${escapeHtml(contract.name || "Untitled contract")}</h3>
        <p class="muted">${escapeHtml(look("vendors", contract.vendorId) || "No vendor")} | ${escapeHtml(contractDaysLabel(contract))} | ${escapeHtml(contractRenewalHealth(contract))}</p>
      </div>
      <div class="detail-head-actions">
        <span class="badge ${badgeClass(contractLifecycleStatus(contract))}">${escapeHtml(contractStatusLabel(contract))}</span>
        <span class="badge ${contractRenewalBadgeClass(contract)}">${escapeHtml(contractRenewalHealth(contract))}</span>
      </div>
    </header>
    ${contractSnapshotPanel(contract)}
    ${contractActionBar(contract)}
    <div class="tabs workspace-tabs">${tabs.map((item) => `<button class="tab ${safeTab === item ? "active" : ""}" data-contract-workspace-tab="${item}">${escapeHtml(item)}</button>`).join("")}</div>
    <div class="ticket-workspace-detail-body contract-workspace-body">${contractWorkspaceTabContent(contract, safeTab)}</div>
  `;
}

function contractSnapshotPanel(contract) {
  const snapshot = [
    ["Status", contractStatusLabel(contract)],
    ["Renewal Status", contractRenewalHealth(contract)],
    ["Days Remaining", contractDaysLabel(contract)],
    ["Vendor", look("vendors", contract.vendorId) || "No vendor"],
    ["Contract Owner", look("employees", contract.ownerEmployeeId) || look("users", contract.ownerUserId) || "Not assigned"],
    ["Contract Type", contract.type || "Contract"]
  ];
  return `<section class="surface-card contract-snapshot-panel">
    <div class="section-title"><div><p class="eyebrow">Contract Snapshot</p><h3>Renewal state</h3></div><span class="badge ${contractRenewalBadgeClass(contract)}">${escapeHtml(contractRenewalHealth(contract))}</span></div>
    <div class="contract-snapshot-grid">${snapshot.map(([label, value]) => `<div><small>${escapeHtml(label)}</small><strong>${escapeHtml(value || "Not set")}</strong></div>`).join("")}</div>
  </section>`;
}

function contractActionBar(contract) {
  const primary = [
    `<button class="btn btn-primary" type="button" data-contract-workflow="renew" data-id="${contract.id}">Renew</button>`,
    has("contracts", "edit") ? `<button class="btn btn-secondary" data-edit="contracts" data-id="${contract.id}">${icon("edit")}Edit</button>` : "",
    `<button class="btn btn-secondary" type="button" data-contract-workflow="upload_document" data-id="${contract.id}">Upload Document</button>`
  ].filter(Boolean);
  const more = [
    has("contracts", "archive") ? `<button class="btn btn-warning" data-archive="contracts" data-id="${contract.id}">${icon("archive_center")}Archive</button>` : "",
    `<button class="btn btn-secondary" type="button" data-contract-workflow="export" data-id="${contract.id}">Export</button>`,
    comingSoonButton("Duplicate"),
    has("contracts", "archive") ? `<button class="btn btn-danger" data-trash="contracts" data-id="${contract.id}">${icon("delete")}Delete</button>` : "",
    `<button class="btn btn-warning" type="button" data-contract-workflow="terminate" data-id="${contract.id}">Terminate</button>`,
    comingSoonButton("Approval routing")
  ].filter(Boolean);
  return `<div class="record-card-actions standard-workspace-actions contract-action-bar">
    ${primary.join("")}
    ${more.length ? `<details class="ticket-v2-more"><summary>${icon("more")}More</summary><div>${more.join("")}</div></details>` : ""}
  </div>`;
}

function contractCurrentStatePanel(contract) {
  const linkedAssets = contractLinkedAssets(contract);
  const annual = contractAnnualCost(contract);
  const monthly = contractMonthlyCost(contract);
  const cards = [
    ["Contract Status", contractHealthBadge(contractStatusLabel(contract), badgeClass(contractLifecycleStatus(contract)))],
    ["Renewal Health", contractHealthBadge(contractRenewalHealth(contract), contractRenewalBadgeClass(contract))],
    ["Days Remaining", contractHealthBadge(contractDaysLabel(contract), contractRenewalBadgeClass(contract))],
    ["Auto Renewal", contractHealthBadge(contract.autoRenewal ? "Enabled" : "Disabled", contract.autoRenewal ? "success" : "neutral")],
    ["Vendor", look("vendors", contract.vendorId) || "No vendor"],
    ["Contract Owner", look("employees", contract.ownerEmployeeId) || look("users", contract.ownerUserId) || "Not assigned"],
    ["Linked Assets", String(linkedAssets.length)],
    ["Linked Licenses", String(contractLicenses(contract).length)],
    ["Monthly Cost", formatMoney(monthly, contract.currency)],
    ["Annual Cost", formatMoney(annual, contract.currency)],
    ["Currency", contract.currency || "SAR"]
  ];
  return `<section class="surface-card asset-management-panel contract-state-panel"><div class="section-title"><div><p class="eyebrow">Contract Health</p><h4>Enterprise contract health panel</h4><p class="muted">Lifecycle, renewal, ownership, links, and financial exposure at a glance.</p></div></div><div class="asset-state-grid contract-state-grid">${cards.map(([label, value]) => `<div><small>${escapeHtml(label)}</small><strong>${String(value).includes("<span") ? value : escapeHtml(value)}</strong></div>`).join("")}</div></section>`;
}

function contractActionsSection(contract) {
  const actions = [
    ["renew", "Renew Contract"],
    ["terminate", "Terminate Contract"],
    ["upload_document", "Upload Document"],
    ["ticket", "Create Ticket"],
    ["assign_owner", "Assign Contract Owner"],
    ["link_assets", "Link Assets"],
    ["link_licenses", "Link Licenses"],
    ["export", "Export Contract"]
  ];
  return `<section class="surface-card asset-actions-panel contract-actions-panel"><div class="section-title"><div><p class="eyebrow">Contract Actions</p><h3>Workflow-driven action bar</h3><p class="muted">Operational changes are confirmed and recorded in audit, timeline, and notifications.</p></div></div><div class="asset-action-grid contract-action-grid">${actions.map(([action, label]) => `<button class="btn ${action === "terminate" ? "btn-warning" : "btn-secondary"}" type="button" data-contract-workflow="${action}" data-id="${contract.id}">${escapeHtml(label)}</button>`).join("")}</div></section>`;
}

function contractWorkspaceTabContent(contract, tab) {
  if (tab === "Renewals") return contractRenewalsTab(contract);
  if (tab === "Documents") return contractDocumentsTab(contract);
  if (tab === "Related Records" || tab === "Vendor" || tab === "Assets") return contractRelatedRecordsTab(contract);
  if (tab === "Timeline") return contractTimelineTab(contract);
  return contractOverviewTab(contract);
}

function contractOverviewTab(contract) {
  const vendor = rows("vendors").find((item) => item.id === contract.vendorId);
  const cards = [
    ["Description", [["Summary", contract.description || contract.notes || "No description provided"], ["Support SLA", contract.sla || "Not set"], ["Portal", contract.portalUrl || "Not set"]]],
    ["Financial Summary", [["Annual Cost", formatMoney(contractAnnualCost(contract), contract.currency)], ["Monthly Cost", formatMoney(contractMonthlyCost(contract), contract.currency)], ["Currency", contract.currency || "SAR"], ["Cost Center", contract.costCenter || "Not set"]]],
    ["Renewal Settings", [["Start Date", contract.startDate || "Not set"], ["End Date", contract.endDate || "Not set"], ["Reminder Date", contract.renewalReminderDate || "Not scheduled"], ["Auto Renewal", contract.autoRenewal ? "Enabled" : "Disabled"]]],
    ["Vendor Relationship", [["Contact", vendor?.contactPerson || "Not set"], ["Support Email", contract.supportEmail || vendor?.email || "Not set"], ["Support Phone", contract.supportPhone || vendor?.phone || "Not set"], ["Vendor Rating", vendor?.rating || "Not rated"]]],
    ["Linked Coverage", [["Linked Assets", contractLinkedAssets(contract).length], ["Linked Licenses", contractLicenses(contract).join(", ") || "No licenses"], ["Owner Department", look("departments", contract.ownerDepartmentId || contract.departmentId) || "Not set"]]]
  ];
  return `<section class="contract-overview-grid contract-focused-overview">${cards.map(([title, rows]) => contractInfoCard(title, rows)).join("")}</section>`;
}

function contractInfoCard(title, rowsList) {
  return `<article class="surface-card contract-info-card"><div class="section-title"><div><p class="eyebrow">${escapeHtml(title)}</p><h3>${escapeHtml(title)}</h3></div></div><dl>${rowsList.map(([label, value]) => `<div><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(String(value || "Not set"))}</dd></div>`).join("")}</dl></article>`;
}

function contractRenewalsTab(contract) {
  const history = contractRenewalHistory(contract);
  const upcoming = contract.endDate ? [[contract.endDate, contractRenewalHealth(contract), formatMoney(contractAnnualCost(contract), contract.currency), "Scheduled reminder"]] : [];
  return `<section class="contract-tab-grid renewal-center"><article class="surface-card"><div class="section-title"><div><p class="eyebrow">Renewal Center</p><h3>Next Renewal</h3></div><button class="btn btn-primary" data-contract-workflow="renew" data-id="${contract.id}">Renew Contract</button></div>${upcoming.map(([date, health, cost, note]) => `<div class="contract-list-row"><strong>${escapeHtml(date)}</strong><span class="badge ${contractRenewalBadgeClass(contract)}">${escapeHtml(health)}</span><span>${escapeHtml(cost)}</span><small>${escapeHtml(note)}</small></div>`).join("") || emptyState("No upcoming renewals", "Renewal dates will appear here.")}<div class="ticket-workspace-info contract-cost-grid compact"><div class="ticket-info-card"><small>Renewal Cost</small><strong>${escapeHtml(formatMoney(contractAnnualCost(contract), contract.currency))}</strong></div><div class="ticket-info-card"><small>Renewal Health</small><strong>${contractHealthBadge(contractRenewalHealth(contract), contractRenewalBadgeClass(contract))}</strong></div><div class="ticket-info-card"><small>Days Remaining</small><strong>${escapeHtml(contractDaysLabel(contract))}</strong></div></div></article><article class="surface-card"><div class="section-title"><div><p class="eyebrow">Previous Renewals</p><h3>Renewal History</h3><p class="muted">Renewal timeline, cost, renewed by, and notes.</p></div></div><div class="timeline-feed">${history.map((item) => `<article class="timeline-card"><div class="timeline-meta"><span>${escapeHtml(item.date || item.renewedAt || "Not dated")}</span><span>${escapeHtml(look("users", item.renewedBy) || "IT")}</span></div><strong>${escapeHtml(item.title || "Contract renewed")}</strong><p class="muted">${escapeHtml(item.notes || item.note || `Renewal cost ${formatMoney(item.cost || item.renewalCost, contract.currency)}`)}</p></article>`).join("") || emptyState("No renewal history", "Renewal workflow entries will appear here.")}</div></article></section>`;
}

function contractVendorTab(contract) {
  const vendor = rows("vendors").find((item) => item.id === contract.vendorId);
  const linkedContracts = rows("contracts").filter((item) => item.vendorId === contract.vendorId);
  if (!vendor) return emptyState("No vendor linked", "Assign a vendor to this contract.");
  return `<section class="contract-tab-grid"><article class="surface-card contract-info-card"><div class="section-title"><div><p class="eyebrow">Vendor Summary</p><h3>${escapeHtml(vendor.name)}</h3></div><div class="record-card-actions"><button class="btn btn-secondary" data-open-module="vendors" data-open-id="${vendor.id}">Open Vendor Workspace</button><button class="btn btn-secondary" data-contract-workflow="ticket" data-id="${contract.id}">Create Vendor Ticket</button></div></div><dl><div><dt>Vendor Name</dt><dd>${escapeHtml(vendor.name || "Not set")}</dd></div><div><dt>Primary Contact</dt><dd>${escapeHtml(vendor.contactPerson || "Not set")}</dd></div><div><dt>Support Email</dt><dd>${escapeHtml(vendor.email || contract.supportEmail || "Not set")}</dd></div><div><dt>Support Phone</dt><dd>${escapeHtml(vendor.phone || contract.supportPhone || "Not set")}</dd></div><div><dt>Portal URL</dt><dd>${escapeHtml(contract.portalUrl || "Not set")}</dd></div><div><dt>Vendor Rating</dt><dd>${escapeHtml(String(vendor.rating || "Not rated"))}</dd></div></dl></article><article class="surface-card"><div class="section-title"><div><p class="eyebrow">Related Contracts</p><h3>${escapeHtml(tpl("{n} contracts", { n: linkedContracts.length }))}</h3></div></div><div class="compact-list">${linkedContracts.map((item) => `<button class="contract-linked-row" data-contract-workspace-select="${item.id}"><strong>${escapeHtml(item.name)}</strong><span>${escapeHtml(contractNumber(item))}</span></button>`).join("")}</div></article></section>`;
}

function contractAssetsTab(contract) {
  const assets = contractLinkedAssets(contract);
  return `<section class="surface-card"><div class="section-title"><div><p class="eyebrow">Linked Assets</p><h3>${assets.length} linked assets</h3></div><button class="btn btn-secondary" data-contract-workflow="link_assets" data-id="${contract.id}">Link / Unlink Assets</button></div><div class="table-wrap"><table><thead><tr><th>Asset Number</th><th>Asset Name</th><th>Assigned To</th><th>Status</th><th>Warranty</th><th></th></tr></thead><tbody>${assets.map((asset) => `<tr><td><strong>${escapeHtml(asset.assetNumber || asset.id)}</strong></td><td>${escapeHtml(assetDisplayName(asset))}</td><td>${escapeHtml(assetCurrentHolderLabel(asset))}</td><td><span class="badge ${assetStatusBadge(asset.status)}">${escapeHtml(assetStatusLabel(asset.status))}</span></td><td>${assetWarrantyBadge(asset)}</td><td><button class="btn btn-secondary" data-open-module="assets" data-open-id="${asset.id}">Open</button></td></tr>`).join("") || `<tr><td colspan="6">${emptyState("No linked assets", "Link assets covered by this contract.")}</td></tr>`}</tbody></table></div></section>`;
}

function contractRelatedRecordsTab(contract) {
  return `<section class="contract-related-grid">
    ${contractVendorTab(contract)}
    ${contractAssetsTab(contract)}
    <section class="surface-card"><div class="section-title"><div><p class="eyebrow">Linked Licenses</p><h3>${contractLicenses(contract).length} licenses</h3></div><button class="btn btn-secondary" data-contract-workflow="link_licenses" data-id="${contract.id}">Link Licenses</button></div><div class="compact-list">${contractLicenses(contract).map((license) => `<article class="contract-list-row"><strong>${escapeHtml(license)}</strong><span>License</span></article>`).join("") || emptyState("No linked licenses", "Covered software licenses will appear here.")}</div></section>
  </section>`;
}

function contractDocumentsTab(contract) {
  const docs = contractDocuments(contract);
  return `<section class="surface-card"><div class="section-title"><div><p class="eyebrow">Documents</p><h3>Contract files and versions</h3><p class="muted">Signed contracts, invoices, purchase orders, renewal quotes, support agreements, and certificates.</p></div><button class="btn btn-secondary" data-contract-workflow="upload_document" data-id="${contract.id}">Upload Document</button></div><div class="attachment-list">${docs.map((doc) => `<article class="file-card"><div class="file-card-main">${icon("documents")}<span><strong>${escapeHtml(doc.title || doc.filename || "Contract document")}</strong><small>${escapeHtml(doc.templateType || doc.status || "Document")} | Version ${escapeHtml(String(doc.version || 1))}</small></span></div><div class="record-card-actions"><button class="btn btn-secondary" data-download-generated="${doc.id}">${icon("download")}Download</button></div></article>`).join("") || emptyState("No documents", "Upload signed contracts, invoices, quotes, support agreements, and certificates.")}</div></section>`;
}

function contractCostsTab(contract) {
  const annual = contractAnnualCost(contract);
  const monthly = contractMonthlyCost(contract);
  const forecast = Number(contract.forecast || (annual ? annual * 2 : 0));
  const totalSpend = Number(contract.totalSpend || contract.runningTotal || annual);
  const cards = [["Purchase Cost", contract.purchaseCost || contract.cost], ["Monthly Cost", monthly], ["Annual Cost", annual], ["Currency", contract.currency || "SAR"], ["Budget Code", contract.budgetCode || "Not set"], ["Cost Center", contract.costCenter || "Not set"], ["Forecast", forecast], ["Total Spend", totalSpend]];
  return `<section class="ticket-workspace-info contract-cost-grid">${cards.map(([label, value]) => `<div class="ticket-info-card"><small>${escapeHtml(label)}</small><strong>${typeof value === "number" ? escapeHtml(formatMoney(value, contract.currency)) : escapeHtml(String(value || "Not set"))}</strong></div>`).join("")}</section>`;
}

function contractTimelineTab(contract) {
  const items = rows("timeline").filter((item) => ["contract", "contracts"].includes(item.entityType) && item.entityId === contract.id);
  return `<div class="timeline-feed">${items.map((item) => `<article class="timeline-card"><div class="timeline-meta"><span>${escapeHtml(look("users", item.actorUserId) || "System")}</span><span>${new Date(item.createdAt).toLocaleString()}</span></div><strong>${escapeHtml(contractTimelineTitle(item.title))}</strong><p class="muted">${escapeHtml(item.description || "")}</p></article>`).join("") || emptyState("No timeline yet", "Contract workflow events will appear here.")}</div>`;
}

function contractNumber(contract) {
  return contract.contractNumber || contract.number || `CON-${String(contract.id || "").replace(/\D/g, "").slice(-4).padStart(4, "0") || contract.id}`;
}

function contractStatusOptions() {
  return ["draft", "pending_approval", "active", "expiring_soon", "expired", "renewed", "terminated", "archived"];
}

function contractLifecycleStatus(contract) {
  const status = String(contract.status || "active").toLowerCase();
  const days = contractDaysRemaining(contract);
  if (contract.archivedAt) return "archived";
  if (status === "renewal_due") return "expiring_soon";
  if (days < 0 && !["terminated", "archived"].includes(status)) return "expired";
  if (days <= 30 && status === "active") return "expiring_soon";
  return status.replace(/\s+/g, "_");
}

function contractStatusLabel(contract) {
  return ({ pending_approval: "Pending Approval", expiring_soon: "Expiring Soon", renewal_due: "Expiring Soon" })[contractLifecycleStatus(contract)] || labelize(contractLifecycleStatus(contract));
}

function contractDaysRemaining(contract) {
  if (!contract.endDate) return 99999;
  return Math.ceil((new Date(`${contract.endDate}T00:00:00`).getTime() - new Date(`${today()}T00:00:00`).getTime()) / 86400000);
}

function contractDaysLabel(contract) {
  const days = contractDaysRemaining(contract);
  if (days === 99999) return "No end date";
  if (days < 0) return tpl("{n} days expired", { n: Math.abs(days) });
  if (days === 0) return "Expires today";
  return tpl("{n} days", { n: days });
}

function contractRenewalHealth(contract) {
  const days = contractDaysRemaining(contract);
  if (days < 0) return "Expired";
  if (days <= 7) return "Critical";
  if (days <= 30) return "30 Days";
  if (days <= 60) return "60 Days";
  if (days <= 90) return "90 Days";
  return "Healthy";
}

function contractRenewalBadgeClass(contract) {
  const health = contractRenewalHealth(contract);
  return health === "Expired" || health === "Critical" ? "critical" : health === "30 Days" || health === "60 Days" ? "warning" : health === "90 Days" ? "info" : "success";
}

function contractExpiryBadge(contract) {
  return `<span class="workspace-indicator ${contractRenewalBadgeClass(contract)}">${escapeHtml(contractRenewalHealth(contract))}</span>`;
}

function contractHealthBadge(label, tone) {
  return `<span class="badge ${escapeHtml(tone || "neutral")}">${escapeHtml(label)}</span>`;
}

function contractAnnualCost(contract) {
  return Number(contract.annualCost || contract.annualRenewal || contract.cost || 0);
}

function contractMonthlyCost(contract) {
  return Number(contract.monthlyCost || (contractAnnualCost(contract) ? contractAnnualCost(contract) / 12 : 0));
}

function formatMoney(value, currency = "SAR") {
  const amount = Number(value || 0);
  if (!amount) return `0 ${currency || "SAR"}`;
  return `${amount.toLocaleString(undefined, { maximumFractionDigits: 2 })} ${currency || "SAR"}`;
}

function contractLinkedAssets(contract) {
  const ids = new Set([...(contract.linkedAssetIds || []), ...(contract.assets || []), ...(contract.assetIds || [])]);
  return rows("assets").filter((asset) => ids.has(asset.id) || asset.contractId === contract.id || asset.supportContractId === contract.id || asset.supplierId === contract.vendorId && contract.type === "Support");
}

function contractLicenses(contract) {
  if (Array.isArray(contract.linkedLicenses)) return contract.linkedLicenses;
  if (Array.isArray(contract.licenses)) return contract.licenses;
  return String(contract.licensesText || "").split(",").map((item) => item.trim()).filter(Boolean);
}

function contractRenewalHistory(contract) {
  return Array.isArray(contract.renewalHistory) ? contract.renewalHistory : [];
}

function contractDocuments(contract) {
  return rows("documents").filter((doc) => (doc.linkedType === "contract" || doc.linkedType === "contracts") && doc.linkedId === contract.id);
}

function contractTimelineTitle(title) {
  const normalized = String(title || "").toLowerCase();
  if (normalized.includes("renew")) return "Contract renewed";
  if (normalized.includes("terminate")) return "Contract terminated";
  if (normalized.includes("vendor")) return "Vendor changed";
  if (normalized.includes("price") || normalized.includes("cost")) return "Price updated";
  if (normalized.includes("document")) return "Document uploaded";
  if (normalized.includes("asset")) return "Linked asset updated";
  if (normalized.includes("approval")) return "Renewal approval requested";
  if (normalized.includes("ticket")) return "Ticket created";
  if (normalized.includes("create")) return "Contract created";
  return labelize(title || "Contract activity");
}

function contractInfoForExport(contract) {
  return `${contractNumber(contract)}\n${contract.name}\nVendor: ${look("vendors", contract.vendorId) || "Not set"}\nStatus: ${contractStatusLabel(contract)}\nEnd date: ${contract.endDate || "Not set"}\nAnnual cost: ${formatMoney(contractAnnualCost(contract), contract.currency)}`;
}

function contractWorkflowField(name, label, type = "text", options = {}) {
  const required = options.required ? ` <span class="required">*</span>` : "";
  const value = options.value || "";
  const full = options.full || type === "textarea" ? "full" : "";
  if (type === "textarea") return `<label class="${full}">${escapeHtml(label)}${required}<textarea name="${name}" ${options.required ? "required" : ""} placeholder="${escapeHtml(options.placeholder || "")}">${escapeHtml(value)}</textarea></label>`;
  if (type === "select") return `<label class="${full}">${escapeHtml(label)}${required}<select name="${name}" ${options.required ? "required" : ""}>${(options.options || []).map((option) => Array.isArray(option) ? `<option value="${escapeHtml(option[0])}" ${value === option[0] ? "selected" : ""}>${escapeHtml(option[1])}</option>` : `<option value="${escapeHtml(option)}" ${value === option ? "selected" : ""}>${escapeHtml(option)}</option>`).join("")}</select></label>`;
  if (type === "checkboxes") return `<fieldset class="full contract-checkbox-grid"><legend>${escapeHtml(label)}${required}</legend>${(options.options || []).map((option) => `<label><input type="checkbox" name="${name}" value="${escapeHtml(option.value)}" ${option.checked ? "checked" : ""}> <span>${escapeHtml(option.label)}</span></label>`).join("")}</fieldset>`;
  return `<label class="${full}">${escapeHtml(label)}${required}<input name="${name}" type="${type}" value="${escapeHtml(value)}" ${options.required ? "required" : ""} placeholder="${escapeHtml(options.placeholder || "")}" /></label>`;
}

function openContractWorkflowDialog(contractId, workflow) {
  const contract = rows("contracts").find((item) => item.id === contractId);
  if (!contract) return;
  if (workflow === "upload_document") {
    toast("Available in a future version", "This action is available in a future version.");
    return;
  }
  if (workflow === "ticket") {
    confirmDialog("Create vendor ticket?", `Create a support ticket for ${contractNumber(contract)} - ${contract.name}?`, { confirmText: "Create Ticket" }).then((ok) => {
      if (ok) openModal("tickets", null, { category: "Vendor", priority: "medium", description: `Contract support request for ${contractNumber(contract)} - ${contract.name}` });
    });
    return;
  }
  if (workflow === "export") {
    confirmDialog("Export contract?", `Export a compact summary for ${contractNumber(contract)}?`, { confirmText: "Export" }).then((ok) => {
      if (!ok) return;
      navigator.clipboard?.writeText(contractInfoForExport(contract));
      toast("Contract exported", "A compact contract summary was copied to the clipboard.");
    });
    return;
  }
  const def = contractWorkflowDefinition(contract, workflow);
  if (!def) return;
  const host = $("#modalHost") || $("#menuHost");
  if (!host) return;
  host.innerHTML = `<div class="modal-backdrop"><form class="modal surface-card contract-workflow-modal"><div class="modal-head"><div><p class="eyebrow">Contract workflow</p><h3>${escapeHtml(def.title)}</h3><p class="muted">${escapeHtml(def.subtitle || "")}</p></div><button type="button" class="icon-btn close" aria-label="Close">${icon("close")}</button></div><div class="modal-fields"><div class="form-error" data-form-error hidden></div><div class="asset-workflow-summary"><strong>${escapeHtml(contractNumber(contract))}</strong><span>${escapeHtml(contract.name || "Contract")}</span><small>${escapeHtml(contractStatusLabel(contract))} | ${escapeHtml(contractRenewalHealth(contract))}</small></div>${def.fields}</div><div class="modal-actions"><button type="button" class="btn btn-secondary close">Cancel</button><button type="submit" class="btn btn-primary">${escapeHtml(def.confirmAction || "Continue")}</button></div></form></div>`;
  const form = $(".modal", host);
  $$(".close", form).forEach((button) => button.addEventListener("click", () => host.innerHTML = ""));
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const body = { workflow };
    for (const [key, value] of data.entries()) {
      if (body[key]) body[key] = Array.isArray(body[key]) ? [...body[key], value] : [body[key], value];
      else body[key] = value;
    }
    const error = validateContractWorkflow(workflow, body);
    const errorBox = $("[data-form-error]", form);
    if (error) {
      errorBox.textContent = error;
      errorBox.hidden = false;
      return;
    }
    const confirmed = await confirmDialog(def.title, contractWorkflowConfirmation(contract, workflow, body), { confirmText: def.confirmAction || "Confirm" });
    if (!confirmed) return;
    await api(`/api/contracts/${contract.id}/workflow`, { method: "PATCH", body: JSON.stringify(body) });
    host.innerHTML = "";
    await loadState();
    toast("Contract updated", `${contractNumber(contract)} workflow was recorded.`);
    render();
  });
}

function contractWorkflowDefinition(contract, workflow) {
  const employees = [["", "Choose owner"], ...rows("employees").map((employee) => [employee.id, employee.name])];
  const departments = [["", "Choose department"], ...rows("departments").map((department) => [department.id, department.name])];
  const assetOptions = rows("assets").map((asset) => ({ value: asset.id, label: `${asset.assetNumber || asset.id} - ${assetDisplayName(asset)}`, checked: contractLinkedAssets(contract).some((item) => item.id === asset.id) }));
  const map = {
    renew: { title: "Renew Contract", confirmAction: "Renew Contract", subtitle: "Record renewal dates, cost, and notes.", fields: `${contractWorkflowField("newStartDate", "New start date", "date", { value: contract.endDate || today() })}${contractWorkflowField("newEndDate", "New end date", "date", { required: true })}${contractWorkflowField("renewalCost", "Renewal cost", "number", { value: contractAnnualCost(contract) || "" })}${contractWorkflowField("notes", "Renewal notes", "textarea", { full: true })}` },
    terminate: { title: "Terminate Contract", confirmAction: "Terminate Contract", subtitle: "Terminate the contract and preserve history.", fields: `${contractWorkflowField("terminationDate", "Termination date", "date", { required: true, value: today() })}${contractWorkflowField("reason", "Termination reason", "textarea", { required: true, full: true })}` },
    upload_document: { title: "Upload Document", confirmAction: "Create Document Record", subtitle: "Create a linked document placeholder for the contract file.", fields: `${contractWorkflowField("documentTitle", "Document title", "text", { required: true, placeholder: "Signed contract, invoice, certificate..." })}${contractWorkflowField("documentType", "Document type", "select", { options: ["Signed Contract", "Invoice", "Purchase Order", "Renewal Quote", "Support Agreement", "Certificate"] })}${contractWorkflowField("fileName", "File name", "text")}${contractWorkflowField("notes", "Notes", "textarea", { full: true })}` },
    link_assets: { title: "Link Assets", confirmAction: "Save Links", subtitle: "Link or unlink assets covered by this contract.", fields: `${contractWorkflowField("assetIds", "Assets", "checkboxes", { options: assetOptions })}` },
    link_licenses: { title: "Link Licenses", confirmAction: "Save Licenses", subtitle: "Store software license names covered by this contract.", fields: `${contractWorkflowField("licensesText", "Licenses", "textarea", { full: true, placeholder: "Microsoft 365 Business Premium\nVisio\nAdobe Acrobat", value: contractLicenses(contract).join("\n") })}` },
    assign_owner: { title: "Assign Contract Owner", confirmAction: "Assign Owner", subtitle: "Set the operational owner and owner department.", fields: `${contractWorkflowField("ownerEmployeeId", "Contract owner", "select", { required: true, options: employees, value: contract.ownerEmployeeId || "" })}${contractWorkflowField("ownerDepartmentId", "Owner department", "select", { options: departments, value: contract.ownerDepartmentId || contract.departmentId || "" })}` },
    request_approval: { title: "Request Approval", confirmAction: "Request Approval", subtitle: "Move the contract to pending approval.", fields: `${contractWorkflowField("approvalNotes", "Approval notes", "textarea", { full: true, required: true })}` }
  };
  return map[workflow];
}

function validateContractWorkflow(workflow, body) {
  if (workflow === "renew" && !body.newEndDate) return "New end date is required.";
  if (workflow === "terminate" && (!body.terminationDate || !body.reason)) return "Termination date and reason are required.";
  if (workflow === "upload_document" && !body.documentTitle) return "Document title is required.";
  if (workflow === "assign_owner" && !body.ownerEmployeeId) return "Contract owner is required.";
  if (workflow === "request_approval" && !body.approvalNotes) return "Approval notes are required.";
  return "";
}

function contractWorkflowConfirmation(contract, workflow, body) {
  const lines = [`Contract: ${contractNumber(contract)} - ${contract.name}`, `Workflow: ${contractWorkflowDefinition(contract, workflow)?.title || labelize(workflow)}`];
  if (body.newEndDate) lines.push(`New end date: ${body.newEndDate}`);
  if (body.terminationDate) lines.push(`Termination date: ${body.terminationDate}`);
  if (body.ownerEmployeeId) lines.push(`Owner: ${look("employees", body.ownerEmployeeId)}`);
  if (body.assetIds) lines.push(`Linked assets: ${Array.isArray(body.assetIds) ? body.assetIds.length : 1}`);
  lines.push("Timeline, audit, and notifications will be recorded.");
  return lines.join("\n");
}

function vendorsWorkspacePage() {
  const data = vendorsWorkspaceCollection();
  const selected = data.find((row) => row.id === state.workspaceSelected.vendors) || data[0] || null;
  if (selected) state.workspaceSelected.vendors = selected.id;
  return `
    ${workspaceIdentityHeader("vendors", has("vendors", "create") ? `<button class="btn btn-primary" data-add="vendors">${icon("plus")}New Vendor</button>` : "")}
    <section class="ticket-workspace vendor-workspace">
      <aside class="ticket-workspace-list-panel">
        <div class="ticket-workspace-list-tools"><input id="searchBox" placeholder="Search vendors, contacts, email, category..." value="${escapeHtml(state.query)}" /></div>
        ${vendorWorkspaceFilters()}
        <div class="ticket-workspace-list" aria-label="Vendor list">
          ${data.map((vendor) => vendorWorkspaceItem(vendor, selected?.id === vendor.id)).join("") || emptyState("No vendors found", "Try changing search or filters.")}
        </div>
      </aside>
      <section class="ticket-workspace-detail-panel">${selected ? vendorWorkspaceDetail(selected) : emptyState("No vendor selected", "Choose a vendor from the workspace list.")}</section>
    </section>
  `;
}

function vendorsWorkspaceCollection() {
  const filters = typeof state.filters.vendors === "object" ? state.filters.vendors : {};
  const query = state.query.toLowerCase().trim();
  return collection("vendors").filter((vendor) => {
    if (filters.status && vendorStatus(vendor) !== filters.status) return false;
    if (filters.category && vendorCategory(vendor) !== filters.category) return false;
    if (filters.criticality && vendorCriticality(vendor) !== filters.criticality) return false;
    if (filters.owner && vendorOwnerLabel(vendor) !== filters.owner && vendor.ownerEmployeeId !== filters.owner && vendor.ownerUserId !== filters.owner) return false;
    if (filters.supportType && vendorSupportType(vendor) !== filters.supportType) return false;
    if (filters.country && String(vendor.country || "") !== filters.country) return false;
    if (filters.rating && String(vendor.rating || "") !== filters.rating) return false;
    if (!query) return true;
    const contact = vendorPrimaryContact(vendor);
    return [vendor.name, vendor.contactPerson, vendor.email, contact.name, contact.email, vendorCategory(vendor), vendor.servicesText, (vendor.services || []).join(" ")].join(" ").toLowerCase().includes(query);
  }).sort((a, b) => vendorHealthSort(a) - vendorHealthSort(b) || String(a.name || "").localeCompare(String(b.name || "")));
}

function vendorWorkspaceFilters() {
  const filters = typeof state.filters.vendors === "object" ? state.filters.vendors : {};
  const option = (value, label, selected) => `<option value="${escapeHtml(value)}" ${String(selected) === String(value) ? "selected" : ""}>${escapeHtml(label)}</option>`;
  const unique = (values) => [...new Set(values.filter(Boolean))].sort();
  const categories = unique(rows("vendors").map(vendorCategory));
  const owners = unique(rows("vendors").map(vendorOwnerLabel));
  const supportTypes = unique(rows("vendors").map(vendorSupportType));
  const countries = unique(rows("vendors").map((vendor) => vendor.country));
  return `<div class="manager-ticket-filters vendor-workspace-filters">
    <label class="manager-ticket-filter"><span>Status</span><select data-vendor-filter="status"><option value="">All Status</option>${["active", "attention", "critical", "inactive"].map((value) => option(value, labelize(value), filters.status)).join("")}</select></label>
    <label class="manager-ticket-filter"><span>Category</span><select data-vendor-filter="category"><option value="">All Categories</option>${categories.map((value) => option(value, value, filters.category)).join("")}</select></label>
    <label class="manager-ticket-filter"><span>Criticality</span><select data-vendor-filter="criticality"><option value="">All Criticality</option>${["Critical", "High", "Medium", "Low"].map((value) => option(value, value, filters.criticality)).join("")}</select></label>
    <label class="manager-ticket-filter"><span>Vendor Owner</span><select data-vendor-filter="owner"><option value="">All Owners</option>${owners.map((value) => option(value, value, filters.owner)).join("")}</select></label>
    <label class="manager-ticket-filter"><span>Support Type</span><select data-vendor-filter="supportType"><option value="">All Support</option>${supportTypes.map((value) => option(value, value, filters.supportType)).join("")}</select></label>
    <label class="manager-ticket-filter"><span>Country</span><select data-vendor-filter="country"><option value="">All Countries</option>${countries.map((value) => option(value, value, filters.country)).join("")}</select></label>
    <label class="manager-ticket-filter"><span>Rating</span><select data-vendor-filter="rating"><option value="">All Ratings</option>${unique(rows("vendors").map((vendor) => String(vendor.rating || ""))).map((value) => option(value, `${value} star${value === "1" ? "" : "s"}`, filters.rating)).join("")}</select></label>
  </div>`;
}

function vendorWorkspaceItem(vendor, active) {
  const contracts = vendorContracts(vendor);
  return `
    <button class="ticket-workspace-item contract-workspace-item vendor-workspace-item ${active ? "active" : ""}" data-vendor-workspace-select="${vendor.id}">
      <span class="workspace-item-top"><strong>${escapeHtml(vendor.name || "Untitled vendor")}</strong><span class="badge ${vendorHealthBadgeClass(vendor)}">${escapeHtml(vendorHealth(vendor))}</span></span>
      <span class="workspace-ticket-subject">${escapeHtml(vendorCategory(vendor))}</span>
      <span class="workspace-item-meta"><span>${escapeHtml(vendorPrimaryContact(vendor).name || vendor.contactPerson || "No contact")}</span><span>${escapeHtml(vendorStatusLabel(vendor))}</span></span>
      <span class="workspace-ticket-indicators"><span class="workspace-indicator info">${escapeHtml(tpl("{n} active contracts", { n: contracts.filter((contract) => !["terminated", "expired", "archived"].includes(contractLifecycleStatus(contract))).length }))}</span><span class="workspace-indicator ${vendorCriticality(vendor) === "Critical" ? "critical" : "neutral"}">${escapeHtml(vendorCriticality(vendor))}</span></span>
    </button>
  `;
}

function vendorWorkspaceDetail(vendor) {
  const tab = state.workspaceTab.vendors || "Overview";
  const tabs = ["Overview", "Contacts", "Contracts", "Assets", "Tickets", "Documents", "Timeline"];
  const safeTab = tabs.includes(tab) ? tab : "Overview";
  state.workspaceTab.vendors = safeTab;
  return `
    <header class="ticket-workspace-detail-head vendor-detail-head">
      <div>
        <p class="eyebrow">${escapeHtml(vendorCategory(vendor))}</p>
        <h3>${escapeHtml(vendor.name || "Untitled vendor")}</h3>
        <p class="muted">${escapeHtml(vendorPrimaryContact(vendor).name || vendor.contactPerson || "No primary contact")} | ${vendorContracts(vendor).length} contracts | ${vendorAssets(vendor).length} linked assets | ${vendorTickets(vendor).length} open tickets</p>
      </div>
      <div class="detail-head-actions">
        <span class="badge ${badgeClass(vendorStatus(vendor))}">${escapeHtml(vendorStatusLabel(vendor))}</span>
        <span class="badge ${vendorHealthBadgeClass(vendor)}">${escapeHtml(vendorHealth(vendor))}</span>
      </div>
    </header>
    ${vendorSnapshotPanel(vendor)}
    ${vendorActionBar(vendor)}
    <div class="tabs workspace-tabs">${tabs.map((item) => `<button class="tab ${safeTab === item ? "active" : ""}" data-vendor-workspace-tab="${item}">${escapeHtml(item)}</button>`).join("")}</div>
    <div class="ticket-workspace-detail-body vendor-workspace-body">${vendorWorkspaceTabContent(vendor, safeTab)}</div>
  `;
}

function vendorSnapshotPanel(vendor) {
  const snapshot = [
    ["Health", vendorHealth(vendor)],
    ["Primary Contact", vendorPrimaryContact(vendor).name || vendor.contactPerson || "Not set"],
    ["Contract Count", String(vendorContracts(vendor).length)],
    ["Covered Assets", String(vendorAssets(vendor).length)],
    ["Open Tickets", String(vendorTickets(vendor).length)],
    ["Last Interaction", vendorLastActivity(vendor)]
  ];
  return `<section class="surface-card vendor-snapshot-panel">
    <div class="section-title"><div><p class="eyebrow">Vendor Snapshot</p><h3>Relationship health</h3></div><span class="badge ${vendorHealthBadgeClass(vendor)}">${escapeHtml(vendorHealth(vendor))}</span></div>
    <div class="vendor-snapshot-grid">${snapshot.map(([label, value]) => `<div><small>${escapeHtml(label)}</small><strong>${escapeHtml(value || "Not set")}</strong></div>`).join("")}</div>
  </section>`;
}

function vendorActionBar(vendor) {
  const primary = [
    `<button class="btn btn-primary" type="button" data-vendor-workflow="portal" data-id="${vendor.id}">Contact Vendor</button>`,
    `<button class="btn btn-secondary" type="button" data-vendor-workflow="contract" data-id="${vendor.id}">Create Contract</button>`,
    `<button class="btn btn-secondary" type="button" data-vendor-workflow="add_contact" data-id="${vendor.id}">Add Contact</button>`
  ];
  const more = [
    has("vendors", "archive") ? `<button class="btn btn-warning" data-archive="vendors" data-id="${vendor.id}">${icon("archive_center")}Archive</button>` : "",
    `<button class="btn btn-secondary" type="button" data-vendor-workflow="export" data-id="${vendor.id}">Export</button>`,
    comingSoonButton("Merge"),
    has("vendors", "archive") ? `<button class="btn btn-danger" data-trash="vendors" data-id="${vendor.id}">${icon("delete")}Delete</button>` : "",
    comingSoonButton("Vendor portal sync")
  ].filter(Boolean);
  return `<div class="record-card-actions standard-workspace-actions vendor-action-bar">
    ${primary.join("")}
    ${more.length ? `<details class="ticket-v2-more"><summary>${icon("more")}More</summary><div>${more.join("")}</div></details>` : ""}
  </div>`;
}

function vendorHeaderFacts(vendor) {
  const facts = [
    ["Primary Contact", vendorPrimaryContact(vendor).name || vendor.contactPerson || "Not set"],
    ["Contract Count", String(vendorContracts(vendor).length)],
    ["Linked Assets", String(vendorAssets(vendor).length)],
    ["Open Tickets", String(vendorTickets(vendor).length)],
    ["Last Activity", vendorLastActivity(vendor)]
  ];
  return `<section class="ticket-workspace-info vendor-header-facts">${facts.map(([label, value]) => `<div class="ticket-info-card"><small>${escapeHtml(label)}</small><strong>${escapeHtml(value)}</strong></div>`).join("")}</section>`;
}

function vendorHealthPanel(vendor) {
  const contracts = vendorContracts(vendor);
  const expiring = contracts.filter((contract) => contractDaysRemaining(contract) <= 30 && contractDaysRemaining(contract) >= 0);
  const tickets = vendorTickets(vendor);
  const assets = vendorAssets(vendor);
  const cards = [
    ["Vendor Status", vendorHealthChip(vendorStatusLabel(vendor), badgeClass(vendorStatus(vendor)))],
    ["Criticality", vendorHealthChip(vendorCriticality(vendor), vendorCriticality(vendor) === "Critical" ? "critical" : "warning")],
    ["Open Contracts", String(contracts.length)],
    ["Expiring Contracts", vendorHealthChip(String(expiring.length), expiring.length ? "warning" : "success")],
    ["Open Tickets", vendorHealthChip(String(tickets.length), tickets.length ? "warning" : "success")],
    ["Assets Covered", String(assets.length)],
    ["Response SLA", vendorResponseSla(vendor)],
    ["Last Interaction", vendorLastActivity(vendor)],
    ["Primary Contact", vendorPrimaryContact(vendor).name || vendor.contactPerson || "Not set"],
    ["Support Availability", vendorSupportAvailability(vendor)],
    ["Portal Available", vendorHealthChip(vendorPortalAvailable(vendor) ? "Yes" : "No", vendorPortalAvailable(vendor) ? "success" : "neutral")],
    ["Overall Vendor Health", vendorHealthChip(vendorHealth(vendor), vendorHealthBadgeClass(vendor))]
  ];
  return `<section class="surface-card asset-management-panel vendor-health-panel"><div class="section-title"><div><p class="eyebrow">Vendor Health</p><h4>Executive vendor dashboard</h4><p class="muted">Relationship status, exposure, support readiness, and operational signals.</p></div></div><div class="asset-state-grid vendor-state-grid">${cards.map(([label, value]) => `<div><small>${escapeHtml(label)}</small><strong>${String(value).includes("<span") ? value : escapeHtml(value)}</strong></div>`).join("")}</div></section>`;
}

function vendorActionsSection(vendor) {
  const actions = [
    ["ticket", "Create Ticket"],
    ["contract", "Create Contract"],
    ["upload_document", "Upload Document"],
    ["assign_owner", "Assign Vendor Owner"],
    ["add_contact", "Add Contact"],
    ["link_assets", "Link Assets"],
    ["export", "Export Vendor"],
    ["portal", "Open Vendor Portal"],
    ["schedule_review", "Schedule Review"]
  ];
  return `<section class="surface-card asset-actions-panel vendor-actions-panel"><div class="section-title"><div><p class="eyebrow">Vendor Actions</p><h3>Workflow-driven action bar</h3><p class="muted">Operational relationship changes are confirmed, audited, and added to the vendor timeline.</p></div></div><div class="asset-action-grid vendor-action-grid">${actions.map(([action, label]) => `<button class="btn btn-secondary" type="button" data-vendor-workflow="${action}" data-id="${vendor.id}">${escapeHtml(label)}</button>`).join("")}</div></section>`;
}

function vendorWorkspaceTabContent(vendor, tab) {
  if (tab === "Contacts") return vendorContactsTab(vendor);
  if (tab === "Contracts") return vendorContractsTab(vendor);
  if (tab === "Assets") return vendorAssetsTab(vendor);
  if (tab === "Tickets") return vendorTicketsTab(vendor);
  if (tab === "Documents") return vendorDocumentsTab(vendor);
  if (tab === "Timeline") return vendorTimelineTab(vendor);
  return vendorOverviewTab(vendor);
}

function vendorOverviewTab(vendor) {
  const contracts = vendorContracts(vendor);
  const annual = contracts.reduce((sum, contract) => sum + contractAnnualCost(contract), 0);
  const cards = [
    ["Company Profile", [["Vendor Name", vendor.name], ["Category", vendorCategory(vendor)], ["Country", vendor.country || "Not set"], ["Notes", vendor.notes || "No notes"]]],
    ["Support Details", [["Support Email", vendor.supportEmail || vendor.email], ["Support Phone", vendor.supportPhone || vendor.phone], ["Support Type", vendorSupportType(vendor)], ["Escalation", vendor.escalationPath || "Not set"]]],
    ["SLA & Portal", [["Response SLA", vendorResponseSla(vendor)], ["Support Hours", vendorSupportAvailability(vendor)], ["Portal", vendor.portalUrl || vendor.supportPortal || vendor.website || "Not set"], ["Portal Available", vendorPortalAvailable(vendor) ? "Yes" : "No"]]],
    ["Business Context", [["Vendor Owner", vendorOwnerLabel(vendor)], ["Criticality", vendorCriticality(vendor)], ["Annual Spend", formatMoney(annual, vendor.currency)], ["Cost Center", vendor.costCenter || "Not set"]]],
    ["Compliance", [["NDA", vendor.ndaStatus || "Not recorded"], ["Certificates", vendor.certificatesStatus || "Not recorded"], ["Review Date", vendor.nextReviewDate || "Not scheduled"], ["Rating", vendor.rating || "Not rated"]]]
  ];
  return `<section class="vendor-overview-grid vendor-focused-overview">${cards.map(([title, rowsList]) => contractInfoCard(title, rowsList)).join("")}</section>`;
}

function vendorContactsTab(vendor) {
  const contacts = vendorContacts(vendor).filter((contact) => !contact.archivedAt);
  return `<section class="surface-card"><div class="section-title"><div><p class="eyebrow">Contacts</p><h3>Vendor contacts</h3><p class="muted">Support, commercial, emergency, and escalation contacts.</p></div><button class="btn btn-secondary" data-vendor-workflow="add_contact" data-id="${vendor.id}">Add Contact</button></div><div class="table-wrap vendor-table-wrap"><table><thead><tr><th>Name</th><th>Title</th><th>Department</th><th>Email</th><th>Phone</th><th>Mobile</th><th>Extension</th><th>Flags</th><th>Preferred</th><th>Support Hours</th><th>Actions</th></tr></thead><tbody>${contacts.map((contact) => `<tr><td><strong>${escapeHtml(contact.name || "Unnamed")}</strong></td><td>${escapeHtml(contact.title || "Not set")}</td><td>${escapeHtml(contact.department || "Not set")}</td><td>${escapeHtml(contact.email || "Not set")}</td><td>${escapeHtml(contact.phone || "Not set")}</td><td>${escapeHtml(contact.mobile || "Not set")}</td><td>${escapeHtml(contact.extension || "Not set")}</td><td>${contact.primary ? `<span class="badge success">Primary</span>` : ""}${contact.emergency ? `<span class="badge warning">Emergency</span>` : ""}</td><td>${escapeHtml(contact.preferredMethod || "Email")}</td><td>${escapeHtml(contact.supportHours || vendorSupportAvailability(vendor))}</td><td><div class="record-card-actions compact"><button class="btn btn-secondary" data-vendor-contact-action="call" data-id="${vendor.id}" data-contact-id="${contact.id}">Call</button><button class="btn btn-secondary" data-vendor-contact-action="email" data-id="${vendor.id}" data-contact-id="${contact.id}">Email</button><button class="btn btn-secondary" data-vendor-contact-action="ticket" data-id="${vendor.id}" data-contact-id="${contact.id}">Open Ticket</button><button class="btn btn-secondary" data-vendor-contact-action="promote" data-id="${vendor.id}" data-contact-id="${contact.id}">Promote</button><button class="btn btn-warning" data-vendor-contact-action="archive" data-id="${vendor.id}" data-contact-id="${contact.id}">Archive</button></div></td></tr>`).join("") || `<tr><td colspan="11">${emptyState("No contacts", "Add vendor contacts for support and escalation.")}</td></tr>`}</tbody></table></div></section>`;
}

function vendorContractsTab(vendor) {
  const contracts = vendorContracts(vendor);
  return `<section class="surface-card"><div class="section-title"><div><p class="eyebrow">Contracts</p><h3>${contracts.length} linked contracts</h3><p class="muted">Contracts remain managed inside the Contracts workspace.</p></div><button class="btn btn-secondary" data-vendor-workflow="contract" data-id="${vendor.id}">Create Contract</button></div><div class="table-wrap"><table><thead><tr><th>Contract</th><th>Status</th><th>Renewal</th><th>Days Remaining</th><th>Owner</th><th>Cost</th><th></th></tr></thead><tbody>${contracts.map((contract) => `<tr><td><strong>${escapeHtml(contract.name || contractNumber(contract))}</strong><br><small>${escapeHtml(contractNumber(contract))}</small></td><td><span class="badge ${badgeClass(contractLifecycleStatus(contract))}">${escapeHtml(contractStatusLabel(contract))}</span></td><td><span class="badge ${contractRenewalBadgeClass(contract)}">${escapeHtml(contractRenewalHealth(contract))}</span></td><td>${escapeHtml(contractDaysLabel(contract))}</td><td>${escapeHtml(look("employees", contract.ownerEmployeeId) || look("users", contract.ownerUserId) || "Not assigned")}</td><td>${escapeHtml(formatMoney(contractAnnualCost(contract), contract.currency))}</td><td><button class="btn btn-secondary" data-open-module="contracts" data-open-id="${contract.id}">Open Contract</button></td></tr>`).join("") || `<tr><td colspan="7">${emptyState("No contracts", "Create or link contracts for this vendor.")}</td></tr>`}</tbody></table></div></section>`;
}

function vendorAssetsTab(vendor) {
  const assets = vendorAssets(vendor);
  return `<section class="surface-card"><div class="section-title"><div><p class="eyebrow">Assets</p><h3>${assets.length} covered assets</h3></div><button class="btn btn-secondary" data-vendor-workflow="link_assets" data-id="${vendor.id}">Link Assets</button></div><div class="table-wrap"><table><thead><tr><th>Asset</th><th>Category</th><th>Status</th><th>Warranty</th><th>Assigned User</th><th>Actions</th></tr></thead><tbody>${assets.map((asset) => `<tr><td><strong>${escapeHtml(asset.assetNumber || asset.id)}</strong><br><small>${escapeHtml(assetDisplayName(asset))}</small></td><td>${escapeHtml(asset.type || asset.category || "Asset")}</td><td><span class="badge ${assetStatusBadge(asset.status)}">${escapeHtml(assetStatusLabel(asset.status))}</span></td><td>${assetWarrantyBadge(asset)}</td><td>${escapeHtml(assetCurrentHolderLabel(asset))}</td><td><div class="record-card-actions compact"><button class="btn btn-secondary" data-open-module="assets" data-open-id="${asset.id}">Open Asset</button><button class="btn btn-secondary" data-vendor-asset-ticket="${vendor.id}" data-asset-id="${asset.id}">Create Asset Ticket</button><button class="btn btn-warning" data-vendor-unlink-asset="${vendor.id}" data-asset-id="${asset.id}">Remove Link</button></div></td></tr>`).join("") || `<tr><td colspan="6">${emptyState("No covered assets", "Link assets covered by this vendor.")}</td></tr>`}</tbody></table></div></section>`;
}

function vendorTicketsTab(vendor) {
  const tickets = vendorTickets(vendor);
  return `<section class="surface-card"><div class="section-title"><div><p class="eyebrow">Tickets</p><h3>Vendor related tickets</h3></div><button class="btn btn-secondary" data-vendor-workflow="ticket" data-id="${vendor.id}">Create Ticket</button></div><div class="table-wrap"><table><thead><tr><th>Ticket</th><th>Priority</th><th>Status</th><th>Assigned IT Staff</th><th>SLA</th><th>Created</th><th>Last Updated</th><th></th></tr></thead><tbody>${tickets.map((ticket) => `<tr><td><strong>${escapeHtml(ticket.ticketNumber || ticket.id)}</strong><br><small>${escapeHtml(ticketSubject(ticket))}</small></td><td><span class="badge ${badgeClass(ticket.priority)}">${escapeHtml(labelize(ticket.priority || "Medium"))}</span></td><td><span class="badge ${badgeClass(ticket.status)}">${escapeHtml(labelize(ticket.status || "Open"))}</span></td><td>${escapeHtml(look("users", ticket.assignedToId) || "Unassigned")}</td><td>${escapeHtml(ticket.slaRemaining || ticket.slaDueDate || "Not set")}</td><td>${escapeHtml(ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString() : "Not set")}</td><td>${escapeHtml(ticket.updatedAt ? relativeTime(ticket.updatedAt) : "Not set")}</td><td><button class="btn btn-secondary" data-open-ticket="${ticket.id}">Open Ticket</button></td></tr>`).join("") || `<tr><td colspan="8">${emptyState("No vendor tickets", "Vendor waiting or support tickets will appear here.")}</td></tr>`}</tbody></table></div></section>`;
}

function vendorDocumentsTab(vendor) {
  const docs = vendorDocuments(vendor);
  return `<section class="surface-card"><div class="section-title"><div><p class="eyebrow">Documents</p><h3>Vendor document library</h3><p class="muted">Contracts, price lists, NDA, certificates, warranty, support guides, invoices, quotes, purchase orders, and attachments.</p></div><button class="btn btn-secondary" data-vendor-workflow="upload_document" data-id="${vendor.id}">Upload Document</button></div><div class="attachment-list">${docs.map((doc) => `<article class="file-card"><div class="file-card-main">${icon("documents")}<span><strong>${escapeHtml(doc.title || doc.filename || "Vendor document")}</strong><small>${escapeHtml(doc.templateType || doc.type || "Document")} | ${escapeHtml(doc.updatedAt ? new Date(doc.updatedAt).toLocaleDateString() : "No date")}</small></span></div><div class="record-card-actions"><button class="btn btn-secondary" data-download-generated="${doc.id}">${icon("download")}Download</button></div></article>`).join("") || emptyState("No documents", "Upload vendor contracts, price lists, certificates, warranties, invoices, quotes, purchase orders, and support guides.")}</div></section>`;
}

function vendorPerformanceTab(vendor) {
  const tickets = vendorTickets(vendor);
  const closed = tickets.filter((ticket) => ["resolved", "closed"].includes(String(ticket.status || "").toLowerCase())).length;
  const open = tickets.length - closed;
  const rating = Number(vendor.rating || 0);
  const cards = [
    ["Average Response Time", vendor.averageResponseTime || vendor.responseTime || "Not measured"],
    ["Average Resolution Time", vendor.averageResolutionTime || vendor.resolutionTime || "Not measured"],
    ["Open Issues", String(open)],
    ["Closed Issues", String(closed)],
    ["SLA %", vendor.slaPercent ? `${vendor.slaPercent}%` : "Not measured"],
    ["Customer Satisfaction", vendor.csat ? `${vendor.csat}%` : "Not measured"],
    ["On-time Delivery", vendor.onTimeDelivery ? `${vendor.onTimeDelivery}%` : "Not measured"],
    ["Late Deliveries", String(vendor.lateDeliveries || 0)],
    ["Renewal Success", vendor.renewalSuccess ? `${vendor.renewalSuccess}%` : `${vendorContracts(vendor).length ? "Tracked" : "Not measured"}`],
    ["Vendor Rating", rating ? `${rating}/5` : "Not rated"]
  ];
  return `<section class="ticket-workspace-info vendor-performance-grid">${cards.map(([label, value]) => `<div class="ticket-info-card"><small>${escapeHtml(label)}</small><strong>${escapeHtml(value)}</strong></div>`).join("")}</section>`;
}

function vendorTimelineTab(vendor) {
  const relatedContractIds = new Set(vendorContracts(vendor).map((contract) => contract.id));
  const relatedDocIds = new Set(vendorDocuments(vendor).map((doc) => doc.id));
  const items = rows("timeline").filter((item) =>
    (["vendor", "vendors"].includes(item.entityType) && item.entityId === vendor.id) ||
    (["contract", "contracts"].includes(item.entityType) && relatedContractIds.has(item.entityId)) ||
    (["document", "documents"].includes(item.entityType) && relatedDocIds.has(item.entityId))
  );
  return `<div class="timeline-feed">${items.map((item) => `<article class="timeline-card"><div class="timeline-meta"><span>${escapeHtml(look("users", item.actorUserId) || "System")}</span><span>${item.createdAt ? new Date(item.createdAt).toLocaleString() : ""}</span></div><strong>${escapeHtml(vendorTimelineTitle(item.title))}</strong><p class="muted">${escapeHtml(item.description || "")}</p></article>`).join("") || emptyState("No timeline yet", "Vendor workflow events will appear here.")}</div>`;
}

function vendorCategory(vendor) {
  if (vendor.category) return vendor.category;
  const services = Array.isArray(vendor.services) ? vendor.services : String(vendor.servicesText || "").split(",");
  return services.map((item) => String(item).trim()).find(Boolean) || "Supplier";
}

function vendorStatus(vendor) {
  const status = String(vendor.status || "").toLowerCase();
  if (vendor.archivedAt || status === "inactive") return "inactive";
  if (vendorHealth(vendor) === "Critical") return "critical";
  if (vendorHealth(vendor) === "Attention") return "attention";
  return status || "active";
}

function vendorStatusLabel(vendor) {
  return labelize(vendor.status || vendorStatus(vendor));
}

function vendorCriticality(vendor) {
  if (vendor.criticality) return vendor.criticality;
  if (vendorTickets(vendor).some((ticket) => ["critical", "high"].includes(String(ticket.priority || "").toLowerCase()))) return "Critical";
  if (vendorContracts(vendor).some((contract) => contractDaysRemaining(contract) <= 30)) return "High";
  return "Medium";
}

function vendorHealth(vendor) {
  if (String(vendor.status || "").toLowerCase() === "inactive" || vendor.archivedAt) return "Inactive";
  if (vendorCriticality(vendor) === "Critical" || vendorTickets(vendor).some((ticket) => String(ticket.priority || "").toLowerCase() === "critical")) return "Critical";
  if (vendorContracts(vendor).some((contract) => contractDaysRemaining(contract) <= 30) || vendorTickets(vendor).length) return "Attention";
  return "Healthy";
}

function vendorHealthBadgeClass(vendor) {
  return { Healthy: "success", Attention: "warning", Critical: "critical", Inactive: "neutral" }[vendorHealth(vendor)] || "info";
}

function vendorHealthSort(vendor) {
  return { Critical: 0, Attention: 1, Healthy: 2, Inactive: 3 }[vendorHealth(vendor)] ?? 4;
}

function vendorHealthChip(label, tone) {
  return `<span class="badge ${escapeHtml(tone || "neutral")}">${escapeHtml(label)}</span>`;
}

function vendorContacts(vendor) {
  if (Array.isArray(vendor.contacts)) return vendor.contacts;
  return [vendor.contactPerson || vendor.email || vendor.phone ? { id: "primary", name: vendor.contactPerson || "Primary contact", title: "Primary Contact", email: vendor.email, phone: vendor.phone, primary: true, preferredMethod: "Email", supportHours: vendorSupportAvailability(vendor) } : null].filter(Boolean);
}

function vendorPrimaryContact(vendor) {
  return vendorContacts(vendor).find((contact) => contact.primary && !contact.archivedAt) || vendorContacts(vendor).find((contact) => !contact.archivedAt) || {};
}

function vendorContracts(vendor) {
  const ids = new Set([...(vendor.contracts || []), ...(vendor.contractIds || [])]);
  return rows("contracts").filter((contract) => contract.vendorId === vendor.id || ids.has(contract.id));
}

function vendorAssets(vendor) {
  const ids = new Set([...(vendor.linkedAssetIds || []), ...(vendor.assetIds || [])]);
  return rows("assets").filter((asset) => asset.supplierId === vendor.id || asset.vendorId === vendor.id || ids.has(asset.id));
}

function vendorTickets(vendor) {
  const name = String(vendor.name || "").toLowerCase();
  return rows("tickets").filter((ticket) => {
    const status = String(ticket.status || "").toLowerCase();
    if (["closed", "resolved", "cancelled"].includes(status)) return false;
    return ticket.vendorId === vendor.id || ticket.supplierId === vendor.id || (String(ticket.waitingReason || "").toLowerCase() === "vendor" && [ticket.description, ticket.category, ticket.subcategory, ticket.subject].join(" ").toLowerCase().includes(name || "vendor"));
  });
}

function vendorDocuments(vendor) {
  return rows("documents").filter((doc) => ["vendor", "vendors"].includes(doc.linkedType) && doc.linkedId === vendor.id);
}

function vendorOwnerLabel(vendor) {
  return look("employees", vendor.ownerEmployeeId) || look("users", vendor.ownerUserId) || "Unassigned";
}

function vendorSupportType(vendor) {
  return vendor.supportType || vendor.serviceLevel || vendor.contractType || "Standard";
}

function vendorPortalAvailable(vendor) {
  return Boolean(vendor.portalUrl || vendor.supportPortal || vendor.website);
}

function vendorSupportAvailability(vendor) {
  return vendor.supportAvailability || vendor.supportHours || vendor.hours || "Business hours";
}

function vendorResponseSla(vendor) {
  return vendor.responseSla || vendor.sla || "Not set";
}

function vendorLastActivity(vendor) {
  const ids = new Set([vendor.id, ...vendorContracts(vendor).map((contract) => contract.id), ...vendorDocuments(vendor).map((doc) => doc.id)]);
  const item = rows("timeline").find((event) => ids.has(event.entityId) && ["vendor", "vendors", "contract", "contracts", "document", "documents"].includes(event.entityType));
  return item?.createdAt ? relativeTime(item.createdAt) : (vendor.updatedAt ? relativeTime(vendor.updatedAt) : "No activity");
}

function vendorTimelineTitle(title) {
  const normalized = String(title || "").toLowerCase();
  if (normalized.includes("contract") && normalized.includes("renew")) return "Contract renewed";
  if (normalized.includes("contract")) return "Contract linked";
  if (normalized.includes("ticket")) return "Ticket opened";
  if (normalized.includes("asset")) return "Asset linked";
  if (normalized.includes("contact")) return "Contact updated";
  if (normalized.includes("review")) return "Review scheduled";
  if (normalized.includes("document")) return "Document uploaded";
  if (normalized.includes("owner")) return "Vendor owner assigned";
  if (normalized.includes("create")) return "Vendor created";
  return labelize(title || "Vendor activity");
}

function vendorInfoForExport(vendor) {
  return `${vendor.name}\nCategory: ${vendorCategory(vendor)}\nStatus: ${vendorStatusLabel(vendor)}\nCriticality: ${vendorCriticality(vendor)}\nPrimary contact: ${vendorPrimaryContact(vendor).name || vendor.contactPerson || "Not set"}\nContracts: ${vendorContracts(vendor).length}\nAssets covered: ${vendorAssets(vendor).length}\nOpen tickets: ${vendorTickets(vendor).length}`;
}

function vendorWorkflowField(name, label, type = "text", options = {}) {
  return contractWorkflowField(name, label, type, options);
}

function openVendorWorkflowDialog(vendorId, workflow) {
  const vendor = rows("vendors").find((item) => item.id === vendorId);
  if (!vendor) return;
  if (workflow === "upload_document") {
    toast("Available in a future version", "This action is available in a future version.");
    return;
  }
  if (workflow === "ticket") {
    confirmDialog("Create vendor ticket?", `Create a support ticket for ${vendor.name}?`, { confirmText: "Create Ticket" }).then((ok) => {
      if (ok) openModal("tickets", null, { category: "Vendor", priority: "medium", vendorId: vendor.id, description: `Vendor support request for ${vendor.name}` });
    });
    return;
  }
  if (workflow === "contract") {
    confirmDialog("Create contract?", `Open the contract workflow for ${vendor.name}?`, { confirmText: "Create Contract" }).then((ok) => {
      if (ok) openModal("contracts", null, { vendorId: vendor.id, name: `${vendor.name} Agreement`, type: "Support", status: "draft" });
    });
    return;
  }
  if (workflow === "export") {
    confirmDialog("Export vendor profile?", `Export a compact profile for ${vendor.name}?`, { confirmText: "Export" }).then((ok) => {
      if (!ok) return;
      navigator.clipboard?.writeText(vendorInfoForExport(vendor));
      toast("Vendor exported", "A compact vendor profile was copied to the clipboard.");
    });
    return;
  }
  if (workflow === "portal") {
    const url = vendor.portalUrl || vendor.supportPortal || vendor.website;
    if (!url) return toast("No vendor portal", "This vendor does not have a portal URL yet.");
    window.open(url, "_blank", "noopener");
    return;
  }
  const def = vendorWorkflowDefinition(vendor, workflow);
  if (!def) return;
  const host = $("#modalHost") || $("#menuHost");
  if (!host) return;
  host.innerHTML = `<div class="modal-backdrop"><form class="modal surface-card contract-workflow-modal vendor-workflow-modal"><div class="modal-head"><div><p class="eyebrow">Vendor workflow</p><h3>${escapeHtml(def.title)}</h3><p class="muted">${escapeHtml(def.subtitle || "")}</p></div><button type="button" class="icon-btn close" aria-label="Close">${icon("close")}</button></div><div class="modal-fields"><div class="form-error" data-form-error hidden></div><div class="asset-workflow-summary"><strong>${escapeHtml(vendor.name || "Vendor")}</strong><span>${escapeHtml(vendorCategory(vendor))}</span><small>${escapeHtml(vendorHealth(vendor))} | ${escapeHtml(vendorOwnerLabel(vendor))}</small></div>${def.fields}</div><div class="modal-actions"><button type="button" class="btn btn-secondary close">Cancel</button><button type="submit" class="btn btn-primary">${escapeHtml(def.confirmAction || "Continue")}</button></div></form></div>`;
  const form = $(".modal", host);
  $$(".close", form).forEach((button) => button.addEventListener("click", () => host.innerHTML = ""));
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const body = { workflow };
    for (const [key, value] of data.entries()) {
      if (body[key]) body[key] = Array.isArray(body[key]) ? [...body[key], value] : [body[key], value];
      else body[key] = value;
    }
    const error = validateVendorWorkflow(workflow, body);
    const errorBox = $("[data-form-error]", form);
    if (error) {
      errorBox.textContent = error;
      errorBox.hidden = false;
      return;
    }
    const confirmed = await confirmDialog(def.title, vendorWorkflowConfirmation(vendor, workflow, body), { confirmText: def.confirmAction || "Confirm" });
    if (!confirmed) return;
    await api(`/api/vendors/${vendor.id}/workflow`, { method: "PATCH", body: JSON.stringify(body) });
    host.innerHTML = "";
    await loadState();
    toast("Vendor updated", `${vendor.name} workflow was recorded.`);
    render();
  });
}

function vendorWorkflowDefinition(vendor, workflow) {
  const employees = [["", "Choose owner"], ...rows("employees").map((employee) => [employee.id, employee.name])];
  const assetOptions = rows("assets").map((asset) => ({ value: asset.id, label: `${asset.assetNumber || asset.id} - ${assetDisplayName(asset)}`, checked: vendorAssets(vendor).some((item) => item.id === asset.id) }));
  const contacts = vendorContacts(vendor).filter((contact) => !contact.archivedAt).map((contact) => [contact.id, contact.name || contact.email || contact.id]);
  const map = {
    upload_document: { title: "Upload Document", confirmAction: "Create Document Record", subtitle: "Create a linked vendor document placeholder.", fields: `${vendorWorkflowField("documentTitle", "Document title", "text", { required: true, placeholder: "NDA, price list, certificate..." })}${vendorWorkflowField("documentType", "Document type", "select", { options: ["Contract", "Price List", "NDA", "Certificate", "Warranty", "Support Guide", "Invoice", "Quote", "Purchase Order", "Attachment"] })}${vendorWorkflowField("fileName", "File name", "text")}${vendorWorkflowField("notes", "Notes", "textarea", { full: true })}` },
    assign_owner: { title: "Assign Vendor Owner", confirmAction: "Assign Owner", subtitle: "Set the accountable owner for this vendor relationship.", fields: `${vendorWorkflowField("ownerEmployeeId", "Vendor owner", "select", { required: true, options: employees, value: vendor.ownerEmployeeId || "" })}${vendorWorkflowField("notes", "Notes", "textarea", { full: true })}` },
    add_contact: { title: "Add Contact", confirmAction: "Add Contact", subtitle: "Add a support, commercial, or emergency vendor contact.", fields: `${vendorWorkflowField("name", "Name", "text", { required: true })}${vendorWorkflowField("title", "Title", "text")}${vendorWorkflowField("department", "Department", "text")}${vendorWorkflowField("email", "Email", "email")}${vendorWorkflowField("phone", "Phone", "text")}${vendorWorkflowField("mobile", "Mobile", "text")}${vendorWorkflowField("extension", "Extension", "text")}${vendorWorkflowField("preferredMethod", "Preferred contact method", "select", { options: ["Email", "Phone", "Mobile", "Portal"] })}${vendorWorkflowField("supportHours", "Support hours", "text", { value: vendorSupportAvailability(vendor) })}${vendorWorkflowField("flags", "Contact flags", "checkboxes", { options: [{ value: "primary", label: "Primary Contact" }, { value: "emergency", label: "Emergency Contact" }] })}` },
    link_assets: { title: "Link Assets", confirmAction: "Save Links", subtitle: "Link or unlink assets covered by this vendor.", fields: `${vendorWorkflowField("assetIds", "Assets", "checkboxes", { options: assetOptions })}` },
    schedule_review: { title: "Schedule Review", confirmAction: "Schedule Review", subtitle: "Plan a vendor performance or relationship review.", fields: `${vendorWorkflowField("reviewDate", "Review date", "date", { required: true })}${vendorWorkflowField("reviewType", "Review type", "select", { options: ["Operational", "Commercial", "Performance", "Security", "Renewal"] })}${vendorWorkflowField("notes", "Review notes", "textarea", { full: true })}` },
    promote_contact: { title: "Promote to Primary", confirmAction: "Promote Contact", subtitle: "Make this contact the primary vendor contact.", fields: `${vendorWorkflowField("contactId", "Contact", "select", { required: true, options: [["", "Choose contact"], ...contacts] })}` },
    archive_contact: { title: "Archive Contact", confirmAction: "Archive Contact", subtitle: "Archive a vendor contact without deleting history.", fields: `${vendorWorkflowField("contactId", "Contact", "select", { required: true, options: [["", "Choose contact"], ...contacts] })}${vendorWorkflowField("reason", "Reason", "textarea", { full: true })}` }
  };
  return map[workflow];
}

function validateVendorWorkflow(workflow, body) {
  if (workflow === "upload_document" && !body.documentTitle) return "Document title is required.";
  if (workflow === "assign_owner" && !body.ownerEmployeeId) return "Vendor owner is required.";
  if (workflow === "add_contact" && !body.name) return "Contact name is required.";
  if (workflow === "schedule_review" && !body.reviewDate) return "Review date is required.";
  if (["promote_contact", "archive_contact"].includes(workflow) && !body.contactId) return "Contact is required.";
  return "";
}

function vendorWorkflowConfirmation(vendor, workflow, body) {
  const lines = [`Vendor: ${vendor.name}`, `Workflow: ${vendorWorkflowDefinition(vendor, workflow)?.title || labelize(workflow)}`];
  if (body.ownerEmployeeId) lines.push(`Owner: ${look("employees", body.ownerEmployeeId)}`);
  if (body.documentTitle) lines.push(`Document: ${body.documentTitle}`);
  if (body.name) lines.push(`Contact: ${body.name}`);
  if (body.assetIds) lines.push(`Linked assets: ${Array.isArray(body.assetIds) ? body.assetIds.length : 1}`);
  if (body.reviewDate) lines.push(`Review date: ${body.reviewDate}`);
  lines.push("Timeline, audit, and notifications will be recorded.");
  return lines.join("\n");
}

function handleVendorContactAction(vendorId, contactId, action) {
  const vendor = rows("vendors").find((item) => item.id === vendorId);
  const contact = vendorContacts(vendor || {}).find((item) => item.id === contactId);
  if (!vendor || !contact) return;
  if (action === "call") {
    const phone = contact.phone || contact.mobile || vendor.phone;
    if (phone) window.location.href = `tel:${phone}`;
    else toast("No phone number", "This contact does not have a phone number.");
    return;
  }
  if (action === "email") {
    const email = contact.email || vendor.email;
    if (email) window.location.href = `mailto:${email}`;
    else toast("No email address", "This contact does not have an email address.");
    return;
  }
  if (action === "ticket") {
    confirmDialog("Create vendor ticket?", `Create a ticket for ${contact.name || vendor.name}?`, { confirmText: "Create Ticket" }).then((ok) => {
      if (ok) openModal("tickets", null, { category: "Vendor", priority: "medium", vendorId: vendor.id, description: `Vendor support request for ${vendor.name} - ${contact.name || "contact"}` });
    });
    return;
  }
  const workflow = action === "promote" ? "promote_contact" : "archive_contact";
  const title = action === "promote" ? "Promote contact?" : "Archive contact?";
  const confirmText = action === "promote" ? "Promote" : "Archive";
  confirmDialog(title, `${confirmText} ${contact.name || "this contact"} for ${vendor.name}?`, { confirmText }).then(async (ok) => {
    if (!ok) return;
    await api(`/api/vendors/${vendor.id}/workflow`, { method: "PATCH", body: JSON.stringify({ workflow, contactId }) });
    await loadState();
    toast("Vendor updated", `${vendor.name} contact was updated.`);
    render();
  });
}

function unlinkVendorAsset(vendorId, assetId) {
  const vendor = rows("vendors").find((item) => item.id === vendorId);
  if (!vendor) return;
  const ids = vendorAssets(vendor).map((asset) => asset.id).filter((idValue) => idValue !== assetId);
  confirmDialog("Remove asset link?", "Remove this asset from the vendor coverage list?", { confirmText: "Remove Link" }).then(async (ok) => {
    if (!ok) return;
    await api(`/api/vendors/${vendor.id}/workflow`, { method: "PATCH", body: JSON.stringify({ workflow: "link_assets", assetIds: ids }) });
    await loadState();
    toast("Asset link removed", "Vendor asset coverage was updated.");
    render();
  });
}

function createVendorAssetTicket(vendorId, assetId) {
  const vendor = rows("vendors").find((item) => item.id === vendorId);
  const asset = rows("assets").find((item) => item.id === assetId);
  if (!vendor || !asset) return;
  confirmDialog("Create asset ticket?", `Create a vendor ticket for ${asset.assetNumber || assetDisplayName(asset)}?`, { confirmText: "Create Ticket" }).then((ok) => {
    if (ok) openModal("tickets", null, { category: "Vendor", priority: "medium", vendorId: vendor.id, relatedAssetId: asset.id, assetId: asset.id, description: `Vendor support request for ${asset.assetNumber || assetDisplayName(asset)} with ${vendor.name}` });
  });
}

function knowledgeWorkspacePage() {
  const data = knowledgeWorkspaceCollection();
  const selected = data.find((row) => row.id === state.workspaceSelected.knowledge_base) || data[0] || null;
  if (selected) state.workspaceSelected.knowledge_base = selected.id;
  return `
    ${workspaceIdentityHeader("knowledge_base", has("knowledge_base", "create") ? `<button class="btn btn-primary" data-add="knowledge_base">${icon("plus")}Create Article</button>` : "")}
    <section class="ticket-workspace knowledge-workspace">
      <aside class="ticket-workspace-list-panel">
        <div class="ticket-workspace-list-tools"><input id="searchBox" placeholder="Search articles, keywords, tags, category, body..." value="${escapeHtml(state.query)}" /></div>
        ${knowledgeWorkspaceFilters()}
        <div class="knowledge-quick-filters">
          ${["Most Viewed", "Recently Updated", "Favorites", "Drafts", "Published", "Archived"].map((item) => `<button class="workspace-indicator ${knowledgeQuickFilterActive(item) ? "info" : "neutral"}" data-kb-quick-filter="${item}">${escapeHtml(item)}</button>`).join("")}
        </div>
        <div class="ticket-workspace-list" aria-label="Knowledge article list">
          ${data.map((article) => knowledgeWorkspaceItem(article, selected?.id === article.id)).join("") || emptyState("No Articles Found", "Try changing search, filters, or sort.")}
        </div>
      </aside>
      <section class="ticket-workspace-detail-panel">${selected ? knowledgeWorkspaceDetail(selected) : emptyState("No article selected", "Choose an article from the workspace list.")}</section>
    </section>
  `;
}

function knowledgeWorkspaceCollection() {
  const filters = typeof state.filters.knowledge_base === "object" ? state.filters.knowledge_base : {};
  const query = state.query.toLowerCase().trim();
  let data = collection("knowledge_base").filter((article) => {
    if (filters.category && article.category !== filters.category) return false;
    if (filters.status && knowledgeStatus(article) !== filters.status) return false;
    if (filters.audience && knowledgeAudience(article) !== filters.audience) return false;
    if (filters.department && knowledgeDepartment(article) !== filters.department) return false;
    if (filters.owner && knowledgeOwnerLabel(article) !== filters.owner && article.ownerId !== filters.owner) return false;
    if (filters.product && knowledgeProduct(article) !== filters.product) return false;
    if (filters.language && knowledgeLanguage(article) !== filters.language) return false;
    if (filters.reviewStatus && knowledgeReviewStatus(article) !== filters.reviewStatus) return false;
    if (filters.tags && !knowledgeTags(article).includes(filters.tags)) return false;
    if (filters.quick === "Drafts" && knowledgeStatus(article) !== "Draft") return false;
    if (filters.quick === "Published" && knowledgeStatus(article) !== "Published") return false;
    if (filters.quick === "Archived" && !article.archivedAt && knowledgeStatus(article) !== "Archived") return false;
    if (filters.quick === "Favorites" && !article.favorite) return false;
    if (!query) return true;
    return typoTolerantIncludes(knowledgeSearchText(article), query);
  });
  const sort = filters.sort || "Recently Updated";
  data = data.sort((a, b) => {
    if (sort === "Newest") return String(b.createdAt || "").localeCompare(String(a.createdAt || ""));
    if (sort === "Oldest") return String(a.createdAt || "").localeCompare(String(b.createdAt || ""));
    if (sort === "Most Viewed") return knowledgeViews(b) - knowledgeViews(a);
    if (sort === "Alphabetical") return String(a.title || "").localeCompare(String(b.title || ""));
    if (query) return knowledgeSearchScore(b, query) - knowledgeSearchScore(a, query);
    return String(b.updatedAt || b.createdAt || "").localeCompare(String(a.updatedAt || a.createdAt || ""));
  });
  return data;
}

function knowledgeWorkspaceFilters() {
  const filters = typeof state.filters.knowledge_base === "object" ? state.filters.knowledge_base : {};
  const option = (value, label, selected) => `<option value="${escapeHtml(value)}" ${String(selected) === String(value) ? "selected" : ""}>${escapeHtml(label)}</option>`;
  const unique = (values) => [...new Set(values.filter(Boolean))].sort();
  const articles = collection("knowledge_base");
  return `<div class="manager-ticket-filters knowledge-workspace-filters">
    <label class="manager-ticket-filter"><span>Category</span><select data-kb-filter="category"><option value="">All Categories</option>${unique(articles.map((item) => item.category)).map((value) => option(value, value, filters.category)).join("")}</select></label>
    <label class="manager-ticket-filter"><span>Status</span><select data-kb-filter="status"><option value="">All Status</option>${["Draft", "Published", "Needs Review", "Archived", "Expired"].map((value) => option(value, value, filters.status)).join("")}</select></label>
    <label class="manager-ticket-filter"><span>Audience</span><select data-kb-filter="audience"><option value="">All Audiences</option>${unique(articles.map(knowledgeAudience)).map((value) => option(value, value, filters.audience)).join("")}</select></label>
    <label class="manager-ticket-filter"><span>Department</span><select data-kb-filter="department"><option value="">All Departments</option>${unique(articles.map(knowledgeDepartment)).map((value) => option(value, value, filters.department)).join("")}</select></label>
    <label class="manager-ticket-filter"><span>Owner</span><select data-kb-filter="owner"><option value="">All Owners</option>${unique(articles.map(knowledgeOwnerLabel)).map((value) => option(value, value, filters.owner)).join("")}</select></label>
    <label class="manager-ticket-filter"><span>Product</span><select data-kb-filter="product"><option value="">All Products</option>${unique(articles.map(knowledgeProduct)).map((value) => option(value, value, filters.product)).join("")}</select></label>
    <label class="manager-ticket-filter"><span>Tags</span><select data-kb-filter="tags"><option value="">All Tags</option>${unique(articles.flatMap(knowledgeTags)).map((value) => option(value, value, filters.tags)).join("")}</select></label>
    <label class="manager-ticket-filter"><span>Language</span><select data-kb-filter="language"><option value="">All Languages</option>${unique(articles.map(knowledgeLanguage)).map((value) => option(value, value, filters.language)).join("")}</select></label>
    <label class="manager-ticket-filter"><span>Review Status</span><select data-kb-filter="reviewStatus"><option value="">All Reviews</option>${["Current", "Needs Review", "Expired"].map((value) => option(value, value, filters.reviewStatus)).join("")}</select></label>
    <label class="manager-ticket-filter"><span>Sort By</span><select data-kb-filter="sort">${["Recently Updated", "Newest", "Oldest", "Most Viewed", "Alphabetical"].map((value) => option(value, value, filters.sort || "Recently Updated")).join("")}</select></label>
  </div>`;
}

function knowledgeQuickFilterActive(label) {
  const filters = typeof state.filters.knowledge_base === "object" ? state.filters.knowledge_base : {};
  return filters.quick === label || (!filters.quick && label === "Recently Updated");
}

function knowledgeWorkspaceItem(article, active) {
  return `
    <button class="ticket-workspace-item knowledge-workspace-item ${active ? "active" : ""}" data-kb-workspace-select="${article.id}">
      <span class="workspace-item-top"><span>${icon("knowledge_base")}<strong>${escapeHtml(article.title || "Untitled article")}</strong></span><span class="badge ${knowledgeStatusBadge(article)}">${escapeHtml(knowledgeStatus(article))}</span></span>
      <span class="workspace-ticket-subject">${escapeHtml(article.category || "Knowledge Base")}</span>
      <span class="workspace-item-meta"><span>${escapeHtml(knowledgeOwnerLabel(article))}</span><span>v${escapeHtml(String(knowledgeVersion(article)))}</span></span>
      <span class="workspace-ticket-indicators"><span class="workspace-indicator info">${escapeHtml(tpl("{n} views", { n: knowledgeViews(article) }))}</span><span class="workspace-indicator success">${escapeHtml(knowledgeHelpful(article) === "Not rated" ? trText("Not rated") : tpl("{n} helpful", { n: knowledgeHelpful(article) }))}</span><span class="workspace-indicator neutral">${escapeHtml(knowledgeReadingTime(article))}</span></span>
      <small class="muted">${escapeHtml(tpl("Updated {when}", { when: article.updatedAt ? relativeTime(article.updatedAt) : trText("not dated") }))}</small>
    </button>
  `;
}

function firstSentence(value) {
  const text = String(value || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  if (!text) return "";
  const match = text.match(/^(.{1,180}?[.!?])(\s|$)/);
  return match ? match[1] : text.slice(0, 180);
}

function knowledgeWorkspaceDetail(article) {
  const tab = state.workspaceTab.knowledge_base || "Overview";
  const tabs = ["Overview", "Article", "Related Records", "Comments", "Timeline"];
  const tabAliases = { Content: "Article", Attachments: "Article", Versions: "Timeline", "Review Center": "Overview", Approval: "Overview" };
  const normalizedTab = tabAliases[tab] || tab;
  const safeTab = tabs.includes(normalizedTab) ? normalizedTab : "Overview";
  state.workspaceTab.knowledge_base = safeTab;
  return `
    <header class="ticket-workspace-detail-head knowledge-detail-head">
      <div>
        <p class="eyebrow">${escapeHtml(article.category || "Knowledge Base")}</p>
        <h3>${escapeHtml(article.title || "Untitled article")}</h3>
        <p class="muted">${escapeHtml(article.summary || article.excerpt || firstSentence(article.body || article.bodyText || "") || "Operational knowledge article")}</p>
      </div>
      <div class="detail-head-actions">
        <span class="badge ${knowledgeStatusBadge(article)}">${escapeHtml(knowledgeStatus(article))}</span>
      </div>
    </header>
    ${knowledgeArticleSnapshot(article)}
    ${knowledgeActionBar(article)}
    <div class="tabs workspace-tabs">${tabs.map((item) => `<button class="tab ${safeTab === item ? "active" : ""}" data-kb-workspace-tab="${item}">${escapeHtml(item)}</button>`).join("")}</div>
    <div class="ticket-workspace-detail-body knowledge-workspace-body">${knowledgeWorkspaceTabContent(article, safeTab)}</div>
  `;
}

function knowledgeArticleSnapshot(article) {
  const snapshot = [
    ["Status", knowledgeStatus(article)],
    ["Audience", knowledgeAudience(article)],
    ["Owner", knowledgeOwnerLabel(article)],
    ["Version", `v${knowledgeVersion(article)}`],
    ["Reading Time", knowledgeReadingTime(article)],
    ["Last Updated", article.updatedAt ? relativeTime(article.updatedAt) : article.createdAt ? relativeTime(article.createdAt) : "Not dated"]
  ];
  return `<section class="surface-card knowledge-snapshot-panel">
    <div class="section-title"><div><p class="eyebrow">Article Snapshot</p><h3>Current publishing state</h3></div><span class="badge ${knowledgeReviewBadge(article)}">${escapeHtml(knowledgeReviewStatus(article))}</span></div>
    <div class="knowledge-snapshot-grid">${snapshot.map(([label, value]) => `<div><small>${escapeHtml(label)}</small><strong>${escapeHtml(value || "Not set")}</strong></div>`).join("")}</div>
  </section>`;
}

function knowledgeActionBar(article) {
  const publishLabel = knowledgeStatus(article) === "Published" ? "Update" : "Publish";
  const primary = [
    has("knowledge_base", "edit") ? `<button class="btn btn-primary" data-kb-toggle-editor="${article.id}">${icon("edit")}Edit</button>` : "",
    has("knowledge_base", "edit") ? `<button class="btn btn-secondary" data-kb-workflow="publish" data-id="${article.id}">${escapeHtml(publishLabel)}</button>` : "",
    `<button class="btn btn-secondary" data-kb-preview="${article.id}">${icon("preview")}Preview</button>`
  ].filter(Boolean);
  const more = [
    has("knowledge_base", "archive") ? `<button class="btn btn-warning" data-archive="knowledge_base" data-id="${article.id}">${icon("archive_center")}Archive</button>` : "",
    has("knowledge_base", "archive") ? `<button class="btn btn-danger" data-trash="knowledge_base" data-id="${article.id}">${icon("delete")}Delete</button>` : "",
    has("knowledge_base", "edit") ? `<button class="btn btn-secondary" data-kb-workflow="duplicate" data-id="${article.id}">Duplicate</button>` : "",
    has("knowledge_base", "edit") ? `<button class="btn btn-secondary" data-kb-workflow="schedule_review" data-id="${article.id}">Review Schedule</button>` : "",
    `<button class="btn btn-secondary" data-kb-export="${article.id}" data-format="pdf">Export PDF</button>`,
    has("knowledge_base", "edit") ? `<button class="btn btn-secondary" data-kb-workflow="upload_attachment" data-id="${article.id}">Upload Attachment</button>` : "",
    comingSoonButton("Advanced governance")
  ].filter(Boolean);
  return `<div class="record-card-actions standard-workspace-actions knowledge-action-bar">
    ${primary.join("")}
    ${more.length ? `<details class="ticket-v2-more"><summary>${icon("more")}More</summary><div>${more.join("")}</div></details>` : ""}
  </div>`;
}

function knowledgeHealthPanel(article) {
  const allArticles = rows("knowledge_base");
  const healthCounts = knowledgeGovernanceCounts(allArticles);
  const cards = [
    ["Total Articles", String(healthCounts.totalArticles)],
    ["Published", String(healthCounts.published)],
    ["Drafts", String(healthCounts.drafts)],
    ["Archived", String(healthCounts.archived)],
    ["Pending Review", String(healthCounts.pendingReview)],
    ["Publication Status", knowledgeHealthChip(knowledgeStatus(article), knowledgeStatusBadge(article))],
    ["Review Status", knowledgeHealthChip(knowledgeReviewStatus(article), knowledgeReviewBadge(article))],
    ["Current Version", `v${knowledgeVersion(article)}`],
    ["Total Views", String(healthCounts.totalViews)],
    ["Unique Readers", String(healthCounts.uniqueReaders)],
    ["Helpful %", knowledgeHelpful(article)],
    ["Average Rating", String(knowledgeAverageRating(article))],
    ["Never Viewed", String(healthCounts.neverViewed)],
    ["Low Rating", String(healthCounts.lowRating)],
    ["No Review Schedule", String(healthCounts.withoutReviewSchedule)],
    ["Ticket Deflection", String(healthCounts.ticketPrevented)],
    ["Last Review", article.lastReviewDate || "Not reviewed"],
    ["Next Review", article.nextReviewDate || "Not scheduled"],
    ["Reading Time", knowledgeReadingTime(article)],
    ["Related Tickets", String(knowledgeRelatedRecords(article).tickets.length)],
    ["Related Assets", String(knowledgeRelatedRecords(article).assets.length)],
    ["Related Vendors", String(knowledgeRelatedRecords(article).vendors.length)],
    ["Related Contracts", String(knowledgeRelatedRecords(article).contracts.length)],
    ["Needs Review", String(healthCounts.needsReview)],
    ["Expired Reviews", String(healthCounts.expiredReviews)],
    ["Waiting Approval", String(healthCounts.waitingApproval)],
    ["Without Owner", String(healthCounts.withoutOwner)],
    ["Never Reviewed", String(healthCounts.neverReviewed)],
    ["Recently Published", String(healthCounts.recentlyPublished)],
    ["Recently Updated", String(healthCounts.recentlyUpdated)]
  ];
  return `<section class="surface-card asset-management-panel knowledge-health-panel"><div class="section-title"><div><p class="eyebrow">Knowledge Health</p><h4>Article lifecycle dashboard</h4><p class="muted">Publication, review, ownership, usage, and relationship signals.</p></div></div><div class="asset-state-grid knowledge-state-grid">${cards.map(([label, value]) => `<div><small>${escapeHtml(label)}</small><strong>${String(value).includes("<span") ? value : escapeHtml(value)}</strong></div>`).join("")}</div></section>`;
}

function knowledgeActionsSection(article) {
  const actions = [
    ["create", "Create Article"],
    ["submit_review", "Submit Review"],
    ["assign_reviewer", "Assign Reviewer"],
    ["approve", "Approve"],
    ["request_changes", "Request Changes"],
    ["reject", "Reject"],
    ["publish", "Publish"],
    ["schedule_review", "Schedule Review"],
    ["archive", "Archive"],
    ["duplicate", "Duplicate"],
    ["move_category", "Move Category"],
    ["share", "Share"],
    ["export_pdf", "Export PDF"],
    ["print", "Print"],
    ["copy_link", "Copy Link"],
    ["ticket", "Create Ticket"],
    ["upload_attachment", "Upload Attachment"],
    ["link_asset", "Link Asset"],
    ["link_vendor", "Link Vendor"],
    ["link_contract", "Link Contract"]
  ];
  return `<section class="surface-card asset-actions-panel knowledge-actions-panel"><div class="section-title"><div><p class="eyebrow">Knowledge Actions</p><h3>Workflow-driven action bar</h3><p class="muted">Lifecycle and relationship changes require confirmation and are recorded.</p></div></div><div class="asset-action-grid knowledge-action-grid">${actions.map(([action, label]) => `<button class="btn ${action === "archive" ? "btn-warning" : "btn-secondary"}" type="button" data-kb-workflow="${action}" data-id="${article.id}">${escapeHtml(label)}</button>`).join("")}</div></section>`;
}

function knowledgeWorkspaceTabContent(article, tab) {
  if (tab === "Article" || tab === "Content" || tab === "Attachments") return knowledgeArticleTab(article);
  if (tab === "Related Records") return knowledgeRelatedTab(article);
  if (tab === "Versions") return knowledgeTimelineTab(article);
  if (tab === "Comments") return knowledgeCommentsTab(article);
  if (tab === "Review Center" || tab === "Approval") return knowledgeOverviewTab(article);
  if (tab === "Timeline") return knowledgeTimelineTab(article);
  return knowledgeOverviewTab(article);
}

function knowledgeOverviewTab(article) {
  const overview = [
    ["Summary", article.summary || article.excerpt || firstSentence(article.body || article.bodyText || "") || "No summary provided"],
    ["Category", article.category || "Uncategorized"],
    ["Tags", knowledgeTags(article).join(", ") || "Not set"],
    ["Review Date", article.nextReviewDate || article.lastReviewDate || "Not scheduled"],
    ["Department", knowledgeDepartment(article)],
    ["Product", knowledgeProduct(article)],
    ["Language", knowledgeLanguage(article)],
    ["Keywords", article.keywords || "Not set"]
  ];
  return `<section class="surface-card knowledge-overview-card">
    <div class="section-title"><div><p class="eyebrow">Overview</p><h3>Article context</h3><p class="muted">The Article Snapshot carries publishing state; this view keeps supporting context concise.</p></div></div>
    <div class="knowledge-overview-grid">${overview.map(([label, value]) => `<div><small>${escapeHtml(label)}</small><strong>${escapeHtml(String(value))}</strong></div>`).join("")}</div>
  </section>`;
}

function knowledgeArticleTab(article) {
  const canEdit = has("knowledge_base", "edit") && !isEmployeeUser();
  return `<section class="knowledge-content-layout">
    <aside class="surface-card knowledge-toc-card">
      <p class="eyebrow">Table of Contents</p>
      <div data-kb-toc="${article.id}">${knowledgeToc(article)}</div>
    </aside>
    <section class="surface-card knowledge-content-card">
      <div class="section-title">
        <div><p class="eyebrow">Article</p><h3>${escapeHtml(article.title || "Article")}</h3><p class="muted">Readable knowledge content for support and self-service.</p></div>
      </div>
      <div class="knowledge-editor-status" data-kb-save-status="${article.id}">Saved</div>
      <div class="knowledge-editor-shell hidden" data-kb-editor-shell="${article.id}">
        ${knowledgeEditorToolbar(article)}
        <div class="knowledge-media-dropzone" data-kb-dropzone="${article.id}"><strong>Drop images, PDFs, videos, DOCX, GIF, SVG, ZIP, or attachments here</strong><small>Inline previews are inserted when possible. Files can also be uploaded from the Attachments tab.</small></div>
        <div class="knowledge-rich-editor" contenteditable="true" data-kb-editor="${article.id}" spellcheck="true">${knowledgeArticleHtml(article)}</div>
        <div class="knowledge-editor-actions"><button class="btn btn-primary" data-kb-save-content="${article.id}">Save Content</button><button class="btn btn-secondary" data-kb-toggle-editor="${article.id}">Reading View</button></div>
      </div>
      <article class="kb-article knowledge-reading-view" data-kb-reading="${article.id}">
        <div class="article-body knowledge-article-body">${knowledgeArticleHtmlWithHeadingIds(article)}</div>
      </article>
      ${knowledgeArticleAttachmentsInline(article)}
    </section>
  </section>`;
}

function knowledgeContentTab(article) {
  return knowledgeArticleTab(article);
}

function knowledgeArticleAttachmentsInline(article) {
  const attachments = knowledgeAttachments(article);
  if (!attachments.length) return "";
  return `<section class="knowledge-article-files"><div class="section-title"><div><p class="eyebrow">Attachments</p><h3>Supporting files</h3></div></div><div class="collection-grid">${attachments.map(attachmentCard).join("")}</div></section>`;
}

function knowledgeEditorToolbar(article) {
  const button = (cmd, label, value = "") => `<button type="button" class="btn btn-secondary" data-kb-command="${cmd}" data-value="${escapeHtml(value)}">${escapeHtml(label)}</button>`;
  const block = (type, label) => `<button type="button" class="btn btn-secondary" data-kb-insert-block="${type}" data-id="${article.id}">${escapeHtml(label)}</button>`;
  return `<div class="knowledge-editor-toolbar">
    <div class="toolbar-group">${button("formatBlock", "H1", "H1")}${button("formatBlock", "H2", "H2")}${button("formatBlock", "H3", "H3")}${button("bold", "Bold")}${button("italic", "Italic")}${button("underline", "Underline")}${button("foreColor", "Color", "#2563eb")}${button("hiliteColor", "Highlight", "#fef3c7")}</div>
    <div class="toolbar-group">${button("insertUnorderedList", "Bullets")}${button("insertOrderedList", "Numbers")}<button type="button" class="btn btn-secondary" data-kb-insert-checklist="${article.id}">Checklist</button><button type="button" class="btn btn-secondary" data-kb-insert-table="${article.id}">Table</button><button type="button" class="btn btn-secondary" data-kb-link="${article.id}">Link</button>${button("formatBlock", "Quote", "BLOCKQUOTE")}${button("formatBlock", "Code", "PRE")}${button("insertHorizontalRule", "Divider")}</div>
    <div class="toolbar-group">${["Information", "Warning", "Danger", "Success", "Tip", "Best Practice", "Requirement"].map((item) => block(item, item)).join("")}<button type="button" class="btn btn-secondary" data-kb-insert-procedure="${article.id}">Procedure</button></div>
  </div>`;
}

function knowledgeArticleHtml(article) {
  if (article.bodyHtml) return sanitizeArticleHtml(article.bodyHtml);
  return formatArticleBody(article.body || "Document the support steps, prerequisites, troubleshooting guidance, escalation path, and related resources for this article.");
}

function knowledgeArticleHtmlWithHeadingIds(article) {
  let index = 0;
  return knowledgeArticleHtml(article).replace(/<h([1-3])([^>]*)>/gi, (match, level, attrs) => {
    const idAttr = /\sid=/.test(attrs) ? attrs : `${attrs} id="kb-heading-${index++}"`;
    return `<h${level}${idAttr}>`;
  });
}

function sanitizeArticleHtml(html) {
  const raw = String(html || "");
  return raw
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/\son\w+="[^"]*"/gi, "")
    .replace(/\son\w+='[^']*'/gi, "")
    .replace(/javascript:/gi, "");
}

function knowledgeToc(article) {
  const html = knowledgeArticleHtml(article);
  const headings = [...html.matchAll(/<h([1-3])[^>]*>(.*?)<\/h\1>/gi)].map((match, index) => ({ level: match[1], title: match[2].replace(/<[^>]*>/g, ""), id: `kb-heading-${index}` }));
  return headings.length ? headings.map((heading) => `<button class="toc-link level-${heading.level}" data-kb-scroll-heading="${heading.id}">${escapeHtml(heading.title)}</button>`).join("") : emptyState("No headings yet", "Add H1, H2, or H3 headings to generate navigation.");
}

function knowledgeAttachmentsTab(article) {
  const attachments = knowledgeAttachments(article);
  return `<section class="surface-card"><div class="section-title"><div><p class="eyebrow">Attachments</p><h3>Linked files</h3></div><button class="btn btn-secondary" data-kb-workflow="upload_attachment" data-id="${article.id}">Upload Attachment</button></div><div class="table-wrap"><table><thead><tr><th>File Name</th><th>Type</th><th>Uploaded By</th><th>Date</th><th>Size</th><th>Actions</th></tr></thead><tbody>${attachments.map((item) => `<tr><td><strong>${escapeHtml(item.filename)}</strong></td><td>${escapeHtml(item.mimeType || "File")}</td><td>${escapeHtml(look("users", item.uploaderId) || "IT")}</td><td>${escapeHtml(item.uploadedAt ? new Date(item.uploadedAt).toLocaleString() : "Not dated")}</td><td>${escapeHtml(formatSize(item.size))}</td><td><div class="record-card-actions compact"><button class="btn btn-secondary" data-preview-attachment="${item.id}">${icon("preview")}Preview</button><button class="btn btn-secondary" data-download-attachment="${item.id}">${icon("download")}Download</button></div></td></tr>`).join("") || `<tr><td colspan="6">${emptyState("No Attachments", "Upload PDFs, images, Word, or Excel files for this article.")}</td></tr>`}</tbody></table></div></section>`;
}

function knowledgeRelatedTab(article) {
  const related = knowledgeRelatedRecords(article);
  const section = (title, module, items) => `<article class="surface-card"><div class="section-title"><div><p class="eyebrow">${escapeHtml(title)}</p><h3>${escapeHtml(tpl("{n} records", { n: items.length }))}</h3></div></div><div class="compact-list">${items.map((row) => `<button class="contract-linked-row" data-open-module="${module}" data-open-id="${row.id}"><strong>${escapeHtml(primaryTitle(module, row))}</strong><span>${escapeHtml(secondaryTitle(module, row) || t(module))}</span></button>`).join("") || emptyState("No Related Records", `${title} linked to this article will appear here.`)}</div></article>`;
  return `<section class="knowledge-related-grid">${section("Related Tickets", "tickets", related.tickets)}${section("Related Assets", "assets", related.assets)}${section("Related Vendors", "vendors", related.vendors)}${section("Related Contracts", "contracts", related.contracts)}${section("Related Documents", "documents", related.documents)}${section("Related Tasks", "tasks", related.tasks)}${section("Related Forms", "form_templates", related.forms)}${section("Related People", "employees", related.people)}${section("Related User Accounts", "users", related.users)}</section>`;
}

function knowledgeVersionsTab(article) {
  const versions = knowledgeVersions(article);
  return `<section class="surface-card knowledge-governance-panel">
    <div class="section-title">
      <div><p class="eyebrow">Versions</p><h3>Version history</h3><p class="muted">Published history is append-only. Restores create a new version instead of overwriting old content.</p></div>
      <button class="btn btn-secondary" data-kb-version-compare="${article.id}">Compare Versions</button>
    </div>
    <div class="ticket-workspace-info knowledge-version-grid">
      <div class="ticket-info-card"><small>Current Version</small><strong>v${escapeHtml(String(knowledgeVersion(article)))}</strong></div>
      <div class="ticket-info-card"><small>Total Versions</small><strong>${versions.length}</strong></div>
      <div class="ticket-info-card"><small>Latest Published</small><strong>${escapeHtml(versions[0]?.publishDate || article.publishedAt || "Not published")}</strong></div>
      <div class="ticket-info-card"><small>Reviewer</small><strong>${escapeHtml(look("users", article.reviewerId) || look("users", versions[0]?.reviewerId) || "Not assigned")}</strong></div>
    </div>
    <div class="knowledge-version-list">
      ${versions.map((version) => `<article class="knowledge-version-card">
        <div>
          <span class="badge ${version.status === "Published" ? "success" : "neutral"}">v${escapeHtml(version.versionNumber || version.version || "1.0")}</span>
          <strong>${escapeHtml(version.title || article.title || "Untitled article")}</strong>
          <p class="muted">${escapeHtml(version.changeSummary || version.summary || "No change summary recorded.")}</p>
        </div>
        <div class="knowledge-version-meta">
          <span><small>Author</small><strong>${escapeHtml(look("users", version.authorId) || "IT")}</strong></span>
          <span><small>Published</small><strong>${escapeHtml(version.publishDate || "Not published")}</strong></span>
          <span><small>Status</small><strong>${escapeHtml(version.status || "Published")}</strong></span>
          <span><small>Reviewer</small><strong>${escapeHtml(look("users", version.reviewerId) || "Not assigned")}</strong></span>
        </div>
        <div class="record-card-actions compact">
          <button class="btn btn-secondary" data-kb-version-open="${article.id}" data-version-id="${escapeHtml(version.id)}">Open</button>
          <button class="btn btn-secondary" data-kb-version-compare="${article.id}" data-version-id="${escapeHtml(version.id)}">Compare</button>
          <button class="btn btn-secondary" data-kb-version-download="${article.id}" data-version-id="${escapeHtml(version.id)}">Download</button>
          <button class="btn btn-warning" data-kb-version-restore="${article.id}" data-version-id="${escapeHtml(version.id)}">Restore</button>
        </div>
      </article>`).join("") || emptyState("No Versions Yet", "Publish the article to create the first immutable version.")}
    </div>
  </section>`;
}

function knowledgeCommentsTab(article) {
  return `<section class="surface-card"><div class="section-title"><div><p class="eyebrow">Internal Discussion</p><h3>IT comments</h3><p class="muted">Employee users cannot access internal knowledge comments.</p></div></div>${commentsFor("knowledge_base", article)}</section>`;
}

function knowledgeApprovalTab(article) {
  const history = Array.isArray(article.reviewHistory) ? [...article.reviewHistory].reverse() : [];
  const comments = (state.db.comments || []).filter((item) => item.entityType === "knowledge_base" && item.entityId === article.id);
  return `<section class="surface-card knowledge-governance-panel">
    <div class="section-title">
      <div><p class="eyebrow">Review Center</p><h3>Approval workflow</h3><p class="muted">Controlled lifecycle for drafts, review, approval, publishing, and scheduled review.</p></div>
    </div>
    <div class="ticket-workspace-info knowledge-version-grid">
      <div class="ticket-info-card"><small>Approval Status</small><strong>${escapeHtml(knowledgeStatus(article))}</strong></div>
      <div class="ticket-info-card"><small>Assigned Reviewer</small><strong>${escapeHtml(look("users", article.reviewerId) || "Not assigned")}</strong></div>
      <div class="ticket-info-card"><small>Review Deadline</small><strong>${escapeHtml(article.reviewDeadline || "Not set")}</strong></div>
      <div class="ticket-info-card"><small>Next Review</small><strong>${escapeHtml(article.nextReviewDate || "Not scheduled")}</strong></div>
    </div>
    <div class="knowledge-review-actions">
      ${["submit_review", "assign_reviewer", "approve", "request_changes", "reject", "publish", "schedule_review"].map((workflow) => `<button class="btn btn-secondary" data-kb-workflow="${workflow}" data-id="${article.id}">${escapeHtml(labelize(workflow))}</button>`).join("")}
    </div>
    <div class="knowledge-review-grid">
      <article class="knowledge-review-card"><h4>Review Notes</h4><p>${escapeHtml(article.reviewNotes || article.reviewDecisionNotes || "No review notes recorded yet.")}</p></article>
      <article class="knowledge-review-card"><h4>Ownership</h4><p><strong>Owner:</strong> ${escapeHtml(knowledgeOwnerLabel(article))}</p><p><strong>Backup Owner:</strong> ${escapeHtml(look("users", article.backupOwnerId) || article.backupOwner || "Not assigned")}</p><p><strong>Department:</strong> ${escapeHtml(knowledgeDepartment(article))}</p><p><strong>Product:</strong> ${escapeHtml(knowledgeProduct(article))}</p><p><strong>Technical Area:</strong> ${escapeHtml(article.technicalArea || "Not set")}</p><p><strong>Business Area:</strong> ${escapeHtml(article.businessArea || "Not set")}</p></article>
      <article class="knowledge-review-card"><h4>Change Log</h4>${knowledgeChangeLog(article)}</article>
      <article class="knowledge-review-card"><h4>Review Comments</h4>${comments.length ? comments.slice(0, 5).map((comment) => `<p><strong>${escapeHtml(look("users", comment.authorId) || "IT")}:</strong> ${escapeHtml(comment.body || comment.comment || "")}</p>`).join("") : `<p class="muted">No approval discussion yet.</p>`}</article>
    </div>
    <div class="timeline-feed knowledge-review-history">
      ${history.map((item) => `<article class="timeline-card"><div class="timeline-meta"><span>${escapeHtml(look("users", item.actorId) || "System")}</span><span>${escapeHtml(item.createdAt || "")}</span></div><strong>${escapeHtml(knowledgeTimelineTitle(item.action))}</strong><p class="muted">${escapeHtml(item.notes || item.message || "")}</p></article>`).join("") || emptyState("No review history", "Submit the draft for review to start the controlled approval lifecycle.")}
    </div>
  </section>`;
}

function knowledgeTimelineTab(article) {
  const events = (state.db.timeline || []).filter((item) => item.entityId === article.id && ["knowledge_base", "knowledge_base"].includes(item.entityType));
  return `<div class="timeline-feed">${events.map((item) => `<article class="timeline-card"><div class="timeline-meta"><span>${escapeHtml(look("users", item.actorUserId) || "System")}</span><span>${item.createdAt ? new Date(item.createdAt).toLocaleString() : ""}</span></div><strong>${escapeHtml(knowledgeTimelineTitle(item.title))}</strong><p class="muted">${escapeHtml(item.description || "")}</p></article>`).join("") || emptyState("No timeline yet", "Article created, updated, published, archived, comments, and attachments will appear here.")}</div>`;
}

function knowledgeStatus(article) {
  if (article.archivedAt) return "Archived";
  if (article.status) return labelize(article.status);
  if (article.published === true || article.published === "true" || article.published === "Published") return "Published";
  return "Draft";
}

function knowledgeStatusBadge(article) {
  const status = knowledgeStatus(article);
  if (status === "Published") return "success";
  if (["In Review", "Changes Requested", "Approved", "Needs Review"].includes(status)) return "warning";
  if (["Archived", "Retired", "Rejected"].includes(status)) return "neutral";
  if (status === "Expired") return "critical";
  return "info";
}

function knowledgeReviewStatus(article) {
  if (article.reviewStatus) return article.reviewStatus;
  if (article.nextReviewDate && article.nextReviewDate < today()) return "Needs Review";
  return "Current";
}

function knowledgeReviewBadge(article) {
  const status = knowledgeReviewStatus(article);
  return status === "Expired" ? "critical" : status === "Needs Review" ? "warning" : "success";
}

function knowledgeHealthChip(label, tone) {
  return `<span class="badge ${escapeHtml(tone || "neutral")}">${escapeHtml(label)}</span>`;
}

function knowledgeOwnerLabel(article) {
  return look("users", article.ownerId || article.ownerUserId) || look("employees", article.ownerEmployeeId) || "IT";
}

function knowledgeAudience(article) { return article.audience || "Employees"; }
function knowledgeDepartment(article) { return look("departments", article.departmentId) || article.department || "IT"; }
function knowledgeProduct(article) { return article.product || article.relatedProduct || article.category || "General"; }
function knowledgeLanguage(article) { return article.language || "English"; }
function knowledgeVersion(article) { return article.version || "1.0"; }
function knowledgeViews(article) { return Number(article.views || article.viewCount || 0); }
function knowledgeUniqueReaders(article) { return Number(article.uniqueReaders || article.uniqueUsers || (Array.isArray(article.uniqueReaderIds) ? article.uniqueReaderIds.length : 0)); }
function knowledgeHelpfulVotes(article) { return Number(article.helpfulVotes || article.helpfulYes || 0); }
function knowledgeNotHelpfulVotes(article) { return Number(article.notHelpfulVotes || article.helpfulNo || 0); }
function knowledgeFavoritesCount(article) { return Number(article.favoritesCount || (Array.isArray(article.favoriteUserIds) ? article.favoriteUserIds.length : 0)); }
function knowledgeAverageRating(article) {
  if (article.averageRating) return Number(article.averageRating);
  const yes = knowledgeHelpfulVotes(article);
  const no = knowledgeNotHelpfulVotes(article);
  return yes + no ? Number(((yes * 5 + no) / (yes + no)).toFixed(1)) : 0;
}
function knowledgeHelpful(article) {
  if (article.helpfulPercent) return `${article.helpfulPercent}%`;
  const yes = knowledgeHelpfulVotes(article);
  const no = knowledgeNotHelpfulVotes(article);
  return yes + no ? `${Math.round((yes / (yes + no)) * 100)}%` : "Not rated";
}
function knowledgeTags(article) {
  if (Array.isArray(article.tags)) return article.tags;
  return String(article.tagsText || article.tags || "").split(",").map((item) => item.trim()).filter(Boolean);
}
function knowledgeReadingTime(article) {
  // Stored values arrive as English strings like "4 min read"; re-template them
  // so they follow the active language instead of leaking through.
  if (article.readingTime) {
    const stored = String(article.readingTime).match(/^\s*(\d+)\s*min read\s*$/i);
    return stored ? tpl("{n} min read", { n: stored[1] }) : article.readingTime;
  }
  const words = String(article.body || article.title || "").trim().split(/\s+/).filter(Boolean).length;
  return tpl("{n} min read", { n: Math.max(1, Math.ceil(words / 180)) });
}
function knowledgeSearchText(article) {
  return [article.title, article.category, knowledgeTags(article).join(" "), article.keywords, article.body, article.bodyHtml, knowledgeOwnerLabel(article), knowledgeProduct(article)].join(" ").toLowerCase();
}
function typoTolerantIncludes(text, query) {
  const q = String(query || "").toLowerCase().trim();
  if (!q) return true;
  if (text.includes(q)) return true;
  return q.split(/\s+/).some((term) => term.length > 3 && text.split(/\W+/).some((word) => word.length > 3 && levenshtein(word.slice(0, 24), term.slice(0, 24)) <= 1));
}
function levenshtein(a, b) {
  const dp = Array.from({ length: a.length + 1 }, (_, i) => [i]);
  for (let j = 1; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  }
  return dp[a.length][b.length];
}
function knowledgeSearchScore(article, query = "") {
  const q = String(query || "").toLowerCase().trim();
  const terms = q.split(/\s+/).filter((term) => term.length > 2);
  const title = String(article.title || "").toLowerCase();
  const tags = knowledgeTags(article).join(" ").toLowerCase();
  const keywords = String(article.keywords || "").toLowerCase();
  const searchText = knowledgeSearchText(article);
  let score = knowledgeViews(article) * 0.2 + knowledgeHelpfulVotes(article) * 3 + knowledgeFavoritesCount(article) * 2;
  if (String(article.updatedAt || "").slice(0, 10) >= new Date(Date.now() - 30 * 86400000).toISOString().slice(0, 10)) score += 2;
  if (!q) return score;
  if (title.includes(q)) score += 30;
  if (tags.includes(q)) score += 18;
  if (keywords.includes(q)) score += 12;
  if (searchText.includes(q)) score += 8;
  terms.forEach((term) => {
    if (title.includes(term)) score += 12;
    else if (tags.includes(term)) score += 8;
    else if (keywords.includes(term)) score += 6;
    else if (searchText.includes(term)) score += 3;
  });
  if (typoTolerantIncludes(searchText, q)) score += 4;
  return score;
}
function knowledgeAttachments(article) {
  return (state.db.attachments || []).filter((item) => item.entityType === "knowledge_base" && item.entityId === article.id);
}

function knowledgeGovernanceCounts(articles) {
  const todayValue = today();
  const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10);
  return {
    totalArticles: articles.length,
    published: articles.filter((item) => knowledgeStatus(item) === "Published").length,
    drafts: articles.filter((item) => knowledgeStatus(item) === "Draft").length,
    archived: articles.filter((item) => knowledgeStatus(item) === "Archived").length,
    pendingReview: articles.filter((item) => ["In Review", "Approved", "Changes Requested"].includes(knowledgeStatus(item))).length,
    totalViews: articles.reduce((sum, item) => sum + knowledgeViews(item), 0),
    uniqueReaders: articles.reduce((sum, item) => sum + knowledgeUniqueReaders(item), 0),
    needsReview: articles.filter((item) => item.nextReviewDate && item.nextReviewDate <= todayValue && !item.archivedAt).length,
    expiredReviews: articles.filter((item) => item.nextReviewDate && item.nextReviewDate < todayValue && !item.archivedAt).length,
    waitingApproval: articles.filter((item) => ["In Review", "Approved", "Changes Requested"].includes(knowledgeStatus(item))).length,
    withoutOwner: articles.filter((item) => !item.ownerId && !item.ownerUserId && !item.ownerEmployeeId).length,
    withoutReviewSchedule: articles.filter((item) => !item.nextReviewDate && knowledgeStatus(item) === "Published").length,
    neverReviewed: articles.filter((item) => !item.lastReviewDate && !item.approvalDate).length,
    neverViewed: articles.filter((item) => knowledgeViews(item) === 0).length,
    lowRating: articles.filter((item) => knowledgeAverageRating(item) > 0 && knowledgeAverageRating(item) < 3).length,
    ticketPrevented: articles.reduce((sum, item) => sum + Number(item.ticketPreventedCount || 0), 0),
    recentlyPublished: articles.filter((item) => String(item.publishedAt || "").slice(0, 10) >= weekAgo).length,
    recentlyUpdated: articles.filter((item) => String(item.updatedAt || "").slice(0, 10) >= weekAgo).length
  };
}

function knowledgeVersions(article) {
  const history = Array.isArray(article.versionHistory) ? article.versionHistory : [];
  const versions = history.map((version, index) => ({
    id: version.id || `version_${index}`,
    versionNumber: version.versionNumber || version.version || "1.0",
    title: version.title || article.title || "Untitled article",
    bodyHtml: version.bodyHtml || "",
    body: version.body || "",
    authorId: version.authorId || article.ownerId || article.ownerUserId,
    publishDate: version.publishDate || version.publishedAt || "",
    reviewerId: version.reviewerId || article.reviewerId,
    approvalDate: version.approvalDate || article.approvalDate || "",
    changeSummary: version.changeSummary || version.summary || "",
    reasonForUpdate: version.reasonForUpdate || "",
    status: version.status || "Published"
  }));
  if (!versions.length && (article.published || knowledgeStatus(article) === "Published")) {
    versions.push({
      id: "current",
      versionNumber: knowledgeVersion(article),
      title: article.title || "Untitled article",
      bodyHtml: article.bodyHtml || "",
      body: article.body || "",
      authorId: article.ownerId || article.ownerUserId,
      publishDate: article.publishedAt || article.createdAt || "",
      reviewerId: article.reviewerId,
      approvalDate: article.approvalDate || "",
      changeSummary: article.changeSummary || "Initial published version",
      reasonForUpdate: article.reasonForUpdate || "",
      status: "Published"
    });
  }
  return versions.sort((a, b) => knowledgeVersionSortValue(b.versionNumber) - knowledgeVersionSortValue(a.versionNumber));
}

function knowledgeVersionSortValue(version) {
  const [major, minor] = String(version || "0.0").replace(/^v/i, "").split(".").map((part) => Number(part) || 0);
  return major * 1000 + minor;
}

function knowledgeVersionById(article, versionId) {
  return knowledgeVersions(article).find((version) => version.id === versionId) || knowledgeVersions(article)[0];
}

function knowledgeChangeLog(article) {
  const items = [
    ["What changed?", article.changeSummary || article.whatChanged],
    ["Why was it changed?", article.reasonForUpdate || article.whyChanged],
    ["Business impact", article.businessImpact],
    ["Risk level", article.riskLevel],
    ["Affected systems", article.affectedSystems],
    ["Related incident", article.relatedIncident],
    ["Related ticket", look("tickets", article.relatedTicketId) || article.relatedTicketId]
  ];
  return items.map(([label, value]) => `<p><strong>${escapeHtml(label)}</strong> ${escapeHtml(value || "Not set")}</p>`).join("");
}

function knowledgeRelatedRecords(article) {
  const ids = (key) => new Set([...(article[key] || []), ...(article.relatedRecords?.[key] || [])].filter(Boolean));
  const relatedId = String(article.relatedId || "");
  return {
    tickets: rows("tickets").filter((row) => ids("ticketIds").has(row.id) || (article.relatedType === "ticket" && relatedId === row.id)),
    assets: rows("assets").filter((row) => ids("assetIds").has(row.id) || (article.relatedType === "asset" && relatedId === row.id)),
    vendors: rows("vendors").filter((row) => ids("vendorIds").has(row.id) || (article.relatedType === "vendor" && relatedId === row.id)),
    contracts: rows("contracts").filter((row) => ids("contractIds").has(row.id) || (article.relatedType === "contract" && relatedId === row.id)),
    documents: rows("documents").filter((row) => ids("documentIds").has(row.id) || (article.relatedType === "document" && relatedId === row.id)),
    tasks: rows("tasks").filter((row) => ids("taskIds").has(row.id) || (article.relatedType === "task" && relatedId === row.id)),
    forms: rows("form_templates").filter((row) => ids("formIds").has(row.id) || (article.relatedType === "form_template" && relatedId === row.id)),
    people: rows("employees").filter((row) => ids("employeeIds").has(row.id) || (article.relatedType === "employee" && relatedId === row.id)),
    users: rows("users").filter((row) => ids("userIds").has(row.id) || (article.relatedType === "user" && relatedId === row.id))
  };
}
function knowledgeTimelineTitle(title) {
  const normalized = String(title || "").toLowerCase();
  if (normalized.includes("approve")) return "Article approved";
  if (normalized.includes("reject")) return "Article rejected";
  if (normalized.includes("changes")) return "Changes requested";
  if (normalized.includes("restore")) return "Version restored";
  if (normalized.includes("version")) return "Version created";
  if (normalized.includes("schedule")) return "Review scheduled";
  if (normalized.includes("reviewer")) return "Reviewer assigned";
  if (normalized.includes("publish")) return "Article published";
  if (normalized.includes("archive")) return "Article archived";
  if (normalized.includes("attachment") || normalized.includes("upload")) return "Attachment uploaded";
  if (normalized.includes("comment")) return "Comment added";
  if (normalized.includes("category")) return "Category changed";
  if (normalized.includes("owner")) return "Owner changed";
  if (normalized.includes("draft")) return "Draft saved";
  if (normalized.includes("export")) return "Content exported";
  if (normalized.includes("review")) return "Article submitted for review";
  if (normalized.includes("create")) return "Article created";
  if (normalized.includes("update")) return "Article updated";
  return labelize(title || "Knowledge activity");
}

function openKnowledgeWorkflowDialog(articleId, workflow) {
  const article = rows("knowledge_base").find((item) => item.id === articleId);
  if (!article) return;
  if (workflow === "compare_versions") return openKnowledgeCompareDialog(article.id);
  if (workflow === "create") return openModal("knowledge_base");
  if (workflow === "ticket") return confirmDialog("Create ticket?", `Create a ticket related to ${article.title}?`, { confirmText: "Create Ticket" }).then((ok) => ok && openModal("tickets", null, { category: "Knowledge Base", priority: "medium", relatedType: "knowledge_base", relatedId: article.id, description: `Knowledge Base request for ${article.title}` }));
  if (workflow === "copy_link") {
    const link = `${location.origin}/knowledge_base/${article.id}`;
    navigator.clipboard?.writeText(link);
    toast("Link copied", "Article link copied to clipboard.");
    return;
  }
  if (workflow === "print") return window.print();
  if (workflow === "export_pdf") return exportKnowledgeArticle(article.id, "pdf");
  if (workflow === "share") {
    navigator.clipboard?.writeText(`${location.origin}/knowledge_base/${article.id}`);
    return toast("Share link ready", "Article link copied to clipboard.");
  }
  const def = knowledgeWorkflowDefinition(article, workflow);
  if (!def) return;
  const host = $("#modalHost") || $("#menuHost");
  host.innerHTML = `<div class="modal-backdrop"><form class="modal surface-card contract-workflow-modal knowledge-workflow-modal"><div class="modal-head"><div><p class="eyebrow">Knowledge workflow</p><h3>${escapeHtml(def.title)}</h3><p class="muted">${escapeHtml(def.subtitle || "")}</p></div><button type="button" class="icon-btn close" aria-label="Close">${icon("close")}</button></div><div class="modal-fields"><div class="form-error" data-form-error hidden></div><div class="asset-workflow-summary"><strong>${escapeHtml(article.title)}</strong><span>${escapeHtml(article.category || "Knowledge Base")}</span><small>${escapeHtml(knowledgeStatus(article))} | v${escapeHtml(String(knowledgeVersion(article)))}</small></div>${def.fields}</div><div class="modal-actions"><button type="button" class="btn btn-secondary close">Cancel</button><button type="submit" class="btn btn-primary">${escapeHtml(def.confirmAction || "Confirm")}</button></div></form></div>`;
  const form = $(".modal", host);
  $$(".close", form).forEach((button) => button.addEventListener("click", () => host.innerHTML = ""));
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const body = { workflow };
    for (const [key, value] of data.entries()) {
      if (body[key]) body[key] = Array.isArray(body[key]) ? [...body[key], value] : [body[key], value];
      else body[key] = value;
    }
    const confirmed = await confirmDialog(def.title, knowledgeWorkflowConfirmation(article, workflow, body), { confirmText: def.confirmAction || "Confirm" });
    if (!confirmed) return;
    await api(`/api/knowledge_base/${article.id}/workflow`, { method: "PATCH", body: JSON.stringify(body) });
    host.innerHTML = "";
    await loadState();
    toast("Knowledge updated", `${article.title} workflow was recorded.`);
    render();
  });
}

function knowledgeWorkflowDefinition(article, workflow) {
  const assets = rows("assets").map((asset) => ({ value: asset.id, label: `${asset.assetNumber || asset.id} - ${assetDisplayName(asset)}`, checked: knowledgeRelatedRecords(article).assets.some((item) => item.id === asset.id) }));
  const vendors = rows("vendors").map((vendor) => ({ value: vendor.id, label: vendor.name, checked: knowledgeRelatedRecords(article).vendors.some((item) => item.id === vendor.id) }));
  const contracts = rows("contracts").map((contract) => ({ value: contract.id, label: `${contractNumber(contract)} - ${contract.name}`, checked: knowledgeRelatedRecords(article).contracts.some((item) => item.id === contract.id) }));
  const reviewers = rows("users").filter((user) => ["role_manager", "role_staff", "role_admin"].includes(user.roleId));
  const reviewerOptions = reviewers.map((user) => user.name || user.username || user.id);
  const map = {
    publish: { title: "Publish Article", confirmAction: "Publish", subtitle: "Create a new immutable version and make this article visible to employees.", fields: `${contractWorkflowField("changeSummary", "What changed?", "textarea", { required: true, full: true })}${contractWorkflowField("reasonForUpdate", "Why was it changed?", "textarea", { required: true, full: true })}${contractWorkflowField("businessImpact", "Business impact", "textarea", { full: true })}${contractWorkflowField("riskLevel", "Risk level", "select", { options: ["Low", "Medium", "High", "Critical"] })}${contractWorkflowField("affectedSystems", "Affected systems", "text")}${contractWorkflowField("relatedIncident", "Related incident", "text")}${contractWorkflowField("relatedTicketId", "Related ticket ID", "text")}` },
    submit_review: { title: "Submit for Review", confirmAction: "Submit", subtitle: "Move this draft into controlled review.", fields: `${contractWorkflowField("notes", "Review notes", "textarea", { full: true })}` },
    assign_reviewer: { title: "Assign Reviewer", confirmAction: "Assign", subtitle: "Assign an IT reviewer and optional deadline.", fields: `${contractWorkflowField("reviewerName", "Reviewer", "select", { required: true, options: reviewerOptions, value: look("users", article.reviewerId) || "" })}${contractWorkflowField("reviewDeadline", "Review deadline", "date", { value: article.reviewDeadline || "" })}` },
    approve: { title: "Approve Article", confirmAction: "Approve", subtitle: "Approve this article for publishing.", fields: `${contractWorkflowField("notes", "Approval notes", "textarea", { full: true })}` },
    request_changes: { title: "Request Changes", confirmAction: "Request Changes", subtitle: "Send the draft back to the author with requested changes.", fields: `${contractWorkflowField("notes", "Changes requested", "textarea", { required: true, full: true })}` },
    reject: { title: "Reject Article", confirmAction: "Reject", subtitle: "Reject this draft and record the reason.", fields: `${contractWorkflowField("reason", "Rejection reason", "textarea", { required: true, full: true })}` },
    schedule_review: { title: "Schedule Review", confirmAction: "Schedule", subtitle: "Configure the recurring governance review.", fields: `${contractWorkflowField("nextReviewDate", "Next review date", "date", { required: true, value: article.nextReviewDate || "" })}${contractWorkflowField("reviewFrequency", "Review frequency", "select", { options: ["30 Days", "60 Days", "90 Days", "180 Days", "365 Days", "Custom"], value: article.reviewFrequency || "90 Days" })}${contractWorkflowField("customReviewDays", "Custom days", "number")}${contractWorkflowField("notes", "Schedule notes", "textarea", { full: true })}` },
    archive: { title: "Archive Article", confirmAction: "Archive", subtitle: "Archive this article without deleting history.", fields: `${contractWorkflowField("reason", "Archive reason", "textarea", { required: true, full: true })}` },
    duplicate: { title: "Duplicate Article", confirmAction: "Duplicate", subtitle: "Create a draft copy for reuse.", fields: `${contractWorkflowField("title", "New title", "text", { required: true, value: `${article.title || "Article"} copy` })}` },
    move_category: { title: "Move Category", confirmAction: "Move", subtitle: "Change the article category.", fields: `${contractWorkflowField("category", "New category", "text", { required: true, value: article.category || "" })}` },
    upload_attachment: { title: "Upload Attachment", confirmAction: "Create Attachment Record", subtitle: "Create a linked attachment placeholder.", fields: `${contractWorkflowField("filename", "File name", "text", { required: true })}${contractWorkflowField("mimeType", "File type", "select", { options: ["application/pdf", "image/png", "application/msword", "application/vnd.ms-excel"] })}` },
    link_asset: { title: "Link Assets", confirmAction: "Save Links", subtitle: "Connect assets related to this article.", fields: `${contractWorkflowField("assetIds", "Assets", "checkboxes", { options: assets })}` },
    link_vendor: { title: "Link Vendors", confirmAction: "Save Links", subtitle: "Connect vendors related to this article.", fields: `${contractWorkflowField("vendorIds", "Vendors", "checkboxes", { options: vendors })}` },
    link_contract: { title: "Link Contracts", confirmAction: "Save Links", subtitle: "Connect contracts related to this article.", fields: `${contractWorkflowField("contractIds", "Contracts", "checkboxes", { options: contracts })}` }
  };
  return map[workflow];
}

function knowledgeWorkflowConfirmation(article, workflow, body) {
  const lines = [`Article: ${article.title}`, `Workflow: ${knowledgeWorkflowDefinition(article, workflow)?.title || labelize(workflow)}`];
  if (body.category) lines.push(`Category: ${body.category}`);
  if (body.title) lines.push(`New title: ${body.title}`);
  if (body.filename) lines.push(`Attachment: ${body.filename}`);
  if (body.reviewerName) lines.push(`Reviewer: ${body.reviewerName}`);
  if (body.changeSummary) lines.push(`Change summary: ${body.changeSummary}`);
  lines.push("Timeline, audit, and notifications will be recorded.");
  return lines.join("\n");
}

function openKnowledgeVersionDialog(articleId, versionId) {
  const article = rows("knowledge_base").find((item) => item.id === articleId);
  const version = article && knowledgeVersionById(article, versionId);
  if (!article || !version) return;
  const host = $("#modalHost") || $("#menuHost");
  host.innerHTML = `<div class="modal-backdrop"><div class="modal surface-card knowledge-version-modal"><div class="modal-head"><div><p class="eyebrow">Version v${escapeHtml(version.versionNumber)}</p><h3>${escapeHtml(version.title || article.title)}</h3><p class="muted">${escapeHtml(version.publishDate || "Not dated")} | ${escapeHtml(look("users", version.authorId) || "IT")}</p></div><button type="button" class="icon-btn close" aria-label="Close">${icon("close")}</button></div><article class="kb-article knowledge-reading-view"><div class="article-body knowledge-article-body">${sanitizeArticleHtml(version.bodyHtml || formatArticleBody(version.body || ""))}</div></article><div class="modal-actions"><button type="button" class="btn btn-secondary close">Close</button></div></div></div>`;
  $$(".close", host).forEach((button) => button.addEventListener("click", () => host.innerHTML = ""));
}

function openKnowledgeCompareDialog(articleId, initialVersionId = "") {
  const article = rows("knowledge_base").find((item) => item.id === articleId);
  if (!article) return;
  const versions = knowledgeVersions(article);
  if (versions.length < 2) return toast("Compare unavailable", "At least two versions are required for comparison.");
  const host = $("#modalHost") || $("#menuHost");
  const options = versions.map((version) => `<option value="${escapeHtml(version.id)}">v${escapeHtml(version.versionNumber)} - ${escapeHtml(version.publishDate || "Not dated")}</option>`).join("");
  const from = initialVersionId || versions[1]?.id || versions[0].id;
  const to = versions[0].id;
  host.innerHTML = `<div class="modal-backdrop"><div class="modal surface-card knowledge-compare-modal"><div class="modal-head"><div><p class="eyebrow">Compare Versions</p><h3>${escapeHtml(article.title || "Article")}</h3><p class="muted">Side-by-side comparison highlights added and removed text.</p></div><button type="button" class="icon-btn close" aria-label="Close">${icon("close")}</button></div><div class="knowledge-compare-controls"><label>From<select data-kb-compare-from>${options}</select></label><label>To<select data-kb-compare-to>${options}</select></label><button class="btn btn-primary" data-kb-run-compare>Compare</button></div><div data-kb-compare-result></div><div class="modal-actions"><button type="button" class="btn btn-secondary close">Close</button></div></div></div>`;
  const fromSelect = $("[data-kb-compare-from]", host);
  const toSelect = $("[data-kb-compare-to]", host);
  fromSelect.value = from;
  toSelect.value = to;
  const renderCompare = () => {
    const left = knowledgeVersionById(article, fromSelect.value);
    const right = knowledgeVersionById(article, toSelect.value);
    $("[data-kb-compare-result]", host).innerHTML = knowledgeCompareHtml(left, right);
  };
  $("[data-kb-run-compare]", host).addEventListener("click", renderCompare);
  $$(".close", host).forEach((button) => button.addEventListener("click", () => host.innerHTML = ""));
  renderCompare();
}

function knowledgeCompareHtml(left, right) {
  const leftText = htmlToPlainText(left?.bodyHtml || left?.body || "");
  const rightText = htmlToPlainText(right?.bodyHtml || right?.body || "");
  const leftWords = new Set(leftText.toLowerCase().split(/\s+/).filter(Boolean));
  const rightWords = new Set(rightText.toLowerCase().split(/\s+/).filter(Boolean));
  const mark = (text, otherWords, className) => escapeHtml(text).split(/\s+/).map((word) => otherWords.has(word.toLowerCase()) ? word : `<mark class="${className}">${word}</mark>`).join(" ");
  return `<div class="knowledge-compare-grid"><article><h4>v${escapeHtml(left?.versionNumber || "")}</h4><p>${mark(leftText, rightWords, "diff-removed")}</p></article><article><h4>v${escapeHtml(right?.versionNumber || "")}</h4><p>${mark(rightText, leftWords, "diff-added")}</p></article></div>`;
}

function htmlToPlainText(value) {
  return String(value || "").replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

async function restoreKnowledgeVersion(articleId, versionId) {
  const article = rows("knowledge_base").find((item) => item.id === articleId);
  const version = article && knowledgeVersionById(article, versionId);
  if (!article || !version) return;
  const ok = await confirmDialog("Restore version?", `Restore v${version.versionNumber} as a new version? Existing history will be preserved.`, { confirmText: "Restore" });
  if (!ok) return;
  await api(`/api/knowledge_base/${article.id}/workflow`, { method: "PATCH", body: JSON.stringify({ workflow: "restore_version", versionId, changeSummary: `Restored version ${version.versionNumber}`, reasonForUpdate: "Knowledge governance restore" }) });
  await loadState();
  toast("Version restored", "A new version was created from the selected version.");
  render();
}

async function downloadKnowledgeVersion(articleId, versionId) {
  const article = rows("knowledge_base").find((item) => item.id === articleId);
  const version = article && knowledgeVersionById(article, versionId);
  if (!article || !version) return;
  await api(`/api/knowledge_base/${article.id}/workflow`, { method: "PATCH", body: JSON.stringify({ workflow: "export", format: `version ${version.versionNumber}` }) });
  downloadTextFile(`${article.title || "article"}-v${version.versionNumber}.html`, `<!doctype html><html><head><meta charset="utf-8"><title>${escapeHtml(article.title)} v${escapeHtml(version.versionNumber)}</title></head><body>${version.bodyHtml || formatArticleBody(version.body || "")}</body></html>`, "text/html");
}

function formatArticleBody(body) {
  return escapeHtml(body).split(/\n{2,}/).map((para) => `<p>${para.replace(/\n/g, "<br>")}</p>`).join("");
}

function toggleKnowledgeEditor(articleId) {
  const shell = $(`[data-kb-editor-shell="${articleId}"]`);
  const reading = $(`[data-kb-reading="${articleId}"]`);
  if (!shell || !reading) return;
  const open = shell.classList.contains("hidden");
  shell.classList.toggle("hidden", !open);
  reading.classList.toggle("hidden", open);
  if (open) $(`[data-kb-editor="${articleId}"]`)?.focus();
}

function runKnowledgeCommand(command, value = "") {
  document.execCommand(command, false, value || null);
}

function insertKnowledgeHtml(articleId, html) {
  const editor = $(`[data-kb-editor="${articleId}"]`);
  if (!editor) return;
  editor.focus();
  document.execCommand("insertHTML", false, html);
  scheduleKnowledgeAutosave(articleId);
}

function insertKnowledgeBlock(articleId, type) {
  const tone = String(type || "Information").toLowerCase().replace(/\s+/g, "-");
  insertKnowledgeHtml(articleId, `<aside class="kb-special-block ${tone}"><strong>${escapeHtml(type)}</strong><p>Document the ${escapeHtml(type.toLowerCase())} guidance here.</p></aside>`);
}

function insertKnowledgeProcedure(articleId) {
  insertKnowledgeHtml(articleId, `<section class="kb-procedure"><h2>Procedure</h2><article class="kb-procedure-step"><label><input type="checkbox"> Step 1</label><h3>Step title</h3><p>Describe the action, expected result, and validation.</p><small>Estimated time: 5 minutes</small></article><article class="kb-procedure-step"><label><input type="checkbox"> Step 2</label><h3>Step title</h3><p>Add screenshots, attachments, or checks as needed.</p><small>Estimated time: 5 minutes</small></article></section>`);
}

function insertKnowledgeLink(articleId) {
  const url = prompt("Enter URL");
  if (!url) return;
  const label = prompt("Link text") || url;
  insertKnowledgeHtml(articleId, `<a href="${escapeHtml(url)}" target="_blank" rel="noopener">${escapeHtml(label)}</a>`);
}

function scheduleKnowledgeAutosave(articleId) {
  state.kbAutosaveTimers = state.kbAutosaveTimers || {};
  const status = $(`[data-kb-save-status="${articleId}"]`);
  if (status) status.textContent = "Unsaved changes";
  clearTimeout(state.kbAutosaveTimers[articleId]);
  state.kbAutosaveTimers[articleId] = setTimeout(() => saveKnowledgeEditor(articleId, true), 1200);
}

async function saveKnowledgeEditor(articleId, autosave = false) {
  const editor = $(`[data-kb-editor="${articleId}"]`);
  const article = rows("knowledge_base").find((item) => item.id === articleId);
  if (!editor || !article) return;
  const status = $(`[data-kb-save-status="${articleId}"]`);
  if (status) status.textContent = autosave ? "Saving..." : "Saving...";
  const bodyHtml = sanitizeArticleHtml(editor.innerHTML);
  const body = editor.innerText || bodyHtml.replace(/<[^>]+>/g, " ");
  const keywords = generateKnowledgeKeywords(article, bodyHtml, body);
  try {
    await api(`/api/knowledge_base/${articleId}`, { method: "PATCH", body: JSON.stringify({ bodyHtml, body, keywords, status: knowledgeStatus(article) === "Published" ? "Published" : "Draft", published: knowledgeStatus(article) === "Published" }) });
    if (status) status.textContent = "Saved";
    if (!autosave) {
      await loadState();
      toast("Article saved", "Knowledge article content was saved.");
      render();
    }
  } catch (err) {
    if (status) status.textContent = "Could not save";
    toast("Could not save", err.message);
  }
}

function generateKnowledgeKeywords(article, bodyHtml, bodyText) {
  const headings = [...String(bodyHtml || "").matchAll(/<h[1-3][^>]*>(.*?)<\/h[1-3]>/gi)].map((match) => match[1].replace(/<[^>]+>/g, " "));
  const words = [article.title, article.category, knowledgeTags(article).join(" "), headings.join(" "), bodyText]
    .join(" ")
    .toLowerCase()
    .replace(/[^\w\s-]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 2);
  return [...new Set(words)].slice(0, 60).join(", ");
}

function handleKnowledgeDrop(event) {
  event.preventDefault();
  const articleId = event.currentTarget.dataset.kbEditor || event.currentTarget.dataset.kbDropzone;
  const files = [...(event.dataTransfer?.files || [])];
  files.forEach((file) => insertKnowledgeFile(articleId, file));
}

function insertKnowledgeFile(articleId, file) {
  const reader = new FileReader();
  reader.onload = () => {
    const src = reader.result;
    const type = file.type || "";
    const name = escapeHtml(file.name);
    let html = `<div class="kb-file-embed"><strong>${name}</strong><small>${escapeHtml(type || "file")}</small></div>`;
    if (type.startsWith("image/")) html = `<figure class="kb-media"><img src="${src}" alt="${name}"><figcaption>${name}</figcaption></figure>`;
    else if (type.startsWith("video/")) html = `<figure class="kb-media"><video controls src="${src}"></video><figcaption>${name}</figcaption></figure>`;
    else if (type === "application/pdf") html = `<div class="kb-pdf-embed"><strong>${name}</strong><embed src="${src}" type="application/pdf"></div>`;
    insertKnowledgeHtml(articleId, html);
  };
  reader.readAsDataURL(file);
}

async function exportKnowledgeArticle(articleId, format) {
  const article = rows("knowledge_base").find((item) => item.id === articleId);
  if (!article) return;
  const html = knowledgeArticleHtml(article);
  await api(`/api/knowledge_base/${articleId}/workflow`, { method: "PATCH", body: JSON.stringify({ workflow: "export", format }) });
  if (format === "pdf") {
    window.print();
    return;
  }
  if (format === "markdown") {
    downloadTextFile(`${article.title || "article"}.md`, articleToMarkdown(article, html), "text/markdown");
    return;
  }
  downloadTextFile(`${article.title || "article"}.html`, `<!doctype html><html><head><meta charset="utf-8"><title>${escapeHtml(article.title)}</title></head><body>${html}</body></html>`, "text/html");
}

function articleToMarkdown(article, html) {
  const markdown = String(html || "")
    .replace(new RegExp("<h1[^>]*>(.*?)</h1>", "gi"), "# $1\n")
    .replace(new RegExp("<h2[^>]*>(.*?)</h2>", "gi"), "## $1\n")
    .replace(new RegExp("<h3[^>]*>(.*?)</h3>", "gi"), "### $1\n")
    .replace(new RegExp("<li[^>]*>(.*?)</li>", "gi"), "- $1\n")
    .replace(new RegExp("<br\\s*/?>", "gi"), "\n")
    .replace(new RegExp("<[^>]+>", "g"), "")
    .trim();
  return `# ${article.title || "Article"}\n\n${markdown}\n`;
}

function downloadTextFile(filename, content, type = "text/plain") {
  const link = document.createElement("a");
  link.href = URL.createObjectURL(new Blob([content], { type }));
  link.download = filename.replace(/[\\/:*?"<>|]/g, "-");
  link.click();
  URL.revokeObjectURL(link.href);
}

function standardWorkspacePage(name) {
  const data = standardWorkspaceCollection(name);
  const selected = data.find((row) => row.id === state.workspaceSelected[name]) || data[0] || null;
  if (selected) state.workspaceSelected[name] = selected.id;
  const action = has(name, "create") && schemas[name] ? `<button class="btn btn-primary" data-add="${name}">${icon("plus")}${escapeHtml(tpl("New {module}", { module: singularDisplayLabel(name) }))}</button>` : "";
  const stripPrimary = name === "documents" && selected ? (selected.title || "Document content") : selected ? primaryTitle(name, selected) : "";
  const stripSecondary = name === "documents" && selected ? `${documentFriendlyType(selected)} / ${selected.signedFileName || "No file attached"}` : selected ? (secondaryTitle(name, selected) || workspaceMeta(name, selected).join(" / ")) : "";
  return `
    ${workspaceIdentityHeader(name, action)}
    ${name === "documents" ? "" : workspaceIdentityStrip(name, stripPrimary, stripSecondary)}
    <section class="ticket-workspace standard-workspace" data-standard-workspace="${name}">
      <aside class="ticket-workspace-list-panel">
        <div class="ticket-workspace-list-tools"><input id="searchBox" placeholder="${escapeHtml(tpl("Search {module}", { module: displayLabel(name) }))}" value="${escapeHtml(state.query)}" /></div>
        ${standardWorkspaceFilters(name)}
        <div class="ticket-workspace-list" aria-label="${escapeHtml(tpl("{module} list", { module: displayLabel(name) }))}">
          ${data.map((row) => standardWorkspaceItem(name, row, selected?.id === row.id)).join("") || emptyState(tpl("No {module} found", { module: displayLabel(name) }), "Try changing search or filters.")}
        </div>
      </aside>
      <section class="ticket-workspace-detail-panel">${selected ? standardWorkspaceDetail(name, selected) : emptyState(tpl("No {module} selected", { module: singularDisplayLabel(name) }), "Choose a record from the workspace list.")}</section>
    </section>
  `;
}

function standardWorkspaceCollection(name) {
  return collection(name).sort((a, b) => String(b.updatedAt || b.createdAt || b.endDate || b.warrantyEndDate || "").localeCompare(String(a.updatedAt || a.createdAt || a.endDate || a.warrantyEndDate || "")));
}

function standardWorkspaceFilters(name) {
  const filterFields = {
    assets: ["status", "type", "departmentId"],
    contracts: ["status", "type", "vendorId"],
    vendors: ["rating"],
    documents: ["type", "linkedType"],
    knowledge_base: ["category", "published"],
    form_templates: ["type"]
  }[name] || [];
  if (!filterFields.length) return "";
  return `<div class="manager-ticket-filters standard-workspace-filters">${filterFields.map((field) => standardWorkspaceFilter(name, field)).join("")}</div>`;
}

function standardWorkspaceFilter(name, field) {
  const values = [...new Set(rows(name).map((row) => cellText(name, row, field) ?? row[field]).filter((value) => value !== undefined && value !== null && value !== ""))].sort();
  const selected = state.filters[name]?.[field] || "";
  return `<label class="manager-ticket-filter"><span>${escapeHtml(labelize(field))}</span><select data-workspace-filter="${name}" data-field="${field}"><option value="">All</option>${values.map((value) => `<option value="${escapeHtml(value)}" ${String(selected) === String(value) ? "selected" : ""}>${escapeHtml(value)}</option>`).join("")}</select></label>`;
}

function standardWorkspaceItem(name, row, active) {
  const status = workspaceStatus(name, row);
  const meta = workspaceMeta(name, row);
  return `
    <button class="ticket-workspace-item standard-workspace-item ${active ? "active" : ""}" data-workspace-select="${name}" data-id="${row.id}">
      <span class="workspace-item-top"><strong>${escapeHtml(primaryTitle(name, row))}</strong>${status ? `<span class="badge ${badgeClass(status)}">${escapeHtml(labelize(status))}</span>` : ""}</span>
      <small>${escapeHtml(secondaryTitle(name, row) || meta[0] || "No summary available")}</small>
      <span class="workspace-item-meta">${meta.slice(0, 3).map((item) => `<span>${escapeHtml(item)}</span>`).join("")}</span>
    </button>
  `;
}

function workspaceStatus(name, row) {
  if (name === "knowledge_base") return row.published === true || row.published === "true" ? "published" : "draft";
  return row.status || row.approvalStatus || row.condition || row.rating || "";
}

function workspaceMeta(name, row) {
  const maps = {
    assets: [row.assetNumber, row.type, look("employees", row.ownerId), row.departmentId],
    contracts: [row.type, look("vendors", row.vendorId), row.endDate ? `Ends ${row.endDate}` : ""],
    vendors: [row.contactPerson, row.email, row.phone],
    documents: [row.type, row.linkedType, displayDate(row.updatedAt || row.createdAt)],
    knowledge_base: [row.category, Array.isArray(row.tags) ? row.tags.join(", ") : row.tags, displayDate(row.updatedAt || row.createdAt)],
    form_templates: [row.type, row.status, displayDate(row.updatedAt || row.createdAt)]
  };
  return (maps[name] || []).filter(Boolean);
}

function standardWorkspaceDetail(name, row) {
  if (name === "documents") return documentWorkspaceDetail(row);
  const tab = state.workspaceTab[name] || "Overview";
  const tabs = standardWorkspaceTabs(name);
  const safeTab = tabs.includes(tab) ? tab : "Overview";
  state.workspaceTab[name] = safeTab;
  const status = workspaceStatus(name, row);
  return `
    <header class="ticket-workspace-detail-head standard-detail-head">
      <div>
        <p class="eyebrow">${escapeHtml(displayLabel(name))}</p>
        <h3>${escapeHtml(primaryTitle(name, row))}</h3>
        <p class="muted">${escapeHtml(secondaryTitle(name, row) || "Operational record")}</p>
      </div>
      <div class="detail-head-actions">${status ? `<span class="badge ${badgeClass(status)}">${escapeHtml(labelize(status))}</span>` : ""}${has(name, "edit") && schemas[name] ? `<button class="btn btn-secondary" data-edit="${name}" data-id="${row.id}">${icon("edit")}Edit</button>` : ""}</div>
    </header>
    ${standardWorkspaceInfoCards(name, row)}
    ${standardWorkspaceActions(name, row)}
    <div class="tabs workspace-tabs">${tabs.map((item) => `<button class="tab ${safeTab === item ? "active" : ""}" data-workspace-tab="${name}" data-tab="${item}">${escapeHtml(item)}</button>`).join("")}</div>
    <div class="ticket-workspace-detail-body">${standardWorkspaceTabContent(name, row, safeTab)}</div>
  `;
}

function standardWorkspaceTabs(name) {
  if (name === "documents") return ["Overview", "Files", "Related Records", "Comments", "Timeline"];
  if (name === "knowledge_base") return ["Overview", "Attachments", "Related Records", "Timeline"];
  return ["Overview", "Comments", "Attachments", "Related Records", "Timeline"];
}

function documentWorkspaceDetail(row) {
  const tabs = standardWorkspaceTabs("documents");
  const currentTab = state.workspaceTab.documents === "Attachments" ? "Files" : state.workspaceTab.documents || "Overview";
  const safeTab = tabs.includes(currentTab) ? currentTab : "Overview";
  state.workspaceTab.documents = safeTab;
  const attachments = documentAttachments(row);
  return `
    <header class="ticket-workspace-detail-head standard-detail-head document-detail-head">
      <div>
        <p class="eyebrow">Document Workspace</p>
        <h3>${escapeHtml(row.title || "Untitled document")}</h3>
        <p class="muted">${escapeHtml(row.description || row.notes || "Document record")}</p>
      </div>
      <div class="detail-head-actions">
        ${documentStatusBadge(row)}
      </div>
    </header>
    ${documentWorkspaceSnapshot(row, attachments)}
    ${documentWorkspaceActions(row, attachments)}
    <div class="tabs workspace-tabs">${tabs.map((item) => `<button class="tab ${safeTab === item ? "active" : ""}" data-workspace-tab="documents" data-tab="${item}">${escapeHtml(item)}</button>`).join("")}</div>
    <div class="ticket-workspace-detail-body document-workspace-body">${documentWorkspaceTabContent(row, safeTab)}</div>
  `;
}

function documentWorkspaceSnapshot(row, attachments = documentAttachments(row)) {
  const linked = documentLinkedLabel(row);
  const snapshot = [
    ["Document Type", documentFriendlyType(row)],
    ["Status", documentStatusLabel(row)],
    ["Linked Record", linked],
    ["Owner", documentOwnerLabel(row)],
    ["Last Updated", row.updatedAt ? relativeTime(row.updatedAt) : row.createdAt ? relativeTime(row.createdAt) : "Not dated"],
    ["Version", documentVersionLabel(row)]
  ];
  return `<section class="surface-card document-snapshot-panel">
    <div class="section-title"><div><p class="eyebrow">Document Snapshot</p><h3>Current file state</h3></div><span class="badge muted">${escapeHtml(tpl("{n} files", { n: attachments.length }))}</span></div>
    <div class="document-snapshot-grid">${snapshot.map(([label, value]) => `<div><small>${escapeHtml(label)}</small><strong>${escapeHtml(value || "Not set")}</strong></div>`).join("")}</div>
  </section>`;
}

function documentWorkspaceActions(row, attachments = documentAttachments(row)) {
  const currentAttachment = attachments[0];
  const downloadAction = currentAttachment
    ? `<button class="btn btn-secondary" data-download-attachment="${currentAttachment.id}">${icon("download")}Download</button>`
    : row.signedFileName || row.fileName
      ? `<button class="btn btn-secondary" data-download-generated="${row.id}">${icon("download")}Download</button>`
      : "";
  const primary = [
    has("documents", "edit") && schemas.documents ? `<button class="btn btn-primary" data-edit="documents" data-id="${row.id}">${icon("edit")}Edit</button>` : "",
    !isEmployeeUser() && has("attachments", "create") ? `<button class="btn btn-secondary" data-document-files="${row.id}">${icon("attachments")}Upload New Version</button>` : "",
    downloadAction
  ].filter(Boolean);
  const more = [
    has("documents", "archive") ? `<button class="btn btn-warning" data-archive="documents" data-id="${row.id}">${icon("archive_center")}Archive</button>` : "",
    has("documents", "archive") ? `<button class="btn btn-danger" data-trash="documents" data-id="${row.id}">${icon("delete")}Delete</button>` : "",
    comingSoonButton("Move"),
    comingSoonButton("Duplicate"),
    comingSoonButton("Export"),
    comingSoonButton("Share")
  ].filter(Boolean);
  return `<div class="record-card-actions standard-workspace-actions document-action-bar">
    ${primary.join("")}
    ${more.length ? `<details class="ticket-v2-more"><summary>${icon("more")}More</summary><div>${more.join("")}</div></details>` : ""}
  </div>`;
}

function documentWorkspaceTabContent(row, tab) {
  if (tab === "Files" || tab === "Attachments") return documentFilesTab(row);
  if (tab === "Related Records") return relatedFor("documents", row);
  if (tab === "Comments") return commentsFor("documents", row);
  if (tab === "Timeline") return timelineFor("documents", row);
  return documentOverviewTab(row);
}

function documentOverviewTab(row) {
  const rows = [
    ["Title", row.title || "Untitled document"],
    ["Description", row.description || row.notes || "No description provided"],
    ["Category", row.category || "Uncategorized"],
    ["Approval State", row.approvalStatus || row.status || "Not set"],
    ["Visibility", row.visibility || row.audience || "Internal"],
    ["Current File", row.signedFileName || row.fileName || documentAttachments(row)[0]?.filename || "No file attached"]
  ];
  return `<section class="surface-card workspace-overview-card document-overview-card">
    <div class="section-title"><div><p class="eyebrow">Overview</p><h3>Document information</h3><p class="muted">Core details without repeating the snapshot metadata.</p></div></div>
    <div class="document-overview-grid">${rows.map(([label, value]) => `<div><small>${escapeHtml(label)}</small><strong>${escapeHtml(value)}</strong></div>`).join("")}</div>
  </section>`;
}

function documentFilesTab(row) {
  const attachments = documentAttachments(row);
  const current = attachments[0];
  const previous = attachments.slice(1);
  const canUpload = !isEmployeeUser() && has("attachments", "create");
  return `<div class="document-files-layout">
    <section class="surface-card document-current-file">
      <div class="section-title"><div><p class="eyebrow">Current File</p><h3>Primary document file</h3></div></div>
      ${current ? attachmentCard(current) : documentGeneratedFileCard(row)}
    </section>
    <section class="surface-card">
      <div class="section-title"><div><p class="eyebrow">Upload Replacement</p><h3>New version</h3><p class="muted">Upload a replacement or supporting file. Existing upload permissions are preserved.</p></div></div>
      ${canUpload ? `<form class="attachment-upload document-upload-form" data-upload-form="documents" data-id="${row.id}">
        <input name="file" type="file" accept=".pdf,image/*,.doc,.docx,.xls,.xlsx" />
        <button class="btn btn-primary" type="submit">${icon("plus")}Upload File</button>
      </form>` : `<p class="muted">You do not have permission to upload files.</p>`}
    </section>
    <section class="surface-card">
      <div class="section-title"><div><p class="eyebrow">Previous Versions</p><h3>File history</h3></div></div>
      <div class="collection-grid">${previous.map(attachmentCard).join("") || emptyState("No previous versions", "Replacement files will appear here after upload.")}</div>
    </section>
    <section class="surface-card">
      <div class="section-title"><div><p class="eyebrow">Download History</p><h3>Access log</h3></div></div>
      <p class="muted">Download history is available in a future version.</p>
    </section>
  </div>`;
}

function documentGeneratedFileCard(row) {
  if (row.signedFileName || row.fileName) {
    return `<article class="record-card document-generated-file"><div class="record-card-head"><div class="record-icon">${icon("documents")}</div><div><strong>${escapeHtml(row.signedFileName || row.fileName)}</strong><span>${escapeHtml(documentFriendlyType(row))}</span></div></div><div class="record-card-actions"><button class="btn btn-secondary" data-download-generated="${row.id}">${icon("download")}Download</button></div></article>`;
  }
  return emptyState("No file attached", "Upload a PDF, Word, Excel, or image file for this document.");
}

function documentStatusLabel(row) {
  return row.status || row.approvalStatus || (row.published ? "Published" : "Draft");
}

function documentStatusBadge(row) {
  const status = documentStatusLabel(row);
  return `<span class="badge ${badgeClass(status)}">${escapeHtml(labelize(status))}</span>`;
}

function documentVersionLabel(row) {
  const value = row.version || row.documentVersion || row.currentVersion || "";
  return value ? `v${String(value).replace(/^v/i, "")}` : "Not versioned";
}

function documentOwnerLabel(row) {
  return look("users", row.ownerId || row.ownerUserId || row.createdBy || row.uploaderId) || look("employees", row.ownerEmployeeId || row.employeeId) || "Unassigned";
}

function documentLinkedRecord(row) {
  const typeMap = {
    employee: "employees", employees: "employees", person: "employees", people: "employees",
    asset: "assets", assets: "assets",
    ticket: "tickets", tickets: "tickets",
    task: "tasks", tasks: "tasks",
    contract: "contracts", contracts: "contracts",
    vendor: "vendors", vendors: "vendors",
    document: "documents", documents: "documents"
  };
  const collectionName = typeMap[String(row.linkedType || row.linkedEntityType || "").toLowerCase()];
  if (!collectionName || !row.linkedId) return null;
  return { type: collectionName, row: rows(collectionName).find((item) => item.id === row.linkedId) };
}

function documentLinkedLabel(row) {
  const linked = documentLinkedRecord(row);
  if (linked?.row) return `${singularDisplayLabel(linked.type)}: ${primaryTitle(linked.type, linked.row)}`;
  if (row.linkedType || row.linkedEntityType) return `${labelize(row.linkedType || row.linkedEntityType)} record`;
  return "Not linked";
}

function standardWorkspaceInfoCards(name, row) {
  const picked = {
    assets: ["assetNumber", "type", "status", "owner", "department", "warrantyEndDate"],
    contracts: ["type", "vendor", "status", "startDate", "endDate", "cost"],
    vendors: ["contactPerson", "phone", "email", "rating"],
    documents: ["templateType", "status", "approvalStatus", "signedFileName", "updatedAt"],
    knowledge_base: ["category", "tags", "published", "updatedAt"],
    form_templates: ["type", "status", "updatedAt"]
  }[name] || (columns[name] || []).slice(0, 6);
  const cards = picked.map((field) => [labelize(field), workspaceFieldText(name, row, field)]);
  return `<section class="ticket-workspace-info standard-info-grid">${cards.map(([label, value]) => `<div class="ticket-info-card"><small>${escapeHtml(label)}</small><strong>${escapeHtml(String(value || "Not set"))}</strong></div>`).join("")}</section>`;
}

function workspaceFieldText(name, row, field) {
  if (field === "tags") return Array.isArray(row.tags) ? row.tags.join(", ") : row.tags || "Not set";
  if (field === "owner") return look("employees", row.currentOwnerId || row.ownerId) || "Unassigned";
  if (field === "department") return look("departments", row.departmentId) || row.departmentId || "Not set";
  if (field === "vendor") return look("vendors", row.vendorId) || "Not set";
  if (name === "documents" && field === "templateType") return row.templateType || row.type || "Document";
  if (name === "documents" && field === "signedFileName") return row.signedFileName || "No file attached";
  if (field === "published") return row.published === true || row.published === "true" ? "Published" : "Draft";
  return cellText(name, row, field) ?? row[field] ?? "Not set";
}

function standardWorkspaceActions(name, row) {
  const actions = [
    has(name, "edit") && schemas[name] ? `<button class="btn btn-secondary" data-edit="${name}" data-id="${row.id}">${icon("edit")}Edit</button>` : "",
    has(name, "archive") && schemas[name] ? `<button class="btn btn-warning" data-archive="${name}" data-id="${row.id}">${icon("archive_center")}Archive</button>` : "",
    has(name, "archive") && schemas[name] ? `<button class="btn btn-danger" data-trash="${name}" data-id="${row.id}">${icon("delete")}Move to Trash</button>` : ""
  ].filter(Boolean);
  return actions.length ? `<div class="record-card-actions standard-workspace-actions">${actions.join("")}</div>` : "";
}

function standardWorkspaceTabContent(name, row, tab) {
  if (tab === "Comments") return commentsFor(name, row);
  if (tab === "Attachments") return attachmentsFor(name, row);
  if (tab === "Related Records") return relatedFor(name, row);
  if (tab === "Timeline") return timelineFor(name, row);
  return standardWorkspaceOverview(name, row);
}

function standardWorkspaceOverview(name, row) {
  const attachmentCount = name === "documents" ? documentAttachments(row).length : (state.db.attachments || []).filter((item) => item.entityType === singular(name) && item.entityId === row.id).length;
  return `
    <section class="surface-card workspace-overview-card">
      <div class="section-title"><div><p class="eyebrow">Overview</p><h3>${escapeHtml(primaryTitle(name, row))}</h3></div></div>
      ${overviewFor(name, row)}
      ${attachmentCount ? `<div class="inline-attachments"><p class="eyebrow">Attachments</p>${attachmentsFor(name, row)}</div>` : ""}
    </section>
  `;
}

function collectionSubtitle(name) {
  return {
    employees: "Master records for every real person and their optional system access.",
    assets: "Inventory cards focused on owner, condition, warranty, and lifecycle.",
    contracts: "Renewals, subscriptions, cost, and vendor obligations.",
    vendors: "Supplier relationships and service quality at a glance.",
    documents: "Forms and signed records connected to operational entities.",
    knowledge_base: "Published help content, attachments, and operational knowledge.",
    form_templates: "Reusable operational forms prepared for V1 workflows."
  }[name] || "";
}

function userPreferenceKey() {
  return `itcc.preferences.${state.user?.id || "anonymous"}`;
}

function userPreferences() {
  const stored = JSON.parse(localStorage.getItem(userPreferenceKey()) || "{}");
  return {
    language: stored.language || state.lang || "en",
    theme: stored.theme || state.theme || "system",
    landing: stored.landing || "employee_portal",
    dashboard: dashboardPreferences(stored.dashboard),
    ticketNotifications: stored.ticketNotifications !== false,
    taskNotifications: stored.taskNotifications !== false,
    browserNotifications: stored.browserNotifications === true
  };
}

function saveUserPreferences(next) {
  localStorage.setItem(userPreferenceKey(), JSON.stringify({ ...userPreferences(), ...next }));
}

function defaultDashboardPreferences() {
  return {
    widgets: Object.fromEntries(dashboardWidgetCatalog.map(([id]) => [id, true])),
    order: [...dashboardDefaultOrder],
    density: "comfortable",
    activityCount: 5,
    landing: "dashboard"
  };
}

function dashboardPreferences(stored = {}) {
  const defaults = defaultDashboardPreferences();
  const order = [...new Set([...(Array.isArray(stored.order) ? stored.order : []), ...defaults.order])].filter((id) => dashboardDefaultOrder.includes(id));
  return {
    widgets: { ...defaults.widgets, ...(stored.widgets || {}) },
    order,
    density: ["comfortable", "compact"].includes(stored.density) ? stored.density : defaults.density,
    activityCount: [5, 10, 20].includes(Number(stored.activityCount)) ? Number(stored.activityCount) : defaults.activityCount,
    landing: ["dashboard", "tickets", "tasks", "assets"].includes(stored.landing) ? stored.landing : defaults.landing
  };
}

function currentDashboardPreferences() {
  return dashboardPreferences(userPreferences().dashboard);
}

function saveDashboardPreferences(next) {
  const prefs = userPreferences();
  const dashboard = dashboardPreferences({ ...prefs.dashboard, ...next });
  saveUserPreferences({ dashboard, landing: dashboard.landing });
}

function openDashboardCustomizeDialog(seed = currentDashboardPreferences()) {
  const prefs = dashboardPreferences(seed);
  const widgetRows = prefs.order.map((id) => {
    const label = dashboardWidgetCatalog.find(([widgetId]) => widgetId === id)?.[1] || labelize(id);
    return `<div class="dashboard-customize-row" data-dashboard-widget-row="${escapeHtml(id)}">
      <label class="checkbox-field"><input type="checkbox" data-dashboard-widget="${escapeHtml(id)}" ${prefs.widgets[id] !== false ? "checked" : ""}><span>${escapeHtml(label)}</span></label>
      <div class="dashboard-customize-order"><button type="button" class="icon-btn" data-dashboard-order="up" title="Move up">${icon("chevron-up")}</button><button type="button" class="icon-btn" data-dashboard-order="down" title="Move down">${icon("chevron-down")}</button></div>
    </div>`;
  }).join("");
  const landingOptions = [["dashboard", "Dashboard"], ["tickets", "Tickets"], ["tasks", "Tasks"], ["assets", "Assets"]];
  $("#dialogHost").innerHTML = `<div class="modal-backdrop"><form class="modal surface-card dashboard-customize-modal" data-dashboard-customize-form>
    <div class="modal-head"><div><p class="eyebrow">Personalization</p><h3>Customize Dashboard</h3><p class="muted">Choose the widgets, order, density, and default landing page for your account only.</p></div><button type="button" class="icon-btn close" aria-label="Close">${icon("close")}</button></div>
    <div class="modal-fields dashboard-customize-fields">
      <section class="dashboard-customize-section"><div><h4>Widgets</h4><p class="muted">Show, hide, and reorder dashboard sections.</p></div><div class="dashboard-customize-list">${widgetRows}</div></section>
      <section class="dashboard-customize-section dashboard-customize-options">
        <label><span>Default landing page</span><select name="landing">${landingOptions.map(([value, label]) => `<option value="${value}" ${prefs.landing === value ? "selected" : ""}>${label}</option>`).join("")}</select></label>
        <label><span>Default dashboard density</span><select name="density"><option value="comfortable" ${prefs.density === "comfortable" ? "selected" : ""}>Comfortable</option><option value="compact" ${prefs.density === "compact" ? "selected" : ""}>Compact</option></select></label>
        <label><span>Default recent activity count</span><select name="activityCount">${[5, 10, 20].map((count) => `<option value="${count}" ${prefs.activityCount === count ? "selected" : ""}>${count}</option>`).join("")}</select></label>
      </section>
    </div>
    <div class="modal-actions"><button type="button" class="btn btn-secondary" data-dashboard-restore-default>Restore Default Layout</button><span class="modal-action-spacer"></span><button type="button" class="btn btn-secondary close">Cancel</button><button type="submit" class="btn btn-primary">Save</button></div>
  </form></div>`;
  bindDashboardCustomizeDialog();
}

function bindDashboardCustomizeDialog() {
  const host = $("#dialogHost");
  host.querySelectorAll(".close").forEach((button) => button.addEventListener("click", () => host.innerHTML = ""));
  host.querySelectorAll("[data-dashboard-order]").forEach((button) => button.addEventListener("click", () => {
    const row = button.closest("[data-dashboard-widget-row]");
    if (!row) return;
    if (button.dataset.dashboardOrder === "up" && row.previousElementSibling) row.parentElement.insertBefore(row, row.previousElementSibling);
    if (button.dataset.dashboardOrder === "down" && row.nextElementSibling) row.parentElement.insertBefore(row.nextElementSibling, row);
  }));
  host.querySelector("[data-dashboard-restore-default]")?.addEventListener("click", () => openDashboardCustomizeDialog(defaultDashboardPreferences()));
  host.querySelector("[data-dashboard-customize-form]")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const order = [...form.querySelectorAll("[data-dashboard-widget-row]")].map((row) => row.dataset.dashboardWidgetRow);
    const widgets = Object.fromEntries(dashboardWidgetCatalog.map(([id]) => [id, Boolean(form.querySelector(`[data-dashboard-widget="${CSS.escape(id)}"]`)?.checked)]));
    const values = Object.fromEntries(new FormData(form).entries());
    saveDashboardPreferences({ widgets, order, density: values.density, activityCount: Number(values.activityCount), landing: values.landing });
    host.innerHTML = "";
    toast("Dashboard saved", "Your dashboard preferences were updated.");
    render();
  });
}

function profilePage() {
  const employee = employeeForUser();
  const department = employee ? look("departments", employee.departmentId) : "";
  return `
    <section class="surface-card employee-settings-page">
      <div class="settings-page-head"><div class="profile-avatar large">${escapeHtml(initials(state.user?.name))}</div><div><p class="eyebrow">Account</p><h3>My Profile</h3><p class="muted">Your V1 profile details are managed by IT.</p></div></div>
      <div class="detail-grid profile-fields">
        <div class="detail-field"><small>Full Name</small><strong>${escapeHtml(state.user?.name || "")}</strong></div>
        <div class="detail-field"><small>Email</small><strong>${escapeHtml(state.user?.email || "")}</strong></div>
        <div class="detail-field"><small>Department</small><strong>${escapeHtml(department || "Not assigned")}</strong></div>
        <div class="detail-field"><small>Job Title</small><strong>${escapeHtml(employee?.jobTitle || "Not assigned")}</strong></div>
      </div>
    </section>
  `;
}

function preferencesPage() {
  const prefs = userPreferences();
  return `
    <section class="surface-card employee-settings-page">
      <div class="settings-page-head"><div><p class="eyebrow">Workspace</p><h3>Preferences</h3><p class="muted">Choose how your employee workspace opens and appears.</p></div></div>
      <form class="settings-form" data-preferences-form>
        <label><span>Language</span><select name="language"><option value="en" ${prefs.language === "en" ? "selected" : ""}>English</option><option value="ar" ${prefs.language === "ar" ? "selected" : ""}>Arabic</option></select></label>
        <label><span>Appearance</span><select name="theme"><option value="system" ${prefs.theme === "system" ? "selected" : ""}>System</option><option value="light" ${prefs.theme === "light" ? "selected" : ""}>Light</option><option value="dark" ${prefs.theme === "dark" ? "selected" : ""}>Dark</option></select></label>
        <label><span>Default landing page</span><select name="landing"><option value="employee_portal" ${prefs.landing === "employee_portal" ? "selected" : ""}>Dashboard</option><option value="tickets" ${prefs.landing === "tickets" ? "selected" : ""}>Tickets</option><option value="tasks" ${prefs.landing === "tasks" ? "selected" : ""}>My Tasks</option><option value="documents" ${prefs.landing === "documents" ? "selected" : ""}>Company Documents</option><option value="knowledge_base" ${prefs.landing === "knowledge_base" ? "selected" : ""}>Knowledge Base</option></select></label>
        <div class="settings-actions">${formSaveStateHtml()}<button class="btn btn-primary" type="submit">Save Preferences</button></div>
      </form>
    </section>
    ${twoFactorPanel()}
  `;
}

// Self-service second factor. It keeps working when email delivery does not, which
// is why IT accounts in particular should turn it on.
function twoFactorPanel() {
  const enabled = Boolean(state.user?.mfaEnabled);
  return `
    <section class="surface-card employee-settings-page two-factor-panel">
      <div class="settings-page-head">
        <div>
          <p class="eyebrow">Security</p>
          <h3>Two-step sign-in</h3>
          <p class="muted">Use an authenticator app as a second step. It works even when email is unavailable, so IT accounts should always have it on.</p>
        </div>
        <span class="badge ${enabled ? "success" : "neutral"}">${enabled ? "On" : "Off"}</span>
      </div>
      ${enabled ? `
        <div class="two-factor-actions">
          <p class="muted">Two-step sign-in is on for this account.</p>
          <label class="two-factor-code"><span>Enter a current code to turn it off</span><input data-totp-disable-token inputmode="numeric" maxlength="6" placeholder="123456"></label>
          <button class="btn btn-secondary" type="button" data-totp-disable>Turn off</button>
        </div>
      ` : `
        <div class="two-factor-actions" data-totp-setup-area>
          <button class="btn btn-primary" type="button" data-totp-start>Set up two-step sign-in</button>
        </div>
      `}
    </section>
  `;
}

function wireTwoFactorPanel() {
  $("[data-totp-start]")?.addEventListener("click", async () => {
    try {
      const result = await api("/api/auth/totp-setup", { method: "POST", body: "{}" });
      const area = $("[data-totp-setup-area]");
      if (!area) return;
      area.innerHTML = `
        <ol class="two-factor-steps">
          <li>Open your authenticator app and add an account.</li>
          <li>Enter this setup key: <code class="two-factor-secret">${escapeHtml(result.secret)}</code></li>
          <li>Type the 6-digit code it shows to confirm.</li>
        </ol>
        <label class="two-factor-code"><span>Code from your app</span><input data-totp-token inputmode="numeric" maxlength="6" placeholder="123456"></label>
        <button class="btn btn-primary" type="button" data-totp-confirm>Confirm and turn on</button>
      `;
      localizeRenderedUi(area);
      $("[data-totp-confirm]")?.addEventListener("click", async () => {
        try {
          await api("/api/auth/totp-confirm", { method: "POST", body: JSON.stringify({ token: $("[data-totp-token]")?.value || "" }) });
          await loadSession();
          render();
          toast("Two-step sign-in is on", "You will be asked for a code from your app at each sign-in.");
        } catch (error) {
          toast("Could not turn it on", error.message);
        }
      });
    } catch (error) {
      toast("Could not start setup", error.message);
    }
  });
  $("[data-totp-disable]")?.addEventListener("click", async () => {
    try {
      await api("/api/auth/totp-disable", { method: "POST", body: JSON.stringify({ token: $("[data-totp-disable-token]")?.value || "" }) });
      await loadSession();
      render();
      toast("Two-step sign-in is off", "Your account now signs in with a single step.");
    } catch (error) {
      toast("Could not turn it off", error.message);
    }
  });
}

function notificationPreferencesPage() {
  const employeeDefaults = state.user?.roleId === "role_employee";
  const prefs = { tickets: true, tasks: true, assets: !employeeDefaults, contracts: !employeeDefaults, vendors: !employeeDefaults, ...(state.user?.notificationPreferences || {}) };
  return `
    <section class="surface-card employee-settings-page">
      <div class="settings-page-head"><div><p class="eyebrow">Alerts</p><h3>My Preferences</h3><p class="muted">Choose the notification categories you want to receive.</p></div></div>
      <form class="settings-form notification-settings" data-notification-preferences-form>
        <label class="preference-toggle"><span><strong>Ticket notifications</strong><small>Created, assigned, updated, and conversation events.</small></span><input name="tickets" type="checkbox" ${prefs.tickets ? "checked" : ""}></label>
        <label class="preference-toggle"><span><strong>Task notifications</strong><small>Assignments, completion, overdue, and due-today alerts.</small></span><input name="tasks" type="checkbox" ${prefs.tasks ? "checked" : ""}></label>
        <label class="preference-toggle"><span><strong>Asset notifications</strong><small>Assignment, return, and maintenance alerts.</small></span><input name="assets" type="checkbox" ${prefs.assets ? "checked" : ""}></label>
        <label class="preference-toggle"><span><strong>Contract notifications</strong><small>Upcoming contract expiration alerts.</small></span><input name="contracts" type="checkbox" ${prefs.contracts ? "checked" : ""}></label>
        <label class="preference-toggle"><span><strong>Vendor notifications</strong><small>Tickets waiting for vendor response.</small></span><input name="vendors" type="checkbox" ${prefs.vendors ? "checked" : ""}></label>
        <div class="settings-actions">${formSaveStateHtml()}<button class="btn btn-primary" type="submit">Save Notification Settings</button></div>
      </form>
    </section>
  `;
}

function peopleWorkspacePage() {
  const data = peopleWorkspaceCollection();
  const selected = data.find((person) => person.id === state.peopleWorkspaceSelectedId) || data[0] || null;
  if (selected) state.peopleWorkspaceSelectedId = selected.id;
  return `
    ${workspaceIdentityHeader("employees", has("users", "create") ? `<button class="btn btn-primary" data-add="users">${icon("plus")}${escapeHtml(trText("New Account"))}</button>` : "")}
    <section class="ticket-workspace people-workspace">
      <aside class="ticket-workspace-list-panel">
        <div class="ticket-workspace-list-tools people-list-tools">
          <input id="searchBox" placeholder="Search people" value="${escapeHtml(state.query)}" />
          ${peopleActionsButton()}
        </div>
        ${peopleWorkspaceFilters()}
        <div class="ticket-workspace-list" aria-label="People list">
          ${data.map((person) => peopleWorkspaceItem(person, selected?.id === person.id)).join("") || emptyState("No people found", "Try changing search or filters.")}
        </div>
      </aside>
      <section class="ticket-workspace-detail-panel">${selected ? peopleWorkspaceDetail(selected) : emptyState("No person selected", "Choose a person from the workspace list.")}</section>
    </section>
  `;
}

function userAccountsWorkspacePage() {
  const data = accountWorkspaceCollection();
  const selected = data.find((account) => account.id === state.accountWorkspaceSelectedId) || data[0] || null;
  if (selected) state.accountWorkspaceSelectedId = selected.id;
  return `
    <div class="toolbar manager-ticket-toolbar">
      <div><p class="eyebrow">Login accounts</p><h3>User Accounts</h3><p class="muted">Review and manage existing logins. New accounts are registered from People.</p></div>
    </div>
    <section class="ticket-workspace account-workspace">
      <aside class="ticket-workspace-list-panel">
        <div class="ticket-workspace-list-tools"><input id="searchBox" placeholder="Search user accounts" value="${escapeHtml(state.query)}" /></div>
        ${accountWorkspaceFilters()}
        <div class="ticket-workspace-list" aria-label="User account list">
          ${data.map((account) => accountWorkspaceItem(account, selected?.id === account.id)).join("") || emptyState("No accounts found", "Try changing search or filters.")}
        </div>
      </aside>
      <section class="ticket-workspace-detail-panel">${selected ? accountWorkspaceDetail(selected) : emptyState("No account selected", "Choose an account from the workspace list.")}</section>
    </section>
  `;
}

function peopleWorkspaceFilters() {
  const filters = state.peopleWorkspaceFilters;
  const optionSelect = (field, label, values, labeler = (value) => value) => `<label class="manager-ticket-filter"><span>${label}</span><select data-people-filter="${field}"><option value="">All ${label}</option>${values.map((value) => `<option value="${escapeHtml(value)}" ${String(filters[field] || "") === String(value) ? "selected" : ""}>${escapeHtml(labeler(value))}</option>`).join("")}</select></label>`;
  const allPeople = state.db.employees || [];
  const departments = [...new Set(allPeople.map((person) => person.departmentId).filter(Boolean))];
  const types = [...new Set([...personTypes, ...allPeople.map((person) => person.personType).filter(Boolean)])];
  const statuses = [...new Set(allPeople.map((person) => person.status).filter(Boolean))];
  const locations = [...new Set(allPeople.map((person) => person.location).filter(Boolean))];
  return `<div class="manager-ticket-filters">${optionSelect("department", "Department", departments, (value) => look("departments", value))}${optionSelect("personType", "Person Type", types)}${optionSelect("status", "Status", statuses, labelize)}${optionSelect("location", "Location", locations)}</div>`;
}

function accountWorkspaceFilters() {
  const filters = state.accountWorkspaceFilters;
  const optionSelect = (field, label, values, labeler = (value) => value) => `<label class="manager-ticket-filter"><span>${label}</span><select data-account-filter="${field}"><option value="">All ${label}</option>${values.map((value) => `<option value="${escapeHtml(value)}" ${String(filters[field] || "") === String(value) ? "selected" : ""}>${escapeHtml(labeler(value))}</option>`).join("")}</select></label>`;
  const accounts = state.db.users || [];
  const roles = rows("roles");
  const statuses = [...new Set(accounts.map((account) => account.status).filter(Boolean))];
  const types = [...new Set([...accountTypes, ...accounts.map((account) => account.accountType).filter(Boolean)])];
  return `<div class="manager-ticket-filters">${optionSelect("role", "Role", roles.map((role) => role.id), (value) => look("roles", value))}${optionSelect("status", "Status", statuses, labelize)}${optionSelect("accountType", "Account Type", types)}</div>`;
}

function allPeopleRows() {
  return (state.db.employees || []).filter((person) => !person.deletedAt);
}

function allAccountRows() {
  return (state.db.users || []).filter((account) => !account.deletedAt);
}

function peopleWorkspaceCollection() {
  const q = [state.globalQuery, state.query].filter(Boolean).join(" ").toLowerCase();
  const filters = state.peopleWorkspaceFilters;
  return allPeopleRows().filter((person) => {
    if (q && !JSON.stringify(person).toLowerCase().includes(q)) return false;
    if (filters.department && person.departmentId !== filters.department) return false;
    if (filters.personType && person.personType !== filters.personType) return false;
    if (filters.status && person.status !== filters.status) return false;
    if (filters.location && person.location !== filters.location) return false;
    return true;
  }).sort((a, b) => String(a.name || "").localeCompare(String(b.name || "")));
}

function accountWorkspaceCollection() {
  const q = [state.globalQuery, state.query].filter(Boolean).join(" ").toLowerCase();
  const filters = state.accountWorkspaceFilters;
  return allAccountRows().filter((account) => {
    if (q && !JSON.stringify(account).toLowerCase().includes(q)) return false;
    if (filters.role && account.roleId !== filters.role) return false;
    if (filters.status && account.status !== filters.status) return false;
    if (filters.accountType && account.accountType !== filters.accountType) return false;
    return true;
  }).sort((a, b) => String(a.username || a.name || "").localeCompare(String(b.username || b.name || "")));
}

function peopleWorkspaceItem(person, active) {
  const account = linkedUserForPerson(person);
  return `<button class="ticket-workspace-item person-workspace-item ${active ? "active" : ""}" data-people-workspace-select="${person.id}">
    <span class="person-list-row"><span class="avatar mini">${escapeHtml(initials(person.name))}</span><span><strong>${escapeHtml(person.name || "Unnamed person")}</strong><small>${escapeHtml(person.jobTitle || "No job title")}</small></span></span>
    <span class="workspace-ticket-meta"><span>${escapeHtml(look("departments", person.departmentId) || "No department")}</span><span>${escapeHtml(person.personType || "Employee")}</span></span>
    <span class="workspace-ticket-indicators"><span class="badge ${badgeClass(person.status || "active")}">${escapeHtml(personStatusLabel(person))}</span>${account ? '<span class="workspace-indicator success">Login Account</span>' : '<span class="workspace-indicator neutral">No Login</span>'}</span>
  </button>`;
}

function accountWorkspaceItem(account, active) {
  const person = personForAccount(account);
  const service = ["service", "api"].includes(String(account.accountType || "").toLowerCase());
  return `<button class="ticket-workspace-item account-workspace-item ${active ? "active" : ""}" data-account-workspace-select="${account.id}">
    <span class="workspace-ticket-top"><strong>${escapeHtml(account.username || account.email || account.id)}</strong><span class="badge ${badgeClass(accountStatusValue(account))}">${escapeHtml(accountStatusLabel(account))}</span></span>
    <span class="workspace-ticket-subject">${escapeHtml(account.name || person?.name || "Account without linked person")}</span>
    <span class="workspace-ticket-meta"><span>${escapeHtml(look("roles", account.roleId) || "No role")}</span><span>${escapeHtml(person?.name || "No linked person")}</span></span>
    <span class="workspace-ticket-indicators"><span class="badge neutral">${escapeHtml(account.accountType || "Employee")}</span>${service ? '<span class="workspace-indicator info">Service</span>' : ""}</span>
  </button>`;
}

function peopleWorkspaceDetail(person) {
  const tab = state.peopleWorkspaceTab || "Overview";
  const tabs = ["Overview", "Assets", "Tickets", "Tasks", "Documents", "Account", "Timeline"];
  const safeTab = tabs.includes(tab) ? tab : tab === "User Account" ? "Account" : "Overview";
  state.peopleWorkspaceTab = safeTab;
  return `
    <header class="ticket-workspace-detail-head people-detail-head">
      <div class="identity-head">
        <span class="avatar large">${escapeHtml(initials(person.name))}</span>
        <div><p class="eyebrow">${escapeHtml(person.employeeNo || person.personType || "Person")}</p><h3>${escapeHtml(person.name || "Person")}</h3><p class="muted">${escapeHtml(person.personType || "Employee")} profile and operational relationships</p></div>
      </div>
      <div class="detail-head-actions">${peopleMoreMenu(person)}</div>
    </header>
    ${peopleProfilePanel(person)}
    ${personAccountActions(person)}
    <div class="tabs workspace-tabs">${tabs.map((item) => `<button class="tab ${safeTab === item ? "active" : ""}" data-people-workspace-tab="${item}">${item}</button>`).join("")}</div>
    <div class="ticket-workspace-detail-body">${peopleWorkspaceTabContent(person, safeTab)}</div>
  `;
}

function peopleMoreMenu(person) {
  const actions = [];
  if (has("employees", "edit")) actions.push(`<button type="button" class="btn btn-secondary" data-edit="employees" data-id="${person.id}">${icon("edit")}Edit Person</button>`);
  if (has("employees", "archive")) actions.push(`<button type="button" class="btn btn-warning" data-archive="employees" data-id="${person.id}">${icon("archive_center")}Archive</button>`);
  actions.push(comingSoonButton("Org chart"), comingSoonButton("Export profile"), comingSoonButton("Send onboarding"));
  return `<details class="ticket-v2-more people-more-menu"><summary>${icon("more")}More</summary><div>${actions.join("")}</div></details>`;
}

function peopleProfilePanel(person) {
  const user = linkedUserForPerson(person);
  const counts = peopleRelationshipCounts(person);
  const profile = [
    ["Department", look("departments", person.departmentId) || "No department"],
    ["Job Title", person.jobTitle || "No job title"],
    ["Status", `<span class="badge ${badgeClass(person.status || "active")}">${escapeHtml(personStatusLabel(person))}</span>`],
    ["Location", person.location || "No location"],
    ["Email", person.email || "No email"],
    ["Phone", person.phone || "No phone"],
    ["Login Account", user ? `<span class="badge ${badgeClass(accountStatusValue(user))}">${escapeHtml(accountStatusLabel(user))}</span>` : '<span class="badge neutral">No Login</span>']
  ];
  return `
    <section class="people-profile-panel">
      <div class="people-profile-main">
        <span class="avatar profile">${escapeHtml(initials(person.name))}</span>
        <div>
          <p class="eyebrow">Profile First</p>
          <h4>${escapeHtml(person.name || "Person")}</h4>
          <p class="muted">${escapeHtml(person.email || "No email")} | ${escapeHtml(person.phone || "No phone")} | ${escapeHtml(person.location || "No location")}</p>
        </div>
      </div>
      <div class="people-profile-grid">${profile.map(([label, value]) => `<div><small>${escapeHtml(label)}</small><strong>${String(value).includes("<") ? value : escapeHtml(value)}</strong></div>`).join("")}</div>
      <div class="people-relationship-strip">
        <span><small>Assets</small><strong>${counts.assets}</strong></span>
        <span><small>Open Tickets</small><strong>${counts.tickets}</strong></span>
        <span><small>Tasks</small><strong>${counts.tasks}</strong></span>
        <span><small>Documents</small><strong>${counts.documents}</strong></span>
      </div>
    </section>
  `;
}

function peopleRelationshipCounts(person) {
  const account = linkedUserForPerson(person);
  return {
    assets: rows("assets").filter((asset) => asset.currentOwnerId === person.id || asset.assignedTo === person.id || asset.permanentCustodianId === person.id).length,
    tickets: rows("tickets").filter((ticket) => ticket.requesterId === person.id && !["closed", "resolved", "cancelled"].includes(ticket.status)).length,
    tasks: rows("tasks").filter((task) => task.ownerId === account?.id || task.relatedId === person.id).length,
    documents: rows("documents").filter((doc) => doc.linkedType === "employee" && doc.linkedId === person.id).length
  };
}

/* Every "create a login for this person" entry point opens the same account
   form as User Accounts, pre-linked to that person, rather than a bespoke
   dialog with its own field set. */
function openAccountForPerson(personId) {
  const person = rows("employees").find((row) => row.id === personId);
  if (!person) return;
  openModal("users", null, {
    employeeId: person.id,
    name: person.name || "",
    email: person.email || "",
    accountType: "Employee"
  });
}

/* Sits where the old quick-action bar was, between the profile panel and the
   tabs. What it offers depends on whether the person already has a login:
   people without one get New Account, people with one get the account actions
   that used to be buried in the Account tab. */
function personAccountActions(person) {
  if (!has("users", "edit") && !has("users", "create")) return "";
  const user = linkedUserForPerson(person);
  if (!user) {
    if (!has("users", "create")) return "";
    return `<section class="record-card-actions person-account-actions" aria-label="${escapeHtml(trText("Account actions"))}">
      <button class="btn btn-primary" data-create-person-account="${person.id}">${icon("plus")}${escapeHtml(trText("New Account"))}</button>
    </section>`;
  }
  if (!has("users", "edit")) return "";
  const enabled = accountStatusLabel(user) === "Enabled";
  return `<section class="record-card-actions person-account-actions" aria-label="${escapeHtml(trText("Account actions"))}">
    <button class="btn btn-secondary" data-edit="users" data-id="${user.id}">${icon("edit")}${escapeHtml(trText("Edit"))}</button>
    <button class="btn btn-secondary" data-reset-user-password="${user.id}">${escapeHtml(trText("Reset Password"))}</button>
    ${enabled
      ? `<button class="btn btn-secondary" data-disable-user-account="${user.id}">${escapeHtml(trText("Disable Account"))}</button>`
      : `<button class="btn btn-secondary" data-unlock-user-account="${user.id}">${escapeHtml(trText("Enable Account"))}</button>`}
  </section>`;
}

/* Registration moved off the page header into this menu, so the People
   workspace keeps one place for list-level actions. Both entries are gated on
   the permission that actually drives them, which keeps IT Staff — who can
   create people but cannot open Settings — able to register. */
function peopleActionsButton() {
  if (!peopleListActions().length) return "";
  return `<button type="button" class="icon-btn people-actions-toggle" data-people-actions aria-label="${escapeHtml(trText("People actions"))}" title="${escapeHtml(trText("People actions"))}">${icon("settings")}</button>`;
}

function peopleListActions() {
  const actions = [];
  if (has("employees", "create")) actions.push({ attr: 'data-add="employees"', icon: "plus", label: "Register Person" });
  if (has("employees", "create")) actions.push({ attr: "data-import-people", icon: "attachments", label: "Import Excel" });
  if (has("employees", "export")) actions.push({ attr: "data-export-people", icon: "download", label: "Export Excel" });
  if (has("employees", "export")) actions.push({ attr: 'data-export="employees"', icon: "download", label: "Export list (CSV)" });
  return actions;
}

/* Excel import/export use the same workbook layout as the customer template:
   Sheet1 carries the records, dropdown_list_items the allowed values. */
function exportPeopleWorkbook() {
  const headers = {};
  fetch("/api/employees/export", { headers })
    .then((response) => {
      if (!response.ok) throw new Error("Export failed");
      return response.blob();
    })
    .then((blob) => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `people-${new Date().toISOString().slice(0, 10)}.xlsx`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      toast(trText("Export Excel"), trText("The workbook has been downloaded."));
    })
    .catch((error) => toast(trText("Could not export"), error.message));
}

function openPeopleImportDialog() {
  const picker = document.createElement("input");
  picker.type = "file";
  picker.accept = ".xlsx";
  picker.addEventListener("change", async () => {
    const file = picker.files?.[0];
    if (!file) return;
    try {
      const fileBase64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result).split(",")[1] || "");
        reader.onerror = () => reject(new Error("Could not read the file"));
        reader.readAsDataURL(file);
      });
      const preview = await api("/api/employees/import", { method: "POST", body: JSON.stringify({ fileBase64, preview: true }) });
      showPeopleImportPreview(file.name, fileBase64, preview);
    } catch (error) {
      toast(trText("Could not import"), error.message);
    }
  });
  picker.click();
}

function showPeopleImportPreview(fileName, fileBase64, preview) {
  const summary = preview.summary || {};
  const rows = [
    ["Rows read", summary.rowsRead || 0],
    ["To create", summary.toCreate || 0],
    ["To update", summary.toUpdate || 0],
    ["Skipped", summary.skipped || 0]
  ];
  const problems = (preview.problems || []).map((problem) => `<li>${escapeHtml(`Row ${problem.row}: ${problem.reason}`)}</li>`).join("");
  $("#dialogHost").innerHTML = `
    <div class="modal-backdrop">
      <form class="modal surface-card people-import-modal" data-people-import-form>
        <div class="modal-head">
          <div>
            <p class="eyebrow">${escapeHtml(trText("Import Excel"))}</p>
            <h3>${escapeHtml(trText("Import people from Excel"))}</h3>
            <p class="muted">${escapeHtml(fileName)}</p>
          </div>
          <button type="button" class="icon-btn close" data-import-cancel aria-label="${escapeHtml(trText("Cancel"))}">${icon("close")}</button>
        </div>
        <div class="modal-fields">
          <div class="detail-grid">
            ${rows.map(([label, value]) => `<div class="detail-field"><small>${escapeHtml(trText(label))}</small><strong>${value}</strong></div>`).join("")}
          </div>
          ${problems ? `<section class="surface-card"><p class="eyebrow">${escapeHtml(trText("Skipped"))}</p><ul class="import-problem-list">${problems}</ul></section>` : ""}
        </div>
        <div class="modal-actions">
          <button type="button" class="btn btn-secondary" data-import-cancel>${escapeHtml(trText("Cancel"))}</button>
          <button type="submit" class="btn btn-primary" ${summary.rowsRead ? "" : "disabled"}>${escapeHtml(trText("Apply import"))}</button>
        </div>
      </form>
    </div>
  `;
  const close = () => { $("#dialogHost").innerHTML = ""; };
  $$("[data-import-cancel]").forEach((button) => button.addEventListener("click", close));
  $("[data-people-import-form]")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const submit = $("[data-people-import-form] button[type='submit']");
    if (submit) { submit.disabled = true; submit.textContent = trText("Apply import"); }
    try {
      const result = await api("/api/employees/import", { method: "POST", body: JSON.stringify({ fileBase64 }) });
      close();
      await loadState();
      render();
      toast(trText("Import complete"), `${result.created} created, ${result.updated} updated.`);
    } catch (error) {
      if (submit) submit.disabled = false;
      toast(trText("Could not import"), error.message);
    }
  });
}

function openPeopleActionsMenu(anchor) {
  const actions = peopleListActions();
  if (!actions.length) return;
  renderFloatingMenu(`<div class="profile-menu">${actions.map((action) => `<button class="menu-item" ${action.attr}>${icon(action.icon)}${escapeHtml(trText(action.label))}</button>`).join("")}</div>`, anchor, { width: 240 });
  bindPageActions();
}

function accountWorkspaceDetail(account) {
  const tab = state.accountWorkspaceTab || "Overview";
  const tabs = ["Overview", "Security", "Sessions", "Timeline"];
  const person = personForAccount(account);
  return `
    <header class="ticket-workspace-detail-head account-detail-head">
      <div class="identity-head">
        <span class="avatar large">${escapeHtml(initials(account.name || account.username))}</span>
        <div><p class="eyebrow">${escapeHtml(account.accountType || "Account")}</p><h3>${escapeHtml(account.username || account.email || account.name)}</h3><p class="muted">${escapeHtml(look("roles", account.roleId) || "No role")} | ${escapeHtml(account.accountType || "Employee")} | ${escapeHtml(person?.name || "No linked person")}</p></div>
      </div>
      <div class="detail-head-actions"><span class="badge ${badgeClass(accountStatusValue(account))}">${escapeHtml(accountStatusLabel(account))}</span>${has("users", "edit") ? `<button class="btn btn-secondary" data-edit="users" data-id="${account.id}">${icon("edit")}Edit</button>${accountStatusLabel(account) === "Enabled" ? `<button class="btn btn-secondary" data-disable-user-account="${account.id}">Disable</button>` : `<button class="btn btn-secondary" data-unlock-user-account="${account.id}">Enable</button>`}` : ""}${headerMoreComingSoonMenu(["Export account", "Force logout", "Login history report"])}</div>
    </header>
    <div class="tabs workspace-tabs">${tabs.map((item) => `<button class="tab ${tab === item ? "active" : ""}" data-account-workspace-tab="${item}">${item}</button>`).join("")}</div>
    <div class="ticket-workspace-detail-body">${accountWorkspaceTabContent(account, tab)}</div>
  `;
}

function peopleWorkspaceTabContent(person, tab) {
  if (tab === "Assets") return peopleAssetsTab(person);
  if (tab === "Tickets") return peopleTicketsTab(person);
  if (tab === "Tasks") return peopleTasksTab(person);
  if (tab === "Documents") return peopleDocumentsTab(person);
  if (tab === "Account" || tab === "User Account") return personUserAccountTab(person);
  if (tab === "Timeline") return peopleTimelineTab(person);
  return peopleOverviewTab(person);
}

function accountWorkspaceTabContent(account, tab) {
  if (tab === "Security") return accountSecurityTab(account);
  if (tab === "Sessions") return accountSessionsTab(account);
  if (tab === "Timeline") return accountTimelineTab(account);
  return accountOverviewTab(account);
}

function peopleOverviewTab(person) {
  const user = linkedUserForPerson(person);
  const fields = [
    ["Employee Number", person.employeeNo || "-"], ["Person Type", person.personType || "Employee"], ["Manager", look("employees", person.managerId) || "-"],
    ["Cost Center", person.costCenter || "-"], ["Branch", person.branch || person.location || "-"], ["Start Date", person.startDate || person.hireDate || "-"]
  ];
  const accessFields = user ? [
    ["Login Account", accountStatusLabel(user)],
    ["Username", user.username || user.email || "-"],
    ["Role", look("roles", user.roleId) || "-"],
    ["Last Login", user.lastLoginAt ? relativeTime(user.lastLoginAt) : "Never"],
    ["Password Expires", user.expiryDate || "No expiry"],
    ["MFA", user.mfaEnabled ? "Enabled" : "Disabled"]
  ] : [];
  return `
    <div class="people-overview-layout">
      <section class="surface-card people-info-card">
        <div class="section-title"><div><p class="eyebrow">Profile Context</p><h3>Employment and reporting details</h3></div></div>
        <div class="detail-grid">${fields.map(([label, value]) => `<div class="detail-field"><small>${escapeHtml(label)}</small><strong>${escapeHtml(value)}</strong></div>`).join("")}</div>
      </section>
      <section class="surface-card people-info-card">
        <div class="section-title"><div><p class="eyebrow">System Access</p><h3>${user ? "Login Account Active" : "No Login Account"}</h3><p class="muted">${user ? "This person has a linked login account." : "Create login access only when this person needs to sign in."}</p></div></div>
        ${user ? `<div class="detail-grid">${accessFields.map(([label, value]) => `<div class="detail-field"><small>${escapeHtml(label)}</small><strong>${escapeHtml(value)}</strong></div>`).join("")}</div><div class="record-card-actions account-actions"><button class="btn btn-primary" data-open-linked-account="${user.id}">Open User Account</button></div>` : `<div class="system-access-empty compact"><div class="record-icon">${icon("users")}</div><div><strong>No Login Account</strong><p class="muted">This person is managed as a People record only.</p>${has("users", "create") ? `<button class="btn btn-primary" data-create-person-account="${person.id}">${icon("plus")}Create Account</button>` : ""}</div></div>`}
      </section>
    </div>
  `;
}

function peopleAssetsTab(person) {
  const assigned = rows("assets").filter((asset) => asset.currentOwnerId === person.id);
  const returned = rows("transfers").filter((transfer) => transfer.toEmployeeId === person.id || transfer.fromEmployeeId === person.id);
  return `<div class="collection-grid">${assigned.map((asset) => relatedRecordCard("assets", asset, `Warranty: ${asset.warrantyEndDate || "not set"}`)).join("") || emptyState("No assigned assets", "Assigned assets appear here.")}</div><section class="article-section"><div class="section-title"><div><p class="eyebrow">Lifecycle</p><h3>Returned and historical assets</h3></div></div><div class="timeline-feed">${returned.map(eventCardFromTransfer).join("") || emptyState("No asset history", "Asset assignment and return events appear here.")}</div></section>`;
}

function peopleTicketsTab(person) {
  const tickets = rows("tickets").filter((ticket) => ticket.requesterId === person.id).slice(0, 8);
  return `<div class="collection-grid">${tickets.map((ticket) => relatedRecordCard("tickets", ticket, `${labelize(ticket.status || "open")} | ${ticket.priority || "medium"} | ${look("users", ticket.assignedToId) || "Unassigned"}`)).join("") || emptyState("No tickets", "Recent tickets for this person appear here.")}</div>`;
}

function peopleTasksTab(person) {
  const account = linkedUserForPerson(person);
  const tasks = rows("tasks").filter((task) => task.ownerId === account?.id || task.relatedId === person.id);
  return `<div class="collection-grid">${tasks.map((task) => relatedRecordCard("tasks", task, `${labelize(task.status || "open")} | ${task.recurrence || "One time"} | ${task.dueDate || "No due date"}`)).join("") || emptyState("No tasks", "Assigned, recurring, and completed tasks appear here.")}</div>`;
}

function peopleDocumentsTab(person) {
  const docs = rows("documents").filter((doc) => doc.linkedType === "employee" && doc.linkedId === person.id);
  return `<div class="collection-grid">${docs.map((doc) => relatedRecordCard("documents", doc, `${doc.templateType || "Document"} | ${doc.approvalStatus || "Draft"}`)).join("") || emptyState("No documents", "Signed forms, policies, and certificates appear here.")}</div>`;
}

function peopleTimelineTab(person) {
  const events = [
    ...timelineEventsFor("employees", person.id),
    ...rows("transfers").filter((transfer) => transfer.toEmployeeId === person.id || transfer.fromEmployeeId === person.id).map(eventCardFromTransfer)
  ];
  return `<div class="timeline-feed">${events.join("") || emptyState("No timeline yet", "People history will appear here.")}</div>`;
}

function relatedRecordCard(name, row, meta = "") {
  return `<article class="record-card"><div class="record-card-head"><div class="record-icon">${icon(name)}</div><div><strong>${escapeHtml(primaryTitle(name, row))}</strong><span>${escapeHtml(meta || secondaryTitle(name, row))}</span></div></div><div class="record-card-actions"><button class="btn btn-secondary" data-view="${name}" data-id="${row.id}">${escapeHtml(tpl("Open {module}", { module: displayLabel(name) }))}</button></div></article>`;
}

function eventCardFromTransfer(transfer) {
  return eventCard(transferToEvent(transfer));
}

function timelineEventsFor(entityType, entityId) {
  return (state.db.timeline || []).filter((event) => event.entityId === entityId && [entityType, singular(entityType)].includes(event.entityType)).map(eventCard);
}

function accountOverviewTab(account) {
  const person = personForAccount(account);
  const fields = [
    ["Username", account.username || "-"], ["Email", account.email || "-"], ["Role", look("roles", account.roleId) || "-"],
    ["Account Type", account.accountType || "Employee"], ["Linked Person", person?.name || "No linked person"], ["Status", accountStatusLabel(account)],
    ["Created", account.createdAt ? new Date(account.createdAt).toLocaleString() : "-"], ["Last Login", account.lastLoginAt ? relativeTime(account.lastLoginAt) : "Never"], ["Password Expiry", account.expiryDate || "No expiry"]
  ];
  return `<section class="surface-card account-overview-card"><div class="section-title"><div><p class="eyebrow">Account</p><h3>Overview</h3></div></div><div class="detail-grid">${fields.map(([label, value]) => `<div class="detail-field"><small>${escapeHtml(label)}</small><strong>${escapeHtml(value)}</strong></div>`).join("")}</div></section><div class="record-card-actions account-actions">${has("users", "edit") ? `<button class="btn btn-secondary" data-edit="users" data-id="${account.id}">${icon("edit")}Edit</button><button class="btn btn-secondary" data-reset-user-password="${account.id}">Reset Password</button>${accountStatusLabel(account) === "Enabled" ? `<button class="btn btn-secondary" data-disable-user-account="${account.id}">Disable Account</button>` : `<button class="btn btn-secondary" data-unlock-user-account="${account.id}">Unlock Account</button>`}` : ""}${person ? `<button class="btn btn-secondary" data-open-linked-person="${person.id}">Open Linked Person</button>` : ""}</div>`;
}

function accountSecurityTab(account) {
  return `<section class="surface-card account-overview-card">
    <div class="section-title"><div><p class="eyebrow">Security</p><h3>Account Protection</h3></div></div>
    <div class="detail-grid">
      <div class="detail-field"><small>Require Password Change</small><strong>${account.requirePasswordChange ? "Yes" : "No"}</strong></div>
      <div class="detail-field"><small>MFA Status</small><strong>${account.mfaEnabled ? "Enabled" : "Disabled"}</strong></div>
      <div class="detail-field"><small>Failed Login Attempts</small><strong>${account.failedLoginAttempts || 0}</strong></div>
      <div class="detail-field"><small>Password Last Changed</small><strong>${account.passwordChangedAt ? relativeTime(account.passwordChangedAt) : "Not recorded"}</strong></div>
    </div>
  </section><div class="record-card-actions account-actions">${has("users", "edit") ? `<button class="btn btn-secondary" data-reset-user-password="${account.id}">Reset Password</button><button class="btn btn-secondary" data-unlock-user-account="${account.id}">Unlock Account</button><button class="btn btn-secondary" data-disable-user-account="${account.id}">Disable Account</button>` : ""}</div>`;
}

function accountSessionsTab(account) {
  const logins = (state.db.auditLogs || []).filter((log) => log.entityType === "users" && log.entityId === account.id && log.action === "login");
  return `<div class="timeline-feed">${logins.map((log, index) => `<article class="timeline-card"><div class="timeline-meta"><span class="badge ${index === 0 ? "success" : "info"}">${index === 0 ? "Current active session" : "Previous login"}</span><span>${new Date(log.createdAt).toLocaleString()}</span></div><strong>Login success</strong><p class="muted">IP Address: ${escapeHtml(log.ipAddress || "local")} | Browser: V1 browser | Device: Web</p><small>Logout Time: Not tracked in V1</small></article>`).join("") || emptyState("No sessions recorded", "Successful logins will appear here.")}</div>`;
}

function accountTimelineTab(account) {
  const events = [
    ...(state.db.timeline || []).filter((event) => event.entityType === "users" && event.entityId === account.id).map(eventCard),
    ...(state.db.auditLogs || []).filter((log) => log.entityType === "users" && log.entityId === account.id && log.action === "login").map((log) => `<article class="timeline-card"><div class="timeline-meta"><span class="badge success">Security</span><span>${new Date(log.createdAt).toLocaleString()}</span></div><strong>Login Success</strong><p class="muted">${escapeHtml(look("users", log.userId) || "Account")} signed in.</p></article>`)
  ];
  return `<div class="timeline-feed">${events.join("") || emptyState("No account timeline", "Security actions will appear here.")}</div>`;
}

function personForAccount(account) {
  return allPeopleRows().find((person) => person.id === account.employeeId)
    || allPeopleRows().find((person) => person.email && account.email && person.email.toLowerCase() === account.email.toLowerCase());
}

function canDeleteUnusedPerson(person) {
  return !hasPersonLinkedRecords(person);
}

function hasPersonLinkedRecords(person) {
  const account = linkedUserForPerson(person);
  return rows("assets").some((asset) => asset.currentOwnerId === person.id)
    || rows("tickets").some((ticket) => ticket.requesterId === person.id)
    || rows("tasks").some((task) => task.ownerId === account?.id || task.relatedId === person.id)
    || rows("documents").some((doc) => doc.linkedType === "employee" && doc.linkedId === person.id)
    || rows("transfers").some((transfer) => transfer.toEmployeeId === person.id || transfer.fromEmployeeId === person.id);
}

function employeeTicketsPage() {
  const data = employeeTicketsForCurrentUser(collection("tickets"));
  const limit = state.loadMore.tickets || state.pageSize;
  const visible = data.slice(0, limit);
  const hasMore = visible.length < data.length;
  return `
    ${toolbar("tickets", { eyebrow: "Self-service", title: "Tickets", subtitle: "Your requests to IT, shown as simple cards.", filter: "status" })}
    ${employeeFilterResetBar("tickets")}
    <div class="collection-grid employee-ticket-grid">
      ${visible.map(employeeTicketCard).join("") || employeeEmptyState("No tickets yet.", "Need help? Submit a request.", "Create Ticket", "tickets")}
    </div>
    ${hasMore ? `<div class="load-more-row"><button class="btn btn-secondary" data-load-more="tickets">Load more</button><span class="muted">Showing ${visible.length} of ${data.length}</span></div>` : data.length ? `<p class="muted load-more-row">Showing all ${data.length} tickets.</p>` : ""}
  `;
}

function employeeTicketCard(row) {
  const parts = ticketCategoryParts(row.category);
  const replies = employeePublicTicketComments(row.id);
  const lastReply = replies[replies.length - 1];
  return `
    <article class="record-card employee-ticket-card">
      <div class="record-card-head">
        <div class="record-icon">${icon("tickets")}</div>
        <div><strong>${escapeHtml(ticketSubject(row))}</strong><span>${escapeHtml(row.ticketNumber || row.id)} | ${escapeHtml(parts.main)}${parts.sub ? ` / ${escapeHtml(parts.sub)}` : ""}</span></div>
      </div>
      <div class="employee-card-lines">
        <span><strong>Status:</strong> <span class="badge ${badgeClass(row.status || "open")}">${escapeHtml(labelize(row.status || "open"))}</span></span>
        <span><strong>Updated:</strong> ${escapeHtml(relativeTime(row.updatedAt || row.createdAt))}</span>
        <span><strong>Replies:</strong> ${replies.length}</span>
      </div>
      ${lastReply ? `<p class="muted employee-public-reply">Latest public reply: ${escapeHtml(String(lastReply.body || "").slice(0, 110))}</p>` : ""}
      <div class="record-card-actions"><button class="btn btn-secondary" data-view="tickets" data-id="${row.id}">Open</button></div>
    </article>
  `;
}

function employeeAssetsPage() {
  const data = employeeAssetsForCurrentUser(collection("assets"));
  return `
    ${toolbar("assets", { eyebrow: "My equipment", title: "My Assets", subtitle: "Devices and equipment currently assigned to you." })}
    <div class="collection-grid employee-asset-grid">
      ${data.map(employeeAssetCard).join("") || employeeEmptyState("No assets assigned.", "Devices assigned to you by IT will appear here.")}
    </div>
  `;
}

function employeeAssetCard(row) {
  return `
    <article class="record-card employee-asset-card">
      <div class="record-card-head">
        <div class="record-icon">${icon("assets")}</div>
        <div><strong>${escapeHtml(assetDisplayName(row))}</strong><span>${escapeHtml(row.assetNumber || row.id)} | ${escapeHtml(row.type || "Asset")}</span></div>
      </div>
      <div class="employee-card-lines">
        <span><strong>Status:</strong> <span class="badge ${badgeClass(row.status || "assigned")}">${escapeHtml(labelize(row.status || "assigned"))}</span></span>
        <span><strong>Location:</strong> ${escapeHtml(row.location || "Not set")}</span>
        <span><strong>Return:</strong> ${escapeHtml(row.expectedReturnDate || "No return date")}</span>
      </div>
      <div class="record-card-actions"><button class="btn btn-secondary" data-view="assets" data-id="${row.id}">Open</button></div>
    </article>
  `;
}

function employeeAssetDetailPage(row) {
  const allowed = employeeAssetsForCurrentUser(rows("assets")).some((asset) => asset.id === row.id);
  if (!allowed) return emptyState("Asset unavailable", "Employees can only view assets assigned to them.");
  return `
    <section class="surface-card detail-page employee-asset-detail">
      <div class="detail-head">
        <div><button class="btn btn-secondary back-button" data-back-to-list>&larr; Back</button><p class="eyebrow">My Asset</p><h3>${escapeHtml(assetDisplayName(row))}</h3><p class="muted">${escapeHtml(row.assetNumber || row.id)} | ${escapeHtml(row.type || "Asset")}</p></div>
      </div>
      <div class="detail-grid">
        <div class="detail-field"><small>Asset number</small><strong>${escapeHtml(row.assetNumber || row.id)}</strong></div>
        <div class="detail-field"><small>Status</small><strong><span class="badge ${badgeClass(row.status || "assigned")}">${escapeHtml(labelize(row.status || "assigned"))}</span></strong></div>
        <div class="detail-field"><small>Location</small><strong>${escapeHtml(row.location || "Not set")}</strong></div>
        <div class="detail-field"><small>Return expectation</small><strong>${escapeHtml(row.expectedReturnDate || "No return date")}</strong></div>
        <div class="detail-field"><small>Manufacturer</small><strong>${escapeHtml(row.brand || "Not set")}</strong></div>
        <div class="detail-field"><small>Model</small><strong>${escapeHtml(row.model || "Not set")}</strong></div>
      </div>
    </section>
  `;
}

function employeeTasksPage() {
  const allTasks = employeeTasksForCurrentUser(collection("tasks"), true);
  const data = filterEmployeeTasksByStatus(allTasks);
  return `
    ${toolbar("tasks", { eyebrow: "My workspace", title: "My Tasks", subtitle: "Personal work, learning, finance, health, and other reminders kept simple for V1." })}
    ${employeeFilterResetBar("tasks")}
    ${employeeTaskFilterChips(allTasks)}
    <div class="task-view-switcher" role="group" aria-label="Task view">
      <button class="btn ${state.taskView === "cards" ? "btn-primary" : "btn-secondary"}" data-task-view="cards">${icon("tasks")}Card View</button>
      <button class="btn ${state.taskView === "calendar" ? "btn-primary" : "btn-secondary"}" data-task-view="calendar">${icon("dashboard")}Calendar View</button>
    </div>
    ${state.taskView === "calendar" ? employeeTaskCalendar(data) : `<div class="collection-grid">${data.map(employeeTaskCard).join("") || employeeEmptyState("You're all caught up.", "No tasks due right now.", "Create Task", "tasks")}</div>`}
  `;
}

function employeeTaskFilterChips(tasks = []) {
  const filters = [
    ["all", "All"],
    ["open", "Open"],
    ["in_progress", "In Progress"],
    ["pending_paused", "Pending / Paused"],
    ["completed", "Completed"],
    ["cancelled", "Cancelled"]
  ];
  return `<div class="employee-task-filter-chips">${filters.map(([value, label]) => {
    const count = filterEmployeeTasksByStatus(tasks, value).length;
    return `<button type="button" class="filter-chip ${state.employeeTaskStatusFilter === value ? "active" : ""}" data-employee-task-filter="${value}">${escapeHtml(trText(label))}<span>${count}</span></button>`;
  }).join("")}</div>`;
}

function filterEmployeeTasksByStatus(tasks, filter = state.employeeTaskStatusFilter || "open") {
  return tasks.filter((task) => {
    const normalized = normalizeEmployeeTaskStatus(task.status);
    if (filter === "all") return true;
    if (filter === "open") return !["completed", "cancelled"].includes(normalized);
    if (filter === "pending_paused") return ["pending", "waiting"].includes(normalized);
    return normalized === filter;
  });
}

function employeeFilterResetBar(moduleName) {
  const hasFilter = Boolean(state.query || state.globalQuery || state.filters[moduleName]);
  if (!hasFilter) return "";
  return `<div class="employee-filter-reset"><span>${escapeHtml(trText("Filters are active"))}</span><button class="btn btn-secondary" data-employee-reset-filters="${escapeHtml(moduleName)}">${escapeHtml(trText("Reset Filters"))}</button></div>`;
}

function employeeTaskCalendar(tasks) {
  const mode = state.calendarView;
  const range = calendarRange(state.calendarDate, mode);
  const occurrences = calendarOccurrences(tasks, range.start, range.end);
  const title = mode === "month" ? state.calendarDate.toLocaleDateString(undefined, { month: "long", year: "numeric" }) : `${range.start.toLocaleDateString(undefined, { month: "short", day: "numeric" })} - ${range.end.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}`;
  return `
    <section class="surface-card task-calendar">
      <div class="calendar-toolbar">
        <div class="calendar-navigation"><button class="icon-btn" data-calendar-nav="prev" title="Previous">${icon("back")}</button><strong>${escapeHtml(title)}</strong><button class="icon-btn" data-calendar-nav="next" title="Next">${icon("plus")}</button><button class="btn btn-secondary" data-calendar-nav="today">Today</button></div>
        <div class="calendar-mode-switch"><button class="btn ${mode === "month" ? "btn-primary" : "btn-secondary"}" data-calendar-mode="month">Month</button><button class="btn ${mode === "week" ? "btn-primary" : "btn-secondary"}" data-calendar-mode="week">Week</button><button class="btn ${mode === "day" ? "btn-primary" : "btn-secondary"}" data-calendar-mode="day">Day</button></div>
      </div>
      ${calendarGrid(mode, range, occurrences)}
    </section>
    <section class="surface-card overdue-task-section"><div class="section-title"><div><p class="eyebrow">Needs attention</p><h3><span class="overdue-warning" aria-hidden="true">&#9888;</span>Overdue Tasks</h3></div></div><div class="task-stack">${tasks.filter(isOverdueTask).map((task) => compactCard("tasks", task)).join("") || `<p class="muted compact-empty">No overdue tasks.</p>`}</div></section>
  `;
}

function calendarRange(base, mode) {
  const current = new Date(base.getFullYear(), base.getMonth(), base.getDate());
  if (mode === "day") return { start: current, end: current };
  if (mode === "week") { const start = new Date(current); start.setDate(current.getDate() - current.getDay()); const end = new Date(start); end.setDate(start.getDate() + 6); return { start, end }; }
  const start = new Date(current.getFullYear(), current.getMonth(), 1); start.setDate(start.getDate() - start.getDay());
  const end = new Date(current.getFullYear(), current.getMonth() + 1, 0); end.setDate(end.getDate() + (6 - end.getDay()));
  return { start, end };
}

function moveCalendar(direction) {
  if (direction === "today") { state.calendarDate = new Date(); return; }
  const amount = direction === "next" ? 1 : -1;
  const next = new Date(state.calendarDate);
  if (state.calendarView === "month") next.setMonth(next.getMonth() + amount);
  else if (state.calendarView === "week") next.setDate(next.getDate() + (7 * amount));
  else next.setDate(next.getDate() + amount);
  state.calendarDate = next;
}

function calendarDateKey(date) { return date.toISOString().slice(0, 10); }

function isOverdueTask(task) { return Boolean(task?.dueDate) && taskDueBadge(task).includes("overdue") && !isCompletedTask(task); }

function calendarGrid(mode, range, occurrences) {
  const days = [];
  const cursor = new Date(range.start);
  while (cursor <= range.end) { days.push(new Date(cursor)); cursor.setDate(cursor.getDate() + 1); }
  const cells = days.map((date) => {
    const key = calendarDateKey(date);
    const items = occurrences.filter((item) => item.date === key);
    const limit = mode === "month" ? 3 : 8;
   return `<button class="calendar-day ${date.getMonth() !== state.calendarDate.getMonth() && mode === "month" ? "outside" : ""} ${key === today() ? "today" : ""}" data-calendar-date="${key}"><span class="calendar-day-number">${date.getDate()}</span><span class="calendar-events">${items.slice(0, limit).map(calendarTaskPill).join("")}${items.length > limit ? `<small>+${items.length - limit} more</small>` : ""}</span></button>`;
    return `<article class="calendar-day ${date.getMonth() !== state.calendarDate.getMonth() && mode === "month" ? "outside" : ""} ${key === today() ? "today" : ""}" data-calendar-date="${key}"><span class="calendar-day-number">${date.getDate()}</span><span class="calendar-events">${items.slice(0, limit).map(calendarTaskPill).join("")}${items.length > limit ? `<button type="button" class="calendar-show-all" data-calendar-more="${key}">Show all (${items.length})</button>` : ""}</span></article>`;
  }).join("");
  const weekdays = mode === "day" ? "" : `<div class="calendar-weekdays">${["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => `<span>${day}</span>`).join("")}</div>`;
  return `${weekdays}<div class="calendar-grid ${mode}">${cells}</div>`;
}

function calendarTaskPill(item) {
  return `<button type="button" class="calendar-task priority-${calendarPriority(item.task)} ${isOverdueTask(item.task) ? "overdue" : ""}" data-calendar-task="${item.task.id}" title="${escapeHtml(item.task.title)}">${taskStatusIndicator(item.task)}${escapeHtml(item.task.title)}${taskRecurrenceIndicator(item.task)}</button>`;
}

function calendarPriority(task) { const priority = String(task?.priority || "Medium").trim().toLowerCase(); return priority === "critical" ? "high" : priority; }

function taskRecurrenceIndicator(task) {
  return ["daily", "weekly", "monthly", "yearly"].includes(String(task?.recurrence || "").toLowerCase()) ? `<span class="task-recurrence" title="Recurring task" aria-label="Recurring task">&#8635;</span>` : "";
}

function taskStatusIndicator(task) {
  const status = normalizeEmployeeTaskStatus(task?.status);
  const symbol = status === "completed" ? "&#10003;" : status === "cancelled" ? "&#215;" : "";
  return `<span class="task-status-indicator ${status}" title="${escapeHtml(employeeTaskStatusLabel(task?.status))}">${symbol}</span>`;
}

function calendarOccurrences(tasks, start, end) {
  const events = [];
  tasks.forEach((task) => {
    const recurrence = String(task.recurrence || "One time").toLowerCase();
    const recurring = ["daily", "weekly", "monthly", "yearly"].includes(recurrence);
    const anchor = recurring ? (task.startDate || task.dueDate) : (task.dueDate || task.startDate);
    if (!anchor) return;
    const base = new Date(`${anchor}T00:00:00`);
    for (let cursor = new Date(start); cursor <= end; cursor.setDate(cursor.getDate() + 1)) {
      if (cursor < base) continue;
      const sameDay = calendarDateKey(cursor) === calendarDateKey(base);
      const repeats = recurrence === "daily" || (recurrence === "weekly" && cursor.getDay() === base.getDay()) || (recurrence === "monthly" && cursor.getDate() === base.getDate()) || (recurrence === "yearly" && cursor.getDate() === base.getDate() && cursor.getMonth() === base.getMonth());
      if (sameDay || repeats) events.push({ task, date: calendarDateKey(cursor) });
    }
  });
  return events;
}

function openCalendarDayPopover(date) {
  const point = new Date(`${date}T00:00:00`);
  const tasks = collection("tasks").filter((task) => !isTerminalTask(task));
  const items = calendarOccurrences(tasks, point, point);
  $("#dialogHost").innerHTML = `<div class="modal-backdrop"><section class="surface-card calendar-day-popover"><div class="modal-head"><div><p class="eyebrow">Calendar</p><h3>${escapeHtml(point.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" }))}</h3></div><button class="icon-btn" data-calendar-popover-close>${icon("close")}</button></div><div class="calendar-day-task-list">${items.map((item) => `<button type="button" class="calendar-popover-task priority-${calendarPriority(item.task)} ${isOverdueTask(item.task) ? "overdue" : ""}" data-calendar-popover-task="${item.task.id}">${taskStatusIndicator(item.task)}<span>${escapeHtml(item.task.title)}</span>${taskRecurrenceIndicator(item.task)}</button>`).join("") || `<p class="muted">No tasks scheduled.</p>`}</div></section></div>`;
  $("[data-calendar-popover-close]")?.addEventListener("click", () => $("#dialogHost").innerHTML = "");
  $$("[data-calendar-popover-task]").forEach((button) => button.addEventListener("click", () => { $("#dialogHost").innerHTML = ""; openDetail("tasks", rows("tasks").find((task) => task.id === button.dataset.calendarPopoverTask)); }));
}

function employeeArchivedTasksPage() {
  const query = [state.globalQuery, state.query].filter(Boolean).join(" ").toLowerCase();
  const archived = rows("tasks").filter((task) => isCompletedTask(task) && JSON.stringify(task).toLowerCase().includes(query));
  return `
    ${toolbar("archived_tasks", { eyebrow: "Task history", title: "Archived Tasks", subtitle: "Completed tasks stay here until you restore them to My Tasks." })}
    <div class="collection-grid">
      ${archived.map(employeeArchivedTaskCard).join("") || employeeEmptyState("No archived tasks.", "Completed tasks will appear here.", "View My Tasks", "tasks")}
    </div>
  `;
}

function employeeArchivedTaskCard(row) {
  return `
    <article class="record-card employee-task-card archived-task-card">
      <div class="record-card-head">
        <div class="record-icon">${icon("archive_center")}</div>
        <div><strong>${taskStatusIndicator(row)}${escapeHtml(row.title || "Task")}${taskRecurrenceIndicator(row)}</strong><span>${escapeHtml(row.category || "Other")} | ${escapeHtml(row.dueDate || "No due date")}</span></div>
      </div>
      <div class="employee-card-lines"><span><strong>Status:</strong> <span class="badge success">Completed</span></span>${taskDueBadge(row)}</div>
      <div class="record-card-actions"><button class="btn btn-secondary" data-task-restore="${row.id}">Restore to My Tasks</button><button class="btn btn-secondary" data-view="tasks" data-id="${row.id}">Open</button></div>
    </article>
  `;
}

function employeeTaskCard(row) {
  const status = normalizeEmployeeTaskStatus(row.status);
  const terminal = ["completed", "cancelled"].includes(status);
  return `
    <article class="record-card employee-task-card status-${escapeHtml(status)} ${terminal ? "terminal" : ""}">
      <div class="record-card-head">
        <div class="record-icon">${icon("tasks")}</div>
        <div><strong>${taskStatusIndicator(row)}${escapeHtml(row.title || "Task")}</strong><span>${escapeHtml(row.category || "Other")} | ${escapeHtml(row.dueDate || "No due date")}</span></div>
      </div>
      <div class="employee-card-lines">
        <span><strong>Status:</strong> ${employeeTaskStatusBadge(row)} ${employeeTaskScopeBadge(row)}</span>
        <span><strong>Priority:</strong> <span class="badge ${badgeClass(row.priority)}">${escapeHtml(labelize(row.priority || "Medium"))}</span> ${taskDueBadge(row)}</span>
        ${taskStatusChips(row)}
      </div>
      <div class="record-card-actions"><button class="btn btn-secondary" data-view="tasks" data-id="${row.id}">Open</button></div>
    </article>
  `;
}

function taskStatusChips(row) {
  const values = [
    ["Pending", "Open"],
    ["In Progress", "In Progress"],
    ["Waiting", "Pending / Paused"],
    ["Completed", "Completed"],
    ["Cancelled", "Cancelled"]
  ];
  const current = normalizeEmployeeTaskStatus(row.status);
  return `<div class="status-chip-row" aria-label="${escapeHtml(trText("Task status"))}">${values.map(([status, label]) => {
    const active = normalizeEmployeeTaskStatus(status) === current;
    return `<button type="button" class="status-chip status-${escapeHtml(normalizeEmployeeTaskStatus(status))} ${active ? "active" : ""}" data-task-status-click="${row.id}" data-status="${status}" ${active ? "aria-current=\"true\"" : ""}>${taskStatusIcon(status)}${escapeHtml(trText(label))}</button>`;
  }).join("")}</div>`;
}

function employeeTaskStatusLabel(status) {
  return ({ pending: "Open", in_progress: "In Progress", waiting: "Pending / Paused", completed: "Completed", cancelled: "Cancelled" })[normalizeEmployeeTaskStatus(status)] || String(status || "Open");
}

function normalizeEmployeeTaskStatus(status) {
  const normalized = String(status || "pending").trim().toLowerCase().replace(/[_\s]+/g, "_");
  if (normalized === "in_progress") return "in_progress";
  if (["completed", "cancelled", "waiting"].includes(normalized)) return normalized;
  return "pending";
}

function employeeTaskApiStatus(status) {
  return ({ pending: "Pending", in_progress: "In Progress", waiting: "Waiting", completed: "Completed", cancelled: "Cancelled" })[normalizeEmployeeTaskStatus(status)] || "Pending";
}

function taskStatusIcon(status) {
  const normalized = normalizeEmployeeTaskStatus(status);
  if (normalized === "completed") return "✓ ";
  if (normalized === "cancelled") return "× ";
  if (normalized === "in_progress") return "◷ ";
  if (normalized === "waiting") return "Ⅱ ";
  return "○ ";
}

function employeeTaskStatusBadge(row) {
  const status = normalizeEmployeeTaskStatus(row.status);
  return `<span class="employee-task-status-badge ${escapeHtml(status)}">${taskStatusIcon(status)}${escapeHtml(trText(employeeTaskStatusLabel(status)))}</span>`;
}

function employeeTaskScope(row) {
  const explicit = String(row.scope || row.taskType || "").toLowerCase();
  if (explicit.includes("personal")) return "Personal";
  if (row.ownerId === state.user?.id && (!row.assignedToId || row.assignedToId === state.user?.id)) return "Personal";
  return "Work";
}

function employeeTaskScopeBadge(row) {
  const scope = employeeTaskScope(row);
  return `<span class="employee-task-scope-badge ${scope.toLowerCase()}">${escapeHtml(trText(scope))}</span>`;
}

function isCompletedTask(task) {
  return normalizeEmployeeTaskStatus(task?.status) === "completed";
}

function isTerminalTask(task) {
  return ["completed", "cancelled"].includes(normalizeEmployeeTaskStatus(task?.status));
}

function employeeDocumentsPage() {
  const data = employeeDocumentsForCurrentUser(collection("documents"));
  const paged = paginate("documents", data);
  return `
    ${toolbar("documents", { eyebrow: "Library", title: "Company Documents", subtitle: "Read-only company guides, policies, and handbooks." })}
    <div class="collection-grid">
      ${paged.items.map(employeeDocumentCard).join("") || employeeEmptyState("No documents available.", "Company documents published by IT will appear here.")}
    </div>
    ${pager("documents", data.length, paged)}
  `;
}

function employeeKnowledgeBasePage() {
  const filter = state.employeeKbFilter || "all";
  const query = String(state.query || "").toLowerCase().trim();
  let data = employeePublishedKnowledge(collection("knowledge_base")).filter((article) => {
    if (query && !typoTolerantIncludes(knowledgeSearchText(article), query)) return false;
    if (filter === "favorites" && !article.favorite) return false;
    if (filter === "recent" && !recentKnowledgeIds().includes(article.id)) return false;
    if (filter === "trending") return knowledgeViews(article) > 0 || knowledgeHelpfulVotes(article) > 0 || knowledgeFavoritesCount(article) > 0;
    return true;
  }).sort((a, b) => filter === "recent" ? recentKnowledgeIds().indexOf(a.id) - recentKnowledgeIds().indexOf(b.id) : knowledgeSearchScore(b, query) - knowledgeSearchScore(a, query));
  const paged = paginate("knowledge_base", data);
  return `
    ${toolbar("knowledge_base", { eyebrow: "Help center", title: "Knowledge Base", subtitle: "Short self-service articles from IT.", filter: "category" })}
    <div class="dashboard-filter-chips employee-kb-tabs" role="group" aria-label="Knowledge tabs">${[
      ["all", "All"],
      ["favorites", "Favorites"],
      ["recent", "Recently Viewed"],
      ["trending", "Trending"]
    ].map(([key, label]) => `<button class="filter-chip ${filter === key ? "active" : ""}" data-employee-kb-filter="${key}">${escapeHtml(label)}</button>`).join("")}</div>
    <div class="collection-grid employee-kb-grid">
      ${paged.items.map(employeeKnowledgeBaseCard).join("") || employeeEmptyState("No articles found.", "Try another search or category.")}
    </div>
    ${pager("knowledge_base", data.length, paged)}
  `;
}

function employeeKnowledgeBaseCard(row) {
  const title = highlightMatch(row.title || "Article", state.query);
  const body = highlightMatch(String(row.body || "").slice(0, 110), state.query);
  return `
    <article class="record-card employee-kb-card">
      <div class="record-card-head">
        <div class="record-icon">${icon("knowledge_base")}</div>
        <div><strong>${title}</strong><span>${escapeHtml(row.category || "Knowledge Base")}</span></div>
      </div>
      <p class="muted">${body}</p>
      <div class="kb-card-meta">
        <span class="badge ${row.published ? "success" : "info"}">${row.published ? "Published" : "Draft"}</span>
        <span>${escapeHtml(tpl("{n} min read", { n: readingTime(row.body) }))}</span>
        <span>${knowledgeHelpful(row)}</span>
      </div>
      <div class="kb-tags">${(row.tags || []).slice(0, 3).map((tag) => `<span>#${escapeHtml(tag)}</span>`).join("")}</div>
      <div class="record-card-actions"><button class="btn btn-secondary" data-view="knowledge_base" data-id="${row.id}">Open</button></div>
    </article>
  `;
}

function employeeKnowledgeWidgets() {
  const articles = collection("knowledge_base");
  const card = (title, items) => `<article class="kb-widget-card"><strong>${escapeHtml(title)}</strong>${items.slice(0, 3).map((item) => `<button class="article-link" data-view="knowledge_base" data-id="${item.id}">${escapeHtml(item.title || "Article")}</button>`).join("") || `<p class="muted">No articles yet.</p>`}</article>`;
  return `<section class="employee-kb-widgets">${card("Most Viewed", [...articles].sort((a, b) => knowledgeViews(b) - knowledgeViews(a)))}${card("Most Helpful", [...articles].sort((a, b) => knowledgeHelpfulVotes(b) - knowledgeHelpfulVotes(a)))}${card("Recently Updated", [...articles].sort((a, b) => String(b.updatedAt || "").localeCompare(String(a.updatedAt || ""))))}${card("Needs Improvement", articles.filter((item) => knowledgeAverageRating(item) > 0 && knowledgeAverageRating(item) < 3))}</section>`;
}

function recentKnowledgeIds() {
  return JSON.parse(localStorage.getItem("itcc.recentKnowledge") || "[]");
}

function rememberKnowledgeArticle(id) {
  const next = [id, ...recentKnowledgeIds().filter((item) => item !== id)].slice(0, 20);
  localStorage.setItem("itcc.recentKnowledge", JSON.stringify(next));
}

function highlightMatch(value, query) {
  const text = escapeHtml(value || "");
  const q = String(query || "").trim();
  if (!q || q.length < 2) return text;
  return text.replace(new RegExp(`(${escapeRegExp(q)})`, "ig"), "<mark>$1</mark>");
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function employeeDocumentCard(row) {
  return `
    <article class="record-card employee-document-card">
      <div class="record-card-head">
        <div class="record-icon">${icon("documents")}</div>
        <div><strong>${escapeHtml(row.title || "Document")}</strong><span>${escapeHtml(row.description || row.notes || "Company document")}</span></div>
      </div>
      <div class="employee-card-lines"><span><strong>Last updated date:</strong> ${escapeHtml(relativeTime(row.updatedAt || row.publishDate || row.createdAt))}</span></div>
      <div class="record-card-actions"><button class="btn btn-secondary" data-view="documents" data-id="${row.id}">Open</button></div>
    </article>
  `;
}

function documentFriendlyType(row) {
  return row.category || row.type || row.templateType || row.status || "Company document";
}

function ticketCategoryParts(category) {
  const [main, ...rest] = String(category || "General Questions / Other").split("/");
  return { main: main.trim() || "General Questions", sub: rest.join("/").trim() || "Other" };
}

function employeeTicketCategoryIcon(category) {
  return employeeTicketCategoryIcons[category] || "tickets";
}

function taskDueBadge(row) {
  if (!row?.dueDate) return "";
  const due = new Date(`${row.dueDate}T00:00:00`);
  if (Number.isNaN(due.getTime())) return "";
  const current = new Date();
  const todayValue = new Date(current.getFullYear(), current.getMonth(), current.getDate()).getTime();
  const dueValue = new Date(due.getFullYear(), due.getMonth(), due.getDate()).getTime();
  if (dueValue < todayValue) return `<span class="task-due-badge overdue">Overdue</span>`;
  if (dueValue === todayValue) return `<span class="task-due-badge today">Today</span>`;
  return "";
}

function employeeTaskCategoryLabel(value) {
  const raw = String(value || "").trim();
  if (!raw) return "";
  const option = lookupOptions("my_task_category", true).find((item) => {
    return String(lookupValue(item)).toLowerCase() === raw.toLowerCase() || String(lookupLabel(item)).toLowerCase() === raw.toLowerCase();
  });
  return option ? lookupLabel(option) : raw;
}

function relativeTime(value) {
  if (!value) return trText("Not updated");
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  const seconds = Math.max(1, Math.floor((Date.now() - date.getTime()) / 1000));
  if (seconds < 60) return state.lang === "ar" ? "الآن" : "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return state.lang === "ar" ? `منذ ${minutes} دقيقة` : `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return state.lang === "ar" ? `منذ ${hours} ساعة` : `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return state.lang === "ar" ? `منذ ${days} يوم` : `${days} day${days === 1 ? "" : "s"} ago`;
  return date.toLocaleDateString();
}

function primaryFilter(name) {
  return { employees: "status", assets: "status", contracts: "status", documents: "status", vendors: "rating", knowledge_base: "category", form_templates: "approvalStatus" }[name];
}

function collectionCard(name, row) {
  const title = primaryTitle(name, row);
  const sub = secondaryTitle(name, row);
  const meta = columns[name].slice(1, 5).map((col) => `<div class="detail-field"><small>${labelize(col)}</small><strong>${cell(name, row, col)}</strong></div>`).join("");
  return `
    <article class="record-card">
      <div class="record-card-head">
        <div class="record-icon">${icon(name)}</div>
        <div><strong>${escapeHtml(title)}</strong><span>${escapeHtml(sub)}</span></div>
      </div>
      <div class="record-card-meta">${meta}</div>
      <div class="record-card-actions">
        <button class="btn btn-secondary" data-view="${name}" data-id="${row.id}">${t("view")}</button>
        ${has(name, "edit") ? `<button class="btn btn-secondary" data-edit="${name}" data-id="${row.id}">${icon("edit")}${t("edit")}</button>` : ""}
        ${has(name, "archive") ? `<button class="btn btn-danger" data-archive="${name}" data-id="${row.id}">${icon("archive_center")}${t("archive")}</button>` : ""}
        ${has(name, "archive") ? `<button class="btn btn-danger" data-trash="${name}" data-id="${row.id}">${icon("delete")}Delete</button>` : ""}
      </div>
    </article>
  `;
}

function boardPage(name) {
  const data = collection(name);
  const lanes = name === "tickets" ? ["open", "in_progress", "waiting", "resolved", "closed", "cancelled"] : ["open", "in_progress", "overdue", "done"];
  return `
    ${toolbar(name, { eyebrow: "Kanban", subtitle: name === "tickets" ? "Move from intake to resolution without scanning a spreadsheet." : "A visual task board for IT commitments.", filter: "priority" })}
    <div class="kanban-board">
      ${lanes.map((lane) => {
        const items = data.filter((row) => row.status === lane);
        return `<section class="kanban-column"><div class="kanban-head"><strong>${labelize(lane)}</strong><span>${items.length}</span></div>${items.map((row) => compactCard(name, row)).join("") || emptyState("Empty lane", "No work in this status.")}</section>`;
      }).join("")}
    </div>
  `;
}

function managerTicketsPage() {
  const data = managerTicketCollection();
  const selected = data.find((ticket) => ticket.id === state.ticketWorkspaceSelectedId) || data[0] || null;
  if (selected) state.ticketWorkspaceSelectedId = selected.id;
  const filters = state.managerTicketFilters;
  const select = (field, label, values, valueFor = (value) => value, labelFor = (value) => value) => `
    <label class="manager-ticket-filter"><span>${label}</span><select data-manager-ticket-filter="${field}"><option value="">All ${label}</option>${values.map((value) => `<option value="${escapeHtml(valueFor(value))}" ${String(filters[field] || "") === String(valueFor(value)) ? "selected" : ""}>${escapeHtml(labelFor(value))}</option>`).join("")}</select></label>`;
  const statuses = ["open", "in_progress", "waiting", "resolved", "closed", "cancelled"];
  const priorities = [...new Set(rows("tickets").map((ticket) => ticket.priority).filter(Boolean))];
  const categories = [...new Set(rows("tickets").map((ticket) => ticket.category).filter(Boolean))].sort();
  const assignees = rows("users").filter((user) => ["role_manager", "role_staff"].includes(user.roleId));
  const chartContext = filters.chart ? `<div class="workspace-filter-context"><span>${escapeHtml(dashboardChartFilterLabel(filters.chart))}</span><button class="btn btn-secondary" data-clear-ticket-chart-filter>Clear</button></div>` : "";
  return `
    ${workspaceIdentityHeader("tickets", `<button class="btn btn-primary ticket-v2-primary" data-add="tickets">${icon("plus")}Create Ticket</button>`)}
    <section class="ticket-workspace ticket-workspace-v2">
      <aside class="ticket-workspace-list-panel">
        <div class="ticket-v2-list-head"><strong>Ticket list</strong><small>${escapeHtml(tpl("{n} matching", { n: data.length }))}</small></div>
        <div class="ticket-workspace-list-tools"><input id="searchBox" placeholder="Search tickets, requester, category..." value="${escapeHtml(state.query)}" /></div>
        <div class="manager-ticket-filters">
          ${select("status", "Status", statuses, (value) => value, (value) => labelize(value))}
          ${select("priority", "Priority", priorities)}
          ${select("assignee", "Assignee", assignees, (user) => user.id, (user) => user.name)}
          ${select("category", "Category", categories)}
        </div>
        ${chartContext}
        <div class="ticket-workspace-list" aria-label="Ticket list">
          ${data.map((ticket) => ticketWorkspaceListItem(ticket, selected?.id === ticket.id)).join("") || emptyState("No results found", "Try a different keyword or clear filters.", `<button class="btn btn-secondary" type="button" data-clear-filters="tickets">Clear filters</button>`)}
        </div>
      </aside>
      <section class="ticket-workspace-detail-panel">${selected ? ticketWorkspaceDetail(selected) : emptyState("No ticket selected", "Choose a ticket from the workspace list.")}</section>
    </section>
  `;
}

function dashboardChartFilterLabel(chart) {
  if (!chart) return "";
  const label = String(chart.field || "").replace("chart_", "").replace(/_/g, " ");
  return `Dashboard filter: ${labelize(label)} = ${chart.value}`;
}

function ticketWorkspaceDetail(row) {
  const tab = state.ticketWorkspaceTab || "Conversation";
  const tabs = [
    ["Conversation", "Conversation"],
    ["Details", "Details"],
    ["Files", "Files"],
    ["Timeline", "Timeline"]
  ];
  const activeTab = tabs.some(([value]) => value === tab) ? tab : "Conversation";
  state.ticketWorkspaceTab = activeTab;
  const requester = look("employees", row.requesterId) || "Unknown requester";
  const group = look("assignmentGroups", row.assignedGroupId);
  const assignee = look("users", row.assignedToId) || "Unassigned";
  return `
    <div class="ticket-v2-detail-layout">
      <main class="ticket-v2-main">
        <header class="ticket-workspace-detail-head ticket-v2-head">
          <div class="ticket-v2-title-block"><p class="eyebrow">Tickets / ${escapeHtml(row.ticketNumber || "Ticket")}</p><h3>${escapeHtml(ticketSubject(row))}</h3><p class="muted">${escapeHtml(requester)} | ${escapeHtml(group ? `${group} / ${assignee}` : `Assigned to ${assignee}`)}</p></div>
          <div class="ticket-v2-head-badges"><span class="badge ${badgeClass(row.status)}">${escapeHtml(labelize(row.status || "open"))}</span><span class="badge ${badgeClass(row.priority)}">${escapeHtml(row.priority || "Medium")}</span></div>
          ${ticketWorkspaceActionBar(row)}
        </header>
        <div class="tabs workspace-tabs ticket-v2-tabs">${tabs.map(([value, label]) => `<button class="tab ${activeTab === value ? "active" : ""}" data-ticket-workspace-tab="${value}">${escapeHtml(label)}</button>`).join("")}</div>
        <div class="ticket-workspace-detail-body ticket-v2-body">${detailTabContent("tickets", row, activeTab)}</div>
      </main>
      ${ticketWorkspaceSidePanel(row)}
    </div>
  `;
}

function ticketWorkspaceListItem(ticket, active) {
  const requester = look("employees", ticket.requesterId) || "Unknown";
  const comments = (state.db.comments || []).filter((item) => ["tickets", "ticket"].includes(item.entityType) && item.entityId === ticket.id && !item.internal).length;
  const sla = ticketSla(ticket);
  return `<button class="ticket-workspace-item ticket-v2-list-item ${active ? "active" : ""}" data-ticket-workspace-select="${ticket.id}">
    <span class="ticket-v2-list-top"><strong>${escapeHtml(ticket.ticketNumber || ticket.id)}</strong><span class="ticket-v2-sla ${sla.tone}">${escapeHtml(sla.label)}</span></span>
    <span class="workspace-ticket-subject">${escapeHtml(ticketSubject(ticket))}</span>
    <span class="ticket-v2-requester"><span class="avatar mini">${escapeHtml(initials(requester))}</span><span>${escapeHtml(requester)}</span><small>${escapeHtml(relativeTime(ticket.updatedAt || ticket.createdAt))}</small></span>
    <span class="ticket-v2-list-badges"><span class="badge ${badgeClass(ticket.priority)}">${escapeHtml(ticket.priority || "Medium")}</span><span class="badge ${badgeClass(ticket.status)}">${escapeHtml(labelize(ticket.status || "open"))}</span>${ticket.autoAssigned ? `<span class="badge info">Auto-assigned</span>` : ""}${ticket.onBehalf ? `<span class="badge neutral" title="Opened by IT on behalf of the requester">On behalf</span>` : ""}${comments ? `<span class="ticket-v2-unread">${comments}</span>` : ""}</span>
    ${ticketWorkspaceIndicators(ticket)}
  </button>`;
}

function ticketWorkspaceIndicators(ticket) {
  const indicators = [];
  if (String(ticket.priority || "").toLowerCase() === "critical") indicators.push('<span class="workspace-indicator critical">Critical</span>');
  if (ticket.status === "waiting" && ticket.waitingReason) indicators.push(`<span class="workspace-indicator waiting">Waiting for ${escapeHtml(ticket.waitingReason)}</span>`);
  if (!ticket.assignedToId) indicators.push('<span class="workspace-indicator unassigned">Unassigned</span>');
  return indicators.length ? `<span class="workspace-ticket-indicators">${indicators.join("")}</span>` : "";
}

function ticketWorkspaceInfoCards(row) {
  const cards = [
    ["Requester", ticketRequesterProvenance(row)],
    ["Category", row.category || "General"],
    ["Priority", `<span class="badge ${badgeClass(row.priority)}">${escapeHtml(row.priority || "Medium")}</span>`],
    ["Status", `<span class="badge ${badgeClass(row.status)}">${escapeHtml(labelize(row.status || "open"))}</span>`],
    ["Assigned Group", look("assignmentGroups", row.assignedGroupId) || "None"],
    ["Assigned To", `${escapeHtml(look("users", row.assignedToId) || "Unassigned")} ${row.autoAssigned ? '<span class="badge info">Auto-assigned</span>' : ""}`],
    ["Created", row.createdAt ? new Date(row.createdAt).toLocaleString() : "-"],
    ["Updated", row.updatedAt ? new Date(row.updatedAt).toLocaleString() : "-"]
  ];
  return `<section class="ticket-workspace-info">${cards.map(([label, value]) => `<div class="ticket-info-card"><small>${escapeHtml(label)}</small><strong>${typeof value === "string" && value.includes("<span") ? value : escapeHtml(value)}</strong></div>`).join("")}</section>`;
}

function ticketWorkspaceSummaryCards(row) {
  const attachments = (state.db.attachments || []).filter((item) => item.entityType === "ticket" && item.entityId === row.id).length;
  const sla = ticketSla(row);
  const cards = [
    ["SLA", `<span class="ticket-v2-sla ${sla.tone}">${escapeHtml(sla.label)}</span>`, "timeline"],
    ["Priority", `<span class="badge ${badgeClass(row.priority)}">${escapeHtml(row.priority || "Medium")}</span>`, "warning"],
    ["Asset", row.relatedAssetId ? look("assets", row.relatedAssetId) || row.relatedAssetId : "Not linked", "assets"],
    ["Knowledge", row.suggestedArticleIds?.length ? `${row.suggestedArticleIds.length} suggested` : "No article", "knowledge_base"],
    ["Files", String(attachments), "attachments"]
  ];
  return `<section class="ticket-v2-summary">${cards.map(([label, value, iconName]) => `<article class="ticket-v2-summary-card"><span>${icon(iconName)}</span><div><small>${escapeHtml(label)}</small><strong>${String(value).includes("<span") ? value : escapeHtml(value)}</strong></div></article>`).join("")}</section>`;
}

function ticketWorkspaceActionBar(row) {
  const draft = ticketWorkspaceDraft(row);
  const itUsers = rows("users").filter((user) => ["role_manager", "role_staff"].includes(user.roleId));
  const statuses = ["open", "in_progress", "waiting", "resolved", "closed", "cancelled"];
  const optionList = (items, current, labels = false) => items.map((value) => `<option value="${escapeHtml(value)}" ${value === current ? "selected" : ""}>${escapeHtml(labels ? labelize(value) : value)}</option>`).join("");
  const showWaitingReason = draft.status === "waiting" && row.status !== "waiting";
  const showCancelReason = draft.status === "cancelled" && row.status !== "cancelled";
  return `
    <section class="ticket-workspace-actions" aria-label="Ticket quick actions">
      <button class="btn btn-primary" type="button" data-ticket-workspace-compose="reply">${icon("reply")}Reply</button>
      <form data-ticket-management-form="${row.id}"><label><span>Assign</span><select name="assignedToId" data-ticket-draft-field="assignedToId"><option value="">Assign</option>${itUsers.map((user) => `<option value="${user.id}" ${draft.assignedToId === user.id ? "selected" : ""}>${escapeHtml(user.name)}</option>`).join("")}</select></label><label><span>Change Status</span><select name="status" data-ticket-draft-field="status" data-ticket-status-select>${optionList(statuses, draft.status, true)}</select></label><label class="ticket-reason ${showWaitingReason ? "" : "hidden"}" data-ticket-waiting-reason><span>Waiting reason</span><select name="waitingReason" data-ticket-draft-field="waitingReason"><option value="">Select reason</option>${optionList(["User", "Vendor", "Approval", "Parts", "External Company", "Other"], draft.waitingReason)}</select></label><label class="ticket-reason ${showCancelReason ? "" : "hidden"}" data-ticket-cancel-reason><span>Cancel reason</span><select name="cancelReason" data-ticket-draft-field="cancelReason"><option value="">Select reason</option>${optionList(["Requester", "IT", "Duplicate", "Created by mistake", "No longer needed", "Other"], draft.cancelReason)}</select></label>${formSaveStateHtml(draft.dirty ? "dirty" : "")}<button class="btn btn-primary" type="submit" ${draft.dirty ? "" : "disabled"}>Save Changes</button></form>
      <details class="ticket-v2-more"><summary>${icon("more")}More</summary><div><button type="button" class="btn btn-secondary" data-ticket-upload="${row.id}">${icon("attachments")}Upload file</button><button type="button" class="btn btn-secondary" data-ticket-link-asset="${row.id}">Link asset</button><button type="button" class="btn btn-secondary" data-ticket-attachments="${row.id}">View all attachments</button>${has("tickets", "archive") ? `<button type="button" class="btn btn-warning" data-archive="tickets" data-id="${row.id}">Archive</button><button type="button" class="btn btn-danger" data-trash="tickets" data-id="${row.id}">Delete</button>` : ""}${["Add watcher", "Link vendor", "Link contract", "Print", "Export"].map(comingSoonButton).join("")}</div></details>
    </section>
  `;
}

function ticketWorkspaceDraft(row) {
  if (!state.ticketWorkspaceDraft || state.ticketWorkspaceDraft.id !== row.id) {
    state.ticketWorkspaceDraft = { id: row.id, assignedToId: row.assignedToId || "", status: row.status || "open", priority: row.priority || "medium", waitingReason: row.waitingReason || "", cancelReason: row.cancelReason || "", dirty: false };
  }
  return state.ticketWorkspaceDraft;
}

function ticketWorkspaceSidePanel(row) {
  const requester = rows("employees").find((item) => item.id === row.requesterId);
  const asset = rows("assets").find((item) => item.id === row.relatedAssetId);
  const vendor = rows("vendors").find((item) => item.id === row.vendorId);
  const contract = rows("contracts").find((item) => item.id === row.contractId);
  const attachments = (state.db.attachments || []).filter((item) => item.entityType === "ticket" && item.entityId === row.id);
  const watcherIds = taskArray(row.watchers);
  const suggestions = taskArray(row.suggestedArticleIds).map((id) => rows("knowledge_base").find((item) => item.id === id)).filter(Boolean);
  const section = (title, rowsList) => `<section><h4>${escapeHtml(title)}</h4>${rowsList.map(([label, value]) => `<div class="ticket-v2-side-row"><span>${escapeHtml(label)}</span><strong>${String(value).includes("<") ? value : escapeHtml(value)}</strong></div>`).join("")}</section>`;
  const relatedButton = (label, module, record, fallback = "Not linked") => `<div class="ticket-v2-related-row"><span>${escapeHtml(label)}</span>${record ? `<button class="btn btn-secondary" data-open-module="${module}" data-open-id="${record.id}"><strong>${escapeHtml(primaryTitle(module, record))}</strong><small>Open</small></button>` : `<strong>${escapeHtml(fallback)}</strong>`}</div>`;
  return `<aside class="ticket-v2-side-panel">
    ${section("Ticket Information", [["Number", row.ticketNumber || row.id], ["Status", `<span class="badge ${badgeClass(row.status)}">${escapeHtml(labelize(row.status || "open"))}</span>`], ["Priority", `<span class="badge ${badgeClass(row.priority)}">${escapeHtml(row.priority || "Medium")}</span>`], ["Category", row.category || "General"], ["Created", row.createdAt ? new Date(row.createdAt).toLocaleString() : "-"], ["Updated", row.updatedAt ? relativeTime(row.updatedAt) : "-"]])}
    <section><h4>Requester</h4><div class="ticket-v2-person-card"><span class="avatar">${escapeHtml(initials(requester?.name || "U"))}</span><div><strong>${escapeHtml(requester?.name || "Unknown")}</strong><small>${escapeHtml(requester?.department || look("departments", requester?.departmentId) || requester?.email || "No department")}</small></div>${requester ? `<button class="btn btn-secondary" data-open-module="employees" data-open-id="${requester.id}">Open</button>` : ""}</div></section>
    ${section("Assignment", [["Assigned Group", look("assignmentGroups", row.assignedGroupId) || "None"], ["Assigned To", `${escapeHtml(look("users", row.assignedToId) || "Unassigned")} ${row.autoAssigned ? '<span class="badge info">Auto-assigned</span>' : ""}`], ["Waiting Reason", row.status === "waiting" ? row.waitingReason || "Not set" : "Not waiting"], ["Cancel Reason", row.status === "cancelled" ? row.cancelReason || "Not set" : "Not cancelled"]])}
    ${section("SLA", [["Remaining", ticketSla(row).label], ["Updated", relativeTime(row.updatedAt || row.createdAt)]])}
    <section><h4>Related Records</h4>${relatedButton("Asset", "assets", asset)}${relatedButton("Vendor", "vendors", vendor)}${relatedButton("Contract", "contracts", contract)}</section>
    <section><h4>Knowledge Suggestions</h4><div class="ticket-v2-suggestion-list">${suggestions.map((item) => `<button class="btn btn-secondary" data-open-module="knowledge_base" data-open-id="${item.id}"><span>${escapeHtml(item.title)}</span><small>View</small></button>`).join("") || `<p class="muted compact-empty">No suggestions yet.</p>`}</div></section>
    <section><h4>Attachments</h4><div class="ticket-v2-side-row"><span>Files</span><strong>${escapeHtml(tpl("{n} attachments", { n: attachments.length }))}</strong></div><button class="btn btn-secondary ticket-v2-side-action" type="button" data-ticket-attachments="${row.id}">View all attachments</button></section>
    <section><h4>Watchers</h4><div class="ticket-v2-watchers">${watcherIds.slice(0, 5).map((id) => `<span class="avatar mini" title="${escapeHtml(look("users", id) || id)}">${escapeHtml(initials(look("users", id) || id))}</span>`).join("") || `<span class="muted">No active watchers</span>`}${watcherIds.length > 5 ? `<strong>+${watcherIds.length - 5}</strong>` : ""}<span class="badge neutral">Coming soon</span></div></section>
  </aside>`;
}

function updateTicketWorkspaceDraft(row, field, value) {
  const draft = ticketWorkspaceDraft(row);
  draft[field] = value;
  if (field === "status" && value !== "waiting") draft.waitingReason = row.waitingReason || "";
  if (field === "status" && value !== "cancelled") draft.cancelReason = row.cancelReason || "";
  draft.dirty = ["assignedToId", "status", "priority", "waitingReason", "cancelReason"].some((key) => String(draft[key] || "") !== String(row[key] || ""));
}

function openTicketComposerUpload(ticketId) {
  state.ticketWorkspaceSelectedId = ticketId;
  state.ticketWorkspaceTab = "Conversation";
  state.ticketWorkspaceComposeInternal = false;
  render();
  setTimeout(() => {
    const input = document.querySelector(`.ticket-conversation-composer[data-id="${CSS.escape(ticketId)}"] input[type="file"]`);
    input?.focus();
    input?.closest(".composer-upload")?.scrollIntoView({ behavior: "smooth", block: "center" });
    toast("Upload from composer", "Use Upload Attachment in the reply composer, then Send to attach it to this ticket.");
  }, 0);
}

function openTicketAttachments(ticketId) {
  state.page = "attachments";
  state.detail = null;
  state.query = ticketId;
  state.filters.attachments = "";
  setHomeRoute();
  render();
  toast("Ticket attachments", "Showing attachments linked to the selected ticket.");
}

function openTicketLinkAssetDialog(ticketId) {
  const ticket = rows("tickets").find((item) => item.id === ticketId);
  if (!ticket) return;
  const assets = rows("assets");
  $("#dialogHost").innerHTML = `
    <div class="modal-backdrop"><form class="confirm-card surface-card" data-ticket-link-asset-form="${ticket.id}">
      <p class="eyebrow">Ticket relationship</p>
      <h3>Link asset</h3>
      <p class="muted">Choose the asset related to ${escapeHtml(ticket.ticketNumber || ticket.id)}.</p>
      <label>Asset<select name="relatedAssetId"><option value="">No linked asset</option>${assets.map((asset) => `<option value="${asset.id}" ${ticket.relatedAssetId === asset.id ? "selected" : ""}>${escapeHtml(asset.assetNumber || asset.id)} - ${escapeHtml(assetDisplayName(asset))}</option>`).join("")}</select></label>
      <div class="modal-actions"><button class="btn btn-secondary" type="button" data-dialog-close>Cancel</button><button class="btn btn-primary" type="submit">Save Link</button></div>
    </form></div>`;
  $("[data-dialog-close]")?.addEventListener("click", () => $("#dialogHost").innerHTML = "");
  $("[data-ticket-link-asset-form]")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const relatedAssetId = new FormData(event.currentTarget).get("relatedAssetId") || "";
    try {
      await api(`/api/tickets/${ticket.id}`, { method: "PATCH", body: JSON.stringify({ relatedAssetId, relatedType: relatedAssetId ? "asset" : "", relatedId: relatedAssetId }) });
      $("#dialogHost").innerHTML = "";
      toast("Asset linked", relatedAssetId ? "The ticket is now linked to the selected asset." : "The ticket asset link was cleared.");
      await loadState();
      render();
    } catch (error) {
      toast("Could not link asset", error.message);
    }
  });
}

function managerTicketCollection() {
  const query = [state.globalQuery, state.query].filter(Boolean).join(" ").toLowerCase();
  const filters = state.managerTicketFilters;
  return rows("tickets").filter((ticket) => {
    if (query && !JSON.stringify(ticket).toLowerCase().includes(query)) return false;
    if (filters.status && ticket.status !== filters.status) return false;
    if (filters.resolvedToday === "today" && !(ticket.status === "resolved" && isToday(ticket.updatedAt || ticket.createdAt))) return false;
    if (filters.priority && ticket.priority !== filters.priority) return false;
    if (filters.assignee === "unassigned" && ticket.assignedToId) return false;
    if (filters.assignee && filters.assignee !== "unassigned" && ticket.assignedToId !== filters.assignee) return false;
    if (filters.category && ticket.category !== filters.category) return false;
    if (filters.waitingReason && String(ticket.waitingReason || "").toLowerCase() !== String(filters.waitingReason).toLowerCase()) return false;
    if (filters.chart && !dashboardTicketChartMatch(ticket, filters.chart.field, filters.chart.value)) return false;
    return true;
  }).sort((a, b) => String(b.updatedAt || b.createdAt || "").localeCompare(String(a.updatedAt || a.createdAt || "")));
}

function dashboardTicketChartMatch(ticket, field, value) {
  const normalized = String(value || "").toLowerCase();
  if (field === "chart_priority") return String(ticket.priority || "").toLowerCase() === normalized;
  if (field === "chart_category") {
    if (normalized === "other") return !/(hardware|software|access|network|service request)/i.test(ticket.category || "");
    const pattern = normalized === "service request" ? /service requests?/i : new RegExp(escapeRegExp(value), "i");
    return pattern.test(ticket.category || "");
  }
  if (field === "chart_sla") {
    const tone = ticketSla(ticket).tone;
    return normalized === "on track" ? tone === "success" : normalized === "at risk" ? tone === "warning" : tone === "danger";
  }
  if (field === "chart_assignee") return (look("users", ticket.assignedToId) || "Unassigned") === value;
  return true;
}

function tasksWorkspacePage() {
  const data = tasksWorkspaceCollection();
  const selected = data.find((task) => task.id === state.taskWorkspaceSelectedId) || data[0] || null;
  if (selected) state.taskWorkspaceSelectedId = selected.id;
  return `
    ${workspaceIdentityHeader("tasks", has("tasks", "create") ? `<button class="btn btn-primary task-primary-action" data-add="tasks">${icon("plus")}Create Task</button>` : "")}
    ${taskExecutionKpis()}
    <section class="ticket-workspace task-workspace">
      <aside class="ticket-workspace-list-panel">
        <div class="ticket-workspace-list-tools"><input id="searchBox" placeholder="Search Tasks" value="${escapeHtml(state.query)}" /></div>
        ${taskQuickFilters()}
        ${taskWorkspaceFilters()}
        <div class="ticket-workspace-list" aria-label="Task list">
          ${data.map((task) => taskWorkspaceItem(task, selected?.id === task.id)).join("") || emptyState("No results found", "Try a different keyword or clear filters.", `<button class="btn btn-secondary" type="button" data-clear-filters="tasks">Clear filters</button>`)}
        </div>
      </aside>
      <section class="ticket-workspace-detail-panel">${selected ? taskWorkspaceDetail(selected) : emptyState("No task selected", "Choose a task from the workspace list.")}</section>
    </section>
  `;
}

function taskExecutionKpis() {
  const tasks = rows("tasks").filter((task) => !task.deletedAt);
  const start = new Date(`${today()}T00:00:00`);
  const weekEnd = new Date(start);
  weekEnd.setDate(start.getDate() + 6);
  const thisWeek = (task) => task.dueDate && new Date(`${task.dueDate}T00:00:00`) >= start && new Date(`${task.dueDate}T00:00:00`) <= weekEnd;
  const widget = (label, value, filter) => `<button class="metric-card task-kpi" data-task-quick-filter="${filter}"><strong>${escapeHtml(String(value))}</strong><span>${escapeHtml(label)}</span></button>`;
  return `<section class="metric-grid task-dashboard-widgets task-execution-kpis" aria-label="Execution task filters">
    ${widget("Due Today", tasks.filter((task) => task.dueDate === today() && !taskIsClosed(task)).length, "due_today")}
    ${widget("Due This Week", tasks.filter((task) => thisWeek(task) && !taskIsClosed(task)).length, "due_week")}
    ${widget("In Progress", tasks.filter((task) => taskStatusValue(task) === "in_progress").length, "all")}
    ${widget("Overdue", tasks.filter(taskIsOverdueEnterprise).length, "overdue")}
  </section>`;
}

function taskWorkspaceFilters() {
  const filters = taskFilters();
  const allTasks = rows("tasks");
  const optionSelect = (field, label, values, labeler = (value) => value) => `<label class="manager-ticket-filter"><span>${label}</span><select data-task-filter="${field}"><option value="">All ${label}</option>${values.map((value) => `<option value="${escapeHtml(value)}" ${String(filters[field] || "") === String(value) ? "selected" : ""}>${escapeHtml(labeler(value))}</option>`).join("")}</select></label>`;
  const users = rows("users");
  const primary = `
    ${optionSelect("status", "Status", taskStatusOptions(), labelize)}
    ${optionSelect("priority", "Priority", taskPriorityOptions(), labelize)}
    ${optionSelect("ownerId", "Owner", users.map((user) => user.id), (id) => look("users", id) || id)}
    ${optionSelect("assignedToId", "Assigned To", users.map((user) => user.id), (id) => look("users", id) || id)}
  `;
  const advanced = `
    ${optionSelect("departmentId", "Department", rows("departments").map((department) => department.id), (id) => look("departments", id) || id)}
    ${optionSelect("taskType", "Task Type", [...new Set(allTasks.map((task) => task.taskType || task.type).filter(Boolean))])}
    ${optionSelect("relatedType", "Related Module", [...new Set(allTasks.map((task) => task.relatedType).filter(Boolean))], labelize)}
    ${optionSelect("recurring", "Recurring", ["yes", "no"], labelize)}
    ${optionSelect("due", "Due Date", ["today", "week", "overdue", "none"], labelize)}
    ${optionSelect("createdBy", "Created By", users.map((user) => user.id), (id) => look("users", id) || id)}
  `;
  return `<div class="manager-ticket-filters task-workspace-filters">${primary}</div><details class="task-more-filters"><summary>More Filters</summary><div class="manager-ticket-filters task-workspace-filters advanced">${advanced}</div></details>`;
}

function taskQuickFilters() {
  const quick = taskFilters().quick || "all";
  const filters = [["all", "All"], ["my", "My Tasks"], ["assigned", "Assigned To Me"], ["due_today", "Due Today"], ["due_week", "Due This Week"], ["overdue", "Overdue"], ["completed", "Completed"], ["recurring", "Recurring"], ["archived", "Archived"]];
  return `<div class="dashboard-filter-chips task-quick-filters">${filters.map(([value, label]) => `<button class="filter-chip ${quick === value ? "active" : ""}" data-task-quick-filter="${value}">${escapeHtml(label)}</button>`).join("")}</div>`;
}

function taskFilters() {
  state.filters.tasks = state.filters.tasks && typeof state.filters.tasks === "object" ? state.filters.tasks : {};
  return state.filters.tasks;
}

function tasksWorkspaceCollection() {
  const query = [state.globalQuery, state.query].filter(Boolean).join(" ").toLowerCase();
  const filters = taskFilters();
  const start = new Date(`${today()}T00:00:00`);
  const weekEnd = new Date(start);
  weekEnd.setDate(start.getDate() + 6);
  return rows("tasks").filter((task) => {
    const haystack = [task.title, task.description, task.notes, task.category, task.taskType, task.tags, look("users", task.ownerId), look("users", task.assignedToId), relatedRecordLabel(task)].join(" ").toLowerCase();
    if (query && !haystack.includes(query)) return false;
    if (filters.quick === "my" && task.ownerId !== state.user?.id) return false;
    if (filters.quick === "assigned" && task.assignedToId !== state.user?.id) return false;
    if (filters.quick === "due_today" && task.dueDate !== today()) return false;
    if (filters.quick === "due_week" && !(task.dueDate && new Date(`${task.dueDate}T00:00:00`) >= start && new Date(`${task.dueDate}T00:00:00`) <= weekEnd)) return false;
    if (filters.quick === "overdue" && !taskIsOverdueEnterprise(task)) return false;
    if (filters.quick === "completed" && !["completed", "done"].includes(taskStatusValue(task))) return false;
    if (filters.quick === "recurring" && !taskIsRecurring(task)) return false;
    if (filters.quick === "archived" && !task.archivedAt && taskStatusValue(task) !== "archived") return false;
    if (filters.quick !== "archived" && task.deletedAt) return false;
    if (filters.status && taskStatusValue(task) !== filters.status) return false;
    if (filters.priority && taskPriorityValue(task) !== filters.priority) return false;
    if (filters.ownerId && task.ownerId !== filters.ownerId) return false;
    if (filters.assignedToId && task.assignedToId !== filters.assignedToId) return false;
    if (filters.departmentId && task.departmentId !== filters.departmentId) return false;
    if (filters.taskType && (task.taskType || task.type) !== filters.taskType) return false;
    if (filters.relatedType && task.relatedType !== filters.relatedType) return false;
    if (filters.recurring === "yes" && !taskIsRecurring(task)) return false;
    if (filters.recurring === "no" && taskIsRecurring(task)) return false;
    if (filters.createdBy && task.createdBy !== filters.createdBy) return false;
    if (filters.due === "today" && task.dueDate !== today()) return false;
    if (filters.due === "week" && !(task.dueDate && new Date(`${task.dueDate}T00:00:00`) >= start && new Date(`${task.dueDate}T00:00:00`) <= weekEnd)) return false;
    if (filters.due === "overdue" && !taskIsOverdueEnterprise(task)) return false;
    if (filters.due === "none" && task.dueDate) return false;
    return true;
  }).sort((a, b) => String(a.dueDate || "9999-99-99").localeCompare(String(b.dueDate || "9999-99-99")) || String(b.updatedAt || b.createdAt || "").localeCompare(String(a.updatedAt || a.createdAt || "")));
}

function taskWorkspaceItem(task, active) {
  return `<button class="ticket-workspace-item task-workspace-item ${active ? "active" : ""}" data-task-workspace-select="${task.id}">
    <span class="task-card-main">
      <span class="workspace-ticket-subject">${escapeHtml(task.title || "Untitled task")}</span>
      <span class="workspace-ticket-meta"><span>${escapeHtml(task.taskNumber || task.id)}</span><span>${escapeHtml(look("users", task.assignedToId || task.ownerId) || "Unassigned")}</span></span>
    </span>
    <span class="task-card-badges"><span class="badge ${taskStatusBadge(task)}">${escapeHtml(taskStatusLabel(task))}</span><span class="badge ${taskPriorityBadge(task)}">${escapeHtml(labelize(task.priority || "Medium"))}</span></span>
    <span class="workspace-ticket-indicators">${task.dueDate ? `<span class="workspace-indicator">${icon("calendar")}${escapeHtml(task.dueDate)}</span>` : ""}${relatedRecordLabel(task) ? `<span class="workspace-indicator">${icon("link")}${escapeHtml(relatedRecordLabel(task))}</span>` : ""}${taskIsRecurring(task) ? `<span class="workspace-indicator">${icon("repeat")}Recurring</span>` : ""}${taskIsOverdueEnterprise(task) ? `<span class="workspace-indicator critical">${icon("alert")}Overdue</span>` : ""}</span>
  </button>`;
}

function taskWorkspaceDetail(task) {
  const tab = state.taskWorkspaceTab || "Overview";
  const tabs = ["Overview", "Subtasks", "Notes", "Related Records", "Files", "Timeline"];
  const normalizedTab = tab === "Attachments" ? "Files" : tab;
  const safeTab = tabs.includes(normalizedTab) ? normalizedTab : "Overview";
  state.taskWorkspaceTab = safeTab;
  return `<header class="ticket-workspace-detail-head task-detail-head">
    <div class="task-detail-title-block"><p class="eyebrow">${escapeHtml(task.taskNumber || "Task")}</p><h3>${escapeHtml(task.title || "Untitled task")}</h3><p class="muted">${escapeHtml(relatedRecordLabel(task) || "No linked record")} - Due ${escapeHtml(task.dueDate || "unscheduled")}</p></div>
  </header>
  ${taskExecutionSnapshot(task)}
  ${taskActionsPanel(task)}
  <div class="tabs workspace-tabs">${tabs.map((item) => `<button class="tab ${safeTab === item ? "active" : ""}" data-task-workspace-tab="${item}">${escapeHtml(item)}</button>`).join("")}</div>
  <div class="ticket-workspace-detail-body">${taskWorkspaceTabContent(task, safeTab)}</div>`;
}

function taskExecutionSnapshot(task) {
  const remaining = taskRemainingDays(task);
  const info = [
    ["Status", taskStatusLabel(task), "tasks", `<span class="badge ${taskStatusBadge(task)}">${escapeHtml(taskStatusLabel(task))}</span>`],
    ["Priority", labelize(task.priority || "Medium"), "warning", `<span class="badge ${taskPriorityBadge(task)}">${escapeHtml(labelize(task.priority || "Medium"))}</span>`],
    ["Owner", look("users", task.ownerId) || "No owner", "user"],
    ["Assigned To", look("users", task.assignedToId) || "Unassigned", "user"],
    ["Due Date", task.dueDate || "Not scheduled", "calendar"],
    ["Progress", `${Number(task.progress || taskProgressFromSubtasks(task) || 0)}%`, "chart"],
    ["Remaining", remaining === null ? "Not scheduled" : remaining < 0 ? tpl("{n} overdue", { n: Math.abs(remaining) }) : remaining === 0 ? "Due today" : tpl("{n} days", { n: remaining }), "calendar"]
  ];
  return `<section class="task-execution-panel">
    <div class="task-execution-head"><p class="eyebrow">Execution Snapshot</p><h4>${escapeHtml(task.title || "Task")}</h4><p class="muted">Owner, assignment, due date, progress, and remaining time for the selected task.</p></div>
    <div class="task-key-info-row">${info.map(([label, value, iconName, htmlValue]) => `<article class="task-key-info-card"><span>${icon(iconName)}</span><div><small>${escapeHtml(label)}</small><strong>${htmlValue || escapeHtml(value)}</strong></div></article>`).join("")}</div>
  </section>`;
}

function taskActionsPanel(task) {
  const primary = [["start", "Start"], ["complete", "Complete"], ["assign", "Assign"]];
  const secondary = [["pause", "Pause Task"], ["cancel", "Cancel Task"], ["duplicate", "Duplicate Task"], ["ticket", "Convert to Ticket"], ["reminder", "Set Reminder"], ["subtask", "Add Subtask"]];
  return `<section class="surface-card task-actions-panel"><div class="task-action-row">
    <div class="task-action-primary">${primary.map(([workflow, label]) => `<button class="btn ${workflow === "complete" ? "btn-primary" : "btn-secondary"}" data-task-workflow="${task.id}" data-workflow="${workflow}">${escapeHtml(label)}</button>`).join("")}${has("tasks", "edit") ? `<button class="btn btn-secondary" data-edit="tasks" data-id="${task.id}">${icon("edit")}Edit</button>` : ""}</div>
    <details class="task-secondary-actions"><summary>More</summary><div>${secondary.map(([workflow, label]) => `<button class="btn btn-secondary" data-task-workflow="${task.id}" data-workflow="${workflow}">${escapeHtml(label)}</button>`).join("")}${has("tasks", "archive") ? `<button class="btn btn-warning" data-task-workflow="${task.id}" data-workflow="archive">Archive</button><button class="btn btn-danger" data-trash="tasks" data-id="${task.id}">Delete</button>` : ""}${comingSoonButton("Export")}</div></details>
  </div></section>`;
}

function taskWorkspaceTabContent(task, tab) {
  if (tab === "Overview") return taskOverviewTab(task);
  if (tab === "Subtasks") return taskSubtasksTab(task);
  if (tab === "Notes") return taskNotesTab(task);
  if (tab === "Related Records") return taskRelatedRecordsTab(task);
  if (tab === "Files" || tab === "Attachments") return taskFilesTab(task);
  if (tab === "Timeline") return taskTimelineTab(task);
  return taskOverviewTab(task);
}

function taskOverviewTab(task) {
  const card = (title, fields) => `<section class="surface-card workspace-overview-card task-overview-card"><div class="section-title"><div><p class="eyebrow">Task</p><h3>${escapeHtml(title)}</h3></div></div><div class="detail-grid">${fields.map(([label, value]) => `<div class="detail-field"><small>${escapeHtml(label)}</small><strong>${String(value).includes("<span") ? value : escapeHtml(value || "-")}</strong></div>`).join("")}</div></section>`;
  return `<div class="task-overview-grid">
    ${card("Description", [["Summary", task.description || task.notes || "No description"], ["Task Number", task.taskNumber || task.id], ["Type", task.taskType || task.type || "Personal"], ["Created By", look("users", task.createdBy)]])}
    ${card("Schedule Context", [["Start Date", task.startDate], ["Reminder", task.reminder || task.reminderStatus], ["Duration", taskDuration(task)], ["Latest Activity", latestTaskActivity(task)]])}
    ${card("Recurrence", [["Recurring", taskIsRecurring(task) ? "Yes" : "No"], ["Pattern", task.recurrence || "One Time"], ["Estimated Time", task.estimatedHours ? `${task.estimatedHours}h` : ""], ["Actual Time", task.actualHours ? `${task.actualHours}h` : ""]])}
    ${card("Linked Work", [["Linked Record", relatedRecordLabel(task) || "None"], ["Department", look("departments", task.departmentId)], ["Files", String((state.db.attachments || []).filter((item) => item.entityType === "task" && item.entityId === task.id).length)], ["Notes", task.notes ? "Available" : "None"]])}
  </div>`;
}

function taskFilesTab(task) {
  return `<section class="surface-card task-files-panel"><div class="section-title"><div><p class="eyebrow">Files</p><h3>Task files</h3><p class="muted">Upload and review files related to this task here.</p></div></div>${attachmentsFor("tasks", task)}</section>`;
}

function taskSubtasksTab(task) {
  const subtasks = Array.isArray(task.subtasks) ? task.subtasks : [];
  return `<section class="surface-card task-subtasks-panel"><div class="section-title"><div><p class="eyebrow">Subtasks</p><h3>Checklist and progress</h3><p class="muted">Parent progress reflects completed subtasks.</p></div></div>
    <form class="task-subtask-form" data-task-subtask-form="${task.id}"><input name="title" placeholder="Subtask title" required><select name="ownerId"><option value="">Owner</option>${rows("users").map((user) => `<option value="${user.id}">${escapeHtml(user.name)}</option>`).join("")}</select><input name="dueDate" type="date"><button class="btn btn-primary" type="submit">Add Subtask</button></form>
    <div class="task-subtask-list">${subtasks.map((item) => `<article class="task-subtask-card"><span class="task-check-dot ${["completed", "done"].includes(String(item.status || "").toLowerCase()) ? "done" : ""}">${["completed", "done"].includes(String(item.status || "").toLowerCase()) ? icon("check") : ""}</span><div><strong>${escapeHtml(item.title || "Subtask")}</strong><p class="muted">${escapeHtml(look("users", item.ownerId) || "No owner")} - ${escapeHtml(item.dueDate || "No due date")}</p></div><span class="badge ${badgeClass(item.status)}">${escapeHtml(labelize(item.status || "Pending"))}</span></article>`).join("") || emptyState("No subtasks", "Create subtasks to break work into smaller steps.")}</div>
  </section>`;
}

function taskNotesTab(task) {
  return `<section class="surface-card task-notes-panel"><div class="section-title"><div><p class="eyebrow">Notes</p><h3>Task notes</h3><p class="muted">Capture decisions, updates, blockers, and next steps.</p></div></div><article class="task-note-bubble"><strong>${escapeHtml(look("users", task.updatedBy || task.createdBy || task.ownerId) || "Task owner")}</strong><p>${escapeHtml(task.notes || task.description || "No notes yet.")}</p></article><form class="comment-box" data-task-notes-form="${task.id}"><textarea name="notes" placeholder="Add internal notes, decisions, or progress updates.">${escapeHtml(task.notes || task.description || "")}</textarea><button class="btn btn-primary" type="submit">Save Notes</button></form></section>`;
}

function taskRelatedRecordsTab(task) {
  const related = taskRelatedRecords(task);
  return `<div class="collection-grid task-related-grid">${related.map((item) => `<article class="record-card task-linked-card"><div class="record-card-head"><div class="record-icon">${icon(item.type)}</div><div><strong>${escapeHtml(primaryTitle(item.type, item.row))}</strong><span>${escapeHtml(displayLabel(item.type))}</span></div></div><button class="btn btn-secondary" data-open-module="${item.type}" data-open-id="${item.row.id}">Open</button></article>`).join("") || emptyState("No related records", "Link tickets, assets, contracts, vendors, people, documents, forms, or knowledge articles.")}</div>`;
}

function taskTimelineTab(task) {
  const events = state.db.timeline.filter((item) => item.entityId === task.id && ["tasks", "task"].includes(item.entityType)).sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
  return `<div class="ticket-activity-feed task-timeline-feed">${events.map((event) => `<article class="ticket-activity-item task-timeline-card"><span class="ticket-activity-icon">${icon("timeline")}</span><div><strong>${escapeHtml(taskTimelineMessage(event))}</strong><small>${escapeHtml(look("users", event.actorUserId) || "System")} - ${new Date(event.createdAt).toLocaleString()}</small></div></article>`).join("") || emptyState("No timeline yet", "Task activity will appear here.")}</div>`;
}

function taskTimelineMessage(event) {
  const raw = String(event.title || event.description || "").toLowerCase();
  if (raw.includes("assign")) return "Assigned to " + (event.assignedToName || "a user");
  if (raw.includes("status")) return "Status changed";
  if (raw.includes("complete")) return "Task completed";
  if (raw.includes("cancel")) return "Task cancelled";
  if (raw.includes("subtask")) return "Subtask added";
  if (raw.includes("reminder")) return "Reminder set";
  if (raw.includes("recurring")) return "Recurring task generated";
  if (raw.includes("attachment") || raw.includes("upload")) return "Attachment uploaded";
  if (raw.includes("create")) return "Task created";
  return readableEventTitle(event);
}

function taskRelatedRecords(task) {
  const linked = [];
  const add = (type, row) => { if (row && !linked.some((item) => item.type === type && item.row.id === row.id)) linked.push({ type, row }); };
  const map = { ticket: "tickets", tickets: "tickets", asset: "assets", assets: "assets", contract: "contracts", contracts: "contracts", vendor: "vendors", vendors: "vendors", employee: "employees", person: "employees", people: "employees", document: "documents", documents: "documents", knowledge_base: "knowledge_base", knowledge: "knowledge_base", form: "form_templates", forms: "form_templates" };
  const type = map[task.relatedType] || map[String(task.relatedType || "").toLowerCase()];
  if (type) add(type, rows(type).find((row) => row.id === task.relatedId));
  taskArray(task.relatedIds).forEach((idValue) => ["tickets", "assets", "contracts", "vendors", "employees", "documents", "knowledge_base", "form_templates"].forEach((typeName) => add(typeName, rows(typeName).find((row) => row.id === idValue))));
  return linked;
}

function taskArray(value) {
  if (Array.isArray(value)) return value;
  if (!value) return [];
  return String(value).split(",").map((item) => item.trim()).filter(Boolean);
}

function taskStatusOptions() { return ["pending", "in_progress", "waiting", "completed", "cancelled", "archived"]; }
function taskPriorityOptions() { return ["low", "medium", "high", "critical"]; }
function taskStatusValue(task) { return String(task.status || "Pending").toLowerCase().replace(/\s+/g, "_"); }
function taskPriorityValue(task) { return String(task.priority || "Medium").toLowerCase(); }
function taskStatusLabel(task) { return labelize(taskStatusValue(task)); }
function taskStatusBadge(task) { return ({ pending: "neutral", in_progress: "info", waiting: "warning", completed: "success", cancelled: "danger", archived: "muted" })[taskStatusValue(task)] || badgeClass(task.status); }
function taskPriorityBadge(task) { return ({ low: "info", medium: "warning", high: "danger", critical: "critical" })[taskPriorityValue(task)] || badgeClass(task.priority); }
function taskIsClosed(task) { return ["completed", "done", "cancelled", "archived"].includes(taskStatusValue(task)) || task.archivedAt; }
function taskIsOverdueEnterprise(task) { return Boolean(task.dueDate) && task.dueDate < today() && !taskIsClosed(task); }
function taskIsRecurring(task) { return !["", "one time", "one_time", "none"].includes(String(task.recurrence || "One Time").toLowerCase()); }
function taskRemainingDays(task) { if (!task.dueDate) return null; return Math.ceil((new Date(`${task.dueDate}T00:00:00`) - new Date(`${today()}T00:00:00`)) / 86400000); }
function taskProgressFromSubtasks(task) { const items = Array.isArray(task.subtasks) ? task.subtasks : []; return items.length ? Math.round((items.filter((item) => ["completed", "done"].includes(String(item.status || "").toLowerCase())).length / items.length) * 100) : 0; }
function taskDuration(task) { if (!task.startedAt || !task.completedAt) return "-"; return `${Math.max(0, Math.round((new Date(task.completedAt) - new Date(task.startedAt)) / 3600000))}h`; }
function latestTaskActivity(task) { const event = state.db.timeline.find((item) => item.entityId === task.id && ["tasks", "task"].includes(item.entityType)); return event ? relativeTime(event.createdAt) : "No activity"; }
function relatedRecordLabel(task) { const related = taskRelatedRecords(task)[0]; return related ? `${displayLabel(related.type)}: ${primaryTitle(related.type, related.row)}` : ""; }

function compactCard(name, row) {
  return `
    <article class="compact-card" data-view="${name}" data-id="${row.id}">
      <div class="compact-top"><strong>${name === "tasks" && isEmployeeUser() ? `${taskStatusIndicator(row)}${escapeHtml(primaryTitle(name, row))}${taskRecurrenceIndicator(row)}` : escapeHtml(primaryTitle(name, row))}</strong><span class="compact-badges"><span class="badge ${badgeClass(row.priority || row.status)}">${escapeHtml(row.priority || row.status || "open")}</span>${name === "tasks" && isEmployeeUser() ? taskDueBadge(row) : ""}</span></div>
      <p>${escapeHtml(secondaryTitle(name, row))}</p>
      <div class="compact-meta"><span>${escapeHtml(look("users", row.assignedToId || row.ownerId) || look("employees", row.requesterId) || row.category || "")}</span><span>${escapeHtml(row.dueDate || row.ticketNumber || row.assetNumber || "")}</span></div>
    </article>
  `;
}

function tablePage(name) {
  const data = collection(name);
  const paged = paginate(name, data);
  const visible = visibleColumns(name);
  return `
    ${toolbar(name, { subtitle: "Focused list view with sorting, filters, pagination, export, and column control.", filter: "status" })}
    <div class="table-wrap">
      <div class="table-scroll">
        <table>
          <thead><tr>${visible.map((col) => `<th class="sortable" data-sort="${name}" data-key="${col}">${escapeHtml(labelize(col))} ${sortMark(name, col)}</th>`).join("")}<th>Actions</th></tr></thead>
          <tbody>${paged.items.map((row) => tableRow(name, row, visible)).join("") || `<tr><td colspan="${visible.length + 1}">${emptyState("No records found", "Try another search or filter.")}</td></tr>`}</tbody>
        </table>
      </div>
      ${pager(name, data.length, paged)}
    </div>
  `;
}

function tableRow(name, row, visible = columns[name]) {
  return `<tr>${visible.map((col) => `<td>${cell(name, row, col)}</td>`).join("")}<td class="actions">${rowActions(name, row)}</td></tr>`;
}

function rowActions(name, row) {
  return `
    <button class="btn btn-secondary" data-view="${name}" data-id="${row.id}">${t("view")}</button>
    ${has(name, "edit") && schemas[name] ? `<button class="btn btn-secondary" data-edit="${name}" data-id="${row.id}">${t("edit")}</button>` : ""}
    ${has(name, "archive") && schemas[name] ? `<button class="btn btn-danger" data-archive="${name}" data-id="${row.id}">${t("archive")}</button>` : ""}
    ${has(name, "archive") && schemas[name] ? `<button class="btn btn-danger" data-trash="${name}" data-id="${row.id}">Delete</button>` : ""}
  `;
}

function auditFeed() {
  const data = collection("audit_logs");
  return `
    ${toolbar("audit_logs", { eyebrow: "Compliance feed", subtitle: "Audit history is shown as an activity stream instead of a tiring log table." })}
    <div class="audit-feed">${data.map((log) => `
      <article class="audit-card">
        <div class="audit-mark">${icon("audit_logs")}</div>
        <div>
          <div class="audit-line"><strong>${escapeHtml(look("users", log.userId) || "System")}</strong> <span>${escapeHtml(log.action)}</span> <strong>${escapeHtml(log.entityType)}</strong></div>
          <p class="muted">${escapeHtml(log.entityId || "system")} | ${escapeHtml(log.ipAddress || "local")} | ${new Date(log.createdAt).toLocaleString()}</p>
          <details><summary>Change payload</summary><pre>${escapeHtml(JSON.stringify({ old: log.oldValue, new: log.newValue }, null, 2))}</pre></details>
        </div>
      </article>`).join("") || emptyState("No audit events", "Changes will appear here as cards.")}
    </div>
  `;
}

function timelineFeed(name = "timeline") {
  const data = name === "transfers" ? collection("transfers").map(transferToEvent) : state.db.timeline.filter((event) => JSON.stringify(event).toLowerCase().includes([state.globalQuery, state.query].join(" ").toLowerCase()));
  return `
    ${toolbar(name, { eyebrow: name === "transfers" ? "Lifecycle feed" : "Activity feed", subtitle: name === "transfers" ? "Asset movement history is presented as a readable lifecycle stream." : "System activity grouped into calm, scannable cards." })}
    <div class="timeline-feed">${data.map(eventCard).join("") || emptyState("No activity yet", "Activity will appear here as the platform changes.")}</div>
  `;
}

function transferToEvent(row) {
  return {
    id: row.id,
    title: `${row.movementType} | ${look("assets", row.assetId)}`,
    description: `${row.from || "Unknown"} to ${row.to || "Unknown"} | ${row.notes || ""}`,
    entityType: "transfers",
    entityId: row.id,
    severity: badgeClass(row.condition) || "info",
    actorUserId: row.performedBy,
    createdAt: row.date
  };
}

function eventCard(event) {
  const title = readableEventTitle(event);
  const description = readableEventDescription(event);
  return `
    <article class="timeline-card">
      <div class="timeline-meta"><span class="badge ${event.severity}">${escapeHtml(event.entityType)}</span><span>${new Date(event.createdAt).toLocaleString()}</span></div>
      <strong>${escapeHtml(title)}</strong>
      <p class="muted">${escapeHtml(description)}</p>
      <small>${escapeHtml(look("users", event.actorUserId) || "System")}</small>
    </article>
  `;
}

function readableEventTitle(event) {
  const raw = String(event.title || "").toLowerCase();
  const entity = labelize(singular(event.entityType || "record"));
  if (raw.includes("status")) return "Status changed";
  if (raw.includes("assign")) return "Assignment updated";
  if (raw.includes("comment")) return "Comment added";
  if (raw.includes("attachment") || raw.includes("upload")) return "Attachment uploaded";
  if (raw.includes("archive")) return tpl("{entity} archived", { entity });
  if (raw.includes("trash") || raw.includes("delete")) return tpl("{entity} moved to trash", { entity });
  if (raw.includes("restore")) return tpl("{entity} restored", { entity });
  if (raw.includes("create") || raw.includes("added")) return tpl("{entity} created", { entity });
  if (raw.includes("update") || raw.includes("edit")) return tpl("{entity} updated", { entity });
  if (raw.includes("maintenance")) return "Asset entered maintenance";
  if (raw.includes("renewal") || raw.includes("contract")) return "Contract reminder";
  if (!event.title) return tpl("{entity} activity", { entity });
  // Titles like "login users" are an action plus a module; neither half is in
  // the dictionary as a pair, so translate the words individually.
  const label = labelize(event.title);
  const translated = trText(label);
  if (translated !== label) return translated;
  return label.split(" ").map((word) => trText(word)).join(" ");
}

function readableEventDescription(event) {
  const description = String(event.description || "").trim();
  if (!description) return "Activity recorded in the command center.";
  if (description.startsWith("{") || description.startsWith("[")) return "Change details are available in Audit Feed.";
  return description.replace(/\s*\|\s*/g, " - ");
}

function rolesPage() {
  return `
    ${toolbar("roles", { subtitle: "Future-ready permission matrix with shadcn-style controls." })}
    <div class="grid two">
      <div class="collection-grid single">${rows("roles").map((role) => collectionCard("roles", role)).join("")}</div>
      <section class="surface-card permission-grid">
        <div class="section-title"><div><p class="eyebrow">RBAC</p><h3>Permission matrix</h3></div></div>
        <table>
          <thead><tr><th>Role</th><th>Module</th>${perms.map((perm) => `<th>${perm}</th>`).join("")}</tr></thead>
          <tbody>${rows("roles").flatMap((role) => modules.map((module) => `
            <tr><td>${escapeHtml(role.name)}</td><td>${escapeHtml(module)}</td>${perms.map((perm) => `<td><input type="checkbox" disabled ${role.permissions?.[module]?.[perm] ? "checked" : ""}></td>`).join("")}</tr>`)).join("")}</tbody>
        </table>
      </section>
    </div>
  `;
}

function settingsPage() {
  const canManageTicketAssignment = ["role_manager", "role_admin"].includes(state.user?.roleId);
  const canViewOwnAssignmentGroups = state.user?.roleId === "role_staff";
  const tabs = [
    ["general", "General"],
    ...(has("settings", "view") ? [["administration", "Administration"]] : []),
    ...(canManageTicketAssignment ? [["ticket_assignment", "Ticket Assignment"]] : []),
    ...(canManageTicketAssignment || canViewOwnAssignmentGroups ? [["assignment_groups", canManageTicketAssignment ? "Assignment Groups" : "My Assignment Groups"]] : []),
    ["lookup_management", "Lookup Management"],
    ["appearance", "Appearance"],
    ["system", "System"]
  ];
  if (!tabs.some(([id]) => id === state.settingsTab)) state.settingsTab = "general";
  const active = state.settingsTab || "general";
  return `
    ${workspaceIdentityHeader("settings")}
    <section class="settings-workspace">
      <nav class="settings-tabs" aria-label="Settings sections">
        ${tabs.map(([id, label]) => `<button type="button" class="${active === id ? "active" : ""}" data-settings-tab="${id}">${escapeHtml(label)}</button>`).join("")}
      </nav>
      <div class="settings-tab-panel">
        ${active === "administration" ? administrationSettingsPanel() : active === "ticket_assignment" ? ticketAssignmentSettingsPanel() : active === "assignment_groups" ? assignmentGroupsSettingsPanel() : active === "lookup_management" ? lookupManagementSettingsPanel() : active === "appearance" ? appearanceSettingsPanel() : active === "system" ? systemSettingsPanel() : generalSettingsPanel()}
      </div>
    </section>
  `;
}

function administrationSettingsPanel() {
  const cards = [
    ["users", "User Accounts", "Manage login accounts, service accounts, disabled accounts, and account access.", "page"],
    ["roles", "Roles & Permissions", "Review the V1 role permission matrix.", "page"],
    ["ticket_assignment", "Ticket Assignment", "Configure category routing, fallback assignment, and auto-assignment behavior.", "settings"],
    ["assignment_groups", "Assignment Groups", "Manage IT teams used by ticket routing.", "settings"],
    ["lookup_management", "Lookup Management", "Manage dropdown values used across operational forms.", "settings"],
    ["form_templates", "Form Templates", "Maintain reusable document and request templates.", "page"],
    ["audit_logs", "System Audit", "Review technical audit history for compliance.", "page"],
    ["archive_center", "Archive", "Restore inactive retained records.", "page"],
    ["trash", "Trash", "Restore or permanently remove deleted records where allowed.", "page"],
    ["attachments", "Global Attachments", "Admin search for file metadata; daily attachment work remains record-level.", "page"],
    ["appearance", "Appearance", "Review current language and theme settings.", "settings"],
    ["system", "System", "Review V1 system posture and operational guardrails.", "settings"]
  ];
  const visibleCards = cards.filter(([id, , , type]) => type === "settings" ? settingsSectionVisible(id) : canViewPage(id));
  return `
    <section class="surface-card settings-section-card">
      <div class="section-title">
        <div><p class="eyebrow">Administration</p><h3>Admin and system areas</h3><p class="muted">Administrative modules live here so daily navigation stays focused on operational work.</p></div>
      </div>
      <div class="collection-grid settings-summary-grid">
        ${visibleCards.map(([id, title, body, type]) => `
          <article class="record-card">
            <div class="record-card-head">
              <div class="record-icon">${icon(id === "ticket_assignment" || id === "appearance" || id === "system" ? "settings" : id)}</div>
              <div><strong>${escapeHtml(title)}</strong><span>${escapeHtml(body)}</span></div>
            </div>
            <div class="record-card-actions">
              <button class="btn btn-secondary" ${type === "settings" ? `data-settings-tab="${escapeHtml(id)}"` : `data-page-jump="${escapeHtml(id)}"`}>Open</button>
            </div>
          </article>
        `).join("") || emptyState("No administration areas", "Your role does not include access to administration modules.")}
      </div>
    </section>
  `;
}

function settingsConfigCard(id, title, body, actionLabel = "Open", type = "settings") {
  const action = type === "settings"
    ? `data-settings-tab="${escapeHtml(id)}"`
    : `data-page-jump="${escapeHtml(id)}"`;
  return `
    <article class="record-card settings-config-card">
      <div class="record-card-head">
        <div class="record-icon">${icon(id === "ticket_assignment" || id === "appearance" || id === "system" ? "settings" : id)}</div>
        <div><strong>${escapeHtml(title)}</strong><span>${escapeHtml(body)}</span></div>
      </div>
      <div class="record-card-actions"><button class="btn btn-secondary" ${action}>${escapeHtml(actionLabel)}</button></div>
    </article>
  `;
}

function settingsSectionVisible(id) {
  if (id === "ticket_assignment") return ["role_manager", "role_admin"].includes(state.user?.roleId);
  if (id === "assignment_groups") return ["role_manager", "role_admin", "role_staff"].includes(state.user?.roleId);
  if (id === "lookup_management") return has("lookup_items", "view");
  if (id === "appearance" || id === "system" || id === "administration") return has("settings", "view");
  return false;
}

function generalSettingsPanel() {
  const sections = [
    ["administration", "Administration", "User accounts, roles, audit, archive, trash, templates, and global attachment administration.", "Open", "settings"],
    ["ticket_assignment", "Ticket Assignment", "Configure auto-assignment, strategy, fallback assignee, and category routing.", "Configure", "settings"],
    ["assignment_groups", "Assignment Groups", "Manage IT teams that can receive routed tickets.", "Configure", "settings"],
    ["lookup_management", "Lookup Management", "Maintain dropdown values used across operational forms.", "Manage", "settings"],
    ["appearance", "Appearance", "Review current language and theme settings.", "Open", "settings"],
    ["system", "System", "View system configuration surfaces and administrative utilities.", "Open", "settings"]
  ].filter(([id]) => settingsSectionVisible(id));
  return `
    <section class="surface-card settings-section-card settings-console-panel">
      <div class="section-title">
        <div>
          <p class="eyebrow">General</p>
          <h3>Configuration areas</h3>
          <p class="muted">Choose the area you want to configure. Settings is an admin console, so daily operational work stays in the main workspaces.</p>
        </div>
      </div>
      <div class="collection-grid settings-summary-grid">
        ${sections.map(([id, title, body, actionLabel, type]) => settingsConfigCard(id, title, body, actionLabel, type)).join("")}
      </div>
    </section>
  `;
}

function systemSettingsPanel() {
  const cards = [
    ["users", "User Accounts", "Manage login and service accounts.", "Open", "page"],
    ["roles", "Roles & Permissions", "Review role access and permission coverage.", "Open", "page"],
    ["audit_logs", "Audit", "Open technical audit history for compliance review.", "Open", "page"],
    ["archive_center", "Archive", "Restore retained inactive records.", "Open", "page"],
    ["trash", "Trash", "Restore or permanently remove deleted records where allowed.", "Open", "page"],
    ["attachments", "Global Attachments", "Search attachment metadata when record-level access is not enough.", "Open", "page"]
  ].filter(([id]) => canViewPage(id));
  return `
    <section class="surface-card settings-section-card">
      <div class="section-title">
        <div><p class="eyebrow">System</p><h3>System administration</h3><p class="muted">Open administrative utilities and protected system areas. Operational controls remain in their owning modules.</p></div>
      </div>
      <div class="settings-system-grid">
        ${cards.map(([id, title, body, actionLabel, type]) => settingsConfigCard(id, title, body, actionLabel, type)).join("") || emptyState("No system areas", "Your role does not include access to system administration.")}
      </div>
    </section>
  `;
}

function appearanceSettingsPanel() {
  return `
    <section class="surface-card settings-section-card">
      <div class="section-title">
        <div><p class="eyebrow">Appearance</p><h3>Workspace appearance</h3><p class="muted">Appearance preferences are available from the global header and user Preferences. This section keeps the Settings workspace organized for V1.</p></div>
      </div>
      <div class="settings-system-grid">
        <article class="record-card"><div class="record-card-head"><div class="record-icon">${icon("sun")}</div><div><strong>Theme</strong><span>Current mode: ${escapeHtml(labelize(state.theme || "system"))}</span></div></div></article>
        <article class="record-card"><div class="record-card-head"><div class="record-icon">${icon("settings")}</div><div><strong>Language</strong><span>Current language: ${state.lang === "ar" ? "Arabic" : "English"}</span></div></div></article>
      </div>
    </section>
  `;
}

function lookupManagementSettingsPanel() {
  const lookups = rows("lookup_items");
  const grouped = [...new Set(lookups.map((item) => item.type))].sort();
  return `
    <section class="surface-card lookup-manager">
      <div class="section-title">
        <div><p class="eyebrow">Admin configuration</p><h3>Lookup Management</h3><p class="muted">Manage dropdown values used by tickets, tasks, assets, employees, contracts, vendors, documents, forms, and knowledge base articles.</p></div>
        ${has("lookup_items", "create") ? `<button class="btn btn-primary" data-add="lookup_items">${icon("plus")}Add lookup value</button>` : ""}
      </div>
      <div class="lookup-groups">
        ${grouped.map((type) => `
          <article class="lookup-group">
            <div class="lookup-group-head"><strong>${escapeHtml(labelize(type))}</strong><span>${lookups.filter((item) => item.type === type && item.active !== false).length} active</span></div>
            <div class="lookup-chips">
              ${lookups.filter((item) => item.type === type).sort((a, b) => Number(a.sortOrder || 0) - Number(b.sortOrder || 0)).map((item) => `
                <div class="lookup-chip ${item.active === false ? "inactive" : ""}">
                  <span class="lookup-dot" style="background:${escapeHtml(item.color || "#64748b")}"></span>
                  <span>${escapeHtml(lookupLabel(item))}</span>
                  <small>${escapeHtml(item.code || "")}</small>
                  ${has("lookup_items", "edit") ? `<button class="icon-mini" data-lookup-move="up" data-id="${item.id}" title="Move up">&uarr;</button><button class="icon-mini" data-lookup-move="down" data-id="${item.id}" title="Move down">&darr;</button>` : ""}
                  ${has("lookup_items", "edit") ? `<button class="icon-mini" data-edit="lookup_items" data-id="${item.id}" title="Edit">${icon("settings")}</button>` : ""}
                  ${has("lookup_items", "archive") ? `<button class="icon-mini" data-archive="lookup_items" data-id="${item.id}" title="Archive">${icon("archive_center")}</button>` : ""}
                </div>
              `).join("")}
            </div>
          </article>
        `).join("") || emptyState("No lookup values", "Add values to power configurable dropdowns.")}
      </div>
    </section>
  `;
}

// Shared save-state indicator for editable forms: "Unsaved changes" / "Saving..." /
// "Saved" / "Not saved", per design system section 15.
const formSaveStateText = {
  dirty: "Unsaved changes",
  saving: "Saving...",
  saved: "Saved",
  error: "Not saved"
};

function setFormSaveState(node, state) {
  if (!node) return;
  const label = formSaveStateText[state];
  node.textContent = label ? trText(label) : "";
  node.dataset.state = label ? state : "";
  if (state === "saved") {
    window.clearTimeout(node.dataset.timer);
    node.dataset.timer = String(window.setTimeout(() => {
      if (node.dataset.state === "saved") setFormSaveState(node, "");
    }, 4000));
  }
}

// Markup for the shared indicator. Every editable form uses this one component so
// "Unsaved changes" looks and reads the same everywhere.
function formSaveStateHtml(state = "") {
  const label = formSaveStateText[state];
  return `<p class="form-save-state" data-save-state${state ? ` data-state="${state}"` : ""} role="status" aria-live="polite">${label ? escapeHtml(trText(label)) : ""}</p>`;
}

// Marks a form dirty as soon as it is edited, so the indicator never lies.
function wireFormSaveState(form) {
  if (!form) return null;
  const node = $("[data-save-state]", form);
  if (!node) return null;
  const markDirty = () => {
    form.dataset.dirty = "true";
    setFormSaveState(node, "dirty");
  };
  form.addEventListener("input", markDirty);
  form.addEventListener("change", markDirty);
  return node;
}

// render() paints a skeleton and fills #content inside afterPaint(), which replaces
// the form markup - so the "Saved" flash has to be queued behind that.
function flashFormSaved(formSelector) {
  afterPaint(() => afterPaint(() => {
    const form = $(formSelector);
    if (form) setFormSaveState($("[data-save-state]", form), "saved");
  }));
}

// Runs a save and reports it through the shared indicator.
async function runFormSave(form, save) {
  const node = $("[data-save-state]", form);
  const submit = $("button[type='submit']", form);
  const submitLabel = submit?.textContent || "";
  setFormSaveState(node, "saving");
  if (submit) {
    submit.disabled = true;
    submit.textContent = trText("Saving...");
  }
  try {
    await save();
    form.dataset.dirty = "false";
    return true;
  } catch (error) {
    setFormSaveState(node, "error");
    if (submit) {
      submit.disabled = false;
      submit.textContent = submitLabel;
    }
    throw error;
  }
}

// One line telling an admin how much of the taxonomy is actually routed, so gaps are
// visible without opening all six groups.
function assignmentCoverageSummary(settings, parents) {
  const routeFor = (code) => settings.categoryRoutes?.[code] || (settings.categoryAssignees?.[code] ? { type: "user", id: settings.categoryAssignees[code] } : null);
  const routedParents = parents.filter((parent) => routeFor(parent.code)).length;
  const overrides = parents.reduce((total, parent) => total + ticketCategoryChildren(parent.code).filter((child) => routeFor(child.code)).length, 0);
  const parts = [tpl("{routed} of {total} main categories routed", { routed: routedParents, total: parents.length })];
  if (overrides) parts.push(tpl(overrides === 1 ? "{n} subcategory override" : "{n} subcategory overrides", { n: overrides }));
  if (!settings.enabled) parts.push(trText("Auto assignment is off"));
  else if (!routedParents && !overrides) parts.push(trText("No rules yet — every ticket uses the fallback"));
  return parts.join(" · ");
}

function ticketAssignmentSettingsPanel() {
  if (!["role_manager", "role_admin"].includes(state.user?.roleId)) return "";
  const settings = { enabled: false, strategy: "manual", categoryAssignees: {}, categoryRoutes: {}, fallbackAssigneeId: "", ...(state.db.settings?.ticketAssignment || {}) };
  const users = rows("users").filter((user) => ["role_staff", "role_manager"].includes(user.roleId));
  const groups = rows("assignmentGroups").filter((group) => group.active !== false && group.canReceiveTickets !== false);
  const parents = ticketCategoryParents();
  const assigneeOptions = (selected = "") => `<option value="">Use fallback</option>${users.map((user) => `<option value="${user.id}" ${selected === user.id ? "selected" : ""}>${escapeHtml(user.name)} (${escapeHtml(look("roles", user.roleId) || "IT")})</option>`).join("")}`;
  const routeValue = (code) => {
    const route = settings.categoryRoutes?.[code] || null;
    if (route?.type && route.id) return `${route.type}:${route.id}`;
    const userId = settings.categoryAssignees?.[code] || "";
    return userId ? `user:${userId}` : "";
  };
  const routeOptions = (selected = "", inheritLabel = "") => `
    <option value="" ${!selected ? "selected" : ""}>${escapeHtml(inheritLabel || "Use fallback")}</option>
    <optgroup label="Specific user">
      ${users.map((user) => `<option value="user:${user.id}" ${selected === `user:${user.id}` ? "selected" : ""}>${escapeHtml(user.name)} (${escapeHtml(look("roles", user.roleId) || "IT")})</option>`).join("")}
    </optgroup>
    <optgroup label="Assignment group">
      ${groups.map((group) => `<option value="group:${group.id}" ${selected === `group:${group.id}` ? "selected" : ""}>${escapeHtml(group.name)} (${escapeHtml(group.assignmentMethod || "Least Open Tickets")})</option>`).join("")}
    </optgroup>
  `;
  const routeSummary = (value) => {
    if (!value) return "";
    const [type, routeId] = value.split(":");
    if (type === "user") return look("users", routeId) || routeId;
    if (type === "group") return look("assignmentGroups", routeId) || routeId;
    return "";
  };
  const strategyOptions = [
    ["manual", "Manual Only"],
    ["category", "By Category"],
    ["least_open", "Least Open Tickets"],
    ["round_robin", "Round Robin"]
  ];
  return `
    <section class="surface-card ticket-assignment-settings">
      <div class="section-title">
        <div>
          <p class="eyebrow">Ticket Assignment</p>
          <h3>Auto assignment routing</h3>
          <p class="muted">Automatically route new employee tickets to the right IT user based on category, workload, or fallback rules.</p>
        </div>
      </div>
      <form class="settings-form ticket-assignment-form" data-ticket-assignment-form>
        <div class="ticket-assignment-basics">
          <label class="checkbox-field"><span>Enable Auto Assignment</span><input name="enabled" type="checkbox" value="true" ${settings.enabled ? "checked" : ""}></label>
          <label>Assignment Strategy<select name="strategy">${strategyOptions.map(([value, label]) => `<option value="${value}" ${settings.strategy === value ? "selected" : ""}>${label}</option>`).join("")}</select></label>
          <label>Fallback Assignee<select name="fallbackAssigneeId">${assigneeOptions(settings.fallbackAssigneeId)}</select><small class="field-help">Used when no category rule or active IT Staff match is available.</small></label>
        </div>
        <div class="assignment-map">
          <div class="assignment-map-head">
            <div><strong>Category Assignment Rules</strong><span class="muted">Set an owner per main category, then override individual subcategories only where they differ. Subcategories left on "Inherit" follow their main category.</span></div>
            <p class="assignment-coverage">${escapeHtml(assignmentCoverageSummary(settings, parents))}</p>
          </div>
          ${parents.map((parent) => {
            const parentValue = routeValue(parent.code);
            const children = ticketCategoryChildren(parent.code);
            const overrides = children.filter((child) => routeValue(child.code)).length;
            return `
              <details class="assignment-category-group" ${overrides ? "open" : ""}>
                <summary class="assignment-rule-row assignment-rule-parent">
                  <span><strong>${escapeHtml(lookupLabel(parent))}</strong><small>${escapeHtml([
                    tpl(children.length === 1 ? "{n} subcategory" : "{n} subcategories", { n: children.length }),
                    overrides ? tpl(overrides === 1 ? "{n} override" : "{n} overrides", { n: overrides }) : ""
                  ].filter(Boolean).join(" · "))}</small></span>
                  <select name="categoryRoute:${escapeHtml(parent.code)}" data-assignment-parent="${escapeHtml(parent.code)}">${routeOptions(parentValue)}</select>
                </summary>
                <div class="assignment-subcategories">
                  ${children.map((child) => `
                    <label class="assignment-rule-row assignment-rule-child">
                      <span>${escapeHtml(lookupLabel(child))}</span>
                      <select name="categoryRoute:${escapeHtml(child.code)}">${routeOptions(routeValue(child.code), parentValue ? tpl("Inherit — {owner}", { owner: routeSummary(parentValue) }) : trText("Inherit — use fallback"))}</select>
                    </label>
                  `).join("") || `<p class="muted">No subcategories yet. Add them in Lookup Management.</p>`}
                </div>
              </details>
            `;
          }).join("")}
        </div>
        <div class="settings-actions ticket-assignment-actions">
          ${formSaveStateHtml()}
          <button class="btn btn-secondary" type="button" data-reset-ticket-assignment>Reset to Manual Only</button>
          <button class="btn btn-primary" type="submit" data-assignment-submit>Save Ticket Assignment</button>
        </div>
      </form>
    </section>
  `;
}

function assignmentGroupsSettingsPanel() {
  const canManage = ["role_manager", "role_admin"].includes(state.user?.roleId);
  const canViewOwn = state.user?.roleId === "role_staff";
  if (!canManage && !canViewOwn) return "";
  const users = rows("users").filter((user) => ["role_staff", "role_manager"].includes(user.roleId));
  const groups = rows("assignmentGroups");
  const editing = groups.find((group) => group.id === state.assignmentGroupEditingId) || null;
  const groupTypes = ["Service Desk", "Infrastructure", "Applications", "Assets", "Security", "Other"];
  const methods = ["Least Open Tickets", "Round Robin", "Group Lead", "Manual Queue"];
  const userOptions = (selected = "") => `<option value="">Select user</option>${users.map((user) => `<option value="${user.id}" ${selected === user.id ? "selected" : ""}>${escapeHtml(user.name)} (${escapeHtml(look("roles", user.roleId) || "IT")})</option>`).join("")}`;
  const memberOptions = (selected = []) => users.map((user) => `<option value="${user.id}" ${selected.includes(user.id) ? "selected" : ""}>${escapeHtml(user.name)} (${escapeHtml(look("roles", user.roleId) || "IT")})</option>`).join("");
  return `
    <section class="surface-card settings-section-card assignment-groups-settings">
      <div class="section-title">
        <div>
          <p class="eyebrow">Assignment Groups</p>
          <h3>${canManage ? "IT teams for ticket routing" : "Your IT team memberships"}</h3>
          <p class="muted">${canManage ? "Create IT teams that can receive tickets by category while preserving individual assignment and workload rules." : "View the assignment groups where you are a lead or member. Group management is limited to IT Manager and System Admin."}</p>
        </div>
      </div>
      ${canManage ? `
      <form class="settings-form assignment-group-form" data-assignment-group-form>
        <input type="hidden" name="id" value="${escapeHtml(editing?.id || "")}">
        <div class="assignment-group-form-grid">
          <label>Group name<input name="name" required value="${escapeHtml(editing?.name || "")}" placeholder="Infrastructure Team"></label>
          <label>Group type<select name="groupType">${groupTypes.map((type) => `<option value="${type}" ${editing?.groupType === type ? "selected" : ""}>${type}</option>`).join("")}</select></label>
          <label>Group lead<select name="leadUserId">${userOptions(editing?.leadUserId || "")}</select></label>
          <label>Assignment method<select name="assignmentMethod">${methods.map((method) => `<option value="${method}" ${((editing?.assignmentMethod || "Least Open Tickets") === method) ? "selected" : ""}>${method}</option>`).join("")}</select></label>
          <label class="full">Description<textarea name="description" placeholder="What this team owns">${escapeHtml(editing?.description || "")}</textarea></label>
          <label class="full">Members<select name="memberUserIds" multiple size="4">${memberOptions(taskArray(editing?.memberUserIds))}</select><small class="field-help">Use Ctrl/Cmd to select multiple members.</small></label>
        </div>
        <div class="assignment-group-toggles">
          <label class="checkbox-field"><span>Active</span><input name="active" type="checkbox" value="true" ${editing?.active === false ? "" : "checked"}></label>
          <label class="checkbox-field"><span>Can receive tickets</span><input name="canReceiveTickets" type="checkbox" value="true" ${editing?.canReceiveTickets === false ? "" : "checked"}></label>
        </div>
        <div class="settings-actions">
          ${editing ? `<button class="btn btn-secondary" type="button" data-cancel-assignment-group-edit>Cancel edit</button>` : ""}
          <button class="btn btn-primary" type="submit">${editing ? "Save Group" : "Create Group"}</button>
        </div>
      </form>
      ` : ""}
    </section>
    <section class="assignment-groups-list">
      ${groups.map((group) => `
        <article class="record-card assignment-group-card">
          <div class="record-card-head">
            <div class="record-icon">${icon("users")}</div>
            <div><strong>${escapeHtml(group.name)}</strong><span>${escapeHtml(group.groupType || "Other")} | ${escapeHtml(group.assignmentMethod || "Least Open Tickets")}</span></div>
            <span class="badge ${group.active === false ? "muted" : "success"}">${group.active === false ? "Inactive" : "Active"}</span>
          </div>
          <p class="muted">${escapeHtml(group.description || "No description")}</p>
          <div class="assignment-group-meta">
            <span>Lead: <strong>${escapeHtml(look("users", group.leadUserId) || "Not set")}</strong></span>
            <span>Members: <strong>${taskArray(group.memberUserIds).length}</strong></span>
            <span>Tickets: <strong>${group.canReceiveTickets === false ? "No" : "Yes"}</strong></span>
          </div>
          <div class="record-card-actions">
            ${canManage ? `<button class="btn btn-secondary" data-edit-assignment-group="${group.id}">Edit</button><button class="btn btn-secondary" data-archive-assignment-group="${group.id}">${group.active === false ? "Keep Inactive" : "Set Inactive"}</button>` : `<span class="muted">Read-only</span>`}
          </div>
        </article>
      `).join("") || emptyState("No assignment groups", "Create a Service Desk, Infrastructure, Applications, Assets, or Security group.")}
    </section>
  `;
}

function employeeTicketsForCurrentUser(source = collection("tickets")) {
  const employeeId = employeeForUser()?.id || "emp_lina";
  return source.filter((ticket) => ticket.requesterId === employeeId);
}

function employeeAssetsForCurrentUser(source = collection("assets")) {
  const employeeId = employeeForUser()?.id || "emp_lina";
  return source.filter((asset) => asset.currentOwnerId === employeeId || asset.permanentCustodianId === employeeId);
}

function employeeTasksForCurrentUser(source = collection("tasks"), includeCompleted = false) {
  const employee = employeeForUser();
  return source.filter((task) => {
    const mine = task.ownerId === state.user?.id || task.assignedToId === state.user?.id || task.relatedId === employee?.id;
    return mine && (includeCompleted || !isTerminalTask(task));
  });
}

function employeeDocumentsForCurrentUser(source = collection("documents")) {
  const employeeId = employeeForUser()?.id || "";
  const assetIds = new Set(employeeAssetsForCurrentUser(rows("assets")).map((asset) => asset.id));
  return source.filter((doc) => {
    const readableState = ["published", "approved", "signed", "uploaded"].includes(String(doc.status || doc.approvalStatus || "").toLowerCase()) || String(doc.approvalStatus || "").toLowerCase() === "approved";
    const linkedToMe = (doc.linkedType === "employee" && doc.linkedId === employeeId) || (doc.linkedType === "asset" && assetIds.has(doc.linkedId));
    return readableState && (doc.linkedType === "company" || linkedToMe || doc.visibility === "employee" || doc.visibility === "employees");
  });
}

function employeePublishedKnowledge(source = collection("knowledge_base")) {
  return source.filter((article) => article.published !== false && String(article.published || article.status || "published").toLowerCase() !== "draft");
}

function employeePublicTicketComments(ticketId) {
  return (state.db.comments || []).filter((item) => ["tickets", "ticket"].includes(item.entityType) && item.entityId === ticketId && !item.internal);
}

function employeeSelfServiceCard(title, body, page, options = {}) {
  const attrs = options.add ? `data-add="${escapeHtml(options.add)}"` : `data-page-jump="${escapeHtml(page)}"`;
  const count = options.count !== undefined ? `<span class="employee-service-count">${escapeHtml(options.count)}</span>` : "";
  return `
    <button class="employee-service-card" ${attrs}>
      <span class="record-icon">${icon(options.icon || page)}</span>
      <span><strong>${escapeHtml(title)}</strong><small>${escapeHtml(body)}</small></span>
      ${count}
    </button>
  `;
}

function employeePortal() {
  const myAssets = employeeAssetsForCurrentUser(rows("assets"));
  const myTickets = employeeTicketsForCurrentUser(rows("tickets"));
  const myTasks = employeeTasksForCurrentUser(rows("tasks"));
  const myDocuments = employeeDocumentsForCurrentUser(rows("documents"));
  const kbArticles = employeePublishedKnowledge(rows("knowledge_base"));
  const taskWindows = employeeTaskWindows(myTasks);
  const recentTickets = [...myTickets].sort((a, b) => String(b.updatedAt || b.createdAt || "").localeCompare(String(a.updatedAt || a.createdAt || ""))).slice(0, 5);
  return `
    <section class="employee-home-hero surface-card">
      <div><p class="eyebrow">Employee Portal</p><h3>How can IT help today?</h3><p class="muted">Submit a request, check your tickets, see your assigned assets, and find self-service answers without admin tools.</p></div>
      <button class="btn btn-primary" data-add="tickets">${icon("plus")}Submit Request</button>
    </section>
    <div class="employee-service-grid">
      ${employeeSelfServiceCard("Submit Request", "Ask IT for help or request a service.", "tickets", { add: "tickets", icon: "tickets" })}
      ${employeeSelfServiceCard("My Tickets", "Track your requests and public replies.", "tickets", { count: myTickets.length, icon: "tickets" })}
      ${employeeSelfServiceCard("My Assets", "See devices currently assigned to you.", "assets", { count: myAssets.length, icon: "assets" })}
      ${employeeSelfServiceCard("My Tasks", "Review your assigned work and due dates.", "tasks", { count: myTasks.length, icon: "tasks" })}
      ${employeeSelfServiceCard("Documents", "Open company documents you can access.", "documents", { count: myDocuments.length, icon: "documents" })}
      ${employeeSelfServiceCard("Knowledge", "Find published IT guidance.", "knowledge_base", { count: kbArticles.length, icon: "knowledge_base" })}
    </div>
    <div class="employee-home-grid">
      <section class="surface-card command-panel"><div class="section-title"><div><p class="eyebrow">Latest from IT</p><h3>Announcements</h3></div></div><div class="list announcements-list">${(state.db.announcements || []).slice(0, 3).map((item) => `<div class="list-item announcement-card"><span class="announcement-dot"></span><div><strong>${escapeHtml(item.title)}</strong><p class="muted">${escapeHtml(item.body)}</p>${item.publishedAt ? `<small>${new Date(item.publishedAt).toLocaleString()}</small>` : ""}</div></div>`).join("") || emptyState("No announcements", "IT announcements will appear here.")}</div></section>
      <section class="surface-card command-panel"><div class="section-title"><div><p class="eyebrow">Self-service help</p><h3>Knowledge</h3></div><button class="btn btn-secondary" data-page-jump="knowledge_base">View all</button></div><div class="task-stack">${kbArticles.slice(0, 3).map((item) => compactCard("knowledge_base", item)).join("") || employeeEmptyState("No articles found.", "Self-service guidance will appear here.")}</div></section>
    </div>
    <section class="surface-card command-panel employee-upcoming-section"><div class="section-title"><div><p class="eyebrow">What needs attention</p><h3>Upcoming Tasks</h3></div><button class="btn btn-secondary" data-page-jump="tasks">View all</button></div><div class="employee-upcoming-grid">${employeeTaskWindow("Due Today", taskWindows.today, "Due today")}${employeeTaskWindow("Due This Week", taskWindows.week.filter((task) => task.dueDate !== today()), "Next 7 days")}${employeeTaskWindow("Overdue", taskWindows.overdue, "Needs attention")}</div></section>
    <section class="surface-card command-panel employee-recent-tickets"><div class="section-title"><div><p class="eyebrow">Latest requests</p><h3>Recent Tickets</h3></div><button class="btn btn-secondary" data-page-jump="tickets">View all</button></div><div class="task-stack">${recentTickets.map((row) => compactCard("tickets", row)).join("") || employeeEmptyState("No tickets yet.", "Need help? Submit a request.", "Create Ticket", "tickets")}</div></section>
  `;
}

function employeeTaskWindows(tasks) {
  const start = new Date(`${today()}T00:00:00`);
  const weekEnd = new Date(start);
  weekEnd.setDate(weekEnd.getDate() + 7);
  const monthEnd = new Date(start.getFullYear(), start.getMonth() + 1, 0);
  const dated = (task) => task.dueDate ? new Date(`${task.dueDate}T00:00:00`) : null;
  return {
    today: tasks.filter((task) => task.dueDate === today()),
    week: tasks.filter((task) => { const due = dated(task); return due && due >= start && due <= weekEnd; }),
    month: tasks.filter((task) => { const due = dated(task); return due && due >= start && due <= monthEnd; }),
    overdue: tasks.filter(isOverdueTask),
    recurring: tasks.filter((task) => ["Daily", "Weekly", "Monthly", "Yearly"].includes(task.recurrence))
  };
}

function employeeTaskWindow(title, tasks, subtitle) {
  return `<section class="task-window-card"><div class="section-title"><div><p class="eyebrow">${escapeHtml(subtitle)}</p><h3>${escapeHtml(title)}</h3></div></div><div class="task-stack">${tasks.slice(0, 3).map((task) => compactCard("tasks", task)).join("") || `<p class="muted compact-empty">No tasks here.</p>`}</div></section>`;
}

function notificationsPage() {
  const items = groupedNotifications().filter((item) => state.notificationFilter === "all" || notificationCategory(item) === state.notificationFilter);
  return `
    ${toolbar("notifications", { eyebrow: "Notification center", subtitle: "Ticket assignments, updates, overdue tasks, renewals, and warranty signals." })}
    <div class="toolbar notification-toolbar"><div class="dashboard-filter-chips" role="group" aria-label="Notification filter">${["all", "tickets", "tasks", "assets", "contracts", "vendors"].map((category) => `<button class="filter-chip ${state.notificationFilter === category ? "active" : ""}" data-notification-filter="${category}">${category === "all" ? "All" : labelize(category)}</button>`).join("")}</div><span class="muted">${userNotifications().filter((item) => item.unread).length} unread</span><button class="btn btn-secondary" data-read-notifications>Mark all as read</button></div>
    <div class="timeline-feed notification-feed">${items.map(notificationCard).join("") || emptyState("No notifications", "You are caught up.")}</div>
  `;
}

function notificationCategory(item) {
  const type = String(item.category || item.entityType || "").toLowerCase();
  if (type.includes("ticket") || type === "comment" || type === "attachment") return "tickets";
  if (type.includes("task")) return "tasks";
  if (type.includes("asset") || type.includes("transfer")) return "assets";
  if (type.includes("contract")) return "contracts";
  if (type.includes("vendor")) return "vendors";
  if (type.includes("knowledge")) return "knowledge_base";
  return "tickets";
}

function notificationResource(item) {
  return ({ ticket: "tickets", task: "tasks", asset: "assets", contract: "contracts", vendor: "vendors", document: "documents", employee: "employees", knowledge_base: "knowledge_base" })[item.entityType] || item.entityType;
}

function groupedNotifications() {
  const groups = new Map();
  for (const item of userNotifications()) {
    const commentGroup = item.title === "Comment added" && item.entityType === "ticket";
    const reviewGroup = item.title === "Ticket waiting review";
    const key = commentGroup ? `comments:${item.entityId}` : reviewGroup ? "ticket-review" : item.id;
    const group = groups.get(key) || { ...item, ids: [], count: 0, unread: false, groupModule: reviewGroup ? "tickets" : "" };
    group.ids.push(item.id);
    group.count += 1;
    group.unread = group.unread || item.unread;
    if (String(item.createdAt || "") > String(group.createdAt || "")) Object.assign(group, item);
    groups.set(key, group);
  }
  return [...groups.values()].map((group) => {
    if (group.count > 1 && group.title === "Comment added") return { ...group, title: `${group.count} new comments on ${ticketLabel(group.entityId)}`, body: "Open the ticket conversation to review the latest replies." };
    if (group.count > 1 && group.groupModule === "tickets") return { ...group, title: `${group.count} new tickets waiting review`, body: "Open Tickets to review and assign the queue." };
    return group;
  }).sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || "")));
}

function ticketLabel(idValue) {
  return rows("tickets").find((ticket) => ticket.id === idValue)?.ticketNumber || "ticket";
}

function notificationSeverityIcon(type) {
  const mark = type === "critical" ? "!" : type === "warning" ? "!" : "i";
  return `<span class="notification-severity ${escapeHtml(type || "info")}">${mark}</span>`;
}

function notificationCard(item) {
  const ids = (item.ids || [item.id]).join(",");
  return `<article class="timeline-card notification-card ${item.unread ? "unread" : ""}"><button class="notification-open" data-notification-open="${ids}" data-notification-module="${escapeHtml(item.groupModule || "")}">${notificationSeverityIcon(item.type)}<span><div class="timeline-meta"><span class="badge ${badgeClass(item.type)}">${escapeHtml(notificationCategory(item))}</span><span>${new Date(item.createdAt).toLocaleString()}</span></div><strong>${escapeHtml(item.title)}</strong><p class="muted">${escapeHtml(item.body)}</p></span></button><div class="notification-actions">${item.unread ? `<button class="btn btn-secondary" data-notification-read="${ids}">Mark read</button>` : ""}<button class="btn btn-secondary" data-notification-delete="${ids}">Delete</button></div></article>`;
}

function archivePage(name) {
  const archived = rows(name);
  return `
    ${toolbar(name, { eyebrow: name === "trash" ? "Restore center" : "Archive center", subtitle: "Central view for archived V1 records. Restore keeps the audit trail intact." })}
    <div class="collection-grid">
      ${archived.map((row) => `<article class="record-card"><div class="record-card-head"><div class="record-icon">${icon(row.archiveType)}</div><div><strong>${escapeHtml(primaryTitle(row.archiveType, row))}</strong><span>${escapeHtml(t(row.archiveType))} | ${name === "trash" ? `deleted ${new Date(row.deletedAt).toLocaleString()}` : `archived ${new Date(row.archivedAt).toLocaleString()}`}</span></div></div><div class="record-card-actions"><button class="btn btn-secondary" data-restore="${row.archiveType}" data-id="${row.id}">Restore</button>${name === "archive_center" ? `<button class="btn btn-danger" data-trash="${row.archiveType}" data-id="${row.id}">Move to trash</button>` : `<button class="btn btn-danger" data-permanent-delete="${row.archiveType}" data-id="${row.id}">Permanent delete</button>`}</div></article>`).join("") || emptyState(name === "trash" ? "Trash is empty" : "Nothing archived", name === "trash" ? "Deleted records will appear here." : "Archived records will appear here.")}
    </div>
  `;
}

function canWithdrawTicket(row) {
  return isEmployeeUser() && ["open", "waiting"].includes(String(row?.status || "").toLowerCase());
}

function detailPage(name, row) {
  if (!row) return emptyState("Record not found", "The selected record may have been archived.", `<button class="btn btn-primary" data-back-to-list>&larr; Back to list</button>`);
  if (name === "knowledge_base") return knowledgeBaseArticlePage(row);
  if (name === "documents" && isEmployeeUser()) return employeeDocumentDetailPage(row);
  if (name === "assets" && isEmployeeUser()) return employeeAssetDetailPage(row);
  const tab = state.detail.tab || "Overview";
  const tabs = employeeDetailTabs(name);
  return `
    <section class="surface-card detail-page">
      <div class="detail-head">
        <div><button class="btn btn-secondary back-button" data-back-to-list>&larr; Back</button><p class="eyebrow" style="margin-top:14px">${t(name)}</p><h3>${escapeHtml(primaryTitle(name, row))}</h3><p class="muted">${escapeHtml(secondaryTitle(name, row))}</p></div>
        <div class="hero-actions">${name === "tickets" && canWithdrawTicket(row) ? `<button class="btn btn-secondary" data-withdraw-ticket="${row.id}">Withdraw Request</button>` : ""}${has(name, "edit") && schemas[name] ? `<button class="btn btn-secondary" data-edit="${name}" data-id="${row.id}">${icon("edit")}${t("edit")}</button>` : ""}${has(name, "archive") && schemas[name] && !(isEmployeeUser() && name === "tickets") ? `<button class="btn btn-danger" data-archive="${name}" data-id="${row.id}">${icon("archive_center")}${t("archive")}</button><button class="btn btn-danger" data-trash="${name}" data-id="${row.id}">${icon("delete")}Delete</button>` : ""}</div>
      </div>
      <div class="tabs">${tabs.map((item) => `<button class="tab ${tab === item ? "active" : ""}" data-detail-tab="${item}">${item}</button>`).join("")}</div>
      <div class="detail-tab-body">${detailTabContent(name, row, tab)}</div>
    </section>
  `;
}

function knowledgeBaseArticlePage(row) {
  const attachments = kbAttachmentItems(row);
  const related = relatedKnowledgeArticles(row).slice(0, 4);
  const updated = row.updatedAt || row.publishedAt || row.createdAt;
  return `
    <article class="surface-card detail-page kb-article readable-page employee-article">
      <div class="detail-head kb-article-head">
        <div><button class="btn btn-secondary" data-back-to-list>${icon("knowledge_base")}Back</button><p class="eyebrow">${escapeHtml(row.category || "Knowledge Base")}</p><h3>${escapeHtml(row.title)}</h3><p class="muted">${(row.tags || []).map((tag) => `#${escapeHtml(tag)}`).join(" ") || "No tags"} | Published ${escapeHtml(row.publishedAt || row.createdAt || "not dated")}</p></div>
        <div class="record-card-actions compact"><span class="badge ${row.published ? "success" : "info"}">${row.published ? "Published" : "Draft"}</span><button class="btn btn-secondary ${row.favorite ? "active" : ""}" data-kb-favorite="${row.id}">${row.favorite ? "Remove Favorite" : "Add Favorite"}</button><button class="btn btn-secondary" data-kb-share="${row.id}">Share</button><button class="btn btn-secondary" data-kb-print="${row.id}">Print</button><button class="btn btn-primary" data-kb-open-ticket="${row.id}">Open Ticket</button></div>
      </div>
      <div class="reading-progress"><span data-reading-progress style="width:0%"></span></div>
      <p class="muted article-meta">${escapeHtml(tpl("{n} min read", { n: readingTime(row.body) }))} | ${escapeHtml(trText("Progress"))} <span data-reading-progress-label>0%</span>${updated ? ` | ${escapeHtml(tpl("Last updated {date}", { date: new Date(updated).toLocaleDateString(state.lang === "ar" ? "ar" : "en") }))}` : ""} | ${escapeHtml(trText("Version"))} v${escapeHtml(String(row.version || "1.0"))} | ${escapeHtml(trText("Owner"))} ${escapeHtml(knowledgeOwnerLabel(row))}</p>
      <div class="article-body">${escapeHtml(row.body || "No article body available.").replace(/\n/g, "<br>")}</div>
      ${(row.images || []).length ? `<div class="article-images">${row.images.map((item) => `<figure><img src="${escapeHtml(item)}" alt="${escapeHtml(row.title)} image"><figcaption>${escapeHtml(item)}</figcaption></figure>`).join("")}</div>` : ""}
      ${attachments.length ? `<section class="article-section kb-attachment-panel"><div class="section-title"><div><p class="eyebrow">Attachments</p><h3>Article files</h3></div></div><div class="attachment-list">${attachments.map(kbAttachmentCard).join("")}</div></section>` : ""}
      <section class="article-section"><div class="section-title"><div><p class="eyebrow">Related Articles</p><h3>Keep reading</h3></div></div><div class="related-article-grid">${related.map((item) => `<button class="article-link related-article-card" data-view="knowledge_base" data-id="${item.id}">${icon("knowledge_base")}<span><strong>${escapeHtml(item.title)}</strong><small>${escapeHtml(item.category || "Knowledge Base")}</small></span></button>`).join("") || emptyState("No related articles", "More guidance will appear as the knowledge base grows.")}</div></section>
      ${articleFeedback(row)}
    </article>
  `;
}

function relatedKnowledgeArticles(row) {
  const tags = new Set(knowledgeTags(row).map((tag) => tag.toLowerCase()));
  return rows("knowledge_base").filter((item) => item.id !== row.id && item.published !== false).map((item) => {
    let score = item.category === row.category ? 10 : 0;
    score += knowledgeTags(item).filter((tag) => tags.has(tag.toLowerCase())).length * 6;
    score += knowledgeSearchScore(item, row.title);
    return { item, score };
  }).sort((a, b) => b.score - a.score).map((entry) => entry.item);
}

function kbAttachmentItems(row) {
  return (row.attachments || []).map((filename) => ({ filename }));
}

function kbAttachmentCard(item) {
  return `<article class="file-card"><div class="file-card-main">${icon("attachments")}<span><strong>${escapeHtml(item.filename)}</strong><small>${escapeHtml(mimeForName(item.filename))}</small></span></div><div class="record-card-actions"><button class="btn btn-secondary" data-preview-kb-file="${escapeHtml(item.filename)}">${icon("preview")}Preview</button><button class="btn btn-secondary" data-download-kb-file="${escapeHtml(item.filename)}">${icon("download")}Download</button></div></article>`;
}

function readingTime(text) {
  const words = String(text || "").trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 220));
}

function articleFeedback(row) {
  const counts = kbFeedbackCounts(row);
  return `
    <section class="article-section article-feedback">
      <div><h3>Was this article helpful?</h3><p class="muted">Your response helps IT improve self-service guidance.</p></div>
      <div class="feedback-actions">
        <button class="btn btn-secondary ${counts.vote === "yes" ? "active" : ""}" data-kb-feedback="${row.id}" data-value="yes">&#128077; Yes <span>${counts.yes}</span></button>
        <button class="btn btn-secondary ${counts.vote === "no" ? "active" : ""}" data-kb-feedback="${row.id}" data-value="no">&#128078; No <span>${counts.no}</span></button>
      </div>
      <label class="feedback-comment">Optional feedback comment<textarea data-kb-feedback-comment="${row.id}" placeholder="Tell IT what worked or what was missing."></textarea></label>
      <button class="btn btn-secondary" data-kb-solved="${row.id}">This solved my problem</button>
    </section>
  `;
  /*
  return `
    <section class="article-section article-feedback">
      <div><h3>Was this article helpful?</h3><p class="muted">Your response helps IT improve self-service guidance.</p></div>
      <div class="feedback-actions">
        <button class="btn btn-secondary" data-kb-feedback="${row.id}" data-value="yes">&#128077; Yes <span>${counts.yes}</span></button>
        <button class="btn btn-secondary" data-kb-feedback="${row.id}" data-value="no">&#128078; No <span>${counts.no}</span></button>
      </div>
    </section>
  `;
  */
}

function kbFeedbackCounts(row) {
  const fallback = JSON.parse(localStorage.getItem("itcc.kbFeedback") || "{}")[row.id] || {};
  return { yes: knowledgeHelpfulVotes(row) || Number(fallback.yes || 0), no: knowledgeNotHelpfulVotes(row) || Number(fallback.no || 0), vote: row.userVote || fallback.vote || "" };
}

async function recordKbFeedback(id, value) {
  const comment = $$("[data-kb-feedback-comment]").find((field) => field.dataset.kbFeedbackComment === id)?.value || "";
  try {
    await api(`/api/knowledge_base/${id}/workflow`, { method: "PATCH", body: JSON.stringify({ workflow: "rate", vote: value, comment }) });
    toast("Feedback saved", "Thanks for helping improve the knowledge base.");
    await loadState();
    render();
    return;
  } catch (error) {
    toast("Could not save feedback", error.message);
  }
  const all = JSON.parse(localStorage.getItem("itcc.kbFeedback") || "{}");
  const current = { yes: 0, no: 0, vote: "", ...(all[id] || {}) };
  const previous = current.vote || "";
  if (previous === value) {
    current[value] = Math.max(0, Number(current[value] || 0) - 1);
    current.vote = "";
  } else {
    if (previous) current[previous] = Math.max(0, Number(current[previous] || 0) - 1);
    current[value] = Number(current[value] || 0) + 1;
    current.vote = value;
  }
  all[id] = current;
  localStorage.setItem("itcc.kbFeedback", JSON.stringify(all));
  render();
}

async function recordKnowledgeSelfService(id, workflow, message = "Knowledge updated") {
  try {
    await api(`/api/knowledge_base/${id}/workflow`, { method: "PATCH", body: JSON.stringify({ workflow }) });
    if (workflow === "view") rememberKnowledgeArticle(id);
    toast(message, workflow === "ticket_prevented" ? "This article was counted as solving the issue." : "Your knowledge preference was saved.");
    await loadState();
    render();
  } catch (error) {
    toast("Knowledge action failed", error.message);
  }
}

async function shareKnowledgeArticle(id) {
  const article = rows("knowledge_base").find((item) => item.id === id);
  navigator.clipboard?.writeText(`${location.origin}/knowledge_base/${id}`);
  await recordKnowledgeSelfService(id, "share", "Link copied");
  toast("Link copied", `${article?.title || "Article"} link copied.`);
}

async function printKnowledgeArticle(id) {
  try {
    await api(`/api/knowledge_base/${id}/workflow`, { method: "PATCH", body: JSON.stringify({ workflow: "print" }) });
  } catch (error) {
    toast("Print tracking failed", error.message);
  }
  window.print();
}

function openTicketFromKnowledge(id) {
  const article = rows("knowledge_base").find((item) => item.id === id);
  state.pendingSuggestedArticleIds = [id];
  openModal("tickets", null, { suggestedArticleIds: [id], employeeSubject: article?.title || "", description: `I read this article but still need help:\n${article?.title || id}` });
}

function updateReadingProgress() {
  const bar = document.querySelector("[data-reading-progress]");
  const label = document.querySelector("[data-reading-progress-label]");
  if (!bar || !label) return;
  const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  const pct = Math.max(0, Math.min(100, Math.round((window.scrollY / max) * 100)));
  bar.style.width = `${pct}%`;
  label.textContent = `${pct}%`;
}

function detailTabContent(name, row, tab) {
  if (name === "employees" && tab === "User Account") return personUserAccountTab(row);
  if (name === "tickets" && isEmployeeUser() && tab === "Overview") return employeeTicketOverview(row);
  if (name === "tickets" && isEmployeeUser() && tab === "Conversation") return employeeTicketConversation(row);
  if (name === "tasks" && isEmployeeUser() && tab === "Overview") return employeeTaskOverview(row);
  if (name === "tasks" && isEmployeeUser() && tab === "Notes") return employeeTaskNotes(row);
  if (name === "tickets" && !isEmployeeUser() && tab === "Overview") return managerTicketOverview(row);
  if (name === "tickets" && !isEmployeeUser() && tab === "Conversation") return ticketWorkspaceConversation(row);
  if (name === "tickets" && !isEmployeeUser() && tab === "Details") return managerTicketDetails(row);
  if (name === "tickets" && !isEmployeeUser() && tab === "Files") return ticketWorkspaceFiles(row);
  if (name === "tickets" && !isEmployeeUser() && tab === "Timeline") return ticketWorkspaceTimeline(row);
  if (tab === "Timeline") return timelineFor(name, row);
  if (tab === "Comments") return commentsFor(name, row);
  if (tab === "Conversation") return commentsFor(name, row);
  if (tab === "Attachments") return attachmentsFor(name, row);
  if (tab === "Related Records") return relatedFor(name, row);
  if (tab === "Audit History") return auditFor(name, row);
  if (name === "documents" && isEmployeeUser()) return companyDocumentOverview(row);
  return overviewFor(name, row);
}

function employeeDetailTabs(name) {
  if (!isEmployeeUser() && name === "employees") return ["Overview", "User Account", "Timeline", "Comments", "Attachments", "Related Records", "Audit History"];
  if (!isEmployeeUser()) return name === "tickets" ? ["Overview", "Conversation", "Attachments", "Timeline", "Audit History"] : ["Overview", "Timeline", "Comments", "Attachments", "Related Records", "Audit History"];
  if (name === "documents") return ["Overview", "Attachments"];
  if (name === "tickets") return ["Overview", "Conversation"];
  if (name === "tasks") return ["Overview", "Notes", "Attachments"];
  return ["Overview", "Timeline", "Comments", "Attachments", "Related Records", "Audit History"];
}

function linkedUserForPerson(person) {
  return allAccountRows().find((user) => user.employeeId === person.id)
    || allAccountRows().find((user) => user.email && person.email && user.email.toLowerCase() === person.email.toLowerCase());
}

function accountStatusLabel(user) {
  if (!user) return "No Login Account";
  if (user.expiryDate && user.expiryDate < today()) return "Password Expired";
  const normalized = String(user.status || "active").toLowerCase();
  return ({ active: "Enabled", enabled: "Enabled", disabled: "Disabled", locked: "Locked", inactive: "Disabled", password_expired: "Password Expired" })[normalized] || labelize(user.status || "active");
}

function personStatusLabel(person) {
  if (person?.archivedAt) return "Archived";
  return ({ active: "Active", on_leave: "On Leave", inactive: "Inactive", archived: "Archived" })[String(person?.status || "active").toLowerCase()] || labelize(person?.status || "active");
}

function accountStatusValue(user) {
  return String(accountStatusLabel(user)).toLowerCase().replace(/\s+/g, "_");
}

function personUserAccountTab(person) {
  const user = linkedUserForPerson(person);
  if (!user) {
    return `
      <section class="system-access-empty">
        <div class="record-icon">${icon("users")}</div>
        <div>
          <h3>No Login Account</h3>
          <p class="muted">This person has no system access yet. Create an account only when they need to sign in.</p>
          ${has("users", "create") ? `<button class="btn btn-primary" data-create-person-account="${person.id}">${icon("plus")}Create Account</button>` : ""}
        </div>
      </section>
    `;
  }
  return `
    <section class="system-access-card">
      <div class="section-title">
        <div><p class="eyebrow">System Access</p><h3>Login Account ${escapeHtml(accountStatusLabel(user))}</h3><p class="muted">Account details are read-only here except controlled account actions.</p></div>
      </div>
      <div class="detail-grid">
        <div class="detail-field"><small>Username</small><strong>${escapeHtml(user.username || user.email || user.id)}</strong></div>
        <div class="detail-field"><small>Email</small><strong>${escapeHtml(user.email || "Not set")}</strong></div>
        <div class="detail-field"><small>Role</small><strong>${escapeHtml(look("roles", user.roleId) || "Unassigned")}</strong></div>
        <div class="detail-field"><small>Account Status</small><strong>${escapeHtml(accountStatusLabel(user))}</strong></div>
        <div class="detail-field"><small>Last Login</small><strong>${escapeHtml(user.lastLoginAt ? relativeTime(user.lastLoginAt) : "Never")}</strong></div>
        <div class="detail-field"><small>Password Expiry</small><strong>${escapeHtml(user.expiryDate || "No expiry")}</strong></div>
        <div class="detail-field"><small>MFA</small><strong>${escapeHtml(user.mfaEnabled ? "Enabled" : "Disabled")}</strong></div>
      </div>
      <div class="record-card-actions account-actions">
        <button class="btn btn-secondary" data-open-linked-account="${user.id}">Open User Account</button>
        ${has("users", "edit") ? `<button class="btn btn-secondary" data-change-user-role="${user.id}">Change Role</button>` : ""}
      </div>
    </section>
  `;
}

function employeeTaskNotes(row) {
  return `<div class="document-body"><p>${escapeHtml(row.description || row.notes || "No notes yet.")}</p></div>`;
}

function employeeTaskOverview(row) {
  return `
    <div class="detail-grid">
      <div class="detail-field full"><small>Task</small><strong>${escapeHtml(row.title || "Task")}</strong></div>
      <div class="detail-field"><small>Category</small><strong>${escapeHtml(row.category || "Other")}</strong></div>
     <div class="detail-field"><small>Priority</small><strong><span class="badge ${badgeClass(row.priority)}">${escapeHtml(row.priority || "Medium")}</span></strong></div>
      <div class="detail-field"><small>Start date</small><strong>${escapeHtml(row.startDate || "No start date")}</strong></div>
     <div class="detail-field"><small>Due date</small><strong>${escapeHtml(row.dueDate || "No due date")} ${taskDueBadge(row)}</strong></div>
      <div class="detail-field"><small>Recurrence</small><strong>${escapeHtml(row.recurrence || "One time")}</strong></div>
      <div class="detail-field full"><small>Status</small><strong class="inline-status detail-status">${taskStatusChips(row)}</strong></div>
    </div>
  `;
}

function employeeTicketOverview(row) {
  const parts = ticketCategoryParts(row.category);
  const attachments = (state.db.attachments || []).filter((item) => item.entityType === "ticket" && item.entityId === row.id);
  return `
    <div class="detail-grid">
      <div class="detail-field"><small>Ticket ID</small><strong>${escapeHtml(row.ticketNumber || row.id)}</strong></div>
      <div class="detail-field"><small>Main category</small><strong>${escapeHtml(parts.main)}</strong></div>
      <div class="detail-field"><small>Subcategory</small><strong>${escapeHtml(parts.sub)}</strong></div>
      <div class="detail-field"><small>Status</small><strong>${escapeHtml(labelize(row.status || "open"))}</strong></div>
      <div class="detail-field full"><small>Description</small><strong>${escapeHtml(row.description || "")}</strong></div>
      <div class="detail-field"><small>Created date</small><strong>${escapeHtml(row.createdAt ? new Date(row.createdAt).toLocaleString() : "")}</strong></div>
    </div>
    <section class="article-section ticket-overview-attachments">
      <div class="section-title"><div><p class="eyebrow">Attachments</p><h3>Files</h3></div></div>
      <div class="attachment-list">${attachments.map(attachmentCard).join("") || `<p class="muted compact-empty">No attachments added.</p>`}</div>
    </section>
  `;
}

function employeeTicketConversation(row) {
  const comments = employeePublicTicketComments(row.id);
  const roots = comments.filter((item) => !item.parentId);
  return `
    <form class="comment-box chat-composer" data-comment-form="tickets" data-id="${row.id}">
      <textarea name="body" placeholder="Write a reply to IT"></textarea>
      <input name="file" type="file" accept=".pdf,image/*,.doc,.docx,.xls,.xlsx" />
      <button class="btn btn-primary" type="submit">Send reply</button>
    </form>
    <div class="chat-thread">${roots.map((comment) => chatMessage(comment, comments)).join("") || emptyState("No conversation yet", "Replies from you and IT will appear here.")}</div>
  `;
}

function chatMessage(comment, all) {
  const mine = comment.authorId === state.user?.id;
  const replies = all.filter((item) => item.parentId === comment.id);
  return `
    <article class="chat-message ${mine ? "mine" : ""}">
      <div><strong>${escapeHtml(look("users", comment.authorId) || (mine ? "You" : "IT"))}</strong><small>${new Date(comment.createdAt).toLocaleString()}</small></div>
      <p>${escapeHtml(comment.body)}</p>
      ${comment.attachmentName ? `<small class="muted">Attachment: ${escapeHtml(comment.attachmentName)}</small>` : ""}
    </article>
    ${replies.map((reply) => chatMessage(reply, all)).join("")}
  `;
}

function companyDocumentOverview(row) {
  const description = row.description || row.notes || "No description available.";
  const body = row.body || row.content || description;
  return `
    <section class="document-viewer">
      <header class="document-viewer-head">
        <div>
          <p class="eyebrow">${escapeHtml(documentFriendlyType(row))}</p>
          <h3>${escapeHtml(row.title || "Document")}</h3>
          <p class="muted">${escapeHtml(description)}</p>
        </div>
        ${(row.updatedAt || row.publishDate || row.createdAt) ? `<span class="badge info">${escapeHtml(tpl("Updated {when}", { when: relativeTime(row.updatedAt || row.publishDate || row.createdAt) }))}</span>` : ""}
      </header>
      <article class="document-body">
        <p>${escapeHtml(body)}</p>
      </article>
    </section>
  `;
}

function employeeDocumentDetailPage(row) {
  if (!row) return emptyState("Document not found", "The selected document may have been archived.");
  const attachments = documentAttachments(row);
  return `
    <section class="surface-card detail-page employee-document-detail">
      <div class="detail-head compact-detail-head">
        <div><button class="btn btn-secondary back-button" data-back-to-list>&larr; Back</button></div>
      </div>
      ${companyDocumentOverview(row)}
      ${attachments.length ? `<section class="article-section document-attachments-section">
        <div class="section-title"><div><p class="eyebrow">Attachments</p><h3>Files</h3></div></div>
        <div class="attachment-list">${attachments.map(employeeDocumentAttachmentCard).join("")}</div>
      </section>` : ""}
    </section>
  `;
}

function employeeDocumentAttachmentCard(item) {
  return `<article class="file-card"><div class="file-card-main">${icon("documents")}<span><strong>${escapeHtml(item.filename)}</strong></span></div><div class="record-card-actions"><button class="btn btn-secondary" data-preview-attachment="${item.id}">${icon("preview")}Preview</button><button class="btn btn-secondary" data-download-attachment="${item.id}">${icon("download")}Download</button></div></article>`;
}

function overviewFor(name, row) {
  const hidden = isEmployeeUser() ? ["internalNotes", "waitingReason", "cancelReason", "withdrawalReason", "permissions", "password", "reminderAt", "notificationPreference", "calendarSync", "outlookSync", "emailIntegration"] : ["permissions", "password"];
  return `<div class="detail-grid">${Object.entries(row).filter(([key]) => !hidden.includes(key) && !["comments", "history"].includes(key)).map(([key, value]) => `<div class="detail-field"><small>${labelize(key)}</small><strong>${escapeHtml(Array.isArray(value) ? value.join(", ") : value)}</strong></div>`).join("")}</div>${!isEmployeeUser() && row.internalNotes ? `<div class="list-item" style="margin-top:14px"><strong>Internal notes</strong><p class="muted">${escapeHtml(row.internalNotes)}</p></div>` : ""}`;
}

function managerTicketOverview(row) {
  const attachments = (state.db.attachments || []).filter((item) => item.entityType === "ticket" && item.entityId === row.id);
  return `
    <section class="ticket-overview-section"><div class="ticket-overview-label">Description</div><div class="ticket-description">${escapeHtml(row.description || row.subject || "No description provided.").replace(/\n/g, "<br>")}</div>${row.status === "waiting" ? `<p class="ticket-reason-summary">Waiting for: <strong>${escapeHtml(row.waitingReason || "Not recorded")}</strong></p>` : ""}${row.status === "cancelled" ? `<p class="ticket-reason-summary">Cancelled because: <strong>${escapeHtml(row.cancelReason || "Not recorded")}</strong></p>` : ""}${row.internalNotes ? `<div class="ticket-legacy-note"><small>Internal note</small><strong>${escapeHtml(row.internalNotes)}</strong></div>` : ""}</section>
    ${attachments.length ? `<section class="article-section ticket-overview-attachments"><div class="section-title"><div><p class="eyebrow">Attachments</p><h3>Files</h3></div></div><div class="attachment-list">${attachments.map(attachmentCard).join("")}</div></section>` : ""}
  `;
}

function managerTicketDetails(row) {
  const parts = ticketCategoryParts(row.category || "");
  const fields = [
    ["Ticket Number", row.ticketNumber || row.id],
    ["Requester", ticketRequesterProvenance(row)],
    ["Main Category", parts.main || row.category || "General"],
    ["Subcategory", parts.sub || "Not set"],
    ["Created", row.createdAt ? new Date(row.createdAt).toLocaleString() : "-"],
    ["Updated", row.updatedAt ? new Date(row.updatedAt).toLocaleString() : "-"],
    ["Waiting Reason", row.status === "waiting" ? row.waitingReason || "Not recorded" : "Not waiting"],
    ["Cancel Reason", row.status === "cancelled" ? row.cancelReason || "Not recorded" : "Not cancelled"]
  ];
  return `
    <section class="ticket-overview-section ticket-details-section">
      <div class="section-title"><div><p class="eyebrow">Ticket details</p><h3>Request summary</h3><p class="muted">Secondary record detail stays here so the conversation remains the default workspace.</p></div></div>
      <div class="ticket-description">${escapeHtml(row.description || row.subject || "No description provided.").replace(/\n/g, "<br>")}</div>
      <div class="detail-grid ticket-details-grid">${fields.map(([label, value]) => `<div class="detail-field"><small>${escapeHtml(label)}</small><strong>${escapeHtml(value)}</strong></div>`).join("")}</div>
      ${row.internalNotes ? `<div class="ticket-legacy-note"><small>Internal note</small><strong>${escapeHtml(row.internalNotes)}</strong></div>` : ""}
    </section>
  `;
}

function ticketWorkspaceFiles(row) {
  const attachments = (state.db.attachments || []).filter((item) => item.entityType === "ticket" && item.entityId === row.id);
  return `
    <section class="article-section ticket-files-section">
      <div class="section-title">
        <div><p class="eyebrow">Files</p><h3>Ticket attachments</h3><p class="muted">Upload from the Conversation composer or the More menu. Preview and download remain permission protected.</p></div>
        <button class="btn btn-secondary" type="button" data-ticket-upload="${row.id}">${icon("attachments")}Upload File</button>
      </div>
      <div class="attachment-list">${attachments.map(attachmentCard).join("") || emptyState("No files yet", "Attachments uploaded by IT or the requester will appear here.")}</div>
    </section>
  `;
}

function ticketWorkspaceConversation(row) {
  const comments = (state.db.comments || []).filter((item) => ["tickets", "ticket"].includes(item.entityType) && item.entityId === row.id);
  const roots = comments.filter((item) => !item.parentId);
  return `
    <section class="ticket-conversation"><div class="ticket-conversation-thread">${roots.map((comment) => ticketConversationMessage(comment, comments)).join("") || emptyState("No conversation yet", "Start the conversation with the requester.")}</div>
      <form class="ticket-conversation-composer" data-comment-form="tickets" data-id="${row.id}">
        <textarea name="body" placeholder="Write a reply to the requester"></textarea><input type="checkbox" name="internal" data-ticket-composer-internal hidden ${state.ticketWorkspaceComposeInternal ? "checked" : ""} />
        <div class="ticket-composer-actions"><button class="btn btn-secondary" type="button" data-ticket-composer-mode="reply">Reply</button><button class="btn btn-secondary ${state.ticketWorkspaceComposeInternal ? "active" : ""}" type="button" data-ticket-composer-mode="internal">Internal Note</button><label class="btn btn-secondary composer-upload">${icon("attachments")}Upload Attachment<input name="file" type="file" accept=".pdf,image/*,.doc,.docx,.xls,.xlsx" /></label><button class="btn btn-primary" type="submit">Send</button></div>
      </form>
    </section>
  `;
}

function ticketConversationMessage(comment, all) {
  const replies = all.filter((item) => item.parentId === comment.id);
  return `<article class="ticket-message ${comment.internal ? "internal" : ""}"><div class="ticket-message-meta"><strong>${escapeHtml(look("users", comment.authorId) || "IT")}</strong><span>${comment.internal ? '<span class="badge warning">Internal</span>' : ""}<time>${new Date(comment.createdAt).toLocaleString()}</time></span></div><p>${escapeHtml(comment.body || "")}</p>${comment.attachmentName ? `<small>${icon("attachments")}${escapeHtml(comment.attachmentName)}</small>` : ""}${replies.map((reply) => ticketConversationMessage(reply, all)).join("")}</article>`;
}

function ticketWorkspaceTimeline(row) {
  const events = state.db.timeline.filter((item) => item.entityId === row.id && ["tickets", "ticket"].includes(item.entityType)).sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
  return `<div class="ticket-activity-feed">${events.map((event) => { const audit = (state.db.auditLogs || []).find((log) => log.entityId === row.id && log.createdAt === event.createdAt); return `<article class="ticket-activity-item"><span class="ticket-activity-icon">${icon("timeline")}</span><div><strong>${escapeHtml(ticketTimelineMessage(event, audit))}</strong><small>${escapeHtml(look("users", event.actorUserId || audit?.userId) || "System")} | ${new Date(event.createdAt).toLocaleString()}</small></div></article>`; }).join("") || emptyState("No timeline yet", "Ticket activity will appear here.")}</div>`;
}

function ticketTimelineMessage(event, audit) {
  const action = audit?.action || String(event.title || "").split(" ")[0].toLowerCase();
  const next = audit?.newValue || {};
  if (action === "status_change") return `Status changed to ${labelize(next.status || "updated")}`;
  if (action === "assign") return `Assigned to ${look("users", next.assignedToId) || "Unassigned"}`;
  if (action === "comment") return "Comment added";
  if (action === "upload") return "Attachment uploaded";
  if (action === "resolve") return "Ticket resolved";
  if (action === "close") return "Ticket closed";
  if (action === "cancel") return "Ticket cancelled";
  if (action === "create") return "Ticket created";
  if (action === "update" && next.priority) return `Priority changed to ${labelize(next.priority)}`;
  return "Ticket updated";
}

function timelineFor(name, row) {
  const events = state.db.timeline.filter((item) => item.entityId === row.id && [name, singular(name)].includes(item.entityType));
  return `<div class="timeline-feed">${events.map(eventCard).join("") || emptyState("No timeline yet", "Changes to this record will appear here.")}</div>`;
}

function commentsFor(name, row) {
  const comments = (state.db.comments || []).filter((item) => [name, singular(name)].includes(item.entityType) && item.entityId === row.id);
  const roots = comments.filter((item) => !item.parentId);
  const allowInternalNotes = name === "tickets" && !isEmployeeUser();
  return `
    <form class="comment-box" data-comment-form="${name}" data-id="${row.id}">
      <textarea name="body" placeholder="Write a comment. Use @name to mention someone. Markdown-style **bold** and _italic_ text is supported as plain text in V1."></textarea>
      <input name="attachmentName" placeholder="Optional attachment name" />
      ${allowInternalNotes ? '<label class="internal-comment-toggle"><input type="checkbox" name="internal" /> Internal note - visible to IT only</label>' : ""}
      <button class="btn btn-primary" type="submit">Add comment</button>
    </form>
    <div class="comment-thread">${roots.map((comment) => commentCard(comment, comments)).join("") || emptyState("No comments", "Start the discussion for this record.")}</div>
  `;
}

function commentCard(comment, all) {
  const replies = all.filter((item) => item.parentId === comment.id);
  return `<article class="comment-card">
    <div class="comment-meta"><strong>${escapeHtml(look("users", comment.authorId))}</strong><small>${new Date(comment.createdAt).toLocaleString()}</small>${comment.internal ? '<span class="badge warning">Internal</span>' : ""}</div>
    <p>${escapeHtml(comment.body)}</p>
    ${comment.attachmentName ? `<small class="muted">Attachment: ${escapeHtml(comment.attachmentName)}</small>` : ""}
    <details class="inline-composer"><summary>Reply</summary><form data-reply-form="${comment.id}"><textarea name="body" placeholder="Write a threaded reply"></textarea><input name="attachmentName" placeholder="Optional attachment name" /><button class="btn btn-primary" type="submit">Reply</button></form></details>
    <details class="inline-composer"><summary>Edit</summary><form data-edit-comment-form="${comment.id}"><textarea name="body">${escapeHtml(comment.body)}</textarea><input name="attachmentName" value="${escapeHtml(comment.attachmentName || "")}" placeholder="Optional attachment name" /><button class="btn btn-secondary" type="submit">Save edit</button></form></details>
    <div class="comment-replies">${replies.map((reply) => commentCard(reply, all)).join("")}</div>
  </article>`;
}

function attachmentsFor(name, row) {
  const attachments = name === "documents" ? documentAttachments(row) : (state.db.attachments || []).filter((item) => item.entityType === singular(name) && item.entityId === row.id);
  const canUpload = !isEmployeeUser() && has("attachments", "create");
  return `
    ${canUpload ? `<form class="attachment-upload" data-upload-form="${name}" data-id="${row.id}">
      <input name="file" type="file" accept=".pdf,image/*,.doc,.docx,.xls,.xlsx" />
      <button class="btn btn-primary" type="submit">${icon("plus")}Upload</button>
    </form>` : ""}
    <div class="collection-grid">${attachments.map(attachmentCard).join("") || emptyState("No attachments", "Upload PDFs, images, Word, or Excel files.")}</div>
  `;
}

function documentAttachments(row) {
  if (!row?.id) return [];
  return (state.db.attachments || []).filter((item) => item.entityType === "document" && item.entityId === row.id);
}

function attachmentCard(item) {
  const isImage = String(item.mimeType || "").startsWith("image/");
  return `<article class="record-card"><div class="record-card-head"><div class="record-icon">${icon("attachments")}</div><div><strong>${escapeHtml(item.filename)}</strong><span>${escapeHtml(look("users", item.uploaderId))} | ${new Date(item.uploadedAt).toLocaleString()} | ${formatSize(item.size)}</span></div></div>${isImage ? `<img class="attachment-preview" loading="lazy" src="/api/attachments/${encodeURIComponent(item.id)}/download" alt="${escapeHtml(item.filename)}">` : `<div class="attachment-preview">${escapeHtml(item.mimeType || "file preview")}</div>`}<div class="record-card-actions"><button class="btn btn-secondary" data-preview-attachment="${item.id}">${icon("preview")}Preview</button><button class="btn btn-secondary" data-download-attachment="${item.id}">${icon("download")}Download</button></div></article>`;
}

function relatedFor(name, row) {
  const related = relatedRecords(name, row);
  return `<div class="collection-grid">${related.map((item) => `<article class="record-card"><div class="record-card-head"><div class="record-icon">${icon(item.type)}</div><div><strong>${escapeHtml(primaryTitle(item.type, item.row))}</strong><span>${escapeHtml(t(item.type))}</span></div></div><button class="btn btn-secondary" data-view="${item.type}" data-id="${item.row.id}">Open</button></article>`).join("") || emptyState("No related records", "Links to assets, tickets, documents, contracts, vendors, and employees appear here.")}</div>`;
}

function auditFor(name, row) {
  const logs = (state.db.auditLogs || []).filter((log) => log.entityId === row.id && [name, singular(name)].includes(log.entityType));
  return `<div class="audit-feed">${logs.map((log) => `<article class="audit-card"><div class="audit-mark">${icon("audit_logs")}</div><div><strong>${escapeHtml(log.action)}</strong><p class="muted">${escapeHtml(look("users", log.userId))} | ${new Date(log.createdAt).toLocaleString()}</p><details><summary>Payload</summary><pre>${escapeHtml(JSON.stringify({ old: log.oldValue, new: log.newValue }, null, 2))}</pre></details></div></article>`).join("") || emptyState("No audit records", "Audit events for this record will appear here.")}</div>`;
}

function visibleColumns(name) {
  if (!state.visible[name]) state.visible[name] = [...(columns[name] || [])];
  return state.visible[name];
}

function paginate(name, data) {
  const current = state.pageIndex[name] || 0;
  const max = Math.max(0, Math.ceil(data.length / state.pageSize) - 1);
  const safe = Math.min(current, max);
  state.pageIndex[name] = safe;
  return { page: safe, pages: max + 1, items: data.slice(safe * state.pageSize, safe * state.pageSize + state.pageSize) };
}

function pager(name, total, paged) {
  if (total <= state.pageSize) return `<div class="table-footer">${escapeHtml(tpl("{n} records", { n: total }))}</div>`;
  return `<div class="table-footer"><span>${escapeHtml(tpl("{n} records", { n: total }))} | ${escapeHtml(tpl("page {a} of {b}", { a: paged.page + 1, b: paged.pages }))}</span><div><button class="btn btn-secondary" data-page-prev="${name}">Previous</button><button class="btn btn-secondary" data-page-next="${name}">Next</button></div></div>`;
}

function sortMark(name, col) {
  const sort = state.sort[name];
  if (sort?.key !== col) return "";
  return sort.dir === "asc" ? "&uarr;" : "&darr;";
}

function primaryTitle(name, row) {
  return row.name || row.title || row.filename || row.ticketNumber || row.assetNumber || row.movementType || row.email || row.id;
}

function secondaryTitle(name, row) {
  if (name === "employees") return `${look("departments", row.departmentId)} | ${row.jobTitle || ""}`;
  if (name === "assets") return `${row.brand || ""} ${row.model || ""} | ${look("employees", row.currentOwnerId) || "Inventory"}`;
  if (name === "tickets") return `${look("employees", row.requesterId)} | ${row.category || ""}`;
  if (name === "tasks") return `${look("users", row.ownerId)} | due ${row.dueDate || "unscheduled"}`;
  if (name === "contracts") return `${look("vendors", row.vendorId)} | ${row.endDate || ""}`;
  if (name === "vendors") return row.services || row.email || "";
  if (name === "documents") return `${row.templateType || "Document"} | ${row.signedFileName || "No file"}`;
  if (name === "attachments") return `${row.entityType || "record"} | ${formatSize(row.size)}`;
  if (name === "notifications") return row.body || row.entityType || "";
  if (name === "knowledge_base") return `${row.category || "Article"} | ${(row.tags || []).join(", ")}`;
  if (name === "form_templates") return `${row.approvalStatus || "Draft"} | ${(row.fields || []).join(", ")}`;
  if (name === "roles") return row.description || "Customizable permission set";
  return row.description || row.notes || "";
}

function cell(name, row, column) {
  const text = cellText(name, row, column);
  if (["status", "priority", "condition"].includes(column)) return `<span class="badge ${badgeClass(text)}">${escapeHtml(text)}</span>`;
  if (column === "name" || column === "assetNumber" || column === "ticketNumber" || column === "title") {
    return `<span class="record-title">${icon(name)}<span>${escapeHtml(text)}<span class="record-sub">${escapeHtml(secondaryTitle(name, row))}</span></span></span>`;
  }
  return escapeHtml(Array.isArray(text) ? text.join(", ") : text);
}

function cellText(name, row, column) {
  const map = {
    role: () => look("roles", row.roleId),
    department: () => look("departments", row.departmentId),
    owner: () => look("employees", row.currentOwnerId),
    vendor: () => look("vendors", row.vendorId),
    asset: () => look("assets", row.assetId),
    performedBy: () => look("users", row.performedBy),
    requester: () => look("employees", row.requesterId),
    assignedTo: () => look("users", row.assignedToId),
    relatedDocument: () => look("documents", row.relatedDocumentId),
    linked: () => `${row.linkedType || ""} ${row.linkedId || ""}`,
    related: () => `${row.relatedType || ""} ${row.relatedId || ""}`,
    isSystem: () => row.isSystem ? "Yes" : "No",
    uploader: () => look("users", row.uploaderId),
    unread: () => row.unread ? "Unread" : "Read",
    published: () => row.published === true || row.published === "true" ? "Published" : "Draft"
  };
  if (map[column]) return map[column]();
  const value = row[column];
  // Raw ISO timestamps were rendering verbatim ("2026-01-15T08:00:00.000Z").
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}T[\d:.]+Z?$/.test(value)) {
    const date = new Date(value);
    if (!Number.isNaN(date.getTime())) return date.toLocaleString(state.lang === "ar" ? "ar" : "en");
  }
  return value;
}

function badgeClass(value) {
  const normalized = String(value || "").toLowerCase();
  if (["critical"].includes(normalized)) return "critical";
  if (["high", "overdue", "damaged", "lost", "danger"].includes(normalized)) return "danger";
  if (["in_progress", "in progress", "medium", "renewal_due", "under_maintenance", "warning", "password_expired"].includes(normalized)) return "warning";
  if (["waiting", "waiting_approval", "waiting approval"].includes(normalized)) return "purple";
  if (["resolved", "completed", "active", "assigned", "signed", "done", "good", "new", "success", "published", "enabled"].includes(normalized)) return "success";
  if (["closed", "cancelled", "draft", "disabled", "inactive", "retired", "archived"].includes(normalized)) return "neutral";
  if (["low", "open", "pending", "available", "in_inventory", "reserved", "in_repair"].includes(normalized)) return "info";
  return "info";
}

function labelize(value) {
  return trText(labelizeRaw(value));
}

function emptyState(title, body, action = "") {
  return `<div class="empty-state">${icon("empty")}<strong>${escapeHtml(title)}</strong><span>${escapeHtml(body)}</span>${action}</div>`;
}

function employeeEmptyState(title, body, actionLabel = "", actionModule = "") {
  return `
    <div class="empty-state employee-empty-state">
      ${icon("empty")}
      <strong>${escapeHtml(title)}</strong>
      <span>${escapeHtml(body)}</span>
      ${actionLabel && actionModule ? `<button class="btn btn-primary" data-add="${escapeHtml(actionModule)}">${escapeHtml(actionLabel)}</button>` : ""}
    </div>
  `;
}

function bindPageActions() {
  $("#searchBox")?.addEventListener("input", (event) => {
    state.query = event.target.value;
    state.pageIndex[state.page] = 0;
    if (state.page === "tickets" && isEmployeeUser()) state.loadMore.tickets = state.pageSize;
    const cursor = event.target.selectionStart ?? event.target.value.length;
    render();
    requestAnimationFrame(() => {
      const search = $("#searchBox");
      if (!search) return;
      search.focus();
      search.setSelectionRange(cursor, cursor);
    });
  });
  $("#filterBox")?.addEventListener("change", (event) => {
    state.filters[state.page] = event.target.value;
    state.pageIndex[state.page] = 0;
    if (state.page === "tickets" && isEmployeeUser()) state.loadMore.tickets = state.pageSize;
    render();
  });
  $$("[data-employee-reset-filters]").forEach((button) => button.addEventListener("click", () => {
    const moduleName = button.dataset.employeeResetFilters;
    state.query = "";
    state.globalQuery = "";
    delete state.filters[moduleName];
    state.pageIndex[moduleName] = 0;
    if (moduleName === "tasks") {
      state.employeeTaskStatusFilter = "open";
      localStorage.setItem("itcc.employeeTaskStatusFilter", state.employeeTaskStatusFilter);
    }
    if (moduleName === "tickets") state.loadMore.tickets = state.pageSize;
    $("#globalSearch").value = "";
    $("#menuHost").innerHTML = "";
    render();
  }));
  $$("[data-employee-task-filter]").forEach((button) => button.addEventListener("click", () => {
    state.employeeTaskStatusFilter = button.dataset.employeeTaskFilter || "open";
    localStorage.setItem("itcc.employeeTaskStatusFilter", state.employeeTaskStatusFilter);
    render();
  }));
  $$("[data-manager-ticket-filter]").forEach((select) => select.addEventListener("change", (event) => {
    state.managerTicketFilters.chart = null;
    state.managerTicketFilters.waitingReason = "";
    state.managerTicketFilters.resolvedToday = "";
    state.managerTicketFilters[event.currentTarget.dataset.managerTicketFilter] = event.currentTarget.value;
    state.ticketWorkspaceSelectedId = "";
    render();
  }));
  $("[data-clear-ticket-chart-filter]")?.addEventListener("click", () => {
    state.managerTicketFilters.chart = null;
    state.ticketWorkspaceSelectedId = "";
    render();
  });
  $$("[data-people-filter]").forEach((select) => select.addEventListener("change", (event) => {
    state.peopleWorkspaceFilters[event.currentTarget.dataset.peopleFilter] = event.currentTarget.value;
    state.peopleWorkspaceSelectedId = "";
    render();
  }));
  $$("[data-account-filter]").forEach((select) => select.addEventListener("change", (event) => {
    state.accountWorkspaceFilters[event.currentTarget.dataset.accountFilter] = event.currentTarget.value;
    state.accountWorkspaceSelectedId = "";
    render();
  }));
  $$("[data-workspace-filter]").forEach((select) => select.addEventListener("change", (event) => {
    const name = event.currentTarget.dataset.workspaceFilter;
    state.filters[name] = typeof state.filters[name] === "object" ? state.filters[name] : {};
    state.filters[name][event.currentTarget.dataset.field] = event.currentTarget.value;
    state.workspaceSelected[name] = "";
    render();
  }));
  $$("[data-workspace-select]").forEach((button) => button.addEventListener("click", () => {
    const name = button.dataset.workspaceSelect;
    state.workspaceSelected[name] = button.dataset.id;
    state.workspaceTab[name] = "Overview";
    render();
  }));
  $$("[data-workspace-tab]").forEach((button) => button.addEventListener("click", () => {
    state.workspaceTab[button.dataset.workspaceTab] = button.dataset.tab;
    render();
  }));
  $$("[data-document-files]").forEach((button) => button.addEventListener("click", () => {
    state.workspaceSelected.documents = button.dataset.documentFiles;
    state.workspaceTab.documents = "Files";
    render();
  }));
  $$("[data-contract-filter]").forEach((select) => select.addEventListener("change", (event) => {
    state.filters.contracts = typeof state.filters.contracts === "object" ? state.filters.contracts : {};
    state.filters.contracts[event.currentTarget.dataset.contractFilter] = event.currentTarget.value;
    state.workspaceSelected.contracts = "";
    render();
  }));
  $$("[data-contract-workspace-select]").forEach((button) => button.addEventListener("click", () => {
    state.workspaceSelected.contracts = button.dataset.contractWorkspaceSelect;
    state.workspaceTab.contracts = "Overview";
    render();
  }));
  $$("[data-contract-workspace-tab]").forEach((button) => button.addEventListener("click", () => {
    state.workspaceTab.contracts = button.dataset.contractWorkspaceTab;
    render();
  }));
  $$("[data-contract-workflow]").forEach((button) => button.addEventListener("click", () => openContractWorkflowDialog(button.dataset.id, button.dataset.contractWorkflow)));
  $$("[data-vendor-filter]").forEach((select) => select.addEventListener("change", (event) => {
    state.filters.vendors = typeof state.filters.vendors === "object" ? state.filters.vendors : {};
    state.filters.vendors[event.currentTarget.dataset.vendorFilter] = event.currentTarget.value;
    state.workspaceSelected.vendors = "";
    render();
  }));
  $$("[data-vendor-workspace-select]").forEach((button) => button.addEventListener("click", () => {
    state.workspaceSelected.vendors = button.dataset.vendorWorkspaceSelect;
    state.workspaceTab.vendors = "Overview";
    render();
  }));
  $$("[data-vendor-workspace-tab]").forEach((button) => button.addEventListener("click", () => {
    state.workspaceTab.vendors = button.dataset.vendorWorkspaceTab;
    render();
  }));
  $$("[data-vendor-workflow]").forEach((button) => button.addEventListener("click", () => openVendorWorkflowDialog(button.dataset.id, button.dataset.vendorWorkflow)));
  $$("[data-vendor-contact-action]").forEach((button) => button.addEventListener("click", () => handleVendorContactAction(button.dataset.id, button.dataset.contactId, button.dataset.vendorContactAction)));
  $$("[data-vendor-unlink-asset]").forEach((button) => button.addEventListener("click", () => unlinkVendorAsset(button.dataset.vendorUnlinkAsset, button.dataset.assetId)));
  $$("[data-vendor-asset-ticket]").forEach((button) => button.addEventListener("click", () => createVendorAssetTicket(button.dataset.vendorAssetTicket, button.dataset.assetId)));
  $$("[data-open-ticket]").forEach((button) => button.addEventListener("click", () => {
    state.page = "tickets";
    state.ticketWorkspaceSelectedId = button.dataset.openTicket;
    state.ticketWorkspaceTab = "Conversation";
    render();
  }));
  $$("[data-kb-filter]").forEach((select) => select.addEventListener("change", (event) => {
    state.filters.knowledge_base = typeof state.filters.knowledge_base === "object" ? state.filters.knowledge_base : {};
    state.filters.knowledge_base[event.currentTarget.dataset.kbFilter] = event.currentTarget.value;
    state.workspaceSelected.knowledge_base = "";
    render();
  }));
  $$("[data-kb-quick-filter]").forEach((button) => button.addEventListener("click", () => {
    state.filters.knowledge_base = typeof state.filters.knowledge_base === "object" ? state.filters.knowledge_base : {};
    state.filters.knowledge_base.quick = button.dataset.kbQuickFilter;
    if (button.dataset.kbQuickFilter === "Most Viewed") state.filters.knowledge_base.sort = "Most Viewed";
    if (button.dataset.kbQuickFilter === "Recently Updated") state.filters.knowledge_base.sort = "Recently Updated";
    state.workspaceSelected.knowledge_base = "";
    render();
  }));
  $$("[data-kb-workspace-select]").forEach((button) => button.addEventListener("click", () => {
    state.workspaceSelected.knowledge_base = button.dataset.kbWorkspaceSelect;
    state.workspaceTab.knowledge_base = "Overview";
    render();
  }));
  $$("[data-kb-workspace-tab]").forEach((button) => button.addEventListener("click", () => {
    state.workspaceTab.knowledge_base = button.dataset.kbWorkspaceTab;
    render();
  }));
  $$("[data-kb-preview]").forEach((button) => button.addEventListener("click", () => {
    state.workspaceSelected.knowledge_base = button.dataset.kbPreview;
    state.workspaceTab.knowledge_base = "Article";
    render();
  }));
  $$("[data-kb-workflow]").forEach((button) => button.addEventListener("click", () => openKnowledgeWorkflowDialog(button.dataset.id, button.dataset.kbWorkflow)));
  $$("[data-kb-version-open]").forEach((button) => button.addEventListener("click", () => openKnowledgeVersionDialog(button.dataset.kbVersionOpen, button.dataset.versionId)));
  $$("[data-kb-version-compare]").forEach((button) => button.addEventListener("click", () => openKnowledgeCompareDialog(button.dataset.kbVersionCompare, button.dataset.versionId || "")));
  $$("[data-kb-version-restore]").forEach((button) => button.addEventListener("click", () => restoreKnowledgeVersion(button.dataset.kbVersionRestore, button.dataset.versionId)));
  $$("[data-kb-version-download]").forEach((button) => button.addEventListener("click", () => downloadKnowledgeVersion(button.dataset.kbVersionDownload, button.dataset.versionId)));
  $$("[data-kb-toggle-editor]").forEach((button) => button.addEventListener("click", () => toggleKnowledgeEditor(button.dataset.kbToggleEditor)));
  $$("[data-kb-save-content]").forEach((button) => button.addEventListener("click", () => saveKnowledgeEditor(button.dataset.kbSaveContent)));
  $$("[data-kb-command]").forEach((button) => button.addEventListener("click", () => runKnowledgeCommand(button.dataset.kbCommand, button.dataset.value)));
  $$("[data-kb-insert-block]").forEach((button) => button.addEventListener("click", () => insertKnowledgeBlock(button.dataset.id, button.dataset.kbInsertBlock)));
  $$("[data-kb-insert-checklist]").forEach((button) => button.addEventListener("click", () => insertKnowledgeHtml(button.dataset.kbInsertChecklist, `<ul class="kb-checklist"><li><label><input type="checkbox"> Verify prerequisite</label></li><li><label><input type="checkbox"> Complete procedure</label></li></ul>`)));
  $$("[data-kb-insert-table]").forEach((button) => button.addEventListener("click", () => insertKnowledgeHtml(button.dataset.kbInsertTable, `<table class="kb-doc-table"><thead><tr><th>Item</th><th>Owner</th><th>Status</th></tr></thead><tbody><tr><td>Requirement</td><td>IT</td><td>Open</td></tr></tbody></table>`)));
  $$("[data-kb-insert-procedure]").forEach((button) => button.addEventListener("click", () => insertKnowledgeProcedure(button.dataset.kbInsertProcedure)));
  $$("[data-kb-link]").forEach((button) => button.addEventListener("click", () => insertKnowledgeLink(button.dataset.kbLink)));
  $$("[data-kb-editor]").forEach((editor) => {
    editor.addEventListener("input", () => scheduleKnowledgeAutosave(editor.dataset.kbEditor));
    editor.addEventListener("drop", handleKnowledgeDrop);
    editor.addEventListener("dragover", (event) => event.preventDefault());
  });
  $$("[data-kb-dropzone]").forEach((dropzone) => {
    dropzone.addEventListener("dragover", (event) => event.preventDefault());
    dropzone.addEventListener("drop", handleKnowledgeDrop);
  });
  $$("[data-kb-export]").forEach((button) => button.addEventListener("click", () => exportKnowledgeArticle(button.dataset.kbExport, button.dataset.format)));
  $$("[data-kb-scroll-heading]").forEach((button) => button.addEventListener("click", () => {
    document.getElementById(button.dataset.kbScrollHeading)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }));
  $$("[data-open-module]").forEach((button) => button.addEventListener("click", () => {
    state.page = button.dataset.openModule;
    if (state.page === "tickets") {
      state.ticketWorkspaceSelectedId = button.dataset.openId;
      state.ticketWorkspaceTab = "Conversation";
    } else if (state.page === "tasks" && !isEmployeeUser()) {
      state.taskWorkspaceSelectedId = button.dataset.openId;
      state.taskWorkspaceTab = "Overview";
    } else {
      state.workspaceSelected[state.page] = button.dataset.openId;
      state.workspaceTab[state.page] = "Overview";
    }
    render();
  }));
  $$("[data-download-generated]").forEach((button) => button.addEventListener("click", () => {
    const doc = rows("documents").find((item) => item.id === button.dataset.downloadGenerated);
    downloadNamedFile(doc?.fileName || doc?.signedFileName || `${doc?.title || "document"}.txt`);
  }));
  $$("[data-future-action]").forEach((button) => button.addEventListener("click", () => {
    toast("Available in a future version", button.dataset.futureAction || "This action is available in a future version.");
  }));
  $$("[data-asset-filter]").forEach((select) => select.addEventListener("change", (event) => {
    state.filters.assets = typeof state.filters.assets === "object" ? state.filters.assets : {};
    state.filters.assets[event.currentTarget.dataset.assetFilter] = event.currentTarget.value;
    state.workspaceSelected.assets = "";
    state.assetWorkspaceDraft = null;
    render();
  }));
  $$("[data-asset-workspace-select]").forEach((button) => button.addEventListener("click", () => {
    state.workspaceSelected.assets = button.dataset.assetWorkspaceSelect;
    state.workspaceTab.assets = "Overview";
    state.assetWorkspaceDraft = null;
    render();
  }));
  $$("[data-asset-workspace-tab]").forEach((button) => button.addEventListener("click", () => {
    state.workspaceTab.assets = button.dataset.assetWorkspaceTab;
    render();
  }));
  $$("[data-asset-draft-field]").forEach((input) => input.addEventListener("input", (event) => updateAssetWorkspaceDraft(event.currentTarget)));
  $$("[data-asset-draft-field]").forEach((input) => input.addEventListener("change", (event) => updateAssetWorkspaceDraft(event.currentTarget)));
  $("[data-asset-management-form]")?.addEventListener("submit", saveAssetWorkspaceChanges);
  $$("[data-asset-workflow]").forEach((button) => button.addEventListener("click", () => openAssetWorkflowDialog(button.dataset.id, button.dataset.assetWorkflow)));
  $$("[data-asset-transfer-action]").forEach((button) => button.addEventListener("click", () => openAssetTransferAction(button.dataset.id, button.dataset.assetTransferAction)));
  $$("[data-print-asset-label]").forEach((button) => button.addEventListener("click", () => {
    const asset = rows("assets").find((item) => item.id === button.dataset.printAssetLabel);
    toast("Asset label ready", `${asset?.assetNumber || "Asset"} label can be printed from the browser print dialog when label templates are enabled.`);
  }));
  $$("[data-people-workspace-select]").forEach((button) => button.addEventListener("click", () => {
    state.peopleWorkspaceSelectedId = button.dataset.peopleWorkspaceSelect;
    state.peopleWorkspaceTab = "Overview";
    render();
  }));
  $$("[data-account-workspace-select]").forEach((button) => button.addEventListener("click", () => {
    state.accountWorkspaceSelectedId = button.dataset.accountWorkspaceSelect;
    state.accountWorkspaceTab = "Overview";
    render();
  }));
  $$("[data-people-workspace-tab]").forEach((button) => button.addEventListener("click", () => {
    state.peopleWorkspaceTab = button.dataset.peopleWorkspaceTab;
    render();
  }));
  $$("[data-account-workspace-tab]").forEach((button) => button.addEventListener("click", () => {
    state.accountWorkspaceTab = button.dataset.accountWorkspaceTab;
    render();
  }));
  $$("[data-ticket-workspace-select]").forEach((button) => button.addEventListener("click", () => {
    state.ticketWorkspaceSelectedId = button.dataset.ticketWorkspaceSelect;
    state.ticketWorkspaceTab = "Conversation";
    state.ticketWorkspaceDraft = null;
    state.ticketWorkspaceComposeInternal = false;
    render();
  }));
  $$("[data-ticket-workspace-tab]").forEach((button) => button.addEventListener("click", () => {
    state.ticketWorkspaceTab = button.dataset.ticketWorkspaceTab;
    render();
  }));
  $$("[data-ticket-workspace-compose]").forEach((button) => button.addEventListener("click", () => {
    state.ticketWorkspaceComposeInternal = button.dataset.ticketWorkspaceCompose === "internal";
    state.ticketWorkspaceTab = "Conversation";
    render();
  }));
  $$("[data-ticket-upload]").forEach((button) => button.addEventListener("click", () => openTicketComposerUpload(button.dataset.ticketUpload)));
  $$("[data-ticket-link-asset]").forEach((button) => button.addEventListener("click", () => openTicketLinkAssetDialog(button.dataset.ticketLinkAsset)));
  $$("[data-ticket-attachments]").forEach((button) => button.addEventListener("click", () => openTicketAttachments(button.dataset.ticketAttachments)));
  $$("[data-ticket-draft-field]").forEach((select) => select.addEventListener("change", (event) => {
    const ticket = rows("tickets").find((item) => item.id === state.ticketWorkspaceSelectedId);
    if (!ticket) return;
    updateTicketWorkspaceDraft(ticket, event.currentTarget.dataset.ticketDraftField, event.currentTarget.value);
    render();
  }));
  $$("[data-ticket-composer-mode]").forEach((button) => button.addEventListener("click", () => {
    const form = button.closest("form");
    const internal = button.dataset.ticketComposerMode === "internal";
    form.querySelector("[data-ticket-composer-internal]").checked = internal;
    form.classList.toggle("is-internal", internal);
    $$("[data-ticket-composer-mode]", form).forEach((item) => item.classList.toggle("active", item === button));
  }));
  $$("[data-clear-filters]").forEach((button) => button.addEventListener("click", () => {
    const scope = button.dataset.clearFilters;
    state.query = "";
    state.globalQuery = "";
    if (scope === "tickets") {
      state.managerTicketFilters = { status: "", priority: "", assignee: "", category: "", waitingReason: "", resolvedToday: "", chart: null };
      state.ticketWorkspaceSelectedId = "";
    }
    if (scope === "tasks") {
      state.filters.tasks = {};
      state.taskWorkspaceSelectedId = "";
    }
    render();
  }));
  $$("[data-task-filter]").forEach((select) => select.addEventListener("change", (event) => {
    const filters = taskFilters();
    filters[event.currentTarget.dataset.taskFilter] = event.currentTarget.value;
    state.taskWorkspaceSelectedId = "";
    render();
  }));
  $$("[data-task-quick-filter]").forEach((button) => button.addEventListener("click", () => {
    const filters = taskFilters();
    filters.quick = button.dataset.taskQuickFilter;
    state.taskWorkspaceSelectedId = "";
    render();
  }));
  $$("[data-task-workspace-select]").forEach((button) => button.addEventListener("click", () => {
    state.taskWorkspaceSelectedId = button.dataset.taskWorkspaceSelect;
    state.taskWorkspaceTab = "Overview";
    render();
  }));
  $$("[data-task-workspace-tab]").forEach((button) => button.addEventListener("click", () => {
    state.taskWorkspaceTab = button.dataset.taskWorkspaceTab;
    render();
  }));
  $$("[data-task-workflow]").forEach((button) => button.addEventListener("click", () => openTaskWorkflowDialog(button.dataset.taskWorkflow, button.dataset.workflow)));
  $$("[data-task-subtask-form]").forEach((form) => form.addEventListener("submit", submitTaskSubtask));
  $$("[data-task-notes-form]").forEach((form) => form.addEventListener("submit", submitTaskNotes));
  wireTwoFactorPanel();
  wireFormSaveState($("[data-preferences-form]"));
  $("[data-preferences-form]")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form).entries());
    await runFormSave(form, async () => {
      saveUserPreferences(values);
      state.lang = values.language;
      localStorage.setItem("itcc.lang", state.lang);
      setAppearanceMode(values.theme);
    });
    toast("Preferences saved", "Your workspace preferences were updated.");
    render();
    flashFormSaved("[data-preferences-form]");
  });
  wireFormSaveState($("[data-notification-preferences-form]"));
  $("[data-notification-preferences-form]")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const preferences = Object.fromEntries(["tickets", "tasks", "assets", "contracts", "vendors"].map((key) => [key, form.elements[key].checked]));
    try {
      await runFormSave(form, () => api("/api/preferences/notifications", { method: "PATCH", body: JSON.stringify(preferences) }));
      await loadState();
      toast("Notifications saved", "Your notification preferences were updated.");
      render();
      flashFormSaved("[data-notification-preferences-form]");
    } catch (error) {
      toast("Could not save preferences", error.message);
    }
  });
  $$("[data-settings-tab]").forEach((button) => button.addEventListener("click", () => {
    state.settingsTab = button.dataset.settingsTab;
    render();
  }));
  wireFormSaveState($("[data-ticket-assignment-form]"));
  $("[data-ticket-assignment-form]")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const categoryAssignees = {};
    const categoryRoutes = {};
    for (const [key, value] of data.entries()) {
      if (key.startsWith("categoryRoute:") && value) {
        const category = key.slice("categoryRoute:".length).trim().toLowerCase();
        const [type, id] = String(value).split(":");
        if (category && type && id) {
          categoryRoutes[category] = { type, id };
          if (type === "user") categoryAssignees[category] = id;
        }
      }
    }
    try {
      await runFormSave(form, () => api("/api/settings/ticket-assignment", {
        method: "PATCH",
        body: JSON.stringify({
          enabled: form.elements.enabled.checked,
          strategy: data.get("strategy") || "manual",
          fallbackAssigneeId: data.get("fallbackAssigneeId") || "",
          categoryAssignees,
          categoryRoutes
        })
      }));
      toast("Ticket assignment saved", "New tickets will follow the updated V1 assignment rules.");
      await loadState();
      render();
      flashFormSaved("[data-ticket-assignment-form]");
    } catch (error) {
      toast("Could not save assignment settings", error.message);
    }
  });
  $("[data-reset-ticket-assignment]")?.addEventListener("click", async () => {
    try {
      await api("/api/settings/ticket-assignment", {
        method: "PATCH",
        body: JSON.stringify({ enabled: false, strategy: "manual", fallbackAssigneeId: "", categoryAssignees: {}, categoryRoutes: {} })
      });
      toast("Ticket assignment reset", "New tickets will stay unassigned until rules are enabled again.");
      await loadState();
      render();
    } catch (error) {
      toast("Could not reset assignment settings", error.message);
    }
  });
  $("[data-assignment-group-form]")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const groupId = data.get("id") || "";
    const memberSelect = form.elements.memberUserIds;
    const memberUserIds = Array.from(memberSelect?.selectedOptions || []).map((option) => option.value).filter(Boolean);
    try {
      await api(groupId ? `/api/assignment_groups/${groupId}` : "/api/assignment_groups", {
        method: groupId ? "PATCH" : "POST",
        body: JSON.stringify({
          name: data.get("name"),
          description: data.get("description"),
          groupType: data.get("groupType"),
          leadUserId: data.get("leadUserId"),
          memberUserIds,
          active: form.elements.active.checked,
          canReceiveTickets: form.elements.canReceiveTickets.checked,
          assignmentMethod: data.get("assignmentMethod")
        })
      });
      state.assignmentGroupEditingId = "";
      toast(groupId ? "Assignment group saved" : "Assignment group created", "Ticket routing groups were updated.");
      await loadState();
      render();
    } catch (error) {
      toast("Could not save assignment group", error.message);
    }
  });
  $("[data-cancel-assignment-group-edit]")?.addEventListener("click", () => {
    state.assignmentGroupEditingId = "";
    render();
  });
  $$("[data-edit-assignment-group]").forEach((button) => button.addEventListener("click", () => {
    state.assignmentGroupEditingId = button.dataset.editAssignmentGroup;
    state.settingsTab = "assignment_groups";
    render();
  }));
  $$("[data-archive-assignment-group]").forEach((button) => button.addEventListener("click", async () => {
    const group = rows("assignmentGroups").find((item) => item.id === button.dataset.archiveAssignmentGroup);
    if (!group || group.active === false) return;
    try {
      await api(`/api/assignment_groups/${group.id}`, { method: "PATCH", body: JSON.stringify({ ...group, active: false }) });
      toast("Assignment group set inactive", "Inactive groups no longer receive new tickets.");
      await loadState();
      render();
    } catch (error) {
      toast("Could not update group", error.message);
    }
  }));
  $$("[data-add]").forEach((button) => button.addEventListener("click", () => openModal(button.dataset.add)));
  $$("[data-command-create]").forEach((button) => button.addEventListener("click", () => openModal(button.dataset.commandCreate)));
  $$("[data-quick-create]").forEach((button) => button.addEventListener("click", () => openQuickCreate(button)));
  $$("[data-edit]").forEach((button) => button.addEventListener("click", () => openModal(button.dataset.edit, rows(button.dataset.edit).find((item) => item.id === button.dataset.id))));
  $$("[data-create-person-account]").forEach((button) => button.addEventListener("click", () => openAccountForPerson(button.dataset.createPersonAccount)));
  $$("[data-open-linked-account]").forEach((button) => button.addEventListener("click", () => openAccountWorkspace(button.dataset.openLinkedAccount)));
  $$("[data-open-linked-person]").forEach((button) => button.addEventListener("click", () => openPeopleWorkspace(button.dataset.openLinkedPerson)));
  $$("[data-reset-user-password]").forEach((button) => button.addEventListener("click", () => resetUserPassword(button.dataset.resetUserPassword)));
  $$("[data-disable-user-account]").forEach((button) => button.addEventListener("click", () => disableUserAccount(button.dataset.disableUserAccount)));
  $$("[data-unlock-user-account]").forEach((button) => button.addEventListener("click", () => unlockUserAccount(button.dataset.unlockUserAccount)));
  $$("[data-change-user-role]").forEach((button) => button.addEventListener("click", () => changeUserRole(button.dataset.changeUserRole)));
  $$("[data-dashboard-ticket-filter]").forEach((button) => button.addEventListener("click", () => {
    state.dashboardTicketFilter = button.dataset.dashboardTicketFilter;
    render();
  }));
  $$("[data-dashboard-activity-filter]").forEach((button) => button.addEventListener("click", () => {
    state.dashboardActivityFilter = button.dataset.dashboardActivityFilter;
    render();
  }));
  $$("[data-customize-dashboard]").forEach((button) => button.addEventListener("click", () => openDashboardCustomizeDialog()));
  $$("[data-dashboard-open-filter]").forEach((button) => button.addEventListener("click", () => {
    navigateToDashboardFilter(button.dataset.dashboardOpenFilter);
  }));
  $$("[data-notification-filter]").forEach((button) => button.addEventListener("click", () => {
    state.notificationFilter = button.dataset.notificationFilter;
    render();
  }));
  $$("[data-withdraw-ticket]").forEach((button) => button.addEventListener("click", async () => {
    const reason = await withdrawTicketDialog();
    if (reason === null) return;
    try {
      await api(`/api/tickets/${button.dataset.withdrawTicket}`, { method: "PATCH", body: JSON.stringify({ status: "cancelled", withdrawalReason: reason }) });
      toast("Request withdrawn", "Your request was cancelled and its history was preserved.");
      await loadState();
      render();
    } catch (error) {
      toast("Could not withdraw request", error.message);
    }
  }));
  $$("[data-view]").forEach((button) => button.addEventListener("click", () => openDetail(button.dataset.view, rows(button.dataset.view).find((item) => item.id === button.dataset.id))));
  $$("[data-page-jump]").forEach((button) => button.addEventListener("click", () => navigateToPage(button.dataset.pageJump)));
  $$("[data-back-to-list]").forEach((button) => button.addEventListener("click", () => { setHomeRoute(); state.detail = null; render(); }));
  $$("[data-detail-tab]").forEach((button) => button.addEventListener("click", () => { state.detail.tab = button.dataset.detailTab; render(); }));
  $$("[data-ticket-status-select]").forEach((select) => select.addEventListener("change", (event) => {
    const form = event.currentTarget.closest("form");
    form.querySelector("[data-ticket-waiting-reason]").classList.toggle("hidden", event.currentTarget.value !== "waiting");
    form.querySelector("[data-ticket-cancel-reason]").classList.toggle("hidden", event.currentTarget.value !== "cancelled");
  }));
  $$("[data-ticket-management-form]").forEach((form) => form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const ticket = rows("tickets").find((item) => item.id === event.currentTarget.dataset.ticketManagementForm);
    const draft = ticket && ticketWorkspaceDraft(ticket);
    if (!ticket || !draft?.dirty) return;
    if (draft.status === "waiting" && !draft.waitingReason) return toast("Waiting reason required", "Select why the ticket is waiting before saving.");
    if (draft.status === "cancelled" && !draft.cancelReason) return toast("Cancel reason required", "Select why the ticket is being cancelled before saving.");
    const changes = ["assignedToId", "status", "priority", "waitingReason", "cancelReason"].filter((key) => String(draft[key] || "") !== String(ticket[key] || ""));
    const confirmed = await confirmTicketChanges(ticket, draft, changes);
    if (!confirmed) return;
    const payload = Object.fromEntries(changes.map((key) => [key, draft[key]]));
    try {
      await api(`/api/tickets/${ticket.id}`, { method: "PATCH", body: JSON.stringify(payload) });
      state.ticketWorkspaceDraft = null;
      toast("Saved", "Ticket changes were saved.");
      await loadState(); render();
    } catch (error) { toast("Could not save changes", error.message); }
  }));
  $$("[data-restore]").forEach((button) => button.addEventListener("click", async () => {
    await api(`/api/${button.dataset.restore}/${button.dataset.id}/restore`, { method: "PATCH", body: "{}" });
    toast("Restored", "The record is active again.");
    await loadState();
    render();
  }));
  $$("[data-read-notifications]").forEach((button) => button.addEventListener("click", async () => {
    await api("/api/notifications/read-all", { method: "PATCH", body: "{}" });
    toast("Notifications updated", "All visible notifications were marked read.");
    await loadState();
    render();
  }));
  $$("[data-notification-read]").forEach((button) => button.addEventListener("click", async () => {
    await Promise.all(button.dataset.notificationRead.split(",").map((idValue) => api(`/api/notifications/${idValue}/read`, { method: "PATCH", body: "{}" })));
    await loadState();
    render();
  }));
  $$("[data-notification-delete]").forEach((button) => button.addEventListener("click", async () => {
    await Promise.all(button.dataset.notificationDelete.split(",").map((idValue) => api(`/api/notifications/${idValue}`, { method: "DELETE" })));
    await loadState();
    render();
  }));
  $$("[data-notification-open]").forEach((button) => button.addEventListener("click", async () => {
    const ids = button.dataset.notificationOpen.split(",");
    const item = userNotifications().find((notification) => notification.id === ids[0]);
    if (!item) return;
    const unreadIds = userNotifications().filter((notification) => ids.includes(notification.id) && notification.unread).map((notification) => notification.id);
    if (unreadIds.length) await Promise.all(unreadIds.map((idValue) => api(`/api/notifications/${idValue}/read`, { method: "PATCH", body: "{}" })));
    await loadState();
    if (button.dataset.notificationModule) {
      state.page = button.dataset.notificationModule;
      state.detail = null;
      setHomeRoute();
      return render();
    }
    const resource = notificationResource(item);
    const row = rows(resource).find((record) => record.id === item.entityId);
    if (row) return openDetail(resource, row);
    state.page = resource;
    state.detail = null;
    setHomeRoute();
    render();
  }));
  $$("[data-lookup-move]").forEach((button) => button.addEventListener("click", async () => {
    await moveLookupItem(button.dataset.id, button.dataset.lookupMove);
  }));
  $$("[data-archive]").forEach((button) => button.addEventListener("click", async () => {
    const ok = await confirmDialog("Archive record?", "This keeps history and audit logs intact. The record will disappear from active views.");
    if (!ok) return;
    await api(`/api/${button.dataset.archive}/${button.dataset.id}/archive`, { method: "PATCH", body: "{}" });
    toast("Archived", "The record was archived and logged.");
    await loadState();
    render();
  }));
  $$("[data-trash]").forEach((button) => button.addEventListener("click", async () => {
    const ok = await confirmDialog("Move to trash?", "This removes the record from active and archived views. It can still be restored from Trash Bin.");
    if (!ok) return;
    await api(`/api/${button.dataset.trash}/${button.dataset.id}/trash`, { method: "PATCH", body: "{}" });
    toast("Moved to trash", "The record is now in Trash Bin.");
    state.detail = null;
    setHomeRoute();
    await loadState();
    render();
  }));
  $$("[data-permanent-delete]").forEach((button) => button.addEventListener("click", async () => {
    const ok = await confirmDialog("Permanently delete?", "This cannot be restored. Use only for records intentionally removed from V1.");
    if (!ok) return;
    await api(`/api/${button.dataset.permanentDelete}/${button.dataset.id}/permanent-delete`, { method: "PATCH", body: "{}" });
    toast("Permanently deleted", "The record was removed from Trash Bin.");
    await loadState();
    render();
  }));
  $$("[data-people-actions]").forEach((button) => button.addEventListener("click", (event) => openPeopleActionsMenu(event.currentTarget)));
  $$("[data-import-people]").forEach((button) => button.addEventListener("click", openPeopleImportDialog));
  $$("[data-export-people]").forEach((button) => button.addEventListener("click", exportPeopleWorkbook));
  $$("[data-export]").forEach((button) => button.addEventListener("click", () => exportRows(button.dataset.export)));
  $$("[data-columns]").forEach((button) => button.addEventListener("click", () => openColumns(button.dataset.columns, button)));
  $$("[data-sort]").forEach((button) => button.addEventListener("click", () => {
    const sort = state.sort[button.dataset.sort] || {};
    state.sort[button.dataset.sort] = { key: button.dataset.key, dir: sort.key === button.dataset.key && sort.dir === "asc" ? "desc" : "asc" };
    render();
  }));
  $$("[data-page-prev]").forEach((button) => button.addEventListener("click", () => { state.pageIndex[button.dataset.pagePrev] = Math.max(0, (state.pageIndex[button.dataset.pagePrev] || 0) - 1); render(); }));
  $$("[data-page-next]").forEach((button) => button.addEventListener("click", () => { state.pageIndex[button.dataset.pageNext] = (state.pageIndex[button.dataset.pageNext] || 0) + 1; render(); }));
 $$("[data-load-more]").forEach((button) => button.addEventListener("click", () => loadMore(button.dataset.loadMore)));
  $$("[data-task-view]").forEach((button) => button.addEventListener("click", () => { state.taskView = button.dataset.taskView; localStorage.setItem("itcc.taskView", state.taskView); render(); }));
  $$("[data-calendar-mode]").forEach((button) => button.addEventListener("click", () => { state.calendarView = button.dataset.calendarMode; localStorage.setItem("itcc.calendarView", state.calendarView); render(); }));
  $$("[data-calendar-nav]").forEach((button) => button.addEventListener("click", () => { moveCalendar(button.dataset.calendarNav); render(); }));
  $$("[data-calendar-date]").forEach((button) => button.addEventListener("click", () => openModal("tasks", null, { dueDate: button.dataset.calendarDate })));
 $$("[data-calendar-task]").forEach((button) => button.addEventListener("click", (event) => { event.stopPropagation(); openDetail("tasks", rows("tasks").find((task) => task.id === button.dataset.calendarTask)); }));
  $$("[data-calendar-more]").forEach((button) => button.addEventListener("click", (event) => { event.stopPropagation(); openCalendarDayPopover(button.dataset.calendarMore); }));
 $$("[data-task-status]").forEach((select) => select.addEventListener("change", async () => updateTaskStatus(select.dataset.taskStatus, select.value)));
  $$("[data-task-status-click]").forEach((button) => button.addEventListener("click", async () => updateTaskStatus(button.dataset.taskStatusClick, button.dataset.status)));
  $$("[data-task-restore]").forEach((button) => button.addEventListener("click", async () => updateTaskStatus(button.dataset.taskRestore, "Pending")));
  $$("[data-kb-feedback]").forEach((button) => button.addEventListener("click", () => recordKbFeedback(button.dataset.kbFeedback, button.dataset.value)));
  $$("[data-kb-favorite]").forEach((button) => button.addEventListener("click", () => recordKnowledgeSelfService(button.dataset.kbFavorite, "favorite", "Favorite updated")));
  $$("[data-kb-share]").forEach((button) => button.addEventListener("click", () => shareKnowledgeArticle(button.dataset.kbShare)));
  $$("[data-kb-print]").forEach((button) => button.addEventListener("click", () => printKnowledgeArticle(button.dataset.kbPrint)));
  $$("[data-kb-solved]").forEach((button) => button.addEventListener("click", () => recordKnowledgeSelfService(button.dataset.kbSolved, "ticket_prevented", "Glad it helped")));
  $$("[data-kb-open-ticket]").forEach((button) => button.addEventListener("click", () => openTicketFromKnowledge(button.dataset.kbOpenTicket)));
  $$("[data-employee-kb-filter]").forEach((button) => button.addEventListener("click", () => { state.employeeKbFilter = button.dataset.employeeKbFilter; render(); }));
  $$("[data-comment-form]").forEach((form) => form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const text = data.get("body");
    const file = form.elements.file?.files?.[0];
    if (!text && !file) return;
    await api("/api/comments", { method: "POST", body: JSON.stringify({ entityType: singular(form.dataset.commentForm), entityId: form.dataset.id, body: text || `Uploaded ${file.name}`, attachmentName: file?.name || data.get("attachmentName") || "", internal: data.get("internal") === "on" }) });
    if (file) {
      const content = await readFileData(file);
      await api("/api/attachments", { method: "POST", body: JSON.stringify({ entityType: singular(form.dataset.commentForm), entityId: form.dataset.id, filename: file.name, mimeType: file.type || mimeForName(file.name), size: file.size, content }) });
    }
    toast("Comment added", "The discussion was updated.");
    if (form.dataset.commentForm === "tickets" && !isEmployeeUser()) state.ticketWorkspaceComposeInternal = false;
    await loadState();
    render();
  }));
  $$("[data-reply-form]").forEach((form) => form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const body = Object.fromEntries(new FormData(form).entries());
    if (!body.body) return;
    const detail = state.detail || { name: "tickets", id: state.ticketWorkspaceSelectedId };
    await api("/api/comments", { method: "POST", body: JSON.stringify({ entityType: singular(detail.name), entityId: detail.id, parentId: form.dataset.replyForm, body: body.body, attachmentName: body.attachmentName || "" }) });
    toast("Reply added", "The thread was updated.");
    await loadState();
    render();
  }));
  $$("[data-edit-comment-form]").forEach((form) => form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const comment = state.db.comments.find((item) => item.id === form.dataset.editCommentForm);
    const body = Object.fromEntries(new FormData(form).entries());
    if (!comment || !body.body) return;
    await api(`/api/comments/${comment.id}`, { method: "PATCH", body: JSON.stringify({ body: body.body, attachmentName: body.attachmentName || "" }) });
    toast("Comment updated", "Your edit was saved.");
    await loadState();
    render();
  }));
  $$("[data-upload-form]").forEach((form) => form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const file = form.elements.file.files[0];
    if (!file) return;
    const content = await readFileData(file);
    await api("/api/attachments", { method: "POST", body: JSON.stringify({ entityType: singular(form.dataset.uploadForm), entityId: form.dataset.id, filename: file.name, mimeType: file.type || mimeForName(file.name), size: file.size, content }) });
    toast("Attachment uploaded", `${file.name} is linked to this record.`);
    await loadState();
    render();
  }));
  $$("[data-download-attachment]").forEach((button) => button.addEventListener("click", () => downloadAttachment(button.dataset.downloadAttachment)));
  $$("[data-preview-attachment]").forEach((button) => button.addEventListener("click", () => previewAttachment(button.dataset.previewAttachment)));
  $$("[data-download-file]").forEach((button) => button.addEventListener("click", () => downloadNamedFile(button.dataset.downloadFile)));
  $$("[data-download-kb-file]").forEach((button) => button.addEventListener("click", () => downloadNamedFile(button.dataset.downloadKbFile)));
  $$("[data-preview-kb-file]").forEach((button) => button.addEventListener("click", () => previewNamedFile(button.dataset.previewKbFile)));
}

async function moveLookupItem(id, direction) {
  const item = rows("lookup_items").find((row) => row.id === id);
  if (!item) return;
  const group = rows("lookup_items").filter((row) => row.type === item.type).sort((a, b) => Number(a.sortOrder || 0) - Number(b.sortOrder || 0));
  const index = group.findIndex((row) => row.id === id);
  const swap = group[index + (direction === "up" ? -1 : 1)];
  if (!swap) return;
  const currentOrder = Number(item.sortOrder || index + 1);
  const swapOrder = Number(swap.sortOrder || index + 1);
  await api(`/api/lookup_items/${item.id}`, { method: "PATCH", body: JSON.stringify({ sortOrder: swapOrder }) });
  await api(`/api/lookup_items/${swap.id}`, { method: "PATCH", body: JSON.stringify({ sortOrder: currentOrder }) });
  toast("Lookup reordered", `${lookupLabel(item)} moved ${direction}.`);
  await loadState();
  render();
}

function loadMore(name) {
  state.loadMore[name] = (state.loadMore[name] || state.pageSize) + state.pageSize;
  render();
}

async function updateTaskStatus(id, status) {
  if (!has("tasks", "edit")) return toast("Not allowed", "You do not have permission to update this task.");
  const current = rows("tasks").find((task) => task.id === id);
  const nextStatus = employeeTaskApiStatus(status);
  const nextFilterStatus = normalizeEmployeeTaskStatus(nextStatus);
  if (normalizeEmployeeTaskStatus(current?.status) === nextFilterStatus) return;
  if (nextFilterStatus === "completed") {
    const ok = await confirmDialog("Mark this task as completed?", "This only changes the task status. It will remain visible in My Tasks.", { confirmLabel: "Complete", confirmClass: "btn-primary" });
    if (!ok) return;
  }
  if (nextFilterStatus === "cancelled") {
    const ok = await confirmDialog("Cancel this task?", "This only changes the task status. It will remain visible in My Tasks.", { cancelLabel: "Keep task", confirmLabel: "Cancel task", confirmClass: "btn-danger" });
    if (!ok) return;
  }
  await api(`/api/tasks/${id}`, { method: "PATCH", body: JSON.stringify({ status: nextStatus }) });
  const visibleInCurrentFilter = filterEmployeeTasksByStatus([{ ...(current || {}), status: nextStatus }]).length > 0;
  const displayStatus = employeeTaskStatusLabel(nextStatus);
  toast("Task updated", visibleInCurrentFilter ? `Status changed to ${displayStatus}.` : `Task updated and moved to ${displayStatus}.`);
  await loadState();
  render();
}

async function openTaskWorkflowDialog(id, workflow) {
  const task = rows("tasks").find((item) => item.id === id);
  if (!task) return;
  if (workflow === "assign") return openTaskAssignDialog(task);
  if (workflow === "reminder") return openTaskReminderDialog(task);
  if (workflow === "subtask") { state.taskWorkspaceTab = "Subtasks"; render(); return; }
  if (workflow === "duplicate") return duplicateTask(task);
  if (workflow === "ticket") return convertTaskToTicket(task);
  if (workflow === "archive") {
    const ok = await confirmDialog("Archive this task?", "Archived tasks are removed from the active workspace and can be restored from Archive Center.", { confirmLabel: "Archive", confirmClass: "btn-warning" });
    if (!ok) return;
    await api(`/api/tasks/${task.id}/archive`, { method: "PATCH", body: "{}" });
    toast("Task archived", "The task moved to Archive Center.");
    await loadState(); render(); return;
  }
  const statusMap = { start: "in_progress", pause: "waiting", complete: "completed", cancel: "cancelled" };
  const nextStatus = statusMap[workflow];
  if (!nextStatus) return;
  const copy = { start: "Start this task?", pause: "Pause this task?", complete: "Mark this task as completed?", cancel: "Cancel this task?" }[workflow];
  const ok = await confirmDialog(copy, "The task timeline, audit history, and notifications will be updated.", { confirmLabel: workflow === "complete" ? "Complete" : workflow === "cancel" ? "Cancel task" : "Confirm", confirmClass: workflow === "cancel" ? "btn-danger" : "btn-primary" });
  if (!ok) return;
  await api(`/api/tasks/${task.id}/workflow`, { method: "PATCH", body: JSON.stringify({ workflow, status: nextStatus }) });
  toast("Task updated", `Status changed to ${labelize(nextStatus)}.`);
  await loadState(); render();
}

function openTaskAssignDialog(task) {
  const users = rows("users");
  $("#dialogHost").innerHTML = `<div class="modal-backdrop"><form class="confirm-card surface-card task-workflow-modal" data-task-assign-dialog="${task.id}"><p class="eyebrow">Task workflow</p><h3>Assign Task</h3><label>Assigned To<select name="assignedToId" required><option value="">Select user</option>${users.map((user) => `<option value="${user.id}" ${task.assignedToId === user.id ? "selected" : ""}>${escapeHtml(user.name)}</option>`).join("")}</select></label><label>Owner<select name="ownerId"><option value="">Keep owner</option>${users.map((user) => `<option value="${user.id}" ${task.ownerId === user.id ? "selected" : ""}>${escapeHtml(user.name)}</option>`).join("")}</select></label><label>Notes<textarea name="notes" placeholder="Assignment note"></textarea></label><div class="modal-actions"><button class="btn btn-secondary" type="button" data-dialog-close>Cancel</button><button class="btn btn-primary" type="submit">Assign</button></div></form></div>`;
  $("[data-dialog-close]")?.addEventListener("click", () => $("#dialogHost").innerHTML = "");
  $("[data-task-assign-dialog]")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(event.currentTarget).entries());
    await api(`/api/tasks/${task.id}/workflow`, { method: "PATCH", body: JSON.stringify({ workflow: "assign", ...values }) });
    $("#dialogHost").innerHTML = "";
    toast("Task assigned", "Assignment was saved.");
    await loadState(); render();
  });
}

function openTaskReminderDialog(task) {
  const options = ["At due time", "1 day before", "3 days before", "7 days before", "Custom"];
  $("#dialogHost").innerHTML = `<div class="modal-backdrop"><form class="confirm-card surface-card task-workflow-modal" data-task-reminder-dialog="${task.id}"><p class="eyebrow">Task workflow</p><h3>Set Reminder</h3><label>Reminder<select name="reminder">${options.map((item) => `<option value="${escapeHtml(item)}" ${task.reminder === item ? "selected" : ""}>${escapeHtml(item)}</option>`).join("")}</select></label><label>Custom date<input name="reminderDate" type="date" value="${escapeHtml(task.reminderDate || "")}"></label><div class="modal-actions"><button class="btn btn-secondary" type="button" data-dialog-close>Cancel</button><button class="btn btn-primary" type="submit">Save Reminder</button></div></form></div>`;
  $("[data-dialog-close]")?.addEventListener("click", () => $("#dialogHost").innerHTML = "");
  $("[data-task-reminder-dialog]")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    await api(`/api/tasks/${task.id}/workflow`, { method: "PATCH", body: JSON.stringify({ workflow: "reminder", ...Object.fromEntries(new FormData(event.currentTarget).entries()) }) });
    $("#dialogHost").innerHTML = "";
    toast("Reminder set", "Task reminder was saved.");
    await loadState(); render();
  });
}

async function submitTaskSubtask(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const taskId = form.dataset.taskSubtaskForm;
  const values = Object.fromEntries(new FormData(form).entries());
  await api(`/api/tasks/${taskId}/workflow`, { method: "PATCH", body: JSON.stringify({ workflow: "subtask", ...values }) });
  toast("Subtask added", "Parent task progress was recalculated.");
  await loadState(); render();
}

async function submitTaskNotes(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const taskId = form.dataset.taskNotesForm;
  const values = Object.fromEntries(new FormData(form).entries());
  await api(`/api/tasks/${taskId}/workflow`, { method: "PATCH", body: JSON.stringify({ workflow: "notes", notes: values.notes || "" }) });
  toast("Notes saved", "Task notes were updated.");
  await loadState(); render();
}

async function duplicateTask(task) {
  const ok = await confirmDialog("Duplicate this task?", "A new pending copy will be created with the same schedule and related record.");
  if (!ok) return;
  const copy = { ...task, title: `${task.title || "Task"} copy`, status: "pending", progress: 0 };
  delete copy.id; delete copy.createdAt; delete copy.updatedAt; delete copy.archivedAt; delete copy.deletedAt; delete copy.taskNumber;
  await api("/api/tasks", { method: "POST", body: JSON.stringify(copy) });
  toast("Task duplicated", "A new task copy was created.");
  await loadState(); render();
}

async function convertTaskToTicket(task) {
  const ok = await confirmDialog("Convert task to ticket?", "A ticket will be created and linked back to this task.");
  if (!ok) return;
  const requester = rows("employees")[0]?.id || "";
  const ticket = await api("/api/tickets", { method: "POST", body: JSON.stringify({ requesterId: requester, category: "General / Other requests", priority: task.priority || "medium", description: task.description || task.notes || task.title, relatedType: "task", relatedId: task.id }) });
  await api(`/api/tasks/${task.id}/workflow`, { method: "PATCH", body: JSON.stringify({ workflow: "link_ticket", relatedTicketId: ticket.id }) });
  toast("Ticket created", `${ticket.ticketNumber || "Ticket"} was created from the task.`);
  await loadState(); render();
}

function maybeLoadMoreOnScroll() {
  if (!(state.page === "tickets" && isEmployeeUser()) || state.detail) return;
  const data = collection("tickets");
  const visible = state.loadMore.tickets || state.pageSize;
  if (visible >= data.length) return;
  const nearBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 220;
  if (nearBottom) loadMore("tickets");
}

function isRtl() {
  return document.documentElement.dir === "rtl" || document.body.dir === "rtl";
}

function anchorFloatingMenu(menu, anchor, options = {}) {
  if (!menu) return;
  const anchorEl = anchor || document.activeElement;
  const width = options.width || menu.getBoundingClientRect().width || 280;
  const gap = options.gap ?? 8;
  const margin = options.margin ?? 12;
  let top = options.top ?? 70;
  let left = isRtl() ? margin : Math.max(margin, window.innerWidth - width - margin);
  if (anchorEl?.getBoundingClientRect) {
    const rect = anchorEl.getBoundingClientRect();
    top = rect.bottom + gap;
    left = isRtl() ? rect.left : rect.right - width;
  }
  const maxLeft = Math.max(margin, window.innerWidth - width - margin);
  menu.style.setProperty("position", "fixed", "important");
  menu.style.setProperty("top", `${Math.max(margin, Math.min(top, window.innerHeight - margin))}px`, "important");
  menu.style.setProperty("left", `${Math.max(margin, Math.min(left, maxLeft))}px`, "important");
  menu.style.setProperty("right", "auto", "important");
  menu.style.setProperty("width", `${width}px`, "important");
}

function renderFloatingMenu(html, anchor, options = {}) {
  const host = $("#menuHost");
  host.innerHTML = html;
  const menu = host.firstElementChild;
  requestAnimationFrame(() => anchorFloatingMenu(menu, anchor, options));
  return menu;
}

function openQuickCreate(anchor = $("[data-header-quick-create]") || $("[data-quick-create]")) {
  const menu = ["tickets", "tasks", "assets", "employees", "contracts", "vendors", "documents"].filter((name) => has(name, "create"));
  renderFloatingMenu(`<div class="profile-menu">${menu.map((name) => `<button class="menu-item" data-add="${name}">${icon(name)}${escapeHtml(tpl("Create {module}", { module: singularDisplayLabel(name) }))}</button>`).join("")}</div>`, anchor, { width: 280 });
  bindPageActions();
}

function openColumns(name, anchor) {
  const visible = visibleColumns(name);
  renderFloatingMenu(`<div class="column-menu">${columns[name].map((col) => `<label><span>${labelize(col)}</span><input type="checkbox" data-column-toggle="${name}" value="${col}" ${visible.includes(col) ? "checked" : ""}></label>`).join("")}</div>`, anchor, { width: 280 });
  $$("[data-column-toggle]").forEach((input) => input.addEventListener("change", () => {
    const selected = $$(`[data-column-toggle="${name}"]:checked`).map((item) => item.value);
    state.visible[name] = selected.length ? selected : [columns[name][0]];
    render();
    openColumns(name, anchor);
  }));
}

function exportRows(name) {
  const blob = new Blob([JSON.stringify(collection(name), null, 2)], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${name}.json`;
  link.click();
  URL.revokeObjectURL(link.href);
  toast("Export ready", `${t(name)} exported as JSON.`);
}

const formPrimaryFields = {
  tickets: ["requesterId", "subcategoryCode", "priority", "assignedToId", "description"],
  tasks: ["title", "ownerId", "assignedToId", "dueDate", "priority"],
  assets: ["type", "brand", "model", "serialNumber", "location", "currentOwnerId", "permanentCustodianId"],
  employees: ["employeeNo", "name", "personType", "departmentId", "jobTitle", "location", "businessUnit", "managerId", "email", "phoneCountryCode", "phone", "status"],
  documents: ["title", "templateType", "approvalStatus", "status"],
  knowledge_base: ["title", "category", "published", "body"],
  contracts: ["name", "type", "vendorId", "startDate", "endDate", "status", "renewalReminderPeriod"],
  vendors: ["name", "contactPerson", "email", "phone", "servicesText", "status", "rating"],
  users: ["name", "username", "email", "password", "roleId", "accountType", "status"],
  roles: ["name", "description"],
  form_templates: ["name", "approvalStatus", "fieldsText"],
  lookup_items: ["type", "nameEn", "code", "module", "active"]
};

const formRelatedFields = new Set(["relatedType", "relatedId", "linkedType", "linkedId", "relatedAssetId", "relatedDocumentId", "supplierId"]);
const formAttachmentFields = new Set(["attachmentsText", "employeeAttachment", "signedFileName"]);

const formHelpText = {
  requesterId: "Who needs help or owns this request.",
  category: "Choose the closest option so routing and reporting stay clean.",
  subcategoryCode: "Choose the closest option so routing and reporting stay clean.",
  priority: "Use the lowest priority that accurately reflects urgency.",
  assignedToId: "Leave blank if the team should triage first.",
  description: "Add enough context for the next person to act.",
  title: "Use a short, searchable title.",
  ownerId: "The person accountable for completion.",
  dueDate: "When this work should be finished.",
  type: "Choose the main classification.",
  serialNumber: "Must be unique when available.",
  location: "Where the item or person is primarily based.",
  currentOwnerId: "Who currently has custody.",
  permanentCustodianId: "The official custodian for this asset.",
  name: "Use the official display name.",
  email: "Use a valid work email address.",
  vendorId: "Select the vendor responsible for this contract.",
  endDate: "Used for renewal and expiry alerts.",
  body: "Write the article content employees or IT will read.",
  templateType: "Select the document or form type.",
  approvalStatus: "Current approval state for this record.",
  status: "Current lifecycle state.",
  code: "Stable value used internally by dropdowns."
};

function modalSubtitle(name, row = null) {
  const action = row ? "Update" : "Create";
  return {
    tickets: `${action} the request with only the details needed for triage. Optional routing and internal fields stay below.`,
    tasks: `${action} executable work with owner, priority, and due date first.`,
    assets: `${action} the asset identity and custody basics. Lifecycle fields remain available when needed.`,
    employees: `${action} the People master record and keep account access separate.`,
    documents: `${action} the document record first; links and file details can be added below.`,
    knowledge_base: `${action} article content with publication details first.`,
    contracts: `${action} the renewal-critical contract details first.`,
    vendors: `${action} the vendor relationship basics first.`,
    users: `${action} login access details only.`,
    roles: `${action} the role definition.`,
    form_templates: `${action} reusable form structure for documents and requests.`,
    lookup_items: `${action} one dropdown value used across forms.`
  }[name] || `${action} this record using the essential fields first.`;
}

function fieldPlaceholder(key) {
  return {
    description: "Describe the request, problem, or context...",
    notes: "Add optional notes...",
    internalNotes: "Visible to IT only.",
    title: "Short, clear title",
    name: "Official name",
    serialNumber: "Serial number",
    email: "name@company.com",
    phone: "+966...",
    code: "stable_code",
    body: "Write the article content here...",
    fieldsText: "List the fields this template should include."
  }[key] || "";
}

function enrichedFieldOptions(key, options = {}) {
  return { ...options, help: options.help || formHelpText[key], placeholder: options.placeholder || fieldPlaceholder(key) };
}

function formFieldHtml(field, row) {
  const [key, label, type, options = {}] = field;
  return fieldHtml(key, label, type, row, enrichedFieldOptions(key, options));
}

function formSectionHtml(title, helper, fields, row, options = {}) {
  if (!fields.length) return "";
  const content = `<div class="guided-form-grid">${fields.map((field) => formFieldHtml(field, row)).join("")}</div>`;
  const head = `<div class="guided-form-section-head"><strong>${escapeHtml(title)}</strong><small>${escapeHtml(helper)}</small></div>`;
  if (options.collapsed) return `<details class="guided-form-section guided-form-details full"><summary>${head}</summary>${content}</details>`;
  return `<section class="guided-form-section full">${head}${content}</section>`;
}

function genericModalFieldsHtml(name, row, fields, isEdit = false) {
  const primaryKeys = new Set(formPrimaryFields[name] || fields.filter((field) => field[3]?.required).map(([key]) => key));
  const visibleFields = fields.filter((field) => !(field[3]?.itOnly && isEmployeeUser()));
  const primary = visibleFields.filter(([key, , , options = {}]) => (primaryKeys.has(key) || options.required) && !formRelatedFields.has(key) && !formAttachmentFields.has(key));
  const related = visibleFields.filter(([key]) => formRelatedFields.has(key));
  const attachments = visibleFields.filter(([key]) => formAttachmentFields.has(key));
  const primaryKeySet = new Set(primary.map(([key]) => key));
  const advanced = visibleFields.filter(([key]) => !primaryKeySet.has(key) && !formRelatedFields.has(key) && !formAttachmentFields.has(key));
  const order = formPrimaryFields[name] || [];
  const primaryOrdered = [...primary].sort((a, b) => (order.indexOf(a[0]) === -1 ? 999 : order.indexOf(a[0])) - (order.indexOf(b[0]) === -1 ? 999 : order.indexOf(b[0])));
  return `
    <div class="guided-form-intro full">
      <strong>${escapeHtml(isEdit ? "Update the essentials first." : "Start with the required basics.")}</strong>
      <span>${escapeHtml(modalSubtitle(name, isEdit ? row : null))}</span>
    </div>
    ${formSectionHtml("Primary details", "The minimum information needed to save this record.", primaryOrdered, row)}
    ${formSectionHtml("Related records", "Connect this record to existing people, assets, tickets, vendors, contracts, or documents.", related, row, { collapsed: true })}
    ${formSectionHtml("Advanced options", "Optional fields for lifecycle, metadata, internal notes, and less common configuration.", advanced, row, { collapsed: true })}
    ${formSectionHtml("Attachments and file details", "Add filenames or upload-related information after the core record is clear.", attachments, row, { collapsed: true })}
  `;
}

function openModal(name, row = null, prefill = {}) {
  $("#menuHost").innerHTML = "";
  const template = $("#modalTemplate").content.cloneNode(true);
  const backdrop = $(".modal-backdrop", template);
  $(".close", template).innerHTML = icon("close");
  const employeeTicketModal = usesTicketWizard(name, row);
  const employeeTaskModal = name === "tasks" && isEmployeeUser();
  const newPersonModal = name === "employees" && !row && !employeeTicketModal;
  const newServiceAccountModal = name === "users" && !row;
  $("h3", template).textContent = employeeTicketModal ? (isEmployeeUser() ? "Submit a request" : "Open a ticket") : employeeTaskModal ? (row ? "Edit Task" : "Create Task") : recordModalTitle(name, row);
  $(".eyebrow", template).textContent = employeeTicketModal || employeeTaskModal || newPersonModal || newServiceAccountModal ? "" : "Guided form";
  if (employeeTicketModal || employeeTaskModal || newPersonModal || newServiceAccountModal) $(".eyebrow", template).classList.add("hidden");
  const modalHeadCopy = $(".modal-head > div", template);
  if (modalHeadCopy && !employeeTicketModal && !employeeTaskModal && !newPersonModal && !newServiceAccountModal) {
    modalHeadCopy.insertAdjacentHTML("beforeend", `<p class="muted modal-subtitle">${escapeHtml(modalSubtitle(name, row))}</p>`);
  }
  if (employeeTicketModal) $(".modal", template).classList.add("employee-request-modal");
  if (employeeTaskModal) $(".modal", template).classList.add("employee-task-modal");
  if (newPersonModal) $(".modal", template).classList.add("person-create-modal");
  if (newServiceAccountModal) $(".modal", template).classList.add("service-account-modal");
  if (!employeeTicketModal && !employeeTaskModal && !newPersonModal && !newServiceAccountModal) $(".modal", template).classList.add("guided-record-modal");
  const fields = formSchema(name, row);
  const formRow = row ? { ...row, ...prefill } : prefill;
  const simpleFields = fields.filter((field) => !field[3]?.advanced && !(field[3]?.itOnly && isEmployeeUser()));
  const advancedFields = fields.filter((field) => field[3]?.advanced && !(field[3]?.itOnly && isEmployeeUser()));
  $(".modal-fields", template).innerHTML = `
    <div class="form-error" data-form-error hidden></div>
    ${newPersonModal ? newPersonModalHtml(formRow) : newServiceAccountModal ? newAccountModalHtml(formRow) : employeeTicketModal ? employeeTicketWizardHtml() : ""}
    ${employeeTicketModal || newPersonModal || newServiceAccountModal || employeeTaskModal ? "" : genericModalFieldsHtml(name, formRow, fields, Boolean(row))}
    ${employeeTaskModal ? simpleFields.map(([key, label, type, options]) => fieldHtml(key, label, type, formRow, enrichedFieldOptions(key, options))).join("") : ""}
    ${advancedFields.length && employeeTaskModal ? `<details class="advanced-options full"><summary>Additional Details</summary><div class="modal-fields nested">${advancedFields.map(([key, label, type, options]) => fieldHtml(key, label, type, formRow, enrichedFieldOptions(key, options))).join("")}</div></details>` : ""}
  `;
  if (employeeTicketModal || employeeTaskModal || newPersonModal || newServiceAccountModal) {
    const submit = $(".modal button[type='submit']", template);
    if (submit) {
      submit.textContent = employeeTicketModal ? "Create Ticket" : employeeTaskModal ? (row ? "Save Task" : "Create Task") : newPersonModal ? "Save Person" : "Create Account";
      if (employeeTicketModal || employeeTaskModal) submit.classList.add("large-submit");
    }
  } else {
    const submit = $(".modal button[type='submit']", template);
    if (submit) submit.textContent = row ? trText("Save Changes") : tpl("Create {module}", { module: singularDisplayLabel(name) });
  }
  $$(".close", template).forEach((button) => button.addEventListener("click", () => backdrop.remove()));
  $(".modal", template).addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const error = validateForm(form, name, row);
    if (error) {
      $("[data-form-error]", form).textContent = error;
      $("[data-form-error]", form).hidden = false;
      return;
    }
    const body = row ? sanitizePatchBody(name, formToObject(new FormData(form), name, row), row) : formToObject(new FormData(form), name, row);
    if (name === "roles" && !row) body.permissions = emptyRolePermissions();
    try {
      let saved;
      if (row) saved = await api(`/api/${name}/${row.id}`, { method: "PATCH", body: JSON.stringify(body) });
      else saved = await api(`/api/${name}`, { method: "POST", body: JSON.stringify(body) });
      await handleModalPostSaveUploads(form, name, saved);
      backdrop.remove();
      toast(row ? "Updated" : "Created", `${t(name)} saved successfully.`);
      await loadState();
      render();
    } catch (err) {
      $("[data-form-error]", form).textContent = err.message;
      $("[data-form-error]", form).hidden = false;
      toast("Could not save", err.message);
    }
  });
  document.body.appendChild(template);
  wireModalDependencies(name);
  if (employeeTicketModal) {
    wireEmployeeTicketWizard();
    wireOnBehalfRequesterStep();
  }
  if (employeeTaskModal) wireEmployeeTaskCategory();
  if (newServiceAccountModal) wireNewAccountModal();
  wireModernSelects();
  wireFileDropzones();
}

function sanitizePatchBody(name, body, row = null) {
  const next = { ...body };
  const protectedPatchFields = ["id", "createdAt", "createdBy", "createdDate", "updatedAt", "updatedBy", "archivedAt", "deletedAt"];
  protectedPatchFields.forEach((field) => delete next[field]);
  if (name !== "tasks") return next;
  const taskProtectedPatchFields = [
    "taskNumber",
    "approvalStatus",
    "completedAt",
    "cancelledAt",
    "startedAt",
    "systemAccess",
    "audit",
    "timeline",
    "history"
  ];
  taskProtectedPatchFields.forEach((field) => delete next[field]);
  if (isEmployeeUser()) {
    const allowed = new Set(["title", "category", "priority", "dueDate", "startDate", "recurrence", "notes", "description"]);
    Object.keys(next).forEach((field) => {
      if (!allowed.has(field)) delete next[field];
    });
    // Employee status changes are intentionally handled by the status chips so
    // they stay separate from normal task edits and pass server RBAC checks.
    delete next.status;
  } else {
    const allowed = new Set([
      "title",
      "taskType",
      "ownerId",
      "assignedToId",
      "departmentId",
      "priority",
      "status",
      "startDate",
      "dueDate",
      "progress",
      "estimatedHours",
      "actualHours",
      "recurrence",
      "reminder",
      "description",
      "notes",
      "relatedType",
      "relatedId",
      "relatedTicketId",
      "relatedIds"
    ]);
    Object.keys(next).forEach((field) => {
      if (!allowed.has(field)) delete next[field];
    });
  }
  if (next.priority !== undefined) next.priority = String(next.priority || row?.priority || "medium").toLowerCase();
  if (next.status !== undefined) next.status = String(next.status || row?.status || "pending").toLowerCase().replace(/\s+/g, "_");
  return next;
}

function recordModalTitle(name, row) {
  if (name === "employees" && !row) return "New Person";
  if (name === "users" && !row) return "New Account";
  return `${row ? t("edit") : t("add")} ${singularDisplayLabel(name)}`;
}

function newPersonModalHtml(row = {}) {
  const field = (key) => {
    const found = schemas.employees.find((item) => item[0] === key);
    return found ? fieldHtml(found[0], found[1], found[2], row, found[3] || {}) : "";
  };
  return `
    <section class="form-section full">
      <div class="wizard-section-title"><strong>Basic Information</strong><small class="muted">Create the master People record. Login access is registered from User Accounts.</small></div>
      <div class="form-section-grid person-basic-grid">
        ${["employeeNo", "name", "personType", "departmentId", "managerId", "jobTitle", "location", "businessUnit", "email", "phoneCountryCode", "phone", "status"].map(field).join("")}
      </div>
    </section>
  `;
}

/* ---------------------------------------------------------------------------
   Login accounts are created from two places: the New Service Account modal
   and the System Access section of a Person. They used to collect different
   fields under different input names, which produced user records with
   different shapes depending on which form was used. This is the single
   definition both render from.

   `prefix` exists because the Person form already owns `name`, `email` and
   `status` for the person itself, so its account inputs are namespaced. The
   fields, labels, order and required rules are identical either way, and
   normaliseAccountPayload() maps both back to the same server payload.
--------------------------------------------------------------------------- */
const ACCOUNT_STATUS_OPTIONS = [
  ["active", "Enabled"],
  ["disabled", "Disabled"],
  ["locked", "Locked"],
  ["password_expired", "Password Expired"]
];

// Every account input, in the order both forms render them.
const ACCOUNT_FIELD_KEYS = ["name", "username", "email", "roleId", "accountType", "status",
  "password", "confirmPassword", "expiryDate", "employeeId", "requirePasswordChange"];


// Both forms funnel through here, so the server receives one payload shape no
// matter which screen created the account.
function normaliseAccountPayload(body, prefix = "") {
  const read = (field) => body[prefix ? prefix + field[0].toUpperCase() + field.slice(1) : field];
  return {
    name: String(read("name") || "").trim(),
    username: String(read("username") || "").trim(),
    email: String(read("email") || "").trim(),
    roleId: read("roleId") || "",
    accountType: read("accountType") || "",
    status: read("status") || "active",
    password: String(read("password") || ""),
    expiryDate: String(read("expiryDate") || ""),
    employeeId: String(read("employeeId") || ""),
    requirePasswordChange: read("requirePasswordChange") === true || String(read("requirePasswordChange")) === "true"
  };
}

function accountFieldsHtml(row = {}, options = {}) {
  const prefix = options.prefix || "";
  const key = (name) => (prefix ? prefix + name[0].toUpperCase() + name.slice(1) : name);
  const schemaField = (name, override = null) => {
    const found = override || schemas.users.find((item) => item[0] === name);
    if (!found) return "";
    let config = found[3] || {};
    // An account attached to a person is an Employee account; a standalone one
    // defaults to Service. Same field, context-appropriate starting value.
    if (found[0] === "accountType" && options.defaultAccountType) {
      config = { ...config, default: options.defaultAccountType };
    }
    return fieldHtml(key(found[0]), found[1], found[2], row, config);
  };
  const statusValue = row.status || "active";
  const statusField = `<label>${fieldLabel(escapeHtml(trText("Account Status")), ' <span class="required">*</span>')}<select name="${key("status")}" required>${ACCOUNT_STATUS_OPTIONS.map(([value, label]) => `<option value="${value}" ${String(statusValue) === value ? "selected" : ""}>${escapeHtml(trText(label))}</option>`).join("")}</select></label>`;

  // On a Person the account is always linked to that person, so the selector is
  // replaced by a fixed, non-editable statement of the link. The merged
  // registration form owns the person choice itself and omits it here.
  const linkedField = options.omitLinkedPerson
    ? ""
    : options.lockedPersonLabel
      ? `<label>${fieldLabel(escapeHtml(trText("Linked Person")), "")}<input value="${escapeHtml(options.lockedPersonLabel)}" disabled></label>`
      : schemaField("employeeId", ["employeeId", "Linked Person", "employees"]);

  return `
    ${schemaField("name", ["name", "Account name", null, { required: true }])}
    ${schemaField("username")}
    ${schemaField("email")}
    ${schemaField("roleId")}
    ${schemaField("accountType")}
    ${statusField}
    ${schemaField("password")}
    ${fieldHtml(key("confirmPassword"), "Confirm Password", "password", row, { required: true })}
    ${schemaField("expiryDate")}
    ${linkedField}
    ${schemaField("requirePasswordChange")}
  `;
}

/* One registration page for both kinds of login account. Choosing "Employee"
   reveals the person picker; choosing "Service" skips people entirely. People
   records themselves are created in the People module — this form only links
   an account to one that already exists. Account Details is the same shared
   field set either way. */
function newAccountModalHtml(row = {}) {
  const people = rows("employees").filter((person) => !person.archivedAt && !person.deletedAt);
  return `
    <section class="form-section full">
      <div class="wizard-section-title"><strong>Account Purpose</strong><small class="muted">Who is this login for?</small></div>
      <div class="system-access-choice-grid">
        <label class="system-access-choice active"><input name="accountPurpose" type="radio" value="employee" checked data-account-purpose /><span><strong>Employee Account</strong><small>A login that belongs to a person.</small></span></label>
        <label class="system-access-choice"><input name="accountPurpose" type="radio" value="service" data-account-purpose /><span><strong>Service Account</strong><small>A service or API login with no person behind it.</small></span></label>
      </div>
    </section>

    <section class="form-section full" data-account-person-section>
      <div class="wizard-section-title"><strong>Person</strong><small class="muted">Pick the person this login belongs to. Add them in People first if they are not listed.</small></div>
      <div class="form-section-grid service-account-grid" data-person-existing-fields>
        <label>${fieldLabel(escapeHtml(trText("Linked Person")), ' <span class="required">*</span>')}<select name="employeeId" data-person-picker><option value=""></option>${people.map((person) => `<option value="${escapeHtml(person.id)}" ${row.employeeId === person.id ? "selected" : ""}>${escapeHtml(person.name)}</option>`).join("")}</select></label>
      </div>
    </section>

    <section class="form-section full">
      <div class="wizard-section-title"><strong>Account Details</strong><small class="muted">Sign-in credentials and role. These fields are the same for every account.</small></div>
      <div class="form-section-grid service-account-grid">
        ${accountFieldsHtml(row, { omitLinkedPerson: true })}
      </div>
    </section>
  `;
}


function wireNewAccountModal() {
  const modal = document.querySelector(".modal");
  if (!modal) return;
  const purposeChoices = $$("[data-account-purpose]", modal);
  const personSection = modal.querySelector("[data-account-person-section]");
  if (!purposeChoices.length || !personSection) return;

  const accountName = modal.querySelector('input[name="name"]');
  const accountEmail = modal.querySelector('input[name="email"]');
  const picker = modal.querySelector("[data-person-picker]");
  const accountTypeSelect = modal.querySelector('select[name="accountType"], input[name="accountType"]');

  // Selecting a person fills the account name and email from their record,
  // until someone types something different.
  [accountName, accountEmail].forEach((field) => {
    field?.addEventListener("input", () => { field.dataset.touched = "true"; });
  });
  picker?.addEventListener("change", () => {
    const person = rows("employees").find((item) => item.id === picker.value);
    if (!person) return;
    if (accountName && accountName.dataset.touched !== "true") accountName.value = person.name || "";
    if (accountEmail && accountEmail.dataset.touched !== "true") accountEmail.value = person.email || "";
  });

  const sync = () => {
    const isEmployee = (purposeChoices.find((choice) => choice.checked)?.value || "employee") === "employee";
    personSection.classList.toggle("hidden", !isEmployee);
    if (picker) {
      picker.disabled = !isEmployee;
      picker.required = isEmployee;
      if (!isEmployee) picker.value = "";
    }
    purposeChoices.forEach((choice) => choice.closest(".system-access-choice")?.classList.toggle("active", choice.checked));
    if (accountTypeSelect && !accountTypeSelect.dataset.touched) {
      accountTypeSelect.value = isEmployee ? "Employee" : "Service";
    }
  };
  accountTypeSelect?.addEventListener("change", () => { accountTypeSelect.dataset.touched = "true"; });
  purposeChoices.forEach((choice) => choice.addEventListener("change", sync));
  sync();
}


function employeeTicketWizardHtml() {
  return `
    <div class="ticket-wizard full">
      <input type="hidden" name="employeeMainCategory" required>
      <input type="hidden" name="employeeSubcategory" data-ticket-subcategory>
      <input type="hidden" name="employeeSubjectMode" value="false" data-subject-mode>
      ${onBehalfRequesterStepHtml()}
      <section class="wizard-step" data-wizard-numbered>
        <div class="wizard-section-title"><strong>Choose Main Category <span class="required">*</span></strong></div>
        <div class="wizard-card-grid">${ticketCategoryParents().map((category) => `<button type="button" class="wizard-card" aria-pressed="false" data-ticket-category-card="${escapeHtml(category.code)}">${icon(employeeTicketCategoryIcon(category.code))}<span>${escapeHtml(lookupLabel(category))}</span></button>`).join("")}</div>
      </section>
      <section class="wizard-step" data-wizard-numbered data-subcategory-step hidden>
        <div class="wizard-section-title"><strong>Choose Subcategory</strong></div>
        <div class="wizard-card-grid" data-subcategory-cards></div>
      </section>
      <section class="wizard-step" data-wizard-numbered data-service-request-step hidden>
        <div class="wizard-section-title"><strong data-service-request-title></strong><small class="muted" data-service-request-helper></small></div>
        <div class="equipment-request-options" data-service-request-options></div>
        <div class="equipment-other-fields" data-service-request-other-step hidden>
          <div class="service-custom-heading"><span data-service-custom-name-label>Item name</span><span>Quantity</span></div>
          <div class="service-custom-rows" data-service-custom-rows></div>
          <button class="btn btn-secondary service-add-item" type="button" data-add-service-custom>+ Add Another Item</button>
        </div>
      </section>
      <section class="wizard-step" data-wizard-numbered data-subject-step hidden>
        <div class="wizard-section-title"><strong>Subject <span class="required">*</span></strong><small class="muted">Write a short title for your question or request.</small></div>
        <input name="employeeSubject" disabled placeholder="How do I connect to the meeting room screen?">
      </section>
      <section class="wizard-step" data-wizard-numbered data-more-information-step hidden>
        <details class="more-information" data-more-information>
          <summary><span>More Information</span> <span>(Optional)</span></summary>
          <div class="more-information-fields">
            <label><span>Description <span class="required" data-description-required hidden>*</span></span><textarea name="description" placeholder="Tell IT what happened, what you expected, and anything you already tried."></textarea></label>
            ${fieldHtml("employeeAttachment", "Attachment", "file", null)}
          </div>
        </details>
      </section>
      <section class="wizard-step suggested-kb-panel" data-ticket-kb-suggestions hidden>
        <div class="wizard-section-title"><strong>Suggested articles</strong><small class="muted">These may solve the issue before a ticket is needed.</small></div>
        <div class="suggested-kb-list" data-ticket-kb-suggestion-list></div>
      </section>
    </div>
  `;
}

// "Lina Hassan (opened by Omar IT Staff)" so it is always clear who filed a ticket.
function ticketRequesterProvenance(ticket) {
  const requester = look("employees", ticket.requesterId) || "Unknown";
  if (!ticket.onBehalf || !ticket.createdById) return requester;
  const author = look("users", ticket.createdById);
  return author ? tpl("{requester} (opened by {author})", { requester, author }) : requester;
}

// Admin, IT Manager and IT Staff may open a ticket for someone else.
function canCreateTicketOnBehalf() {
  return ["role_admin", "role_manager", "role_staff"].includes(state.user?.roleId);
}

// The guided wizard is now the single ticket-creation path for every role, so
// employees and IT raise tickets against exactly the same category tree.
function usesTicketWizard(name, row) {
  return name === "tickets" && !row && (isEmployeeUser() || canCreateTicketOnBehalf());
}

// Searchable picker rather than a raw select: an employee list grows past the point
// where scrolling a dropdown is usable, and it matches the category picker's behaviour.
function onBehalfRequesterOptions() {
  return rows("employees")
    .filter((employee) => String(employee.status || "active").toLowerCase() === "active")
    .sort((a, b) => String(a.name || "").localeCompare(String(b.name || "")))
    .map((employee) => {
      const department = employee.departmentId ? look("departments", employee.departmentId) : "";
      const name = employee.name || employee.employeeNo || employee.id;
      return { value: employee.id, label: department ? `${name} — ${department}` : name, icon: "employees" };
    });
}

function onBehalfRequesterStepHtml() {
  if (!canCreateTicketOnBehalf()) return "";
  const self = employeeForUser();
  return `
    <section class="wizard-step" data-on-behalf-step data-wizard-numbered>
      <div class="wizard-section-title"><strong>Who is this request for? <span class="required">*</span></strong><small class="muted">Open the ticket on behalf of the employee who needs help.</small></div>
      ${modernSelectHtml("requesterId", "Requester", self?.id || "", onBehalfRequesterOptions(), { required: true, placeholder: "Search employees", attrs: 'data-on-behalf-requester', full: "full" })}
      <p class="muted on-behalf-hint" data-on-behalf-hint role="status" aria-live="polite" hidden></p>
    </section>
  `;
}

function wireOnBehalfRequesterStep() {
  const picker = document.querySelector(".modal [data-on-behalf-requester]");
  const hint = document.querySelector(".modal [data-on-behalf-hint]");
  if (!picker || !hint) return;
  const self = employeeForUser();
  const sync = () => {
    const employee = rows("employees").find((item) => item.id === picker.value);
    const onBehalf = Boolean(employee && employee.id !== self?.id);
    hint.hidden = !onBehalf;
    if (onBehalf) hint.textContent = tpl("This ticket will be created on behalf of {name}, who will be notified and able to follow it.", { name: employee.name || employee.id });
  };
  picker.addEventListener("change", sync);
  sync();
}

function wireEmployeeTicketWizard() {
  const main = document.querySelector('.modal input[name="employeeMainCategory"]');
  const sub = document.querySelector('.modal input[name="employeeSubcategory"]');
  const subcategoryStep = document.querySelector(".modal [data-subcategory-step]");
  const serviceStep = document.querySelector(".modal [data-service-request-step]");
  const serviceTitle = document.querySelector(".modal [data-service-request-title]");
  const serviceHelper = document.querySelector(".modal [data-service-request-helper]");
  const serviceOptions = document.querySelector(".modal [data-service-request-options]");
  const otherItemStep = document.querySelector(".modal [data-service-request-other-step]");
  const serviceCustomRows = document.querySelector(".modal [data-service-custom-rows]");
  const serviceCustomNameLabel = document.querySelector(".modal [data-service-custom-name-label]");
  const addServiceCustom = document.querySelector(".modal [data-add-service-custom]");
  const moreInformationStep = document.querySelector(".modal [data-more-information-step]");
  const moreInformation = document.querySelector(".modal [data-more-information]");
  const description = document.querySelector('.modal textarea[name="description"]');
  const suggestionsPanel = document.querySelector(".modal [data-ticket-kb-suggestions]");
  const suggestionsList = document.querySelector(".modal [data-ticket-kb-suggestion-list]");
  const descriptionRequired = document.querySelector(".modal [data-description-required]");
  const subjectStep = document.querySelector(".modal [data-subject-step]");
  const subject = document.querySelector('.modal input[name="employeeSubject"]');
  const subjectMode = document.querySelector(".modal [data-subject-mode]");
  const target = document.querySelector(".modal [data-subcategory-cards]");
  if (!main || !sub || !subcategoryStep || !serviceStep || !serviceTitle || !serviceHelper || !serviceOptions || !otherItemStep || !serviceCustomRows || !serviceCustomNameLabel || !addServiceCustom || !moreInformationStep || !moreInformation || !description || !descriptionRequired || !subjectStep || !subject || !subjectMode || !target || !suggestionsPanel || !suggestionsList) return;
  const setSubjectFlow = (enabled) => {
    subjectStep.hidden = !enabled;
    subject.disabled = !enabled;
    subject.required = enabled;
    subjectMode.value = enabled ? "true" : "false";
    if (!enabled) subject.value = "";
  };
  const setMoreInformationFlow = (incident) => {
    moreInformationStep.hidden = false;
    moreInformation.open = incident;
    description.required = incident;
    descriptionRequired.hidden = !incident;
  };
  let activeServiceConfig = null;
  const customRowHtml = (config) => `<div class="service-custom-row"><input name="employeeServiceOtherName" aria-label="${escapeHtml(config.customFieldLabel)}" placeholder="${escapeHtml(config.customFieldLabel)}"><input name="employeeServiceOtherQuantity" aria-label="Quantity" type="number" min="1" inputmode="numeric" placeholder="Qty"><button type="button" class="icon-btn" data-remove-service-custom title="Remove item">${icon("close")}</button></div>`;
  const wireCustomRowActions = () => {
    $$('[data-remove-service-custom]', serviceCustomRows).forEach((button) => button.onclick = () => {
      button.closest(".service-custom-row")?.remove();
      if (!serviceCustomRows.children.length && activeServiceConfig?.alwaysCustom) serviceCustomRows.insertAdjacentHTML("beforeend", customRowHtml(activeServiceConfig));
      wireCustomRowActions();
    });
  };
  const addCustomRow = (config) => {
    serviceCustomRows.insertAdjacentHTML("beforeend", customRowHtml(config));
    wireCustomRowActions();
  };
  const syncServiceFields = () => {
    $$("[name=\"employeeServiceItem\"]", serviceStep).forEach((input) => {
      input.closest(".equipment-chip")?.classList.toggle("active", input.checked);
    });
    const otherSelected = Boolean(activeServiceConfig?.alwaysCustom) || $$("[name=\"employeeServiceItem\"]", serviceStep).some((input) => input.checked && input.value.startsWith("Other "));
    otherItemStep.hidden = !otherSelected;
    if (otherSelected && !serviceCustomRows.children.length) addCustomRow(activeServiceConfig);
    if (!otherSelected) serviceCustomRows.innerHTML = "";
  };
  const setServiceRequestFlow = (config) => {
    activeServiceConfig = config;
    serviceStep.hidden = !config;
    if (!config) {
      serviceOptions.innerHTML = "";
      otherItemStep.hidden = true;
      serviceCustomRows.innerHTML = "";
      return;
    }
    serviceTitle.textContent = trText(config.title);
    serviceHelper.textContent = trText(config.helper);
    serviceCustomNameLabel.textContent = trText(config.customFieldLabel);
    addServiceCustom.textContent = tpl("+ Add Another {item}", { item: trText(config.addLabel) });
    serviceOptions.innerHTML = config.items.map((item) => `<label class="equipment-chip"><input type="checkbox" name="employeeServiceItem" value="${escapeHtml(item)}"><span>${escapeHtml(item)}</span></label>`).join("");
    serviceCustomRows.innerHTML = "";
    $$("[name=\"employeeServiceItem\"]", serviceStep).forEach((input) => input.addEventListener("change", syncServiceFields));
    syncServiceFields();
  };
  addServiceCustom.addEventListener("click", () => {
    if (activeServiceConfig) addCustomRow(activeServiceConfig);
  });
  const renderSuggestions = () => {
    const query = [main.value, sub.value, subject.value, description.value].filter(Boolean).join(" ");
    const matches = suggestedKnowledgeArticles(query).slice(0, 3);
    suggestionsPanel.hidden = !matches.length;
    suggestionsList.innerHTML = matches.map((article) => `<article class="suggested-kb-card"><div><strong>${escapeHtml(article.title || "Article")}</strong><p class="muted">${escapeHtml(article.category || "Knowledge Base")} | ${knowledgeHelpful(article)} | ${knowledgeReadingTime(article)}</p></div><div class="record-card-actions compact"><button class="btn btn-secondary" type="button" data-suggested-kb-open="${article.id}">${escapeHtml(trText("Open article"))}</button><button class="btn btn-secondary" type="button" data-suggested-kb-solved="${article.id}">${escapeHtml(trText("Solved"))}</button></div></article>`).join("");
    $$("[data-suggested-kb-open]", suggestionsList).forEach((button) => button.onclick = () => {
      openSuggestedArticlePreview(rows("knowledge_base").find((item) => item.id === button.dataset.suggestedKbOpen));
    });
    $$("[data-suggested-kb-solved]", suggestionsList).forEach((button) => button.onclick = async () => {
      await recordKnowledgeSelfService(button.dataset.suggestedKbSolved, "ticket_prevented", "Glad it helped");
      document.querySelector(".employee-request-modal")?.closest(".modal-backdrop")?.remove();
      $("#dialogHost").innerHTML = "";
    });
  };
  subject.addEventListener("input", renderSuggestions);
  description.addEventListener("input", renderSuggestions);
  $$("[data-ticket-category-card]").forEach((button) => button.addEventListener("click", () => {
    const categoryCode = button.dataset.ticketCategoryCard;
    main.value = categoryCode;
    sub.value = "";
    setSubjectFlow(false);
    setServiceRequestFlow(null);
    setMoreInformationFlow(categoryCode !== "service_requests");
    $$("[data-ticket-category-card]").forEach((item) => {
      item.classList.toggle("active", item === button);
      item.setAttribute("aria-pressed", String(item === button));
    });
    const options = ticketCategoryChildren(categoryCode);
    // A parent with no real choice (only "Other") skips straight to a free-text subject.
    if (!options.length || (options.length === 1 && /^other$/i.test(options[0].nameEn || ""))) {
      target.innerHTML = "";
      subcategoryStep.hidden = true;
      setSubjectFlow(true);
      renderSuggestions();
      return;
    }
    target.innerHTML = options.map((option) => `<button type="button" class="wizard-card compact" aria-pressed="false" data-ticket-subcategory-card="${escapeHtml(option.code)}">${icon(employeeTicketCategoryIcon(categoryCode))}<span>${escapeHtml(lookupLabel(option))}</span></button>`).join("");
    subcategoryStep.hidden = false;
    $$("[data-ticket-subcategory-card]").forEach((item) => item.addEventListener("click", () => {
      const selected = item.dataset.ticketSubcategoryCard;
      sub.value = selected;
      $$("[data-ticket-subcategory-card]").forEach((card) => {
        card.classList.toggle("active", card === item);
        card.setAttribute("aria-pressed", String(card === item));
      });
      setSubjectFlow(false);
      setServiceRequestFlow(employeeServiceRequestOptions[selected] || null);
      renderSuggestions();
    }));
    renderSuggestions();
  }));
}

function openSuggestedArticlePreview(article) {
  if (!article) return;
  $("#dialogHost").innerHTML = `
    <div class="modal-backdrop">
      <article class="modal surface-card suggested-article-preview">
        <div class="modal-head">
          <div><p class="eyebrow">${escapeHtml(trText(article.category || "Knowledge Base"))}</p><h3>${escapeHtml(article.title || "Article")}</h3></div>
          <button class="icon-btn" type="button" data-suggested-article-back>${icon("close")}</button>
        </div>
        <div class="article-body">${escapeHtml(article.body || "No article body available.").replace(/\n/g, "<br>")}</div>
        <div class="modal-actions"><button class="btn btn-secondary" type="button" data-suggested-article-back>&larr; ${escapeHtml(trText("Back to request"))}</button></div>
      </article>
    </div>
  `;
  localizeRenderedUi($("#dialogHost"));
  $$("[data-suggested-article-back]").forEach((button) => button.addEventListener("click", () => {
    $("#dialogHost").innerHTML = "";
    document.querySelector(".employee-request-modal textarea, .employee-request-modal input, .employee-request-modal button")?.focus();
  }));
}

function suggestedKnowledgeArticles(query) {
  const q = String(query || "").trim();
  if (!q) return [];
  return rows("knowledge_base")
    .map((article) => ({ article, score: knowledgeSearchScore(article, q) }))
    .filter(({ article, score }) => article.published !== false && score >= 10 && typoTolerantIncludes(knowledgeSearchText(article), q))
    .sort((a, b) => b.score - a.score)
    .map(({ article }) => article);
}

function wireModalDependencies(name) {
  if (name === "tickets") {
    const mainCategory = document.querySelector('.modal [name="employeeMainCategory"]');
    const subcategory = document.querySelector(".modal [data-ticket-subcategory]");
    // The card wizard drives its own hidden inputs; only wire the select variant.
    if (mainCategory && subcategory && mainCategory.type !== "hidden") {
      const renderSubcategories = () => {
        const selected = subcategory.value || subcategory.dataset.selected || "";
        const options = ticketCategoryChildren(mainCategory.value);
        if (subcategory.matches("select")) {
          subcategory.innerHTML = `<option value=""></option>${options.map((option) => `<option ${selected === option.code ? "selected" : ""} value="${escapeHtml(option.code)}">${escapeHtml(lookupLabel(option))}</option>`).join("")}`;
        } else {
          replaceModernSelectOptions(subcategory, options.map((option) => ({ value: option.code, label: lookupLabel(option) })), selected);
        }
        subcategory.dataset.selected = "";
      };
      mainCategory.addEventListener("change", renderSubcategories);
      renderSubcategories();
    }
    const requester = document.querySelector('.modal select[name="requesterId"]');
    const asset = document.querySelector('.modal select[name="relatedAssetId"]');
    if (requester && asset) {
      const renderAssets = () => {
        const selected = asset.value;
        const options = rows("assets").filter((item) => !requester.value || item.currentOwnerId === requester.value);
        asset.innerHTML = `<option value=""></option>${options.map((option) => `<option ${selected === option.id ? "selected" : ""} value="${option.id}">${escapeHtml(option.assetNumber || option.name)}</option>`).join("")}`;
      };
      requester.addEventListener("change", renderAssets);
      renderAssets();
    }
  }
  $$('[data-linked-record]').forEach((picker) => {
    const typeField = picker.dataset.linkedRecord;
    const typeSelect = document.querySelector(`.modal select[name="${typeField}"]`);
    if (!typeSelect) return;
    const renderLinked = () => {
      const selected = picker.value || picker.dataset.selected || "";
      const options = linkedRecordOptions(typeSelect.value);
      picker.innerHTML = `<option value=""></option>${options.map((option) => `<option ${selected === option.id ? "selected" : ""} value="${option.id}">${escapeHtml(linkedRecordLabel(option))}</option>`).join("")}`;
      picker.dataset.selected = "";
    };
    typeSelect.addEventListener("change", renderLinked);
    renderLinked();
  });
}

function wireEmployeeTaskCategory() {
  const category = document.querySelector('.modal input[name="category"]');
  const customWrap = document.querySelector(".modal [data-custom-task-category]");
  const customInput = customWrap?.querySelector('input[name="customCategory"]');
  if (!category || !customWrap || !customInput) return;
  const sync = () => {
    const show = employeeTaskCategoryLabel(category.value) === "Other";
    customWrap.classList.toggle("hidden", !show);
    customInput.disabled = !show;
    customInput.required = show;
    if (show) {
      setTimeout(() => customInput.focus(), 0);
    } else {
      customInput.value = "";
      const error = document.querySelector(".modal [data-form-error]");
      if (error?.textContent?.startsWith("Custom category")) {
        error.hidden = true;
        error.textContent = "";
      }
    }
  };
  category.addEventListener("change", sync);
  sync();
}

function wireModernSelects() {
  $$("[data-modern-select]").forEach((field) => {
    const hidden = $("input[type='hidden']", field);
    const search = $("[data-modern-search]", field);
    const menu = $("[data-modern-options]", field);
    if (!hidden || !search || !menu) return;
    const filterOptions = () => {
      const query = search.value.toLowerCase().trim();
      $$("[data-modern-option]", menu).forEach((option) => {
        option.hidden = query && !option.dataset.label.toLowerCase().includes(query);
      });
    };
    const choose = (button) => {
      hidden.value = button.dataset.value || "";
      search.value = button.dataset.label || "";
      $$("[data-modern-option]", menu).forEach((option) => option.classList.toggle("selected", option === button));
      hidden.dispatchEvent(new Event("change", { bubbles: true }));
      closeModernSelects();
    };
    search.addEventListener("focus", () => {
      closeModernSelects(field);
      field.classList.add("open");
    });
    search.addEventListener("input", filterOptions);
    $$("[data-modern-option]", menu).forEach((button) => button.addEventListener("click", () => choose(button)));
    search.addEventListener("keydown", (event) => {
      if (event.key === "Escape") field.classList.remove("open");
      if (event.key === "Enter") {
        event.preventDefault();
        const first = $$("[data-modern-option]", menu).find((option) => !option.hidden);
        if (first) choose(first);
      }
    });
  });
}

function closeModernSelects(except = null) {
  $$("[data-modern-select].open").forEach((field) => {
    if (field !== except) field.classList.remove("open");
  });
}

function replaceModernSelectOptions(hidden, options, selected = "") {
  const field = hidden.closest("[data-modern-select]");
  if (!field) return;
  const menu = $("[data-modern-options]", field);
  const search = $("[data-modern-search]", field);
  const current = options.some((option) => option.value === selected) ? selected : "";
  hidden.value = current;
  hidden.dataset.selected = "";
  if (search) search.value = options.find((option) => option.value === current)?.label || "";
  if (menu) menu.innerHTML = options.map((option) => modernOptionButton(option, option.value === current)).join("");
  wireModernSelects();
}

function wireFileDropzones() {
  $$(".file-dropzone input[type='file']").forEach((input) => {
    input.addEventListener("change", () => {
      const target = input.closest(".file-dropzone")?.querySelector("[data-file-name]");
      if (target) target.textContent = input.files?.[0]?.name || target.dataset.defaultText || "PDF, image, Word, or Excel file";
    });
  });
}

async function handleModalPostSaveUploads(form, name, saved) {
  if (name !== "tickets" || !isEmployeeUser() || !saved?.id) return;
  const file = form.elements.employeeAttachment?.files?.[0];
  if (!file) return;
  const content = await readFileData(file);
  await api("/api/attachments", { method: "POST", body: JSON.stringify({ entityType: "ticket", entityId: saved.id, filename: file.name, mimeType: file.type || mimeForName(file.name), size: file.size, content }) });
}

function formSchema(name, row = null) {
  if (usesTicketWizard(name, row)) {
    return [
      ["employeeMainCategory", "Main Category", "employee_ticket_category", { required: true }],
      ["employeeSubcategory", "Subcategory", "employee_ticket_subcategory", { required: true }],
      ["description", "Description", "textarea", { required: true, placeholder: "Tell IT what you need help with." }],
      ["employeeAttachment", "Attachment", "file", { help: "Optional. Upload a screenshot or document if it helps explain the request." }]
    ];
  }
  if (name === "tasks" && isEmployeeUser()) {
    return [
      ["title", "Task title", null, { required: true, full: true }],
      ["category", "Category", "lookup:my_task_category", { required: true, default: "Work" }],
      ["customCategory", "Custom category", "custom_task_category"],
     ["priority", "Priority", "lookup:my_task_priority", { required: true, default: "Medium" }],
      ["startDate", "Start date", "date"],
     ["dueDate", "Due date", "date"],
      ["recurrence", "Recurrence", "lookup:my_task_recurrence", { default: "One time" }],
      ["description", "Notes", "textarea", { advanced: true }]
    ];
  }
  if (name === "assets" && row) {
    const operationalFields = new Set([
      "status",
      "attention",
      "permanentCustodianId",
      "currentHolderType",
      "currentOwnerId",
      "currentHolderName",
      "expectedReturnDate",
      "disposalReason",
      "disposedToType",
      "disposedToName",
      "settlementStatus",
      "settlementDate",
      "disposalNotes"
    ]);
    return (schemas.assets || []).filter(([key]) => !operationalFields.has(key));
  }
  return schemas[name] || [];
}

function fieldHtml(key, label, type, row, options = {}) {
  const baseKey = key.replace("Text", "");
  const value = row?.[baseKey] ?? row?.[key] ?? fieldDefault(options) ?? "";
  const full = type === "textarea" || options.full ? "full" : "";
  const required = options.required ? ` <span class="required">*</span>` : "";
  const placeholder = options.placeholder ? ` placeholder="${escapeHtml(options.placeholder)}"` : "";
  const describedBy = options.help ? `<small class="field-help">${escapeHtml(options.help)}</small>` : "";
  if (key.endsWith("Text")) {
    if (String(type || "").startsWith("lookup_multi:")) {
      const lookupType = type.split(":")[1];
      const selected = new Set(Array.isArray(row?.[baseKey]) ? row[baseKey] : String(value || "").split(",").map((item) => item.trim()).filter(Boolean));
      return `<label class="${full}">${fieldLabel(label, required)}<select name="${key}" multiple>${lookupOptions(lookupType, Boolean(row)).map((option) => `<option ${selected.has(lookupValue(option)) || selected.has(option.nameEn) ? "selected" : ""} value="${escapeHtml(lookupValue(option))}">${escapeHtml(lookupLabel(option))}</option>`).join("")}</select>${describedBy}</label>`;
    }
    return `<label class="${full}">${fieldLabel(label, required)}<textarea name="${key}"${placeholder}>${escapeHtml((row?.[baseKey] || []).join(", "))}</textarea>${describedBy}</label>`;
  }
  if (type === "textarea") return `<label class="full">${fieldLabel(label, required)}<textarea name="${key}"${placeholder}>${escapeHtml(value)}</textarea>${describedBy}</label>`;
  if (type === "file") return `<label class="full file-dropzone">${fieldLabel(label, required)}<span class="dropzone-box">${icon("attachments")}<strong>Drop a file here or browse</strong><small data-file-name data-default-text="${escapeHtml(options.help || "PDF, image, Word, or Excel file")}">${escapeHtml(options.help || "PDF, image, Word, or Excel file")}</small></span><input name="${key}" type="file" accept=".pdf,image/*,.doc,.docx,.xls,.xlsx" />${describedBy}</label>`;
  if (type === "checkbox") return `<label class="checkbox-field"><span>${fieldLabel(label, required)}</span><input name="${key}" type="checkbox" value="true" ${value === true || value === "true" ? "checked" : ""} /></label>`;
  if (type === "info") return `<div class="form-help full"><strong>${escapeHtml(label)}</strong><span>${escapeHtml(options.help || "")}</span></div>`;
  if (type === "employee_ticket_category") {
    return modernSelectHtml(key, label, value, ticketCategoryParents().map((option) => ({ value: option.code, label: lookupLabel(option), icon: employeeTicketCategoryIcon(option.code) })), { required: options.required, describedBy, placeholder: "Search request categories", full });
  }
  if (type === "employee_ticket_subcategory") {
    return modernSelectHtml(key, label, value, [], { required: options.required, describedBy, placeholder: "Search subcategories", attrs: `data-ticket-subcategory data-selected="${escapeHtml(value)}"`, full });
  }
  if (type === "custom_task_category") {
    const custom = row?.category && !employeeTaskBuiltInCategories.includes(row.category) && row.category !== "Other" ? row.category : "";
    const active = Boolean(custom);
    return `<label class="full task-custom-category ${active ? "" : "hidden"}" data-custom-task-category>${label} <span class="required">*</span><input name="${key}" value="${escapeHtml(custom)}" ${active ? "required" : "disabled"} minlength="3" placeholder="Home, Travel, Project, Certification, Azure, Family" /><small class="field-help">Minimum 3 characters. This will not be saved to the master category list.</small></label>`;
  }
  if (String(type || "").startsWith("lookup:")) {
    const lookupType = type.split(":")[1];
    if (isEmployeeUser() && ["my_task_category", "my_task_priority", "my_task_status", "my_task_recurrence"].includes(lookupType)) {
      const modernOptions = lookupOptions(lookupType, Boolean(row)).map((option) => ({ value: lookupValue(option), label: lookupLabel(option), icon: option.icon || "tasks" }));
      const selectedValue = lookupType === "my_task_category" && value && !employeeTaskBuiltInCategories.includes(String(value)) && String(value) !== "Other" ? "Other" : value;
      return modernSelectHtml(key, label, selectedValue, modernOptions, { required: options.required, describedBy, placeholder: `Select ${label.toLowerCase()}`, full, selectOnly: true });
    }
    return `<label>${fieldLabel(label, required)}<select name="${key}" ${options.required ? "required" : ""}><option value=""></option>${lookupOptions(lookupType, Boolean(row)).map((option) => `<option ${String(value) === String(lookupValue(option)) || String(value) === String(option.nameEn) ? "selected" : ""} value="${escapeHtml(lookupValue(option))}">${escapeHtml(lookupLabel(option))}</option>`).join("")}</select>${describedBy}</label>`;
  }
  if (type === "templates") {
    return `<label>${fieldLabel(label, required)}<select name="${key}" ${options.required ? "required" : ""}><option value=""></option>${(state.db.formTemplates || []).filter((tpl) => !tpl.archivedAt && !tpl.deletedAt).map((option) => `<option ${value === option.name ? "selected" : ""} value="${escapeHtml(option.name)}">${escapeHtml(option.name)}</option>`).join("")}</select>${describedBy}</label>`;
  }
  if (type === "ticket_category_tree") {
    const selected = String(value || "");
    const optionsHtml = ticketCategoryParents().map((parent) => {
      const children = ticketCategoryChildren(parent.code);
      if (!children.length) return `<option ${selected === parent.code ? "selected" : ""} value="${escapeHtml(parent.code)}">${escapeHtml(lookupLabel(parent))}</option>`;
      return `<optgroup label="${escapeHtml(lookupLabel(parent))}">${children.map((child) => `<option ${selected === child.code ? "selected" : ""} value="${escapeHtml(child.code)}">${escapeHtml(lookupLabel(child))}</option>`).join("")}</optgroup>`;
    }).join("");
    return `<label>${fieldLabel(label, required)}<select name="${key}" ${options.required ? "required" : ""}><option value=""></option>${optionsHtml}</select>${describedBy}</label>`;
  }
  if (type === "lookup_parent_codes") {
    const currentType = row?.type || "ticket_category";
    const parents = (state.db.lookupItems || []).filter((item) => item.type === currentType && !item.parentCode && item.active !== false && item.code !== row?.code);
    return `<label>${fieldLabel(label, required)}<select name="${key}"><option value="">None (this is a main value)</option>${parents.map((option) => `<option ${value === option.code ? "selected" : ""} value="${escapeHtml(option.code)}">${escapeHtml(lookupLabel(option))}</option>`).join("")}</select>${describedBy}</label>`;
  }
  if (type === "lookup_types") {
    return `<label>${fieldLabel(label, required)}<select name="${key}" ${options.required ? "required" : ""}><option value=""></option>${lookupListTypes().map((option) => `<option ${value === option ? "selected" : ""} value="${escapeHtml(option)}">${escapeHtml(labelize(option))}</option>`).join("")}</select>${describedBy}</label>`;
  }
  if (type === "person_types") {
    return `<label>${fieldLabel(label, required)}<select name="${key}" ${options.required ? "required" : ""}>${personTypes.map((option) => `<option ${value === option ? "selected" : ""} value="${escapeHtml(option)}">${escapeHtml(option)}</option>`).join("")}</select>${describedBy}</label>`;
  }
  if (type === "account_types") {
    return `<label>${fieldLabel(label, required)}<select name="${key}" ${options.required ? "required" : ""}>${accountTypes.map((option) => `<option ${value === option ? "selected" : ""} value="${escapeHtml(option)}">${escapeHtml(option)}</option>`).join("")}</select>${describedBy}</label>`;
  }
  if (type === "asset_statuses") {
    return `<label>${fieldLabel(label, required)}<select name="${key}" ${options.required ? "required" : ""}>${assetStatuses.map((option) => `<option ${value === option ? "selected" : ""} value="${escapeHtml(option)}">${escapeHtml(assetStatusLabel(option))}</option>`).join("")}</select>${describedBy}</label>`;
  }
  if (type === "asset_attention") {
    return `<label>${fieldLabel(label, required)}<select name="${key}" ${options.required ? "required" : ""}>${assetAttentionLevels.map((option) => `<option ${value === option ? "selected" : ""} value="${escapeHtml(option)}">${escapeHtml(labelize(option))}</option>`).join("")}</select>${describedBy}</label>`;
  }
  if (type === "holder_types") {
    return `<label>${fieldLabel(label, required)}<select name="${key}" ${options.required ? "required" : ""}>${assetHolderTypeValues.map((option) => `<option ${value === option ? "selected" : ""} value="${escapeHtml(option)}">${escapeHtml(option)}</option>`).join("")}</select>${describedBy}</label>`;
  }
  if (type === "disposal_reasons") {
    return `<label>${fieldLabel(label, required)}<select name="${key}" ${options.required ? "required" : ""}><option value=""></option>${assetDisposalReasons.map((option) => `<option ${value === option ? "selected" : ""} value="${escapeHtml(option)}">${escapeHtml(option)}</option>`).join("")}</select>${describedBy}</label>`;
  }
  if (type === "disposed_to_types") {
    return `<label>${fieldLabel(label, required)}<select name="${key}" ${options.required ? "required" : ""}><option value=""></option>${assetDisposedToTypes.map((option) => `<option ${value === option ? "selected" : ""} value="${escapeHtml(option)}">${escapeHtml(option)}</option>`).join("")}</select>${describedBy}</label>`;
  }
  if (type === "settlement_statuses") {
    return `<label>${fieldLabel(label, required)}<select name="${key}" ${options.required ? "required" : ""}><option value=""></option>${assetSettlementStatuses.map((option) => `<option ${value === option ? "selected" : ""} value="${escapeHtml(option)}">${escapeHtml(option)}</option>`).join("")}</select>${describedBy}</label>`;
  }
  if (type === "modules") {
    return `<label>${fieldLabel(label, required)}<select name="${key}" ${options.required ? "required" : ""}><option value=""></option>${modules.filter((module) => module !== "dashboard").map((option) => `<option ${value === option ? "selected" : ""} value="${escapeHtml(option)}">${escapeHtml(t(option))}</option>`).join("")}</select>${describedBy}</label>`;
  }
  if (String(type || "").startsWith("linked_record:")) {
    const typeField = type.split(":")[1];
    const linkedType = row?.[typeField] || "";
    return `<label>${fieldLabel(label, required)}<select name="${key}" data-linked-record="${typeField}" data-selected="${escapeHtml(value)}"><option value=""></option>${linkedRecordOptions(linkedType).map((option) => `<option ${value === option.id ? "selected" : ""} value="${option.id}">${escapeHtml(linkedRecordLabel(option))}</option>`).join("")}</select>${describedBy}</label>`;
  }
  if (["users", "it_users", "roles", "employees", "employee_assets", "departments", "vendors", "assets", "documents"].includes(type)) {
    const optionRows = entityOptions(type);
    return `<label>${fieldLabel(label, required)}<select name="${key}" ${options.required ? "required" : ""}><option value=""></option>${optionRows.map((option) => `<option ${value === option.id ? "selected" : ""} value="${option.id}">${escapeHtml(option.name || option.assetNumber || option.title || option.email)}</option>`).join("")}</select>${describedBy}</label>`;
  }
  return `<label class="${full}">${fieldLabel(label, required)}<input name="${key}" type="${type || "text"}" value="${escapeHtml(value)}" ${options.required ? "required" : ""}${placeholder} />${describedBy}</label>`;
}

function modernSelectHtml(key, label, value, options, config = {}) {
  const selected = options.find((option) => String(option.value) === String(value) || String(option.label) === String(value));
  const required = config.required ? ` <span class="required">*</span>` : "";
  const placeholder = config.placeholder || tpl("Search {module}", { module: label });
  return `
    <label class="modern-select-field ${config.full || ""}" data-modern-select ${config.selectOnly ? 'data-select-only="true"' : ""}>
      <span>${escapeHtml(label)}${required}</span>
      <input type="hidden" name="${key}" value="${escapeHtml(selected?.value || value || "")}" ${config.attrs || ""}>
      <div class="modern-select-control">
        ${icon(selected?.icon || "search")}
        <input data-modern-search value="${escapeHtml(selected?.label || "")}" placeholder="${escapeHtml(placeholder)}" autocomplete="off" ${config.selectOnly ? "readonly" : ""}>
      </div>
      <div class="modern-select-options" data-modern-options>
        ${options.map((option) => modernOptionButton(option, String(option.value) === String(selected?.value))).join("")}
      </div>
      ${config.describedBy || ""}
    </label>
  `;
}

function modernOptionButton(option, selected = false) {
  return `<button type="button" class="${selected ? "selected" : ""}" data-modern-option data-value="${escapeHtml(option.value)}" data-label="${escapeHtml(option.label)}">${icon(option.icon || "search")}<span>${escapeHtml(option.label)}</span></button>`;
}

function lookupListTypes() {
  return [...new Set((state.db.lookupItems || []).map((item) => item.type).filter((type) => type && type !== "department"))].sort();
}

function linkedTypeToCollection(type) {
  return ({ employee: "employees", asset: "assets", ticket: "tickets", task: "tasks", contract: "contracts", vendor: "vendors", document: "documents" }[type] || "");
}

function linkedRecordOptions(type) {
  const collection = linkedTypeToCollection(type);
  return collection ? rows(collection) : [];
}

function linkedRecordLabel(row) {
  return row.name || row.title || row.ticketNumber || row.assetNumber || row.email || row.id;
}

function entityOptions(type) {
  if (type === "it_users") return rows("users").filter((user) => state.db.roles.find((role) => role.id === user.roleId)?.id !== "role_employee");
  if (type === "employee_assets") {
    const employee = employeeForUser();
    return rows("assets").filter((asset) => asset.currentOwnerId === employee?.id);
  }
  return rows(type);
}

function serviceCustomItems(form) {
  const data = form instanceof FormData ? form : new FormData(form);
  const names = data.getAll("employeeServiceOtherName").map((value) => String(value).trim());
  const quantities = data.getAll("employeeServiceOtherQuantity").map((value) => String(value).trim());
  return names.map((name, index) => ({ name, quantity: quantities[index] || "" })).filter((item) => item.name || item.quantity);
}

function validateForm(form, name, row = null) {
  const data = Object.fromEntries(new FormData(form).entries());
  // One rule set for login accounts, whichever form is collecting them.
  const validateAccountFields = (prefix) => {
    const read = (field) => String(data[prefix ? prefix + field[0].toUpperCase() + field.slice(1) : field] || "").trim();
    if (!read("name")) return "Account name is required.";
    if (!read("username")) return "Username is required.";
    if (!read("roleId")) return "Role is required.";
    if (!read("accountType")) return "Account type is required.";
    if (!read("password")) return "Password is required.";
    if (!read("confirmPassword")) return "Confirm Password is required.";
    if (read("password") !== read("confirmPassword")) return "Password and Confirm Password must match.";
    return "";
  };
  if (name === "employees" && !row && data.accountAccessMode === "create") {
    const problem = validateAccountFields("account");
    if (problem) return problem;
  }
  if (name === "users" && !row) {
    const purpose = data.accountPurpose || "employee";
    if (purpose === "employee" && !String(data.employeeId || "").trim()) return "Choose the person this account belongs to.";
    const problem = validateAccountFields("");
    if (problem) return problem;
  }
  if (usesTicketWizard(name, row)) {
    if (canCreateTicketOnBehalf() && !String(data.requesterId || "").trim()) return "Choose the employee this request is for.";
    if (!String(data.employeeMainCategory || "").trim()) return "Main Category is required.";
    if (data.employeeSubjectMode === "true" && !String(data.employeeSubject || "").trim()) return "Subject is required.";
    if (data.employeeSubjectMode !== "true" && !String(data.employeeSubcategory || "").trim()) return "Subcategory is required.";
    const serviceRequest = employeeServiceRequestOptions[data.employeeSubcategory] || null;
    const serviceItems = new FormData(form).getAll("employeeServiceItem").map((item) => String(item).trim()).filter(Boolean);
    const customItems = serviceCustomItems(form);
    if (serviceRequest && !serviceRequest.alwaysCustom && !serviceItems.length) return `Select at least one ${serviceRequest.itemLabel}.`;
    const needsCustomItems = serviceRequest && (serviceRequest.alwaysCustom || serviceItems.some((item) => item.startsWith("Other ")));
    if (needsCustomItems && !customItems.length) return `Add at least one other ${serviceRequest.itemLabel}.`;
    for (const item of customItems) {
      if (!item.name) return `Other ${serviceRequest.itemLabel} is required.`;
      if (item.quantity && (!Number.isInteger(Number(item.quantity)) || Number(item.quantity) < 1)) return "Quantity must be at least 1.";
    }
    if (data.employeeMainCategory !== "service_requests" && !String(data.description || "").trim()) return "Description is required.";
    return "";
  }
  if (name === "tasks" && isEmployeeUser()) {
    const allowedCategories = [...employeeTaskBuiltInCategories, "Other"];
    const categoryLabel = employeeTaskCategoryLabel(data.category);
    if (!allowedCategories.includes(categoryLabel)) return "Category is required.";
    if (categoryLabel === "Other") {
      const custom = String(data.customCategory || "").trim();
      if (!custom) return "Custom category is required.";
      if (custom.length < 3) return "Custom category must be at least 3 characters.";
    }
  }
  for (const [key, label, , options = {}] of formSchema(name, row)) {
    if (options.required && !String(data[key] || "").trim()) return `${label} is required.`;
  }
  if (name === "assets" && data.serialNumber) {
    const duplicate = rows("assets").find((asset) => asset.serialNumber && asset.serialNumber.toLowerCase() === String(data.serialNumber).toLowerCase() && asset.id !== row?.id);
    if (duplicate) return `Serial number already exists on ${duplicate.assetNumber || duplicate.id}.`;
  }
  return "";
}

function nextNumber(prefix, collectionName, field) {
  const current = rows(collectionName).map((row) => String(row[field] || "")).map((value) => Number((value.match(/(\d+)$/) || [0, 0])[1])).filter(Boolean);
  return `${prefix}-${String((Math.max(0, ...current) + 1)).padStart(4, "0")}`;
}

function reminderDateFromPeriod(endDate, period) {
  if (!endDate || !period) return "";
  const days = Number(String(period).match(/\d+/)?.[0] || 0);
  if (!days) return "";
  const date = new Date(`${endDate}T00:00:00`);
  date.setDate(date.getDate() - days);
  return date.toISOString().slice(0, 10);
}

function formToObject(form, name, row = null) {
  const body = {};
  for (const [key, value] of form.entries()) {
    if (value instanceof File) continue;
    if (key.endsWith("Text")) {
      const target = key.replace("Text", "");
      const values = String(value).split(",").map((item) => item.trim()).filter(Boolean);
      body[target] = [...(body[target] || []), ...values];
    }
    else if (key === "published") body.published = value === "Published" || value === "true";
    else if (value === "true" && schemas[name]?.find((field) => field[0] === key)?.[2] === "checkbox") body[key] = true;
    else if (value !== "") body[key] = value;
  }
  if (usesTicketWizard(name, row)) {
    const employee = employeeForUser();
    // Employees always file for themselves; IT picks the requester in step 0.
    body.requesterId = canCreateTicketOnBehalf() ? body.requesterId : employee?.id || body.requesterId;
    body.mainCategoryCode = body.employeeMainCategory || "";
    body.subcategoryCode = body.employeeSubjectMode === "true" ? "" : body.employeeSubcategory || "";
    body.category = ticketCategoryLabel(body.subcategoryCode || body.mainCategoryCode);
    body.priority = body.priority || "medium";
    body.status = "open";
    if (body.employeeSubject) body.subject = body.employeeSubject;
    const serviceRequest = employeeServiceRequestOptions[body.employeeSubcategory] || null;
    if (serviceRequest) {
      const serviceItems = form.getAll("employeeServiceItem").map((item) => String(item).trim()).filter(Boolean);
      const customItems = serviceCustomItems(form).map((item) => `${item.name}${item.quantity ? ` (Quantity: ${item.quantity})` : ""}`);
      const requestedItems = serviceItems.filter((item) => !item.startsWith("Other "));
      if (customItems.length) requestedItems.push(...customItems);
      const requestDetails = `${serviceRequest.outputLabel}: ${requestedItems.join(", ")}`;
      body.description = [requestDetails, body.description].filter(Boolean).join("\n\n");
    }
    const suggested = suggestedKnowledgeArticles([body.category, body.subject, body.description].filter(Boolean).join(" ")).slice(0, 3).map((article) => article.id);
    body.suggestedArticleIds = [...new Set([...(state.pendingSuggestedArticleIds || []), ...suggested])];
    state.pendingSuggestedArticleIds = [];
    delete body.employeeMainCategory;
    delete body.employeeSubcategory;
    delete body.employeeSubject;
    delete body.employeeSubjectMode;
    delete body.employeeServiceItem;
    delete body.employeeServiceOtherName;
    delete body.employeeServiceOtherQuantity;
    delete body.submitNote;
  }
  if (name === "employees") {
    if (body.accountAccessMode === "create") {
      body.systemAccess = { createLogin: true, ...normaliseAccountPayload(body, "account") };
    }
    delete body.accountAccessMode;
    delete body.accountCreateLogin;
    ACCOUNT_FIELD_KEYS.forEach((field) => { delete body["account" + field[0].toUpperCase() + field.slice(1)]; });
    delete body.accountTemporaryPassword;
    delete body.accountEnabled;
    delete body.accountSendWelcomeEmail;
  }
  if (name === "users") {
    const purpose = body.accountPurpose || "employee";
    Object.assign(body, normaliseAccountPayload(body, ""));
    if (purpose === "service") body.employeeId = "";
    delete body.confirmPassword;
    delete body.accountPurpose;
  }
  if (name === "tickets" && !body.status) body.status = "open";
  if (name === "tickets" && body.relatedAssetId) {
    body.relatedType = "asset";
    body.relatedId = body.relatedAssetId;
  }
  if (name === "tickets" && !body.comments) body.comments = [];
  if (name === "tickets" && !body.history) body.history = ["Created"];
  if (name === "tasks" && isEmployeeUser()) {
    const categoryLabel = employeeTaskCategoryLabel(body.category);
    if (categoryLabel === "Other") body.category = String(body.customCategory || "").trim();
    else if (categoryLabel) body.category = categoryLabel;
    delete body.customCategory;
  }
  if (name === "tasks" && !row && !body.status) body.status = isEmployeeUser() ? "Pending" : "open";
  if (name === "tasks" && !row && !body.createdBy) body.createdBy = state.user?.id;
  if (name === "tasks" && !row && !body.createdDate) body.createdDate = today();
  if (name === "assets" && body.cost) body.cost = Number(body.cost);
  if (name === "transfers") {
    body.from = [body.fromEmployeeId && look("employees", body.fromEmployeeId), body.fromLocation].filter(Boolean).join(" / ");
    body.to = [body.toEmployeeId && look("employees", body.toEmployeeId), body.toLocation].filter(Boolean).join(" / ");
  }
  if (name === "contracts" && body.endDate && body.renewalReminderPeriod && !body.renewalReminderDate) body.renewalReminderDate = reminderDateFromPeriod(body.endDate, body.renewalReminderPeriod);
  if (name === "contracts" && body.endDate) {
    const daysRemaining = Math.ceil((new Date(`${body.endDate}T00:00:00`) - new Date()) / 86400000);
    body.daysRemaining = daysRemaining;
    body.renewalStatus = daysRemaining < 0 ? "expired" : daysRemaining <= 30 ? "renewal_due" : "active";
    if (!body.status) body.status = body.renewalStatus;
  }
  if (name === "contracts" && body.cost) body.cost = Number(body.cost);
  if (name === "vendors" && body.rating) body.rating = Number(body.rating);
  if (name === "lookup_items") {
    body.sortOrder = body.sortOrder ? Number(body.sortOrder) : lookupOptions(body.type, true).length + 1;
    body.active = form.has("active");
  }
  return body;
}

function emptyRolePermissions() {
  return Object.fromEntries(modules.map((module) => [module, Object.fromEntries(perms.map((perm) => [perm, false]))]));
}

function employeeForUser() {
  if (!state.user) return null;
  if (state.user.employeeId) return rows("employees").find((employee) => employee.id === state.user.employeeId);
  if (state.user.id === "user_employee") return rows("employees").find((employee) => employee.id === "emp_lina");
  return rows("employees").find((employee) => employee.email && state.user.email && employee.email.toLowerCase() === state.user.email.toLowerCase());
}

function isEmployeeUser() {
  return state.role?.id === "role_employee";
}

function singular(name) {
  return ({ employees: "employee", assets: "asset", tickets: "ticket", tasks: "task", contracts: "contract", vendors: "vendor", documents: "document", knowledge_base: "knowledge_base", form_templates: "form_template" }[name] || name);
}

function formatSize(size) {
  const value = Number(size || 0);
  if (value > 1024 * 1024) return `${(value / 1024 / 1024).toFixed(1)} MB`;
  if (value > 1024) return `${Math.round(value / 1024)} KB`;
  return `${value} B`;
}

function mimeForName(name) {
  const ext = String(name).split(".").pop().toLowerCase();
  return { pdf: "application/pdf", doc: "application/msword", docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document", xls: "application/vnd.ms-excel", xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg" }[ext] || "application/octet-stream";
}

function readFileData(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function downloadAttachment(id) {
  const item = state.db.attachments.find((attachment) => attachment.id === id);
  if (!item) return;
  // Attachment bytes are served from the API, not carried in application state.
  const link = document.createElement("a");
  link.href = `/api/attachments/${encodeURIComponent(id)}/download`;
  link.download = item.filename || id;
  document.body.appendChild(link);
  link.click();
  link.remove();
}

// Preview needs the bytes in the page, so pull them as a blob URL on demand.
async function attachmentObjectUrl(id) {
  const response = await fetch(`/api/attachments/${encodeURIComponent(id)}/download`, { credentials: "same-origin" });
  if (!response.ok) throw new Error(trText("Could not load attachment"));
  return URL.createObjectURL(await response.blob());
}

function downloadNamedFile(filename) {
  if (!filename) return;
  const link = document.createElement("a");
  link.href = URL.createObjectURL(new Blob([`IT Command Center V1 document placeholder: ${filename}`], { type: "text/plain" }));
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}

function previewNamedFile(filename) {
  if (!filename) return;
  $("#dialogHost").innerHTML = `<div class="modal-backdrop"><section class="surface-card preview-card"><div class="modal-head"><div><p class="eyebrow">Preview</p><h3>${escapeHtml(filename)}</h3></div><button class="icon-btn" data-preview-close>${icon("close")}</button></div><div class="attachment-preview large"><strong>${escapeHtml(filename)}</strong><span class="muted">Preview metadata is available in V1. Use Download to open the file locally.</span><button class="btn btn-secondary" data-download-file="${escapeHtml(filename)}">Download</button></div></section></div>`;
  $("[data-preview-close]")?.addEventListener("click", () => $("#dialogHost").innerHTML = "");
  $$("[data-download-file]").forEach((button) => button.addEventListener("click", () => downloadNamedFile(button.dataset.downloadFile)));
}

function previewAttachment(id) {
  const item = state.db.attachments.find((attachment) => attachment.id === id);
  if (!item) return;
  const isImage = String(item.mimeType || "").startsWith("image/");
  const isPdf = String(item.mimeType || "").includes("pdf");
  const isOffice = /word|excel|spreadsheet|msword|officedocument/.test(String(item.mimeType || ""));
  // Images and PDFs stream from the download route; the session cookie authorises it.
  const src = `/api/attachments/${encodeURIComponent(item.id)}/download`;
  const preview = isImage
    ? `<img class="attachment-preview large" src="${src}" alt="${escapeHtml(item.filename)}">`
    : isPdf
      ? `<iframe class="attachment-frame" src="${src}" title="${escapeHtml(item.filename)}"></iframe>`
      : isOffice
        ? `<div class="attachment-preview large"><strong>${escapeHtml(item.filename)}</strong><span class="muted">Office documents cannot be rendered inline in this V1 browser preview. Use Download to open the file.</span><button class="btn btn-secondary" data-download-attachment="${item.id}">Download</button></div>`
        : `<div class="attachment-preview large">${escapeHtml(item.mimeType || "Preview unavailable for this demo file")}</div>`;
  $("#dialogHost").innerHTML = `<div class="modal-backdrop"><section class="surface-card preview-card"><div class="modal-head"><div><p class="eyebrow">Attachment preview</p><h3>${escapeHtml(item.filename)}</h3></div><button class="icon-btn" data-preview-close>${icon("close")}</button></div>${preview}</section></div>`;
  $("[data-preview-close]")?.addEventListener("click", () => $("#dialogHost").innerHTML = "");
  $$("[data-download-attachment]").forEach((button) => button.addEventListener("click", () => downloadAttachment(button.dataset.downloadAttachment)));
}

function relatedRecords(name, row) {
  const related = [];
  if (name === "employees") {
    related.push(...rows("assets").filter((item) => item.currentOwnerId === row.id).map((item) => ({ type: "assets", row: item })));
    related.push(...rows("tickets").filter((item) => item.requesterId === row.id).map((item) => ({ type: "tickets", row: item })));
  }
  if (name === "assets") {
    related.push(...rows("transfers").filter((item) => item.assetId === row.id).map((item) => ({ type: "transfers", row: item })));
    if (row.currentOwnerId) related.push(...rows("employees").filter((item) => item.id === row.currentOwnerId).map((item) => ({ type: "employees", row: item })));
  }
  if (name === "tickets") {
    related.push(...rows("employees").filter((item) => item.id === row.requesterId).map((item) => ({ type: "employees", row: item })));
    related.push(...rows("tasks").filter((item) => item.relatedId === row.id).map((item) => ({ type: "tasks", row: item })));
  }
  if (name === "contracts") related.push(...rows("vendors").filter((item) => item.id === row.vendorId).map((item) => ({ type: "vendors", row: item })));
  related.push(...rows("documents").filter((item) => item.linkedId === row.id || item.linkedType === singular(name)).map((item) => ({ type: "documents", row: item })));
  return related;
}

function groupedSearch(query) {
  const q = String(query || "").toLowerCase();
  if (!q) return [];
  return ["employees", "assets", "tickets", "tasks", "contracts", "vendors", "documents"].filter((name) => has(name, "view") || (state.page === "employee_portal" && name === "assets")).map((name) => ({
    name,
    items: rows(name).filter((row) => JSON.stringify(row).toLowerCase().includes(q)).slice(0, 4)
  })).filter((group) => group.items.length);
}

function openDetail(name, row) {
  if (!row) return;
  if (name === "employees" && !isEmployeeUser()) {
    openPeopleWorkspace(row.id);
    return;
  }
  if (name === "users" && !isEmployeeUser()) {
    openAccountWorkspace(row.id);
    return;
  }
  if (workspaceModules.has(name) && !isEmployeeUser()) {
    openStandardWorkspace(name, row.id);
    return;
  }
  if (name === "tickets" && !isEmployeeUser()) {
    state.ticketWorkspaceSelectedId = row.id;
    state.ticketWorkspaceTab = "Conversation";
    state.detail = null;
    state.page = "tickets";
    setHomeRoute();
    render();
    return;
  }
  if (name === "tasks" && !isEmployeeUser()) {
    state.taskWorkspaceSelectedId = row.id;
    state.taskWorkspaceTab = "Overview";
    state.detail = null;
    state.page = "tasks";
    setHomeRoute();
    render();
    return;
  }
  if (name === "knowledge_base") {
    rememberKnowledgeArticle(row.id);
    api(`/api/knowledge_base/${row.id}/workflow`, { method: "PATCH", body: JSON.stringify({ workflow: "view" }) }).then(loadState).catch(() => {});
  }
  state.detail = { name, id: row.id, tab: "Overview" };
  state.page = name;
  setRouteForDetail(name, row.id);
  render();
}

function openPeopleWorkspace(id) {
  state.peopleWorkspaceSelectedId = id;
  state.peopleWorkspaceTab = "Overview";
  state.detail = null;
  state.page = "employees";
  setHomeRoute();
  render();
}

function openAccountWorkspace(id) {
  state.accountWorkspaceSelectedId = id;
  state.accountWorkspaceTab = "Overview";
  state.detail = null;
  state.page = "users";
  setHomeRoute();
  render();
}

function openStandardWorkspace(name, id) {
  state.workspaceSelected[name] = id;
  state.workspaceTab[name] = "Overview";
  state.detail = null;
  state.page = name;
  setHomeRoute();
  render();
}

function confirmDialog(title, body, options = {}) {
  return new Promise((resolve) => {
    const cancelLabel = options.cancelLabel || "Cancel";
    const confirmLabel = options.confirmLabel || "Archive";
    const confirmClass = options.confirmClass || "btn-danger";
    $("#dialogHost").innerHTML = `<div class="modal-backdrop"><section class="confirm-card surface-card"><p class="eyebrow">Confirm action</p><h3>${escapeHtml(title)}</h3><p class="muted">${escapeHtml(body)}</p><div class="modal-actions"><button class="btn btn-secondary" data-confirm="no">${escapeHtml(cancelLabel)}</button><button class="btn ${escapeHtml(confirmClass)}" data-confirm="yes">${escapeHtml(confirmLabel)}</button></div></section></div>`;
    $$("[data-confirm]").forEach((button) => button.addEventListener("click", () => {
      const ok = button.dataset.confirm === "yes";
      $("#dialogHost").innerHTML = "";
      resolve(ok);
    }));
  });
}

function confirmTicketChanges(ticket, draft, fields) {
  const labels = { assignedToId: "Assigned To", status: "Status", priority: "Priority", waitingReason: "Waiting reason", cancelReason: "Cancel reason" };
  const display = (field, value) => {
    if (field === "assignedToId") return look("users", value) || "Unassigned";
    return field === "status" || field === "priority" ? labelize(value || "") : value || "Not set";
  };
  return new Promise((resolve) => {
    $("#dialogHost").innerHTML = `<div class="modal-backdrop"><section class="confirm-card surface-card ticket-save-confirm"><p class="eyebrow">Ticket workspace</p><h3>Save changes?</h3><div class="ticket-change-summary">${fields.map((field) => `<div><small>${escapeHtml(labels[field])}</small><strong>${escapeHtml(display(field, ticket[field]))} <span>&rarr;</span> ${escapeHtml(display(field, draft[field]))}</strong></div>`).join("")}</div><div class="modal-actions"><button class="btn btn-secondary" data-ticket-save-confirm="no">Cancel</button><button class="btn btn-primary" data-ticket-save-confirm="yes">Confirm</button></div></section></div>`;
    $$("[data-ticket-save-confirm]").forEach((button) => button.addEventListener("click", () => {
      const ok = button.dataset.ticketSaveConfirm === "yes";
      $("#dialogHost").innerHTML = "";
      resolve(ok);
    }));
  });
}

function accountPayloadFromForm(form) {
  const data = Object.fromEntries(new FormData(form).entries());
  return {
    username: String(data.username || "").trim(),
    email: String(data.email || "").trim(),
    roleId: data.roleId,
    temporaryPassword: data.temporaryPassword,
    expiryDate: data.expiryDate || "",
    requirePasswordChange: data.requirePasswordChange === "true"
  };
}


async function resetUserPassword(userId) {
  const password = await textDialog("Reset password", "Enter a new temporary password.", "");
  if (!password) return;
  try {
    await api(`/api/users/${userId}/reset-password`, { method: "PATCH", body: JSON.stringify({ password }) });
    toast("Password reset", "The account now requires a password change on next login.");
    await loadState(); render();
  } catch (error) { toast("Could not reset password", error.message); }
}

async function disableUserAccount(userId) {
  const ok = await confirmDialog("Disable account?", "The linked person remains active, but this login account cannot sign in.", { confirmLabel: "Disable", confirmClass: "btn-danger" });
  if (!ok) return;
  await api(`/api/users/${userId}/disable`, { method: "PATCH", body: "{}" });
  toast("Account disabled", "Login access was disabled.");
  await loadState(); render();
}

async function unlockUserAccount(userId) {
  await api(`/api/users/${userId}/unlock`, { method: "PATCH", body: "{}" });
  toast("Account unlocked", "The account is active again.");
  await loadState(); render();
}

async function changeUserRole(userId) {
  const user = rows("users").find((row) => row.id === userId);
  if (!user) return;
  $("#dialogHost").innerHTML = `
    <div class="modal-backdrop"><form class="confirm-card surface-card account-dialog" data-role-change-form="${user.id}">
      <p class="eyebrow">System Access</p><h3>Change role</h3>
      <label>Role <select name="roleId">${rows("roles").map((role) => `<option value="${role.id}" ${role.id === user.roleId ? "selected" : ""}>${escapeHtml(role.name)}</option>`).join("")}</select></label>
      <div class="modal-actions"><button class="btn btn-secondary" type="button" data-role-dialog-cancel>Cancel</button><button class="btn btn-primary" type="submit">Change Role</button></div>
    </form></div>`;
  $("[data-role-dialog-cancel]")?.addEventListener("click", () => $("#dialogHost").innerHTML = "");
  $("[data-role-change-form]")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const roleId = new FormData(event.currentTarget).get("roleId");
    await api(`/api/users/${user.id}/change-role`, { method: "PATCH", body: JSON.stringify({ roleId }) });
    $("#dialogHost").innerHTML = "";
    toast("Role changed", "The account role was updated.");
    await loadState(); render();
  });
}

function withdrawTicketDialog() {
  return new Promise((resolve) => {
    const reasons = ["", "Created by mistake", "No longer needed", "Duplicate request", "Problem solved", "Other"];
    $("#dialogHost").innerHTML = `<div class="modal-backdrop"><section class="confirm-card surface-card"><p class="eyebrow">Withdraw request</p><h3>Are you sure you want to withdraw this request?</h3><label class="withdraw-reason"><span>Reason <small>(optional)</small></span><select data-withdraw-reason>${reasons.map((reason) => `<option value="${escapeHtml(reason)}">${escapeHtml(reason || "Select a reason")}</option>`).join("")}</select></label><div class="modal-actions"><button class="btn btn-secondary" data-withdraw-cancel>Keep request</button><button class="btn btn-danger" data-withdraw-confirm>Withdraw request</button></div></section></div>`;
    $("[data-withdraw-cancel]")?.addEventListener("click", () => { $("#dialogHost").innerHTML = ""; resolve(null); });
    $("[data-withdraw-confirm]")?.addEventListener("click", () => {
      const reason = $("[data-withdraw-reason]")?.value || "";
      $("#dialogHost").innerHTML = "";
      resolve(reason);
    });
  });
}

function textDialog(title, body, value = "") {
  return new Promise((resolve) => {
    $("#dialogHost").innerHTML = `<div class="modal-backdrop"><section class="confirm-card surface-card"><p class="eyebrow">Comment</p><h3>${escapeHtml(title)}</h3><p class="muted">${escapeHtml(body)}</p><textarea id="dialogText">${escapeHtml(value)}</textarea><div class="modal-actions" style="margin-top:12px"><button class="btn btn-secondary" data-text-cancel>Cancel</button><button class="btn btn-primary" data-text-save>Save</button></div></section></div>`;
    $("#dialogText")?.focus();
    $("[data-text-cancel]")?.addEventListener("click", () => {
      $("#dialogHost").innerHTML = "";
      resolve("");
    });
    $("[data-text-save]")?.addEventListener("click", () => {
      const next = $("#dialogText")?.value || "";
      $("#dialogHost").innerHTML = "";
      resolve(next);
    });
  });
}

function toast(title, body) {
  const item = document.createElement("div");
  item.className = "toast";
  item.innerHTML = `<strong>${escapeHtml(trText(title))}</strong><span class="muted">${escapeHtml(trText(body))}</span>`;
  $("#toastHost").appendChild(item);
  localizeRenderedUi(item);
  setTimeout(() => item.remove(), 3400);
}

function closeTopOverlay() {
  if ($("#dialogHost")?.innerHTML.trim()) {
    $("#dialogHost").innerHTML = "";
    return true;
  }
  if ($("#menuHost")?.innerHTML.trim()) {
    $("#menuHost").innerHTML = "";
    return true;
  }
  const modals = [...document.querySelectorAll("body > .modal-backdrop")];
  const top = modals[modals.length - 1];
  if (top) {
    top.remove();
    return true;
  }
  return false;
}

// Sign-in runs as a small state machine: email -> code -> (optional) TOTP.
// A password path remains for accounts that still have one.
const loginState = { step: "email", email: "", userId: "" };

function showLoginStep(step) {
  loginState.step = step;
  $$("[data-login-step]").forEach((node) => {
    const active = node.dataset.loginStep === step;
    node.hidden = !active;
    // A hidden field still takes part in form validation, so an empty required
    // input on an inactive step would block submission with no visible reason.
    // Disabled controls are exempt, so inactive steps are switched off entirely.
    $$("input", node).forEach((input) => { input.disabled = !active; });
  });
  const error = $("[data-login-error]");
  if (error) { error.hidden = true; error.textContent = ""; }
  const focusTarget = $(`[data-login-step="${step}"] input`);
  if (focusTarget) setTimeout(() => focusTarget.focus(), 0);
}

function loginError(message) {
  const error = $("[data-login-error]");
  if (!error) return;
  error.textContent = trText(message);
  error.hidden = false;
}

async function enterWorkspace(result) {
  state.user = result.user;
  state.role = result.role;
  await loadState();
  applyRouteFromLocation();
  if (window.location.pathname === "/") state.page = userPreferences().landing;
  $("#login").classList.add("hidden");
  $("#app").classList.remove("hidden");
  render();
  toast("Signed in", tpl("Welcome back, {name}.", { name: state.user.name }));
}

$("[data-use-password]")?.addEventListener("click", () => showLoginStep("password"));
$("[data-use-email-code]")?.addEventListener("click", () => showLoginStep("email"));
$$("[data-login-back]").forEach((button) => button.addEventListener("click", () => showLoginStep("email")));

$("#loginForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const data = new FormData(form);
  const submit = $(`[data-login-step="${loginState.step}"] [data-login-submit]`);
  const submitLabel = submit?.textContent || "";
  if (submit) { submit.disabled = true; submit.textContent = trText("Please wait..."); }
  try {
    if (loginState.step === "email") {
      const email = String(data.get("email") || "").trim();
      if (!email) throw new Error("Enter your work email.");
      const requested = await api("/api/auth/request-code", { method: "POST", body: JSON.stringify({ email }) });
      loginState.email = email;
      showLoginStep("code");
      const sentTo = $("[data-code-sent-to]");
      if (sentTo) sentTo.textContent = tpl("If {email} has an account, a 6-digit code is on its way. It expires in 10 minutes.", { email });
      // Only present while no mail transport is configured; the server withholds it
      // entirely once smtp or graph is set up.
      const devBox = $("[data-dev-code]");
      if (devBox) {
        devBox.hidden = !requested.devCode;
        if (requested.devCode) {
          devBox.innerHTML = `<strong>${escapeHtml(trText("Mail is not set up yet, so here is your code:"))}</strong><span class="dev-code-value">${escapeHtml(requested.devCode)}</span>`;
          const field = $('[data-login-step="code"] input[name="code"]');
          if (field) field.value = requested.devCode;
        }
      }
      // The response is deliberately identical for unknown addresses, so nothing
      // above distinguishes a typo from an address IT has not registered.
      const noCode = $("[data-no-code-help]");
      if (noCode) noCode.hidden = false;
      return;
    }
    if (loginState.step === "code") {
      const result = await api("/api/auth/verify-code", {
        method: "POST",
        body: JSON.stringify({ email: loginState.email, code: String(data.get("code") || "").trim() })
      });
      if (result.mfaRequired) {
        loginState.userId = result.userId;
        showLoginStep("totp");
        return;
      }
      await enterWorkspace(result);
      return;
    }
    if (loginState.step === "password") {
      const result = await api("/api/login", {
        method: "POST",
        body: JSON.stringify({ email: String(data.get("passwordEmail") || "").trim(), password: String(data.get("password") || "") })
      });
      if (result.mfaRequired) {
        loginState.userId = result.userId;
        showLoginStep("totp");
        return;
      }
      await enterWorkspace(result);
      return;
    }
    if (loginState.step === "totp") {
      const result = await api("/api/auth/verify-totp", {
        method: "POST",
        body: JSON.stringify({ userId: loginState.userId, token: String(data.get("totp") || "").trim() })
      });
      await enterWorkspace(result);
    }
  } catch (error) {
    loginError(error.message);
  } finally {
    if (submit) { submit.disabled = false; submit.textContent = submitLabel; }
  }
});

$("#themeToggle").addEventListener("click", () => {
  const modes = ["light", "dark", "system"];
  const next = modes[(modes.indexOf(state.theme) + 1) % modes.length];
  setAppearanceMode(next);
  if (state.user) saveUserPreferences({ theme: next });
  render();
});

$("#langToggle").addEventListener("click", () => {
  state.lang = state.lang === "en" ? "ar" : "en";
  localStorage.setItem("itcc.lang", state.lang);
  if (state.user) saveUserPreferences({ language: state.lang });
  applyPreferences();
  localizeRenderedUi($("#menuHost"));
  localizeRenderedUi($("#dialogHost"));
  render();
});

systemThemeQuery?.addEventListener("change", () => {
  if (state.theme === "system") applyPreferences();
});

$("[data-header-quick-create]")?.addEventListener("click", (event) => openQuickCreate(event.currentTarget));

$("#globalSearch").addEventListener("input", (event) => {
  state.globalQuery = event.target.value;
  renderGlobalSearchMenu(state.globalQuery);
  render();
});

$("#profileButton").addEventListener("click", (event) => {
  renderFloatingMenu(`<div class="profile-menu"><button class="menu-item" data-account-page="profile">${icon("users")}My Profile</button><button class="menu-item" data-account-page="preferences">${icon("settings")}Preferences</button><button class="menu-item" data-account-page="notification_preferences">${icon("bell")}My Preferences</button><div class="menu-divider"></div><button class="menu-item" data-logout>${icon("close")}Logout</button></div>`, event.currentTarget, { width: 280 });
  $$("[data-account-page]").forEach((button) => button.addEventListener("click", () => {
    state.detail = null;
    state.page = button.dataset.accountPage;
    $("#menuHost").innerHTML = "";
    setHomeRoute();
    render();
  }));
  $("[data-logout]")?.addEventListener("click", async () => {
    try {
      await api("/api/auth/logout", { method: "POST", body: "{}" });
    } catch (_) {
      // The session may already be gone; sign out locally regardless.
    }
    state.user = null;
    state.role = null;
    state.detail = null;
    setHomeRoute();
    $("#menuHost").innerHTML = "";
    $("#app").classList.add("hidden");
    $("#login").classList.remove("hidden");
    showLoginStep("email");
    toast("Logged out", "Your session was ended.");
  });
});

$("#notificationsButton").addEventListener("click", (event) => {
  const items = groupedNotifications();
  renderFloatingMenu(`<div class="notifications-menu"><p class="eyebrow">Notifications</p><div class="notification-menu-list">${items.slice(0, 6).map(notificationCard).join("") || emptyState("No notifications", "You are caught up.")}</div><button class="btn btn-secondary" data-read-notifications style="width:100%;margin-top:8px">Mark all read</button></div>`, event.currentTarget, { width: 360 });
  bindPageActions();
});

document.addEventListener("click", (event) => {
  if (!event.target.closest("[data-modern-select]")) closeModernSelects();
  if (!event.target.closest("#menuHost, #profileButton, #notificationsButton, [data-columns], [data-quick-create], [data-header-quick-create], [data-people-actions], [data-asset-workflow], [data-contract-workflow], [data-vendor-workflow], [data-kb-workflow]")) $("#menuHost").innerHTML = "";
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  if (closeTopOverlay()) event.preventDefault();
});

window.addEventListener("popstate", () => {
  applyRouteFromLocation();
  render();
});

window.addEventListener("scroll", () => {
  maybeLoadMoreOnScroll();
  updateReadingProgress();
}, { passive: true });

loadSession().then(async (signedIn) => {
  if (signedIn) await loadState();
  applyPreferences();
  watchOverlayLocalization();
  document.body.classList.remove("auth-loading");
  $("#authSplash")?.classList.add("hidden");
  if (signedIn) {
    applyRouteFromLocation();
    $("#login").classList.add("hidden");
    $("#app").classList.remove("hidden");
    render();
  } else {
    $("#app").classList.add("hidden");
    $("#login").classList.remove("hidden");
    showLoginStep("email");
  }
}).catch((error) => {
  document.body.classList.remove("auth-loading");
  $("#authSplash")?.classList.add("hidden");
  $("#app").classList.add("hidden");
  $("#login").classList.remove("hidden");
  toast("Could not load workspace", error.message);
});

function renderGlobalSearchMenu(query) {
  const groups = groupedSearch(query);
  if (!query || !groups.length) {
    $("#menuHost").innerHTML = "";
    return;
  }
  renderFloatingMenu(`<div class="search-menu">${groups.map((group) => `<section><p class="eyebrow">${t(group.name)}</p>${group.items.map((item) => `<button class="menu-item" data-search-open="${group.name}" data-id="${item.id}">${icon(group.name)}<span><strong>${escapeHtml(primaryTitle(group.name, item))}</strong><small>${escapeHtml(secondaryTitle(group.name, item))}</small></span></button>`).join("")}</section>`).join("")}</div>`, $("#globalSearch"), { width: Math.min(680, window.innerWidth - 36) });
  $$("[data-search-open]").forEach((button) => button.addEventListener("click", () => {
    const name = button.dataset.searchOpen;
    const row = rows(name).find((item) => item.id === button.dataset.id);
    $("#menuHost").innerHTML = "";
    openDetail(name, row);
  }));
}
