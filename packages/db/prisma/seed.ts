import { PrismaClient, PaymentMethod, PaymentFrequency, AttendanceStatus, ItemCondition, ResourceType } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding Avulix Demo database...");

  // ── 1. Demo School ────────────────────────────────────────────────────────
  const school = await prisma.school.upsert({
    where: { id: "demo-school-001" },
    update: {},
    create: {
      id: "demo-school-001",
      name: "Avulix Demo School",
      emis: "DEMO001",
      province: "Gauteng",
      email: "info@demo.avulix.co.za",
      phone: "011 000 0000",
      address: "1 Education Drive, Johannesburg, 2001",
      website: "https://demo.avulix.co.za",
    },
  });
  console.log("✅ School created:", school.name);

  // ── 2. Admin User ────────────────────────────────────────────────────────
  const adminHash = await bcrypt.hash("Demo1234!", 12);
  const adminUser = await prisma.user.upsert({
    where: { schoolId_email: { schoolId: school.id, email: "admin@demo.avulix.co.za" } },
    update: {},
    create: {
      schoolId: school.id,
      name: "Admin User",
      email: "admin@demo.avulix.co.za",
      hashedPassword: adminHash,
      role: "SCHOOL_ADMIN",
      isActive: true,
    },
  });
  console.log("✅ Admin user created:", adminUser.email);

  // ── 3. Teacher User ───────────────────────────────────────────────────────
  const teacherHash = await bcrypt.hash("Demo1234!", 12);
  const teacherUser = await prisma.user.upsert({
    where: { schoolId_email: { schoolId: school.id, email: "teacher@demo.avulix.co.za" } },
    update: {},
    create: {
      schoolId: school.id,
      name: "Ms T. Nkosi",
      email: "teacher@demo.avulix.co.za",
      hashedPassword: teacherHash,
      role: "TEACHER",
      isActive: true,
    },
  });

  // Create staff record for teacher
  await prisma.staff.upsert({
    where: { userId: teacherUser.id },
    update: {},
    create: {
      schoolId: school.id,
      userId: teacherUser.id,
      staffNumber: "STF-001",
      department: "Mathematics",
      position: "Senior Teacher",
      hireDate: new Date("2020-01-15"),
      salary: 28500,
      status: "ACTIVE",
    },
  });
  console.log("✅ Teacher user created:", teacherUser.email);

  // ── 4. 10 Sample Students ─────────────────────────────────────────────────
  const studentsData = [
    { name: "Sipho Dlamini", grade: "Grade 4", dob: "2014-03-12", gender: "Male", guardian: "Thembi Dlamini", phone: "072 123 4567", email: "thembi.dlamini@gmail.com", adm: "ADM-2024-001" },
    { name: "Nomvula Khumalo", grade: "Grade 5", dob: "2013-07-08", gender: "Female", guardian: "Joseph Khumalo", phone: "083 234 5678", email: "joseph.khumalo@gmail.com", adm: "ADM-2024-002" },
    { name: "Lerato Mokoena", grade: "Grade 6", dob: "2012-11-25", gender: "Female", guardian: "Sarah Mokoena", phone: "079 345 6789", email: "sarah.mokoena@gmail.com", adm: "ADM-2024-003" },
    { name: "Thandeka Sithole", grade: "Grade 4", dob: "2014-05-30", gender: "Female", guardian: "Bongani Sithole", phone: "060 456 7890", email: "bongani.sithole@gmail.com", adm: "ADM-2024-004" },
    { name: "Lungelo Zulu", grade: "Grade 5", dob: "2013-02-14", gender: "Male", guardian: "Nonhlanhla Zulu", phone: "071 567 8901", email: "nonhlanhla.zulu@gmail.com", adm: "ADM-2024-005" },
    { name: "Ayanda Mthembu", grade: "Grade 6", dob: "2012-09-03", gender: "Male", guardian: "Lindiwe Mthembu", phone: "082 678 9012", email: "lindiwe.mthembu@gmail.com", adm: "ADM-2024-006" },
    { name: "Zanele Ndlovu", grade: "Grade 4", dob: "2014-12-18", gender: "Female", guardian: "Patrick Ndlovu", phone: "073 789 0123", email: "patrick.ndlovu@gmail.com", adm: "ADM-2024-007" },
    { name: "Mthokozisi Buthelezi", grade: "Grade 5", dob: "2013-04-22", gender: "Male", guardian: "Nokwanda Buthelezi", phone: "084 890 1234", email: "nokwanda.buthelezi@gmail.com", adm: "ADM-2024-008" },
    { name: "Precious Mahlangu", grade: "Grade 6", dob: "2012-06-10", gender: "Female", guardian: "David Mahlangu", phone: "065 901 2345", email: "david.mahlangu@gmail.com", adm: "ADM-2024-009" },
    { name: "Sibusiso Ntuli", grade: "Grade 4", dob: "2014-08-27", gender: "Male", guardian: "Gcinile Ntuli", phone: "076 012 3456", email: "gcinile.ntuli@gmail.com", adm: "ADM-2024-010" },
  ];

  const students = [];
  for (const s of studentsData) {
    const studentHash = await bcrypt.hash("Student123!", 10);
    const studentUser = await prisma.user.upsert({
      where: { schoolId_email: { schoolId: school.id, email: `${s.adm.toLowerCase()}@demo.avulix.co.za` } },
      update: {},
      create: {
        schoolId: school.id,
        name: s.name,
        email: `${s.adm.toLowerCase()}@demo.avulix.co.za`,
        hashedPassword: studentHash,
        role: "STUDENT",
        isActive: true,
      },
    });

    const student = await prisma.student.upsert({
      where: { userId: studentUser.id },
      update: {},
      create: {
        schoolId: school.id,
        userId: studentUser.id,
        admissionNumber: s.adm,
        grade: s.grade,
        dateOfBirth: new Date(s.dob),
        gender: s.gender,
        guardianName: s.guardian,
        guardianPhone: s.phone,
        guardianEmail: s.email,
        address: "Johannesburg, Gauteng",
        status: "ACTIVE",
      },
    });
    students.push(student);
  }
  console.log(`✅ Created ${students.length} students`);

  // ── 5. Fee Structures ──────────────────────────────────────────────────────
  const feeStructures = await Promise.all([
    prisma.feeStructure.create({
      data: {
        schoolId: school.id,
        name: "Term 1 Fees",
        description: "School fees for Term 1 (January - March)",
        amount: 4500,
        frequency: PaymentFrequency.QUARTERLY,
        isActive: true,
      },
    }),
    prisma.feeStructure.create({
      data: {
        schoolId: school.id,
        name: "Term 2 Fees",
        description: "School fees for Term 2 (April - June)",
        amount: 4500,
        frequency: PaymentFrequency.QUARTERLY,
        isActive: true,
      },
    }),
    prisma.feeStructure.create({
      data: {
        schoolId: school.id,
        name: "Registration Fee",
        description: "Annual registration and admin fee",
        amount: 800,
        frequency: PaymentFrequency.ANNUAL,
        isActive: true,
      },
    }),
  ]);
  console.log("✅ Fee structures created");

  // ── 6. Sample Fee Payments ─────────────────────────────────────────────────
  let seq = 1;
  const paymentsData = [
    { studentIdx: 0, feeIdx: 0, amount: 4500, method: PaymentMethod.EFT },
    { studentIdx: 1, feeIdx: 0, amount: 4500, method: PaymentMethod.CASH },
    { studentIdx: 2, feeIdx: 2, amount: 800, method: PaymentMethod.CARD },
    { studentIdx: 3, feeIdx: 0, amount: 2250, method: PaymentMethod.EFT },
    { studentIdx: 4, feeIdx: 2, amount: 800, method: PaymentMethod.EFT },
  ];

  for (const p of paymentsData) {
    const year = new Date().getFullYear();
    const receiptNumber = `AVX-${year}-${String(seq).padStart(5, "0")}`;
    await prisma.feePayment.create({
      data: {
        schoolId: school.id,
        studentId: students[p.studentIdx].id,
        feeStructureId: feeStructures[p.feeIdx].id,
        amount: p.amount,
        method: p.method,
        receiptNumber,
        reference: `REF${seq}`,
        recordedById: adminUser.id,
        paidAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      },
    });
    seq++;
  }
  console.log("✅ Fee payments created");

  // ── 7. Outstanding Debts ───────────────────────────────────────────────────
  await prisma.feeDebt.createMany({
    data: [
      {
        schoolId: school.id,
        studentId: students[5].id,
        feeStructureId: feeStructures[0].id,
        amount: 4500,
        paid: 0,
        dueDate: new Date("2024-03-31"),
        status: "OUTSTANDING",
      },
      {
        schoolId: school.id,
        studentId: students[6].id,
        feeStructureId: feeStructures[1].id,
        amount: 4500,
        paid: 1500,
        dueDate: new Date("2024-06-30"),
        status: "PARTIAL",
      },
    ],
  });
  console.log("✅ Fee debts created");

  // ── 8. Attendance Records (past 5 days) ───────────────────────────────────
  const today = new Date();
  const statuses = [AttendanceStatus.PRESENT, AttendanceStatus.PRESENT, AttendanceStatus.PRESENT, AttendanceStatus.ABSENT, AttendanceStatus.LATE];
  for (let d = 0; d < 5; d++) {
    const date = new Date(today);
    date.setDate(today.getDate() - d);
    date.setHours(0, 0, 0, 0);
    for (let i = 0; i < students.length; i++) {
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      await prisma.attendance.upsert({
        where: { studentId_date: { studentId: students[i].id, date } },
        update: {},
        create: {
          schoolId: school.id,
          studentId: students[i].id,
          date,
          status,
          recordedById: teacherUser.id,
        },
      });
    }
  }
  console.log("✅ Attendance records created");

  // ── 9. Inventory Items ─────────────────────────────────────────────────────
  await prisma.inventoryItem.createMany({
    data: [
      { schoolId: school.id, name: "Student Chairs", category: "Furniture", quantity: 120, condition: ItemCondition.GOOD, location: "Classrooms", supplier: "Educate Supplies SA", purchaseDate: new Date("2022-01-15"), purchasePrice: 450 },
      { schoolId: school.id, name: "Student Desks", category: "Furniture", quantity: 60, condition: ItemCondition.GOOD, location: "Classrooms", supplier: "Educate Supplies SA", purchaseDate: new Date("2022-01-15"), purchasePrice: 850 },
      { schoolId: school.id, name: "Desktop Computers", category: "Technology", quantity: 25, condition: ItemCondition.EXCELLENT, location: "Computer Lab", serialNumber: "COMP-LAB", supplier: "TechZone Johannesburg", purchaseDate: new Date("2023-06-01"), purchasePrice: 12000 },
      { schoolId: school.id, name: "Projector (Epson EB-X41)", category: "Technology", quantity: 4, condition: ItemCondition.GOOD, location: "Classrooms A1-A4", serialNumber: "PROJ-001", supplier: "AV Solutions", purchaseDate: new Date("2023-03-15"), purchasePrice: 8500 },
      { schoolId: school.id, name: "Interactive Whiteboards", category: "Technology", quantity: 3, condition: ItemCondition.EXCELLENT, location: "Grade 6 Classrooms", supplier: "SmartBoard SA", purchaseDate: new Date("2024-01-10"), purchasePrice: 25000 },
    ],
  });
  console.log("✅ Inventory items created");

  // ── 10. Library Resources ──────────────────────────────────────────────────
  const libResources = await prisma.libraryResource.createMany({
    data: [
      { schoolId: school.id, title: "Mathematics Grade 4 Learner Book", author: "DBE South Africa", type: ResourceType.BOOK, isbn: "978-1-234-56789-0", publisher: "Shuter & Shooter", year: 2022, quantity: 35, available: 28, location: "Shelf A1" },
      { schoolId: school.id, title: "English Home Language Grade 5", author: "Oxford University Press SA", type: ResourceType.BOOK, isbn: "978-0-987-65432-1", publisher: "OUP Southern Africa", year: 2023, quantity: 30, available: 25, location: "Shelf B2" },
      { schoolId: school.id, title: "South African Encyclopedia for Schools", author: "National Library", type: ResourceType.REFERENCE, publisher: "Lapa Publishers", year: 2021, quantity: 5, available: 5, location: "Reference Section" },
    ],
  });
  console.log("✅ Library resources created");

  // ── 11. Transport Route ────────────────────────────────────────────────────
  const route = await prisma.transportRoute.create({
    data: {
      schoolId: school.id,
      name: "Soweto Morning Route",
      driver: "Mr. Samuel Khoza",
      vehicle: "Toyota Quantum 16-seater",
      plate: "GP 123-456",
      isActive: true,
      stops: [
        { order: 1, name: "Meadowlands Station", time: "06:30" },
        { order: 2, name: "Phiri Shopping Centre", time: "06:45" },
        { order: 3, name: "Dlamini Taxi Rank", time: "07:00" },
        { order: 4, name: "Avulix Demo School", time: "07:20" },
      ],
    },
  });

  // Assign first 3 students to the route
  for (let i = 0; i < 3; i++) {
    await prisma.transportAssignment.create({
      data: {
        studentId: students[i].id,
        routeId: route.id,
      },
    });
  }
  console.log("✅ Transport route created");

  // ── 12. Audit Log Entries ──────────────────────────────────────────────────
  await prisma.auditLog.createMany({
    data: [
      { schoolId: school.id, userId: adminUser.id, action: "LOGIN", entity: "User", entityId: adminUser.id, ipAddress: "196.25.1.1" },
      { schoolId: school.id, userId: adminUser.id, action: "CREATE", entity: "Student", entityId: students[0].id, newValues: { name: students[0].id }, ipAddress: "196.25.1.1" },
      { schoolId: school.id, userId: adminUser.id, action: "CREATE", entity: "FeePayment", entityId: null, newValues: { amount: 4500 }, ipAddress: "196.25.1.1" },
      { schoolId: school.id, userId: teacherUser.id, action: "LOGIN", entity: "User", entityId: teacherUser.id, ipAddress: "196.25.1.2" },
      { schoolId: school.id, userId: teacherUser.id, action: "CREATE", entity: "Attendance", entityId: null, newValues: { date: new Date().toISOString() }, ipAddress: "196.25.1.2" },
    ],
  });
  console.log("✅ Audit log entries created");

  // ── 13. Sample Admissions ──────────────────────────────────────────────────
  await prisma.admissionApplication.createMany({
    data: [
      { schoolId: school.id, applicantName: "Khanya Molefe", grade: "Grade 4", gender: "Female", parentName: "Thabo Molefe", parentEmail: "thabo.molefe@gmail.com", parentPhone: "074 111 2222", status: "PENDING", submittedAt: new Date() },
      { schoolId: school.id, applicantName: "Siyanda Mkhize", grade: "Grade 5", gender: "Male", parentName: "Nompumelelo Mkhize", parentEmail: "nom.mkhize@gmail.com", parentPhone: "083 222 3333", status: "REVIEWING", submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
      { schoolId: school.id, applicantName: "Ayasha Patel", grade: "Grade 6", gender: "Female", parentName: "Priya Patel", parentEmail: "priya.patel@gmail.com", parentPhone: "011 333 4444", status: "ACCEPTED", submittedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), reviewedAt: new Date() },
    ],
  });
  console.log("✅ Admissions created");

  console.log("\n🎉 Seed completed successfully!");
  console.log("\nDemo credentials:");
  console.log("  Admin:   admin@demo.avulix.co.za / Demo1234!");
  console.log("  Teacher: teacher@demo.avulix.co.za / Demo1234!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
