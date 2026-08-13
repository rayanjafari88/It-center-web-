// Load .env before anything reads process.env.
require("./lib/env").loadEnv();

const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const {
  analyseImport: analysePeopleImport,
  applyImport: applyPeopleImport,
  buildExport: buildPeopleExport
} = require("./lib/people-excel");
const auth = require("./lib/auth");
const { sendMail, mailerTransport } = require("./lib/mailer");

const PORT = Number(process.env.PORT || 4173);
// Secure cookies require TLS, which breaks plain-http local testing. Deployments
// terminate TLS in front of this process and set COOKIE_SECURE=true.
const COOKIE_SECURE = String(process.env.COOKIE_SECURE || "") === "true";
const STRICT_TRANSPORT = String(process.env.STRICT_TRANSPORT || "true") === "true";
const ROOT = __dirname;
const PUBLIC = path.join(ROOT, "public");
// Overridable so a test or a second instance can run against its own copy without
// touching live records. Containers also mount this path as a volume.
const DATA_DIR = process.env.DATA_DIR || path.join(ROOT, "data");
const DATA_FILE = path.join(DATA_DIR, "db.json");
// Attachment bytes live on disk, not inside db.json: the database is parsed on
// every request, so inlining uploads made every request pay for every file.
const FILES_DIR = path.join(DATA_DIR, "files");
const BACKUP_DIR = path.join(DATA_DIR, "backups");
const BACKUP_INTERVAL_MS = Number(process.env.BACKUP_INTERVAL_MS || 15 * 60 * 1000);
const BACKUP_KEEP = Number(process.env.BACKUP_KEEP || 48);
const MAX_UPLOAD_BYTES = Number(process.env.MAX_UPLOAD_BYTES || 10 * 1024 * 1024);

const modules = [
  "dashboard",
  "users",
  "roles",
  "employees",
  "assets",
  "transfers",
  "tickets",
  "tasks",
  "contracts",
  "vendors",
  "documents",
  "attachments",
  "comments",
  "notifications",
  "knowledge_base",
  "archive_center",
  "trash",
  "form_templates",
  "employee_portal",
  "audit_logs",
  "timeline",
  "settings",
  "lookup_items"
];

const allPerms = ["view", "create", "edit", "archive", "approve", "export", "admin"];
const operationalModules = ["dashboard", "employees", "assets", "transfers", "tickets", "tasks", "contracts", "vendors", "documents", "attachments", "comments", "notifications", "knowledge_base", "archive_center", "trash", "form_templates", "audit_logs", "timeline", "settings", "lookup_items"];

function id(prefix) {
  return `${prefix}_${crypto.randomBytes(6).toString("hex")}`;
}

function now() {
  return new Date().toISOString();
}

function permissionSet(level) {
  const permissions = {};
  for (const mod of modules) {
    permissions[mod] = Object.fromEntries(allPerms.map((perm) => [perm, false]));
  }
  if (level === "admin") {
    for (const mod of modules) permissions[mod] = Object.fromEntries(allPerms.map((perm) => [perm, true]));
  }
  if (level === "manager") {
    for (const mod of operationalModules) permissions[mod] = Object.fromEntries(allPerms.map((perm) => [perm, true]));
    permissions.users = { view: true, create: true, edit: true, archive: false, approve: false, export: true, admin: false };
    permissions.roles = { view: true, create: false, edit: false, archive: false, approve: false, export: true, admin: false };
    permissions.settings = { view: true, create: false, edit: true, archive: false, approve: false, export: false, admin: false };
  }
  if (level === "staff") {
    for (const mod of ["dashboard", "employees", "assets", "transfers", "tickets", "tasks", "documents", "attachments", "comments", "notifications", "knowledge_base", "form_templates", "timeline"]) {
      permissions[mod].view = true;
      permissions[mod].create = true;
      permissions[mod].edit = true;
    }
    permissions.vendors.view = true;
    permissions.contracts.view = true;
  }
  if (level === "employee") {
    permissions.dashboard.view = true;
    permissions.tickets.view = true;
    permissions.tickets.create = true;
    permissions.tasks.view = true;
    permissions.tasks.create = true;
    permissions.tasks.edit = true;
    permissions.documents.view = true;
    permissions.attachments.view = true;
    permissions.attachments.create = true;
    permissions.comments.view = true;
    permissions.comments.create = true;
    permissions.notifications.view = true;
    permissions.knowledge_base.view = true;
    permissions.employee_portal.view = true;
  }
  return permissions;
}

const legacyTicketCategoryNames = [
  "Access & Accounts / Password reset",
  "Access & Accounts / Email",
  "Access & Accounts / VPN",
  "Access & Accounts / Permissions",
  "Access & Accounts / Account access",
  "Hardware / Laptop",
  "Hardware / Monitor",
  "Hardware / Printer",
  "Hardware / Mobile device",
  "Hardware / Peripherals",
  "Software / Application issue",
  "Software / Software installation",
  "Software / Microsoft 365",
  "Software / License request",
  "Network / Internet",
  "Network / WiFi",
  "Network / VPN",
  "Network / Connectivity issue",
  "New Request / New laptop",
  "New Request / New monitor",
  "New Request / Phone",
  "New Request / Email account",
  "New Request / License",
  "General / Other requests"
];

// Single source of truth for ticket categories. Stored in db.lookupItems as
// parent rows (parentCode === "") plus child rows (parentCode === parent code),
// so admins can add categories from Lookup Management without a code change.
// Both languages live here so nameAr is real data, not the English string repeated.
const defaultTicketCategoryTree = [
  ["Accounts & Access", "الحسابات والصلاحيات", [
    ["Password Reset", "إعادة تعيين كلمة المرور"],
    ["Account Locked", "حساب مقفل"],
    ["MFA Issue", "مشكلة في التحقق بخطوتين"],
    ["Email Access", "الوصول إلى البريد الإلكتروني"],
    ["Shared Folder Access", "الوصول إلى مجلد مشترك"]
  ]],
  ["Hardware & Devices", "الأجهزة والمعدات", [
    ["Laptop", "حاسب محمول"],
    ["Desktop", "حاسب مكتبي"],
    ["Monitor", "شاشة"],
    ["Printer", "طابعة"],
    ["Mobile Device", "جهاز جوال"],
    ["Keyboard / Mouse", "لوحة مفاتيح / فأرة"],
    ["Scanner", "ماسح ضوئي"],
    ["Docking Station", "قاعدة توصيل"],
    ["Headset", "سماعة رأس"],
    ["Other Device", "جهاز آخر"]
  ]],
  ["Software & Applications", "البرمجيات والتطبيقات", [
    ["Outlook", "أوتلوك"],
    ["Teams", "تيمز"],
    ["ERP", "نظام تخطيط الموارد"],
    ["Office", "أوفيس"],
    ["Browser", "متصفح"],
    ["PDF Software", "برنامج PDF"],
    ["Other Application", "تطبيق آخر"]
  ]],
  ["Network & Connectivity", "الشبكة والاتصال", [
    ["Internet", "الإنترنت"],
    ["WiFi", "الشبكة اللاسلكية"],
    ["VPN", "الشبكة الافتراضية الخاصة"],
    ["Shared Folder", "مجلد مشترك"],
    ["Network Drive", "قرص شبكي"],
    ["Other Network Issue", "مشكلة شبكة أخرى"]
  ]],
  ["Service Requests", "طلبات الخدمة", [
    ["New Laptop", "حاسب محمول جديد"],
    ["New Software", "برنامج جديد"],
    ["Software Installation", "تثبيت برنامج"],
    ["Access Request", "طلب صلاحية"],
    ["License Request", "طلب ترخيص"],
    ["Equipment Request", "طلب أجهزة"],
    ["Other Request", "طلب آخر"]
  ]],
  ["General Questions", "أسئلة عامة", [
    ["Other", "أخرى"]
  ]]
];

function lookupCode(value) {
  return String(value || "").toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
}

function defaultTicketCategoryLookups() {
  const palette = ["#2563eb", "#64748b", "#f59e0b", "#ef4444", "#10b981"];
  const items = [];
  let sortOrder = 0;
  for (const [parentEn, parentAr, children] of defaultTicketCategoryTree) {
    const parentCode = lookupCode(parentEn);
    sortOrder += 1;
    items.push({
      id: `lookup_ticket_category_${parentCode}`, type: "ticket_category", module: "ticket",
      nameEn: parentEn, nameAr: parentAr, code: parentCode, parentCode: "",
      color: palette[sortOrder % palette.length], icon: "", sortOrder, active: true
    });
    for (const [childEn, childAr] of children) {
      const code = `${parentCode}_${lookupCode(childEn)}`;
      sortOrder += 1;
      items.push({
        id: `lookup_ticket_category_${code}`, type: "ticket_category", module: "ticket",
        nameEn: childEn, nameAr: childAr, code, parentCode,
        color: palette[sortOrder % palette.length], icon: "", sortOrder, active: true
      });
    }
  }
  return items;
}

function defaultLookupItems() {
  const groups = {
    ticket_priority: ["low", "medium", "high", "critical"],
    ticket_status: ["open", "in_progress", "waiting", "resolved", "closed", "cancelled"],
    ticket_waiting_reason: ["User", "Vendor", "Approval", "Parts", "External Company", "Other"],
    ticket_cancel_reason: ["Requester", "IT", "Duplicate", "Created by mistake", "No longer needed", "Other"],
    user_status: ["active", "disabled", "locked", "inactive"],
    employee_status: ["active", "inactive", "on_leave"],
    asset_category: ["Laptop", "Desktop", "Monitor", "Phone", "Printer", "Network", "Software"],
    asset_status: ["in_inventory", "assigned", "returned", "under_maintenance", "retired", "lost", "damaged"],
    asset_condition: ["new", "good", "fair", "damaged", "lost"],
    job_title: ["Accountant", "Operations Lead", "HR Specialist", "IT Support Specialist", "IT Manager"],
    contract_type: ["Subscription", "Support", "Maintenance", "License", "Service"],
    contract_status: ["active", "renewal_due", "expired", "archived"],
    vendor_service_type: ["Hardware", "Warranty", "Licensing", "Cloud", "Network", "Consulting"],
    vendor_status: ["active", "inactive", "preferred", "under_review"],
    task_status: ["open", "in_progress", "overdue", "done"],
    task_priority: ["low", "medium", "high", "critical"],
    my_task_status: ["Pending", "In Progress", "Completed", "Cancelled"],
    my_task_priority: ["Low", "Medium", "High"],
    my_task_category: ["Work", "Personal", "Learning", "Finance", "Health", "Other"],
    my_task_recurrence: ["One time", "Daily", "Weekly", "Monthly", "Yearly"],
    document_type: ["draft", "uploaded", "signed", "archived"],
    form_type: ["Asset assignment", "Asset return", "Device usage agreement", "VPN request", "Email request", "Access request"],
    approval_status: ["Draft", "Pending approval", "Approved", "Rejected", "Completed"],
    location: ["Head Office", "Branch Riyadh", "Branch Jeddah", "Remote"],
    cost_center: ["IT", "Finance", "HR", "Operations"],
    request_type: ["Incident", "Service request", "Access request", "Question"],
    brand: ["Dell", "HP", "Lenovo", "Apple", "Microsoft", "Cisco"],
    asset_model: ["Latitude 7440", "P2424H", "iPhone 15", "ThinkPad T14", "Surface Pro"],
    renewal_reminder_period: ["30 days before", "60 days before", "90 days before"],
    kb_category: ["Windows", "Outlook", "Microsoft 365", "VPN", "Printer", "ERP", "Network"],
    kb_status: ["Draft", "Published"],
    vendor_rating: ["1", "2", "3", "4", "5"],
    linked_type: ["employee", "asset", "ticket", "task", "contract", "vendor", "document"],
    transfer_action: ["Assign", "Return", "Reassign", "Maintenance", "Lost", "Damaged", "Retire"]
  };
  return [
    ...defaultTicketCategoryLookups(),
    ...Object.entries(groups).flatMap(([type, values]) => values.map((name, index) => ({
      id: `lookup_${type}_${String(index + 1).padStart(2, "0")}`,
      type,
      module: type.split("_")[0],
      nameEn: name,
      nameAr: name,
      code: lookupCode(name),
      parentCode: "",
      color: ["#2563eb", "#64748b", "#f59e0b", "#ef4444", "#10b981"][index % 5],
      icon: "",
      sortOrder: index + 1,
      active: true
    })))
  ];
}

