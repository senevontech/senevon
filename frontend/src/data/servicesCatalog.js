const PEXELS_IDS = [
  9816335, 5835359, 9242919, 4498185, 3183197, 196644, 325185, 326055, 207983,
  1181244, 11035380, 5077044, 3184325, 3861969, 7948034, 2102416, 574077, 3184639,
  669996, 3861964, 186077, 327540, 267350, 325229, 326503, 3861961, 3184339, 730564,
];

const remoteImage = (_query = "design studio portfolio", seed = 1) => {
  const id = PEXELS_IDS[seed % PEXELS_IDS.length];
  return `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1400&h=900&dpr=1`;
};

const createWorks = (_querySeed, titles, sigStart = 1) =>
  titles.map((title, idx) => ({
    title,
    caption: `${title} concept exploration`,
    image: remoteImage(`${_querySeed} ${title}`, sigStart + idx),
  }));

const createCategory = ({ slug, title, brief, querySeed, titles, sigStart }) => ({
  slug,
  title,
  brief,
  works: createWorks(querySeed, titles, sigStart),
});

export const SERVICE_ITEMS = [
  {
    slug: "design-studio",
    title: "Design Studio",
    summary:
      "Design systems, brand identity, and product interfaces that are crisp, scalable, and ready for engineering handoff.",
    brief:
      "Our studio converts strategy into visual systems. Each output is created for consistency across print, digital, and environment-scale touchpoints.",
    categories: [
      createCategory({
        slug: "graphics-design",
        title: "Graphics Design",
        brief:
          "Campaign visuals, social creative packs, and branded digital assets designed for high recall and consistent brand tone.",
        querySeed: "graphic design campaign branding",
        sigStart: 101,
        titles: [
          "Campaign Poster",
          "Social Media Set",
          "Event Visual Pack",
          "Digital Banner Suite",
          "Product Flyer",
          "Editorial Layout",
        ],
      }),
      createCategory({
        slug: "logo-design",
        title: "Logo Design",
        brief:
          "Logo systems with symbol logic, typography hierarchy, monochrome variants, and usage rules for long-term brand stability.",
        querySeed: "logo design branding identity",
        sigStart: 121,
        titles: [
          "Wordmark System",
          "Symbol + Monogram",
          "Brandmark Variants",
          "Horizontal Lockup",
          "Icon-Only Set",
          "Identity Mockup",
        ],
      }),
      createCategory({
        slug: "business-card",
        title: "Business Card",
        brief:
          "Premium business card designs with clean hierarchy, material-aware layout, and print-ready production setup.",
        querySeed: "business card print design premium",
        sigStart: 141,
        titles: [
          "Minimal Corporate Card",
          "Duotone Card Layout",
          "Embossed Look Concept",
          "Team Card System",
          "Premium Matte Concept",
          "Event Networking Card",
        ],
      }),
      createCategory({
        slug: "packaging",
        title: "Packaging",
        brief:
          "Packaging identity for retail and D2C brands balancing shelf-impact visuals with practical production constraints.",
        querySeed: "packaging design branding product",
        sigStart: 161,
        titles: [
          "FMCG Box Concept",
          "Bottle Label System",
          "Eco Pack Variant",
          "Luxury Sleeve Concept",
          "Shipping Box Branding",
          "Multi-SKU Packaging Set",
        ],
      }),
      createCategory({
        slug: "train-metro-branding",
        title: "Train & Metro Branding",
        brief:
          "Transit branding systems for station zones, train wraps, route visuals, and public-facing information graphics.",
        querySeed: "metro train branding wayfinding",
        sigStart: 181,
        titles: [
          "Metro Route Visual",
          "Coach Exterior Branding",
          "Station Signage System",
          "Transit Campaign Wrap",
          "Public Info Graphics",
          "Platform Directional Suite",
        ],
      }),
      createCategory({
        slug: "interior-design",
        title: "Interior Design",
        brief:
          "Interior visual concepts for offices, showrooms, and experience zones aligned with brand narrative and user flow.",
        querySeed: "interior design workspace branding",
        sigStart: 201,
        titles: [
          "Reception Identity Zone",
          "Experience Wall Concept",
          "Retail Interior Theme",
          "Workspace Aesthetic Plan",
          "Material Board Visual",
          "Signage + Spatial System",
        ],
      }),
    ],
  },
  {
    slug: "engineering",
    title: "Engineering",
    summary:
      "Performance-first web and software engineering focused on robust architecture, speed, and long-term maintainability.",
    brief:
      "We deliver production systems across frontend, backend, APIs, and cloud operations with measurable performance and reliability outcomes.",
    categories: [
      createCategory({
        slug: "web-platform-engineering",
        title: "Web Platform Engineering",
        brief:
          "Scalable web platforms with modular frontend architecture, strong API contracts, and fast page performance.",
        querySeed: "web platform engineering dashboard",
        sigStart: 221,
        titles: [
          "Enterprise Dashboard",
          "Role-Based Portal",
          "Analytics Command Center",
          "Operations UI",
          "Customer Platform",
          "Admin Workflow Suite",
        ],
      }),
      createCategory({
        slug: "mobile-app-engineering",
        title: "Mobile App Engineering",
        brief:
          "Cross-platform and native-grade app development focused on stability, responsive UX, and real-world device performance.",
        querySeed: "mobile app engineering product",
        sigStart: 241,
        titles: [
          "Fintech App Interface",
          "Delivery App Flow",
          "Health App Dashboard",
          "E-commerce Mobile UX",
          "Realtime Tracking Screen",
          "Profile + Security Module",
        ],
      }),
      createCategory({
        slug: "cloud-devops",
        title: "Cloud & DevOps",
        brief:
          "Deployment pipelines, observability stacks, and infrastructure automation for reliable and repeatable releases.",
        querySeed: "cloud devops infrastructure monitoring",
        sigStart: 261,
        titles: [
          "CI/CD Pipeline Board",
          "Infra Monitoring View",
          "Release Control Panel",
          "Cloud Architecture Layout",
          "Service Health Dashboard",
          "Incident Response Console",
        ],
      }),
      createCategory({
        slug: "ai-automation",
        title: "AI Automation Systems",
        brief:
          "Workflow automation and AI-driven processing layers integrated into business operations with human-in-loop controls.",
        querySeed: "ai automation workflow system",
        sigStart: 281,
        titles: [
          "Document Automation Flow",
          "AI Assistant Interface",
          "Operations Copilot",
          "Smart Queue Dashboard",
          "Prediction Pipeline View",
          "Knowledge Workspace",
        ],
      }),
      createCategory({
        slug: "qa-performance",
        title: "QA & Performance",
        brief:
          "Test strategy, profiling, and performance hardening for robust delivery under high load conditions.",
        querySeed: "software testing performance profiling",
        sigStart: 301,
        titles: [
          "Test Coverage Matrix",
          "Performance Benchmark View",
          "Load Test Result Panel",
          "Error Analytics Console",
          "Regression Tracker",
          "Stability Release Report",
        ],
      }),
      createCategory({
        slug: "legacy-modernization",
        title: "Legacy Modernization",
        brief:
          "Modernization roadmaps for legacy systems with phased migration, risk controls, and uptime continuity.",
        querySeed: "legacy modernization enterprise software",
        sigStart: 321,
        titles: [
          "Legacy Audit Snapshot",
          "Migration Phase Blueprint",
          "Module Refactor Dashboard",
          "Data Transition Flow",
          "Post-Migration Monitoring",
          "Modern Stack Rollout",
        ],
      }),
    ],
  },
  {
    slug: "consultancy",
    title: "Consultancy",
    summary:
      "Strategic technical consultancy for product direction, architecture decisions, and execution roadmaps.",
    brief:
      "We help teams make high-impact decisions by combining product strategy, technical validation, and execution planning.",
    categories: [
      createCategory({
        slug: "technical-due-diligence",
        title: "Technical Due Diligence",
        brief:
          "Deep technical assessment for investments, acquisitions, and high-risk build decisions with clear action reports.",
        querySeed: "technical due diligence analysis",
        sigStart: 341,
        titles: [
          "Codebase Audit Report",
          "System Risk Matrix",
          "Scalability Readiness Review",
          "Dependency Health Analysis",
          "Architecture Findings Deck",
          "Execution Risk Summary",
        ],
      }),
      createCategory({
        slug: "architecture-advisory",
        title: "Architecture Advisory",
        brief:
          "Architecture planning for maintainability, scale, and team velocity with implementation-ready recommendations.",
        querySeed: "software architecture advisory strategy",
        sigStart: 361,
        titles: [
          "Platform Blueprint",
          "Service Boundary Mapping",
          "Data Flow Architecture",
          "Event-Driven Design Plan",
          "Integration Contract Review",
          "Future-State Architecture",
        ],
      }),
      createCategory({
        slug: "scalability-consulting",
        title: "Scalability Consulting",
        brief:
          "Bottleneck analysis and scale planning for traffic growth, distributed systems, and performance-critical workloads.",
        querySeed: "scalability consulting distributed systems",
        sigStart: 381,
        titles: [
          "Capacity Planning Model",
          "Horizontal Scale Strategy",
          "Caching Layer Design",
          "Database Throughput Review",
          "Queueing System Plan",
          "Traffic Surge Playbook",
        ],
      }),
      createCategory({
        slug: "security-compliance",
        title: "Security & Compliance",
        brief:
          "Security posture and compliance guidance for data handling, access control, and operational governance.",
        querySeed: "security compliance technology audit",
        sigStart: 401,
        titles: [
          "Security Posture Assessment",
          "Access Control Review",
          "Compliance Gap Matrix",
          "Threat Modeling Sheet",
          "Data Protection Workflow",
          "Audit Readiness Plan",
        ],
      }),
      createCategory({
        slug: "product-mvp-strategy",
        title: "Product & MVP Strategy",
        brief:
          "Decision support for MVP scope, feature prioritization, and technical sequencing aligned with market goals.",
        querySeed: "product strategy mvp roadmap",
        sigStart: 421,
        titles: [
          "MVP Scope Blueprint",
          "Feature Priority Matrix",
          "Roadmap Milestone Plan",
          "User Flow Strategy",
          "Launch Readiness Deck",
          "Growth Iteration Loop",
        ],
      }),
      createCategory({
        slug: "delivery-process-consulting",
        title: "Delivery Process Consulting",
        brief:
          "Team process optimization across planning, sprint execution, review cadence, and release reliability.",
        querySeed: "agile delivery process consulting",
        sigStart: 441,
        titles: [
          "Sprint Operating Model",
          "Delivery KPI Dashboard",
          "Cross-Team Workflow Map",
          "Planning Ritual Framework",
          "Release Governance Model",
          "Retrospective Improvement Loop",
        ],
      }),
    ],
  },
];

export const SERVICE_BY_SLUG = Object.fromEntries(SERVICE_ITEMS.map((item) => [item.slug, item]));
