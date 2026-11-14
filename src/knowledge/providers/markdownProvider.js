const fs   = require('fs').promises;
const path = require('path');

const ROLE_MAP = {
  // Education
  'teacher': 'teacher', 'subject teacher': 'teacher',
  'hod': 'hod', 'head of department': 'hod',
  'ks headmistress': 'ks-headmistress', 'key stage headmistress': 'ks-headmistress',
  'education consultant': 'education-consultant',
  'principal': 'principal', 'school principal': 'principal',
  'teaching assistant': 'teaching-assistant', 'ta': 'teaching-assistant',
  'floating teacher': 'floating-teacher',
  'science lab technician': 'science-lab-technician',
  'science laboratory technician': 'science-lab-technician',
  'homeroom teacher': 'homeroom-teacher', 'homeroom': 'homeroom-teacher',
  'preschool english teacher': 'preschool-english-teacher',
  'pre-school english teacher': 'preschool-english-teacher',
  'kg english teacher': 'preschool-english-teacher',
  'kindergarten english teacher': 'preschool-english-teacher',
  'nursery english teacher': 'preschool-english-teacher',
  'early years english teacher': 'preschool-english-teacher',
  'french preschool teacher': 'french-preschool-teacher',
  'french pre-school teacher': 'french-preschool-teacher',
  'french kg teacher': 'french-preschool-teacher',
  'kindergarten french teacher': 'french-preschool-teacher',
  'french kindergarten teacher': 'french-preschool-teacher',
  'german preschool teacher': 'german-preschool-teacher',
  'german pre-school teacher': 'german-preschool-teacher',
  'german kg teacher': 'german-preschool-teacher',
  'kindergarten german teacher': 'german-preschool-teacher',
  'german kindergarten teacher': 'german-preschool-teacher',
  'arabic teacher y7': 'arabic-teacher-y7',
  'arabic teacher year 7': 'arabic-teacher-y7',
  'year 7 arabic teacher': 'arabic-teacher-y7',
  'arabic teacher': 'arabic-teacher-y7',
  'مدرس لغة عربية': 'arabic-teacher-y7',
  'مدرس اللغة العربية': 'arabic-teacher-y7',
  'معلم لغة عربية': 'arabic-teacher-y7',
  'english teacher y7': 'english-teacher-y7-british-curriculum',
  'english teacher year 7': 'english-teacher-y7-british-curriculum',
  'year 7 english teacher': 'english-teacher-y7-british-curriculum',
  'ks3 english teacher': 'english-teacher-y7-british-curriculum',
  'german head of department': 'german-head-of-department-international-school',
  'head of german': 'german-head-of-department-international-school',
  'head of german department': 'german-head-of-department-international-school',
  'german department head': 'german-head-of-department-international-school',
  'hod german': 'german-head-of-department-international-school',
  'german hod': 'german-head-of-department-international-school',
  // Early Years titles -> existing preschool files (plain and parenthesised forms; keys are matched literally)
  'english teacher early years': 'preschool-english-teacher',
  'english teacher (early years)': 'preschool-english-teacher',
  'english teacher (early years homeroom)': 'preschool-english-teacher',
  'french teacher early years': 'french-preschool-teacher',
  'french teacher (early years)': 'french-preschool-teacher',
  'preschool french teacher': 'french-preschool-teacher',
  'pre-school french teacher': 'french-preschool-teacher',
  'kg french teacher': 'french-preschool-teacher',
  'early years french teacher': 'french-preschool-teacher',
  'german teacher early years': 'german-preschool-teacher',
  'german teacher (early years)': 'german-preschool-teacher',
  'preschool german teacher': 'german-preschool-teacher',
  'pre-school german teacher': 'german-preschool-teacher',
  'kg german teacher': 'german-preschool-teacher',
  'early years german teacher': 'german-preschool-teacher',
  // Arabic KS3 and English KS3 / Year 7 variants -> existing Y7 files
  'arabic teacher ks3': 'arabic-teacher-y7',
  'arabic teacher key stage 3': 'arabic-teacher-y7',
  'english teacher ks3': 'english-teacher-y7-british-curriculum',
  'english teacher ks 3': 'english-teacher-y7-british-curriculum',
  'english teacher - ks3': 'english-teacher-y7-british-curriculum',
  'english teacher - ks 3': 'english-teacher-y7-british-curriculum',
  'english teacher - year 7': 'english-teacher-y7-british-curriculum',
  // Titles that are the same role as an existing file
  'head of admission': 'head-of-enrollment', 'head of admissions': 'head-of-enrollment',
  'admission officer': 'admissions-officer',
  'front desk officer': 'receptionist',
  'hr director': 'head-of-hr', 'human resources director': 'head-of-hr', 'director of hr': 'head-of-hr',
  'customer care': 'customer-service-representative', 'customer care manager': 'customer-service-manager',
  // Primary / secondary English
  'english teacher year 5': 'english-teacher-primary', 'english teacher - year 5': 'english-teacher-primary',
  'english teacher y5': 'english-teacher-primary',
  'english teacher year 3': 'english-teacher-primary', 'english teacher - year 3': 'english-teacher-primary',
  'english teacher year 4': 'english-teacher-primary', 'english teacher - year 4': 'english-teacher-primary',
  'english teacher year 6': 'english-teacher-primary', 'english teacher - year 6': 'english-teacher-primary',
  'english teacher ks2': 'english-teacher-primary', 'english teacher - ks2': 'english-teacher-primary',
  'english teacher - ks 2': 'english-teacher-primary',
  'primary english teacher': 'english-teacher-primary', 'primary school english teacher': 'english-teacher-primary',
  'english teacher high school': 'english-teacher-high-school', 'english teacher - high school': 'english-teacher-high-school',
  'high school english teacher': 'english-teacher-high-school',
  'reading teacher': 'reading-teacher',
  // Subject teachers
  'science teacher': 'science-teacher', 'science teachers': 'science-teacher',
  'math teacher': 'math-teacher', 'maths teacher': 'math-teacher', 'mathematics teacher': 'math-teacher',
  'ict teacher': 'ict-teacher', 'computing teacher': 'ict-teacher', 'computer science teacher': 'ict-teacher',
  'humanities teacher': 'humanities-teacher', 'social studies teacher': 'humanities-teacher',
  'german teacher': 'german-teacher',
  'arabic teacher lower primary': 'arabic-teacher-lower-primary', 'arabic teacher - lower primary': 'arabic-teacher-lower-primary',
  'arabic teacher primary': 'arabic-teacher-lower-primary', 'primary arabic teacher': 'arabic-teacher-lower-primary',
  'arabic social studies teacher': 'arabic-social-studies-teacher', 'arabic ss teacher': 'arabic-social-studies-teacher',
  'character building teacher': 'character-building-teacher', 'charcter building teacher': 'character-building-teacher',
  // Early Years / homeroom / support roles
  'eyfs co teacher': 'eyfs-co-teacher', 'eyfs co-teacher': 'eyfs-co-teacher',
  'eyfs homeroom teacher': 'eyfs-homeroom-teacher',
  'lower elementary homeroom teacher': 'lower-elementary-homeroom-teacher',
  'ks admin assistant': 'ks-admin-assistant', 'key stage admin assistant': 'ks-admin-assistant',
  'student management officer': 'student-management-officer',
  'marketing & admission officer': 'marketing-admission-officer', 'marketing and admission officer': 'marketing-admission-officer',
  'marketing admission officer': 'marketing-admission-officer', 'marketing & admissions officer': 'marketing-admission-officer',
  // Heads of department
  'head of arabic department': 'head-of-arabic-department', 'head of arabic': 'head-of-arabic-department',
  'arabic head of department': 'head-of-arabic-department', 'arabic department head': 'head-of-arabic-department',
  'arabic hod': 'head-of-arabic-department', 'arabic ss hod': 'head-of-arabic-department',
  'arabic social studies hod': 'head-of-arabic-department',
  'english head of department': 'english-head-of-department', 'head of english': 'english-head-of-department',
  'head of english department': 'english-head-of-department', 'english department head': 'english-head-of-department',
  'english hod': 'english-head-of-department',
  'pe head of department': 'pe-head-of-department', 'head of pe': 'pe-head-of-department',
  'head of physical education': 'pe-head-of-department', 'pe hod': 'pe-head-of-department',
  // Technology
  'technical pre-sales engineer': 'technical-pre-sales-engineer', 'technical pre sales engineer': 'technical-pre-sales-engineer',
  'technical presales engineer': 'technical-pre-sales-engineer', 'pre-sales engineer': 'technical-pre-sales-engineer',
  'pre sales engineer': 'technical-pre-sales-engineer', 'presales engineer': 'technical-pre-sales-engineer',
  'stage principal': 'stage-principal',
  'assistant stage principal': 'assistant-stage-principal',
  'school counselor': 'school-counselor', 'counselor': 'school-counselor',
  'school doctor': 'school-doctor',
  'head of enrollment': 'head-of-enrollment',
  'admissions officer': 'admissions-officer',
  'registrar': 'registrar',
  'receptionist': 'receptionist', 'school receptionist': 'receptionist',
  'parent liaison': 'parent-liaison',
  'canteen manager': 'canteen-manager',
  'bus driver': 'bus-driver', 'school bus driver': 'bus-driver',
  'bus monitor': 'bus-monitor',
  'security guard': 'security-guard',
  'electrician': 'electrician',
  'carpenter': 'carpenter', 'school carpenter': 'carpenter',
  'painter': 'painter-decorator', 'painter and decorator': 'painter-decorator',
  'handyman': 'handyman', 'school handyman': 'handyman',
  'cleaner': 'cleaner',
  'custodian': 'custodian', 'school custodian': 'custodian',
  'gardener': 'gardener',
  'swimming pool attendant': 'swimming-pool-attendant',
  'cashier': 'cashier',
  'waiter': 'waiter',
  'photocopying matron': 'photocopying-matron',
  'general labour': 'general-labour',
  'administration manager': 'administration-manager',
  'administrative quality manager': 'administrative-quality-manager',
  'school executive officer': 'school-executive-officer',
  'red manager': 'red-manager',
  'purchasing officer': 'purchasing-officer',
  // Finance
  'accountant': 'accountant', 'school accountant': 'accountant',
  'finance manager': 'finance-manager',
  'head of finance': 'head-of-finance',
  'internal auditor': 'internal-auditor',
  'audit department head': 'audit-department-head',
  'cost control manager': 'cost-control-manager',
  'financial affairs manager': 'financial-affairs-manager',
  'bank collections accountant': 'bank-collections-accountant',
  'head of purchasing': 'head-of-purchasing',
  // Technology
  'software engineer': 'software-engineer', 'developer': 'software-engineer',
  'it manager': 'it-manager',
  'head of it': 'head-of-it',
  'it engineer': 'it-engineer',
  'data analyst': 'data-analyst',
  // Healthcare
  'doctor': 'doctor', 'physician': 'doctor',
  'nurse': 'nurse',
  'hospital administrator': 'hospital-administrator',
  // Construction
  'site engineer': 'site-engineer',
  'project manager': 'project-manager',
  'concrete engineer': 'concrete-engineer',
  'technical office engineer': 'technical-office-engineer',
  'electro-mechanical engineer': 'electro-mechanical-engineer',
  'electromechanical engineer': 'electro-mechanical-engineer',
  'head of design': 'head-of-design',
  // Real Estate
  'property manager': 'property-manager',
  'property sales consultant': 'property-sales-consultant',
  'landscape manager': 'landscape-manager',
  'sales manager': 'sales-manager',
  'real estate accountant': 'real-estate-accountant',
  'property management officer': 'property-management-officer',
  // Retail
  'store manager': 'store-manager',
  'sales associate': 'sales-associate',
  'mall manager': 'mall-manager',
  // Legal
  'legal counsel': 'legal-counsel',
  'compliance officer': 'compliance-officer',
  'legal affairs manager': 'legal-affairs-manager',
  // Hospitality
  'hotel manager': 'hotel-manager',
  'front desk agent': 'front-desk-agent', 'receptionist (hotel)': 'front-desk-agent',
  // Marketing
  'marketing manager': 'marketing-manager',
  'social media specialist': 'social-media-specialist',
  // Manufacturing
  'production manager': 'production-manager',
  'quality control engineer': 'quality-control-engineer',
  // Other / Cross-industry
  'hr manager': 'hr-manager', 'human resources manager': 'hr-manager',
  'head of hr': 'head-of-hr',
  'hr executive': 'hr-executive',
  'hr officer': 'hr-officer',
  'benefits officer': 'benefits-officer',
  'head of benefits': 'head-of-benefits',
  'personnel affairs officer': 'personnel-affairs-officer',
  'hr strategy officer': 'hr-strategy-officer',
  'operations manager': 'operations-manager',
  'chief operating officer': 'chief-operating-officer', 'coo': 'chief-operating-officer',
  'chief administrative officer': 'chief-administrative-officer', 'cao': 'chief-administrative-officer',
  'business development manager': 'business-development-manager',
  'business development executive': 'business-development-executive',
  'event coordinator': 'event-coordinator',
  'inventory controller': 'inventory-controller',
  'purchasing manager': 'purchasing-manager',
  'customer service manager': 'customer-service-manager',
  'customer service representative': 'customer-service-representative',
  'collection representative': 'collection-representative',
  'head of collection': 'head-of-collection',
  'after sales service officer': 'after-sales-service-officer',
  'security manager': 'security-manager',
  'govt relations security manager': 'govt-relations-security-manager',
  'transportation facilities coordinator': 'transportation-facilities-coordinator',
  'head of maintenance': 'head-of-maintenance',
  'general maintenance manager': 'general-maintenance-manager',
  'agricultural supervisor': 'agricultural-supervisor',
  'driver': 'driver',
  'office manager': 'office-manager', 'office administrator': 'office-manager',
  'hr generalist': 'hr-generalist', 'human resources generalist': 'hr-generalist',
  'call center agent': 'call-center-agent', 'call centre agent': 'call-center-agent',
  'contact center agent': 'call-center-agent',
  'procurement specialist': 'procurement-specialist', 'procurement executive': 'procurement-specialist',
  // Finance
  'financial analyst': 'financial-analyst', 'finance analyst': 'financial-analyst',
  // Education
  'academic coordinator': 'academic-coordinator', 'academic affairs coordinator': 'academic-coordinator',
  // Marketing
  'digital marketing specialist': 'digital-marketing-specialist',
  'digital marketing executive': 'digital-marketing-specialist', 'digital marketer': 'digital-marketing-specialist',
  // Construction
  'mep engineer': 'mep-engineer', 'mechanical electrical plumbing engineer': 'mep-engineer',
};

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Whole-phrase containment, not raw substring containment — "coordinator" must not
// match the bare key "coo", and "assistant" must not match the bare key "ta". A match
// only counts if `needle` appears in `haystack` bounded by word boundaries on both sides.
// Boundaries are Unicode-aware (letters/digits/underscore in any script): plain \b treats
// Arabic letters as non-word characters, so Arabic keys would never match inside a longer title.
function wordBoundaryIncludes(haystack, needle) {
  if (!needle) return false;
  return new RegExp(`(?<![\\p{L}\\p{N}_])${escapeRegExp(needle)}(?![\\p{L}\\p{N}_])`, 'u').test(haystack);
}

