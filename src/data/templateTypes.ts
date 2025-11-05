export const reportTemplates = {
  // Executive/Director Level
  executiveSummary: {
    id: "executive_summary",
    name: "Executive Risk Summary",
    roles: ["procurement_director", "gcc_leader"],
    description: "High-level portfolio overview with strategic insights",
    sections: [
      "Portfolio Risk Overview",
      "Critical Alerts & Trends",
      "Strategic Recommendations",
      "Compliance Status",
      "Cost-Benefit Analysis"
    ]
  },
  
  // Category Manager
  operationalReport: {
    id: "operational_report",
    name: "Operational Performance Report",
    roles: ["category_manager"],
    description: "Detailed vendor management and performance metrics",
    sections: [
      "Vendor Performance Scorecards",
      "Onboarding Pipeline Status",
      "Contract Compliance",
      "Cost Optimization Opportunities",
      "Action Items & Follow-ups"
    ]
  },
  
  // Compliance Officer
  complianceReport: {
    id: "compliance_report",
    name: "Regulatory Compliance Report",
    roles: ["compliance_officer"],
    description: "Comprehensive compliance status and audit trail",
    sections: [
      "Regulatory Requirements Matrix",
      "Compliance Gap Analysis",
      "Audit Trail Documentation",
      "Risk Mitigation Status",
      "Certification Renewals",
      "Remediation Plans"
    ]
  },
  
  // IT Security Officer
  securityAssessment: {
    id: "security_assessment",
    name: "Cybersecurity Risk Assessment",
    roles: ["it_security_officer"],
    description: "Security posture and vulnerability analysis",
    sections: [
      "Security Posture Overview",
      "Vulnerability Assessment",
      "Data Protection Compliance",
      "Incident History",
      "Security Recommendations"
    ]
  },
  
  // Legal Team
  legalRiskReport: {
    id: "legal_risk_report",
    name: "Legal & Contractual Risk Report",
    roles: ["legal_team"],
    description: "Legal compliance and contractual analysis",
    sections: [
      "Legal Entity Verification",
      "Contract Risk Analysis",
      "Intellectual Property Assessment",
      "Litigation History",
      "Regulatory Violations",
      "Legal Recommendations"
    ]
  },
  
  // Finance Team
  financialHealthReport: {
    id: "financial_health_report",
    name: "Financial Health & Credit Risk Report",
    roles: ["finance_team"],
    description: "Financial stability and credit risk assessment",
    sections: [
      "Financial Ratio Analysis",
      "Credit Risk Scoring",
      "Cash Flow Assessment",
      "Payment History",
      "Financial Trend Analysis",
      "Cost Impact Analysis"
    ]
  },
  
  // GCC Leader
  globalIntegrationReport: {
    id: "global_integration_report",
    name: "Global Operations & Integration Report",
    roles: ["gcc_leader"],
    description: "Multi-jurisdiction compliance and global risk correlation",
    sections: [
      "Cross-Border Compliance Status",
      "Regional Risk Assessment",
      "Parent Company Integration",
      "Currency & Transfer Pricing",
      "Global Vendor Portfolio",
      "Market Expansion Readiness"
    ]
  },
  
  // Universal Templates
  vendorDueDiligence: {
    id: "vendor_due_diligence",
    name: "Complete Vendor Due Diligence",
    roles: ["procurement_director", "category_manager", "compliance_officer"],
    description: "Comprehensive vendor assessment report",
    sections: [
      "Executive Summary",
      "Company Background",
      "Financial Analysis",
      "Compliance Assessment",
      "Operational Capability",
      "Risk Evaluation",
      "Recommendations"
    ]
  },
  
  monthlyDashboard: {
    id: "monthly_dashboard",
    name: "Monthly Performance Dashboard",
    roles: ["procurement_director", "category_manager", "gcc_leader"],
    description: "Monthly KPI and performance metrics",
    sections: [
      "Key Performance Indicators",
      "Vendor Portfolio Metrics",
      "Risk Trends",
      "Cost Savings Achieved",
      "Upcoming Renewals",
      "Action Items"
    ]
  }
};

export type TemplateType = keyof typeof reportTemplates;
