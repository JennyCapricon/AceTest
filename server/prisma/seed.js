import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 12);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@acetest.com' },
    update: {},
    create: {
      email: 'admin@acetest.com',
      password: hashedPassword,
      role: 'ADMIN',
      firstName: 'System',
      lastName: 'Admin',
    },
  });

  const teacher = await prisma.user.upsert({
    where: { email: 'teacher@acetest.com' },
    update: {},
    create: {
      email: 'teacher@acetest.com',
      password: hashedPassword,
      role: 'TEACHER',
      firstName: 'John',
      lastName: 'Doe',
      teacherProfile: {
        create: {
          school: 'AceTest High School',
          department: 'Science',
        },
      },
    },
  });

  const student = await prisma.user.upsert({
    where: { email: 'student@acetest.com' },
    update: {},
    create: {
      email: 'student@acetest.com',
      password: hashedPassword,
      role: 'STUDENT',
      firstName: 'Jane',
      lastName: 'Smith',
      studentProfile: {
        create: {
          school: 'AceTest High School',
          studentId: 'STU001',
          class: 'SS3',
        },
      },
    },
  });

  const subjectTopics = [
    {
      name: 'Mathematics',
      code: 'MATH101',
      description: 'General Mathematics',
      topics: ['Number and Numeration', 'Algebra', 'Geometry', 'Trigonometry', 'Statistics and Probability', 'Mensuration', 'Set Theory', 'Surds and Indices', 'Logarithms', 'Sequences and Series', 'Calculus Basics', 'Vectors', 'Matrices', 'Ratio, Proportion and Rates', 'Financial Arithmetic'],
    },
    {
      name: 'English Language',
      code: 'ENG101',
      description: 'English Language',
      topics: ['Comprehension', 'Summary Writing', 'Essay Writing', 'Letter Writing', 'Grammar', 'Parts of Speech', 'Tenses', 'Active and Passive Voice', 'Direct and Indirect Speech', 'Figures of Speech', 'Poetry', 'Prose', 'Drama', 'Oral English', 'Synonyms and Antonyms', 'Lexis and Structure'],
    },
    {
      name: 'Physics',
      code: 'PHY101',
      description: 'General Physics',
      topics: ['Measurement and Units', 'Motion', 'Forces', 'Work, Energy and Power', 'Heat and Temperature', 'Waves', 'Light and Optics', 'Sound', 'Electricity and Magnetism', 'Current Electricity', 'Electronics', 'Atomic and Nuclear Physics', 'Pressure', 'Gravitation', 'Simple Harmonic Motion'],
    },
    {
      name: 'Chemistry',
      code: 'CHE101',
      description: 'General Chemistry',
      topics: ['Matter', 'Atomic Structure', 'Chemical Bonding', 'Periodic Table', 'Acids, Bases and Salts', 'Oxidation and Reduction', 'Mole Concept', 'Stoichiometry', 'Gases', 'Water and Solutions', 'Organic Chemistry', 'Hydrocarbons', 'Electrolysis', 'Rate of Reaction', 'Chemical Equilibrium', 'Qualitative Analysis'],
    },
    {
      name: 'Biology',
      code: 'BIO101',
      description: 'General Biology',
      topics: ['Cell Structure and Function', 'Classification of Living Things', 'Plant and Animal Nutrition', 'Transport Systems', 'Respiration', 'Reproduction', 'Genetics and Heredity', 'Ecology', 'Evolution', 'Irritability and Coordination', 'Excretion', 'Growth', 'Support and Movement', 'Microorganisms and Diseases', 'Pollution and Conservation'],
    },
    {
      name: 'Agricultural Science',
      code: 'AGR101',
      description: 'Agricultural Science',
      topics: ['Meaning and Scope of Agriculture', 'Agricultural Ecology', 'Crop Production', 'Animal Production', 'Farm Machinery and Tools', 'Soil Science', 'Farm Management', 'Agricultural Economics', 'Fisheries', 'Forestry', 'Apiculture', 'Animal Health', 'Marketing of Agricultural Produce', 'Agricultural Extension'],
    },
    {
      name: 'Economics',
      code: 'ECO101',
      description: 'Economics',
      topics: ['Basic Concepts of Economics', 'Demand and Supply', 'Production', 'Cost and Revenue', 'Market Structures', 'National Income', 'Money and Banking', 'Inflation and Deflation', 'International Trade', 'Economic Development', 'Population', 'Unemployment', 'Public Finance', 'Agriculture and Industry', 'Economic Systems'],
    },
    {
      name: 'Government',
      code: 'GOV101',
      description: 'Government',
      topics: ['Basic Concepts in Government', 'Forms of Government', 'Constitution and Constitutionalism', 'Separation of Powers', 'Checks and Balances', 'Citizenship and Nationality', 'Political Parties', 'Elections and Electoral Systems', 'Public Administration', 'Local Government', 'International Relations', 'International Organizations', 'Nigerian Constitutional Development', 'Colonial Administration', 'Federalism'],
    },
    {
      name: 'Literature in English',
      code: 'LIT101',
      description: 'Literature in English',
      topics: ['Introduction to Literature', 'Genres of Literature', 'Prose Analysis', 'Poetry Analysis', 'Drama Analysis', 'Literary Devices', 'Themes and Characterization', 'African Literature', 'Non-African Literature', 'Oral Literature', 'Plot and Setting', 'Style and Diction'],
    },
    {
      name: 'Geography',
      code: 'GEO101',
      description: 'Geography',
      topics: ['Earth and the Solar System', 'Maps and Map Reading', 'Landforms', 'Weather and Climate', 'Vegetation', 'Population Geography', 'Settlement Geography', 'Agriculture and Land Use', 'Transportation', 'Economic Geography', 'Environmental Conservation', 'Rock Types and Formation', 'Rivers and Water Bodies', 'Ocean and Seas', 'Regional Geography'],
    },
    {
      name: 'Commerce',
      code: 'COM101',
      description: 'Commerce',
      topics: ['Introduction to Commerce', 'Trade', 'Retail and Wholesale Trade', 'Foreign Trade', 'Transportation', 'Communication', 'Warehousing', 'Insurance', 'Banking', 'Advertising', 'Consumer Protection', 'Business Environment', 'Business Units', 'E-Commerce', 'Trade Associations'],
    },
    {
      name: 'Financial Accounting',
      code: 'FIN101',
      description: 'Financial Accounting',
      topics: ['Bookkeeping and Accounting', 'Double Entry System', 'Ledger Accounts', 'Trial Balance', 'Final Accounts', 'Trading and Profit & Loss Account', 'Balance Sheet', 'Depreciation', 'Bank Reconciliation', 'Control Accounts', 'Partnership Accounts', 'Company Accounts', 'Correction of Errors', 'Journal and Source Documents', 'Cash Book and Petty Cash'],
    },
    {
      name: 'Civic Education',
      code: 'CIV101',
      description: 'Civic Education',
      topics: ['Citizenship', 'Rights and Duties of Citizens', 'Democracy', 'Rule of Law', 'National Consciousness', 'National Symbols', 'Cultism', 'Drug Abuse', 'Human Rights', 'Election and Voter Education', 'Constitutional Democracy', 'Social Justice', 'Patriotism'],
    },
    {
      name: 'Computer Science',
      code: 'CSC101',
      description: 'Computer Science',
      topics: ['Computer Fundamentals', 'Computer Hardware', 'Computer Software', 'Operating Systems', 'Word Processing', 'Spreadsheets', 'Databases', 'Networks and Internet', 'Programming Basics', 'Data Representation', 'Algorithms and Flowcharts', 'Computer Ethics', 'ICT in Society', 'System Development Life Cycle', 'Web Design Basics'],
    },
    {
      name: 'Further Mathematics',
      code: 'FMH101',
      description: 'Further Mathematics',
      topics: ['Logic and Set Theory', 'Polynomials', 'Inequalities', 'Binomial Theorem', 'Complex Numbers', 'Matrices and Determinants', 'Coordinate Geometry', 'Differentiation', 'Integration', 'Applications of Calculus', 'Mechanics', 'Force and Equilibrium', 'Motion in a Straight Line', 'Circular Motion', 'Probability Distributions'],
    },
    {
      name: 'Basic Science',
      code: 'BSC101',
      description: 'Basic Science (JSS)',
      topics: ['Living and Non-Living Things', 'Human Body Systems', 'Growth and Development', 'Soil and Agriculture', 'Environmental Science', 'Health and Hygiene', 'Energy', 'Force and Machines', 'Work and Energy', 'Heat and Light', 'Sound', 'Electrical Energy', 'Magnetism', 'Chemical Substances', 'Matter and Its Properties'],
    },
    {
      name: 'Basic Technology',
      code: 'BTE101',
      description: 'Basic Technology (JSS)',
      topics: ['Technology and Society', 'Materials and Their Properties', 'Woodwork', 'Metalwork', 'Electricity and Electronics', 'Technical Drawing', 'Building Construction', 'Workshop Safety', 'Machines and Tools', 'Automotive Technology', 'Plumbing', 'Craftsmanship', 'Career Opportunities in Technology'],
    },
    {
      name: 'Business Studies',
      code: 'BUS101',
      description: 'Business Studies (JSS)',
      topics: ['Introduction to Business', 'Office Practice', 'Bookkeeping Basics', 'Commerce Basics', 'Business Letters', 'Petty Cash', 'Simple Business Documents', 'Communication in Business', 'Marketing Basics', 'Consumer Issues', 'Career Opportunities in Business'],
    },
    {
      name: 'Christian Religious Studies',
      code: 'CRS101',
      description: 'Christian Religious Studies',
      topics: ['Creation and Covenant', 'Faith and Trust in God', 'The Life of Jesus Christ', 'The Parables of Jesus', 'The Miracles of Jesus', 'The Sermon on the Mount', 'The Passion, Death and Resurrection', 'The Early Church', 'The Apostles', 'Christian Living', 'Moral Teachings', 'Relationships and Social Issues'],
    },
    {
      name: 'Islamic Religious Studies',
      code: 'IRS101',
      description: 'Islamic Religious Studies',
      topics: ['The Quran', 'Articles of Faith', 'Pillars of Islam', 'Prophets of Islam', 'The Life of Prophet Muhammad', 'Islamic Law and Jurisprudence', 'Islamic Moral Teachings', 'Prayer and Worship', 'Fasting and Zakat', 'Hajj and Pilgrimage', 'Islamic History'],
    },
    {
      name: 'French',
      code: 'FRE101',
      description: 'French Language',
      topics: ['Greetings and Introductions', 'Numbers and Time', 'Family and Friends', 'Food and Drink', 'School and Education', 'Shopping and Money', 'Travel and Transport', 'Clothing and Colors', 'Weather and Seasons', 'Grammar Basics', 'Verb Conjugation', 'Conversation Practice', 'Comprehension', 'Culture and Customs'],
    },
    {
      name: 'Yoruba',
      code: 'YOR101',
      description: 'Yoruba Language',
      topics: ['Alphabet and Pronunciation', 'Greetings and Salutations', 'Numbers and Counting', 'Grammar and Sentence Structure', 'Verbs and Tenses', 'Proverbs and Idioms', 'Folktales and Oral Literature', 'Culture and Traditions', 'Poetry and Songs', 'Comprehension', 'Essay Writing', 'Names and Their Meanings'],
    },
    {
      name: 'Igbo',
      code: 'IGB101',
      description: 'Igbo Language',
      topics: ['Alphabet and Pronunciation', 'Greetings and Salutations', 'Numbers and Counting', 'Grammar and Sentence Structure', 'Verbs and Tenses', 'Proverbs and Idioms', 'Folktales and Oral Literature', 'Culture and Traditions', 'Poetry and Songs', 'Comprehension', 'Essay Writing', 'Names and Their Meanings'],
    },
    {
      name: 'Hausa',
      code: 'HAU101',
      description: 'Hausa Language',
      topics: ['Alphabet and Pronunciation', 'Greetings and Salutations', 'Numbers and Counting', 'Grammar and Sentence Structure', 'Verbs and Tenses', 'Proverbs and Idioms', 'Folktales and Oral Literature', 'Culture and Traditions', 'Poetry and Songs', 'Comprehension', 'Essay Writing', 'Names and Their Meanings'],
    },
    {
      name: 'History',
      code: 'HIS101',
      description: 'History',
      topics: ['Meaning and Importance of History', 'Nigerian Peoples and Kingdoms', 'Pre-Colonial Africa', 'Trans-Saharan Trade', 'Trans-Atlantic Slave Trade', 'Colonial Rule in Nigeria', 'Nationalism and Independence', 'Nigerian Civil War', 'The Federal Republic of Nigeria', 'Pan-Africanism', 'World Wars and Africa', 'Contemporary African History'],
    },
    {
      name: 'Data Processing',
      code: 'DTP101',
      description: 'Data Processing',
      topics: ['Introduction to Data Processing', 'Information and Communication Technology', 'Computer Hardware and Software', 'Data and Information', 'Data Storage', 'Data Processing Methods', 'Operating Systems', 'Word Processing', 'Spreadsheets', 'Databases and Records', 'Networks and Internet', 'Data Security', 'Presentations', 'Information Management'],
    },
    {
      name: 'Physical & Health Education',
      code: 'PHE101',
      description: 'Physical & Health Education',
      topics: ['Introduction to Physical Education', 'Human Body and Fitness', 'Athletics', 'Gymnastics', 'Team Sports', 'Combat Sports', 'Games and Recreation', 'Health and Hygiene', 'First Aid', 'Nutrition', 'Drug Education', 'Safety and Accident Prevention', 'Family Life Education'],
    },
    {
      name: 'Home Economics',
      code: 'HEC101',
      description: 'Home Economics',
      topics: ['Introduction to Home Economics', 'Food and Nutrition', 'Cooking Methods', 'Textiles and Clothing', 'Fashion and Design', 'Home Management', 'Household Budgeting', 'Child Care', 'Family Living', 'Interior Decoration', 'Food Preservation', 'Kitchen Safety and Hygiene'],
    },
    {
      name: 'Technical Drawing',
      code: 'TDR101',
      description: 'Technical Drawing',
      topics: ['Basic Drawing Skills', 'Geometric Construction', 'Lettering and Dimensioning', 'Orthographic Projection', 'Isometric Drawing', 'Perspective Drawing', 'Building Drawing', 'Mechanical Drawing', 'Electrical and Electronic Symbols', 'Freehand Sketching', 'Scale Drawing', 'Computer-Aided Design (CAD)'],
    },
    {
      name: 'Music',
      code: 'MUS101',
      description: 'Music',
      topics: ['Introduction to Music', 'Musical Notation', 'Rhythm and Time', 'Melody and Harmony', 'Musical Instruments', 'African Music', 'Western Music', 'Music History', 'Composition', 'Listening and Appreciation', 'Singing and Vocal Technique', 'Music Theory'],
    },
    {
      name: 'Fine Arts',
      code: 'FAR101',
      description: 'Fine Arts',
      topics: ['Introduction to Art', 'Elements and Principles of Design', 'Drawing and Sketching', 'Painting', 'Sculpture', 'Printmaking', 'Textile Design', 'Ceramics', 'Art History', 'African Art', 'Creative Expression', 'Art Criticism and Appreciation'],
    },
  ];

  const existingSubjects = await prisma.subject.findMany();
  const byName = new Map(existingSubjects.map((s) => [s.name, s]));
  const byCode = new Map(existingSubjects.map((s) => [s.code, s]));

  const seededSubjects = {};
  for (const subject of subjectTopics) {
    const { topics, ...subjectData } = subject;
    let created = byName.get(subject.name) || byCode.get(subject.code);
    if (created) {
      created = await prisma.subject.update({
        where: { id: created.id },
        data: subjectData,
      });
    } else {
      created = await prisma.subject.create({ data: subjectData });
    }
    seededSubjects[subject.name] = created;
    for (const topicName of topics) {
      await prisma.topic.upsert({
        where: { subjectId_name: { subjectId: created.id, name: topicName } },
        update: {},
        create: { name: topicName, subjectId: created.id },
      });
    }
  }

  const badges = [
    { name: 'First Exam', description: 'Completed your first exam', icon: '🎯', criteria: 'FIRST_EXAM' },
    { name: 'Perfect Score', description: 'Scored 100% on an exam', icon: '💯', criteria: 'PERFECT_SCORE' },
    { name: 'Quiz Master', description: 'Completed 5 exams', icon: '📚', criteria: 'FIVE_EXAMS' },
    { name: 'Exam Veteran', description: 'Completed 10 exams', icon: '🎓', criteria: 'TEN_EXAMS' },
    { name: '7-Day Streak', description: 'Maintained a 7-day streak', icon: '🔥', criteria: 'STREAK_7' },
    { name: 'Monthly Warrior', description: 'Maintained a 30-day streak', icon: '💪', criteria: 'STREAK_30' },
    { name: 'Century Club', description: 'Earned 100 points', icon: '⭐', criteria: 'POINTS_100' },
    { name: 'Point Legend', description: 'Earned 500 points', icon: '🏆', criteria: 'POINTS_500' },
  ];

  for (const badge of badges) {
    await prisma.badge.upsert({
      where: { name: badge.name },
      update: {},
      create: badge,
    });
  }

  console.log('Seed data created successfully');
  console.log({ admin: admin.email, teacher: teacher.email, student: student.email });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
