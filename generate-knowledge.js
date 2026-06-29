const fs = require('fs');
const path = require('path');

const base = path.join(__dirname, 'knowledge', 'jobs');

const files = {
  'construction/site-engineer': `# Site Engineer

## Key Responsibilities
- Supervise daily construction activities on site to ensure work adheres to design specifications and safety standards
- Review and interpret engineering drawings, plans, and technical specifications
- Coordinate with subcontractors, suppliers, and site teams to maintain schedule
- Conduct regular site inspections and prepare progress reports for project management
- Monitor material quantities and ensure quality control on all construction works
- Identify and resolve technical issues on site in a timely manner
- Maintain accurate site records including daily logs, material delivery records, and labor reports

## Required Qualifications
- Bachelor's degree in Civil Engineering or related field
- 3–5 years of experience in construction site engineering
- Proficiency in AutoCAD and MS Project
- Strong knowledge of construction codes, safety regulations, and quality standards
- Familiarity with Egyptian construction standards and practices

## Core Competencies
- Technical problem-solving under pressure
- Clear communication with cross-functional site teams
- Attention to detail in documentation and quality checks
- Time management and schedule adherence
- Safety-first mindset`,

  'construction/project-manager': `# Construction Project Manager

## Key Responsibilities
- Plan, execute, and close construction projects within scope, budget, and timeline
- Develop detailed project schedules, resource plans, and risk mitigation strategies
- Lead and coordinate multidisciplinary teams including engineers, contractors, and consultants
- Monitor project expenditure against approved budgets and report variances
- Manage client relationships and serve as the primary point of contact throughout the project lifecycle
- Ensure all works comply with applicable codes, regulations, and quality standards
- Prepare and present project status reports to senior management and stakeholders

## Required Qualifications
- Bachelor's degree in Civil or Structural Engineering; PMP certification preferred
- 7–10 years of experience in construction project management
- Proven track record delivering large-scale infrastructure or building projects
- Proficiency in Primavera P6 or MS Project
- Strong knowledge of contract management and procurement processes

## Core Competencies
- Strategic planning and execution
- Stakeholder management and negotiation
- Financial acumen and budget control
- Leadership and team development
- Risk assessment and mitigation`,

  'construction/concrete-engineer': `# Concrete Engineer

## Key Responsibilities
- Design and oversee concrete mix designs to meet structural and durability requirements
- Supervise concrete pouring, curing, and finishing operations on site
- Conduct quality control tests including slump tests, cube tests, and compression tests
- Review shop drawings and ensure reinforcement placement conforms to structural drawings
- Investigate and diagnose concrete defects and recommend corrective measures
- Coordinate with structural engineers and site teams on formwork and shoring requirements
- Maintain records of all concrete works including pour logs and test results

## Required Qualifications
- Bachelor's degree in Civil Engineering with specialization in structural or materials engineering
- 3–6 years of experience in concrete construction or quality control
- Knowledge of ACI, BS, or Egyptian concrete standards
- Proficiency in structural analysis software

## Core Competencies
- Precision and technical accuracy
- Proactive quality control mindset
- Clear technical communication
- Problem-solving under site conditions`,

  'construction/technical-office-engineer': `# Technical Office Engineer

## Key Responsibilities
- Prepare and review technical submittals, shop drawings, and method statements
- Coordinate with design consultants to resolve technical queries and obtain approvals
- Maintain and control the document management system for all project drawings and specifications
- Prepare bills of quantities, cost estimates, and variation orders
- Track and follow up on RFIs (Requests for Information) and design clarifications
- Assist in preparing progress payment certificates and subcontractor claims
- Support the project manager with technical reporting and contractual correspondence

## Required Qualifications
- Bachelor's degree in Civil, Architectural, or Mechanical Engineering
- 3–5 years of experience in a technical office role on construction projects
- Proficiency in AutoCAD, Revit, and MS Office
- Strong understanding of contract documents, BOQ preparation, and cost control

## Core Competencies
- Meticulous documentation and record-keeping
- Cross-discipline coordination
- Analytical thinking for cost and quantity analysis
- Communication clarity with design and site teams`,

  'construction/electro-mechanical-engineer': `# Electro-Mechanical Engineer

## Key Responsibilities
- Supervise installation of electrical, mechanical, plumbing, and HVAC systems on construction projects
- Review MEP drawings and coordinate with civil and architectural teams to resolve clashes
- Ensure all electro-mechanical works comply with approved specifications and applicable codes
- Conduct inspections and testing and commissioning of MEP systems
- Coordinate with specialist subcontractors and equipment suppliers
- Prepare and review MEP submittals, material approvals, and method statements
- Monitor MEP works progress and report against project schedule

## Required Qualifications
- Bachelor's degree in Electrical or Mechanical Engineering
- 4–7 years of experience in MEP supervision on building or infrastructure projects
- Knowledge of IEE wiring regulations, ASHRAE standards, and Egyptian building codes
- Proficiency in AutoCAD MEP or Revit MEP

## Core Competencies
- Technical coordination across multiple disciplines
- Systematic commissioning and testing approach
- Safety compliance and risk awareness
- Collaborative problem-solving with site and design teams`,

  'construction/head-of-design': `# Head of Design

## Key Responsibilities
- Lead and manage the design department across all project disciplines including architecture, structure, and MEP
- Establish design standards, workflows, and quality review processes
- Oversee production of all design deliverables from concept through construction documentation
- Coordinate with clients, consultants, and authorities for design approvals and permitting
- Review and approve all design drawings, specifications, and technical submittals
- Manage design budgets, timelines, and team resource allocation
- Mentor and develop junior designers and engineers within the department

## Required Qualifications
- Bachelor's or Master's degree in Architecture or Engineering
- 10+ years of experience in design management on complex projects
- Registered with the Egyptian Engineering Syndicate
- Proficiency in BIM tools, AutoCAD, and Revit

## Core Competencies
- Design leadership and creative direction
- Cross-discipline technical coordination
- Client relationship management
- Strategic planning and resource management
- Quality assurance and standard-setting`,

  // ── EDUCATION (38 files) ─────────────────────────────────────────────────
  'education/teacher': `# Teacher / Subject Teacher

## Key Responsibilities
- Plan, prepare, and deliver engaging lessons aligned with the school curriculum and learning objectives
- Differentiate instruction to meet the diverse learning needs of all students
- Assess and evaluate student progress through formative and summative assessments
- Maintain an orderly, inclusive, and stimulating classroom environment
- Communicate regularly with parents and guardians regarding student progress and behavior
- Collaborate with colleagues on curriculum development, cross-subject projects, and school events
- Maintain accurate records of attendance, grades, and student performance data
- Participate in professional development activities and contribute to school improvement initiatives

## Required Qualifications
- Bachelor's degree in Education or subject specialization with a teaching qualification
- 2–5 years of classroom teaching experience, preferably in a British or international curriculum school
- Proficiency in Cambridge, IB, or equivalent international curriculum frameworks
- Strong command of English (additional Arabic language skills advantageous)

## Core Competencies
- Differentiated instruction and adaptive teaching
- Student engagement and motivational techniques
- Constructive feedback and assessment literacy
- Collaborative professional culture
- Cultural sensitivity and inclusive practice`,

  'education/hod': `# Head of Department (HOD)

## Key Responsibilities
- Lead the academic department and ensure the delivery of a high-quality, cohesive curriculum
- Observe and coach teachers within the department and conduct formal performance reviews
- Analyze student achievement data and implement targeted intervention strategies
- Develop and update schemes of work, assessment frameworks, and departmental policies
- Coordinate departmental resources including textbooks, materials, and equipment
- Represent the department in school leadership meetings and contribute to whole-school strategy
- Support the induction and professional development of new and early-career teachers
- Liaise with exam boards and external moderators for curriculum alignment and assessment integrity

## Required Qualifications
- Bachelor's degree in relevant subject area; postgraduate qualification preferred
- 5+ years of teaching experience with at least 2 years in a leadership or coordination role
- Strong knowledge of international curriculum frameworks (Cambridge, IB, or equivalent)
- Experience with data analysis and school improvement planning

## Core Competencies
- Instructional leadership and teacher coaching
- Curriculum design and quality assurance
- Data-driven decision making
- Team building and conflict resolution
- Strategic thinking aligned with school vision`,

  'education/ks-headmistress': `# Key Stage Headmistress

## Key Responsibilities
- Provide academic and pastoral leadership for a defined Key Stage (e.g., KS1, KS2, KS3)
- Monitor and evaluate the quality of teaching and learning across the Key Stage through observations and learning walks
- Analyze Key Stage assessment data and develop action plans to raise attainment
- Lead the transition process for students entering and leaving the Key Stage
- Manage parent communication and address concerns related to the Key Stage
- Coordinate with Heads of Department to ensure curriculum coherence across year groups
- Oversee student welfare, behavior management, and safeguarding within the Key Stage
- Contribute to whole-school leadership decisions as a member of the senior leadership team

## Required Qualifications
- Bachelor's degree in Education; Master's degree or leadership qualification preferred
- 7+ years of teaching experience with at least 3 years in a Key Stage leadership role
- Deep knowledge of age-appropriate curricula and international assessment standards

## Core Competencies
- Pedagogical leadership and instructional vision
- Stakeholder communication and parent engagement
- Student welfare and safeguarding expertise
- Data analysis and improvement planning
- Mentoring and professional development of staff`,

  'education/education-consultant': `# Education Consultant

## Key Responsibilities
- Provide expert advisory services to schools and educational institutions on curriculum design, teaching methodologies, and school improvement
- Conduct school audits, needs assessments, and gap analyses to identify areas for development
- Design and deliver professional development programs and training workshops for teaching staff
- Support schools in achieving accreditation, inspection readiness, and quality benchmarks
- Develop strategic improvement plans with clear targets, timelines, and success indicators
- Build and maintain relationships with school leadership, trustees, and governing bodies
- Prepare detailed reports and recommendations following consultancy engagements

## Required Qualifications
- Bachelor's degree in Education; Master's degree strongly preferred
- 8+ years of experience in education, including school leadership or senior advisory roles
- Proven track record of school improvement or curriculum consultancy
- Knowledge of international accreditation frameworks (BSO, CIS, AdvancED, or equivalent)

## Core Competencies
- Strategic advisory and analytical thinking
- Expert facilitation and presentation
- Relationship management with senior educational leaders
- Report writing and evidence-based recommendations
- Cross-cultural educational competence`,

  'education/principal': `# School Principal

## Key Responsibilities
- Provide visionary educational and operational leadership to the entire school community
- Develop and implement the school's strategic plan, annual goals, and school improvement agenda
- Oversee curriculum delivery, student achievement, and the professional performance of all staff
- Build a positive school culture grounded in high expectations, respect, and continuous improvement
- Serve as the primary liaison with the school board, parent community, and regulatory authorities
- Manage the school's annual budget, resource allocation, and financial reporting
- Recruit, develop, and retain high-quality teaching and administrative staff
- Ensure full compliance with national education regulations, health and safety, and safeguarding policies

## Required Qualifications
- Master's degree in Educational Leadership or related field
- 10+ years of educational experience including 5+ years in a senior leadership role
- Experience leading a British, American, or IB international school preferred
- Strong command of Arabic and English

## Core Competencies
- Transformational leadership and school culture building
- Strategic planning and institutional development
- Community engagement and stakeholder management
- Financial stewardship and resource optimization
- Safeguarding, compliance, and risk management`,

  'education/teaching-assistant': `# Teaching Assistant

## Key Responsibilities
- Support the class teacher in delivering lessons and providing individualized attention to students
- Work with small groups or individual students requiring additional academic or behavioral support
- Prepare classroom materials, displays, and learning resources as directed by the teacher
- Monitor and record student progress and report observations to the teacher
- Assist in maintaining a safe, organized, and supportive classroom environment
- Support students with special educational needs or learning differences as required
- Accompany students on field trips and school activities under teacher supervision
- Communicate professionally with parents and school staff when required

## Required Qualifications
- Diploma or Bachelor's degree in Education or a relevant field
- 1–3 years of experience working with children in an educational setting
- Basic knowledge of child development and learning support strategies
- Good written and verbal communication skills in English and Arabic

## Core Competencies
- Patience and empathy with children of all abilities
- Collaborative working with teaching staff
- Adaptability to varied classroom needs
- Observation and record-keeping
- Positive behavior support`,

  'education/floating-teacher': `# Floating Teacher

## Key Responsibilities
- Cover classes across multiple year groups and subject areas at short notice
- Maintain lesson continuity by following plans and materials left by the absent teacher
- Manage student behavior and maintain classroom order during cover sessions
- Deliver engaging lessons with minimal preparation time across a range of subjects
- Build positive relationships with students across all year groups
- Report any concerns or incidents to the relevant Head of Department or Key Stage leader
- Contribute to school activities, duties, and events as assigned

## Required Qualifications
- Bachelor's degree in Education or subject specialism with teaching qualification
- 2+ years of teaching experience across multiple year groups or subjects
- Strong classroom management skills and adaptability
- Good knowledge of the school's curriculum framework

## Core Competencies
- Adaptability and flexibility across subjects and year groups
- Strong classroom management without prior relationship-building
- Quick lesson uptake and resourcefulness
- Professional composure under unplanned conditions
- Positive rapport-building with diverse student groups`,

  'education/science-lab-technician': `# Science Lab Technician

## Key Responsibilities
- Prepare, set up, and dismantle laboratory equipment and materials for science lessons and experiments
- Maintain accurate records of chemical inventories, equipment registers, and safety data sheets
- Ensure the laboratory complies with all health, safety, and COSHH regulations at all times
- Inspect, service, and arrange repair or replacement of laboratory equipment as needed
- Dispose of chemical waste safely and in accordance with environmental regulations
- Assist teachers in planning and sourcing materials for practical science lessons
- Induct students in laboratory safety procedures and proper equipment use
- Support science teachers during practical sessions as directed

## Required Qualifications
- Diploma or Bachelor's degree in Science (Biology, Chemistry, Physics, or related)
- 2+ years of experience in a school or research laboratory setting
- Knowledge of COSHH regulations, chemical safety, and first aid

## Core Competencies
- Precision and systematic organization
- Safety-first mindset and regulatory compliance
- Proactive maintenance and equipment management
- Effective collaboration with science teaching staff
- Clear communication of safety protocols to students`,

  'education/homeroom-teacher': `# Homeroom Teacher

## Key Responsibilities
- Serve as the primary point of contact and pastoral caregiver for an assigned homeroom class
- Monitor student attendance, punctuality, and daily welfare
- Deliver the school's homeroom and personal development curriculum
- Maintain regular communication with parents regarding academic progress, behavior, and well-being
- Coordinate student records, report cards, and academic documentation
- Identify students at risk and refer them to the school counselor or pastoral team
- Foster a positive homeroom identity and class community spirit
- Support administrative tasks including collecting permissions, fees, and school communications

## Required Qualifications
- Bachelor's degree in Education or subject specialization
- 2+ years of teaching or pastoral care experience in a school setting
- Strong organizational skills and accurate record-keeping ability

## Core Competencies
- Pastoral care and student welfare focus
- Strong parent communication and relationship management
- Organizational accuracy in records and documentation
- Positive classroom community building
- Cultural sensitivity and inclusivity`,

  'education/stage-principal': `# Stage Principal

## Key Responsibilities
- Provide academic and pastoral leadership for a designated school stage (e.g., Primary, Preparatory, Secondary)
- Monitor teaching quality and student outcomes across all classes in the stage
- Support teachers through coaching, observation, and professional development conversations
- Manage stage-level student discipline and ensure consistent application of the behavior policy
- Coordinate parent communication, meetings, and information evenings for the stage
- Contribute to whole-school leadership decisions as a member of the senior leadership team
- Oversee stage-level events, trips, and enrichment activities
- Analyze stage-level assessment data and develop targeted improvement plans

## Required Qualifications
- Bachelor's degree in Education; Master's degree or leadership qualification preferred
- 7+ years of teaching experience with at least 3 years in a stage or department leadership role
- Knowledge of international curriculum and assessment frameworks

## Core Competencies
- Educational leadership and instructional coaching
- Stage-level data analysis and improvement planning
- Student welfare and disciplinary management
- Community engagement and parent relations
- Team leadership and staff development`,

  'education/assistant-stage-principal': `# Assistant Stage Principal

## Key Responsibilities
- Support the Stage Principal in managing the daily operations of the school stage
- Conduct lesson observations and provide constructive feedback to teachers
- Monitor student attendance, punctuality, and behavior within the stage
- Assist in coordinating stage-level assessments, reports, and parent communication
- Stand in for the Stage Principal during absences and represent the stage in school meetings
- Manage student discipline cases at the stage level and implement restorative practices
- Coordinate extracurricular activities, duties, and enrichment programs for the stage

## Required Qualifications
- Bachelor's degree in Education
- 5+ years of teaching experience with at least 1 year in a coordination or supervisory role
- Strong understanding of the school's curriculum and pastoral framework

## Core Competencies
- Instructional support and teacher coaching
- Student pastoral care and behavior management
- Administrative coordination and attention to detail
- Collaborative leadership alongside senior colleagues
- Parent engagement and professional communication`,

  'education/school-counselor': `# School Counselor

## Key Responsibilities
- Provide individual and group counseling to students addressing academic, social, emotional, and behavioral concerns
- Develop and implement the school's counseling and mental health support program
- Identify students at risk and coordinate with teachers, parents, and external specialists
- Support students through transitions, examinations, career planning, and university applications
- Deliver personal development workshops on topics such as stress management, study skills, and social awareness
- Maintain confidential student records in compliance with data protection and safeguarding policies
- Collaborate with the senior leadership team on whole-school well-being initiatives

## Required Qualifications
- Bachelor's or Master's degree in Psychology, Counseling, or Educational Psychology
- 3+ years of experience in school counseling or a related mental health support role
- Knowledge of child protection protocols and safeguarding requirements

## Core Competencies
- Empathetic listening and student-centered support
- Crisis intervention and de-escalation
- Confidentiality and professional ethics
- Collaboration with multi-disciplinary welfare teams
- Program design for well-being and prevention`,

  'education/school-doctor': `# School Doctor

## Key Responsibilities
- Provide primary medical care and first aid to students and staff on school premises
- Conduct routine health screenings, vaccinations, and medical assessments as required
- Maintain accurate student health records and manage chronic condition care plans
- Respond to medical emergencies and coordinate transfer to hospital when necessary
- Advise the school on health and hygiene policies, infectious disease control, and food safety
- Communicate with parents regarding student health conditions and medical referrals
- Support the school's well-being program with health education sessions for students

## Required Qualifications
- Medical degree (MBBCh or equivalent) registered with the Egyptian Medical Syndicate
- 3+ years of clinical experience; pediatric or school health experience preferred
- Valid first aid and emergency response certifications

## Core Competencies
- Clinical judgment and emergency response
- Clear communication with students, parents, and staff
- Confidentiality and medical ethics
- Preventive health and health promotion
- Organized management of medical records and care plans`,

  'education/head-of-enrollment': `# Head of Enrollment

## Key Responsibilities
- Develop and execute the school's student recruitment and enrollment strategy to meet annual intake targets
- Oversee the full admissions cycle from initial inquiry to enrollment confirmation
- Manage and develop the admissions team and ensure a consistently positive applicant experience
- Build relationships with feeder schools, real estate agents, embassies, and community partners
- Analyze enrollment data and market trends to inform recruitment campaigns and pricing decisions
- Coordinate open days, school tours, and community outreach events
- Collaborate with the marketing team on digital and print campaigns targeting prospective families

## Required Qualifications
- Bachelor's degree in Business, Marketing, or Education
- 5+ years of experience in admissions, enrollment management, or educational marketing
- Strong analytical skills and experience with CRM systems

## Core Competencies
- Strategic marketing and pipeline management
- Relationship-building with diverse stakeholders
- Data analysis and enrollment forecasting
- Team leadership and performance management
- Customer service excellence and family engagement`,

  'education/admissions-officer': `# Admissions Officer

## Key Responsibilities
- Handle all prospective family inquiries via phone, email, and walk-in visits in a professional and welcoming manner
- Guide families through the admissions process from initial contact to student placement
- Schedule and conduct school tours, assessment appointments, and orientation sessions
- Review student applications, academic records, and assessment results
- Maintain accurate records in the school's student information system
- Coordinate with the registrar, principal, and teaching staff for placement decisions
- Support open day events, community fairs, and school marketing activities

## Required Qualifications
- Bachelor's degree in Business Administration, Communication, or Education
- 2–4 years of experience in an admissions or customer service role
- Proficiency in school information systems (e.g., GEMS, iSAMS, or equivalent)
- Fluency in Arabic and English

## Core Competencies
- Welcoming and professional family engagement
- Organized follow-up and pipeline tracking
- Clear written and verbal communication
- Attention to detail in records management
- Collaborative coordination with school departments`,

  'education/registrar': `# Registrar

## Key Responsibilities
- Maintain and manage all official student academic records, transcripts, and enrollment documentation
- Process student registrations, transfers, withdrawals, and re-enrollments accurately and efficiently
- Issue official documents including transcripts, certificates, and enrollment confirmations
- Ensure student data in the school information system is accurate, complete, and up to date
- Coordinate with the Ministry of Education and examination bodies for registration and results submission
- Support the scheduling of examinations and manage examination entry processes
- Liaise with admissions, finance, and academic departments on student status and documentation

## Required Qualifications
- Bachelor's degree in Business Administration, Education, or related field
- 3+ years of experience in records management or school administration
- Proficiency in school management information systems
- High accuracy and attention to detail

## Core Competencies
- Meticulous records management and data accuracy
- Process compliance and regulatory awareness
- Confidentiality and data protection
- Organized multi-departmental coordination
- Calm and efficient handling of high-volume administrative tasks`,

  'education/receptionist': `# School Receptionist

## Key Responsibilities
- Serve as the first point of contact for all visitors, parents, students, and staff at the school reception
- Answer, screen, and direct incoming phone calls and emails professionally
- Manage visitor sign-in procedures and issue visitor passes in compliance with school safeguarding policy
- Handle student attendance records including late arrivals, early departures, and absence communications
- Assist with administrative tasks including data entry, mail handling, and filing
- Coordinate courier deliveries and maintain reception area tidiness
- Support administrative staff with ad-hoc tasks during peak periods

## Required Qualifications
- Diploma or Bachelor's degree in Business Administration or related field
- 2+ years of experience in a reception or front-of-house role, preferably in an educational setting
- Fluency in Arabic and English
- Proficiency in MS Office

## Core Competencies
- Professional and welcoming first impression
- Clear telephone and in-person communication
- Organized multitasking under busy conditions
- Discretion and safeguarding awareness
- Reliable and punctual with administrative accuracy`,

  'education/parent-liaison': `# Parent Liaison Officer

## Key Responsibilities
- Act as the primary communication bridge between the school and the parent community
- Facilitate parent engagement through meetings, newsletters, workshops, and events
- Address and resolve parent concerns in a timely, empathetic, and professional manner
- Support the admissions team in onboarding new families to the school community
- Organize and coordinate parent volunteer programs, parent association meetings, and community events
- Translate and interpret communications for non-English or non-Arabic speaking families when required
- Gather parent feedback through surveys and focus groups and report findings to leadership

## Required Qualifications
- Bachelor's degree in Communication, Education, or Social Work
- 3+ years of experience in a community relations, parent engagement, or communications role
- Fluency in Arabic and English; additional languages are an advantage

## Core Competencies
- Empathetic and culturally sensitive communication
- Conflict resolution and complaint handling
- Community relationship building
- Event organization and stakeholder engagement
- Clear written communication in Arabic and English`,

  'education/canteen-manager': `# Canteen Manager

## Key Responsibilities
- Oversee the daily operations of the school canteen including food preparation, service, and hygiene
- Plan and manage healthy, balanced menus appropriate for school-age students
- Ensure full compliance with food hygiene regulations and health and safety standards
- Manage canteen staff including scheduling, training, and performance monitoring
- Control food inventory, procurement, and supplier relationships to ensure quality and cost efficiency
- Handle cash operations and canteen revenue reporting accurately
- Coordinate special catering requirements for school events and functions

## Required Qualifications
- Diploma or degree in Catering, Hospitality, or Food Service Management
- 3+ years of experience in food service management, preferably in a school or institutional setting
- Valid food hygiene certification
- Knowledge of nutritional requirements for school-age children

## Core Competencies
- Food safety compliance and hygiene standards
- Team supervision and scheduling
- Menu planning and nutritional awareness
- Cost control and inventory management
- Customer service focus for students and staff`,

  'education/bus-driver': `# School Bus Driver

## Key Responsibilities
- Transport students safely between their homes and the school following approved routes and schedules
- Conduct pre-trip and post-trip vehicle inspections and report any mechanical issues immediately
- Maintain order and ensure student safety on the bus at all times
- Follow all traffic laws and school transportation policies strictly
- Communicate effectively with the transportation coordinator regarding route changes or delays
- Maintain accurate passenger records and report attendance to the school office
- Respond calmly and competently to emergencies, accidents, or medical incidents on the bus

## Required Qualifications
- Valid professional (commercial) driving license with a clean record
- 3+ years of professional driving experience; school bus experience preferred
- Knowledge of traffic laws and child transportation safety regulations
- First aid certification preferred

## Core Competencies
- Defensive and safety-first driving
- Calmness and responsibility with children on board
- Punctuality and route adherence
- Professional communication with parents and school staff
- Emergency response readiness`,

  'education/bus-monitor': `# Bus Monitor

## Key Responsibilities
- Accompany students on school buses to ensure their safety and discipline during transit
- Assist students in boarding and alighting the bus safely, with special attention to younger students
- Take and record student attendance at each pickup and drop-off point
- Manage student behavior on the bus and enforce the school's transportation code of conduct
- Communicate promptly with the bus driver and transportation coordinator regarding incidents or delays
- Assist students with special needs or mobility challenges during transit
- Maintain a calm and welcoming presence to reassure students on the bus

## Required Qualifications
- Secondary education certificate minimum; child care or education training preferred
- 1–2 years of experience working with children
- Basic first aid knowledge
- Fluency in Arabic; English language ability preferred

## Core Competencies
- Child supervision and safety awareness
- Calm and authoritative behavior management
- Punctual and reliable attendance
- Clear communication with drivers and school administration
- Empathy and patience with children of all ages`,

  'education/security-guard': `# Security Guard (School)

## Key Responsibilities
- Control access to the school premises and ensure only authorized individuals enter the campus
- Monitor CCTV systems and conduct regular patrol rounds of the school building and grounds
- Enforce the school's visitor management and safeguarding procedures at all entry points
- Respond promptly to security incidents, unauthorized access, or emergencies
- Coordinate with local authorities when required for serious security matters
- Maintain a daily security log and report all incidents to the school administration
- Support the safe arrival and departure of students during school hours

## Required Qualifications
- Secondary education; security guard certification or training preferred
- 2+ years of security experience, preferably in an educational or institutional setting
- Physically fit and able to remain alert throughout the shift

## Core Competencies
- Vigilance and situational awareness
- Professional and approachable manner with parents and visitors
- Adherence to safeguarding and access control protocols
- Clear and concise incident reporting
- Calm response to conflict or emergency situations`,

  'education/electrician': `# School Electrician

## Key Responsibilities
- Carry out electrical installation, maintenance, and repair work across school facilities
- Inspect and test electrical systems, circuits, and equipment for safety compliance
- Respond to electrical faults and breakdowns promptly to minimize disruption to school operations
- Install and maintain lighting, power outlets, AV systems, and emergency electrical systems
- Maintain accurate records of all electrical works completed and materials used
- Ensure all electrical work complies with the Egyptian Electricity Code and applicable safety standards
- Liaise with the facilities manager and external contractors for major electrical projects

## Required Qualifications
- Diploma in Electrical Engineering or equivalent trade qualification
- Valid electrician license/certification
- 3+ years of experience in commercial or institutional electrical maintenance
- Knowledge of electrical safety regulations and standards

## Core Competencies
- Technical precision and fault-finding ability
- Safety-first approach to electrical work
- Organized maintenance scheduling and record-keeping
- Effective communication with facilities management
- Reliability and responsiveness to urgent repairs`,

  'education/carpenter': `# School Carpenter

## Key Responsibilities
- Construct, install, repair, and maintain wooden fixtures, furniture, and fittings across school facilities
- Fabricate custom furniture, shelving, and display boards for classrooms and common areas
- Repair damaged doors, windows, flooring, and wooden structures throughout the campus
- Read and interpret technical drawings and specifications for carpentry works
- Maintain an inventory of carpentry materials and tools in good working order
- Assist the facilities team with general maintenance tasks when required
- Ensure all work areas are safe and clean during and after carpentry works

## Required Qualifications
- Trade certificate or vocational qualification in Carpentry or Joinery
- 3+ years of experience in carpentry, preferably in a school or institutional environment
- Proficiency with hand tools and power tools

## Core Competencies
- Precision craftsmanship and attention to detail
- Practical problem-solving for maintenance challenges
- Physical fitness for manual handling
- Time management and prioritization of repair tasks
- Safe use of tools and compliance with workshop safety`,

  'education/painter-decorator': `# Painter and Decorator (School)

## Key Responsibilities
- Prepare surfaces for painting by cleaning, sanding, filling, and priming as required
- Apply paint, varnish, and other finishes to interior and exterior surfaces across the school campus
- Carry out decorative finishes and signage on walls, doors, and notice boards
- Maintain the visual appearance and cleanliness of all painted surfaces throughout the school year
- Inspect facilities regularly for areas requiring repainting or touch-up work
- Manage paint stock and materials inventory efficiently
- Comply with health and safety standards when working with paints and chemicals

## Required Qualifications
- Trade certificate in Painting and Decorating or equivalent
- 2–4 years of experience in commercial or institutional painting
- Knowledge of surface preparation techniques and paint types

## Core Competencies
- Attention to visual detail and finish quality
- Physical fitness for working at heights and over extended periods
- Efficient time management across multiple work areas
- Compliance with safety regulations for chemicals and heights
- Professional presentation of school environment`,

  'education/handyman': `# School Handyman

## Key Responsibilities
- Perform a wide range of general maintenance and repair tasks across school facilities
- Respond to maintenance requests for plumbing, carpentry, painting, and minor electrical work
- Conduct routine preventive maintenance checks on school buildings and equipment
- Maintain the grounds including pathways, outdoor furniture, and general campus cleanliness
- Assist specialist contractors with access and support during larger maintenance projects
- Maintain a log of completed maintenance tasks and materials used
- Report major faults or safety concerns to the facilities manager promptly

## Required Qualifications
- Secondary education with vocational training in maintenance or a related trade
- 3+ years of experience as a handyman or general maintenance worker
- Basic knowledge of plumbing, electrical, carpentry, and painting

## Core Competencies
- Versatility across multiple maintenance trades
- Proactive identification of maintenance needs
- Reliable and responsive to urgent repair requests
- Physical fitness and manual dexterity
- Safety awareness in all maintenance activities`,

  'education/cleaner': `# School Cleaner

## Key Responsibilities
- Clean and sanitize classrooms, corridors, restrooms, offices, and common areas according to daily cleaning schedules
- Sweep, mop, and vacuum all floor surfaces to maintain cleanliness standards
- Empty waste bins and dispose of refuse in accordance with school waste management procedures
- Clean and disinfect high-touch surfaces including desks, door handles, and light switches
- Replenish restroom supplies including soap, paper, and sanitary items
- Report any damage, maintenance needs, or safety hazards to the facilities manager
- Assist with setup and cleanup for school events as required

## Required Qualifications
- Ability to read and follow cleaning schedules and instructions
- 1+ year of cleaning experience in a school, hotel, or institutional setting preferred
- Knowledge of cleaning products and their safe use

## Core Competencies
- Consistent thoroughness and attention to hygiene standards
- Reliability and punctuality
- Safe handling of cleaning chemicals
- Discretion when working in and around occupied classrooms
- Physical stamina for sustained manual activity`,

  'education/custodian': `# School Custodian

## Key Responsibilities
- Maintain the cleanliness, order, and security of the school building during and after school hours
- Open and secure the school building according to daily schedules
- Oversee and coordinate the cleaning team's daily tasks across the campus
- Manage storage of cleaning equipment, supplies, and consumables
- Assist with furniture arrangement for events, examinations, and assemblies
- Monitor and report building deficiencies, damage, or security concerns
- Support facilities management with minor repairs and maintenance tasks

## Required Qualifications
- Secondary education certificate
- 2–4 years of experience in custodial or facilities support in an educational or institutional setting
- Basic supervisory experience preferred

## Core Competencies
- Dependability and strong sense of responsibility
- Supervisory coordination of cleaning staff
- Physical fitness for varied manual duties
- Situational awareness for building security
- Professional conduct around students and staff`,

  'education/gardener': `# School Gardener

## Key Responsibilities
- Maintain all school gardens, lawns, flowerbeds, and outdoor planted areas in excellent condition
- Perform planting, pruning, weeding, mowing, and irrigation tasks according to seasonal schedules
- Apply fertilizers, pesticides, and herbicides safely and in compliance with health and safety guidelines
- Maintain gardening tools and equipment in good working order
- Support the creation of outdoor learning environments and green spaces for students
- Report irrigation faults or landscape damage to the facilities manager
- Assist with setup and beautification of outdoor areas for school events

## Required Qualifications
- Vocational training or practical experience in horticulture or landscaping
- 2+ years of experience in grounds maintenance, preferably in a school or institutional setting
- Knowledge of plants, irrigation systems, and pest management

## Core Competencies
- Horticultural knowledge and seasonal planning
- Physical fitness for outdoor work in varying weather conditions
- Safety compliance in use of chemicals and machinery
- Attention to aesthetic detail and campus presentation
- Reliability and consistency in routine grounds maintenance`,

  'education/swimming-pool-attendant': `# Swimming Pool Attendant

## Key Responsibilities
- Supervise students during swimming lessons and recreational pool sessions to ensure safety
- Monitor water quality and maintain chemical balance through regular testing and treatment
- Carry out routine cleaning of the pool, changing rooms, and surrounding areas
- Inspect pool equipment including pumps, filters, and safety equipment and report faults
- Enforce pool rules and safety protocols at all times
- Assist the PE department with coordination of swimming programs
- Respond to aquatic emergencies and administer first aid when required

## Required Qualifications
- Lifeguard certification (RLSS or equivalent)
- 2+ years of experience as a pool attendant or lifeguard
- Knowledge of pool chemistry and water treatment procedures
- First aid certification

## Core Competencies
- Constant vigilance and aquatic safety awareness
- Calm and decisive response in emergency situations
- Routine discipline in water quality testing and maintenance
- Clear and firm communication of pool rules to students
- Physical fitness and swimming proficiency`,

  'education/cashier': `# School Cashier

## Key Responsibilities
- Process school fee payments, canteen transactions, and activity charges accurately
- Issue receipts and maintain accurate daily cash and card transaction records
- Prepare daily cash reconciliation reports and submit to the finance department
- Handle parent inquiries regarding fees, payment plans, and account balances
- Manage petty cash and ensure secure handling and storage of all cash received
- Coordinate with the finance team on outstanding balances and payment follow-ups
- Maintain confidentiality of all financial transactions and student account information

## Required Qualifications
- Diploma or Bachelor's degree in Accounting, Finance, or Business Administration
- 2+ years of cashiering or accounts receivable experience
- Proficiency in point-of-sale systems and MS Excel
- High numerical accuracy and honesty

## Core Competencies
- Numerical accuracy and cash handling integrity
- Professional and patient parent service
- Organized financial record-keeping
- Confidentiality and financial ethics
- Calm management of transaction queues during peak periods`,

  'education/waiter': `# School Waiter / Canteen Server

## Key Responsibilities
- Serve meals and beverages to students and staff in the school canteen or dining hall
- Maintain cleanliness and hygiene of food service counters and dining area throughout service
- Assist the canteen kitchen team with food preparation and plating as directed
- Ensure proper food handling and storage procedures are followed at all times
- Restock food service stations and ensure adequate supply of utensils and condiments
- Assist with setup and clearance of canteen areas before and after service
- Report food quality concerns or equipment issues to the canteen manager

## Required Qualifications
- Secondary education; hospitality or food service training preferred
- 1–2 years of experience in a food service or catering environment
- Food hygiene awareness

## Core Competencies
- Courteous and efficient service to students and staff
- Food safety and hygiene compliance
- Physical stamina during service periods
- Teamwork in a fast-paced canteen environment
- Reliability and time management`,

  'education/photocopying-matron': `# Photocopying Matron

## Key Responsibilities
- Operate photocopiers, printers, and laminating machines to produce teaching materials and school documents
- Receive, prioritize, and fulfill copying requests from teaching and administrative staff efficiently
- Maintain quality control of all reproduced materials and ensure accurate quantities
- Manage paper stock, toner, and consumable supplies and coordinate replenishment with the purchasing team
- Maintain and perform basic servicing of photocopying equipment and arrange technical support when required
- Organize and file master copies and original documents securely
- Support the administrative team with document preparation and distribution tasks

## Required Qualifications
- Secondary education certificate
- 1–3 years of experience in an administrative or reprographics support role
- Familiarity with photocopiers, printers, and office equipment

## Core Competencies
- Accuracy in reproducing and organizing documents
- Efficient prioritization of multiple requests
- Reliability and punctuality in meeting teacher deadlines
- Basic equipment maintenance and troubleshooting
- Confidentiality with sensitive school documents`,

  'education/general-labour': `# General Labour (School)

## Key Responsibilities
- Perform a variety of manual tasks to support the daily operations and maintenance of the school campus
- Assist in moving furniture, equipment, and supplies between locations within the school
- Support facilities and maintenance teams with site preparation and cleanup
- Help set up venues for events, examinations, assemblies, and parent meetings
- Carry out basic outdoor maintenance tasks including sweeping, clearing, and waste disposal
- Respond to ad-hoc requests from the facilities manager and school administration
- Maintain assigned work areas in a clean, safe, and organized condition

## Required Qualifications
- Ability to follow instructions and complete physical tasks reliably
- Physical fitness required for manual labor throughout the workday
- Prior experience in a school, construction, or institutional setting preferred

## Core Competencies
- Physical stamina and reliability
- Willingness to assist across multiple departments
- Safe manual handling practices
- Punctuality and responsiveness to task assignments
- Cooperative teamwork with facilities and operations staff`,

  'education/administration-manager': `# Administration Manager (School)

## Key Responsibilities
- Oversee all administrative operations of the school including reception, records, communications, and office management
- Manage and develop a team of administrative and support staff
- Develop and improve administrative policies, procedures, and workflows for operational efficiency
- Coordinate school documentation including official correspondence, ministry submissions, and regulatory compliance
- Manage relationships with government authorities, suppliers, and external service providers
- Oversee procurement of office supplies, services, and administrative contracts
- Support the Principal with scheduling, reporting, and institutional governance matters

## Required Qualifications
- Bachelor's degree in Business Administration or related field
- 5–7 years of experience in administration with at least 2 years in a management role
- Experience in an educational institution preferred
- Proficiency in school management systems and MS Office

## Core Competencies
- Organizational leadership and process improvement
- Staff management and team development
- Regulatory compliance and government relations
- Strategic coordination across school departments
- Professional communication in Arabic and English`,

  'education/administrative-quality-manager': `# Administrative Quality Manager

## Key Responsibilities
- Design and implement quality management frameworks for all administrative processes in the school
- Conduct internal audits and process reviews to identify inefficiencies and non-compliance
- Develop and maintain standard operating procedures (SOPs) for all administrative functions
- Prepare the school for external accreditation, inspection, and quality assurance reviews
- Analyze administrative performance data and produce quality improvement reports for leadership
- Train staff on quality standards, documentation practices, and continuous improvement methodologies
- Lead corrective action plans following audit findings or process failures

## Required Qualifications
- Bachelor's degree in Business Administration, Quality Management, or Education
- 5+ years of experience in quality assurance or administrative management
- ISO certification or familiarity with quality management systems preferred
- Experience with educational accreditation bodies (BSO, CIS, AdvancED) advantageous

## Core Competencies
- Systematic quality assurance and audit methodology
- Process documentation and SOP development
- Analytical thinking and data-driven reporting
- Training design and staff capacity building
- Attention to compliance and standards`,

  'education/school-executive-officer': `# School Executive Officer

## Key Responsibilities
- Support the Principal and senior leadership team with strategic planning, governance, and institutional operations
- Prepare board reports, executive summaries, and official correspondence on behalf of the Principal
- Coordinate and minute senior leadership team meetings, board meetings, and parent association meetings
- Manage the school calendar, key deadlines, and senior leadership schedules
- Oversee cross-departmental projects and track progress against strategic objectives
- Maintain confidential executive records, contracts, and board documentation
- Serve as the institutional liaison with regulatory authorities, accreditation bodies, and partner organizations

## Required Qualifications
- Bachelor's degree in Business Administration or related field; MBA preferred
- 7+ years of experience in executive administration or institutional management
- Experience in an educational or non-profit leadership environment preferred
- Exceptional written communication in Arabic and English

## Core Competencies
- Executive-level administrative coordination
- Governance and board relations support
- Confidentiality and professional discretion
- Strategic project coordination and follow-through
- Clear and polished written and verbal communication`,

  'education/red-manager': `# RED Manager (Resources, Events, and Development)

## Key Responsibilities
- Plan and manage all school events including graduation ceremonies, open days, sports days, and cultural events
- Coordinate the allocation and maintenance of school resources and physical assets
- Lead institutional development projects including facility upgrades, new program launches, and community partnerships
- Manage event budgets, vendor contracts, and logistics coordination
- Develop sponsorship and community engagement opportunities to support school programs
- Produce post-event evaluation reports and recommendations for future improvements
- Coordinate with marketing, administration, and academic departments on cross-functional initiatives

## Required Qualifications
- Bachelor's degree in Event Management, Business Administration, or Education
- 5+ years of experience in events management, resource management, or institutional development
- Demonstrated ability to manage large-scale events with multiple stakeholders

## Core Competencies
- Strategic event planning and logistics management
- Resource allocation and asset management
- Stakeholder coordination and vendor management
- Budget management and cost control
- Creative problem-solving under time pressure`,

  // ── FINANCE-ACCOUNTING (10 files) ────────────────────────────────────────
  'finance-accounting/accountant': `# Accountant

## Key Responsibilities
- Maintain and reconcile general ledger accounts on a monthly, quarterly, and annual basis
- Prepare financial statements including income statements, balance sheets, and cash flow statements
- Process accounts payable and receivable transactions and ensure timely settlement
- Prepare and file tax returns in compliance with Egyptian tax regulations
- Conduct bank reconciliations and resolve discrepancies promptly
- Assist in the preparation of annual budgets and financial forecasts
- Support external auditors during annual audit engagements with documentation and analysis

## Required Qualifications
- Bachelor's degree in Accounting or Finance
- 3–5 years of accounting experience
- Knowledge of Egyptian Tax Authority requirements and Egyptian Accounting Standards
- Proficiency in accounting software (QuickBooks, SAP, or equivalent) and MS Excel

## Core Competencies
- Numerical accuracy and financial integrity
- Organized and deadline-driven work style
- Regulatory compliance awareness
- Analytical review of financial data
- Clear financial reporting communication`,

  'finance-accounting/finance-manager': `# Finance Manager

## Key Responsibilities
- Manage the full financial operations of the organization including accounting, budgeting, and reporting
- Prepare and present monthly, quarterly, and annual financial reports to senior management
- Develop and oversee annual budgets, financial forecasts, and variance analysis
- Ensure compliance with Egyptian accounting standards, tax regulations, and internal financial policies
- Lead the finance team and provide guidance, coaching, and performance management
- Manage cash flow, treasury operations, and banking relationships
- Coordinate external and internal audit processes and implement audit recommendations

## Required Qualifications
- Bachelor's degree in Accounting or Finance; CPA, CMA, or equivalent certification preferred
- 7+ years of finance experience including at least 2 years in a management role
- Strong knowledge of Egyptian Tax Law and IFRS or Egyptian Accounting Standards

## Core Competencies
- Financial leadership and team management
- Strategic financial planning and analysis
- Regulatory compliance and risk management
- Clear communication of financial insights to non-finance stakeholders
- Integrity and financial governance`,

  'finance-accounting/head-of-finance': `# Head of Finance

## Key Responsibilities
- Lead the finance function at the organizational or group level, overseeing all financial operations and reporting
- Develop and implement the organization's financial strategy in alignment with business objectives
- Provide financial analysis and strategic recommendations to the CEO and board of directors
- Oversee consolidated financial reporting, budgeting, and long-range financial planning
- Manage financial risk, treasury, and investment decisions
- Ensure full compliance with all statutory, regulatory, and fiscal obligations
- Lead, develop, and structure the finance department to meet organizational needs

## Required Qualifications
- Bachelor's or Master's degree in Finance, Accounting, or Business; CPA, CFA, or CMA required
- 10+ years of senior finance experience including group or holding company exposure
- Deep knowledge of IFRS, Egyptian Accounting Standards, and tax regulations

## Core Competencies
- Strategic financial vision and executive leadership
- Board-level financial communication and reporting
- Enterprise risk management and internal controls
- Financial talent management and department development
- Governance, compliance, and audit oversight`,

  'finance-accounting/internal-auditor': `# Internal Auditor

## Key Responsibilities
- Plan and execute internal audit assignments in accordance with the approved annual audit plan
- Evaluate the adequacy and effectiveness of internal controls across all business functions
- Identify operational, financial, and compliance risks and recommend corrective actions
- Prepare detailed audit reports with findings, root causes, and actionable recommendations
- Follow up on management's implementation of previous audit recommendations
- Conduct special investigations into suspected irregularities or fraud when required
- Support the development and maintenance of the organization's risk register

## Required Qualifications
- Bachelor's degree in Accounting, Finance, or Business; CIA or CPA preferred
- 3–5 years of internal or external audit experience
- Knowledge of IIA standards, risk management frameworks, and Egyptian regulations

## Core Competencies
- Analytical rigor and skeptical inquiry
- Objectivity and professional independence
- Clear and persuasive audit report writing
- Risk-based thinking and process evaluation
- Discreet handling of sensitive findings`,

  'finance-accounting/audit-department-head': `# Audit Department Head

## Key Responsibilities
- Lead and manage the internal audit function, including team management and audit plan development
- Present the annual risk-based audit plan to the audit committee or board for approval
- Oversee the quality and completeness of all audit engagements and deliverables
- Build relationships with senior management, external auditors, and regulatory bodies
- Ensure the internal audit function operates in accordance with IIA professional standards
- Drive continuous improvement of audit methodologies, tools, and reporting
- Provide independent assurance and advisory services to the board and senior leadership

## Required Qualifications
- Bachelor's or Master's degree in Accounting or Finance; CIA or CPA required
- 10+ years of audit experience with at least 4 years in an audit leadership role
- Experience with big-four audit firms or large institutional audit functions preferred

## Core Competencies
- Audit leadership and quality assurance
- Board and senior management communication
- Strategic risk assessment and audit planning
- Team development and professional mentoring
- Regulatory knowledge and independence`,

  'finance-accounting/cost-control-manager': `# Cost Control Manager

## Key Responsibilities
- Develop and maintain cost control systems, frameworks, and reporting mechanisms across operations
- Monitor actual expenditure against approved budgets and report variances with analysis and explanations
- Identify cost reduction opportunities and lead cross-functional cost optimization initiatives
- Review project cost plans, contracts, and purchase orders for financial accuracy and compliance
- Prepare detailed cost reports, forecasts, and cash flow analyses for management decision-making
- Coordinate with procurement, operations, and project teams on cost management strategies
- Ensure compliance with internal financial policies and approval authority matrices

## Required Qualifications
- Bachelor's degree in Finance, Accounting, or Engineering (for project-based organizations)
- 5–8 years of experience in cost control, financial analysis, or management accounting
- Proficiency in ERP systems and advanced MS Excel

## Core Competencies
- Financial analysis and cost modeling
- Variance analysis and root-cause investigation
- Cross-functional collaboration with operations and projects
- Clear and structured financial reporting
- Process improvement and systems thinking`,

  'finance-accounting/financial-affairs-manager': `# Financial Affairs Manager

## Key Responsibilities
- Manage all financial affairs of the organization including accounting operations, tax compliance, and regulatory reporting
- Serve as the key liaison with banks, investment institutions, and government financial authorities
- Oversee the preparation and submission of statutory financial statements and tax filings
- Develop financial policies, approval frameworks, and internal control systems
- Manage working capital, liquidity planning, and treasury operations
- Provide financial advisory support to management on investment decisions, contracts, and financial risks
- Lead the annual budgeting and financial planning cycle

## Required Qualifications
- Bachelor's or Master's degree in Finance or Accounting; CPA or equivalent preferred
- 8+ years of finance management experience
- Strong knowledge of Egyptian tax law, banking regulations, and financial reporting standards

## Core Competencies
- Regulatory and compliance expertise
- Institutional banking and treasury management
- Strategic financial advisory capability
- Leadership of finance operations and teams
- Executive-level communication and reporting`,

  'finance-accounting/bank-collections-accountant': `# Bank Collections Accountant

## Key Responsibilities
- Monitor and manage accounts receivable balances and follow up on overdue payments
- Reconcile bank statements and collections accounts on a daily and monthly basis
- Prepare and issue payment reminders, demand letters, and collection correspondence
- Coordinate with sales, customer service, and legal teams on dispute resolution and debt recovery
- Maintain accurate records of all collection activities, payment agreements, and settlement terms
- Prepare aging reports and collection performance dashboards for finance management
- Process received payments and ensure accurate allocation to customer accounts

## Required Qualifications
- Bachelor's degree in Accounting or Finance
- 2–4 years of experience in accounts receivable or bank collections
- Proficiency in accounting software and MS Excel
- Strong knowledge of banking procedures and payment systems

## Core Competencies
- Persistence and professional follow-up in collections
- Accurate and detailed accounts reconciliation
- Clear communication in collection correspondence
- Negotiation skills for payment plan agreements
- Integrity and confidentiality in financial dealings`,

  'finance-accounting/head-of-purchasing': `# Head of Purchasing

## Key Responsibilities
- Lead the purchasing and procurement function, developing strategies that ensure cost efficiency and supply continuity
- Negotiate contracts, pricing, and terms with strategic suppliers and vendors
- Develop and manage an approved vendor list and evaluate supplier performance regularly
- Establish and enforce purchasing policies, authorization frameworks, and procurement procedures
- Collaborate with department heads to plan procurement needs aligned with budget cycles
- Oversee import procedures, customs clearance, and logistics for internationally sourced goods
- Manage and develop the purchasing team's capabilities and performance

## Required Qualifications
- Bachelor's degree in Business, Supply Chain, or Engineering; CIPS or equivalent preferred
- 7+ years of purchasing or procurement experience including team management
- Experience with ERP purchasing modules (SAP, Oracle, or equivalent)

## Core Competencies
- Strategic sourcing and supplier relationship management
- Contract negotiation and commercial acumen
- Cross-functional collaboration with finance and operations
- Process governance and compliance oversight
- Team leadership and procurement talent development`,

  'finance-accounting/purchasing-officer': `# Purchasing Officer

## Key Responsibilities
- Process purchase requisitions and purchase orders in accordance with procurement policies
- Source and evaluate suppliers for goods and services required across departments
- Obtain and compare quotations to ensure best value for money
- Coordinate delivery schedules with suppliers and track order status to completion
- Maintain accurate procurement records, vendor files, and contract documentation
- Liaise with the receiving and warehouse teams to confirm accurate goods receipt
- Assist in maintaining the approved vendor list and conducting periodic supplier evaluations

## Required Qualifications
- Bachelor's degree in Business Administration, Supply Chain, or related field
- 2–4 years of purchasing or procurement experience
- Proficiency in ERP procurement modules and MS Excel
- Good negotiation and communication skills

## Core Competencies
- Organized procurement process management
- Supplier communication and negotiation
- Attention to detail in purchase documentation
- Cost-conscious decision-making
- Collaborative coordination with requesting departments`,

  // ── HEALTHCARE (3 files) ─────────────────────────────────────────────────
  'healthcare/doctor': `# Doctor / Physician

## Key Responsibilities
- Examine patients, diagnose medical conditions, and develop appropriate treatment plans
- Prescribe medications and monitor patient response to treatment
- Refer patients to specialist consultants when required and coordinate continuity of care
- Maintain accurate and complete patient medical records in compliance with privacy regulations
- Conduct health screenings, vaccinations, and preventive care programs
- Respond to medical emergencies within the facility and stabilize patients for transfer if needed
- Contribute to clinical governance, quality improvement, and continuing medical education

## Required Qualifications
- Medical degree (MBBCh) or equivalent registered with the Egyptian Medical Syndicate
- Board certification or specialist qualification in relevant specialty preferred
- 5+ years of clinical practice experience

## Core Competencies
- Clinical diagnostic accuracy and evidence-based practice
- Patient-centered communication and empathy
- Medical ethics and professional integrity
- Emergency preparedness and crisis response
- Collaborative practice within multidisciplinary teams`,

  'healthcare/nurse': `# Nurse

## Key Responsibilities
- Assess patient health conditions and implement nursing care plans under the direction of physicians
- Administer medications, treatments, and interventions accurately and safely
- Monitor patient vital signs and health status and report changes to the medical team
- Educate patients and families on medical conditions, medications, and post-care instructions
- Maintain accurate and up-to-date patient records and nursing documentation
- Coordinate with physicians, allied health professionals, and administrative staff for integrated care delivery
- Uphold infection control protocols and patient safety standards at all times

## Required Qualifications
- Bachelor's degree in Nursing; registration with the Egyptian Nursing Syndicate required
- 2–5 years of clinical nursing experience
- BLS/ACLS certification preferred
- Strong command of Arabic; English proficiency an advantage

## Core Competencies
- Clinical assessment and evidence-based care delivery
- Compassionate patient and family communication
- Attention to detail in medication administration and documentation
- Teamwork within a multidisciplinary healthcare environment
- Composure and effectiveness in high-pressure clinical situations`,

  'healthcare/hospital-administrator': `# Hospital Administrator

## Key Responsibilities
- Oversee the day-to-day operational management of hospital or clinic facilities and services
- Develop and implement operational policies, quality standards, and patient safety protocols
- Manage department heads across medical, nursing, and administrative functions
- Monitor and control the hospital's budget, resource allocation, and financial performance
- Ensure compliance with Ministry of Health regulations, accreditation requirements, and licensing standards
- Lead patient experience and service quality improvement initiatives
- Manage relationships with insurance companies, government health authorities, and community partners

## Required Qualifications
- Bachelor's or Master's degree in Healthcare Administration, Business Administration, or Medicine
- 7+ years of experience in hospital or healthcare operations management
- Knowledge of Egyptian Ministry of Health regulations and JCI/GAHAR accreditation standards preferred

## Core Competencies
- Healthcare operations leadership and systems thinking
- Regulatory compliance and quality management
- Financial stewardship of healthcare resources
- Multidisciplinary team leadership
- Patient safety culture and service excellence`,

  // ── HOSPITALITY (2 files) ────────────────────────────────────────────────
  'hospitality/hotel-manager': `# Hotel Manager

## Key Responsibilities
- Provide overall leadership for all hotel departments including front office, housekeeping, food and beverage, and maintenance
- Develop and implement strategies to maximize revenue, occupancy, and guest satisfaction scores
- Monitor and manage operational budgets, payroll, and departmental expenses
- Ensure all hotel operations comply with brand standards, safety regulations, and licensing requirements
- Recruit, train, and develop department heads and key hotel staff
- Handle escalated guest complaints and ensure swift and satisfactory resolution
- Build relationships with corporate clients, travel agents, and event organizers to drive business

## Required Qualifications
- Bachelor's degree in Hospitality Management or equivalent
- 8+ years of hotel experience including 3+ years in a senior management role
- Experience with Property Management Systems (PMS) such as Opera
- Fluency in Arabic and English; additional languages an advantage

## Core Competencies
- Revenue management and commercial acumen
- Guest experience leadership and service culture
- Cross-departmental operations management
- Financial management and cost control
- Talent development and team motivation`,

  'hospitality/front-desk-agent': `# Front Desk Agent

## Key Responsibilities
- Welcome and check in guests in a professional, warm, and efficient manner
- Handle room reservations, modifications, and cancellations through the property management system
- Process guest check-out accurately including billing, payment collection, and invoice issuance
- Respond to guest inquiries and resolve complaints promptly and professionally
- Coordinate with housekeeping, concierge, and maintenance teams to fulfill guest requests
- Maintain accurate records of room status, guest accounts, and daily occupancy reports
- Promote hotel services, upgrades, and local recommendations to enhance the guest experience

## Required Qualifications
- Diploma or Bachelor's degree in Hospitality or Tourism
- 1–3 years of experience in a front desk or guest services role
- Proficiency in Opera PMS or equivalent hotel management system
- Fluency in Arabic and English

## Core Competencies
- Warm and professional guest engagement
- Accuracy in billing and reservation management
- Problem-solving and complaint resolution
- Composure during high-occupancy periods
- Upselling and service promotion`,

  // ── LEGAL (3 files) ──────────────────────────────────────────────────────
  'legal/legal-counsel': `# Legal Counsel

## Key Responsibilities
- Provide comprehensive legal advice on corporate, commercial, employment, and regulatory matters
- Draft, review, and negotiate contracts, agreements, and legal documentation
- Represent the organization in legal proceedings, arbitration, and regulatory hearings
- Monitor changes in Egyptian law and regulations and advise management on compliance implications
- Manage relationships with external legal firms and control legal service costs
- Conduct legal due diligence on transactions, partnerships, and acquisitions
- Develop and deliver legal training and awareness programs for management and staff

## Required Qualifications
- Bachelor's degree in Law (LLB) from an accredited Egyptian university
- 5–8 years of legal experience in a corporate law environment or law firm
- Registration with the Egyptian Bar Association
- Fluency in Arabic and English with strong legal drafting skills in both languages

## Core Competencies
- Legal analysis and strategic advisory
- Contract drafting and negotiation
- Regulatory compliance and risk management
- Commercial acumen and business-oriented legal advice
- Professional integrity and confidentiality`,

  'legal/compliance-officer': `# Compliance Officer

## Key Responsibilities
- Develop, implement, and monitor the organization's compliance management framework and program
- Identify applicable regulatory requirements and ensure policies and procedures reflect current obligations
- Conduct compliance risk assessments and maintain the compliance risk register
- Design and deliver compliance training and awareness programs across the organization
- Investigate compliance breaches and incidents and recommend corrective and disciplinary actions
- Prepare compliance reports and present findings to senior management and the board
- Liaise with regulatory authorities including the Financial Regulatory Authority, Central Bank, or relevant sectoral regulators

## Required Qualifications
- Bachelor's degree in Law, Business, or Finance; compliance certification (ICA, CAMS, or equivalent) preferred
- 4–7 years of experience in compliance, legal, or risk management
- Strong knowledge of Egyptian regulatory frameworks applicable to the industry

## Core Competencies
- Regulatory knowledge and policy interpretation
- Risk identification and compliance monitoring
- Investigative thoroughness and objectivity
- Clear and confident reporting to senior leadership
- Training design and culture of compliance`,

  'legal/legal-affairs-manager': `# Legal Affairs Manager

## Key Responsibilities
- Manage all legal affairs of the organization including litigation, contracts, regulatory matters, and corporate governance
- Lead and develop the legal affairs team and manage external legal counsel relationships
- Review and approve all significant contracts, agreements, and legal documentation before execution
- Represent the organization before courts, arbitration panels, and regulatory authorities
- Advise the CEO and board on legal risks and strategic legal considerations
- Ensure the organization's corporate records, licenses, and statutory registrations are maintained and current
- Drive legal process improvements and implement legal risk management systems

## Required Qualifications
- Bachelor's degree in Law; Master's or LLM preferred
- 10+ years of legal experience including management of a legal team
- Registration with the Egyptian Bar Association
- Extensive knowledge of Egyptian corporate, commercial, and labor law

## Core Competencies
- Legal leadership and strategic advisory at board level
- Litigation management and courtroom advocacy
- Contract governance and risk mitigation
- Cross-functional legal advisory capability
- Integrity, discretion, and professional ethics`,

  // ── MANUFACTURING (2 files) ──────────────────────────────────────────────
  'manufacturing/production-manager': `# Production Manager

## Key Responsibilities
- Plan, coordinate, and control manufacturing processes to ensure products are produced efficiently and to quality standards
- Develop and monitor production schedules to meet delivery commitments and capacity targets
- Manage and develop the production workforce including supervisors, operators, and technicians
- Implement lean manufacturing principles and continuous improvement initiatives to reduce waste and improve throughput
- Oversee equipment maintenance programs to maximize uptime and minimize production disruption
- Ensure full compliance with occupational health, safety, and environmental regulations on the production floor
- Monitor production KPIs and report performance against targets to senior management

## Required Qualifications
- Bachelor's degree in Industrial, Mechanical, or Manufacturing Engineering
- 7+ years of production management experience in a manufacturing environment
- Knowledge of lean manufacturing, Six Sigma, or similar methodologies

## Core Competencies
- Operational leadership and workforce management
- Production planning and scheduling discipline
- Continuous improvement and problem-solving
- Safety culture and compliance enforcement
- Data-driven performance management`,

  'manufacturing/quality-control-engineer': `# Quality Control Engineer

## Key Responsibilities
- Develop and implement quality control plans, inspection procedures, and acceptance criteria for manufactured products
- Conduct incoming, in-process, and final product inspections to ensure conformance to specifications
- Analyze quality data and defect trends using statistical methods and produce corrective action reports
- Investigate customer complaints and non-conformances and lead root cause analysis activities
- Maintain the quality management system (QMS) in compliance with ISO 9001 or relevant standards
- Calibrate and maintain quality inspection instruments and testing equipment
- Train production staff on quality standards, inspection techniques, and defect identification

## Required Qualifications
- Bachelor's degree in Industrial, Mechanical, or Manufacturing Engineering
- 3–5 years of quality control experience in a manufacturing environment
- Knowledge of ISO 9001 QMS; certification in quality (CQE or equivalent) preferred
- Proficiency in statistical process control (SPC) and quality tools (8D, FMEA, etc.)

## Core Competencies
- Precision inspection and measurement discipline
- Root cause analysis and corrective action expertise
- Statistical quality thinking and data interpretation
- Clear technical communication with production and management teams
- Continuous improvement orientation`,

  // ── MARKETING-ADVERTISING (2 files) ─────────────────────────────────────
  'marketing-advertising/marketing-manager': `# Marketing Manager

## Key Responsibilities
- Develop and execute comprehensive marketing strategies aligned with business growth objectives
- Plan and oversee multi-channel marketing campaigns across digital, print, events, and outdoor channels
- Manage the marketing budget and allocate spend across channels to maximize return on investment
- Lead and develop the marketing team including designers, content creators, and digital specialists
- Oversee brand management and ensure consistent brand identity across all communications
- Analyze campaign performance using data and analytics tools and present insights to leadership
- Build and manage relationships with advertising agencies, media outlets, and creative partners

## Required Qualifications
- Bachelor's degree in Marketing, Business, or Communications
- 6–8 years of marketing experience with at least 2 years in a management role
- Proven track record in digital marketing, brand management, and campaign execution

## Core Competencies
- Strategic marketing planning and brand stewardship
- Campaign management and performance analysis
- Team leadership and creative direction
- Digital marketing and analytics proficiency
- Stakeholder communication and agency management`,

  'marketing-advertising/social-media-specialist': `# Social Media Specialist

## Key Responsibilities
- Develop and execute the organization's social media strategy across all relevant platforms
- Create, schedule, and publish engaging content including text, images, videos, and stories
- Monitor social media channels and respond to comments, messages, and mentions in a timely and professional manner
- Analyze social media performance metrics and prepare regular reports on reach, engagement, and follower growth
- Plan and manage paid social media campaigns including audience targeting and budget allocation
- Stay current with platform algorithm changes, emerging trends, and best practices in social media marketing
- Collaborate with the marketing team, designers, and external agencies on content campaigns

## Required Qualifications
- Bachelor's degree in Marketing, Communications, or Digital Media
- 2–4 years of experience managing social media accounts for a brand or agency
- Proficiency in social media management tools (e.g., Hootsuite, Buffer, Sprout Social)
- Strong content creation skills including basic graphic design and video editing

## Core Competencies
- Creative content development and brand storytelling
- Platform expertise (Instagram, Facebook, LinkedIn, TikTok)
- Community management and audience engagement
- Data analysis and performance reporting
- Trend awareness and agile content adaptation`,

  // ── REAL ESTATE (7 files) ────────────────────────────────────────────────
  'real-estate/property-manager': `# Property Manager

## Key Responsibilities
- Oversee the day-to-day management of residential or commercial properties in the portfolio
- Manage tenant relationships including lease administration, rent collection, and complaint resolution
- Coordinate maintenance, repairs, and facility improvements with contractors and service providers
- Conduct regular property inspections to assess condition and ensure standards are maintained
- Monitor occupancy rates and implement strategies to minimize vacancies
- Prepare and manage property operating budgets and financial reporting for owners or investors
- Ensure compliance with lease agreements, property regulations, and safety standards

## Required Qualifications
- Bachelor's degree in Business Administration, Real Estate, or Facility Management
- 4–7 years of property management experience
- Knowledge of Egyptian tenancy law and real estate market practices
- Proficiency in property management software

## Core Competencies
- Tenant relationship management and conflict resolution
- Financial management of property operating budgets
- Proactive maintenance planning and vendor oversight
- Occupancy optimization and leasing strategy
- Regulatory compliance and lease administration`,

  'real-estate/property-sales-consultant': `# Property Sales Consultant

## Key Responsibilities
- Generate leads and build a client pipeline through networking, referrals, and marketing channels
- Conduct property presentations, site visits, and client consultations to understand buyer needs
- Negotiate sale prices and terms with buyers and developers to close transactions
- Prepare sales agreements, reservation forms, and handover documentation
- Maintain an accurate CRM database of all prospects, leads, and active clients
- Stay current on market trends, new project launches, and competitor activity
- Achieve monthly, quarterly, and annual sales targets as set by management

## Required Qualifications
- Bachelor's degree in Business, Marketing, or related field
- 2–5 years of real estate sales experience
- Strong knowledge of the Egyptian real estate market, particularly new developments
- Valid real estate brokerage certification where required

## Core Competencies
- Persuasive sales ability and closing confidence
- Client needs assessment and consultative selling
- Market knowledge and property valuation awareness
- CRM discipline and lead follow-up consistency
- Negotiation and deal structuring`,

  'real-estate/landscape-manager': `# Landscape Manager

## Key Responsibilities
- Plan, design, and oversee the implementation and maintenance of landscaped areas within real estate developments
- Manage a team of landscaping technicians and gardeners and oversee contractor performance
- Develop and implement seasonal planting plans, irrigation schedules, and landscape maintenance programs
- Manage landscape budgets and procurement of plants, materials, and equipment
- Ensure all landscape works comply with project specifications, design standards, and safety requirements
- Coordinate with civil, architectural, and facility management teams on outdoor area works
- Inspect completed landscaping works and ensure quality meets developer and client expectations

## Required Qualifications
- Bachelor's degree in Landscape Architecture, Horticulture, or Civil Engineering
- 5+ years of experience in landscape management, preferably on large-scale real estate developments
- Knowledge of irrigation systems, plant species suited to Egyptian climate, and landscape construction

## Core Competencies
- Landscape design interpretation and quality oversight
- Team and contractor management
- Budget control and procurement efficiency
- Aesthetic judgment and attention to detail
- Cross-disciplinary coordination on development projects`,

  'real-estate/sales-manager': `# Sales Manager (Real Estate)

## Key Responsibilities
- Lead and manage the real estate sales team to achieve unit sales and revenue targets
- Develop and implement sales strategies, channel plans, and broker engagement programs
- Coach, train, and motivate sales consultants to continuously improve performance
- Monitor the sales pipeline, conversion rates, and team KPIs through CRM reporting
- Build and maintain relationships with key brokers, corporate clients, and high-net-worth individuals
- Collaborate with the marketing team on campaign development, lead generation, and events
- Provide market intelligence and competitor analysis to inform pricing and product development decisions

## Required Qualifications
- Bachelor's degree in Business, Marketing, or related field
- 7+ years of real estate sales experience with at least 2 years in team management
- Deep knowledge of the Egyptian real estate market and major developers

## Core Competencies
- Sales leadership and team performance management
- Pipeline management and revenue forecasting
- Broker relationship development and management
- Coaching and motivational leadership
- Market analysis and strategic sales planning`,

  'real-estate/real-estate-accountant': `# Real Estate Accountant

## Key Responsibilities
- Manage accounting records for real estate transactions, property portfolios, and development projects
- Process and record property sales, rental income, developer payments, and commission disbursements
- Prepare financial statements, project cost reports, and property-level profit and loss accounts
- Reconcile client reservation accounts, installment payment schedules, and handover settlements
- Ensure compliance with Egyptian tax regulations applicable to real estate transactions
- Coordinate with the legal and sales teams on contract financial terms and payment milestones
- Support the annual audit process with documentation and account analysis

## Required Qualifications
- Bachelor's degree in Accounting or Finance
- 3–5 years of accounting experience, preferably in real estate or construction
- Knowledge of real estate accounting practices and Egyptian tax treatment of property transactions
- Proficiency in ERP accounting systems and MS Excel

## Core Competencies
- Real estate transaction accounting accuracy
- Project cost tracking and financial reporting
- Regulatory compliance in property-related taxation
- Organized documentation and audit readiness
- Cross-functional coordination with legal and sales teams`,

  'real-estate/property-management-officer': `# Property Management Officer

## Key Responsibilities
- Assist the property manager in the day-to-day operational management of assigned properties
- Handle tenant inquiries, maintenance requests, and service complaints in a timely manner
- Process rental agreements, lease renewals, and tenant onboarding documentation
- Coordinate with maintenance contractors and service providers for repairs and scheduled works
- Conduct periodic property inspections and prepare condition reports
- Track rental payment collections and follow up on overdue accounts
- Maintain accurate property records, tenant files, and management reports

## Required Qualifications
- Bachelor's degree in Business Administration, Real Estate, or Facility Management
- 2–4 years of property management or facilities support experience
- Good organizational skills and familiarity with property management software

## Core Competencies
- Tenant service and relationship management
- Organized maintenance coordination and follow-up
- Accurate documentation and records management
- Reliable follow-through on payment collection
- Professional communication with tenants and contractors`,

  'real-estate/leasing-consultant': `# Leasing Consultant

## Key Responsibilities
- Market and lease residential or commercial units to prospective tenants through active lead generation and follow-up
- Conduct property showings and guide prospective tenants through available units and lease terms
- Prepare and process lease agreements, renewal documentation, and tenancy files
- Coordinate move-in procedures, unit handovers, and initial condition inspections with tenants
- Maintain an accurate database of leads, active tenants, and available inventory in the CRM
- Ensure high occupancy rates by proactively following up on renewals and minimizing vacancy periods
- Support the property manager with tenant communications and event coordination

## Required Qualifications
- Bachelor's degree in Business, Real Estate, or a related field
- 2–4 years of leasing or real estate sales experience
- Knowledge of Egyptian tenancy regulations and lease documentation

## Core Competencies
- Consultative sales and tenant needs assessment
- CRM discipline and lead management
- Lease documentation accuracy
- Customer service and tenant relationship management
- Market knowledge and occupancy optimization`,

  // ── RETAIL (3 files) ─────────────────────────────────────────────────────
  'retail/store-manager': `# Store Manager

## Key Responsibilities
- Lead all aspects of store operations including sales, customer service, inventory, and staff management
- Develop and execute strategies to achieve sales targets, margin goals, and customer satisfaction scores
- Recruit, train, schedule, and manage store staff including sales associates and cashiers
- Maintain merchandise display standards, product availability, and store visual presentation
- Monitor inventory levels, conduct stock takes, and manage shrinkage and loss prevention
- Handle customer escalations and resolve complaints to maintain customer loyalty
- Prepare and submit daily and weekly sales reports, KPIs, and operational updates to management

## Required Qualifications
- Bachelor's degree in Business, Retail Management, or related field
- 5+ years of retail experience including at least 2 years in store management
- Experience with point-of-sale systems and retail management software

## Core Competencies
- Retail operations leadership and commercial acumen
- Team management and staff development
- Customer experience excellence
- Inventory control and loss prevention
- Data-driven sales management and reporting`,

  'retail/sales-associate': `# Sales Associate

## Key Responsibilities
- Greet and assist customers in a professional, friendly, and knowledgeable manner
- Understand customer needs and recommend appropriate products to drive sales
- Process sales transactions accurately through point-of-sale systems
- Maintain product displays, stock replenishment, and store cleanliness standards
- Handle customer returns, exchanges, and complaints in accordance with store policy
- Meet individual sales targets and contribute to team and store performance goals
- Stay knowledgeable about current products, promotions, and store policies

## Required Qualifications
- High school diploma or equivalent; Bachelor's degree preferred
- 1–2 years of retail or customer-facing experience
- Good communication skills in Arabic and English
- Familiarity with POS systems

## Core Competencies
- Customer-focused and enthusiastic service
- Product knowledge and consultative selling
- Accuracy in transaction processing
- Teamwork and collaborative work ethic
- Reliability and punctuality`,

  'retail/mall-manager': `# Mall Manager

## Key Responsibilities
- Oversee the full operations of the shopping mall including tenant management, facilities, security, marketing, and customer experience
- Manage retailer relationships, lease compliance, and tenant performance to maximize mall occupancy and income
- Develop and execute the mall's marketing and events calendar to drive footfall and customer engagement
- Control the mall's operating budget, common area charges, and service contract costs
- Lead the mall management team across operations, security, housekeeping, and customer service
- Ensure the mall complies with all safety, fire, and building regulations
- Report on performance metrics including footfall, occupancy, and tenant sales to the board or owner

## Required Qualifications
- Bachelor's degree in Business Administration, Real Estate, or Facility Management
- 8+ years of retail or mall management experience
- Knowledge of Egyptian commercial tenancy law and shopping center industry standards

## Core Competencies
- Commercial property operations leadership
- Tenant relationship and lease management
- Marketing and customer experience strategy
- Multi-department team leadership
- Financial management and budget oversight`,

  // ── TECHNOLOGY (5 files) ─────────────────────────────────────────────────
  'technology/software-engineer': `# Software Engineer

## Key Responsibilities
- Design, develop, test, and deploy software applications and features in accordance with technical requirements
- Write clean, maintainable, and well-documented code following established coding standards and best practices
- Participate in code reviews and provide constructive technical feedback to peers
- Collaborate with product managers, designers, and other engineers in Agile development cycles
- Investigate, debug, and resolve software defects in development and production environments
- Contribute to technical architecture discussions and help evaluate technology choices
- Stay current with emerging technologies, frameworks, and software engineering practices

## Required Qualifications
- Bachelor's degree in Computer Science, Software Engineering, or related field
- 3–6 years of software development experience
- Proficiency in relevant programming languages (e.g., JavaScript/Node.js, Python, Java, or equivalent)
- Experience with cloud platforms (AWS, GCP, or Azure) and RESTful API design

## Core Competencies
- Technical problem-solving and algorithmic thinking
- Clean code principles and software craftsmanship
- Collaborative development in Agile teams
- Continuous learning and technology adaptability
- Communication of technical concepts to non-technical stakeholders`,

  'technology/it-manager': `# IT Manager

## Key Responsibilities
- Manage the organization's IT infrastructure, systems, and technology services to ensure reliability and security
- Lead and develop the IT team including system administrators, network engineers, and support technicians
- Develop and implement the IT strategy, architecture roadmap, and technology budget
- Oversee IT security including policies, vulnerability management, and incident response
- Manage relationships with technology vendors, service providers, and software licensors
- Ensure business continuity through robust backup, disaster recovery, and system redundancy planning
- Coordinate IT support services and ensure service level agreements and user satisfaction targets are met

## Required Qualifications
- Bachelor's degree in Computer Science, Information Technology, or Engineering
- 7+ years of IT experience with at least 3 years in a management role
- Relevant certifications (ITIL, CISSP, PMP, or equivalent) preferred

## Core Competencies
- IT leadership and team management
- Infrastructure architecture and systems administration
- Cybersecurity awareness and risk management
- Vendor management and contract negotiation
- Strategic IT planning aligned with business goals`,

  'technology/head-of-it': `# Head of IT

## Key Responsibilities
- Provide strategic leadership for the organization's technology function across infrastructure, applications, and digital transformation
- Develop and execute the multi-year IT strategy in alignment with organizational business objectives
- Lead the IT department and manage senior IT team members including IT Manager, developers, and architects
- Own the IT budget, investment planning, and technology procurement decisions
- Drive enterprise-wide digital transformation and technology adoption initiatives
- Establish and enforce IT governance, cybersecurity policies, and data protection frameworks
- Report to the C-suite on technology performance, risks, and strategic opportunities

## Required Qualifications
- Bachelor's or Master's degree in Computer Science, Information Technology, or Business Technology
- 12+ years of IT experience with at least 5 years in senior IT leadership
- Extensive knowledge of enterprise IT architecture, cloud strategy, and digital transformation

## Core Competencies
- Technology vision and digital transformation leadership
- IT governance, risk, and compliance management
- C-suite communication and IT strategy communication
- Enterprise architecture and systems integration
- Talent management and IT organizational development`,

  'technology/it-engineer': `# IT Engineer

## Key Responsibilities
- Install, configure, maintain, and troubleshoot servers, network infrastructure, and end-user devices
- Monitor system performance, availability, and security and respond proactively to alerts and incidents
- Provide Level 2 and Level 3 technical support to internal users and resolve escalated IT issues
- Manage Active Directory, user accounts, email systems, and access control
- Implement and maintain backup systems, antivirus, and endpoint security solutions
- Document system configurations, network diagrams, and IT procedures
- Assist in IT projects including infrastructure upgrades, migrations, and new system deployments

## Required Qualifications
- Bachelor's degree in Computer Science, IT, or Engineering; MCSE, CCNA, or equivalent preferred
- 3–5 years of experience in IT systems administration and network support
- Proficiency in Windows Server, VMware, networking protocols, and cloud services

## Core Competencies
- Systems troubleshooting and incident resolution
- Network and server administration
- Security awareness and endpoint protection
- Thorough documentation and knowledge management
- Responsive and professional user support`,

  'technology/data-analyst': `# Data Analyst

## Key Responsibilities
- Collect, clean, and analyze large datasets to identify trends, patterns, and actionable insights
- Develop dashboards, reports, and visualizations that communicate data findings to non-technical stakeholders
- Work with business units to understand analytical needs and translate them into data requirements
- Maintain and optimize data models, databases, and reporting pipelines
- Validate data accuracy and integrity across business systems and data sources
- Support data-driven decision-making by providing timely and accurate analysis
- Collaborate with IT and engineering teams on data infrastructure and analytics platform development

## Required Qualifications
- Bachelor's degree in Statistics, Mathematics, Computer Science, or related field
- 2–4 years of experience in data analysis or business intelligence
- Proficiency in SQL, Python or R, and BI tools (Power BI, Tableau, or equivalent)

## Core Competencies
- Analytical rigor and statistical thinking
- Data storytelling and visualization
- Business acumen and context-aware interpretation
- Attention to data quality and accuracy
- Collaborative communication with technical and business teams`,

  // ── OTHER / CROSS-INDUSTRY (29 files) ────────────────────────────────────
  'other/hr-manager': `# HR Manager

## Key Responsibilities
- Lead and manage all human resources functions including recruitment, onboarding, performance management, and employee relations
- Develop and implement HR policies and procedures aligned with Egyptian Labor Law and organizational values
- Partner with department heads on workforce planning, organizational design, and talent acquisition
- Oversee payroll coordination, benefits administration, and compensation benchmarking
- Manage the performance appraisal cycle and support managers in delivering effective performance conversations
- Handle employee relations matters including disciplinary procedures, grievances, and conflict resolution
- Drive employee engagement, retention, and organizational culture initiatives

## Required Qualifications
- Bachelor's degree in Human Resources, Business Administration, or related field
- 5–7 years of HR experience including at least 2 years in a management role
- Strong knowledge of Egyptian Labor Law (Law No. 12 of 2003) and Social Insurance regulations
- CIPD, SHRM, or equivalent HR certification preferred

## Core Competencies
- HR leadership and strategic business partnering
- Talent acquisition and workforce planning
- Employee relations and conflict resolution
- Labor law compliance and HR risk management
- HR data management and reporting`,

  'other/head-of-hr': `# Head of HR

## Key Responsibilities
- Lead the full HR function at the organizational level, setting strategy and driving people programs
- Develop the HR strategy aligned with the organization's long-term business plan
- Oversee talent acquisition, leadership development, succession planning, and total rewards
- Build and maintain a high-performance, values-driven organizational culture
- Advise the CEO and board on people strategy, workforce risks, and organizational effectiveness
- Lead and develop the HR team across all HR sub-functions
- Ensure full compliance with Egyptian Labor Law, social insurance, and employment regulations

## Required Qualifications
- Bachelor's or Master's degree in Human Resources, Business, or Organizational Psychology
- 12+ years of HR experience with at least 5 years in senior HR leadership
- Deep expertise in Egyptian Labor Law, organizational design, and talent management

## Core Competencies
- Strategic HR leadership and executive advisory
- Organizational culture and change management
- Total rewards and talent strategy
- Labor law mastery and HR governance
- HR team development and capability building`,

  'other/hr-executive': `# HR Executive

## Key Responsibilities
- Support the full employee lifecycle from recruitment coordination and onboarding to offboarding
- Post job vacancies, screen applications, schedule interviews, and coordinate offer letters
- Maintain employee records, contracts, and HR documentation accurately in the HRIS
- Assist with payroll preparation, attendance tracking, and leave management
- Support the implementation of HR policies, procedures, and employee communications
- Coordinate training schedules, employee engagement activities, and internal events
- Respond to employee inquiries on HR policies, benefits, and procedures

## Required Qualifications
- Bachelor's degree in Human Resources, Business Administration, or related field
- 2–4 years of HR generalist experience
- Knowledge of Egyptian Labor Law fundamentals
- Proficiency in HRIS systems and MS Office

## Core Competencies
- Organized HR administration and records management
- Professional and discreet employee communication
- Multitasking across concurrent HR processes
- Attention to detail in documentation and compliance
- Collaborative support to HR team and business managers`,

  'other/hr-officer': `# HR Officer

## Key Responsibilities
- Handle day-to-day HR administrative operations including documentation, filing, and employee correspondence
- Process employee contracts, amendments, and termination letters in compliance with Egyptian Labor Law
- Coordinate with the Social Insurance Authority and Labor Office for regulatory submissions and inspections
- Manage employee leave records, attendance monitoring, and monthly attendance reports
- Support the recruitment process by coordinating job postings, candidate screening, and interview logistics
- Assist in the preparation of monthly payroll data and benefit deductions
- Handle employee inquiries regarding policies, entitlements, and social insurance

## Required Qualifications
- Bachelor's degree in Business Administration, Law, or Human Resources
- 2–3 years of HR or personnel administration experience
- Solid working knowledge of Egyptian Labor Law and Social Insurance Law
- Proficiency in Arabic and MS Office

## Core Competencies
- Labor law compliance and government relations
- Meticulous record-keeping and documentation
- Employee communication and professional discretion
- Process adherence and deadline management
- Coordination with government labor and insurance bodies`,

  'other/benefits-officer': `# Benefits Officer

## Key Responsibilities
- Administer employee benefits programs including health insurance, life insurance, pension, and allowances
- Enroll and update employee benefit elections and maintain accurate benefits records
- Liaise with insurance providers and benefit vendors on policy renewals, claims, and queries
- Process employee claims for medical reimbursement, loan entitlements, and company benefit schemes
- Provide employees with clear information about available benefits and entitlements
- Ensure benefits programs comply with Egyptian Labor Law and contractual obligations
- Prepare benefits cost reports and assist in benefits benchmarking and annual renewal negotiations

## Required Qualifications
- Bachelor's degree in Business Administration or Human Resources
- 2–4 years of benefits administration or HR administration experience
- Knowledge of Egyptian Social Insurance Law and employee benefits practices

## Core Competencies
- Organized and accurate benefits administration
- Clear employee communication on benefits entitlements
- Vendor and provider relationship management
- Confidentiality in handling employee personal and financial information
- Compliance awareness in benefits processing`,

  'other/head-of-benefits': `# Head of Benefits

## Key Responsibilities
- Design, manage, and continuously improve the organization's total rewards and employee benefits strategy
- Lead the annual benefits renewal process including market benchmarking and cost negotiations with providers
- Oversee all benefits programs including health, insurance, pension, allowances, and special schemes
- Ensure benefits programs are competitive, legally compliant, and aligned with the organization's talent strategy
- Develop and implement employee communications and financial wellness programs
- Manage the benefits team and coordinate with payroll, finance, and HR business partners
- Report on benefits costs, utilization, and benchmarking data to senior management

## Required Qualifications
- Bachelor's or Master's degree in Human Resources, Business, or Finance
- 7+ years of compensation and benefits experience, including team management
- Deep knowledge of Egyptian Labor Law, Social Insurance, and market benefits practices

## Core Competencies
- Total rewards strategy and market benchmarking
- Benefits program design and vendor management
- Cost analysis and budget management
- Employee engagement through benefits communication
- Legal compliance and regulatory oversight`,

  'other/personnel-affairs-officer': `# Personnel Affairs Officer

## Key Responsibilities
- Manage all personnel affairs documentation including employment contracts, promotions, transfers, and terminations
- Coordinate with the Social Insurance Authority for employee registration, deregistration, and monthly submissions
- Handle all matters related to the Labor Office including inspections, filing, and correspondence
- Maintain accurate and up-to-date personnel files and employee records database
- Process employee entitlements including annual leave, sick leave, maternity leave, and other statutory benefits
- Prepare official HR letters, clearance certificates, and employment verification correspondence
- Support payroll preparation by providing accurate headcount, leave, and deduction data monthly

## Required Qualifications
- Bachelor's degree in Law or Business Administration
- 3–5 years of experience in personnel affairs or HR administration in Egypt
- Strong working knowledge of Egyptian Labor Law (No. 12 of 2003) and Social Insurance Law

## Core Competencies
- Egyptian Labor Law and Social Insurance Law expertise
- Government relations with Labor Office and Social Insurance Authority
- Meticulous documentation and record-keeping
- Professional confidentiality in personnel matters
- Process accuracy and compliance focus`,

  'other/hr-strategy-officer': `# HR Strategy Officer

## Key Responsibilities
- Support the development and implementation of the organization's HR strategic plan
- Conduct workforce analytics, talent gap analyses, and organizational effectiveness assessments
- Design and monitor HR strategy dashboards, KPIs, and reporting frameworks for senior leadership
- Research HR best practices, emerging trends, and industry benchmarks to inform strategic decisions
- Coordinate HR transformation and change management projects across the organization
- Prepare executive-level HR strategy presentations, reports, and board papers
- Collaborate with HR sub-functions to align programs with strategic priorities

## Required Qualifications
- Bachelor's or Master's degree in Human Resources, Organizational Development, or Business
- 5+ years of HR experience with exposure to strategy, OD, or HR analytics
- Strong analytical, research, and presentation skills

## Core Competencies
- Strategic HR thinking and analytical rigor
- Workforce planning and organizational design
- Data visualization and executive reporting
- Project management and cross-functional coordination
- Clear communication of complex HR insights to leadership`,

  'other/operations-manager': `# Operations Manager

## Key Responsibilities
- Oversee and optimize the day-to-day operational processes across the organization or assigned business unit
- Develop and implement operational policies, procedures, and workflow improvements
- Monitor operational KPIs and drive performance against targets for efficiency, quality, and cost
- Lead, manage, and develop a cross-functional operations team
- Collaborate with finance, HR, and commercial teams on resource planning and budgeting
- Identify operational risks and implement risk mitigation and business continuity measures
- Manage vendor and supplier relationships for operational services and ensure SLA compliance

## Required Qualifications
- Bachelor's degree in Business Administration, Engineering, or Operations Management
- 7+ years of operations experience including team management
- Knowledge of lean operations, process improvement, and project management

## Core Competencies
- Operational leadership and cross-functional coordination
- Process improvement and efficiency optimization
- KPI management and performance accountability
- Risk management and operational resilience
- Vendor management and service delivery oversight`,

  'other/chief-operating-officer': `# Chief Operating Officer (COO)

## Key Responsibilities
- Lead all operational functions of the organization with direct accountability to the CEO
- Translate the organization's strategic vision into operational plans, priorities, and budgets
- Oversee all business departments including operations, human resources, finance operations, and support functions
- Drive organizational performance, operational excellence, and cross-departmental alignment
- Build and lead a high-performance executive team and ensure effective succession planning
- Manage organizational risk, compliance frameworks, and business continuity planning
- Represent the organization with strategic partners, regulators, and investors as required

## Required Qualifications
- Bachelor's or Master's degree in Business Administration (MBA strongly preferred)
- 15+ years of progressive leadership experience with significant P&L responsibility
- Demonstrated track record of operational transformation and scale

## Core Competencies
- Executive operational leadership and organizational development
- Strategic planning and execution accountability
- Financial stewardship and performance management
- Stakeholder and board engagement
- Change management and organizational transformation`,

  'other/chief-administrative-officer': `# Chief Administrative Officer (CAO)

## Key Responsibilities
- Lead and oversee all administrative, facilities, and support functions of the organization
- Develop and implement administrative policies, governance frameworks, and internal controls
- Manage corporate affairs including legal, regulatory compliance, corporate communications, and government relations
- Oversee facilities management, procurement, and administrative service delivery across all locations
- Support the CEO and board with organizational governance, minutes, and institutional reporting
- Lead cross-functional administrative projects and change management initiatives
- Manage administrative budgets and ensure cost-effective delivery of support services

## Required Qualifications
- Bachelor's or Master's degree in Business Administration, Public Administration, or Law
- 12+ years of senior administrative or operational leadership experience
- Strong knowledge of Egyptian corporate governance, regulatory frameworks, and compliance

## Core Competencies
- Administrative leadership and institutional governance
- Corporate affairs and government relations
- Facilities and support services management
- Cross-functional leadership and organizational coordination
- Executive-level communication and board relations`,

  'other/business-development-manager': `# Business Development Manager

## Key Responsibilities
- Identify, develop, and close new business opportunities to achieve revenue growth targets
- Build and maintain a robust pipeline of prospective clients and partnerships
- Lead the preparation of proposals, RFP responses, presentations, and contract negotiations
- Develop and maintain relationships with key decision-makers, industry networks, and strategic partners
- Analyze market trends, competitor positioning, and customer needs to identify growth opportunities
- Collaborate with marketing, product, and operations teams to develop compelling value propositions
- Report on pipeline status, deal progression, and business development KPIs to senior leadership

## Required Qualifications
- Bachelor's degree in Business, Marketing, or related field
- 6–8 years of business development or B2B sales experience
- Demonstrated track record of closing significant deals and achieving revenue targets

## Core Competencies
- Strategic business development and market expansion
- Relationship-building and executive-level engagement
- Proposal writing and commercial negotiation
- Market analysis and competitive intelligence
- Collaborative deal coordination with internal teams`,

  'other/business-development-executive': `# Business Development Executive

## Key Responsibilities
- Generate new business leads through networking, cold outreach, digital channels, and industry events
- Conduct initial client meetings, needs assessments, and product or service presentations
- Prepare and follow up on proposals, quotations, and commercial offers
- Build and maintain relationships with prospective and existing clients in the assigned territory or sector
- Track and update CRM systems with accurate pipeline data, activities, and deal stages
- Coordinate with the marketing team on lead generation campaigns and sales collateral
- Support the Business Development Manager in achieving team revenue targets

## Required Qualifications
- Bachelor's degree in Business, Marketing, or Communications
- 2–4 years of sales or business development experience
- Proficiency in CRM tools and strong prospecting skills

## Core Competencies
- Proactive prospecting and lead generation
- Clear and persuasive client presentations
- Relationship initiation and nurturing
- CRM discipline and pipeline management
- Target-driven and resilient sales mindset`,

  'other/event-coordinator': `# Event Coordinator

## Key Responsibilities
- Plan and execute corporate events, conferences, training sessions, and internal functions from concept to completion
- Manage event logistics including venue booking, vendor coordination, catering, AV, and transport arrangements
- Develop and manage event budgets and ensure cost control throughout the planning process
- Coordinate invitations, registrations, and attendee communications for all events
- Liaise with marketing for event promotional materials, signage, and digital communications
- Supervise on-site event setup and manage operations during the event
- Prepare post-event evaluation reports including attendee feedback and budget reconciliation

## Required Qualifications
- Bachelor's degree in Event Management, Hospitality, Marketing, or Business Administration
- 3–5 years of event coordination or management experience
- Strong project management skills and vendor relationship capabilities

## Core Competencies
- Detailed event planning and project management
- Vendor negotiation and logistics coordination
- Budget management and cost control
- Composure and problem-solving on event day
- Stakeholder communication and guest management`,

  'other/inventory-controller': `# Inventory Controller

## Key Responsibilities
- Manage and monitor inventory levels to ensure adequate stock availability while minimizing excess and obsolescence
- Conduct regular cycle counts and annual physical stock counts and reconcile findings with system records
- Coordinate with procurement, warehouse, and sales teams on inventory replenishment and demand planning
- Identify slow-moving and obsolete inventory and recommend disposal or clearance actions
- Maintain accurate inventory records in the ERP system and ensure data integrity
- Prepare inventory reports, stock valuation summaries, and reorder point analysis
- Implement and enforce warehouse organization, FIFO practices, and stock labeling standards

## Required Qualifications
- Bachelor's degree in Business Administration, Supply Chain, or Accounting
- 3–5 years of inventory control or warehouse management experience
- Proficiency in ERP systems (SAP, Oracle, or equivalent) and MS Excel

## Core Competencies
- Inventory accuracy and stock reconciliation
- Demand planning and replenishment management
- Data integrity and ERP discipline
- Cross-functional coordination with operations and finance
- Analytical approach to stock optimization`,

  'other/purchasing-manager': `# Purchasing Manager

## Key Responsibilities
- Develop and implement the organization's procurement strategy to achieve cost savings and supply chain efficiency
- Manage strategic supplier relationships and lead contract negotiations for key categories
- Oversee the purchasing team's daily operations including PO processing, vendor evaluation, and delivery tracking
- Establish and maintain the approved vendor list and conduct regular supplier performance reviews
- Develop procurement policies, approval workflows, and spend management controls
- Collaborate with finance, operations, and project teams on procurement planning and budgeting
- Identify market trends and supply risks and develop mitigation strategies

## Required Qualifications
- Bachelor's degree in Business, Supply Chain, or Engineering; CIPS or equivalent preferred
- 6–8 years of purchasing experience including 2+ years in a management role
- Experience with ERP procurement modules and category management

## Core Competencies
- Strategic sourcing and supplier relationship management
- Procurement team leadership and development
- Negotiation and contract management
- Spend analysis and cost optimization
- Supply chain risk management`,

  'other/customer-service-manager': `# Customer Service Manager

## Key Responsibilities
- Lead and manage the customer service team to deliver exceptional customer experiences across all touchpoints
- Develop and implement customer service standards, scripts, and escalation procedures
- Monitor team performance through KPIs including response time, resolution rate, and customer satisfaction scores
- Handle escalated customer complaints and ensure resolution within defined service level agreements
- Analyze customer feedback data and develop service improvement initiatives
- Train, coach, and develop customer service representatives to enhance performance and career growth
- Collaborate with sales, operations, and product teams to resolve systemic customer issues

## Required Qualifications
- Bachelor's degree in Business Administration or Communications
- 5+ years of customer service experience with at least 2 years in management
- Proficiency in CRM and customer service platforms

## Core Competencies
- Customer-centric leadership and service culture
- Team management and performance coaching
- Complaint resolution and escalation management
- Data analysis and continuous service improvement
- Cross-functional collaboration and advocacy for customers`,

  'other/customer-service-representative': `# Customer Service Representative

## Key Responsibilities
- Respond to customer inquiries, complaints, and requests via phone, email, and chat in a professional and timely manner
- Accurately log all customer interactions and resolutions in the CRM system
- Resolve routine customer issues independently and escalate complex cases to senior staff
- Provide customers with accurate product, service, and policy information
- Follow up on pending customer cases to ensure full and satisfactory resolution
- Achieve individual KPIs including response time, resolution rate, and customer satisfaction scores
- Contribute to team knowledge base with common queries and resolution guidance

## Required Qualifications
- Bachelor's degree or equivalent; relevant customer service training preferred
- 1–3 years of customer service or call center experience
- Proficiency in CRM tools and MS Office
- Fluency in Arabic; good English communication skills

## Core Competencies
- Patient and empathetic customer communication
- Efficient problem resolution and follow-through
- Accurate documentation in CRM systems
- Composure under high call volume and difficult interactions
- Team collaboration and knowledge sharing`,

  'other/collection-representative': `# Collection Representative

## Key Responsibilities
- Contact customers with overdue accounts via phone, email, and written correspondence to secure payment
- Negotiate and agree payment plans with customers while adhering to collection policies
- Accurately record all collection activities, commitments, and payment arrangements in the system
- Escalate unresolved or high-risk accounts to the Head of Collection for legal or specialized follow-up
- Prepare daily and weekly collection activity reports and achievement against targets
- Coordinate with customer service and finance teams on disputed invoices and account queries
- Maintain professional and respectful conduct in all customer interactions

## Required Qualifications
- Bachelor's degree in Business, Finance, or related field
- 1–3 years of collections or accounts receivable experience
- Knowledge of Egyptian debt collection practices and customer communication protocols

## Core Competencies
- Persistence and professionalism in collection follow-up
- Negotiation and payment plan structuring
- Accurate record-keeping in collections systems
- Resilience in handling difficult customer conversations
- Target-driven performance orientation`,

  'other/head-of-collection': `# Head of Collection

## Key Responsibilities
- Lead the collections department and manage a team of collection representatives and supervisors
- Develop and implement collection strategies, policies, and escalation frameworks to maximize recovery rates
- Set team targets and monitor performance through aging reports, recovery rates, and collection KPIs
- Oversee the legal collections process and coordinate with legal counsel on court cases and debt recovery
- Analyze the delinquency portfolio and develop segment-specific collection tactics
- Build relationships with external collection agencies and legal firms for outsourced recovery
- Report to senior management on collections performance, provisions, and write-off recommendations

## Required Qualifications
- Bachelor's degree in Finance, Business, or Law
- 7+ years of collections experience with at least 3 years in team management
- Knowledge of Egyptian legal proceedings for debt recovery

## Core Competencies
- Collections leadership and team performance management
- Strategic portfolio analysis and recovery planning
- Legal collections coordination and escalation management
- Negotiation and high-value debt resolution
- Data-driven reporting and KPI management`,

  'other/after-sales-service-officer': `# After Sales Service Officer

## Key Responsibilities
- Manage all customer after-sales inquiries including warranty claims, service requests, and technical support
- Coordinate with technical teams, service centers, and spare parts departments to resolve customer issues
- Track and follow up on all open after-sales cases to ensure resolution within SLA timelines
- Maintain accurate records of service requests, warranty claims, and customer interactions
- Collect and analyze customer feedback on after-sales experience and report improvement opportunities
- Support the development and communication of after-sales service policies and warranty terms
- Build customer loyalty by delivering a positive and reliable after-sales experience

## Required Qualifications
- Bachelor's degree in Business Administration or relevant technical field
- 2–4 years of experience in after-sales service or technical customer support
- Knowledge of warranty management processes and service level management

## Core Competencies
- Customer satisfaction focus and problem resolution
- Organized case tracking and follow-up discipline
- Technical service coordination with internal teams
- Clear customer communication on service status
- Reliability and responsiveness in after-sales support`,

  'other/security-manager': `# Security Manager

## Key Responsibilities
- Develop and implement comprehensive security policies, procedures, and plans for all facilities
- Lead and manage a team of security supervisors and guards across multiple sites
- Conduct regular security risk assessments and recommend mitigation measures
- Oversee access control, CCTV, alarm systems, and perimeter security operations
- Investigate security incidents and prepare detailed incident reports and root cause analyses
- Coordinate emergency response plans, fire evacuation drills, and crisis management procedures
- Liaise with law enforcement agencies, civil defense, and regulatory authorities on security matters

## Required Qualifications
- Bachelor's degree in Security Management, Criminal Justice, or Military/Police background
- 8+ years of security experience including at least 3 years in a supervisory role
- Knowledge of Egyptian security regulations and emergency response frameworks

## Core Competencies
- Security risk assessment and strategic planning
- Team leadership and multi-site management
- Incident investigation and evidence management
- Emergency response and crisis management
- Stakeholder communication and regulatory liaison`,

  'other/govt-relations-security-manager': `# Government Relations & Security Manager

## Key Responsibilities
- Manage all government relations activities including licensing, regulatory compliance, and official correspondence
- Build and maintain strategic relationships with relevant government ministries, agencies, and authorities
- Monitor changes in laws, regulations, and government policies that may impact the organization
- Oversee security operations across organizational facilities in coordination with government security bodies
- Manage legal and official documentation for business registration, operating licenses, and permits
- Coordinate government relations for foreign employees including visas, work permits, and residency
- Represent the organization in government meetings, inspections, and official functions

## Required Qualifications
- Bachelor's degree in Law, Political Science, or Public Administration
- 8+ years of government relations or public affairs experience in Egypt
- Strong network of government contacts and understanding of Egyptian bureaucratic processes
- Fluency in Arabic and English

## Core Competencies
- Government relationship management and diplomatic communication
- Regulatory compliance and legal documentation expertise
- Security operations coordination with government bodies
- Strategic policy monitoring and risk advisory
- Professional integrity and discretion in sensitive government matters`,

  'other/transportation-facilities-coordinator': `# Transportation & Facilities Coordinator

## Key Responsibilities
- Coordinate and manage the organization's vehicle fleet and transportation services for staff and operations
- Schedule and supervise drivers, monitor routes, and optimize transportation logistics
- Manage facilities maintenance requests, track work orders, and coordinate with contractors and service providers
- Conduct periodic inspections of all facilities to assess maintenance needs and ensure safety standards
- Manage transportation and facilities budgets and ensure cost-effective service delivery
- Maintain records for vehicle registration, maintenance schedules, insurance, and roadworthiness
- Coordinate with HR and operations on staff transportation, business travel, and accommodation arrangements

## Required Qualifications
- Bachelor's degree in Business Administration, Facilities Management, or Engineering
- 4–6 years of experience in facilities management, transportation coordination, or operations support
- Knowledge of vehicle fleet management and facilities maintenance practices

## Core Competencies
- Logistics coordination and transportation scheduling
- Facilities maintenance oversight and contractor management
- Budget management and cost control
- Organized record-keeping and vendor documentation
- Problem-solving and responsive maintenance coordination`,

  'other/head-of-maintenance': `# Head of Maintenance

## Key Responsibilities
- Lead and manage the maintenance department across all facilities, equipment, and technical systems
- Develop and implement a preventive maintenance program to minimize equipment downtime and extend asset life
- Manage a team of maintenance technicians, engineers, and specialists across multiple disciplines
- Oversee reactive maintenance workflows and ensure rapid response to breakdowns and urgent repairs
- Control the maintenance budget, spare parts inventory, and maintenance service contracts
- Ensure all maintenance activities comply with health, safety, and regulatory standards
- Report on maintenance KPIs including uptime, cost, and response times to senior management

## Required Qualifications
- Bachelor's degree in Mechanical, Electrical, or Civil Engineering
- 10+ years of maintenance experience with at least 4 years in a management role
- Knowledge of CMMS (Computerized Maintenance Management Systems) preferred

## Core Competencies
- Maintenance leadership and team development
- Preventive maintenance strategy and asset management
- Budget control and cost optimization
- Technical problem-solving and engineering judgment
- Safety compliance and risk management`,

  'other/general-maintenance-manager': `# General Maintenance Manager

## Key Responsibilities
- Oversee all maintenance operations including civil, mechanical, electrical, and HVAC works across the organization's facilities
- Develop annual maintenance plans and budgets and monitor expenditure against approved plans
- Manage internal maintenance teams and external service contractors to deliver quality and timely maintenance
- Prioritize and resolve maintenance requests, emergencies, and scheduled maintenance tasks
- Ensure facilities meet safety, fire, and regulatory compliance standards at all times
- Maintain records of all maintenance activities, warranties, and asset registers
- Source and negotiate contracts with maintenance service providers and spare parts suppliers

## Required Qualifications
- Bachelor's degree in Engineering (Mechanical, Electrical, or Civil)
- 8+ years of facilities or general maintenance management experience
- Knowledge of building systems including HVAC, plumbing, electrical, and fire safety

## Core Competencies
- Multi-discipline facilities management
- Contractor and vendor management
- Maintenance planning and budget control
- Safety and regulatory compliance
- Responsive leadership in emergency situations`,

  'other/agricultural-supervisor': `# Agricultural Supervisor

## Key Responsibilities
- Supervise and coordinate all agricultural operations including planting, cultivation, irrigation, and harvesting
- Manage a team of farm workers and ensure adherence to planting schedules and crop management practices
- Monitor crop health and implement pest, disease, and weed control programs in accordance with agronomic best practices
- Manage irrigation systems, fertilization programs, and soil health management
- Maintain records of all agricultural activities including inputs, yields, and costs
- Ensure compliance with safety regulations for agricultural chemical handling and equipment use
- Coordinate with procurement on seed, fertilizer, and agricultural supply needs

## Required Qualifications
- Bachelor's degree in Agriculture or Agricultural Engineering
- 4–6 years of experience in agricultural operations or farm management
- Knowledge of Egyptian agricultural practices and crop production systems

## Core Competencies
- Agronomic knowledge and crop management expertise
- Team supervision and agricultural workforce management
- Practical problem-solving for crop and pest challenges
- Organized record-keeping and production reporting
- Safety awareness in agricultural chemical and machinery use`,

  'other/driver': `# Driver

## Key Responsibilities
- Transport personnel, goods, or official correspondence to designated locations safely and on time
- Maintain the assigned vehicle in clean, roadworthy, and serviced condition at all times
- Conduct pre-trip vehicle checks and report any mechanical issues or defects immediately
- Follow designated routes and plan efficient travel paths to meet schedules
- Maintain a professional and courteous manner with passengers and officials at all times
- Maintain accurate vehicle logs including mileage, fuel consumption, and trip records
- Comply with all traffic laws and organizational vehicle use policies

## Required Qualifications
- Valid Egyptian professional driving license (appropriate class for vehicle type)
- 3+ years of professional driving experience with a clean record
- Good knowledge of road networks in the relevant city or region
- Basic vehicle maintenance knowledge

## Core Competencies
- Defensive and safety-first driving
- Punctuality and reliability in meeting schedules
- Professional and discreet conduct with passengers
- Vehicle care and basic maintenance awareness
- Clear communication with dispatchers and supervisors`,
};

let created = 0;
for (const [relativePath, content] of Object.entries(files)) {
  const fullPath = path.join(base, relativePath + '.md');
  const dir = path.dirname(fullPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(fullPath, content, 'utf-8');
  created++;
}
console.log(`Created ${created} knowledge files.`);