function seed() {
  const roles = [
    { id: "role_admin", name: "System Admin", description: "Full system control", isSystem: true, permissions: permissionSet("admin") },
    { id: "role_manager", name: "IT Manager", description: "Owns IT operations", isSystem: true, permissions: permissionSet("manager") },
    { id: "role_staff", name: "IT Staff", description: "Handles tickets, tasks, and asset operations", isSystem: true, permissions: permissionSet("staff") },
    { id: "role_employee", name: "Employee", description: "Self-service employee access", isSystem: true, permissions: permissionSet("employee") }
  ];
  const users = [
    { id: "user_admin", name: "System Admin", username: "admin", email: "admin@itcc.local", password: "admin123", roleId: "role_admin", status: "active", accountType: "Employee", language: "en" },
    { id: "user_manager", name: "Amina IT Manager", username: "manager", email: "manager@itcc.local", password: "manager123", roleId: "role_manager", status: "active", accountType: "Employee", language: "en" },
    { id: "user_staff", name: "Omar IT Staff", username: "staff", email: "staff@itcc.local", password: "staff123", roleId: "role_staff", status: "active", accountType: "Employee", language: "en" },
    { id: "user_employee", name: "Lina Employee", username: "employee", email: "employee@itcc.local", password: "admin123", roleId: "role_employee", status: "active", accountType: "Employee", language: "en", employeeId: "emp_lina" }
  ];
  const departments = [
    { id: "dep_finance", name: "Finance" },
    { id: "dep_hr", name: "Human Resources" },
    { id: "dep_it", name: "Information Technology" },
    { id: "dep_ops", name: "Operations" }
  ];
  const employees = [
    { id: "emp_lina", employeeNo: "EMP-001", name: "Lina Hassan", personType: "Employee", departmentId: "dep_finance", jobTitle: "Accountant", email: "lina@example.com", phone: "+966 55 100 2000", status: "active" },
    { id: "emp_fahad", employeeNo: "EMP-002", name: "Fahad Saleh", personType: "Employee", departmentId: "dep_ops", jobTitle: "Operations Lead", email: "fahad@example.com", phone: "+966 55 200 3000", status: "active" },
    { id: "emp_sara", employeeNo: "EMP-003", name: "Sara Nasser", personType: "Employee", departmentId: "dep_hr", jobTitle: "HR Specialist", email: "sara@example.com", phone: "+966 55 300 4000", status: "active" }
  ];
  const vendors = [
    { id: "vendor_dell", name: "Dell Partner", contactPerson: "Noura Ali", phone: "+966 11 456 0000", email: "support@dellpartner.local", services: "Laptops, warranty, support", notes: "Preferred hardware vendor", rating: 5, contracts: ["contract_dell"] },
    { id: "vendor_ms", name: "Microsoft CSP", contactPerson: "Khalid Omar", phone: "+966 11 789 0000", email: "csp@microsoft.local", services: "Microsoft 365 licensing", notes: "Annual subscription renewal", rating: 4, contracts: ["contract_m365"] }
  ];
  const assets = [
    { id: "asset_001", assetNumber: "AST-0001", type: "Laptop", brand: "Dell", model: "Latitude 7440", serialNumber: "DL7440-001", status: "assigned", currentOwnerId: "emp_lina", departmentId: "dep_finance", purchaseDate: "2025-02-12", warrantyEndDate: "2028-02-12", supplierId: "vendor_dell", cost: 5200, condition: "good", attachments: ["invoice-ast-0001.pdf"] },
    { id: "asset_002", assetNumber: "AST-0002", type: "Monitor", brand: "Dell", model: "P2424H", serialNumber: "MON2424-220", status: "in_inventory", currentOwnerId: "", departmentId: "dep_it", purchaseDate: "2025-08-05", warrantyEndDate: "2028-08-05", supplierId: "vendor_dell", cost: 850, condition: "new", attachments: [] },
    { id: "asset_003", assetNumber: "AST-0003", type: "Phone", brand: "Apple", model: "iPhone 15", serialNumber: "IP15-515", status: "under_maintenance", currentOwnerId: "emp_fahad", departmentId: "dep_ops", purchaseDate: "2024-11-20", warrantyEndDate: "2026-11-20", supplierId: "vendor_dell", cost: 3700, condition: "damaged", attachments: ["damage-photo.jpg"] }
  ];
  const transfers = [
    { id: "tr_001", assetId: "asset_001", movementType: "Purchased", from: "Dell Partner", to: "IT Inventory", date: "2025-02-12", performedBy: "user_manager", condition: "new", notes: "Purchased with 3-year warranty", attachments: ["invoice-ast-0001.pdf"], relatedDocumentId: "doc_assign_lina" },
    { id: "tr_002", assetId: "asset_001", movementType: "Assigned", from: "IT Inventory", to: "Lina Hassan", date: "2025-02-14", performedBy: "user_staff", condition: "good", notes: "Assigned for finance work", attachments: ["signed-assignment.pdf"], relatedDocumentId: "doc_assign_lina" },
    { id: "tr_003", assetId: "asset_003", movementType: "Under maintenance", from: "Fahad Saleh", to: "IT Workshop", date: "2026-06-01", performedBy: "user_staff", condition: "damaged", notes: "Screen damage reported", attachments: ["damage-photo.jpg"], relatedDocumentId: "doc_damage_phone" }
  ];
  const tickets = [
    { id: "ticket_001", ticketNumber: "TCK-1001", requesterId: "emp_lina", assignedToId: "user_staff", category: "Hardware", priority: "high", status: "open", description: "Laptop battery drains quickly.", attachments: [], comments: [{ by: "user_staff", body: "Battery report requested.", at: now() }], internalNotes: "Check warranty eligibility.", history: ["Created", "Assigned to Omar IT Staff"] },
    { id: "ticket_002", ticketNumber: "TCK-1002", requesterId: "emp_sara", assignedToId: "user_manager", category: "Access", priority: "medium", status: "waiting", waitingReason: "Approval", description: "VPN access needed for remote work.", attachments: ["vpn-request.pdf"], comments: [], internalNotes: "Manager approval needed.", history: ["Created"] }
  ];
  const tasks = [
    { id: "task_001", title: "Review Microsoft 365 renewal", description: "Confirm active licenses and renewal price.", ownerId: "user_manager", dueDate: "2026-06-20", status: "open", priority: "high", relatedType: "contract", relatedId: "contract_m365" },
    { id: "task_002", title: "Inspect damaged phone", description: "Prepare maintenance report for AST-0003.", ownerId: "user_staff", dueDate: "2026-06-10", status: "overdue", priority: "medium", relatedType: "asset", relatedId: "asset_003" }
  ];
  const contracts = [
    { id: "contract_dell", name: "Dell Warranty Support", type: "Support", vendorId: "vendor_dell", startDate: "2025-02-12", endDate: "2028-02-12", cost: 12000, renewalReminderDate: "2028-01-12", status: "active", attachments: ["dell-support.pdf"], notes: "Covers laptop fleet." },
    { id: "contract_m365", name: "Microsoft 365 Business Premium", type: "Subscription", vendorId: "vendor_ms", startDate: "2025-07-01", endDate: "2026-07-01", cost: 32000, renewalReminderDate: "2026-06-20", status: "renewal_due", attachments: ["m365-contract.pdf"], notes: "Annual license renewal." }
  ];
  const documents = [
    { id: "doc_assign_lina", title: "Asset assignment form - Lina Hassan", templateType: "Asset assignment form", approvalStatus: "Approved", status: "signed", signedFileName: "signed-assignment.pdf", linkedType: "asset", linkedId: "asset_001", notes: "Signed at handover." },
    { id: "doc_damage_phone", title: "Lost or damaged asset declaration - AST-0003", templateType: "Lost or damaged asset declaration", approvalStatus: "Pending approval", status: "uploaded", signedFileName: "damage-declaration.pdf", linkedType: "asset", linkedId: "asset_003", notes: "Awaiting repair quote." },
    { id: "doc_employee_handbook", title: "Employee handbook", description: "General company handbook for employees.", category: "Company policy", publishDate: "2026-01-15", templateType: "Company document", approvalStatus: "Approved", status: "published", fileName: "employee-handbook.pdf", linkedType: "company", linkedId: "company", notes: "Read-only employee document." },
    { id: "doc_it_policy", title: "IT policies", description: "Acceptable use, device care, and access policies.", category: "IT policy", publishDate: "2026-02-01", templateType: "Company document", approvalStatus: "Approved", status: "published", fileName: "it-policies.docx", linkedType: "company", linkedId: "company", notes: "Read-only employee document." },
    { id: "doc_vpn_guide", title: "VPN guide", description: "How to connect to VPN and request help.", category: "IT guide", publishDate: "2026-03-01", templateType: "Company document", approvalStatus: "Approved", status: "published", fileName: "vpn-guide.pdf", linkedType: "company", linkedId: "company", notes: "Read-only employee document." }
  ];
  const attachments = [
    { id: "att_001", entityType: "asset", entityId: "asset_001", filename: "invoice-ast-0001.pdf", mimeType: "application/pdf", size: 184320, uploaderId: "user_manager", uploadedAt: "2025-02-12T09:10:00.000Z", content: "Demo PDF attachment metadata" },
    { id: "att_002", entityType: "ticket", entityId: "ticket_002", filename: "vpn-request.pdf", mimeType: "application/pdf", size: 93210, uploaderId: "user_employee", uploadedAt: "2026-06-09T10:20:00.000Z", content: "Demo VPN request attachment metadata" },
    { id: "att_003", entityType: "document", entityId: "doc_assign_lina", filename: "signed-assignment.pdf", mimeType: "application/pdf", size: 144800, uploaderId: "user_staff", uploadedAt: "2025-02-14T12:00:00.000Z", content: "Signed assignment form demo content" },
    { id: "att_handbook", entityType: "document", entityId: "doc_employee_handbook", filename: "employee-handbook.pdf", mimeType: "application/pdf", size: 220000, uploaderId: "user_manager", uploadedAt: "2026-01-15T09:00:00.000Z", content: "Employee handbook demo file" },
    { id: "att_it_policy", entityType: "document", entityId: "doc_it_policy", filename: "it-policies.docx", mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document", size: 98000, uploaderId: "user_manager", uploadedAt: "2026-02-01T09:00:00.000Z", content: "IT policy demo file" },
    { id: "att_vpn_guide", entityType: "document", entityId: "doc_vpn_guide", filename: "vpn-guide.pdf", mimeType: "application/pdf", size: 128000, uploaderId: "user_manager", uploadedAt: "2026-03-01T09:00:00.000Z", content: "VPN guide demo file" }
  ];
  const comments = [
    { id: "com_001", entityType: "ticket", entityId: "ticket_001", parentId: "", authorId: "user_staff", body: "Battery report requested from @Lina Employee.", mentions: ["user_employee"], createdAt: "2026-06-09T08:30:00.000Z", updatedAt: "2026-06-09T08:30:00.000Z" },
    { id: "com_002", entityType: "ticket", entityId: "ticket_001", parentId: "com_001", authorId: "user_employee", body: "Uploaded the battery screenshot.", mentions: ["user_staff"], createdAt: "2026-06-09T09:00:00.000Z", updatedAt: "2026-06-09T09:00:00.000Z" }
  ];
  const notifications = [
    { id: "not_001", userId: "user_staff", type: "warning", title: "Ticket assigned", body: "TCK-1001 is assigned to you.", entityType: "ticket", entityId: "ticket_001", unread: true, createdAt: "2026-06-09T08:10:00.000Z" },
    { id: "not_002", userId: "user_manager", type: "critical", title: "Overdue task", body: "Inspect damaged phone is overdue.", entityType: "task", entityId: "task_002", unread: true, createdAt: "2026-06-14T07:00:00.000Z" },
    { id: "not_003", userId: "user_manager", type: "warning", title: "Contract renewal", body: "Microsoft 365 renewal reminder is due soon.", entityType: "contract", entityId: "contract_m365", unread: true, createdAt: "2026-06-12T11:00:00.000Z" }
  ];
  const knowledgeBase = [
    { id: "kb_001", category: "VPN", title: "How to request VPN access", body: "Submit a VPN request form, include manager approval, and wait for IT activation.", tags: ["vpn", "remote-work"], published: true, attachments: ["vpn-request.pdf"], images: [] },
    { id: "kb_002", category: "Outlook", title: "Fix Outlook profile sync", body: "Restart Outlook, clear cached credentials, then reconnect Microsoft 365.", tags: ["outlook", "microsoft-365"], published: true, attachments: [], images: [] },
    { id: "kb_003", category: "Printer", title: "Printer troubleshooting checklist", body: "Check network, paper, toner, and queue status before opening a ticket.", tags: ["printer", "network"], published: true, attachments: [], images: [] }
  ];
  const announcements = [
    { id: "ann_001", title: "Planned Microsoft 365 renewal review", body: "IT is reviewing license usage before renewal.", audience: "all", publishedAt: "2026-06-12T08:00:00.000Z" }
  ];
  const formTemplates = [
    { id: "tpl_asset_assignment", name: "Asset assignment", approvalStatus: "Approved", fields: ["employee", "asset", "condition", "signature"] },
    { id: "tpl_asset_return", name: "Asset return", approvalStatus: "Approved", fields: ["employee", "asset", "return condition", "signature"] },
    { id: "tpl_device_usage", name: "Device usage agreement", approvalStatus: "Approved", fields: ["employee", "policy acknowledgement", "signature"] },
    { id: "tpl_vpn_request", name: "VPN request", approvalStatus: "Approved", fields: ["employee", "manager approval", "business reason"] },
    { id: "tpl_email_request", name: "Email request", approvalStatus: "Approved", fields: ["employee", "mailbox type", "approval"] },
    { id: "tpl_access_request", name: "Access request", approvalStatus: "Approved", fields: ["employee", "system", "role", "approval"] }
  ];
  const timeline = [
    { id: "tl_001", title: "Ticket TCK-1001 opened", description: "Laptop battery issue reported by Lina Hassan.", entityType: "tickets", entityId: "ticket_001", severity: "warning", actorUserId: "user_employee", createdAt: "2026-06-09T08:00:00.000Z" },
    { id: "tl_002", title: "Asset AST-0003 moved to maintenance", description: "Phone marked under maintenance.", entityType: "transfers", entityId: "tr_003", severity: "danger", actorUserId: "user_staff", createdAt: "2026-06-01T09:00:00.000Z" },
    { id: "tl_003", title: "M365 renewal reminder approaching", description: "Renewal reminder date is 2026-06-20.", entityType: "contracts", entityId: "contract_m365", severity: "warning", actorUserId: "user_manager", createdAt: "2026-06-12T11:00:00.000Z" }
  ];
  return {
    meta: { app: "IT Command Center", version: "1.0.0", createdAt: now() },
    roles,
    users,
    departments,
    employees,
    assets,
    transfers,
    tickets,
    tasks,
    contracts,
    vendors,
    documents,
    attachments,
    comments,
    notifications,
    knowledgeBase,
    announcements,
    formTemplates,
    lookupItems: defaultLookupItems(),
    auditLogs: [
      { id: "audit_001", userId: "user_manager", action: "seed", entityType: "system", entityId: "v1", oldValue: null, newValue: { version: "V1" }, ipAddress: "127.0.0.1", createdAt: now() }
    ],
    timeline
  };
}

function ensureData() {
  if (!fs.existsSync(DATA_FILE)) {
    fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
    writeDb(seed());
  }
  fs.mkdirSync(FILES_DIR, { recursive: true });
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

// Keeps a rolling window of snapshots. The database is a single file, so a bad
// write or a corrupted disk would otherwise take the whole company's history.
function backupDb() {
  try {
    if (!fs.existsSync(DATA_FILE)) return;
    const snapshots = () => fs.readdirSync(BACKUP_DIR).filter((name) => name.startsWith("db-")).sort();
    const newest = snapshots().pop();
    const due = !newest || Date.now() - fs.statSync(path.join(BACKUP_DIR, newest)).mtimeMs >= BACKUP_INTERVAL_MS;
    if (due) {
      const stamp = new Date().toISOString().replace(/[:.]/g, "-");
      fs.copyFileSync(DATA_FILE, path.join(BACKUP_DIR, `db-${stamp}.json`));
    }
    // Prune on every write, not only when a snapshot was taken, so the directory
    // cannot grow unbounded after a restart or a clock change.
    const keep = snapshots();
    for (const name of keep.slice(0, Math.max(0, keep.length - BACKUP_KEEP))) {
      fs.unlinkSync(path.join(BACKUP_DIR, name));
    }
  } catch (error) {
    console.error("[backup] failed:", error.message);
  }
}

function readDb() {
  ensureData();
  const db = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
  return migrateDb(db);
}

// Attachment ids are generated server-side, but the filename is still built
// defensively so a crafted id can never escape the files directory.
function attachmentPath(name) {
  const safe = path.basename(String(name || ""));
  const full = path.join(FILES_DIR, safe);
  if (!full.startsWith(FILES_DIR)) throw new Error("Invalid attachment path");
  return full;
}

// Maps an attachment's entityType onto the collection that should hold its parent.
function attachmentParentExists(db, entityType, entityId) {
  if (!entityId) return false;
  const collection = {
    ticket: "tickets", tickets: "tickets",
    task: "tasks", tasks: "tasks",
    asset: "assets", assets: "assets",
    employee: "employees", employees: "employees",
    document: "documents", documents: "documents",
    contract: "contracts", contracts: "contracts",
    vendor: "vendors", vendors: "vendors",
    knowledge_base: "knowledgeBase", knowledgeBase: "knowledgeBase"
  }[String(entityType || "")];
  // Unknown types are left alone rather than blocked, so this cannot break a
  // caller that attaches to something this map does not know about yet.
  if (!collection) return true;
  return (db[collection] || []).some((row) => row.id === entityId);
}

function writeAttachmentFile(attachmentId, content) {
  fs.mkdirSync(FILES_DIR, { recursive: true });
  const name = `${attachmentId}.bin`;
  const buffer = Buffer.from(String(content), "base64");
  // Not valid base64? Store the raw text rather than silently losing it.
  const payload = buffer.toString("base64").replace(/=+$/, "") === String(content).replace(/=+$/, "")
    ? buffer
    : Buffer.from(String(content), "utf8");
  fs.writeFileSync(attachmentPath(name), payload);
  return { name, bytes: payload.length };
}

function readAttachmentFile(row) {
  if (!row?.storagePath) return null;
  const full = attachmentPath(row.storagePath);
  if (!fs.existsSync(full)) return null;
  return fs.readFileSync(full);
}

function deleteAttachmentFile(row) {
  try {
    if (!row?.storagePath) return;
    const full = attachmentPath(row.storagePath);
    if (fs.existsSync(full)) fs.unlinkSync(full);
  } catch (error) {
    console.error("[attachments] cleanup failed:", error.message);
  }
}

// Write to a temporary file and rename over the target. Rename is atomic on the
// same filesystem, so a crash mid-write can no longer truncate the database.
function writeDb(db) {
  const tmp = `${DATA_FILE}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(db, null, 2));
  fs.renameSync(tmp, DATA_FILE);
  backupDb();
}

function migrateDb(db) {
  const fresh = seed();
  for (const key of ["attachments", "comments", "notifications", "knowledgeBase", "announcements", "formTemplates", "lookupItems", "assignmentGroups"]) {
    if (!Array.isArray(db[key])) db[key] = Array.isArray(fresh[key]) ? fresh[key] : [];
  }
  const lookupKeys = new Set((db.lookupItems || []).map((item) => `${item.type}:${item.code || item.nameEn}`));
  for (const item of fresh.lookupItems) {
    if (!lookupKeys.has(`${item.type}:${item.code}`) && !lookupKeys.has(`${item.type}:${item.nameEn}`)) db.lookupItems.push(item);
  }
  for (const doc of fresh.documents.filter((item) => item.linkedType === "company")) {
    if (!(db.documents || []).some((item) => item.id === doc.id)) db.documents.push(doc);
  }
  for (const attachment of fresh.attachments.filter((item) => String(item.id).startsWith("att_") && ["doc_employee_handbook", "doc_it_policy", "doc_vpn_guide"].includes(item.entityId))) {
    if (!(db.attachments || []).some((item) => item.id === attachment.id)) db.attachments.push(attachment);
  }
  for (const role of db.roles || []) {
    const fallback = role.id === "role_admin" ? permissionSet("admin") : role.id === "role_manager" ? permissionSet("manager") : role.id === "role_staff" ? permissionSet("staff") : permissionSet("employee");
    role.permissions = role.permissions || fallback;
    for (const mod of modules) {
      if (!role.permissions[mod]) role.permissions[mod] = fallback[mod] || Object.fromEntries(allPerms.map((perm) => [perm, false]));
      for (const perm of allPerms) {
        if (role.permissions[mod][perm] === undefined) role.permissions[mod][perm] = Boolean(fallback[mod]?.[perm]);
      }
    }
    if (role.id === "role_employee") {
      role.permissions.tasks.view = true;
      role.permissions.tasks.create = true;
      role.permissions.tasks.edit = true;
      role.permissions.attachments.view = true;
      role.permissions.attachments.create = true;
      role.permissions.timeline.view = false;
      role.permissions.audit_logs.view = false;
      role.permissions.notifications.view = true;
    }
    if (role.id === "role_manager") {
      role.permissions.lookup_items.view = true;
      role.permissions.lookup_items.create = true;
      role.permissions.lookup_items.edit = true;
      role.permissions.lookup_items.archive = true;
      role.permissions.lookup_items.export = true;
    }
  }
  // Attachments used to inline their bytes in this file. Move any that remain onto
  // disk so the database stops carrying them.
  for (const attachment of db.attachments || []) {
    if (attachment.content === undefined) continue;
    try {
      if (String(attachment.content || "")) {
        const stored = writeAttachmentFile(attachment.id, attachment.content);
        attachment.storagePath = stored.name;
        attachment.size = stored.bytes;
      }
      delete attachment.content;
    } catch (error) {
      console.error("[attachments] migration failed for", attachment.id, error.message);
    }
  }
  // Auth storage introduced with sessions.
  for (const key of ["sessions", "loginCodes", "authAttempts"]) {
    if (!Array.isArray(db[key])) db[key] = [];
  }
  db.sessions = db.sessions.filter((item) => item.expiresAt > now());
  db.loginCodes = db.loginCodes.filter((item) => item.expiresAt > now());
  for (const user of db.users || []) {
    // Passwords were stored in plain text. Hash them in place on first boot; the
    // original value is never written back.
    if (user.password && !auth.isHashedPassword(user.password)) {
      user.password = auth.hashPassword(user.password);
      user.passwordHashedAt = now();
    }
    user.username = user.username || String(user.email || user.name || user.id).split("@")[0].toLowerCase().replace(/[^a-z0-9._-]+/g, ".");
    user.accountType = user.accountType || (user.expiryDate ? "Temporary" : "Employee");
    if (user.status === "inactive") user.status = "disabled";
    if (!user.employeeId) {
      const employee = (db.employees || []).find((row) => row.email && user.email && row.email.toLowerCase() === user.email.toLowerCase())
        || (user.id === "user_employee" ? (db.employees || []).find((row) => row.id === "emp_lina") : null);
      if (employee) user.employeeId = employee.id;
    }
    user.notificationPreferences = notificationPreferences(user);
  }
  for (const employee of db.employees || []) {
    employee.personType = employee.personType || "Employee";
  }
  disableExpiredAccounts(db);
  const legacyRoleNotifications = (db.notifications || []).filter((notification) => !notification.userId && (notification.roleId || notification.recipientRoleId || notification.roleIds));
  if (legacyRoleNotifications.length) {
    db.notifications = (db.notifications || []).filter((notification) => !legacyRoleNotifications.includes(notification));
    for (const notification of legacyRoleNotifications) {
      const roleIds = Array.isArray(notification.roleIds) ? notification.roleIds : [notification.roleId, notification.recipientRoleId].filter(Boolean);
      createNotification(db, { userIds: db.users.filter((user) => roleIds.includes(user.roleId)).map((user) => user.id), category: notificationCategory(notification), type: notification.type, title: notification.title, body: notification.body, entityType: notification.entityType, entityId: notification.entityId });
    }
  }
  for (const notification of db.notifications || []) {
    notification.category = notificationCategory(notification);
  }
  db.notifications = (db.notifications || []).filter((notification) => retainNotificationForRole(db, notification));
  for (const doc of db.documents || []) {
    if (!doc.approvalStatus) doc.approvalStatus = doc.status === "signed" ? "Approved" : "Draft";
  }
  for (const task of db.tasks || []) {
    if (!task.approvalStatus) task.approvalStatus = task.status === "done" ? "Completed" : "Draft";
  }
  for (const ticket of db.tickets || []) {
    if (ticket.status === "waiting_approval") ticket.status = "waiting";
    if (!ticket.approvalStatus) ticket.approvalStatus = ticket.status === "waiting" ? "Pending approval" : "Draft";
  }
  for (const item of db.lookupItems || []) {
    if (item.type === "ticket_status" && item.code === "waiting_approval") item.active = false;
  }
  const oldTicketCategories = new Set(["hardware", "software", "access", "network", "security", "other"]);
  for (const item of db.lookupItems || []) {
    if (item.type === "ticket_category" && oldTicketCategories.has(String(item.code || item.nameEn || "").toLowerCase())) item.active = false;
  }
  // Ticket category taxonomy migration: retire the flat pre-tree vocabulary and
  // make every remaining ticket_category row explicit about its parent.
  const retiredCategoryCodes = new Set(legacyTicketCategoryNames.map((name) => lookupCode(name)));
  for (const item of db.lookupItems || []) {
    if (item.type !== "ticket_category") continue;
    if (retiredCategoryCodes.has(String(item.code || "").toLowerCase())) item.active = false;
    if (item.parentCode === undefined) item.parentCode = "";
  }
  // Earlier builds of the category tree copied nameEn into nameAr. Fill in the real
  // Arabic where the admin has not typed their own translation.
  const defaultCategoryAr = new Map(defaultTicketCategoryLookups().map((item) => [item.code, item.nameAr]));
  for (const item of db.lookupItems || []) {
    if (item.type !== "ticket_category") continue;
    const arabic = defaultCategoryAr.get(item.code);
    if (arabic && (!item.nameAr || item.nameAr === item.nameEn)) item.nameAr = arabic;
  }
  for (const ticket of db.tickets || []) {
    if (ticket.mainCategoryCode) continue;
    const resolved = resolveTicketCategory(db, ticket);
    if (resolved) Object.assign(ticket, resolved);
  }
  for (const ticket of db.tickets || []) {
    if (ticket.onBehalf === undefined) ticket.onBehalf = false;
    if (ticket.createdById === undefined) ticket.createdById = "";
  }
  return db;
}

function send(res, status, data, headers = {}) {
  res.writeHead(status, { "Content-Type": "application/json", ...headers });
  res.end(JSON.stringify(data));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 12_000_000) req.destroy();
    });
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (error) {
        reject(error);
      }
    });
  });
}

// Identity comes from a server-side session only. The client cannot assert who it
// is: there is deliberately no header or query parameter that names a user.
function currentUser(db, req) {
  return sessionUser(db, req);
}

function sessions(db) {
  if (!Array.isArray(db.sessions)) db.sessions = [];
  return db.sessions;
}

function pruneSessions(db) {
  const before = sessions(db).length;
  db.sessions = sessions(db).filter((item) => item.expiresAt > now());
  return db.sessions.length !== before;
}

function sessionUser(db, req) {
  const token = auth.parseCookies(req.headers.cookie)[auth.SESSION_COOKIE];
  if (!token) return null;
  const tokenHash = auth.hashToken(token);
  const session = sessions(db).find((item) => item.tokenHash === tokenHash);
  if (!session || session.expiresAt <= now()) return null;
  const user = db.users.find((item) => item.id === session.userId);
  if (!user || user.archivedAt) return null;
  // A disabled or expired account must lose access immediately, not at session end.
  if (["disabled", "locked", "inactive"].includes(String(user.status || "").toLowerCase())) return null;
  return user;
}

function createSession(db, user, req) {
  const token = auth.randomToken();
  const ttl = auth.SESSION_TTL_MS[user.roleId] || auth.SESSION_TTL_MS.default;
  sessions(db).unshift({
    id: id("sess"),
    userId: user.id,
    tokenHash: auth.hashToken(token),
    createdAt: now(),
    expiresAt: new Date(Date.now() + ttl).toISOString(),
    ip: req.socket.remoteAddress,
    userAgent: String(req.headers["user-agent"] || "").slice(0, 200)
  });
  return { token, maxAge: ttl };
}

function destroySession(db, req) {
  const token = auth.parseCookies(req.headers.cookie)[auth.SESSION_COOKIE];
  if (!token) return false;
  const tokenHash = auth.hashToken(token);
  const before = sessions(db).length;
  db.sessions = sessions(db).filter((item) => item.tokenHash !== tokenHash);
  return db.sessions.length !== before;
}

// Signing in elsewhere should not silently keep old sessions alive for a
// compromised account, so callers can drop every session a user holds.
function destroyUserSessions(db, userId) {
  db.sessions = sessions(db).filter((item) => item.userId !== userId);
}

// --- sign-in ---------------------------------------------------------------

function loginCodes(db) {
  if (!Array.isArray(db.loginCodes)) db.loginCodes = [];
  return db.loginCodes;
}

// Accepts an email, a username, or an employee number. Staff know their employee
// number, and many of them share a personal mailbox they do not check at work.
function accountForIdentifier(db, identifier) {
  const wanted = String(identifier || "").toLowerCase().trim();
  if (!wanted) return null;
  const direct = db.users.find((item) =>
    [item.email, item.username].filter(Boolean).some((value) => String(value).toLowerCase() === wanted)
    && !item.archivedAt
  );
  if (direct) return direct;
  const employee = (db.employees || []).find((item) =>
    String(item.employeeNo || "").toLowerCase().trim() === wanted
    && !item.archivedAt && !item.deletedAt
  );
  if (!employee) return null;
  return db.users.find((item) => item.employeeId === employee.id && !item.archivedAt) || null;
}

// Resolves an employee record from the same set of identifiers, so a first-time
// sign-in by employee number can still provision an account.
function employeeForIdentifier(db, identifier) {
  const wanted = String(identifier || "").toLowerCase().trim();
  if (!wanted) return null;
  return (db.employees || []).find((item) =>
    (String(item.employeeNo || "").toLowerCase().trim() === wanted
      || String(item.email || "").toLowerCase().trim() === wanted)
    && String(item.status || "active").toLowerCase() === "active"
    && !item.archivedAt && !item.deletedAt
  ) || null;
}

// An employee with a mailbox but no login yet gets an account on first sign-in,
// so the company does not have to provision hundreds of accounts up front.
function autoProvisionFromEmployee(db, email) {
  const wanted = String(email || "").toLowerCase().trim();
  const employee = (db.employees || []).find((item) =>
    String(item.email || "").toLowerCase() === wanted
    && String(item.status || "active").toLowerCase() === "active"
    && !item.archivedAt && !item.deletedAt
  );
  if (!employee) return null;
  if (db.users.some((item) => String(item.email || "").toLowerCase() === wanted)) return null;
  const user = {
    id: id("user"),
    name: employee.name || employee.email,
    username: wanted.split("@")[0],
    email: employee.email,
    roleId: "role_employee",
    status: "active",
    accountType: "Employee",
    employeeId: employee.id,
    createdAt: now(),
    notificationPreferences: notificationPreferences({ roleId: "role_employee" })
  };
  db.users.unshift(user);
  employee.userId = user.id;
  return user;
}

function accountBlockedReason(user) {
  if (isAccountExpired(user)) return "Account expired";
  if (["disabled", "locked", "inactive"].includes(String(user.status || "").toLowerCase())) return "Account disabled";
  return "";
}

function completeSignIn(db, req, res, user) {
  user.lastLoginAt = now();
  pruneSessions(db);
  const { token, maxAge } = createSession(db, user, req);
  audit(db, req, "login", "users", user.id, null, { email: user.email }, user);
  writeDb(db);
  return send(res, 200, {
    user: stripInternal(user),
    role: db.roles.find((role) => role.id === user.roleId)
  }, { "Set-Cookie": sessionCookieHeader(token, maxAge) });
}

// Throttles by identifier and by source address, so neither a single account nor a
// single host can be hammered.
function tooManyAttempts(db, key, limit, windowMs) {
  if (!Array.isArray(db.authAttempts)) db.authAttempts = [];
  const cutoff = Date.now() - windowMs;
  db.authAttempts = db.authAttempts.filter((item) => new Date(item.at).getTime() > cutoff);
  return db.authAttempts.filter((item) => item.key === key).length >= limit;
}

function recordAttempt(db, key) {
  if (!Array.isArray(db.authAttempts)) db.authAttempts = [];
  db.authAttempts.unshift({ key, at: now() });
}

async function handleAuthRoutes(db, req, res, resource, resourceId) {
  const isAuth = resource === "auth";
  if (!isAuth && !(req.method === "POST" && resource === "login")) return false;
  const route = isAuth ? resourceId : "password";
  const ip = req.socket.remoteAddress || "unknown";

  // Password sign-in, kept for accounts that still use one.
  if (route === "password") {
    const body = await readBody(req);
    const identifier = String(body.email || body.username || "").toLowerCase().trim();
    if (tooManyAttempts(db, `pw:${identifier}`, 10, 15 * 60 * 1000) || tooManyAttempts(db, `ip:${ip}`, 30, 15 * 60 * 1000)) {
      writeDb(db);
      return send(res, 429, { error: "Too many attempts. Try again later." }), true;
    }
    const account = accountForIdentifier(db, identifier);
    const ok = account && auth.verifyPassword(String(body.password || ""), account.password);
    if (!ok) {
      recordAttempt(db, `pw:${identifier}`);
      recordAttempt(db, `ip:${ip}`);
      writeDb(db);
      return send(res, 401, { error: "Invalid login" }), true;
    }
    const blocked = accountBlockedReason(account);
    if (blocked) {
      if (blocked === "Account expired") {
        account.status = "disabled";
        account.disabledReason = "Expired";
      }
      writeDb(db);
      return send(res, 403, { error: blocked }), true;
    }
    if (account.totpSecret) {
      return send(res, 200, { mfaRequired: true, method: "totp", userId: account.id }), true;
    }
    completeSignIn(db, req, res, account);
    return true;
  }

  // Step 1: ask for a code.
  if (route === "request-code" && req.method === "POST") {
    const body = await readBody(req);
    const email = String(body.email || "").toLowerCase().trim();
    if (tooManyAttempts(db, `req:${email}`, 5, 15 * 60 * 1000) || tooManyAttempts(db, `ip:${ip}`, 30, 15 * 60 * 1000)) {
      writeDb(db);
      return send(res, 429, { error: "Too many requests. Try again later." }), true;
    }
    recordAttempt(db, `req:${email}`);
    recordAttempt(db, `ip:${ip}`);
    const employee = employeeForIdentifier(db, email);
    const account = accountForIdentifier(db, email) || autoProvisionFromEmployee(db, employee ? employee.email : email);
    let devCode = "";
    if (account && !accountBlockedReason(account)) {
      const code = auth.generateLoginCode();
      const salt = auth.randomToken(8);
      db.loginCodes = loginCodes(db).filter((item) => item.userId !== account.id);
      db.loginCodes.unshift({
        id: id("code"),
        userId: account.id,
        email,
        salt,
        codeHash: auth.hashLoginCode(code, salt),
        expiresAt: new Date(Date.now() + auth.CODE_TTL_MS).toISOString(),
        attempts: 0,
        createdAt: now()
      });
      try {
        await sendMail({
          to: account.email,
          subject: "Your IT Reporting Center sign-in code",
          text: `Your sign-in code is ${code}\n\nIt expires in 10 minutes and can be used once.\nIf you did not request it, you can ignore this message.`
        });
      } catch (error) {
        // A configured-but-failing transport is the worst state to be in: no email
        // arrives and the code is withheld, so nobody can sign in and nothing on
        // screen explains why. Make it unmissable in the log.
        console.error("");
        console.error("  ! SIGN-IN EMAIL FAILED TO SEND");
        console.error(`    to: ${account.email}`);
        console.error(`    ${error.message}`);
        console.error("    Nobody can sign in by email until this is fixed.");
        console.error("    Diagnose with:  npm run mail:test -- " + account.email);
        console.error("");
      }
      // With no mail transport configured the code is only written to the server
      // console, which makes the system impossible to try. Return it so the sign-in
      // screen can show it. This is gated strictly on the "log" transport: as soon
      // as smtp or graph is configured the code never leaves the server.
      if (mailerTransport() === "log") devCode = code;
    }
    writeDb(db);
    // Never reveal whether an address is registered.
    return send(res, 200, {
      sent: true,
      expiresInSeconds: auth.CODE_TTL_MS / 1000,
      ...(devCode ? { devCode, devNotice: "Mail is not configured, so the code is shown here instead of being emailed." } : {})
    }), true;
  }

  // Step 2: exchange the code for a session.
  if (route === "verify-code" && req.method === "POST") {
    const body = await readBody(req);
    const email = String(body.email || "").toLowerCase().trim();
    const submitted = String(body.code || "").trim();
    const record = loginCodes(db).find((item) => item.email === email);
    if (!record || new Date(record.expiresAt).getTime() <= Date.now()) {
      db.loginCodes = loginCodes(db).filter((item) => item !== record);
      writeDb(db);
      return send(res, 401, { error: "That code is invalid or has expired." }), true;
    }
    if (record.attempts >= auth.CODE_MAX_ATTEMPTS) {
      db.loginCodes = loginCodes(db).filter((item) => item !== record);
      writeDb(db);
      return send(res, 429, { error: "Too many incorrect attempts. Request a new code." }), true;
    }
    if (!auth.timingSafeEqual(auth.hashLoginCode(submitted, record.salt), record.codeHash)) {
      record.attempts += 1;
      writeDb(db);
      return send(res, 401, { error: "That code is invalid or has expired." }), true;
    }
    const account = db.users.find((item) => item.id === record.userId);
    const blocked = account ? accountBlockedReason(account) : "Account not found";
    db.loginCodes = loginCodes(db).filter((item) => item !== record);
    if (!account || blocked) {
      writeDb(db);
      return send(res, 403, { error: blocked || "Account not found" }), true;
    }
    if (account.totpSecret) {
      return send(res, 200, { mfaRequired: true, method: "totp", userId: account.id }), true;
    }
    completeSignIn(db, req, res, account);
    return true;
  }

  // Second factor for privileged accounts. Works with no email delivery at all,
  // which is what makes it usable when mail itself is the outage.
  if (route === "verify-totp" && req.method === "POST") {
    const body = await readBody(req);
    const account = db.users.find((item) => item.id === body.userId);
    if (tooManyAttempts(db, `totp:${body.userId}`, 10, 15 * 60 * 1000)) {
      writeDb(db);
      return send(res, 429, { error: "Too many attempts. Try again later." }), true;
    }
    if (!account || !account.totpSecret || !auth.verifyTotp(account.totpSecret, body.token)) {
      recordAttempt(db, `totp:${body.userId}`);
      writeDb(db);
      return send(res, 401, { error: "Invalid authentication code" }), true;
    }
    const blocked = accountBlockedReason(account);
    if (blocked) {
      writeDb(db);
      return send(res, 403, { error: blocked }), true;
    }
    completeSignIn(db, req, res, account);
    return true;
  }

  if (route === "logout" && req.method === "POST") {
    destroySession(db, req);
    writeDb(db);
    return send(res, 200, { ok: true }, { "Set-Cookie": clearedCookieHeader() }), true;
  }

  // --- second-factor enrolment, for the signed-in account only ----------------
  // Enrolment is deliberately self-service: nobody, including an administrator,
  // can set or read another account's secret.
  if (route === "totp-setup" && req.method === "POST") {
    const account = sessionUser(db, req);
    if (!account) return send(res, 401, { error: "Authentication required" }), true;
    const secret = auth.generateTotpSecret();
    account.pendingTotpSecret = secret;
    writeDb(db);
    return send(res, 200, {
      secret,
      // The app can render this as a QR code, or the secret can be typed in.
      uri: auth.totpUri(secret, account.email || account.username)
    }), true;
  }

  if (route === "totp-confirm" && req.method === "POST") {
    const account = sessionUser(db, req);
    if (!account) return send(res, 401, { error: "Authentication required" }), true;
    const body = await readBody(req);
    if (!account.pendingTotpSecret) return send(res, 400, { error: "Start setup first" }), true;
    if (!auth.verifyTotp(account.pendingTotpSecret, body.token)) {
      return send(res, 401, { error: "That code did not match. Check your authenticator app." }), true;
    }
    account.totpSecret = account.pendingTotpSecret;
    delete account.pendingTotpSecret;
    account.totpEnrolledAt = now();
    audit(db, req, "enable_mfa", "users", account.id, null, { totpEnrolledAt: account.totpEnrolledAt }, account);
    writeDb(db);
    return send(res, 200, { enabled: true }), true;
  }

  if (route === "totp-disable" && req.method === "POST") {
    const account = sessionUser(db, req);
    if (!account) return send(res, 401, { error: "Authentication required" }), true;
    const body = await readBody(req);
    // Removing a factor is a security-relevant act; require a current code.
    if (!account.totpSecret || !auth.verifyTotp(account.totpSecret, body.token)) {
      return send(res, 401, { error: "Enter a current code to turn off two-factor sign-in." }), true;
    }
    delete account.totpSecret;
    delete account.pendingTotpSecret;
    delete account.totpEnrolledAt;
    audit(db, req, "disable_mfa", "users", account.id, null, null, account);
    writeDb(db);
    return send(res, 200, { enabled: false }), true;
  }

  // Setting your own password. Deliberately self-service and session-gated: an
  // administrator cannot read or choose someone else's password here.
  if (route === "set-password" && req.method === "POST") {
    const account = sessionUser(db, req);
    if (!account) return send(res, 401, { error: "Authentication required" }), true;
    const body = await readBody(req);
    const password = String(body.password || "");
    if (password.length < 8) return send(res, 400, { error: "Use at least 8 characters." }), true;
    if (password !== String(body.confirmPassword ?? password)) return send(res, 400, { error: "The two passwords do not match." }), true;
    account.password = auth.hashPassword(password);
    account.passwordSetAt = now();
    delete account.requirePasswordChange;
    audit(db, req, "set_password", "users", account.id, null, { passwordSetAt: account.passwordSetAt }, account);
    writeDb(db);
    return send(res, 200, { ok: true }), true;
  }

  if (route === "clear-password" && req.method === "POST") {
    const account = sessionUser(db, req);
    if (!account) return send(res, 401, { error: "Authentication required" }), true;
    delete account.password;
    delete account.passwordSetAt;
    audit(db, req, "clear_password", "users", account.id, null, null, account);
    writeDb(db);
    return send(res, 200, { ok: true }), true;
  }

  // Who am I? The only way the client learns its own identity.
  if (route === "session" && req.method === "GET") {
    const account = sessionUser(db, req);
    if (!account) return send(res, 401, { error: "Not signed in" }), true;
    return send(res, 200, {
      user: { ...stripInternal(account), mfaEnabled: Boolean(account.totpSecret), passwordSet: Boolean(account.password), mustChangePassword: Boolean(account.requirePasswordChange) },
      role: db.roles.find((role) => role.id === account.roleId)
    }), true;
  }

  // Lets the sign-in screen show the right options without leaking anything.
  if (route === "config" && req.method === "GET") {
    return send(res, 200, { emailSignIn: true, transport: mailerTransport() }), true;
  }

  return false;
}

function sessionCookieHeader(token, maxAge) {
  return auth.serializeCookie(auth.SESSION_COOKIE, token, { maxAge, secure: COOKIE_SECURE });
}

function clearedCookieHeader() {
  return auth.serializeCookie(auth.SESSION_COOKIE, "", { maxAge: 0, secure: COOKIE_SECURE });
}

function isAccountExpired(user) {
  return Boolean(user?.expiryDate) && user.expiryDate < new Date().toISOString().slice(0, 10);
}

function disableExpiredAccounts(db) {
  let changed = false;
  for (const user of db.users || []) {
    if (isAccountExpired(user) && user.status !== "disabled") {
      user.status = "disabled";
      user.disabledReason = "Expired";
      changed = true;
    }
  }
  return changed;
}

function roleForUser(db, user) {
  return db.roles.find((role) => role.id === user.roleId) || db.roles[0];
}

function can(db, user, module, permission) {
  const role = roleForUser(db, user);
  return Boolean(role?.permissions?.[module]?.[permission]);
}

function isItUser(db, user) {
  const role = roleForUser(db, user);
  return role?.id !== "role_employee";
}

function employeeForUser(db, user) {
  if (user.employeeId) return db.employees.find((employee) => employee.id === user.employeeId);
  if (user.id === "user_employee") return db.employees.find((employee) => employee.id === "emp_lina");
  return db.employees.find((employee) => employee.email && user.email && employee.email.toLowerCase() === user.email.toLowerCase());
}

function resourceModule(resource) {
  return ({
    knowledge_base: "knowledge_base",
    form_templates: "form_templates",
    audit_logs: "audit_logs",
    lookup_items: "lookup_items"
  })[resource] || resource;
}

function singular(resource) {
  return ({
    employees: "employee",
    assets: "asset",
    tickets: "ticket",
    tasks: "task",
    contracts: "contract",
    vendors: "vendor",
    documents: "document",
    attachments: "attachment",
    comments: "comment",
    knowledge_base: "knowledge_base",
    form_templates: "form_template"
  })[resource] || resource;
}

function singularResource(entityType) {
  const normalized = String(entityType || "");
  return ({
    employees: "employee",
    assets: "asset",
    tickets: "ticket",
    tasks: "task",
    contracts: "contract",
    vendors: "vendor",
    documents: "document"
  })[normalized] || normalized;
}

function relatedIdsForEmployee(db, user) {
  const employee = employeeForUser(db, user);
  if (!employee) return { employeeIds: new Set(), assetIds: new Set(), ticketIds: new Set(), documentIds: new Set(), contractIds: new Set(), vendorIds: new Set(), taskIds: new Set() };
  const employeeIds = new Set([employee.id]);
  const assetIds = new Set(db.assets.filter((asset) => asset.currentOwnerId === employee.id).map((asset) => asset.id));
  const ticketIds = new Set(db.tickets.filter((ticket) => ticket.requesterId === employee.id).map((ticket) => ticket.id));
  const documentIds = new Set(db.documents.filter((doc) => doc.linkedType === "company" && isPublishedDocument(doc)).map((doc) => doc.id));
  const taskIds = new Set(db.tasks.filter((task) => taskVisibleToEmployee(db, user, employee, task)).map((task) => task.id));
  return { employeeIds, assetIds, ticketIds, documentIds, contractIds: new Set(), vendorIds: new Set(), taskIds };
}

function userHasEmployeeRole(db, userId) {
  return db.users.find((user) => user.id === userId)?.roleId === "role_employee";
}

function taskExplicitScope(task) {
  return String(task.scope || task.visibility || task.taskScope || task.taskType || "").trim().toLowerCase();
}

function isPersonalTask(db, task) {
  const scope = taskExplicitScope(task);
  if (["work", "assigned", "operational"].includes(scope)) return false;
  if (["personal", "private"].includes(scope) || task.personal === true) return true;
  const ownerIsEmployee = userHasEmployeeRole(db, task.ownerId) || userHasEmployeeRole(db, task.createdBy);
  const assigneeIsEmployeeOrEmpty = !task.assignedToId || userHasEmployeeRole(db, task.assignedToId);
  return ownerIsEmployee && assigneeIsEmployeeOrEmpty;
}

function personalTaskUserIds(db, task) {
  return new Set([task.ownerId, task.assignedToId, task.createdBy].filter((userId) => userHasEmployeeRole(db, userId)));
}

function taskVisibleToEmployee(db, user, employee, task) {
  if (!task || task.deletedAt || task.archivedAt) return false;
  if (isPersonalTask(db, task)) return personalTaskUserIds(db, task).has(user.id);
  return task.ownerId === user.id || task.assignedToId === user.id || task.createdBy === user.id || task.relatedId === employee?.id;
}

function canAccessTaskRow(db, user, task) {
  if (isPersonalTask(db, task)) return personalTaskUserIds(db, task).has(user.id);
  if (isItUser(db, user)) return true;
  const employee = employeeForUser(db, user);
  return taskVisibleToEmployee(db, user, employee, task);
}

function isPublishedDocument(doc) {
  const status = String(doc.status || "").toLowerCase();
  return doc.published === true || doc.published === "true" || status === "published" || Boolean(doc.publishDate);
}

function stripInternal(row) {
  const copy = { ...row };
  delete copy.internal;
  delete copy.internalNotes;
  delete copy.waitingReason;
  delete copy.cancelReason;
  delete copy.withdrawalReason;
  delete copy.password;
  // Secrets that must never reach a client, even for the account's own record.
  delete copy.totpSecret;
  delete copy.pendingTotpSecret;
  delete copy.tokenHash;
  delete copy.codeHash;
  delete copy.salt;
  return copy;
}

function stripKnowledgeForEmployee(row, user = null) {
  const copy = stripInternal(row);
  copy.totalViews = Number(copy.totalViews || copy.views || copy.viewCount || 0);
  copy.uniqueReaders = Array.isArray(copy.uniqueReaderIds) ? copy.uniqueReaderIds.length : Number(copy.uniqueUsers || 0);
  copy.helpfulVotes = Object.values(copy.feedbackVotes || {}).filter((vote) => vote?.vote === "yes").length || Number(copy.helpfulYes || 0);
  copy.notHelpfulVotes = Object.values(copy.feedbackVotes || {}).filter((vote) => vote?.vote === "no").length || Number(copy.helpfulNo || 0);
  copy.favoritesCount = Array.isArray(copy.favoriteUserIds) ? copy.favoriteUserIds.length : Number(copy.favoritesCount || 0);
  copy.userVote = user ? copy.feedbackVotes?.[user.id]?.vote || "" : "";
  copy.favorite = user ? (copy.favoriteUserIds || []).includes(user.id) : false;
  delete copy.versionHistory;
  delete copy.reviewHistory;
  delete copy.uniqueReaderIds;
  delete copy.feedbackVotes;
  delete copy.favoriteUserIds;
  delete copy.recentReaders;
  delete copy.reviewerId;
  delete copy.approverId;
  delete copy.approvalDate;
  delete copy.rejectedBy;
  delete copy.rejectedAt;
  delete copy.rejectionReason;
  delete copy.reviewDecisionNotes;
  delete copy.reviewNotes;
  delete copy.submittedBy;
  delete copy.submittedAt;
  delete copy.changeSummary;
  delete copy.reasonForUpdate;
  delete copy.businessImpact;
  delete copy.riskLevel;
  delete copy.affectedSystems;
  delete copy.relatedIncident;
  return copy;
}

function visibleCollection(db, user, resource) {
  const ids = relatedIdsForEmployee(db, user);
  const it = isItUser(db, user);
  const active = (rows) => rows.filter((row) => !row.archivedAt && !row.deletedAt);
  if (resource === "assignment_groups") return visibleAssignmentGroups(db, user);
  if (it) {
    const all = {
      users: db.users.map(stripInternal),
      roles: db.roles,
      employees: active(db.employees),
      assets: active(db.assets),
      transfers: active(db.transfers),
      tickets: active(db.tickets),
      tasks: active(db.tasks).filter((task) => canAccessTaskRow(db, user, task)),
      contracts: active(db.contracts),
      vendors: active(db.vendors),
      documents: active(db.documents),
      attachments: active(db.attachments).filter((row) => canAccessEntity(db, user, row.entityType, row.entityId)),
      comments: active(db.comments).filter((row) => canAccessEntity(db, user, row.entityType, row.entityId)),
      notifications: db.notifications.filter((row) => notificationVisibleToUser(db, user, row)),
      knowledge_base: active(db.knowledgeBase),
      form_templates: active(db.formTemplates),
      lookup_items: active(db.lookupItems || []),
      audit_logs: db.auditLogs.filter((row) => row.entityType !== "tasks" || canAccessEntity(db, user, "task", row.entityId)),
      timeline: db.timeline.filter((row) => row.entityType !== "tasks" || canAccessEntity(db, user, "task", row.entityId))
    };
    return all[resource] || [];
  }
  const allowed = {
    users: db.users.filter((row) => row.id === user.id).map(stripInternal),
    roles: db.roles.filter((row) => row.id === user.roleId),
    employees: active(db.employees).filter((row) => ids.employeeIds.has(row.id)).map(stripInternal),
    assets: active(db.assets).filter((row) => ids.assetIds.has(row.id)).map(stripInternal),
    transfers: active(db.transfers).filter((row) => ids.assetIds.has(row.assetId)).map(stripInternal),
    tickets: active(db.tickets).filter((row) => ids.ticketIds.has(row.id)).map(stripInternal),
    tasks: active(db.tasks).filter((row) => ids.taskIds.has(row.id)).map(stripInternal),
    contracts: [],
    vendors: [],
    documents: active(db.documents).filter((row) => ids.documentIds.has(row.id)).map(stripInternal),
    attachments: active(db.attachments).filter((row) => {
      if (row.entityType === "employee") return ids.employeeIds.has(row.entityId);
      if (row.entityType === "asset") return ids.assetIds.has(row.entityId);
      if (row.entityType === "ticket") return ids.ticketIds.has(row.entityId);
      if (row.entityType === "document") return ids.documentIds.has(row.entityId);
      return false;
    }).map(stripInternal),
    comments: active(db.comments).filter((row) => row.entityType === "ticket" && ids.ticketIds.has(row.entityId) && !row.internal).map(stripInternal),
    notifications: db.notifications.filter((row) => notificationVisibleToUser(db, user, row)),
    knowledge_base: active(db.knowledgeBase).filter((row) => row.published === true || row.published === "true").map((row) => stripKnowledgeForEmployee(row, user)),
    form_templates: [],
    lookup_items: active(db.lookupItems || []).filter((row) => row.active !== false),
    audit_logs: [],
    timeline: []
  };
  return allowed[resource] || [];
}

function visibleAssignmentGroups(db, user) {
  const active = (db.assignmentGroups || []).filter((row) => !row.deletedAt && row.active !== false);
  if (["role_manager", "role_admin"].includes(user.roleId)) return active;
  if (user.roleId === "role_staff") {
    return active.filter((group) => group.leadUserId === user.id || normalizeArray(group.memberUserIds).includes(user.id));
  }
  return [];
}

function archivedCollection(db, user) {
  if (!isItUser(db, user)) return [];
  return ["employees", "assets", "tickets", "tasks", "contracts", "vendors", "documents", "knowledge_base", "form_templates"].flatMap((resource) => {
    const key = resource === "knowledge_base" ? "knowledgeBase" : resource === "form_templates" ? "formTemplates" : resource;
    return (db[key] || []).filter((row) => row.archivedAt && !row.deletedAt && (resource !== "tasks" || canAccessTaskRow(db, user, row))).map((row) => ({ ...row, archiveType: resource }));
  });
}

function trashCollection(db, user) {
  if (!isItUser(db, user)) return [];
  return ["employees", "assets", "tickets", "tasks", "contracts", "vendors", "documents", "knowledge_base", "form_templates"].flatMap((resource) => {
    const key = resource === "knowledge_base" ? "knowledgeBase" : resource === "form_templates" ? "formTemplates" : resource;
    return (db[key] || []).filter((row) => row.deletedAt && (resource !== "tasks" || canAccessTaskRow(db, user, row))).map((row) => ({ ...row, archiveType: resource }));
  });
}

function canAccessEntity(db, user, entityType, entityId) {
  const type = singularResource(entityType);
  if (type === "task") {
    const task = db.tasks.find((row) => row.id === entityId);
    return Boolean(task && canAccessTaskRow(db, user, task));
  }
  if (isItUser(db, user)) return true;
  const ids = relatedIdsForEmployee(db, user);
  if (type === "employee") return ids.employeeIds.has(entityId);
  if (type === "asset") return ids.assetIds.has(entityId);
  if (type === "ticket") return ids.ticketIds.has(entityId);
  if (type === "document") return ids.documentIds.has(entityId);
  if (type === "knowledge_base") return true;
  return false;
}

function canEmployeeCreateAttachment(db, user, entityType, entityId) {
  const ids = relatedIdsForEmployee(db, user);
  const type = singularResource(entityType);
  if (type === "ticket") return ids.ticketIds.has(entityId);
  if (type === "asset") return ids.assetIds.has(entityId);
  if (type === "employee") return ids.employeeIds.has(entityId);
  if (type === "document") {
    const document = db.documents.find((row) => row.id === entityId);
    return Boolean(document && document.linkedType === "employee" && ids.employeeIds.has(document.linkedId));
  }
  return false;
}

function canEmployeeCreateComment(db, user, entityType, entityId) {
  return singularResource(entityType) === "ticket" && relatedIdsForEmployee(db, user).ticketIds.has(entityId);
}

function notificationCategory(notification) {
  const type = String(notification.category || notification.entityType || "").toLowerCase();
  if (type.includes("ticket") || type === "comment" || type === "attachment") return "tickets";
  if (type.includes("task")) return "tasks";
  if (type.includes("asset") || type.includes("transfer")) return "assets";
  if (type.includes("contract")) return "contracts";
  if (type.includes("vendor")) return "vendors";
  if (type.includes("knowledge")) return "knowledge_base";
  return "tickets";
}

function defaultNotificationPreferences(user) {
  const employee = user.roleId === "role_employee";
  return { tickets: true, tasks: true, assets: !employee, contracts: !employee, vendors: !employee };
}

function notificationPreferences(user) {
  return { ...defaultNotificationPreferences(user), ...(user.notificationPreferences || {}) };
}

function retainNotificationForRole(db, notification) {
  const recipient = db.users.find((user) => user.id === notification.userId);
  if (!recipient) return false;
  if (recipient.roleId === "role_employee") return ["Comment added", "A ticket was opened for you", "Ticket assigned", "Ticket status changed", "More information needed", "Ticket resolved", "Ticket closed", "Asset assigned", "Asset returned", "Asset custody updated"].includes(notification.title);
  if (recipient.roleId === "role_staff") return ["Ticket assigned", "A ticket was opened for you", "Ticket auto-assigned", "Task assigned", "Task status changed", "Task completed", "Task cancelled", "Task reminder updated", "Recurring task generated", "Asset assigned", "Asset returned", "Asset custody updated", "Asset sent to repair", "Asset moved to maintenance", "Comment added", "Knowledge comment added", "Knowledge attachment uploaded", "Article published", "Article submitted for review", "Knowledge review assigned", "Knowledge changes requested", "Knowledge review due", "Knowledge review overdue", "Knowledge helpful score dropped", "Knowledge article became popular", "Knowledge linked tickets increased", "Contract expires within 90 days", "Contract expires within 60 days", "Contract expires within 30 days", "Contract expires within 14 days", "Contract expires within 7 days", "Contract expires within 1 day", "Contract expired", "Task due today", "Task overdue"].includes(notification.title);
  if (recipient.roleId === "role_manager") return ["High priority ticket created", "Ticket waiting review", "Ticket auto-assigned", "SLA breached", "Vendor waiting too long", "Vendor document uploaded", "Vendor owner assigned", "Vendor asset linked", "Vendor review scheduled", "Vendor contact added", "Vendor contact updated", "Knowledge comment added", "Knowledge attachment uploaded", "Article published", "Article archived", "Article submitted for review", "Article approved", "Article rejected", "Knowledge review assigned", "Knowledge changes requested", "Knowledge review scheduled", "Knowledge review due", "Knowledge review overdue", "Knowledge version restored", "Knowledge helpful score dropped", "Knowledge article became popular", "Knowledge linked tickets increased", "Knowledge owner changed", "Knowledge category changed", "Asset assigned", "Asset returned", "Asset custody updated", "Asset sent to repair", "Asset moved to maintenance", "Asset marked lost", "Asset marked stolen", "Asset disposed", "Contract expires within 90 days", "Contract expires within 60 days", "Contract expires within 30 days", "Contract expires within 14 days", "Contract expires within 7 days", "Contract expires within 1 day", "Contract expired", "Contract renewed", "Contract terminated", "Contract approval requested", "Task assigned", "Task status changed", "Task completed", "Task cancelled", "Task reminder updated", "Recurring task generated", "Task due today", "Task overdue", "Ticket withdrawn by employee"].includes(notification.title);
  return true;
}

function notificationVisibleToUser(db, user, notification) {
  return notification.userId === user.id;
}

function userForEmployee(db, employeeId) {
  const employee = db.employees.find((row) => row.id === employeeId);
  if (!employee) return null;
  return db.users.find((user) => user.employeeId === employee.id) || db.users.find((user) => employeeForUser(db, user)?.id === employee.id) || null;
}

function lookUserName(db, userId) {
  return db.users.find((user) => user.id === userId)?.name || "IT";
}

function lookGroupName(db, groupId) {
  return (db.assignmentGroups || []).find((group) => group.id === groupId)?.name || "Assignment Group";
}

function lookVendorName(db, vendorId) {
  return db.vendors.find((vendor) => vendor.id === vendorId)?.name || "";
}

function isEmployee(db, userId) { return db.users.find((user) => user.id === userId)?.roleId === "role_employee"; }
function isStaff(db, userId) { return db.users.find((user) => user.id === userId)?.roleId === "role_staff"; }
function isTicketAssignee(db, userId) { return ["role_staff", "role_manager"].includes(db.users.find((user) => user.id === userId)?.roleId); }
function mentionedStaffIds(db, text) {
  const body = String(text || "").toLowerCase();
  return db.users.filter((user) => user.roleId === "role_staff" && body.includes(`@${user.name.toLowerCase()}`)).map((user) => user.id);
}

function createNotification(db, options) {
  const roleRecipientIds = db.users.filter((user) => (options.roleIds || []).includes(user.roleId) && user.status !== "inactive").map((user) => user.id);
  const userIds = [...new Set([...(options.userIds || []), ...roleRecipientIds].filter(Boolean))];
  const category = notificationCategory(options);
  for (const userId of userIds) {
    const recipient = db.users.find((user) => user.id === userId);
    if (!recipient || (!options.force && !notificationPreferences(recipient)[category])) continue;
    db.notifications.unshift({
      id: id("not"), userId, type: options.type || "info", title: options.title,
      body: options.body || "", entityType: options.entityType, entityId: options.entityId,
      category, unread: true, createdAt: now()
    });
  }
}

function defaultTicketAssignmentSettings() {
  return {
    enabled: false,
    strategy: "manual",
    categoryAssignees: {},
    categoryRoutes: {},
    fallbackAssigneeId: "",
    roundRobinIndex: 0
  };
}

function ticketAssignmentSettings(db) {
  db.settings = db.settings || {};
  db.settings.ticketAssignment = { ...defaultTicketAssignmentSettings(), ...(db.settings.ticketAssignment || {}) };
  db.settings.ticketAssignment.categoryAssignees = db.settings.ticketAssignment.categoryAssignees || {};
  db.settings.ticketAssignment.categoryRoutes = db.settings.ticketAssignment.categoryRoutes || {};
  return db.settings.ticketAssignment;
}

function openTicketCountForUser(db, userId) {
  return db.tickets.filter((ticket) =>
    !ticket.archivedAt
    && !ticket.deletedAt
    && ticket.assignedToId === userId
    && !["resolved", "closed", "cancelled"].includes(String(ticket.status || "open").toLowerCase())
  ).length;
}

// Legacy display names -> new parent codes, so tickets and routing rules created
// before the taxonomy migration still resolve.
const legacyTicketParentAliases = {
  "access & accounts": "accounts_access",
  "access": "accounts_access",
  "accounts": "accounts_access",
  "hardware": "hardware_devices",
  "software": "software_applications",
  "network": "network_connectivity",
  "new request": "service_requests",
  "general": "general_questions",
  "security": "accounts_access",
  "other": "general_questions"
};

function ticketCategoryItems(db) {
  return (db.lookupItems || []).filter((item) => item.type === "ticket_category" && item.active !== false);
}

function ticketCategoryParents(db) {
  return ticketCategoryItems(db).filter((item) => !item.parentCode);
}

function ticketCategoryChildren(db, parentCode) {
  return ticketCategoryItems(db).filter((item) => item.parentCode === parentCode);
}

function findTicketCategoryByCode(db, code) {
  if (!code) return null;
  return ticketCategoryItems(db).find((item) => item.code === String(code)) || null;
}

function findTicketCategoryByName(db, name, parentCode = null) {
  const wanted = String(name || "").trim().toLowerCase();
  if (!wanted) return null;
  return ticketCategoryItems(db).find((item) =>
    (parentCode === null || item.parentCode === parentCode)
    && [item.nameEn, item.nameAr].some((label) => String(label || "").trim().toLowerCase() === wanted)
  ) || null;
}

// Splits "Main / Sub" on the FIRST separator only - subcategory names such as
// "Keyboard / Mouse" contain a slash themselves.
function splitTicketCategoryLabel(value) {
  const raw = String(value || "").trim();
  if (!raw) return { main: "", sub: "" };
  const index = raw.indexOf("/");
  if (index === -1) return { main: raw, sub: "" };
  return { main: raw.slice(0, index).trim(), sub: raw.slice(index + 1).trim() };
}

// Resolves whatever the client sent (codes, "Main / Sub" label, or the legacy
// mainCategory/subcategory pair) into canonical codes + display label.
function resolveTicketCategory(db, source = {}) {
  let parent = findTicketCategoryByCode(db, source.mainCategoryCode);
  let child = findTicketCategoryByCode(db, source.subcategoryCode);
  // A caller may send a main category code on its own; treat it as the parent
  // rather than rejecting the ticket.
  if (child && !child.parentCode) {
    parent = parent || child;
    child = null;
  }
  if (child && (!parent || parent.code !== child.parentCode)) parent = findTicketCategoryByCode(db, child.parentCode);
  if (!parent) {
    const label = splitTicketCategoryLabel(source.category);
    const mainName = String(source.mainCategory || label.main || "").trim();
    const subName = String(source.subcategory || label.sub || "").trim();
    parent = findTicketCategoryByName(db, mainName, "")
      || findTicketCategoryByCode(db, legacyTicketParentAliases[mainName.toLowerCase()])
      || null;
    if (parent && subName) child = findTicketCategoryByName(db, subName, parent.code);
  }
  if (!parent) return null;
  return {
    mainCategoryCode: parent.code,
    subcategoryCode: child ? child.code : "",
    mainCategory: parent.nameEn,
    subcategory: child ? child.nameEn : "",
    category: child ? `${parent.nameEn} / ${child.nameEn}` : parent.nameEn
  };
}

// Writes canonical category fields onto a ticket. Returns false when the
// category could not be resolved so callers can reject the payload.
function applyTicketCategory(db, ticket) {
  const resolved = resolveTicketCategory(db, ticket);
  if (!resolved) return false;
  Object.assign(ticket, resolved);
  return true;
}

function pickLeastOpenStaff(db) {
  return db.users
    .filter((user) => user.roleId === "role_staff" && !["inactive", "disabled", "locked"].includes(String(user.status || "active").toLowerCase()))
    .sort((a, b) => openTicketCountForUser(db, a.id) - openTicketCountForUser(db, b.id) || String(a.name).localeCompare(String(b.name)))[0];
}

function pickManagerFallback(db, preferredId = "") {
  const preferred = db.users.find((user) => user.id === preferredId && isTicketAssignee(db, user.id) && !["inactive", "disabled", "locked"].includes(String(user.status || "active").toLowerCase()));
  return preferred || db.users.find((user) => user.roleId === "role_manager" && !["inactive", "disabled", "locked"].includes(String(user.status || "active").toLowerCase()));
}

function groupMembers(db, group) {
  const ids = [...new Set([group.leadUserId, ...(Array.isArray(group.memberUserIds) ? group.memberUserIds : [])].filter(Boolean))];
  return ids.map((userId) => db.users.find((user) => user.id === userId)).filter((user) =>
    user
    && isTicketAssignee(db, user.id)
    && !["inactive", "disabled", "locked"].includes(String(user.status || "active").toLowerCase())
  );
}

function assignTicketToGroup(db, ticket, groupId) {
  const group = (db.assignmentGroups || []).find((item) => item.id === groupId && item.active !== false && item.canReceiveTickets !== false);
  if (!group) return null;
  const members = groupMembers(db, group);
  const method = group.assignmentMethod || "Least Open Tickets";
  let assignee = null;
  if (method === "Group Lead") {
    assignee = members.find((user) => user.id === group.leadUserId) || null;
  } else if (method === "Round Robin") {
    if (members.length) {
      const index = Number(group.roundRobinIndex || 0) % members.length;
      assignee = members[index];
      group.roundRobinIndex = (index + 1) % members.length;
      group.updatedAt = now();
    }
  } else if (method === "Manual Queue") {
    assignee = null;
  } else {
    assignee = [...members].sort((a, b) => openTicketCountForUser(db, a.id) - openTicketCountForUser(db, b.id) || String(a.name).localeCompare(String(b.name)))[0] || null;
  }
  ticket.assignedGroupId = group.id;
  if (assignee) ticket.assignedToId = assignee.id;
  ticket.autoAssigned = true;
  ticket.autoAssignmentMethod = `group_${String(method).toLowerCase().replace(/[^a-z0-9]+/g, "_")}`;
  ticket.autoAssignedAt = now();
  return {
    group,
    assignee,
    method,
    recipientIds: assignee ? [assignee.id] : members.map((user) => user.id)
  };
}

function validateAssignmentGroupPayload(db, body, existing = {}) {
  const groupTypes = ["Service Desk", "Infrastructure", "Applications", "Assets", "Security", "Other"];
  const assignmentMethods = ["Least Open Tickets", "Round Robin", "Group Lead", "Manual Queue"];
  const name = String(body.name ?? existing.name ?? "").trim();
  if (!name) return { error: "Group name is required" };
  const groupType = String(body.groupType ?? existing.groupType ?? "Other");
  if (!groupTypes.includes(groupType)) return { error: "Unsupported group type" };
  const assignmentMethod = String(body.assignmentMethod ?? existing.assignmentMethod ?? "Least Open Tickets");
  if (!assignmentMethods.includes(assignmentMethod)) return { error: "Unsupported assignment method" };
  const leadUserId = String(body.leadUserId ?? existing.leadUserId ?? "");
  if (leadUserId && !isTicketAssignee(db, leadUserId)) return { error: "Group lead must be IT Staff or IT Manager" };
  const memberUserIds = normalizeArray(body.memberUserIds ?? existing.memberUserIds).filter(Boolean);
  for (const userId of memberUserIds) {
    if (!isTicketAssignee(db, userId)) return { error: "Group members must be IT Staff or IT Manager users" };
  }
  const mergedMembers = [...new Set([leadUserId, ...memberUserIds].filter(Boolean))];
  return {
    value: {
      name,
      description: String(body.description ?? existing.description ?? "").trim(),
      groupType,
      leadUserId,
      memberUserIds: mergedMembers,
      active: body.active === undefined ? existing.active !== false : Boolean(body.active),
      canReceiveTickets: body.canReceiveTickets === undefined ? existing.canReceiveTickets !== false : Boolean(body.canReceiveTickets),
      assignmentMethod,
      roundRobinIndex: Number(existing.roundRobinIndex || 0)
    }
  };
}

function pickRoundRobinStaff(db) {
  const staff = db.users
    .filter((user) => user.roleId === "role_staff" && !["inactive", "disabled", "locked"].includes(String(user.status || "active").toLowerCase()))
    .sort((a, b) => String(a.id).localeCompare(String(b.id)));
  if (!staff.length) return null;
  const settings = ticketAssignmentSettings(db);
  const index = Number(settings.roundRobinIndex || 0) % staff.length;
  settings.roundRobinIndex = (index + 1) % staff.length;
  return staff[index];
}

// Resolves the routing rule for a ticket: the most specific subcategory rule
// wins, otherwise the ticket inherits its main category rule.
function resolveCategoryRoute(db, ticket) {
  const settings = ticketAssignmentSettings(db);
  const keys = [ticket.subcategoryCode, ticket.mainCategoryCode].filter(Boolean);
  for (const key of keys) {
    const route = settings.categoryRoutes[key];
    if (route?.type && route.id) return { route, key };
    const legacy = settings.categoryAssignees[key];
    if (legacy) return { route: { type: "user", id: legacy }, key };
  }
  return { route: null, key: "" };
}

function autoAssignTicket(db, ticket) {
  const settings = ticketAssignmentSettings(db);
  if (!settings.enabled || settings.strategy === "manual" || ticket.assignedToId) return null;
  const { route } = resolveCategoryRoute(db, ticket);
  if (route?.type === "group" && route.id) return assignTicketToGroup(db, ticket, route.id);
  let assignee = route?.type === "user" ? db.users.find((user) => user.id === route.id && isTicketAssignee(db, user.id)) : null;
  let method = "category";
  if (!assignee) {
    if (settings.strategy === "round_robin") {
      assignee = pickRoundRobinStaff(db);
      method = "round_robin";
    } else if (settings.strategy === "least_open" || settings.strategy === "category") {
      assignee = pickLeastOpenStaff(db);
      method = "least_open_tickets";
    }
  }
  if (!assignee) {
    assignee = pickManagerFallback(db, settings.fallbackAssigneeId);
    method = "it_manager_fallback";
  }
  if (!assignee) return null;
  ticket.assignedToId = assignee.id;
  ticket.autoAssigned = true;
  ticket.autoAssignmentMethod = method;
  ticket.autoAssignedAt = now();
  return { assignee, method, recipientIds: [assignee.id] };
}

function ticketRecipients(db, ticket, excludeUserId = "") {
  const requester = userForEmployee(db, ticket.requesterId)?.id;
  return [...new Set([requester, ticket.assignedToId].filter((userId) => userId && userId !== excludeUserId))];
}

function ticketParticipantRecipients(db, ticket, excludeUserId = "") {
  const commentAuthors = db.comments.filter((comment) => comment.entityType === "ticket" && comment.entityId === ticket.id).map((comment) => comment.authorId);
  return [...new Set([...ticketRecipients(db, ticket, excludeUserId), ...commentAuthors.filter((userId) => userId && userId !== excludeUserId)])];
}

function isNearContractExpiration(contract) {
  const endDate = String(contract.endDate || contract.renewalReminderDate || "");
  if (!endDate) return false;
  const days = contractDaysUntil(contract);
  return days <= 90;
}

function contractDaysUntil(contract) {
  const endDate = String(contract.endDate || contract.renewalReminderDate || "");
  if (!endDate) return 99999;
  const todayValue = new Date().toISOString().slice(0, 10);
  return Math.ceil((new Date(`${endDate}T00:00:00`).getTime() - new Date(`${todayValue}T00:00:00`).getTime()) / 86400000);
}

function contractOwnerUserIds(db, contract) {
  const owners = [contract.ownerUserId, userForEmployee(db, contract.ownerEmployeeId)?.id].filter(Boolean);
  return [...new Set(owners)];
}

function contractReminderRecipients(db, contract) {
  const managers = db.users.filter((user) => user.roleId === "role_manager" && user.status !== "inactive").map((user) => user.id);
  return [...new Set([...managers, ...contractOwnerUserIds(db, contract)])];
}

function notificationExists(db, userId, entityType, entityId, title) {
  return db.notifications.some((notification) => notification.userId === userId && notification.entityType === entityType && notification.entityId === entityId && notification.title === title);
}

function ensureContractExpirationNotifications(db) {
  let changed = false;
  const thresholds = [0, 1, 7, 14, 30, 60, 90];
  for (const contract of db.contracts.filter((item) => !item.archivedAt && !item.deletedAt && isNearContractExpiration(item))) {
    const days = contractDaysUntil(contract);
    const recipients = contractReminderRecipients(db, contract);
    const matchedThreshold = days < 0 ? -1 : thresholds.find((threshold) => days <= threshold);
    if (matchedThreshold === undefined) continue;
    const title = matchedThreshold === -1 ? "Contract expired" : `Contract expires within ${matchedThreshold || 1} day${matchedThreshold === 1 || matchedThreshold === 0 ? "" : "s"}`;
    for (const userId of recipients) {
      if (notificationExists(db, userId, "contract", contract.id, title)) continue;
      createNotification(db, { userIds: [userId], category: "contracts", type: days <= 7 ? "critical" : "warning", title, body: `${contract.name} ${days < 0 ? "has expired" : `expires in ${Math.max(0, days)} days`}.`, entityType: "contract", entityId: contract.id });
      changed = true;
    }
  }
  return changed;
}

function ensureTaskDeadlineNotifications(db) {
  let changed = false;
  for (const task of db.tasks.filter((item) => !item.archivedAt && !item.deletedAt && item.dueDate && !["done", "completed", "cancelled"].includes(String(item.status || "").toLowerCase()))) {
    const recipient = db.users.find((user) => user.id === task.ownerId);
    if (!recipient || recipient.roleId !== "role_staff") continue;
    const title = task.dueDate === new Date().toISOString().slice(0, 10) ? "Task due today" : task.dueDate < new Date().toISOString().slice(0, 10) ? "Task overdue" : "";
    if (!title || notificationExists(db, recipient.id, "task", task.id, title)) continue;
    createNotification(db, { userIds: [recipient.id], category: "tasks", type: title === "Task overdue" ? "warning" : "info", title, body: `${task.title || "A task"} is ${title === "Task overdue" ? "overdue" : "due today"}.`, entityType: "task", entityId: task.id });
    changed = true;
  }
  return changed;
}

function ensureOperationalTicketNotifications(db) {
  let changed = false;
  const managers = db.users.filter((user) => user.roleId === "role_manager" && user.status !== "inactive");
  const todayValue = new Date().toISOString().slice(0, 10);
  for (const ticket of db.tickets.filter((item) => !item.archivedAt && !item.deletedAt)) {
    const dueDate = ticket.slaDueDate || ticket.dueDate;
    const breached = dueDate && dueDate < todayValue;
    const vendorWaiting = ticket.status === "waiting" && String(ticket.waitingReason || "").toLowerCase() === "vendor" && String(ticket.updatedAt || ticket.createdAt || "").slice(0, 10) < todayValue;
    for (const manager of managers) {
      if (breached && !notificationExists(db, manager.id, "ticket", ticket.id, "SLA breached")) {
        createNotification(db, { userIds: [manager.id], category: "tickets", type: "critical", title: "SLA breached", body: `${ticket.ticketNumber} has breached its SLA.`, entityType: "ticket", entityId: ticket.id });
        changed = true;
      }
      if (vendorWaiting && !notificationExists(db, manager.id, "ticket", ticket.id, "Vendor waiting too long")) {
        createNotification(db, { userIds: [manager.id], category: "vendors", type: "warning", title: "Vendor waiting too long", body: `${ticket.ticketNumber} is still waiting for vendor response.`, entityType: "ticket", entityId: ticket.id });
        changed = true;
      }
    }
  }
  return changed;
}

function ensureKnowledgeReviewNotifications(db) {
  let changed = false;
  const todayValue = new Date().toISOString().slice(0, 10);
  const soonValue = new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10);
  for (const article of db.knowledgeBase.filter((item) => !item.archivedAt && !item.deletedAt && item.nextReviewDate)) {
    const overdue = article.nextReviewDate < todayValue;
    const dueSoon = article.nextReviewDate >= todayValue && article.nextReviewDate <= soonValue;
    if (!overdue && !dueSoon) continue;
    const title = overdue ? "Knowledge review overdue" : "Knowledge review due";
    const recipients = knowledgeRecipients(db, article);
    for (const userId of recipients) {
      if (notificationExists(db, userId, "knowledge_base", article.id, title)) continue;
      createNotification(db, {
        userIds: [userId],
        category: "knowledge_base",
        type: overdue ? "critical" : "warning",
        title,
        body: `${article.title || "Knowledge article"} review ${overdue ? "is overdue" : `is due on ${article.nextReviewDate}`}.`,
        entityType: "knowledge_base",
        entityId: article.id,
        force: true
      });
      changed = true;
    }
  }
  return changed;
}

const validTicketStatuses = new Set(["open", "in_progress", "waiting", "resolved", "closed", "cancelled"]);
const ticketTransitions = {
  open: new Set(["in_progress", "waiting", "cancelled"]),
  in_progress: new Set(["waiting", "resolved", "cancelled"]),
  waiting: new Set(["in_progress", "resolved", "cancelled"]),
  resolved: new Set(["closed", "in_progress"]),
  closed: new Set(),
  cancelled: new Set()
};
const validWaitingReasons = new Set(["User", "Vendor", "Approval", "Parts", "External Company", "Other"]);
const validCancelReasons = new Set(["Requester", "IT", "Duplicate", "Created by mistake", "No longer needed", "Other"]);
const validTaskStatuses = new Set(["pending", "in_progress", "waiting", "completed", "cancelled", "archived"]);
const taskTransitions = {
  pending: new Set(["in_progress", "waiting", "completed", "cancelled", "archived"]),
  in_progress: new Set(["pending", "waiting", "completed", "cancelled", "archived"]),
  waiting: new Set(["pending", "in_progress", "completed", "cancelled", "archived"]),
  completed: new Set(["in_progress", "archived"]),
  cancelled: new Set(["pending", "archived"]),
  archived: new Set(["pending"])
};

function normalizeTaskStatus(status) {
  return String(status || "pending").toLowerCase().replace(/\s+/g, "_");
}

function nextTaskNumber(db) {
  const max = db.tasks.reduce((value, task) => {
    const match = String(task.taskNumber || "").match(/TSK-(\d+)/i);
    return match ? Math.max(value, Number(match[1])) : value;
  }, 0);
  return `TSK-${String(max + 1).padStart(4, "0")}`;
}

function taskRecipients(db, task) {
  return [...new Set([task.ownerId, task.assignedToId].filter(Boolean))];
}

function taskAudit(db, req, action, task, oldValue, message) {
  audit(db, req, action, "tasks", task.id, oldValue, task);
  const event = db.timeline[0];
  if (event && event.entityId === task.id) {
    event.title = message;
    event.description = message;
  }
}

function addDays(dateValue, days) {
  const date = new Date(`${dateValue || new Date().toISOString().slice(0, 10)}T00:00:00`);
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function nextTaskOccurrenceDate(task) {
  const basis = task.dueDate || new Date().toISOString().slice(0, 10);
  const recurrence = String(task.recurrence || "One Time").toLowerCase();
  if (recurrence === "daily") return addDays(basis, 1);
  if (recurrence === "weekly") return addDays(basis, 7);
  if (recurrence === "monthly") return addDays(basis, 30);
  if (recurrence === "quarterly") return addDays(basis, 91);
  if (recurrence === "yearly") return addDays(basis, 365);
  return "";
}

function generateRecurringTask(db, req, task) {
  const nextDue = nextTaskOccurrenceDate(task);
  if (!nextDue) return null;
  const nextTask = {
    ...task,
    id: id("task"),
    taskNumber: nextTaskNumber(db),
    status: "pending",
    progress: 0,
    dueDate: nextDue,
    parentRecurringTaskId: task.parentRecurringTaskId || task.id,
    recurrenceHistory: [],
    createdAt: now(),
    updatedAt: now(),
    completedAt: "",
    startedAt: "",
    archivedAt: undefined,
    deletedAt: undefined
  };
  delete nextTask.archivedAt;
  delete nextTask.deletedAt;
  nextTask.recurrenceHistory = [...(task.recurrenceHistory || []), { sourceTaskId: task.id, generatedTaskId: nextTask.id, dueDate: nextDue, createdAt: now() }];
  db.tasks.unshift(nextTask);
  audit(db, req, "recurring_generated", "tasks", nextTask.id, null, nextTask);
  createNotification(db, { userIds: taskRecipients(db, nextTask), category: "tasks", type: "info", title: "Recurring task generated", body: `${nextTask.title || "A recurring task"} was generated for ${nextDue}.`, entityType: "task", entityId: nextTask.id });
  return nextTask;
}

function canAccessResourceRow(db, user, resource, row) {
  if (resource === "tasks") return canAccessTaskRow(db, user, row);
  if (isItUser(db, user)) return true;
  if (resource === "users") return row.id === user.id;
  if (resource === "roles") return row.id === user.roleId;
  if (resource === "attachments") return canAccessEntity(db, user, row.entityType, row.entityId);
  if (resource === "comments") return canAccessEntity(db, user, row.entityType, row.entityId);
  if (resource === "notifications") return notificationVisibleToUser(db, user, row);
  if (resource === "knowledge_base") return row.published === true || row.published === "true";
  if (resource === "lookup_items") return row.active !== false;
  if (resource === "form_templates" || resource === "audit_logs") return false;
  return visibleCollection(db, user, resource).some((item) => item.id === row.id);
}

function enrich(db, user = db.users[0]) {
  const active = (rows) => rows.filter((row) => !row.archivedAt && !row.deletedAt);
  const byId = (rows, labeler) => Object.fromEntries(rows.map((row) => [row.id, labeler(row)]));
  const usersRows = visibleCollection(db, user, "users");
  const employeeRows = visibleCollection(db, user, "employees");
  const assetRows = visibleCollection(db, user, "assets");
  const vendorRows = visibleCollection(db, user, "vendors");
  const roleRows = visibleCollection(db, user, "roles");
  const documentRows = visibleCollection(db, user, "documents");
  const assignmentGroupRows = visibleCollection(db, user, "assignment_groups");
  const users = byId(usersRows, (row) => row.name);
  const employees = byId(employeeRows, (row) => row.name);
  const departments = byId(db.departments, (row) => row.name);
  const vendors = byId(vendorRows, (row) => row.name);
  const roles = byId(roleRows, (row) => row.name);
  const assets = byId(assetRows, (row) => row.assetNumber);
  const documents = byId(documentRows, (row) => row.title);
  const assignmentGroups = byId(assignmentGroupRows, (row) => row.name);
  const visibleTickets = visibleCollection(db, user, "tickets");
  const visibleTasks = visibleCollection(db, user, "tasks");
  const visibleContracts = visibleCollection(db, user, "contracts");
  return {
    meta: db.meta,
    roles: roleRows,
    users: usersRows,
    departments: db.departments,
    employees: employeeRows,
    assets: assetRows,
    transfers: visibleCollection(db, user, "transfers"),
    tickets: visibleTickets,
    tasks: visibleTasks,
    contracts: visibleContracts,
    vendors: vendorRows,
    documents: documentRows,
    attachments: visibleCollection(db, user, "attachments"),
    comments: visibleCollection(db, user, "comments"),
    notifications: visibleCollection(db, user, "notifications"),
    knowledgeBase: visibleCollection(db, user, "knowledge_base"),
    announcements: db.announcements || [],
    formTemplates: visibleCollection(db, user, "form_templates"),
    lookupItems: visibleCollection(db, user, "lookup_items"),
    assignmentGroups: assignmentGroupRows,
    settings: {
      ticketAssignment: isItUser(db, user) ? ticketAssignmentSettings(db) : defaultTicketAssignmentSettings()
    },
    archiveCenter: archivedCollection(db, user),
    trashBin: trashCollection(db, user),
    auditLogs: visibleCollection(db, user, "audit_logs"),
    timeline: visibleCollection(db, user, "timeline"),
    lookups: { users, employees, departments, vendors, roles, assets, documents, assignmentGroups },
    dashboard: {
      openTickets: active(visibleTickets).filter((ticket) => !["closed", "resolved"].includes(ticket.status)).length,
      overdueTasks: active(visibleTasks).filter((task) => task.status === "overdue" || (task.dueDate && task.dueDate < "2026-06-14" && task.status !== "done")).length,
      expiringContracts: active(visibleContracts).filter((contract) => contract.renewalReminderDate && contract.renewalReminderDate <= "2026-07-14").length,
      assignedAssets: active(assetRows).filter((asset) => asset.currentOwnerId).length,
      alerts: [
        ...active(visibleTasks).filter((task) => task.status === "overdue").map((task) => ({ title: task.title, severity: "danger", module: "tasks", entityType: "tasks", entityId: task.id })),
        ...active(visibleContracts).filter((contract) => contract.status === "renewal_due").map((contract) => ({ title: contract.name, severity: "warning", module: "contracts", entityType: "contracts", entityId: contract.id })),
        ...active(assetRows).filter((asset) => ["lost", "damaged", "under_maintenance"].includes(asset.status)).map((asset) => ({ title: `${asset.assetNumber} ${asset.status}`, severity: "warning", module: "assets", entityType: "assets", entityId: asset.id }))
      ].slice(0, 6)
    }
  };
}

// `actor` is passed explicitly when there is no session yet - signing in is itself
// an audited action, and currentUser() is null at that moment.
function audit(db, req, action, entityType, entityId, oldValue, newValue, actor = null) {
  const user = actor || currentUser(db, req) || { id: "system", name: "System" };
  const createdAt = now();
  db.auditLogs.unshift({
    id: id("audit"),
    userId: user.id,
    action,
    entityType,
    entityId,
    oldValue,
    newValue,
    ipAddress: req.socket.remoteAddress,
    createdAt
  });
  db.timeline.unshift({
    id: id("tl"),
    title: `${action.replace("_", " ")} ${entityType}`,
    description: `${user.name} performed ${action} on ${entityType}.`,
    entityType,
    entityId,
    severity: action === "archive" ? "warning" : "info",
    actorUserId: user.id,
    createdAt
  });
}

function applyTransferSideEffects(db, transfer) {
  const asset = db.assets.find((item) => item.id === transfer.assetId);
  if (!asset) return;
  const action = String(transfer.movementType || transfer.action || "").toLowerCase();
  const toEmployee = transfer.toEmployeeId || transfer.toId || "";
  if (["assign", "assigned"].includes(action)) {
    asset.currentOwnerId = toEmployee || asset.currentOwnerId;
    asset.currentHolderId = asset.currentOwnerId;
    asset.currentHolderType = "Person";
    asset.currentHolderName = "";
    asset.permanentCustodianId = transfer.permanentCustodianId || asset.currentOwnerId;
    asset.status = "assigned";
  } else if (["transfer", "reassign", "reassigned"].includes(action)) {
    asset.currentOwnerId = toEmployee || asset.currentOwnerId;
    asset.currentHolderId = asset.currentOwnerId;
    asset.currentHolderType = "Person";
    asset.currentHolderName = "";
    asset.permanentCustodianId = transfer.permanentCustodianId || asset.currentOwnerId || asset.permanentCustodianId;
    asset.status = "assigned";
  } else if (["temporary custody", "temporary_custody"].includes(action)) {
    asset.previousHolderId = asset.currentHolderId || asset.currentOwnerId || "";
    asset.currentOwnerId = toEmployee || asset.currentOwnerId;
    asset.currentHolderId = asset.currentOwnerId;
    asset.currentHolderType = "Person";
    asset.currentHolderName = "";
    asset.permanentCustodianId = transfer.permanentCustodianId || asset.permanentCustodianId || asset.previousHolderId;
    asset.expectedReturnDate = transfer.expectedReturnDate || "";
    asset.status = "temporary_custody";
    asset.attention = "warning";
  } else if (["return", "returned", "added to inventory", "purchased"].includes(action)) {
    if (transfer.destination === "Previous Holder" && asset.previousHolderId) {
      asset.currentOwnerId = asset.previousHolderId;
      asset.currentHolderId = asset.previousHolderId;
      asset.currentHolderType = "Person";
      asset.currentHolderName = "";
      asset.permanentCustodianId = asset.permanentCustodianId || asset.previousHolderId;
      asset.status = "assigned";
    } else {
      asset.currentOwnerId = "";
      asset.currentHolderId = "";
      asset.currentHolderType = "IT Storage";
      asset.currentHolderName = transfer.toLocation || transfer.destination || transfer.to || "IT Storage";
      asset.permanentCustodianId = "";
      asset.status = "available";
    }
    asset.previousHolderId = "";
    asset.expectedReturnDate = "";
    asset.attention = "normal";
  } else if (["maintenance", "under maintenance", "repair"].includes(action)) {
    asset.currentHolderType = transfer.repairType === "Internal repair" ? "IT Storage" : "Vendor";
    asset.currentHolderName = transfer.toLocation || transfer.to || lookVendorName(db, transfer.vendorId) || transfer.repairType || "Repair";
    asset.estimatedReturnDate = transfer.estimatedReturnDate || "";
    asset.repairTicket = transfer.repairTicket || "";
    asset.status = "in_repair";
    asset.attention = "warning";
  } else if (action === "lost") {
    asset.status = "lost";
    asset.attention = "critical";
  } else if (action === "stolen") {
    asset.status = "stolen";
    asset.attention = "critical";
  } else if (action === "damaged") {
    asset.status = "in_repair";
    asset.attention = "warning";
  } else if (["retire", "retired"].includes(action)) {
    asset.status = "retired";
    asset.currentOwnerId = "";
    asset.currentHolderId = "";
  } else if (["dispose", "disposed"].includes(action)) {
    asset.status = "disposed";
    asset.currentOwnerId = "";
    asset.currentHolderId = "";
    asset.currentHolderType = "Other";
    asset.currentHolderName = transfer.disposedToName || transfer.to || "Disposed";
    asset.disposalReason = transfer.disposalReason || asset.disposalReason || "Other";
    asset.disposedToType = transfer.disposedToType || asset.disposedToType || "Other";
    asset.disposedToName = transfer.disposedToName || transfer.to || asset.disposedToName || "";
    asset.settlementStatus = transfer.settlementStatus || asset.settlementStatus || "Not Required";
    asset.settlementDate = transfer.settlementDate || asset.settlementDate || "";
    asset.disposalNotes = transfer.notes || asset.disposalNotes || "";
    asset.attention = "action_required";
  }
  if (!asset.attention) asset.attention = ["lost", "stolen"].includes(asset.status) ? "critical" : ["pending_return", "disposed"].includes(asset.status) ? "action_required" : ["temporary_custody", "in_repair"].includes(asset.status) ? "warning" : "normal";
  if (transfer.condition) asset.condition = transfer.condition;
  asset.updatedAt = now();
}

function transferTargetName(db, transfer) {
  return transfer.toEmployeeId ? db.employees.find((employee) => employee.id === transfer.toEmployeeId)?.name : transfer.to || transfer.toLocation || transfer.disposedToName || transfer.currentHolderName || "";
}

function transferTimelineTitle(db, transfer, asset) {
  const number = asset?.assetNumber || "Asset";
  const target = transferTargetName(db, transfer);
  const action = String(transfer.movementType || "").toLowerCase();
  if (["assign", "assigned"].includes(action)) return `${number} assigned to ${target || "employee"}`;
  if (["transfer", "reassign", "reassigned"].includes(action)) return `${number} transferred to ${target || "new holder"}`;
  if (action === "temporary custody") return `Temporary custody started with ${target || "temporary holder"}`;
  if (["return", "returned"].includes(action)) return `${number} returned to ${transfer.toLocation || transfer.destination || "IT Storage"}`;
  if (["repair", "maintenance", "under maintenance"].includes(action)) return `${number} sent to repair`;
  if (action === "lost") return `${number} marked lost`;
  if (action === "stolen") return `${number} marked stolen`;
  if (["dispose", "disposed"].includes(action)) return `${number} disposed${target ? ` to ${target}` : ""}`;
  return `${number} lifecycle updated`;
}

function recordTransferTimeline(db, req, transfer, asset) {
  const user = currentUser(db, req);
  db.timeline.unshift({
    id: id("tl"),
    title: transferTimelineTitle(db, transfer, asset),
    description: transfer.notes || transfer.reason || `${user.name} recorded ${transfer.movementType || "a lifecycle workflow"}.`,
    entityType: "asset",
    entityId: asset.id,
    severity: ["lost", "stolen", "dispose", "disposed"].includes(String(transfer.movementType || "").toLowerCase()) ? "danger" : asset.attention === "critical" ? "critical" : asset.attention === "warning" ? "warning" : "info",
    actorUserId: user.id,
    createdAt: now()
  });
}

function createAssetWorkflowDocument(db, req, transfer, asset) {
  if (!transfer.receiptType && !transfer.receiptName && !transfer.documentsText) return;
  const name = transfer.receiptName || `${transfer.movementType || "Asset"} document - ${asset.assetNumber || asset.id}`;
  const doc = {
    id: id("doc"),
    title: name,
    templateType: transfer.receiptType || "Asset lifecycle document",
    approvalStatus: "Draft",
    status: "generated",
    linkedType: "asset",
    linkedId: asset.id,
    notes: transfer.documentsText || transfer.notes || "",
    createdAt: now(),
    updatedAt: now()
  };
  db.documents.unshift(doc);
  audit(db, req, "generate_document", "documents", doc.id, null, doc);
}

function notifyAssetWorkflow(db, transfer, asset) {
  const action = String(transfer.movementType || "").toLowerCase();
  const employeeUser = userForEmployee(db, transfer.toEmployeeId || asset.currentOwnerId)?.id;
  if (employeeUser && ["assign", "assigned", "transfer", "reassign", "reassigned", "temporary custody"].includes(action)) {
    createNotification(db, { userIds: [employeeUser], category: "assets", type: "info", title: "Asset custody updated", body: `${asset.assetNumber || asset.id} is now in your custody.`, entityType: "asset", entityId: asset.id, force: true });
  }
  if (["repair", "maintenance", "under maintenance"].includes(action)) {
    createNotification(db, { roleIds: ["role_manager", "role_staff"], category: "assets", type: "warning", title: "Asset sent to repair", body: `${asset.assetNumber || asset.id} entered repair workflow.`, entityType: "asset", entityId: asset.id });
  }
  if (["lost", "stolen"].includes(action)) {
    createNotification(db, { roleIds: ["role_manager"], category: "assets", type: "critical", title: `Asset marked ${action}`, body: `${asset.assetNumber || asset.id} requires manager attention.`, entityType: "asset", entityId: asset.id });
  }
  if (["dispose", "disposed"].includes(action)) {
    createNotification(db, { roleIds: ["role_manager"], category: "assets", type: "warning", title: "Asset disposed", body: `${asset.assetNumber || asset.id} left company ownership.`, entityType: "asset", entityId: asset.id });
  }
}

function contractNumber(contract) {
  return contract.contractNumber || contract.number || `CON-${String(contract.id || "").replace(/\D/g, "").slice(-4).padStart(4, "0") || contract.id}`;
}

function recordContractWorkflow(db, req, contract, action, oldValue, message, severity = "info") {
  const user = currentUser(db, req);
  const createdAt = now();
  db.auditLogs.unshift({
    id: id("audit"),
    userId: user.id,
    action,
    entityType: "contracts",
    entityId: contract.id,
    oldValue,
    newValue: { ...contract },
    ipAddress: req.socket.remoteAddress,
    createdAt
  });
  db.timeline.unshift({
    id: id("tl"),
    title: message,
    description: `${user.name} recorded ${message.toLowerCase()} for ${contractNumber(contract)}.`,
    entityType: "contracts",
    entityId: contract.id,
    severity,
    actorUserId: user.id,
    createdAt
  });
}

function notifyContractWorkflow(db, contract, title, body, type = "info") {
  createNotification(db, {
    userIds: contractReminderRecipients(db, contract),
    category: "contracts",
    type,
    title,
    body,
    entityType: "contract",
    entityId: contract.id
  });
}

function applyContractWorkflow(db, req, contract, body) {
  const workflow = String(body.workflow || "").toLowerCase();
  const oldValue = { ...contract };
  if (workflow === "renew") {
    contract.renewalHistory = Array.isArray(contract.renewalHistory) ? contract.renewalHistory : [];
    contract.renewalHistory.unshift({
      title: "Contract renewed",
      previousStartDate: contract.startDate || "",
      previousEndDate: contract.endDate || "",
      newStartDate: body.newStartDate || contract.endDate || "",
      newEndDate: body.newEndDate,
      renewalCost: body.renewalCost || contract.cost || "",
      notes: body.notes || "",
      renewedBy: currentUser(db, req).id,
      date: now()
    });
    contract.startDate = body.newStartDate || contract.startDate;
    contract.endDate = body.newEndDate || contract.endDate;
    if (body.renewalCost) contract.cost = Number(body.renewalCost);
    contract.status = "renewed";
    contract.updatedAt = now();
    recordContractWorkflow(db, req, contract, "renew", oldValue, "Contract renewed", "success");
    notifyContractWorkflow(db, contract, "Contract renewed", `${contract.name} was renewed until ${contract.endDate}.`);
    return { ok: true };
  }
  if (workflow === "terminate") {
    contract.status = "terminated";
    contract.terminationDate = body.terminationDate || now().slice(0, 10);
    contract.terminationReason = body.reason || "";
    contract.updatedAt = now();
    recordContractWorkflow(db, req, contract, "terminate", oldValue, "Contract terminated", "warning");
    notifyContractWorkflow(db, contract, "Contract terminated", `${contract.name} was terminated.`, "warning");
    return { ok: true };
  }
  if (workflow === "upload_document") {
    const doc = {
      id: id("doc"),
      title: body.documentTitle || `Contract document - ${contractNumber(contract)}`,
      templateType: body.documentType || "Contract document",
      status: "uploaded",
      approvalStatus: "Draft",
      linkedType: "contract",
      linkedId: contract.id,
      fileName: body.fileName || "",
      notes: body.notes || "",
      version: 1,
      createdAt: now(),
      updatedAt: now()
    };
    db.documents.unshift(doc);
    contract.updatedAt = now();
    recordContractWorkflow(db, req, contract, "upload_document", oldValue, "Document uploaded", "info");
    audit(db, req, "create", "documents", doc.id, null, doc);
    return { ok: true, document: doc };
  }
  if (workflow === "link_assets") {
    const values = Array.isArray(body.assetIds) ? body.assetIds : [body.assetIds].filter(Boolean);
    contract.linkedAssetIds = [...new Set(values)];
    contract.updatedAt = now();
    recordContractWorkflow(db, req, contract, "link_assets", oldValue, "Linked asset updated", "info");
    return { ok: true };
  }
  if (workflow === "link_licenses") {
    contract.linkedLicenses = String(body.licensesText || "").split(/\r?\n|,/).map((item) => item.trim()).filter(Boolean);
    contract.updatedAt = now();
    recordContractWorkflow(db, req, contract, "link_licenses", oldValue, "Linked licenses updated", "info");
    return { ok: true };
  }
  if (workflow === "assign_owner") {
    contract.ownerEmployeeId = body.ownerEmployeeId || "";
    contract.ownerDepartmentId = body.ownerDepartmentId || contract.ownerDepartmentId || "";
    contract.updatedAt = now();
    recordContractWorkflow(db, req, contract, "assign_owner", oldValue, "Contract owner assigned", "info");
    notifyContractWorkflow(db, contract, "Contract owner assigned", `${contract.name} owner was updated.`);
    return { ok: true };
  }
  if (workflow === "request_approval") {
    contract.status = "pending_approval";
    contract.approvalNotes = body.approvalNotes || "";
    contract.updatedAt = now();
    recordContractWorkflow(db, req, contract, "request_approval", oldValue, "Renewal approval requested", "warning");
    notifyContractWorkflow(db, contract, "Contract approval requested", `${contract.name} is pending approval.`, "warning");
    return { ok: true };
  }
  return { error: "Unsupported contract workflow", status: 400 };
}

function vendorOwnerUserIds(db, vendor) {
  const owners = [vendor.ownerUserId, userForEmployee(db, vendor.ownerEmployeeId)?.id].filter(Boolean);
  return [...new Set(owners)];
}

function vendorWorkflowRecipients(db, vendor) {
  const managers = db.users.filter((user) => user.roleId === "role_manager" && user.status !== "inactive").map((user) => user.id);
  return [...new Set([...managers, ...vendorOwnerUserIds(db, vendor)])];
}

function recordVendorWorkflow(db, req, vendor, action, oldValue, message, severity = "info") {
  const user = currentUser(db, req);
  const createdAt = now();
  db.auditLogs.unshift({
    id: id("audit"),
    userId: user.id,
    action,
    entityType: "vendors",
    entityId: vendor.id,
    oldValue,
    newValue: { ...vendor },
    ipAddress: req.socket.remoteAddress,
    createdAt
  });
  db.timeline.unshift({
    id: id("tl"),
    title: message,
    description: `${user.name} recorded ${message.toLowerCase()} for ${vendor.name || vendor.id}.`,
    entityType: "vendors",
    entityId: vendor.id,
    severity,
    actorUserId: user.id,
    createdAt
  });
}

function notifyVendorWorkflow(db, vendor, title, body, type = "info") {
  createNotification(db, {
    userIds: vendorWorkflowRecipients(db, vendor),
    category: "vendors",
    type,
    title,
    body,
    entityType: "vendor",
    entityId: vendor.id
  });
}

function normalizeArray(value) {
  if (Array.isArray(value)) return value.filter(Boolean);
  return value ? [value] : [];
}

function applyVendorWorkflow(db, req, vendor, body) {
  const workflow = String(body.workflow || "").toLowerCase();
  const oldValue = { ...vendor, contacts: Array.isArray(vendor.contacts) ? vendor.contacts.map((item) => ({ ...item })) : vendor.contacts };
  if (workflow === "upload_document") {
    const doc = {
      id: id("doc"),
      title: body.documentTitle || `Vendor document - ${vendor.name}`,
      templateType: body.documentType || "Vendor document",
      status: "uploaded",
      approvalStatus: "Draft",
      linkedType: "vendor",
      linkedId: vendor.id,
      fileName: body.fileName || "",
      notes: body.notes || "",
      version: 1,
      createdAt: now(),
      updatedAt: now()
    };
    db.documents.unshift(doc);
    vendor.updatedAt = now();
    recordVendorWorkflow(db, req, vendor, "upload_document", oldValue, "Document uploaded", "info");
    audit(db, req, "create", "documents", doc.id, null, doc);
    notifyVendorWorkflow(db, vendor, "Vendor document uploaded", `${doc.title} was uploaded for ${vendor.name}.`);
    return { ok: true, document: doc };
  }
  if (workflow === "assign_owner") {
    vendor.ownerEmployeeId = body.ownerEmployeeId || "";
    vendor.ownerUserId = userForEmployee(db, vendor.ownerEmployeeId)?.id || vendor.ownerUserId || "";
    vendor.ownerNotes = body.notes || vendor.ownerNotes || "";
    vendor.updatedAt = now();
    recordVendorWorkflow(db, req, vendor, "assign_owner", oldValue, "Vendor owner assigned", "info");
    notifyVendorWorkflow(db, vendor, "Vendor owner assigned", `${vendor.name} owner was updated.`);
    return { ok: true };
  }
  if (workflow === "add_contact") {
    const flags = normalizeArray(body.flags);
    vendor.contacts = Array.isArray(vendor.contacts) ? vendor.contacts : [];
    if (flags.includes("primary")) vendor.contacts.forEach((contact) => contact.primary = false);
    const contact = {
      id: id("vcon"),
      name: body.name,
      title: body.title || "",
      department: body.department || "",
      email: body.email || "",
      phone: body.phone || "",
      mobile: body.mobile || "",
      extension: body.extension || "",
      primary: flags.includes("primary"),
      emergency: flags.includes("emergency"),
      preferredMethod: body.preferredMethod || "Email",
      supportHours: body.supportHours || vendor.supportHours || "",
      createdAt: now()
    };
    vendor.contacts.push(contact);
    if (contact.primary || !vendor.contactPerson) {
      vendor.contactPerson = contact.name;
      vendor.email = contact.email || vendor.email;
      vendor.phone = contact.phone || contact.mobile || vendor.phone;
    }
    vendor.updatedAt = now();
    recordVendorWorkflow(db, req, vendor, "add_contact", oldValue, "Contact updated", "info");
    notifyVendorWorkflow(db, vendor, "Vendor contact added", `${contact.name} was added to ${vendor.name}.`);
    return { ok: true, contact };
  }
  if (workflow === "promote_contact") {
    vendor.contacts = Array.isArray(vendor.contacts) ? vendor.contacts : [];
    const contact = vendor.contacts.find((item) => item.id === body.contactId);
    if (!contact) return { error: "Contact not found", status: 404 };
    vendor.contacts.forEach((item) => item.primary = false);
    contact.primary = true;
    vendor.contactPerson = contact.name || vendor.contactPerson;
    vendor.email = contact.email || vendor.email;
    vendor.phone = contact.phone || contact.mobile || vendor.phone;
    vendor.updatedAt = now();
    recordVendorWorkflow(db, req, vendor, "promote_contact", oldValue, "Contact updated", "info");
    notifyVendorWorkflow(db, vendor, "Vendor contact updated", `${vendor.name} primary contact was updated.`);
    return { ok: true };
  }
  if (workflow === "archive_contact") {
    vendor.contacts = Array.isArray(vendor.contacts) ? vendor.contacts : [];
    const contact = vendor.contacts.find((item) => item.id === body.contactId);
    if (!contact) return { error: "Contact not found", status: 404 };
    contact.archivedAt = now();
    contact.archiveReason = body.reason || "";
    vendor.updatedAt = now();
    recordVendorWorkflow(db, req, vendor, "archive_contact", oldValue, "Contact updated", "warning");
    notifyVendorWorkflow(db, vendor, "Vendor contact updated", `${contact.name || "A contact"} was archived for ${vendor.name}.`, "warning");
    return { ok: true };
  }
  if (workflow === "link_assets") {
    vendor.linkedAssetIds = [...new Set(normalizeArray(body.assetIds))];
    vendor.updatedAt = now();
    recordVendorWorkflow(db, req, vendor, "link_assets", oldValue, "Asset linked", "info");
    notifyVendorWorkflow(db, vendor, "Vendor asset linked", `${vendor.name} asset coverage was updated.`);
    return { ok: true };
  }
  if (workflow === "schedule_review") {
    vendor.nextReviewDate = body.reviewDate;
    vendor.reviewType = body.reviewType || "";
    vendor.reviewNotes = body.notes || "";
    vendor.updatedAt = now();
    recordVendorWorkflow(db, req, vendor, "schedule_review", oldValue, "Review scheduled", "info");
    notifyVendorWorkflow(db, vendor, "Vendor review scheduled", `${vendor.name} review is scheduled for ${vendor.nextReviewDate}.`);
    return { ok: true };
  }
  return { error: "Unsupported vendor workflow", status: 400 };
}

function knowledgeRecipients(db, article) {
  const owner = article.ownerId || article.ownerUserId || userForEmployee(db, article.ownerEmployeeId)?.id;
  const itUsers = db.users.filter((user) => ["role_manager", "role_staff"].includes(user.roleId) && user.status !== "inactive").map((user) => user.id);
  return [...new Set([owner, ...itUsers].filter(Boolean))];
}

function recordKnowledgeWorkflow(db, req, article, action, oldValue, message, severity = "info") {
  const user = currentUser(db, req);
  const createdAt = now();
  db.auditLogs.unshift({
    id: id("audit"),
    userId: user.id,
    action,
    entityType: "knowledge_base",
    entityId: article.id,
    oldValue,
    newValue: { ...article },
    ipAddress: req.socket.remoteAddress,
    createdAt
  });
  db.timeline.unshift({
    id: id("tl"),
    title: message,
    description: `${user.name} recorded ${message.toLowerCase()} for ${article.title || article.id}.`,
    entityType: "knowledge_base",
    entityId: article.id,
    severity,
    actorUserId: user.id,
    createdAt
  });
}

function notifyKnowledgeWorkflow(db, article, title, body, type = "info") {
  createNotification(db, {
    userIds: knowledgeRecipients(db, article),
    category: "knowledge_base",
    type,
    title,
    body,
    entityType: "knowledge_base",
    entityId: article.id,
    force: true
  });
}

function articleOwnerRecipients(db, article) {
  return [...new Set([article.ownerId, article.ownerUserId, article.reviewerId, ...db.users.filter((user) => user.roleId === "role_manager").map((user) => user.id)].filter(Boolean))];
}

function recordKnowledgeAnalytics(db, req, article, action, details = {}) {
  const user = currentUser(db, req);
  const oldValue = { ...article };
  article.analytics = article.analytics || {};
  article.uniqueReaderIds = Array.isArray(article.uniqueReaderIds) ? article.uniqueReaderIds : [];
  article.favoriteUserIds = Array.isArray(article.favoriteUserIds) ? article.favoriteUserIds : [];
  article.feedbackVotes = article.feedbackVotes || {};
  const version = article.version || "1.0";
  if (action === "view") {
    article.totalViews = Number(article.totalViews || article.views || article.viewCount || 0) + 1;
    article.views = article.totalViews;
    article.viewCount = article.totalViews;
    if (!article.uniqueReaderIds.includes(user.id)) article.uniqueReaderIds.push(user.id);
    article.lastViewedAt = now();
    article.recentReaders = [user.id, ...(article.recentReaders || []).filter((idValue) => idValue !== user.id)].slice(0, 25);
    if (article.totalViews >= 10 && !article.popularNotifiedAt) {
      article.popularNotifiedAt = now();
      createNotification(db, { userIds: articleOwnerRecipients(db, article), category: "knowledge_base", type: "info", title: "Knowledge article became popular", body: `${article.title} is being viewed frequently.`, entityType: "knowledge_base", entityId: article.id, force: true });
    }
  }
  if (action === "rate") {
    const vote = details.vote === "no" ? "no" : details.vote === "yes" ? "yes" : "";
    const existing = article.feedbackVotes[user.id]?.vote || "";
    if (existing === vote) delete article.feedbackVotes[user.id];
    else article.feedbackVotes[user.id] = { vote, version, comment: details.comment || "", createdAt: now() };
    article.helpfulYes = Object.values(article.feedbackVotes).filter((item) => item.vote === "yes").length;
    article.helpfulNo = Object.values(article.feedbackVotes).filter((item) => item.vote === "no").length;
    const total = article.helpfulYes + article.helpfulNo;
    article.helpfulPercent = total ? Math.round((article.helpfulYes / total) * 100) : 0;
    if (total >= 3 && article.helpfulPercent < 50 && !article.lowHelpfulNotifiedAt) {
      article.lowHelpfulNotifiedAt = now();
      createNotification(db, { userIds: articleOwnerRecipients(db, article), category: "knowledge_base", type: "warning", title: "Knowledge helpful score dropped", body: `${article.title} has a low helpful score.`, entityType: "knowledge_base", entityId: article.id, force: true });
    }
  }
  if (action === "favorite") {
    if (article.favoriteUserIds.includes(user.id)) article.favoriteUserIds = article.favoriteUserIds.filter((idValue) => idValue !== user.id);
    else article.favoriteUserIds.push(user.id);
    article.favoritesCount = article.favoriteUserIds.length;
  }
  if (action === "share") article.shareCount = Number(article.shareCount || 0) + 1;
  if (action === "print") article.printCount = Number(article.printCount || 0) + 1;
  if (action === "pdf_export") article.pdfExportCount = Number(article.pdfExportCount || 0) + 1;
  if (action === "ticket_created") article.ticketCreationCount = Number(article.ticketCreationCount || 0) + 1;
  if (action === "ticket_created" && Number(article.ticketCreationCount || 0) >= 5 && !article.ticketIncreaseNotifiedAt) {
    article.ticketIncreaseNotifiedAt = now();
    createNotification(db, { userIds: articleOwnerRecipients(db, article), category: "knowledge_base", type: "warning", title: "Knowledge linked tickets increased", body: `${article.title} is still generating support tickets.`, entityType: "knowledge_base", entityId: article.id, force: true });
  }
  if (action === "ticket_prevented") article.ticketPreventedCount = Number(article.ticketPreventedCount || 0) + 1;
  article.updatedAt = article.updatedAt || now();
  recordKnowledgeWorkflow(db, req, article, action, oldValue, `Article ${action.replace(/_/g, " ")}`, "info");
  return { ok: true, analytics: knowledgeAnalyticsSummary(article, user.id) };
}

function knowledgeAnalyticsSummary(article, userId = "") {
  const yes = Object.values(article.feedbackVotes || {}).filter((item) => item.vote === "yes").length || Number(article.helpfulYes || 0);
  const no = Object.values(article.feedbackVotes || {}).filter((item) => item.vote === "no").length || Number(article.helpfulNo || 0);
  return {
    totalViews: Number(article.totalViews || article.views || article.viewCount || 0),
    uniqueReaders: Array.isArray(article.uniqueReaderIds) ? article.uniqueReaderIds.length : 0,
    lastViewed: article.lastViewedAt || "",
    helpfulVotes: yes,
    notHelpfulVotes: no,
    helpfulPercent: yes + no ? Math.round((yes / (yes + no)) * 100) : 0,
    averageRating: yes + no ? Number(((yes * 5 + no * 1) / (yes + no)).toFixed(1)) : 0,
    favoritesCount: Array.isArray(article.favoriteUserIds) ? article.favoriteUserIds.length : Number(article.favoritesCount || 0),
    shareCount: Number(article.shareCount || 0),
    printCount: Number(article.printCount || 0),
    pdfExportCount: Number(article.pdfExportCount || 0),
    ticketCreationCount: Number(article.ticketCreationCount || 0),
    ticketPreventedCount: Number(article.ticketPreventedCount || 0),
    userVote: userId ? article.feedbackVotes?.[userId]?.vote || "" : "",
    favorite: userId ? (article.favoriteUserIds || []).includes(userId) : false
  };
}

function appendKnowledgeReview(article, actorId, action, notes = "") {
  article.reviewHistory = Array.isArray(article.reviewHistory) ? article.reviewHistory : [];
  article.reviewHistory.push({ id: id("kbr"), actorId, action, notes, createdAt: now() });
}

function resolveKnowledgeUser(db, value) {
  const needle = String(value || "").toLowerCase().trim();
  return db.users.find((user) => user.id === value || String(user.name || "").toLowerCase() === needle || String(user.username || "").toLowerCase() === needle || String(user.email || "").toLowerCase() === needle);
}

function knowledgeVersionValue(value) {
  const [major, minor] = String(value || "0.0").replace(/^v/i, "").split(".").map((part) => Number(part) || 0);
  return major * 1000 + minor;
}

function nextKnowledgeVersion(article, major = false) {
  const versions = Array.isArray(article.versionHistory) ? article.versionHistory : [];
  if (!versions.length && !article.publishedAt) return article.version || "1.0";
  const current = [article.version, ...versions.map((version) => version.versionNumber || version.version)].filter(Boolean).sort((a, b) => knowledgeVersionValue(b) - knowledgeVersionValue(a))[0] || "0.0";
  const [majorPart, minorPart] = String(current).replace(/^v/i, "").split(".").map((part) => Number(part) || 0);
  if (!majorPart && !minorPart) return "1.0";
  return major ? `${majorPart + 1}.0` : `${majorPart}.${minorPart + 1}`;
}

function createKnowledgeVersion(article, user, fields = {}) {
  article.versionHistory = Array.isArray(article.versionHistory) ? article.versionHistory : [];
  const versionNumber = fields.versionNumber || nextKnowledgeVersion(article, fields.majorVersion === true);
  const version = {
    id: id("kbv"),
    versionNumber,
    title: article.title || "Untitled article",
    bodyHtml: article.bodyHtml || "",
    body: article.body || "",
    authorId: fields.authorId || article.createdBy || user.id,
    publishDate: now(),
    reviewerId: fields.reviewerId || article.reviewerId || "",
    approvalDate: fields.approvalDate || article.approvalDate || "",
    changeSummary: fields.changeSummary || article.changeSummary || "",
    reasonForUpdate: fields.reasonForUpdate || article.reasonForUpdate || "",
    businessImpact: fields.businessImpact || article.businessImpact || "",
    riskLevel: fields.riskLevel || article.riskLevel || "",
    affectedSystems: fields.affectedSystems || article.affectedSystems || "",
    relatedIncident: fields.relatedIncident || article.relatedIncident || "",
    relatedTicketId: fields.relatedTicketId || article.relatedTicketId || "",
    status: fields.status || "Published"
  };
  article.versionHistory.push(version);
  article.version = versionNumber;
  return version;
}

function knowledgeVersionByIdServer(article, versionId) {
  const versions = Array.isArray(article.versionHistory) ? article.versionHistory : [];
  return versions.find((version) => version.id === versionId || version.versionNumber === versionId || `v${version.versionNumber}` === versionId);
}

function applyKnowledgeWorkflow(db, req, article, body) {
  const workflow = String(body.workflow || "").toLowerCase();
  const oldValue = { ...article };
  const user = currentUser(db, req);
  const managerOrAdmin = ["role_manager", "role_admin"].includes(user.roleId);
  if (["view", "rate", "favorite", "share", "print", "pdf_export", "ticket_prevented"].includes(workflow)) {
    if (user.roleId === "role_employee" && !(article.published === true || article.published === "true")) return { error: "Only published articles are available", status: 403 };
    const action = workflow === "rate" ? "rate" : workflow;
    return recordKnowledgeAnalytics(db, req, article, action, body);
  }
  if (workflow === "publish") {
    if (!managerOrAdmin) return { error: "Only IT Manager can publish articles", status: 403 };
    if (!body.changeSummary || !body.reasonForUpdate) return { error: "Change summary and reason are required", status: 400 };
    article.changeSummary = body.changeSummary;
    article.reasonForUpdate = body.reasonForUpdate;
    article.businessImpact = body.businessImpact || "";
    article.riskLevel = body.riskLevel || "Low";
    article.affectedSystems = body.affectedSystems || "";
    article.relatedIncident = body.relatedIncident || "";
    article.relatedTicketId = body.relatedTicketId || "";
    article.approverId = user.id;
    article.approvalDate = article.approvalDate || now();
    const version = createKnowledgeVersion(article, user, body);
    article.published = true;
    article.status = "Published";
    article.publishedAt = now();
    article.lastReviewDate = now().slice(0, 10);
    article.updatedAt = now();
    appendKnowledgeReview(article, user.id, "published", body.changeSummary);
    recordKnowledgeWorkflow(db, req, article, "version_created", oldValue, `Version ${version.versionNumber} created`, "success");
    recordKnowledgeWorkflow(db, req, article, "publish", oldValue, "Article published", "success");
    notifyKnowledgeWorkflow(db, article, "Article published", `${article.title} was published.`);
    return { ok: true };
  }
  if (workflow === "submit_review") {
    if (user.roleId === "role_employee") return { error: "Employees cannot submit knowledge articles", status: 403 };
    article.status = "In Review";
    article.published = false;
    article.reviewNotes = body.notes || "";
    article.submittedBy = user.id;
    article.submittedAt = now();
    article.updatedAt = now();
    appendKnowledgeReview(article, user.id, "submitted for review", body.notes || "");
    recordKnowledgeWorkflow(db, req, article, "submit_review", oldValue, "Article submitted for review", "warning");
    notifyKnowledgeWorkflow(db, article, "Article submitted for review", `${article.title} is in review.`, "warning");
    return { ok: true };
  }
  if (workflow === "assign_reviewer") {
    if (!managerOrAdmin) return { error: "Only IT Manager can assign reviewers", status: 403 };
    const reviewer = resolveKnowledgeUser(db, body.reviewerId || body.reviewerName);
    if (!reviewer || !["role_manager", "role_staff", "role_admin"].includes(reviewer.roleId)) return { error: "Reviewer must be an IT user", status: 400 };
    article.reviewerId = reviewer.id;
    article.reviewDeadline = body.reviewDeadline || "";
    article.status = article.status === "Draft" ? "In Review" : article.status;
    article.updatedAt = now();
    appendKnowledgeReview(article, user.id, "reviewer assigned", `${reviewer.name} assigned as reviewer.`);
    recordKnowledgeWorkflow(db, req, article, "assign_reviewer", oldValue, "Reviewer assigned", "info");
    createNotification(db, { userIds: [reviewer.id], category: "knowledge_base", type: "info", title: "Knowledge review assigned", body: `${article.title} was assigned to you for review.`, entityType: "knowledge_base", entityId: article.id, force: true });
    return { ok: true };
  }
  if (workflow === "approve") {
    if (!managerOrAdmin) return { error: "Only IT Manager can approve articles", status: 403 };
    article.status = "Approved";
    article.approverId = user.id;
    article.approvalDate = now();
    article.reviewDecisionNotes = body.notes || "";
    article.updatedAt = now();
    appendKnowledgeReview(article, user.id, "approved", body.notes || "");
    recordKnowledgeWorkflow(db, req, article, "approve", oldValue, "Article approved", "success");
    notifyKnowledgeWorkflow(db, article, "Article approved", `${article.title} was approved.`, "info");
    return { ok: true };
  }
  if (workflow === "request_changes") {
    if (!managerOrAdmin && article.reviewerId !== user.id) return { error: "Only the reviewer or IT Manager can request changes", status: 403 };
    article.status = "Changes Requested";
    article.reviewDecisionNotes = body.notes || "";
    article.updatedAt = now();
    appendKnowledgeReview(article, user.id, "changes requested", body.notes || "");
    recordKnowledgeWorkflow(db, req, article, "request_changes", oldValue, "Changes requested", "warning");
    notifyKnowledgeWorkflow(db, article, "Knowledge changes requested", `${article.title} needs changes before publishing.`, "warning");
    return { ok: true };
  }
  if (workflow === "reject") {
    if (!managerOrAdmin) return { error: "Only IT Manager can reject articles", status: 403 };
    article.status = "Rejected";
    article.rejectedBy = user.id;
    article.rejectedAt = now();
    article.rejectionReason = body.reason || "";
    article.updatedAt = now();
    appendKnowledgeReview(article, user.id, "rejected", body.reason || "");
    recordKnowledgeWorkflow(db, req, article, "reject", oldValue, "Article rejected", "warning");
    notifyKnowledgeWorkflow(db, article, "Article rejected", `${article.title} was rejected.`, "warning");
    return { ok: true };
  }
  if (workflow === "schedule_review") {
    if (!managerOrAdmin) return { error: "Only IT Manager can schedule reviews", status: 403 };
    article.nextReviewDate = body.nextReviewDate || article.nextReviewDate || "";
    article.reviewFrequency = body.reviewFrequency || article.reviewFrequency || "90 Days";
    article.customReviewDays = body.customReviewDays || "";
    article.reviewScheduleNotes = body.notes || "";
    article.updatedAt = now();
    appendKnowledgeReview(article, user.id, "review scheduled", body.notes || "");
    recordKnowledgeWorkflow(db, req, article, "schedule_review", oldValue, "Review scheduled", "info");
    notifyKnowledgeWorkflow(db, article, "Knowledge review scheduled", `${article.title} review is scheduled for ${article.nextReviewDate}.`);
    return { ok: true };
  }
  if (workflow === "restore_version") {
    if (!managerOrAdmin) return { error: "Only IT Manager can restore versions", status: 403 };
    const version = knowledgeVersionByIdServer(article, body.versionId);
    if (!version) return { error: "Version not found", status: 404 };
    article.title = version.title || article.title;
    article.bodyHtml = version.bodyHtml || article.bodyHtml || "";
    article.body = version.body || htmlToText(article.bodyHtml);
    article.changeSummary = body.changeSummary || `Restored version ${version.versionNumber}`;
    article.reasonForUpdate = body.reasonForUpdate || "Version restored";
    const restored = createKnowledgeVersion(article, user, { ...body, status: "Published" });
    article.published = true;
    article.status = "Published";
    article.publishedAt = now();
    article.updatedAt = now();
    appendKnowledgeReview(article, user.id, "version restored", `Restored v${version.versionNumber} as v${restored.versionNumber}.`);
    recordKnowledgeWorkflow(db, req, article, "restore_version", oldValue, "Version restored", "success");
    notifyKnowledgeWorkflow(db, article, "Knowledge version restored", `${article.title} was restored as version ${restored.versionNumber}.`);
    return { ok: true };
  }
  if (workflow === "archive") {
    if (!managerOrAdmin) return { error: "Only IT Manager can archive articles", status: 403 };
    article.archivedAt = now();
    article.status = "Archived";
    article.archiveReason = body.reason || "";
    article.updatedAt = now();
    appendKnowledgeReview(article, user.id, "archived", body.reason || "");
    recordKnowledgeWorkflow(db, req, article, "archive", oldValue, "Article archived", "warning");
    notifyKnowledgeWorkflow(db, article, "Article archived", `${article.title} was archived.`, "warning");
    return { ok: true };
  }
  if (workflow === "export") {
    if (String(body.format || "").toLowerCase().includes("pdf")) recordKnowledgeAnalytics(db, req, article, "pdf_export", body);
    recordKnowledgeWorkflow(db, req, article, "export", oldValue, `Content exported as ${body.format || "file"}`, "info");
    return { ok: true };
  }
  if (workflow === "duplicate") {
    const copy = {
      ...article,
      id: id("kb"),
      title: body.title || `${article.title || "Article"} copy`,
      published: false,
      status: "Draft",
      version: "1.0",
      versionHistory: [],
      reviewHistory: [],
      viewCount: 0,
      views: 0,
      createdAt: now(),
      updatedAt: now(),
      archivedAt: undefined,
      deletedAt: undefined
    };
    db.knowledgeBase.unshift(copy);
    recordKnowledgeWorkflow(db, req, copy, "create", null, "Article created", "info");
    return { ok: true, article: copy };
  }
  if (workflow === "move_category") {
    article.category = body.category || article.category;
    article.updatedAt = now();
    recordKnowledgeWorkflow(db, req, article, "category_change", oldValue, "Category changed", "info");
    notifyKnowledgeWorkflow(db, article, "Knowledge category changed", `${article.title} moved to ${article.category}.`);
    return { ok: true };
  }
  if (workflow === "upload_attachment") {
    const attachment = {
      id: id("att"),
      entityType: "knowledge_base",
      entityId: article.id,
      filename: body.filename || "knowledge-attachment.pdf",
      mimeType: body.mimeType || "application/pdf",
      size: Number(body.size || 0),
      uploaderId: currentUser(db, req).id,
      uploadedAt: now(),
      createdAt: now(),
      updatedAt: now()
    };
    db.attachments.unshift(attachment);
    article.updatedAt = now();
    recordKnowledgeWorkflow(db, req, article, "attachment", oldValue, "Attachment uploaded", "info");
    audit(db, req, "upload", "attachments", attachment.id, null, attachment);
    notifyKnowledgeWorkflow(db, article, "Knowledge attachment uploaded", `${attachment.filename} was uploaded to ${article.title}.`);
    return { ok: true, attachment };
  }
  if (workflow === "link_asset") {
    article.assetIds = normalizeArray(body.assetIds);
    article.updatedAt = now();
    recordKnowledgeWorkflow(db, req, article, "link_asset", oldValue, "Article updated", "info");
    return { ok: true };
  }
  if (workflow === "link_vendor") {
    article.vendorIds = normalizeArray(body.vendorIds);
    article.updatedAt = now();
    recordKnowledgeWorkflow(db, req, article, "link_vendor", oldValue, "Article updated", "info");
    return { ok: true };
  }
  if (workflow === "link_contract") {
    article.contractIds = normalizeArray(body.contractIds);
    article.updatedAt = now();
    recordKnowledgeWorkflow(db, req, article, "link_contract", oldValue, "Article updated", "info");
    return { ok: true };
  }
  return { error: "Unsupported knowledge workflow", status: 400 };
}

function htmlToText(value) {
  return String(value || "").replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ");
}

function knowledgeSearchKeywords(article, body = {}) {
  const html = body.bodyHtml || article.bodyHtml || "";
  const headings = [...String(html).matchAll(/<h[1-3][^>]*>(.*?)<\/h[1-3]>/gi)].map((match) => htmlToText(match[1]));
  const tags = Array.isArray(article.tags) ? article.tags.join(" ") : article.tagsText || article.tags || "";
  const text = [article.title, article.category, tags, article.keywords, headings.join(" "), body.body || article.body, htmlToText(html)].join(" ").toLowerCase();
  return [...new Set(text.replace(/[^\w\s-]/g, " ").split(/\s+/).filter((word) => word.length > 2))].slice(0, 80).join(", ");
}

function knowledgeReadingTimeLabel(text) {
  const words = String(text || "").trim().split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.ceil(words / 180))} min read`;
}

function nextRecordNumber(db, collectionName, field, prefix) {
  const used = new Set((db[collectionName] || []).map((row) => String(row[field] || "").trim()).filter(Boolean));
  let max = 0;
  for (const value of used) {
    const match = value.match(/(\d+)$/);
    if (match) max = Math.max(max, Number(match[1]));
  }
  let candidate = "";
  do {
    max += 1;
    candidate = `${prefix}-${String(max).padStart(4, "0")}`;
  } while (used.has(candidate));
  return candidate;
}

function normalizeEmployeeNo(value) {
  return String(value ?? "").trim().toLowerCase();
}

function normalizeUsername(value) {
  return String(value || "").trim().toLowerCase();
}

// Shared fallback when the form did not send an explicit account type. The
// meaningful distinction is whether the account belongs to a real person, so
// both creation paths resolve it the same way.
function resolveAccountType(db, payload, hasLinkedPerson) {
  if (payload.accountType) return payload.accountType;
  if (!hasLinkedPerson) return "Service";
  return accountTypeForRole(db, payload.roleId, payload.expiryDate);
}

function accountTypeForRole(db, roleId, expiryDate = "") {
  if (expiryDate) return "Temporary";
  const roleName = String(db.roles.find((role) => role.id === roleId)?.name || "").toLowerCase();
  if (roleName.includes("staff")) return "Employee";
  if (roleName.includes("manager")) return "Employee";
  if (roleName.includes("admin")) return "Employee";
  return "Employee";
}

function validateAccountPayload(db, payload, existingId = "") {
  const username = normalizeUsername(payload.username);
  if (!username) return { error: "Username is required", status: 400 };
  if (!payload.roleId || !db.roles.some((role) => role.id === payload.roleId)) return { error: "Role is required", status: 400 };
  if (db.users.some((user) => user.id !== existingId && normalizeUsername(user.username) === username)) return { error: "Username already exists", status: 409 };
  if (payload.email && db.users.some((user) => user.id !== existingId && user.email && user.email.toLowerCase() === String(payload.email).toLowerCase())) return { error: "Email already exists", status: 409 };
  return { username };
}

function createLinkedUserAccount(db, req, person, payload) {
  if (userForEmployee(db, person.id)) return { error: "This person already has a login account", status: 409 };
  const validation = validateAccountPayload(db, payload);
  if (validation.error) return validation;
  if (!String(payload.temporaryPassword || payload.password || "").trim()) return { error: "Temporary password is required", status: 400 };
  // Same field set, order and defaults as prepareUserAccountBody(), so an
  // account created from a Person is indistinguishable from one created in the
  // New Service Account modal.
  const user = {
    id: id("user"),
    name: String(payload.name || person.name || "").trim(),
    username: validation.username,
    email: String(payload.email || person.email || "").trim(),
    password: String(payload.temporaryPassword || payload.password),
    roleId: payload.roleId,
    status: payload.status || "active",
    accountType: resolveAccountType(db, payload, true),
    employeeId: person.id,
    expiryDate: String(payload.expiryDate || ""),
    requirePasswordChange: payload.requirePasswordChange !== false,
    createdAt: now(),
    updatedAt: now(),
    notificationPreferences: defaultNotificationPreferences({ roleId: payload.roleId })
  };
  db.users.unshift(user);
  audit(db, req, "create", "users", user.id, null, { ...user, password: "***" });
  return { user };
}

function prepareUserAccountBody(db, body) {
  const next = { ...body };
  const validation = validateAccountPayload(db, next);
  if (validation.error) return validation;
  if (!String(next.password || "").trim()) return { error: "Password is required", status: 400 };
  next.name = String(next.name || "").trim();
  next.username = validation.username;
  next.email = String(next.email || "").trim();
  next.status = next.status || "active";
  next.accountType = resolveAccountType(db, next, Boolean(next.employeeId));
  next.employeeId = String(next.employeeId || "");
  next.expiryDate = String(next.expiryDate || "");
  // Was Boolean(...), which defaulted to false here while the Person path
  // defaulted to true — the same checkbox produced opposite stored values.
  next.requirePasswordChange = next.requirePasswordChange !== false;
  next.notificationPreferences = defaultNotificationPreferences({ roleId: next.roleId });
  return { body: next };
}

function personHasLinkedRecords(db, person) {
  const account = userForEmployee(db, person.id);
  return db.assets.some((asset) => asset.currentOwnerId === person.id)
    || db.tickets.some((ticket) => ticket.requesterId === person.id)
    || db.tasks.some((task) => task.ownerId === account?.id || task.relatedId === person.id)
    || db.documents.some((doc) => doc.linkedType === "employee" && doc.linkedId === person.id)
    || db.transfers.some((transfer) => transfer.toEmployeeId === person.id || transfer.fromEmployeeId === person.id)
    || db.contracts.some((contract) => contract.ownerEmployeeId === person.id || contract.requesterId === person.id);
}

function prepareCreateBody(db, user, resource, body) {
  const next = { ...body };
  if (resource === "users") {
    return prepareUserAccountBody(db, next);
  }
  if (resource === "employees") {
    next.personType = next.personType || "Employee";
  }
  if (resource === "tickets") {
    const actorEmployee = employeeForUser(db, user);
    if (!isItUser(db, user)) {
      if (!actorEmployee) return { error: "Employee profile not found", status: 403 };
      next.requesterId = actorEmployee.id;
      next.status = next.status || "open";
    } else {
      // IT Staff, IT Manager and System Admin may open a ticket on behalf of an employee.
      const requester = (db.employees || []).find((employee) => employee.id === next.requesterId);
      if (!requester) return { error: "Requester is required", status: 400 };
      if (requester.archivedAt || requester.deletedAt) return { error: "Requester is not an active employee", status: 400 };
      if (String(requester.status || "active").toLowerCase() !== "active") return { error: "Requester is not an active employee", status: 400 };
    }
    next.createdById = user.id;
    next.onBehalf = Boolean(isItUser(db, user) && next.requesterId && next.requesterId !== actorEmployee?.id);
    if (!applyTicketCategory(db, next)) return { error: "Unsupported ticket category", status: 400 };
    if (!String(next.ticketNumber || "").trim()) next.ticketNumber = nextRecordNumber(db, "tickets", "ticketNumber", "TCK");
    if (db.tickets.some((ticket) => String(ticket.ticketNumber || "").toLowerCase() === String(next.ticketNumber).toLowerCase())) {
      return { error: "Ticket number already exists", status: 409 };
    }
    next.status = String(next.status || "open").toLowerCase();
    if (!validTicketStatuses.has(next.status)) return { error: "Unsupported ticket status", status: 400 };
    if (isItUser(db, user) && next.status === "waiting" && !next.waitingReason) return { error: "Waiting reason is required", status: 400 };
    if (isItUser(db, user) && next.status === "cancelled" && !next.cancelReason) return { error: "Cancel reason is required", status: 400 };
    if (!isItUser(db, user) && (next.waitingReason || next.cancelReason)) return { error: "Forbidden", status: 403 };
    if (next.waitingReason && !validWaitingReasons.has(next.waitingReason)) return { error: "Unsupported waiting reason", status: 400 };
    if (next.cancelReason && !validCancelReasons.has(next.cancelReason)) return { error: "Unsupported cancel reason", status: 400 };
  }
  if (resource === "assets") {
    if (!String(next.assetNumber || "").trim()) next.assetNumber = nextRecordNumber(db, "assets", "assetNumber", "AST");
    if (db.assets.some((asset) => String(asset.assetNumber || "").toLowerCase() === String(next.assetNumber).toLowerCase())) {
      return { error: "Asset number already exists", status: 409 };
    }
    next.status = next.status || "available";
    next.attention = next.attention || (["lost", "stolen"].includes(next.status) ? "critical" : ["pending_return", "disposed"].includes(next.status) ? "action_required" : ["temporary_custody", "in_repair", "under_maintenance"].includes(next.status) ? "warning" : "normal");
    next.permanentCustodianId = next.permanentCustodianId || next.currentOwnerId || "";
    next.currentHolderType = next.currentHolderType || (next.currentOwnerId ? "Person" : "IT Storage");
    next.currentHolderId = next.currentHolderType === "Person" ? next.currentOwnerId || "" : "";
    if (next.status === "disposed" && next.currentOwnerId) return { error: "Disposed assets cannot be assigned", status: 400 };
  }
  if (resource === "tasks") {
    next.createdBy = next.createdBy || user.id;
    if (!isItUser(db, user)) {
      next.ownerId = user.id;
      next.assignedToId = user.id;
      next.scope = "personal";
      next.taskType = "Personal";
      next.status = next.status || "Pending";
      next.priority = next.priority || "Medium";
      next.category = next.category || "Other";
      next.recurrence = next.recurrence || "One time";
      next.reminderAt = "";
      next.notificationPreference = "none";
      next.calendarSync = false;
      next.outlookSync = false;
      next.emailIntegration = false;
    }
  }
  return { body: next };
}

function serveStatic(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const filePath = url.pathname === "/" ? path.join(PUBLIC, "index.html") : path.join(PUBLIC, url.pathname);
  const safePath = path.normalize(filePath);
  if (!safePath.startsWith(PUBLIC)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }
  fs.readFile(safePath, (err, data) => {
    if (err) {
      if (path.extname(safePath)) {
        res.writeHead(404);
        res.end("Not found");
        return;
      }
      fs.readFile(path.join(PUBLIC, "index.html"), (fallbackErr, fallbackData) => {
        if (fallbackErr) {
          res.writeHead(404);
          res.end("Not found");
          return;
        }
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(fallbackData);
      });
      return;
    }
    const ext = path.extname(safePath);
    const type = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript", ".svg": "image/svg+xml" }[ext] || "application/octet-stream";
    res.writeHead(200, { "Content-Type": type });
    res.end(data);
  });
}

async function handleApi(req, res) {
  const db = readDb();
  const expiredAccountsChanged = disableExpiredAccounts(db);
  const contractNotificationsChanged = ensureContractExpirationNotifications(db);
  const taskNotificationsChanged = ensureTaskDeadlineNotifications(db);
  const operationalTicketNotificationsChanged = ensureOperationalTicketNotifications(db);
  const knowledgeReviewNotificationsChanged = ensureKnowledgeReviewNotifications(db);
  if (expiredAccountsChanged || contractNotificationsChanged || taskNotificationsChanged || operationalTicketNotificationsChanged || knowledgeReviewNotificationsChanged) writeDb(db);
  const user = currentUser(db, req);
  const url = new URL(req.url, `http://${req.headers.host}`);
  const parts = url.pathname.split("/").filter(Boolean);
  const resource = parts[1];
  const resourceId = parts[2];
  const action = parts[3];

  if (await handleAuthRoutes(db, req, res, resource, resourceId)) return;

  // Every remaining endpoint requires a real session. There is no anonymous access
  // and no way for a client to assert an identity.
  if (!user) return send(res, 401, { error: "Authentication required" });

  // --- People Excel import / export -------------------------------------
  if (req.method === "GET" && resource === "employees" && resourceId === "export") {
    if (!can(db, user, "employees", "view")) return send(res, 403, { error: "Forbidden" });
    const file = buildPeopleExport(db);
    res.writeHead(200, {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="people-${new Date().toISOString().slice(0, 10)}.xlsx"`,
      "Content-Length": file.length
    });
    return res.end(file);
  }

  if (req.method === "POST" && resource === "employees" && resourceId === "import") {
    if (!can(db, user, "employees", "create")) return send(res, 403, { error: "Forbidden" });
    const body = await readBody(req);
    if (!body.fileBase64) return send(res, 400, { error: "No file received" });
    let analysis;
    try {
      analysis = analysePeopleImport(db, Buffer.from(String(body.fileBase64), "base64"));
    } catch (error) {
      return send(res, 400, { error: error.message || "Could not read the workbook" });
    }
    if (body.preview) {
      return send(res, 200, {
        preview: true,
        summary: analysis.summary,
        problems: analysis.problems.slice(0, 20),
        sample: analysis.rows.slice(0, 5).map((row) => ({
          employeeNo: row.employeeNo, name: row.name, department: row.department,
          jobTitle: row.jobTitle, email: row.email, action: row.__existingId ? "update" : "create"
        }))
      });
    }
    if (!analysis.rows.length) return send(res, 400, { error: "Nothing to import" });
    const result = applyPeopleImport(db, analysis, { newId: id, now });
    audit(db, req, "import", "employees", "bulk", null, result);
    writeDb(db);
    return send(res, 200, { imported: true, ...result, summary: analysis.summary });
  }

  if (req.method === "GET" && resource === "state") {
    return send(res, 200, enrich(db, user));
  }

  if (req.method === "PATCH" && resource === "preferences" && resourceId === "notifications") {
    const body = await readBody(req);
    const allowed = new Set(["tickets", "tasks", "assets", "contracts", "vendors"]);
    if (Object.keys(body).some((key) => !allowed.has(key) || typeof body[key] !== "boolean")) return send(res, 400, { error: "Invalid notification preferences" });
    const oldValue = { ...(user.notificationPreferences || {}) };
    user.notificationPreferences = { ...notificationPreferences(user), ...body };
    audit(db, req, "update", "users", user.id, oldValue, { notificationPreferences: user.notificationPreferences });
    writeDb(db);
    return send(res, 200, { notificationPreferences: user.notificationPreferences });
  }

  // Attachment bytes are served here rather than shipped inside /api/state.
  if (req.method === "GET" && resource === "attachments" && resourceId && action === "download") {
    const row = (db.attachments || []).find((item) => item.id === resourceId);
    if (!row) return send(res, 404, { error: "Attachment not found" });
    if (!canAccessEntity(db, user, row.entityType, row.entityId)) return send(res, 403, { error: "Forbidden" });
    if (row.internal && !isItUser(db, user)) return send(res, 403, { error: "Forbidden" });
    const buffer = readAttachmentFile(row);
    if (!buffer) return send(res, 404, { error: "Attachment file is missing" });
    res.writeHead(200, {
      "Content-Type": row.mimeType || "application/octet-stream",
      // Always an attachment: never render user-supplied files inline.
      "Content-Disposition": `attachment; filename="${path.basename(String(row.filename || row.id)).replace(/"/g, "")}"`,
      "Content-Length": buffer.length,
      "X-Content-Type-Options": "nosniff"
    });
    return res.end(buffer);
  }

  if (req.method === "POST" && resource === "attachments") {
    if (!can(db, user, "attachments", "create")) return send(res, 403, { error: "Forbidden" });
    const body = await readBody(req);
    const allowed = isItUser(db, user) ? canAccessEntity(db, user, body.entityType, body.entityId) : canEmployeeCreateAttachment(db, user, body.entityType, body.entityId);
    if (!allowed) return send(res, 403, { error: "Forbidden" });
    // Refuse orphans: an attachment must hang off a record that actually exists.
    if (!attachmentParentExists(db, body.entityType, body.entityId)) {
      return send(res, 400, { error: "The record this attachment belongs to was not found" });
    }
    const content = String(body.content || "");
    if (Buffer.byteLength(content, "utf8") > MAX_UPLOAD_BYTES) {
      return send(res, 413, { error: `Attachments are limited to ${Math.floor(MAX_UPLOAD_BYTES / 1048576)} MB` });
    }
    const row = { id: id("att"), ...body, uploaderId: user.id, uploadedAt: now(), createdAt: now(), updatedAt: now() };
    // The bytes go to disk; the record keeps only a pointer.
    delete row.content;
    if (content) {
      const stored = writeAttachmentFile(row.id, content);
      row.storagePath = stored.name;
      row.size = stored.bytes;
    }
    db.attachments.unshift(row);
    const parentType = singularResource(body.entityType);
    audit(db, req, "upload", parentType === "ticket" ? "tickets" : "attachments", parentType === "ticket" ? row.entityId : row.id, null, row);
    if (parentType === "knowledge_base") {
      const article = db.knowledgeBase.find((item) => item.id === row.entityId);
      if (article) {
        recordKnowledgeWorkflow(db, req, article, "attachment", { ...article }, "Attachment uploaded", "info");
        notifyKnowledgeWorkflow(db, article, "Knowledge attachment uploaded", `${row.filename} was uploaded to ${article.title}.`);
      }
    }
    writeDb(db);
    return send(res, 201, row);
  }

  if (req.method === "POST" && resource === "comments") {
    if (!can(db, user, "comments", "create")) return send(res, 403, { error: "Forbidden" });
    const body = await readBody(req);
    const allowed = isItUser(db, user) ? canAccessEntity(db, user, body.entityType, body.entityId) : canEmployeeCreateComment(db, user, body.entityType, body.entityId);
    if (!allowed) return send(res, 403, { error: "Forbidden" });
    if (body.internal && !isItUser(db, user)) return send(res, 403, { error: "Internal notes are restricted to IT users" });
    const mentions = String(body.body || "").match(/@\w[\w\s.-]*/g) || [];
    const row = { id: id("com"), parentId: body.parentId || "", ...body, entityType: singularResource(body.entityType), mentions, authorId: user.id, createdAt: now(), updatedAt: now() };
    db.comments.unshift(row);
    const ticket = row.entityType === "ticket" ? db.tickets.find((item) => item.id === row.entityId) : null;
    if (ticket && !row.internal) {
      const employeeRecipient = isItUser(db, user) ? userForEmployee(db, ticket.requesterId)?.id : "";
      const staffRecipients = mentionedStaffIds(db, body.body);
      createNotification(db, {
      userIds: [employeeRecipient, ...staffRecipients].filter((idValue) => idValue && idValue !== user.id), category: "tickets", type: "info", title: "Comment added",
      body: `${user.name} commented on ${ticket.ticketNumber}.`, entityType: "ticket", entityId: ticket.id
      });
    }
    audit(db, req, "comment", row.entityType || "comments", row.entityId, null, row);
    if (row.entityType === "knowledge_base") {
      const article = db.knowledgeBase.find((item) => item.id === row.entityId);
      if (article) {
        db.timeline.unshift({
          id: id("tl"),
          title: "Comment added",
          description: `${user.name} added an internal comment to ${article.title}.`,
          entityType: "knowledge_base",
          entityId: article.id,
          severity: "info",
          actorUserId: user.id,
          createdAt: now()
        });
        notifyKnowledgeWorkflow(db, article, "Knowledge comment added", `${user.name} commented on ${article.title}.`);
      }
    }
    writeDb(db);
    return send(res, 201, row);
  }

  if (req.method === "PATCH" && resource === "notifications" && resourceId === "read-all") {
    if (!can(db, user, "notifications", "view")) return send(res, 403, { error: "Forbidden" });
    for (const notification of db.notifications) {
      if (notificationVisibleToUser(db, user, notification)) notification.unread = false;
    }
    writeDb(db);
    return send(res, 200, { ok: true });
  }

  if (req.method === "PATCH" && resource === "notifications" && resourceId && action === "read") {
    const notification = db.notifications.find((item) => item.id === resourceId);
    if (!notification) return send(res, 404, { error: "Not found" });
    if (!notificationVisibleToUser(db, user, notification)) return send(res, 403, { error: "Forbidden" });
    notification.unread = false;
    writeDb(db);
    return send(res, 200, notification);
  }

  if (req.method === "DELETE" && resource === "notifications" && resourceId) {
    const index = db.notifications.findIndex((item) => item.id === resourceId);
    const notification = db.notifications[index];
    if (!notification) return send(res, 404, { error: "Not found" });
    if (!notificationVisibleToUser(db, user, notification)) return send(res, 403, { error: "Forbidden" });
    db.notifications.splice(index, 1);
    writeDb(db);
    return send(res, 200, { ok: true });
  }

  if (req.method === "GET" && resource === "people" && resourceId) {
    if (!can(db, user, "employees", "view")) return send(res, 403, { error: "Forbidden" });
    const person = db.employees.find((item) => item.id === resourceId);
    if (!person) return send(res, 404, { error: "Not found" });
    if (!canAccessResourceRow(db, user, "employees", person)) return send(res, 403, { error: "Forbidden" });
    return send(res, 200, isItUser(db, user) ? person : stripInternal(person));
  }

  if (req.method === "POST" && resource === "people" && resourceId && action === "account") {
    if (!can(db, user, "employees", "edit") || !can(db, user, "users", "create")) return send(res, 403, { error: "Forbidden" });
    const person = db.employees.find((item) => item.id === resourceId);
    if (!person) return send(res, 404, { error: "Not found" });
    if (!canAccessResourceRow(db, user, "employees", person)) return send(res, 403, { error: "Forbidden" });
    const body = await readBody(req);
    const created = createLinkedUserAccount(db, req, person, body);
    if (created.error) return send(res, created.status || 400, { error: created.error });
    person.updatedAt = now();
    audit(db, req, "link_account", "employees", person.id, null, { userId: created.user.id });
    writeDb(db);
    return send(res, 201, stripInternal(created.user));
  }

  if (req.method === "PATCH" && resource === "contracts" && resourceId && action === "workflow") {
    if (!can(db, user, "contracts", "edit")) return send(res, 403, { error: "Forbidden" });
    const contract = db.contracts.find((item) => item.id === resourceId);
    if (!contract) return send(res, 404, { error: "Not found" });
    if (!canAccessResourceRow(db, user, "contracts", contract)) return send(res, 403, { error: "Forbidden" });
    const body = await readBody(req);
    const result = applyContractWorkflow(db, req, contract, body);
    if (result.error) return send(res, result.status || 400, { error: result.error });
    writeDb(db);
    return send(res, 200, result);
  }

  if (req.method === "PATCH" && resource === "vendors" && resourceId && action === "workflow") {
    if (!can(db, user, "vendors", "edit")) return send(res, 403, { error: "Forbidden" });
    const vendor = db.vendors.find((item) => item.id === resourceId);
    if (!vendor) return send(res, 404, { error: "Not found" });
    if (!canAccessResourceRow(db, user, "vendors", vendor)) return send(res, 403, { error: "Forbidden" });
    const body = await readBody(req);
    const result = applyVendorWorkflow(db, req, vendor, body);
    if (result.error) return send(res, result.status || 400, { error: result.error });
    writeDb(db);
    return send(res, 200, result);
  }

  if (req.method === "PATCH" && resource === "tasks" && resourceId && action === "workflow") {
    const task = db.tasks.find((item) => item.id === resourceId);
    if (!task) return send(res, 404, { error: "Not found" });
    if (!canAccessResourceRow(db, user, "tasks", task)) return send(res, 403, { error: "Forbidden" });
    if (!can(db, user, "tasks", "edit")) return send(res, 403, { error: "Forbidden" });
    const body = await readBody(req);
    const workflow = String(body.workflow || "").toLowerCase();
    const oldValue = { ...task };
    if (workflow === "assign") {
      if (!body.assignedToId) return send(res, 400, { error: "Assigned user is required" });
      if (!db.users.some((candidate) => candidate.id === body.assignedToId)) return send(res, 400, { error: "Assigned user was not found" });
      task.assignedToId = body.assignedToId;
      if (body.ownerId) task.ownerId = body.ownerId;
      if (body.notes) task.notes = [task.notes, body.notes].filter(Boolean).join("\n\n");
      task.updatedAt = now();
      taskAudit(db, req, "assign", task, oldValue, `Assigned to ${lookUserName(db, task.assignedToId)}`);
      createNotification(db, { userIds: [task.assignedToId].filter((idValue) => idValue && idValue !== user.id), category: "tasks", type: "info", title: "Task assigned", body: `${task.title || "A task"} was assigned to you.`, entityType: "task", entityId: task.id });
      writeDb(db);
      return send(res, 200, task);
    }
    if (["start", "pause", "complete", "cancel"].includes(workflow)) {
      const nextStatus = normalizeTaskStatus(body.status || ({ start: "in_progress", pause: "waiting", complete: "completed", cancel: "cancelled" }[workflow]));
      const currentStatus = normalizeTaskStatus(task.status);
      if (!validTaskStatuses.has(nextStatus)) return send(res, 400, { error: "Unsupported task status" });
      if (nextStatus !== currentStatus && !taskTransitions[currentStatus]?.has(nextStatus)) return send(res, 409, { error: `Invalid task status transition: ${currentStatus} to ${nextStatus}` });
      task.status = nextStatus;
      if (nextStatus === "in_progress" && !task.startedAt) task.startedAt = now();
      if (nextStatus === "completed") {
        task.completedAt = now();
        task.progress = 100;
      }
      if (nextStatus === "cancelled") task.cancelledAt = now();
      task.updatedAt = now();
      taskAudit(db, req, nextStatus === "completed" ? "complete" : nextStatus === "cancelled" ? "cancel" : "status_change", task, oldValue, `Status changed to ${nextStatus.replace(/_/g, " ")}`);
      const notifyTitle = nextStatus === "completed" ? "Task completed" : nextStatus === "cancelled" ? "Task cancelled" : "Task status changed";
      createNotification(db, { userIds: taskRecipients(db, task).filter((idValue) => idValue !== user.id), category: "tasks", type: nextStatus === "cancelled" ? "warning" : "info", title: notifyTitle, body: `${task.title || "A task"} is now ${nextStatus.replace(/_/g, " ")}.`, entityType: "task", entityId: task.id });
      if (nextStatus === "completed") generateRecurringTask(db, req, task);
      writeDb(db);
      return send(res, 200, task);
    }
    if (workflow === "subtask") {
      if (!String(body.title || "").trim()) return send(res, 400, { error: "Subtask title is required" });
      task.subtasks = Array.isArray(task.subtasks) ? task.subtasks : [];
      task.subtasks.push({ id: id("subtask"), title: String(body.title).trim(), status: "pending", ownerId: body.ownerId || "", dueDate: body.dueDate || "", checklist: [], progress: 0, createdAt: now() });
      task.progress = Math.round((task.subtasks.filter((item) => ["completed", "done"].includes(String(item.status || "").toLowerCase())).length / task.subtasks.length) * 100);
      task.updatedAt = now();
      taskAudit(db, req, "subtask_added", task, oldValue, `Subtask added: ${body.title}`);
      writeDb(db);
      return send(res, 200, task);
    }
    if (workflow === "notes") {
      task.notes = String(body.notes || "");
      task.updatedAt = now();
      taskAudit(db, req, "notes_updated", task, oldValue, "Task notes updated");
      writeDb(db);
      return send(res, 200, task);
    }
    if (workflow === "reminder") {
      task.reminder = body.reminder || "None";
      task.reminderDate = body.reminderDate || "";
      task.updatedAt = now();
      taskAudit(db, req, "reminder_changed", task, oldValue, `Reminder set to ${task.reminder}`);
      createNotification(db, { userIds: taskRecipients(db, task).filter((idValue) => idValue !== user.id), category: "tasks", type: "info", title: "Task reminder updated", body: `${task.title || "A task"} reminder is ${task.reminder}.`, entityType: "task", entityId: task.id });
      writeDb(db);
      return send(res, 200, task);
    }
    if (workflow === "link_ticket") {
      task.relatedTicketId = body.relatedTicketId || task.relatedTicketId || "";
      task.relatedIds = [...new Set([...(Array.isArray(task.relatedIds) ? task.relatedIds : []), task.relatedTicketId].filter(Boolean))];
      task.updatedAt = now();
      taskAudit(db, req, "related_linked", task, oldValue, "Ticket linked to task");
      writeDb(db);
      return send(res, 200, task);
    }
    return send(res, 400, { error: "Unsupported task workflow" });
  }

  if (req.method === "PATCH" && resource === "knowledge_base" && resourceId && action === "workflow") {
    const article = db.knowledgeBase.find((item) => item.id === resourceId);
    if (!article) return send(res, 404, { error: "Not found" });
    if (!canAccessResourceRow(db, user, "knowledge_base", article)) return send(res, 403, { error: "Forbidden" });
    const body = await readBody(req);
    const workflow = String(body.workflow || "").toLowerCase();
    const selfServiceWorkflow = ["view", "rate", "favorite", "share", "print", "pdf_export", "ticket_prevented"].includes(workflow);
    if (!selfServiceWorkflow && !can(db, user, "knowledge_base", "edit")) return send(res, 403, { error: "Forbidden" });
    const result = applyKnowledgeWorkflow(db, req, article, body);
    if (result.error) return send(res, result.status || 400, { error: result.error });
    writeDb(db);
    return send(res, 200, result);
  }

  if (resource === "settings" && resourceId === "ticket-assignment") {
    if (!["role_manager", "role_admin"].includes(user.roleId)) return send(res, 403, { error: "Only IT Manager or System Admin can configure ticket assignment" });
    if (req.method === "GET") return send(res, 200, ticketAssignmentSettings(db));
    if (req.method !== "PATCH") return send(res, 405, { error: "Method not allowed" });
    const body = await readBody(req);
    const oldValue = { ...ticketAssignmentSettings(db), categoryAssignees: { ...ticketAssignmentSettings(db).categoryAssignees }, categoryRoutes: { ...ticketAssignmentSettings(db).categoryRoutes } };
    const strategy = String(body.strategy || "manual");
    if (!["manual", "category", "least_open", "round_robin"].includes(strategy)) return send(res, 400, { error: "Unsupported assignment strategy" });
    // Routing keys are ticket_category lookup codes - main category codes and
    // subcategory codes are both valid, the subcategory rule being the specific one.
    const routeKey = (value) => {
      const direct = findTicketCategoryByCode(db, value);
      if (direct) return direct.code;
      const resolved = resolveTicketCategory(db, { category: value });
      return resolved ? resolved.subcategoryCode || resolved.mainCategoryCode : "";
    };
    const categoryAssignees = {};
    for (const [category, assigneeId] of Object.entries(body.categoryAssignees || {})) {
      const key = routeKey(category);
      if (!key || !assigneeId) continue;
      if (!isTicketAssignee(db, assigneeId)) return send(res, 400, { error: "Category assignees must be IT Staff or IT Manager users" });
      categoryAssignees[key] = assigneeId;
    }
    const categoryRoutes = {};
    for (const [category, route] of Object.entries(body.categoryRoutes || {})) {
      const key = routeKey(category);
      if (!key) return send(res, 400, { error: `Unknown ticket category: ${category}` });
      if (!route?.type || !route?.id) continue;
      if (route.type === "user") {
        if (!isTicketAssignee(db, route.id)) return send(res, 400, { error: "Category user routes must point to IT Staff or IT Manager users" });
        categoryRoutes[key] = { type: "user", id: route.id };
        categoryAssignees[key] = route.id;
      } else if (route.type === "group") {
        const group = (db.assignmentGroups || []).find((item) => item.id === route.id && item.active !== false && item.canReceiveTickets !== false);
        if (!group) return send(res, 400, { error: "Category group routes must point to active ticket-receiving groups" });
        categoryRoutes[key] = { type: "group", id: route.id };
      } else {
        return send(res, 400, { error: "Unsupported category route type" });
      }
    }
    if (body.fallbackAssigneeId && !isTicketAssignee(db, body.fallbackAssigneeId)) return send(res, 400, { error: "Fallback assignee must be IT Staff or IT Manager" });
    db.settings = db.settings || {};
    db.settings.ticketAssignment = {
      enabled: Boolean(body.enabled),
      strategy,
      categoryAssignees,
      categoryRoutes,
      fallbackAssigneeId: body.fallbackAssigneeId || "",
      roundRobinIndex: Number(oldValue.roundRobinIndex || 0)
    };
    audit(db, req, "update", "settings", "ticket-assignment", oldValue, db.settings.ticketAssignment);
    writeDb(db);
    return send(res, 200, db.settings.ticketAssignment);
  }

  if (resource === "assignment_groups") {
    if (req.method === "GET" && !resourceId) {
      if (user.roleId === "role_employee") return send(res, 403, { error: "Forbidden" });
      return send(res, 200, visibleAssignmentGroups(db, user));
    }
    if (!["role_manager", "role_admin"].includes(user.roleId)) return send(res, 403, { error: "Only IT Manager or System Admin can manage assignment groups" });
    if (req.method === "POST" && !resourceId) {
      const body = await readBody(req);
      const prepared = validateAssignmentGroupPayload(db, body);
      if (prepared.error) return send(res, 400, { error: prepared.error });
      const group = { id: id("grp"), ...prepared.value, createdAt: now(), updatedAt: now() };
      db.assignmentGroups.unshift(group);
      audit(db, req, "create", "assignment_groups", group.id, null, group);
      writeDb(db);
      return send(res, 201, group);
    }
    const group = (db.assignmentGroups || []).find((item) => item.id === resourceId);
    if (!group) return send(res, 404, { error: "Not found" });
    if (req.method === "GET") return send(res, 200, group);
    if (req.method === "PATCH") {
      const body = await readBody(req);
      const oldValue = { ...group };
      const prepared = validateAssignmentGroupPayload(db, body, group);
      if (prepared.error) return send(res, 400, { error: prepared.error });
      Object.assign(group, prepared.value, { updatedAt: now() });
      audit(db, req, "update", "assignment_groups", group.id, oldValue, group);
      writeDb(db);
      return send(res, 200, group);
    }
    return send(res, 405, { error: "Method not allowed" });
  }

  if (req.method === "PATCH" && resource === "users" && resourceId && ["reset-password", "disable", "unlock", "change-role"].includes(action)) {
    if (!can(db, user, "users", "edit")) return send(res, 403, { error: "Forbidden" });
    const account = db.users.find((item) => item.id === resourceId);
    if (!account) return send(res, 404, { error: "Not found" });
    if (!canAccessResourceRow(db, user, "users", account)) return send(res, 403, { error: "Forbidden" });
    const oldValue = { ...account };
    const body = await readBody(req);
    if (action === "reset-password") {
      // The account holder is the only person who should end up knowing this, so the
      // server generates it. An administrator may still supply one deliberately.
      const supplied = String(body.password || "").trim();
      if (supplied && supplied.length < 8) return send(res, 400, { error: "Use at least 8 characters." });
      const temporary = supplied || auth.generateTemporaryPassword();
      // Was stored in plain text here, which both defeated the hashing everywhere
      // else and produced a password that verifyPassword could never accept.
      account.password = auth.hashPassword(temporary);
      account.passwordSetAt = now();
      account.requirePasswordChange = true;
      // A reset usually follows a lockout or a suspected compromise, so any session
      // the account already holds must end.
      destroyUserSessions(db, account.id);
      audit(db, req, "reset_password", "users", account.id, { ...oldValue, password: "***" }, { ...account, password: "***" });
      writeDb(db);
      // Returned once, so it can be handed over. It is never retrievable later.
      return send(res, 200, { ...stripInternal(account), temporaryPassword: temporary });
    }
    if (action === "disable") {
      account.status = "disabled";
      account.disabledReason = body.reason || "Manually disabled";
    }
    if (action === "unlock") {
      account.status = "active";
      delete account.lockedAt;
      delete account.disabledReason;
    }
    if (action === "change-role") {
      if (!db.roles.some((role) => role.id === body.roleId)) return send(res, 400, { error: "Role is required" });
      account.roleId = body.roleId;
      account.notificationPreferences = notificationPreferences(account);
    }
    account.updatedAt = now();
    // Mask both sides: the before-image carries the stored password hash too.
    audit(db, req, action.replace("-", "_"), "users", account.id, { ...oldValue, password: "***" }, { ...account, password: "***" });
    writeDb(db);
    return send(res, 200, stripInternal(account));
  }

  const collectionMap = {
    users: "users",
    roles: "roles",
    employees: "employees",
    assets: "assets",
    transfers: "transfers",
    tickets: "tickets",
    tasks: "tasks",
    contracts: "contracts",
    vendors: "vendors",
    documents: "documents",
    attachments: "attachments",
    comments: "comments",
    notifications: "notifications",
    knowledge_base: "knowledgeBase",
    form_templates: "formTemplates",
    lookup_items: "lookupItems",
    audit_logs: "auditLogs",
    timeline: "timeline"
  };
  const collection = collectionMap[resource];
  if (!collection) return send(res, 404, { error: "Unknown API resource" });

  const moduleName = resourceModule(resource);

  if (req.method === "GET" && !resourceId) {
    if (!can(db, user, moduleName, "view")) return send(res, 403, { error: "Forbidden" });
    return send(res, 200, visibleCollection(db, user, resource));
  }

  if (req.method === "POST" && !resourceId) {
    if (!can(db, user, moduleName, "create")) return send(res, 403, { error: "Forbidden" });
    const rawBody = await readBody(req);
    const prepared = prepareCreateBody(db, user, resource, rawBody);
    if (prepared.error) return send(res, prepared.status || 400, { error: prepared.error });
    const body = prepared.body;
    if (resource === "assets" && body.serialNumber && db.assets.some((asset) => !asset.deletedAt && asset.serialNumber && asset.serialNumber.toLowerCase() === String(body.serialNumber).toLowerCase())) {
      return send(res, 409, { error: "Serial number already exists" });
    }
    // Employee number is the People key: the Excel import matches on it, so a
    // duplicate would make two rows indistinguishable on the next import.
    if (resource === "employees") {
      const employeeNo = normalizeEmployeeNo(body.employeeNo);
      if (!employeeNo) return send(res, 400, { error: "Employee number is required" });
      if (db.employees.some((person) => !person.deletedAt && normalizeEmployeeNo(person.employeeNo) === employeeNo)) {
        return send(res, 409, { error: `Employee number ${body.employeeNo} already exists` });
      }
    }
    if (resource === "transfers") {
      const transferAsset = db.assets.find((asset) => asset.id === body.assetId);
      const transferAction = String(body.movementType || body.action || "").toLowerCase();
      if (transferAsset?.status === "disposed") return send(res, 400, { error: "Disposed assets are read-only" });
    }
    const systemAccess = resource === "employees" ? body.systemAccess : null;
    if (resource === "employees") delete body.systemAccess;
    const row = { id: id(resource.slice(0, 4)), ...body, createdAt: now(), updatedAt: now() };
    if (resource === "roles" && !row.permissions) row.permissions = permissionSet("employee");
    const autoAssignment = resource === "tickets" ? autoAssignTicket(db, row) : null;
    db[collection].unshift(row);
    if (resource === "transfers") {
      const previousOwnerId = db.assets.find((item) => item.id === row.assetId)?.currentOwnerId;
      applyTransferSideEffects(db, row);
      const asset = db.assets.find((item) => item.id === row.assetId);
      const transferAction = String(row.movementType || row.action || "").toLowerCase();
      if (asset) {
        recordTransferTimeline(db, req, row, asset);
        createAssetWorkflowDocument(db, req, row, asset);
        notifyAssetWorkflow(db, row, asset);
      }
      if (asset && ["return", "returned"].includes(transferAction) && previousOwnerId) {
        createNotification(db, { userIds: [userForEmployee(db, previousOwnerId)?.id], category: "assets", type: "info", title: "Asset returned", body: `${asset.assetNumber || asset.id} was returned to IT.`, entityType: "asset", entityId: asset.id });
      }
    }
    if (resource === "tickets") {
      const highPriority = ["high", "critical"].includes(String(row.priority || "").toLowerCase());
      const unassigned = !row.assignedToId;
      if (highPriority || unassigned) createNotification(db, { roleIds: ["role_manager"], category: "tickets", type: highPriority ? "critical" : "warning", title: highPriority ? "High priority ticket created" : "Ticket waiting review", body: `${row.ticketNumber} is ready for IT review.`, entityType: "ticket", entityId: row.id });
      if (row.onBehalf) {
        const requester = (db.employees || []).find((employee) => employee.id === row.requesterId);
        const requesterUserId = userForEmployee(db, row.requesterId)?.id;
        db.timeline.unshift({
          id: id("tl"),
          title: "Ticket opened on behalf of employee",
          description: `${row.ticketNumber} was opened by ${user.name} on behalf of ${requester?.name || "an employee"}.`,
          entityType: "tickets",
          entityId: row.id,
          severity: "info",
          actorUserId: user.id,
          createdAt: now()
        });
        if (requesterUserId && requesterUserId !== user.id) {
          createNotification(db, {
            userIds: [requesterUserId],
            category: "tickets",
            type: "info",
            title: "A ticket was opened for you",
            body: `${user.name} opened ${row.ticketNumber} on your behalf: ${row.category || "IT request"}.`,
            entityType: "ticket",
            entityId: row.id
          });
        }
      }
      if (autoAssignment) {
        if (autoAssignment.group) {
          db.timeline.unshift({
            id: id("tl"),
            title: "Ticket routed to group",
            description: `${row.ticketNumber} routed to ${autoAssignment.group.name}.`,
            entityType: "tickets",
            entityId: row.id,
            severity: "info",
            actorUserId: user.id,
            createdAt: now()
          });
        }
        if (autoAssignment.assignee) {
          db.timeline.unshift({
            id: id("tl"),
            title: "Ticket auto-assigned",
            description: `${row.ticketNumber} assigned to ${autoAssignment.assignee.name} using ${String(autoAssignment.method || "").toLowerCase().replace(/_/g, " ")}.`,
            entityType: "tickets",
            entityId: row.id,
            severity: "info",
            actorUserId: user.id,
            createdAt: now()
          });
        }
        db.auditLogs.unshift({
          id: id("audit"),
          userId: user.id,
          action: "auto_assign",
          entityType: "tickets",
          entityId: row.id,
          oldValue: { assignedToId: "" },
          newValue: { assignedGroupId: row.assignedGroupId || "", assignedToId: row.assignedToId || "", method: autoAssignment.method },
          ipAddress: req.socket.remoteAddress,
          createdAt: now()
        });
      }
      if (row.assignedToId && isTicketAssignee(db, row.assignedToId) && row.assignedToId !== user.id) createNotification(db, { userIds: [row.assignedToId], category: "tickets", type: "info", title: autoAssignment ? "Ticket auto-assigned" : "Ticket assigned", body: `${row.ticketNumber} was assigned to you.`, entityType: "ticket", entityId: row.id });
      if (autoAssignment?.group && !row.assignedToId) {
        const recipients = normalizeArray(autoAssignment.recipientIds).filter((id) => id !== user.id);
        if (recipients.length) createNotification(db, { userIds: recipients, category: "tickets", type: "info", title: "Ticket routed to group", body: `${row.ticketNumber} was routed to ${autoAssignment.group.name}.`, entityType: "ticket", entityId: row.id });
      }
      for (const articleId of normalizeArray(row.suggestedArticleIds || row.relatedKnowledgeArticleIds)) {
        const article = db.knowledgeBase.find((item) => item.id === articleId);
        if (article) recordKnowledgeAnalytics(db, req, article, "ticket_created", { ticketId: row.id });
      }
    }
    if (resource === "tasks") {
      if (!row.taskNumber) row.taskNumber = nextTaskNumber(db);
      row.status = normalizeTaskStatus(row.status || "pending");
      row.priority = String(row.priority || "medium").toLowerCase();
      row.recurrence = row.recurrence || "One Time";
      row.progress = Number(row.progress || 0);
      if (row.ownerId && row.ownerId !== user.id && isStaff(db, row.ownerId)) createNotification(db, { userIds: [row.ownerId], category: "tasks", type: "info", title: "Task assigned", body: `${row.title || "A task"} was assigned to you.`, entityType: "task", entityId: row.id });
      if (row.assignedToId && row.assignedToId !== user.id) createNotification(db, { userIds: [row.assignedToId], category: "tasks", type: "info", title: "Task assigned", body: `${row.title || "A task"} was assigned to you.`, entityType: "task", entityId: row.id });
    }
    if (resource === "contracts" && isNearContractExpiration(row)) createNotification(db, {
      roleIds: ["role_manager", "role_staff"], category: "contracts", type: "warning", title: "Contract expires within 30 days",
      body: `${row.name} is nearing expiration.`, entityType: "contract", entityId: row.id
    });
    if (resource === "knowledge_base") {
      row.keywords = knowledgeSearchKeywords(row, row);
      row.readingTime = knowledgeReadingTimeLabel(`${row.body || ""} ${htmlToText(row.bodyHtml || "")}`);
      if (!row.status) row.status = row.published === true || row.published === "true" ? "Published" : "Draft";
    }
    if (resource === "assets" && row.status === "under_maintenance") createNotification(db, {
      roleIds: ["role_manager", "role_staff"], category: "assets", type: "warning", title: "Asset moved to maintenance",
      body: `${row.assetNumber || row.id} entered maintenance.`, entityType: "asset", entityId: row.id
    });
    if (resource === "employees" && systemAccess?.createLogin) {
      const created = createLinkedUserAccount(db, req, row, systemAccess);
      if (created.error) {
        db[collection] = db[collection].filter((item) => item.id !== row.id);
        return send(res, created.status || 400, { error: created.error });
      }
    }
    audit(db, req, "create", resource, row.id, null, resource === "users" ? { ...row, password: "***" } : row);
    writeDb(db);
    return send(res, 201, resource === "users" ? stripInternal(row) : row);
  }

  const row = db[collection].find((item) => item.id === resourceId);
  if (!row) return send(res, 404, { error: "Not found" });
  if (req.method === "GET") {
    if (!can(db, user, moduleName, "view")) return send(res, 403, { error: "Forbidden" });
    if (!canAccessResourceRow(db, user, resource, row)) return send(res, 403, { error: "Forbidden" });
    if (resource === "knowledge_base" && !isItUser(db, user)) return send(res, 200, stripKnowledgeForEmployee(row, user));
    return send(res, 200, isItUser(db, user) ? row : stripInternal(row));
  }
  if (!canAccessResourceRow(db, user, resource, row)) return send(res, 403, { error: "Forbidden" });

  if (req.method === "PATCH" && action === "archive") {
    if (!can(db, user, moduleName, "archive")) return send(res, 403, { error: "Forbidden" });
    if (resource === "knowledge_base" && !["role_manager", "role_admin"].includes(user.roleId)) return send(res, 403, { error: "Only IT Manager can archive articles" });
    const oldValue = { ...row };
    row.archivedAt = now();
    row.updatedAt = now();
    audit(db, req, "archive", resource, row.id, oldValue, row);
    writeDb(db);
    return send(res, 200, row);
  }

  if (req.method === "PATCH" && action === "trash") {
    if (!can(db, user, moduleName, "archive")) return send(res, 403, { error: "Forbidden" });
    if (resource === "employees" && personHasLinkedRecords(db, row)) return send(res, 409, { error: "People with linked records can only be archived" });
    const oldValue = { ...row };
    row.deletedAt = now();
    row.updatedAt = now();
    audit(db, req, "trash", resource, row.id, oldValue, row);
    writeDb(db);
    return send(res, 200, row);
  }

  if (req.method === "PATCH" && action === "restore") {
    if (!can(db, user, moduleName, "archive")) return send(res, 403, { error: "Forbidden" });
    if (resource === "knowledge_base" && !["role_manager", "role_admin"].includes(user.roleId)) return send(res, 403, { error: "Only IT Manager can restore articles" });
    const oldValue = { ...row };
    delete row.archivedAt;
    delete row.deletedAt;
    row.updatedAt = now();
    audit(db, req, "restore", resource, row.id, oldValue, row);
    writeDb(db);
    return send(res, 200, row);
  }

  if (req.method === "PATCH" && action === "permanent-delete") {
    if (!can(db, user, moduleName, "admin")) return send(res, 403, { error: "Forbidden" });
    if (resource === "employees" && personHasLinkedRecords(db, row)) return send(res, 409, { error: "People with linked records can only be archived" });
    const index = db[collection].findIndex((item) => item.id === resourceId);
    const oldValue = { ...row };
    db[collection].splice(index, 1);
    audit(db, req, "permanent_delete", resource, resourceId, oldValue, null);
    writeDb(db);
    return send(res, 200, { ok: true });
  }

  if (req.method === "PATCH") {
    const body = await readBody(req);
    const employeeWithdrawal = resource === "tickets" && !isItUser(db, user)
      && body.status === "cancelled"
      && Object.keys(body).every((field) => ["status", "withdrawalReason"].includes(field));
    if (!can(db, user, moduleName, "edit") && !employeeWithdrawal) return send(res, 403, { error: "Forbidden" });
    if (employeeWithdrawal) {
      if (!["open", "waiting"].includes(String(row.status || "").toLowerCase())) return send(res, 403, { error: "This request can no longer be withdrawn" });
      body.cancelReason = "Requester";
    }
    if (resource === "tickets") {
      if (!isItUser(db, user) && (body.waitingReason || body.cancelReason) && !employeeWithdrawal) return send(res, 403, { error: "Forbidden" });
      if (Object.prototype.hasOwnProperty.call(body, "assignedToId") && body.assignedToId) {
        const assignee = db.users.find((candidate) => candidate.id === body.assignedToId);
        if (!assignee || !["role_manager", "role_staff"].includes(assignee.roleId)) return send(res, 400, { error: "Tickets can only be assigned to IT Manager or IT Staff users" });
      }
      if (body.status !== undefined) {
        const nextStatus = String(body.status).toLowerCase();
        const currentStatus = String(row.status || "open").toLowerCase();
        if (!validTicketStatuses.has(nextStatus)) return send(res, 400, { error: "Unsupported ticket status" });
        if (nextStatus !== currentStatus && !ticketTransitions[currentStatus]?.has(nextStatus)) {
          return send(res, 409, { error: `Invalid ticket status transition: ${currentStatus} to ${nextStatus}` });
        }
        body.status = nextStatus;
        if (nextStatus !== currentStatus && nextStatus === "waiting" && !body.waitingReason) return send(res, 400, { error: "Waiting reason is required" });
        if (nextStatus !== currentStatus && nextStatus === "cancelled" && !employeeWithdrawal && !body.cancelReason) return send(res, 400, { error: "Cancel reason is required" });
      }
      if (body.waitingReason && (!isItUser(db, user) || !validWaitingReasons.has(body.waitingReason))) return send(res, isItUser(db, user) ? 400 : 403, { error: "Unsupported waiting reason" });
      if (body.cancelReason && !employeeWithdrawal && (!isItUser(db, user) || !validCancelReasons.has(body.cancelReason))) return send(res, isItUser(db, user) ? 400 : 403, { error: "Unsupported cancel reason" });
    }
    if (resource === "tasks" && !isItUser(db, user)) {
      const fields = Object.keys(body);
      const allowed = new Set(["title", "category", "priority", "dueDate", "startDate", "recurrence", "notes", "description", "status"]);
      if (fields.some((field) => !allowed.has(field))) return send(res, 403, { error: "Forbidden field update" });
      if (fields.includes("status") && fields.length !== 1) return send(res, 403, { error: "Status must be updated separately" });
    }
    if (resource === "tasks") {
      if (body.status !== undefined) {
        const nextStatus = normalizeTaskStatus(body.status);
        const currentStatus = normalizeTaskStatus(row.status);
        if (!validTaskStatuses.has(nextStatus)) return send(res, 400, { error: "Unsupported task status" });
        if (nextStatus !== currentStatus && !taskTransitions[currentStatus]?.has(nextStatus)) return send(res, 409, { error: `Invalid task status transition: ${currentStatus} to ${nextStatus}` });
        body.status = nextStatus;
        if (nextStatus === "in_progress" && !row.startedAt) body.startedAt = now();
        if (nextStatus === "completed") {
          body.completedAt = now();
          body.progress = 100;
        }
      }
      if (body.priority !== undefined) body.priority = String(body.priority || "medium").toLowerCase();
      if (body.progress !== undefined) body.progress = Math.max(0, Math.min(100, Number(body.progress || 0)));
      if (body.assignedToId && !db.users.some((candidate) => candidate.id === body.assignedToId)) return send(res, 400, { error: "Assigned user was not found" });
      if (body.ownerId && !db.users.some((candidate) => candidate.id === body.ownerId)) return send(res, 400, { error: "Owner was not found" });
    }
    if (resource === "users") {
      if (body.username || body.email || body.roleId) {
        const validation = validateAccountPayload(db, { ...row, ...body }, row.id);
        if (validation.error) return send(res, validation.status || 400, { error: validation.error });
        if (body.username) body.username = validation.username;
      }
      if (body.password === "") delete body.password;
    }
    if (resource === "assets" && body.serialNumber && db.assets.some((asset) => asset.id !== row.id && !asset.deletedAt && asset.serialNumber && asset.serialNumber.toLowerCase() === String(body.serialNumber).toLowerCase())) {
      return send(res, 409, { error: "Serial number already exists" });
    }
    if (resource === "employees" && body.employeeNo !== undefined) {
      const employeeNo = normalizeEmployeeNo(body.employeeNo);
      if (!employeeNo) return send(res, 400, { error: "Employee number is required" });
      if (db.employees.some((person) => person.id !== row.id && !person.deletedAt && normalizeEmployeeNo(person.employeeNo) === employeeNo)) {
        return send(res, 409, { error: `Employee number ${body.employeeNo} already exists` });
      }
    }
    if (resource === "assets" && body.assetNumber && db.assets.some((asset) => asset.id !== row.id && !asset.deletedAt && String(asset.assetNumber || "").toLowerCase() === String(body.assetNumber).toLowerCase())) {
      return send(res, 409, { error: "Asset number already exists" });
    }
    if (resource === "assets") {
      const nextStatus = body.status || row.status;
      const nextOwner = Object.prototype.hasOwnProperty.call(body, "currentOwnerId") ? body.currentOwnerId : row.currentOwnerId;
      if (nextStatus === "disposed" && nextOwner) return send(res, 400, { error: "Disposed assets cannot be assigned" });
      if (body.status && !body.attention) body.attention = ["lost", "stolen"].includes(body.status) ? "critical" : ["pending_return", "disposed"].includes(body.status) ? "action_required" : ["temporary_custody", "in_repair", "under_maintenance"].includes(body.status) ? "warning" : "normal";
      if (body.currentOwnerId !== undefined) body.currentHolderId = body.currentOwnerId || "";
      if (body.currentOwnerId && !body.currentHolderType) body.currentHolderType = "Person";
    }
    if (resource === "tickets" && body.ticketNumber && db.tickets.some((ticket) => ticket.id !== row.id && !ticket.deletedAt && String(ticket.ticketNumber || "").toLowerCase() === String(body.ticketNumber).toLowerCase())) {
      return send(res, 409, { error: "Ticket number already exists" });
    }
    if (resource === "tickets" && ["category", "mainCategoryCode", "subcategoryCode", "mainCategory", "subcategory"].some((field) => Object.prototype.hasOwnProperty.call(body, field))) {
      const recategorized = { ...row, ...body };
      // Force re-resolution from the incoming values rather than the stored codes.
      if (Object.prototype.hasOwnProperty.call(body, "category") && !body.mainCategoryCode && !body.subcategoryCode) {
        recategorized.mainCategoryCode = "";
        recategorized.subcategoryCode = "";
      }
      const resolved = resolveTicketCategory(db, recategorized);
      if (!resolved) return send(res, 400, { error: "Unsupported ticket category" });
      Object.assign(body, resolved);
    }
    if (resource === "knowledge_base" && (body.bodyHtml !== undefined || body.body !== undefined || body.title !== undefined || body.tagsText !== undefined || body.category !== undefined)) {
      body.keywords = knowledgeSearchKeywords({ ...row, ...body }, body);
      body.readingTime = knowledgeReadingTimeLabel(`${body.body || row.body || ""} ${htmlToText(body.bodyHtml || row.bodyHtml || "")}`);
      if (body.status === "Draft" || body.published === false) body.published = false;
      if (body.status === "Published") body.published = true;
    }
    if (resource === "knowledge_base" && !["role_manager", "role_admin"].includes(user.roleId)) {
      const protectedStatus = body.published === true || ["Approved", "Published", "Archived", "Retired", "Rejected"].includes(String(body.status || ""));
      const protectedFields = ["versionHistory", "reviewerId", "approverId", "approvalDate", "rejectedBy", "rejectedAt", "archivedAt", "deletedAt"].some((field) => Object.prototype.hasOwnProperty.call(body, field));
      if (protectedStatus || protectedFields) return send(res, 403, { error: "Only IT Manager can approve, publish, archive, or modify governance fields" });
    }
    const oldValue = { ...row };
    Object.assign(row, body, { updatedAt: now() });
    if (resource === "transfers") applyTransferSideEffects(db, row);
    // An explicit assignment is a manual decision - drop the auto-assigned marker so
    // later category changes cannot silently steal the ticket back.
    if (resource === "tickets" && Object.prototype.hasOwnProperty.call(body, "assignedToId")) {
      row.autoAssigned = false;
      row.autoAssignmentMethod = "";
    }
    // Re-route when the category changes, but never override a manual assignment.
    let recategorizedAssignment = null;
    if (resource === "tickets"
      && (row.mainCategoryCode !== oldValue.mainCategoryCode || row.subcategoryCode !== oldValue.subcategoryCode)
      && !Object.prototype.hasOwnProperty.call(body, "assignedToId")
      && (!row.assignedToId || row.autoAssigned)) {
      const previousAssigneeId = row.assignedToId;
      row.assignedToId = "";
      recategorizedAssignment = autoAssignTicket(db, row);
      if (!recategorizedAssignment) row.assignedToId = previousAssigneeId;
      else if (recategorizedAssignment.assignee) {
        db.timeline.unshift({
          id: id("tl"),
          title: "Ticket re-routed after category change",
          description: `${row.ticketNumber} moved to ${row.category} and was assigned to ${recategorizedAssignment.assignee.name}.`,
          entityType: "tickets",
          entityId: row.id,
          severity: "info",
          actorUserId: user.id,
          createdAt: now()
        });
      }
    }
    if (resource === "tickets" && row.assignedToId && row.assignedToId !== oldValue.assignedToId) createNotification(db, {
      userIds: [isStaff(db, row.assignedToId) ? row.assignedToId : "", userForEmployee(db, row.requesterId)?.id].filter((idValue) => idValue && idValue !== user.id), category: "tickets", type: "info", title: "Ticket assigned",
      body: `${row.ticketNumber} was assigned to ${lookUserName(db, row.assignedToId)}.`, entityType: "ticket", entityId: row.id
    });
    if (resource === "tickets" && body.status && body.status !== oldValue.status) {
      const needsInfo = body.status === "waiting" && String(row.waitingReason || "").toLowerCase() === "user";
      const statusTitle = employeeWithdrawal ? "Ticket withdrawn by employee" : needsInfo ? "More information needed" : body.status === "resolved" ? "Ticket resolved" : body.status === "closed" ? "Ticket closed" : "Ticket status changed";
      const employeeRecipient = userForEmployee(db, row.requesterId)?.id;
      if (employeeWithdrawal) createNotification(db, { roleIds: ["role_manager"], category: "tickets", type: "warning", title: statusTitle, body: `${row.ticketNumber} was withdrawn by the requester.`, entityType: "ticket", entityId: row.id });
      else if (employeeRecipient && employeeRecipient !== user.id) createNotification(db, { userIds: [employeeRecipient], category: "tickets", type: body.status === "cancelled" ? "warning" : "info", title: statusTitle, body: `${row.ticketNumber} is now ${body.status.replace("_", " ")}.`, entityType: "ticket", entityId: row.id });
    }
    if (resource === "contracts" && isNearContractExpiration(row) && !isNearContractExpiration(oldValue)) createNotification(db, {
      roleIds: ["role_manager", "role_staff"], category: "contracts", type: "warning", title: "Contract expires within 30 days",
      body: `${row.name} is nearing expiration.`, entityType: "contract", entityId: row.id
    });
    if (resource === "assets" && row.currentOwnerId && row.currentOwnerId !== oldValue.currentOwnerId) createNotification(db, { userIds: [userForEmployee(db, row.currentOwnerId)?.id], category: "assets", type: "info", title: "Asset assigned", body: `${row.assetNumber || row.id} was assigned to you.`, entityType: "asset", entityId: row.id });
    if (resource === "assets" && !row.currentOwnerId && oldValue.currentOwnerId) createNotification(db, { userIds: [userForEmployee(db, oldValue.currentOwnerId)?.id], category: "assets", type: "info", title: "Asset returned", body: `${row.assetNumber || row.id} was returned to IT.`, entityType: "asset", entityId: row.id });
    if (resource === "assets" && row.status === "under_maintenance" && oldValue.status !== "under_maintenance") createNotification(db, { roleIds: ["role_manager", "role_staff"], category: "assets", type: "warning", title: "Asset moved to maintenance", body: `${row.assetNumber || row.id} entered maintenance.`, entityType: "asset", entityId: row.id });
    if (resource === "tasks") {
      const recipients = taskRecipients(db, row).filter((idValue) => idValue && idValue !== user.id);
      if (row.assignedToId && row.assignedToId !== oldValue.assignedToId) createNotification(db, { userIds: [row.assignedToId].filter((idValue) => idValue !== user.id), category: "tasks", type: "info", title: "Task assigned", body: `${row.title || "A task"} was assigned to you.`, entityType: "task", entityId: row.id });
      if (body.status && body.status !== oldValue.status) createNotification(db, { userIds: recipients, category: "tasks", type: body.status === "cancelled" ? "warning" : "info", title: body.status === "completed" ? "Task completed" : body.status === "cancelled" ? "Task cancelled" : "Task status changed", body: `${row.title || "A task"} is now ${String(body.status).replace(/_/g, " ")}.`, entityType: "task", entityId: row.id });
      if (body.status === "completed") generateRecurringTask(db, req, row);
      if (body.reminder || body.reminderDate) createNotification(db, { userIds: recipients, category: "tasks", type: "info", title: "Task reminder updated", body: `${row.title || "A task"} reminder was updated.`, entityType: "task", entityId: row.id });
    }
    const ticketAssignmentChanged = resource === "tickets" && Object.prototype.hasOwnProperty.call(body, "assignedToId") && body.assignedToId !== oldValue.assignedToId;
    const ticketStatusChanged = resource === "tickets" && body.status && body.status !== oldValue.status;
    const taskAssignmentChanged = resource === "tasks" && Object.prototype.hasOwnProperty.call(body, "assignedToId") && body.assignedToId !== oldValue.assignedToId;
    const taskStatusChanged = resource === "tasks" && body.status && body.status !== oldValue.status;
    if (ticketAssignmentChanged && ticketStatusChanged) audit(db, req, "assign", resource, row.id, oldValue, row);
    const knowledgeContentChanged = resource === "knowledge_base" && (body.bodyHtml !== undefined || body.body !== undefined);
    const auditAction = knowledgeContentChanged ? "draft_saved" : ticketStatusChanged
      ? body.status === "resolved" ? "resolve" : body.status === "closed" ? "close" : body.status === "cancelled" ? "cancel" : "status_change"
      : ticketAssignmentChanged ? "assign"
      : taskStatusChanged ? body.status === "completed" ? "complete" : body.status === "cancelled" ? "cancel" : "status_change"
      : taskAssignmentChanged ? "assign"
      : resource === "tasks" && (body.reminder || body.reminderDate) ? "reminder_changed"
      : resource === "tasks" && body.recurrence !== undefined && body.recurrence !== oldValue.recurrence ? "recurrence_changed"
      : resource === "tasks" && body.priority !== undefined && body.priority !== oldValue.priority ? "priority_changed"
      : "update";
    audit(db, req, auditAction, resource, row.id, resource === "users" ? { ...oldValue, password: "***" } : oldValue, resource === "users" ? { ...row, password: "***" } : row);
    writeDb(db);
    return send(res, 200, resource === "users" ? stripInternal(row) : row);
  }

  return send(res, 405, { error: "Method not allowed" });
}

