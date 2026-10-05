const users = [
  { id: 1, name: "Asha Perera", email: "asha.perera@university.edu", role: "Student", status: "Active", registeredDate: "2025-02-10" },
  { id: 2, name: "Nethmi Silva", email: "nethmi.silva@university.edu", role: "Student", status: "Active", registeredDate: "2025-03-18" },
  { id: 3, name: "Kavindu Fernando", email: "kavindu.fernando@university.edu", role: "Student", status: "Inactive", registeredDate: "2024-09-02" },
  { id: 4, name: "Alex Perera", email: "alex.perera@university.edu", role: "Organizer", status: "Active", registeredDate: "2024-11-12" },
  { id: 5, name: "Maya Jayawardena", email: "maya.j@university.edu", role: "Organizer", status: "Active", registeredDate: "2025-01-15" },
  { id: 6, name: "Admin User", email: "admin@university.edu", role: "Administrator", status: "Active", registeredDate: "2024-08-01" },
  { id: 7, name: "Dilan Abeysekara", email: "dilan.a@university.edu", role: "Student", status: "Suspended", registeredDate: "2025-05-26" },
  { id: 8, name: "Tharushi De Silva", email: "tharushi.ds@university.edu", role: "Student", status: "Active", registeredDate: "2025-06-04" },
  { id: 9, name: "Ruwan Senanayake", email: "ruwan.s@university.edu", role: "Organizer", status: "Suspended", registeredDate: "2025-08-19" },
];

const students = [
  { id: 1, userId: 1, name: "Asha Perera", studentId: "ST2024018", email: "asha.perera@university.edu", faculty: "Engineering", year: "2", registeredEvents: 3, status: "Active" },
  { id: 2, userId: 2, name: "Nethmi Silva", studentId: "ST2023152", email: "nethmi.silva@university.edu", faculty: "Business", year: "3", registeredEvents: 5, status: "Active" },
  { id: 3, userId: 3, name: "Kavindu Fernando", studentId: "ST2022094", email: "kavindu.fernando@university.edu", faculty: "Computing", year: "4", registeredEvents: 2, status: "Inactive" },
  { id: 4, userId: 7, name: "Dilan Abeysekara", studentId: "ST2024113", email: "dilan.a@university.edu", faculty: "Science", year: "1", registeredEvents: 1, status: "Suspended" },
  { id: 5, userId: 8, name: "Tharushi De Silva", studentId: "ST2023207", email: "tharushi.ds@university.edu", faculty: "Humanities", year: "3", registeredEvents: 4, status: "Active" },
];

const organizers = [
  { id: 4, userId: 4, name: "Alex Perera", email: "alex.perera@university.edu", department: "Office of Student Affairs", eventsCreated: 8, status: "Active" },
  { id: 5, userId: 5, name: "Maya Jayawardena", email: "maya.j@university.edu", department: "Faculty of Engineering", eventsCreated: 5, status: "Active" },
  { id: 6, userId: 9, name: "Ruwan Senanayake", email: "ruwan.s@university.edu", department: "Career Development Centre", eventsCreated: 3, status: "Suspended" },
];

const events = [
  { id: 1, title: "University Tech Conference 2026", description: "Explore emerging technology with university researchers and industry guests.", organizer: "Alex Perera", organizerId: 4, category: "Technology", date: "2026-10-05", time: "9:00 AM - 4:00 PM", location: "Engineering Faculty", capacity: 180, registrations: 120, status: "Completed", createdDate: "2026-07-14", submittedDate: "2026-07-12" },
  { id: 2, title: "Introduction to Artificial Intelligence", description: "A practical introduction to AI fundamentals and responsible applications.", organizer: "Alex Perera", organizerId: 4, category: "Workshops", date: "2026-10-08", time: "10:00 AM - 1:00 PM", location: "ICT Auditorium", capacity: 120, registrations: 80, status: "Published", createdDate: "2026-08-02", submittedDate: "2026-08-01" },
  { id: 3, title: "Career & Internship Fair", description: "Meet employers and discover internship and career opportunities.", organizer: "Maya Jayawardena", organizerId: 5, category: "Career", date: "2026-10-12", time: "9:00 AM - 3:00 PM", location: "University Main Hall", capacity: 400, registrations: 250, status: "Published", createdDate: "2026-08-18", submittedDate: "2026-08-17" },
  { id: 4, title: "Research & Innovation Symposium", description: "Research presentations and prototype demonstrations from across campus.", organizer: "Maya Jayawardena", organizerId: 5, category: "Academic", date: "2026-10-20", time: "9:30 AM - 2:30 PM", location: "Science Complex, Hall B", capacity: 160, registrations: 34, status: "Pending", createdDate: "2026-09-28", submittedDate: "2026-09-29" },
  { id: 5, title: "Campus Sustainability Forum", description: "A campus-wide conversation about practical sustainability initiatives.", organizer: "Alex Perera", organizerId: 4, category: "Community", date: "2026-11-04", time: "1:00 PM - 4:00 PM", location: "Green Learning Centre", capacity: 100, registrations: 16, status: "Pending", createdDate: "2026-10-01", submittedDate: "2026-10-02" },
  { id: 6, title: "Student Leadership Summit", description: "A full-day development programme for student leaders.", organizer: "Ruwan Senanayake", organizerId: 6, category: "Leadership", date: "2026-11-18", time: "9:00 AM - 4:30 PM", location: "University Conference Centre", capacity: 140, registrations: 0, status: "Draft", createdDate: "2026-10-03", submittedDate: "2026-10-03" },
  { id: 7, title: "Alumni Networking Evening", description: "Connect current students with graduates working in varied industries.", organizer: "Maya Jayawardena", organizerId: 5, category: "Career", date: "2026-12-02", time: "5:00 PM - 8:00 PM", location: "University Main Hall", capacity: 220, registrations: 0, status: "Rejected", createdDate: "2026-09-10", submittedDate: "2026-09-09", rejectionReason: "Please provide a confirmed venue plan." },
];

