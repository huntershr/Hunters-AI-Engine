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
};

function normalizeRole(title) {
  const key = title.toLowerCase().trim();
  if (ROLE_MAP[key]) return ROLE_MAP[key];
  // Try partial match
  for (const [k, v] of Object.entries(ROLE_MAP)) {
    if (key.includes(k) || k.includes(key)) return v;
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

module.exports = { get };