// Applied to every response. frame-ancestors blocks click-jacking, nosniff stops
// content-type guessing, and the CSP keeps the page from loading third-party code.
const SECURITY_HEADERS = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "same-origin",
  "Cross-Origin-Opener-Policy": "same-origin",
  "Content-Security-Policy": [
    "default-src 'self'",
    "img-src 'self' data: blob:",
    "style-src 'self' 'unsafe-inline'",
    "script-src 'self' 'unsafe-inline'",
    "frame-src 'self' blob:",
    "connect-src 'self'",
    "form-action 'self'",
    "base-uri 'self'",
    "frame-ancestors 'none'"
  ].join("; ")
};

const server = http.createServer((req, res) => {
  for (const [header, value] of Object.entries(SECURITY_HEADERS)) res.setHeader(header, value);
  if (STRICT_TRANSPORT && COOKIE_SECURE) res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  if (req.url.startsWith("/api/")) {
    handleApi(req, res).catch((error) => {
      // Log the detail, return none: internal messages have leaked paths and
      // stack context to clients in the past.
      console.error("[api]", req.method, req.url, error.stack || error.message);
      send(res, 500, { error: "Something went wrong. Please try again." });
    });
    return;
  }
  serveStatic(req, res);
});

ensureData();
server.listen(PORT, () => {
  console.log(`IT Reporting Center running at http://localhost:${PORT}`);
  // Silence here is the reason people think sign-in is broken: codes are written
  // to this console instead of being emailed until a transport is configured.
  if (!["smtp", "graph"].includes(mailerTransport())) {
    console.log("");
    console.log("  ! MAIL IS NOT BEING SENT.");
    console.log("    Sign-in codes are printed to this console and shown on the sign-in");
    console.log("    screen, so the system can be tried before mail exists.");
    console.log("    This mode also lets anyone tell which addresses are registered.");
    console.log("    TESTING ONLY - configure mail before real users sign in.");
    console.log("    To send real email set MAIL_TRANSPORT=smtp (or =graph for Microsoft 365).");
    console.log("    Check your settings first with:  npm run mail:test -- you@example.com");
    console.log("    See docs/DEPLOYMENT.md and docs/EMAIL_SETUP.md.");
    console.log("");
  }
  if (!COOKIE_SECURE) {
    console.log("  ! COOKIE_SECURE is off, so sessions are not restricted to HTTPS.");
    console.log("    Fine for local testing; set COOKIE_SECURE=true behind TLS in production.");
    console.log("");
  }
});