const registrations = [
  { id: 1, student: "Asha Perera", studentId: "ST2024018", event: "University Tech Conference 2026", eventId: 1, organizer: "Alex Perera", date: "2026-09-20", status: "Attended" },
  { id: 2, student: "Nethmi Silva", studentId: "ST2023152", event: "Introduction to Artificial Intelligence", eventId: 2, organizer: "Alex Perera", date: "2026-09-23", status: "Registered" },
  { id: 3, student: "Kavindu Fernando", studentId: "ST2022094", event: "Career & Internship Fair", eventId: 3, organizer: "Maya Jayawardena", date: "2026-09-24", status: "Registered" },
  { id: 4, student: "Tharushi De Silva", studentId: "ST2023207", event: "Career & Internship Fair", eventId: 3, organizer: "Maya Jayawardena", date: "2026-09-25", status: "Cancelled" },
  { id: 5, student: "Dilan Abeysekara", studentId: "ST2024113", event: "Research & Innovation Symposium", eventId: 4, organizer: "Maya Jayawardena", date: "2026-10-01", status: "Registered" },
  { id: 6, student: "Asha Perera", studentId: "ST2024018", event: "Introduction to Artificial Intelligence", eventId: 2, organizer: "Alex Perera", date: "2026-10-02", status: "Registered" },
  { id: 7, student: "Nethmi Silva", studentId: "ST2023152", event: "University Tech Conference 2026", eventId: 1, organizer: "Alex Perera", date: "2026-09-21", status: "Attended" },
];

const announcements = [
  { id: 1, title: "Registration Deadline Extended", message: "Registration for the Career & Internship Fair has been extended through October 10.", audience: "Students", date: "2026-10-04", status: "Published" },
  { id: 2, title: "New Event Submission Guidelines", message: "Organizers should include venue and accessibility details with every event submission.", audience: "Organizers", date: "2026-10-02", status: "Published" },
  { id: 3, title: "October Campus Events", message: "See the events and activities scheduled across campus this month.", audience: "All Users", date: "2026-10-01", status: "Draft" },
];

const notifications = [
  { id: 1, type: "approval", title: "Event awaiting approval", message: "Research & Innovation Symposium is ready for review.", time: "18 minutes ago", read: false },
  { id: 2, type: "user", title: "New organizer registered", message: "A new organizer account was submitted for verification.", time: "1 hour ago", read: false },
  { id: 3, type: "registration", title: "Registration increase", message: "Career & Internship Fair registrations increased by 18 today.", time: "3 hours ago", read: false },
  { id: 4, type: "announcement", title: "System announcement published", message: "A registration deadline update was published to students.", time: "Yesterday", read: true },
];

const activityLogs = [
  { id: 1, action: "Approved University Tech Conference 2026", user: "Admin User", role: "Administrator", date: "2026-09-18", time: "10:42 AM" },
  { id: 2, action: "Created Career & Internship Fair", user: "Maya Jayawardena", role: "Organizer", date: "2026-08-18", time: "2:14 PM" },
  { id: 3, action: "Registered for AI Workshop", user: "Asha Perera", role: "Student", date: "2026-09-23", time: "9:05 AM" },
  { id: 4, action: "Updated organizer profile", user: "Alex Perera", role: "Organizer", date: "2026-09-20", time: "11:31 AM" },
  { id: 5, action: "Published registration announcement", user: "Admin User", role: "Administrator", date: "2026-10-04", time: "8:30 AM" },
];

export default { users, students, organizers, events, registrations, announcements, notifications, activityLogs };