function normalizeRole(title) {
  const key = title.toLowerCase().trim();
  // 1. Exact match.
  if (ROLE_MAP[key]) return ROLE_MAP[key];

  const entries = Object.entries(ROLE_MAP);

  // 2. Longest map key contained in the title (whole-phrase, see wordBoundaryIncludes).
  //    Longest wins so "preschool english teacher (kg1–kg2)" picks 'preschool english
  //    teacher' rather than the shorter 'teacher'. Ties keep map order.
  let best = null;
  for (const [k, v] of entries) {
    if (wordBoundaryIncludes(key, k) && (!best || k.length > best.k.length)) best = { k, v };
  }
  if (best) return best.v;

  // 3. Title is itself a fragment of a longer map key (e.g. "hr" -> "hr manager").
  //    Unchanged from the previous behaviour: first match in map order.
  for (const [k, v] of entries) {
    if (wordBoundaryIncludes(k, key)) return v;
  }
  return key.replace(/\s+/g, '-');
}

async function get(source) {
  const { domain, subdomain, role } = source;

  // Guidelines files: direct lookup by exact filename, no role normalization, no fallback
  if (domain === 'guidelines') {
    const filePath = path.join(__dirname, '../../../knowledge/guidelines', `${role}.md`);
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      return { content, metadata: { path: filePath, found: true } };
    } catch {
      console.warn(`[KnowledgeProvider] Guidelines not found: ${filePath}`);
      return { content: '', metadata: { path: filePath, found: false } };
    }
  }

  const normalized = normalizeRole(role);
  const filePath   = path.join(__dirname, '../../../knowledge', domain, subdomain, `${normalized}.md`);

  try {
    const content = await fs.readFile(filePath, 'utf-8');
    return { content, metadata: { path: filePath, found: true } };
  } catch {
    // Try 'other' folder as cross-industry fallback
    const fallbackPath = path.join(__dirname, '../../../knowledge', domain, 'other', `${normalized}.md`);
    try {
      const content = await fs.readFile(fallbackPath, 'utf-8');
      console.warn(`[KnowledgeProvider] Used cross-industry fallback: ${fallbackPath}`);
      return { content, metadata: { path: fallbackPath, found: true } };
    } catch {
      console.warn(`[KnowledgeProvider] Not found: ${filePath}`);
      return { content: '', metadata: { path: filePath, found: false } };
    }
  }
}

module.exports = { get, normalizeRole, ROLE_MAP };
