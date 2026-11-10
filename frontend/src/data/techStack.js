export const techStackCategories = [
  {
    id: 'payments',
    title: 'Payment Gateways & Fintech',
    iconType: 'card',
    featuredLogos: true,
    items: [
      'Stripe', 'Razorpay', 'RazorpayX', 'PayPal', 'Square', 'Adyen',
      'Plaid', 'Apple Pay', 'Google Pay', 'Cashfree', 'BillDesk', 'Remitly', 'Wise', 'Nium'
    ],
    footnote: "Payment integrations are executed under official enterprise partner APIs and regional regulatory compliance frameworks."
  },
  {
    id: 'cloud',
    title: 'Cloud Platforms',
    iconType: 'cloud',
    featuredLogos: true,
    items: [
      'Amazon Web Services (AWS)', 'Microsoft Azure', 'Google Cloud Platform (GCP)',
      'Salesforce Platform', 'Cloudflare', 'DigitalOcean', 'Oracle Cloud Infrastructure'
    ]
  },
  {
    id: 'enterprise',
    title: 'Enterprise Platforms & ERP',
    iconType: 'grid',
    featuredLogos: true,
    items: [
      'SAP S/4HANA', 'Salesforce CRM', 'ServiceNow', 'Workday',
      'Oracle NetSuite', 'Microsoft Dynamics 365', 'Guidewire', 'Odoo ERP'
    ]
  },
  {
    id: 'languages',
    title: 'Programming Languages & Frameworks',
    iconType: 'code',
    items: [
      'TypeScript', 'JavaScript', 'React', 'Next.js', 'Node.js',
      'Python', 'FastAPI', 'Django', 'Java', 'Spring Boot',
      'PHP', 'Laravel', 'Rust', 'Go (Golang)', 'Ruby on Rails', 'Mojo (Max Engine)'
    ]
  },
  {
    id: 'devops',
    title: 'Automation, CI/CD & DevOps',
    iconType: 'gear',
    items: [
      'Docker', 'Kubernetes', 'Terraform', 'Kafka', 'Redis',
      'GitHub Actions', 'GitLab CI', 'Prometheus', 'Grafana', 'Jenkins'
    ]
  },
  {
    id: 'databases',
    title: 'Databases & Data Platforms',
    iconType: 'database',
    items: [
      'PostgreSQL', 'MongoDB', 'MySQL', 'Snowflake',
      'Oracle Database', 'Redis', 'DynamoDB', 'Firebase', 'Elasticsearch'
    ]
  }
];

export const aiModels = [
  {
    provider: 'OPENAI',
    series: 'GPT-4o & Reasoning Models',
    models: 'GPT-4o, o1, o3-mini and enterprise API models'
  },
  {
    provider: 'GOOGLE DEEPMIND',
    series: 'Gemini Models',
    models: 'Gemini 1.5 Pro, Gemini 2.0 Flash, Gemini 3.1 Pro'
  },
  {
    provider: 'ANTHROPIC',
    series: 'Claude Models',
    models: 'Claude 3.5 Sonnet, Claude 3.5 Haiku, Claude 3 Opus'
  }
];

export const teaserChips = [
  'React', 'Node.js', 'Python', 'AWS', 'Microsoft Azure',
  'Google Cloud', 'Stripe', 'Razorpay', 'SAP', 'Salesforce', 'Docker', 'GPT-4o', 'Gemini 2.0', 'Claude 3.5'
];
