import type { TestFocus, TestPlan } from "@/services/testcases";

export type ProjectDomain = "Banking" | "Healthcare" | "E-commerce" | "SaaS" | "Education" | "Custom";
export type EntityStatus = "Active" | "Archived";
export type ModulePriority = "Low" | "Medium" | "High" | "Critical";
export type HistoryStatus =
  | "Draft"
  | "Submitted for Review"
  | "Changes Requested"
  | "Approved"
  | "Rejected";
export type ExportFormat = "excel" | "pdf";
export type ExportType = "version" | "versions" | "requirement" | "project" | "filtered";
export type UserRole = "Admin" | "QA Lead" | "QA Engineer" | "Viewer";
export type WorkspaceRole = "Owner" | "Admin" | "QA Lead" | "QA Engineer" | "Viewer";
export type ProjectPermissionLevel = "Full Access" | "Edit Access" | "Review Access" | "View Only";
export type MemberStatus = "Active" | "Inactive" | "Removed";
export type InviteStatus = "Pending" | "Accepted" | "Expired" | "Revoked";
export type PlanId = "free" | "pro" | "enterprise";
export type BillingCycle = "monthly" | "yearly";
export type SubscriptionStatus = "Trialing" | "Active" | "Canceled" | "Past Due";
export type TrialStatus = "Active" | "Expired" | "Converted";
export type TestRunEnvironment = "QA" | "UAT" | "Staging" | "Production";
export type TestRunStatus = "Not Started" | "In Progress" | "Completed";
export type TestExecutionStatus = "Not Executed" | "Passed" | "Failed" | "Blocked" | "Skipped";
export type AIProviderType =
  | "default"
  | "openai"
  | "anthropic"
  | "gemini"
  | "groq"
  | "azure-openai"
  | "openrouter"
  | "custom-openai-compatible";
export type AIProviderFeatureName =
  | "test-generation"
  | "ai-chat"
  | "playwright-generation"
  | "requirement-impact"
  | "coverage-score"
  | "repository-impact"
  | "repository-test-update"
  | "playwright-validation-failure"
  | "ai-failure-analysis"
  | "repository-fix-suggestion";
export type AIProviderUsageStatus = "Success" | "Failed";
export type PlaywrightValidationStatus = "Queued" | "Running" | "Passed" | "Failed" | "Warning" | "Error";
export type PlaywrightValidationSeverity = "Info" | "Warning" | "Error";
export type ReviewAction =
  | "Submitted for Review"
  | "Approved"
  | "Changes Requested"
  | "Rejected"
  | "Comment Added"
  | "Exported Approved Version";
export type AuthProvider = "email";
export type UserStatus = "Active" | "Inactive" | "Suspended";

export interface ProjectSummary {
  id: string;
  userId: string;
  name: string;
  description: string;
  domain: ProjectDomain;
  status: EntityStatus;
  createdAt: string;
  updatedAt: string;
  totalModules: number;
  totalRequirements: number;
  totalTestCases: number;
  lastUpdatedAt: string;
}

export interface Workspace {
  id: string;
  workspaceName: string;
  description: string;
  logo?: string;
  ownerId: string;
  status: EntityStatus;
  createdAt: string;
  updatedAt: string;
}

export interface WorkspaceMember {
  id: string;
  workspaceId: string;
  userId: string;
  name: string;
  email: string;
  role: WorkspaceRole;
  status: MemberStatus;
  assignedProjects: Array<{ projectId: string; permission: ProjectPermissionLevel }>;
  joinedAt: string;
  lastActiveAt: string;
}

export interface WorkspaceInvite {
  id: string;
  workspaceId: string;
  email: string;
  role: WorkspaceRole;
  assignedProjects: Array<{ projectId: string; permission: ProjectPermissionLevel }>;
  message?: string;
  token: string;
  inviteLink?: string;
  status: InviteStatus;
  invitedBy: string;
  expiresAt: string;
  createdAt: string;
}

export interface WorkspacePermission {
  id: string;
  workspaceId: string;
  role: WorkspaceRole;
  permissions: string[];
}

export interface ActivityLog {
  id: string;
  workspaceId: string;
  actorId: string;
  actorName: string;
  action: string;
  resourceType: string;
  resourceId?: string;
  oldValue?: unknown;
  newValue?: unknown;
  createdAt: string;
}

export interface WorkspaceDetail {
  workspace: Workspace;
  members: WorkspaceMember[];
  invites: WorkspaceInvite[];
  activityLogs: ActivityLog[];
}

export interface AuthUser {
  id: string;
  fullName: string;
  name: string;
  email: string;
  avatar?: string;
  authProvider: AuthProvider;
  role: WorkspaceRole;
  status: UserStatus;
  emailVerified: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthContextResponse {
  user: AuthUser;
  workspace: Workspace | null;
  member: WorkspaceMember | null;
  role: WorkspaceRole;
  permissions: string[];
}

export interface PlaywrightValidationIssue {
  id: string;
  severity: PlaywrightValidationSeverity;
  category: string;
  message: string;
  recommendation: string;
  line?: number;
}

export interface PlaywrightValidationResult {
  score: number;
  status: PlaywrightValidationStatus;
  summary: string;
  issues: PlaywrightValidationIssue[];
  recommendations: string[];
  checkedAt: string;
  durationMs: number;
}

export interface PlaywrightValidationJob {
  id: string;
  workspaceId?: string;
  projectId?: string;
  moduleId?: string;
  requirementId?: string;
  requirementTitle?: string;
  fileName: string;
  playwrightCode: string;
  status: PlaywrightValidationStatus;
  result?: PlaywrightValidationResult;
  errorMessage?: string;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePlaywrightValidationJobInput {
  workspaceId?: string;
  projectId?: string;
  moduleId?: string;
  requirementId?: string;
  requirementTitle?: string;
  fileName: string;
  playwrightCode: string;
}

export interface AuthResponse extends AuthContextResponse {
  accessToken: string;
  expiresAt: string;
}

export interface AIProviderConfig {
  id: string;
  workspaceId: string;
  providerType: AIProviderType;
  providerName: string;
  apiKeyMasked?: string;
  baseUrl?: string;
  modelName: string;
  endpointUrl?: string;
  deploymentName?: string;
  apiVersion?: string;
  requestFormat?: "OpenAI Compatible";
  temperature: number;
  maxTokens: number;
  isDefault: boolean;
  isActive: boolean;
  fallbackToDefault: boolean;
  lastTestedAt?: string;
  lastTestStatus?: AIProviderUsageStatus;
  createdBy: string;
  updatedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AIProviderFeatureMapping {
  id: string;
  workspaceId: string;
  featureName: AIProviderFeatureName;
  providerId: string;
  providerName: string;
  providerType: AIProviderType;
  modelName: string;
  isActive: boolean;
  updatedAt: string;
}

export interface AIProviderUsageLog {
  id: string;
  workspaceId: string;
  providerType: AIProviderType;
  providerName: string;
  modelName: string;
  featureName: AIProviderFeatureName;
  tokenUsage?: number;
  status: AIProviderUsageStatus;
  errorMessage?: string;
  createdBy?: string;
  createdAt: string;
}

export interface AIProviderSettingsResponse {
  providers: AIProviderConfig[];
  featureMappings: AIProviderFeatureMapping[];
}

export interface SaveAIProviderInput {
  workspaceId: string;
  providerType: Exclude<AIProviderType, "default">;
  providerName: string;
  apiKey?: string;
  baseUrl?: string;
  modelName: string;
  endpointUrl?: string;
  deploymentName?: string;
  apiVersion?: string;
  requestFormat?: "OpenAI Compatible";
  temperature?: number;
  maxTokens?: number;
  isActive?: boolean;
  fallbackToDefault?: boolean;
}

export interface GitHubAutomationConfig {
  id: string;
  workspaceId: string;
  provider: "github";
  tokenMasked: string;
  owner: string;
  repo: string;
  defaultBranch: string;
  testFolderPath: string;
  createdBy: string;
  updatedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SaveGitHubAutomationConfigInput {
  workspaceId: string;
  token: string;
  owner: string;
  repo: string;
  defaultBranch: string;
  testFolderPath: string;
}

export interface ApplicationRepositoryConfig {
  id: string;
  workspaceId: string;
  projectId?: string;
  repositoryType: ApplicationRepositoryType;
  provider: "github";
  tokenMasked: string;
  owner: string;
  repo: string;
  defaultBranch: string;
  webhookSecretMasked: string;
  webhookUrl: string;
  webhookId?: number;
  webhookStatus: ApplicationRepositoryStatus;
  webhookError?: string;
  lastEventReceivedAt?: string;
  lastSyncedAt?: string;
  createdBy: string;
  updatedBy?: string;
  createdAt: string;
  updatedAt: string;
  manualSetup?: {
    webhookUrl: string;
    contentType: string;
    secret: string;
    events: string[];
    message?: string;
  };
}

export interface SaveApplicationRepositoryInput {
  workspaceId: string;
  projectId?: string;
  repositoryType: ApplicationRepositoryType;
  token: string;
  owner: string;
  repo: string;
  defaultBranch: string;
  webhookSecret?: string;
}

export interface RepositoryActivityChangedFile {
  filePath: string;
  changeType: RepositoryChangeType | "Renamed";
  additions?: number;
  deletions?: number;
  patch?: string;
  possibleModule?: string;
  riskLevel?: RepositoryRiskLevel;
}

export interface RepositoryActivity {
  id: string;
  workspaceId: string;
  projectId?: string;
  repositoryConfigId: string;
  repositoryType: ApplicationRepositoryType | "automation";
  provider: "github";
  eventType: "push" | "pull_request";
  action?: string;
  repoOwner: string;
  repoName: string;
  branch?: string;
  commitSha?: string;
  previousCommitSha?: string;
  pullRequestNumber?: number;
  pullRequestTitle?: string;
  pullRequestUrl?: string;
  author?: string;
  message?: string;
  changedFiles: RepositoryActivityChangedFile[];
  fileCount: number;
  status: RepositoryActivityStatus;
  deliveryId?: string;
  rawMetadata?: unknown;
  createdAt: string;
}

export interface PushPlaywrightToGitHubInput {
  workspaceId: string;
  fileName: string;
  playwrightCode: string;
  requirementTitle: string;
  projectName?: string;
  moduleName?: string;
  coverageScore?: number;
  generatedBy?: string;
  version?: number | string;
}

export interface PushPlaywrightToGitHubResult {
  branchName: string;
  filePath: string;
  fileUrl: string;
  pullRequestUrl: string;
  pullRequestNumber: number;
}

export type RepositoryAnalysisLanguage = "TypeScript" | "JavaScript" | "Java" | "Unknown";
export type RepositoryAnalysisFramework =
  | "Playwright"
  | "Playwright Test Runner"
  | "Java Playwright"
  | "Custom Playwright setup"
  | "Unknown";
export type RepositoryAnalysisBuildTool = "npm" | "Maven" | "Gradle" | "Unknown";
export type RepositoryAnalysisPattern = "Page Object Model" | "Fixtures" | "Direct Playwright" | "Custom";
export type RepositorySyncStatus = "Pending" | "Completed" | "Failed";
export type RepositoryChangeType = "Added" | "Modified" | "Deleted";
export type RepositoryRiskLevel = "Low" | "Medium" | "High";
export type RepositorySuggestedAction = "Update" | "Add" | "Review" | "No Action";
export type ApplicationRepositoryType = "frontend" | "backend";
export type ApplicationRepositoryStatus = "Connected" | "Failed" | "Pending";
export type RepositoryActivityStatus = "New" | "Reviewed" | "Ignored";
export type RepositoryImpactAnalysisStatus = "Pending" | "Completed" | "Failed" | "Reviewed";
export type RepositoryImpactSuggestedAction = "Update Test" | "Add New Test" | "Review Manually" | "No Action";
export type RepositoryImpactSuggestionCategory =
  | "Automation"
  | "Manual Testing"
  | "Regression"
  | "Data"
  | "API"
  | "UI";
export type RepositoryGeneratedTestUpdateStatus = "Pending" | "Approved" | "Rejected" | "Edited";
export type RepositoryValidationRunStatus = "Queued" | "Pending" | "Running" | "Passed" | "Failed" | "Cancelled" | "Completed" | "Error";
export type RepositoryValidationMode = "quick" | "impact" | "full";
export type RepositoryUpdatePullRequestStatus = "Created" | "Failed";
export type RepositoryValidationReleaseRecommendation = "Safe to Merge" | "Merge with Caution" | "Do Not Merge";
export type RepositoryValidationMergeDecision = "Approved" | "Warning" | "Blocked";
export type RepositoryValidationRecommendationStatus = "Generated" | "Regenerated" | "Failed";
export type ValidationFailureCategory =
  | "Locator Issue"
  | "Assertion Issue"
  | "App Flow Change"
  | "Test Data Issue"
  | "Network/API Issue"
  | "Environment Issue"
  | "Dependency Issue"
  | "Unknown";
export type ValidationFailureType =
  | "Locator Changed"
  | "Assertion Failed"
  | "Timeout"
  | "Navigation Error"
  | "Invalid Base URL"
  | "Authentication Failure"
  | "Authorization Failure"
  | "API Failure"
  | "Network Error"
  | "Test Data Issue"
  | "Environment Issue"
  | "Browser Compatibility Issue"
  | "Flaky Test"
  | "Dependency / Setup Issue"
  | "Unknown";
export type ValidationAutoFixStatus = "Pending" | "Approved" | "Rejected" | "Edited" | "Committed";
export type ReleaseReadinessRecommendation = "Ready for Release" | "Proceed with Caution" | "Not Recommended for Release";
export type ReleaseReadinessStatus = "READY" | "READY WITH CAUTION" | "NOT READY" | "BLOCKED";
export type ReleaseRiskLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
export type RootCauseCategory =
  | "UI Selector Change"
  | "Business Logic Change"
  | "API Contract Change"
  | "Authentication Change"
  | "Authorization Change"
  | "Routing Change"
  | "Test Data Change"
  | "Environment Issue"
  | "Dependency Issue"
  | "Timing / Flaky Behavior"
  | "Unknown";
export type ApiWorkspaceSourceType = "upload" | "swagger_url" | "github" | "api_url" | "postman";
export type ApiWorkspaceFormat = "openapi3" | "swagger2" | "json" | "yaml";
export type ApiImportStatus = "Pending" | "Completed" | "Failed";
export type ApiAuthType = "Bearer token" | "Basic auth" | "API key header" | "API key query param" | "OAuth2" | "Digest" | "No auth";
export type ApiRiskLevel = "Low" | "Medium" | "High";
export type ApiRepositoryFramework =
  | "Express"
  | "NestJS"
  | "Spring Boot"
  | "FastAPI"
  | "Fastify"
  | "Django"
  | ".NET Web API"
  | "Laravel"
  | "Unknown";
export type PostmanSourceType = "upload" | "github" | "public_url";
export type PostmanImportStatus = "Pending" | "Completed" | "Failed";
export type PostmanVariableSource = "collection" | "environment" | "global" | "runtime";
export type ApiTestGenerationSourceType = "endpoint" | "collection" | "postman-request" | "requirement" | "manual";
export type ApiTestGenerationType = "all" | "positive" | "negative" | "edge" | "contract" | "security" | "performance";
export type ApiTestFramework = "playwright" | "axios" | "supertest";
export type GeneratedApiTestStatus = "Pending" | "Approved" | "Rejected" | "Edited";
export type ApiRunType = "endpoint" | "request" | "collection" | "generated_suite";
export type ApiRunResultStatus = "Passed" | "Failed" | "Error";
export type ApiValidationStatus = "Queued" | "Running" | "Passed" | "Failed" | "Cancelled" | "Error";
export type ApiValidationMode = "quick" | "impact" | "full";
export type ApiFailureCategory =
  | "Authentication"
  | "Authorization"
  | "Validation Error"
  | "HTTP Failure"
  | "Contract Failure"
  | "Performance Failure"
  | "Infrastructure Failure"
  | "Unknown";
export type ApiFailureSeverity = "Low" | "Medium" | "High" | "Critical";
export type ContractValidationStatus = "Passed" | "Failed" | "Warning";
export type ContractChangeType = "Missing Field" | "Additional Field" | "Type Change" | "Status Code Change" | "Enum Change" | "Structure Change" | "Header Change";
export type ContractSeverity = "Low" | "Medium" | "High" | "Critical";
export type ApiAssertionType =
  | "status_code_equals"
  | "response_time_less_than"
  | "header_exists"
  | "json_field_exists"
  | "json_field_equals"
  | "body_contains"
  | "body_not_contains"
  | "schema_validation";

export interface RepositoryImpactAnalysisTest {
  testFilePath: string;
  relatedChangedFile: string;
  impactReason: string;
  suggestedAction: RepositoryImpactSuggestedAction;
  riskLevel: RepositoryRiskLevel;
  confidenceScore: number;
}

export interface RepositoryImpactAnalysisSuggestion {
  title: string;
  description: string;
  category: RepositoryImpactSuggestionCategory;
  priority: RepositoryRiskLevel;
  relatedTestFile?: string;
  relatedChangedFile?: string;
}

export interface RepositoryImpactAnalysis {
  id: string;
  workspaceId: string;
  projectId?: string;
  repositoryActivityId: string;
  applicationRepositoryId: string;
  automationRepositoryId?: string;
  provider: "github";
  repoOwner: string;
  repoName: string;
  branch?: string;
  commitSha?: string;
  changedFiles: RepositoryActivityChangedFile[];
  impactedModules: string[];
  impactedTests: RepositoryImpactAnalysisTest[];
  suggestions: RepositoryImpactAnalysisSuggestion[];
  riskLevel: RepositoryRiskLevel;
  confidenceScore: number;
  recommendation: string;
  status: RepositoryImpactAnalysisStatus;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RepositoryGeneratedTestUpdate {
  id: string;
  workspaceId: string;
  projectId?: string;
  impactAnalysisId: string;
  testFilePath: string;
  oldCode: string;
  newCode: string;
  updateSummary: string;
  impactReason: string;
  confidenceScore: number;
  riskLevel: RepositoryRiskLevel;
  suggestedAction: RepositoryImpactSuggestedAction;
  status: RepositoryGeneratedTestUpdateStatus;
  aiProvider: string;
  aiModel: string;
  repositoryMatchScore?: number;
  locatorConfidence?: number;
  assertionConfidence?: number;
  businessCoverageScore?: number;
  maintainabilityScore?: number;
  estimatedStabilityScore?: number;
  repositoryContextSummary?: {
    framework?: string;
    language?: string;
    pattern?: string;
    usesPageObjectModel?: boolean;
    usesFixtures?: boolean;
    locatorStrategy?: string;
    assertionStyle?: string;
    testFolderPath?: string;
    pageObjectFolderPath?: string;
    playwrightVersion?: string;
  };
  qualityReport?: {
    repositoryStyleMatch: number;
    businessCoverage: number;
    locatorQuality: number;
    assertionQuality: number;
    maintainabilityScore: number;
    estimatedExecutionStability: number;
    potentialRisks: string[];
    recommendations: string[];
  };
  repositoryLearningUsed?: {
    locatorStrategy: string;
    pageObjectModel: boolean;
    testStyle: string;
    namingPattern: string;
    repositoryMatchScore: number;
    overallConfidence: number;
  };
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RepositoryLearningProfile {
  id: string;
  workspaceId: string;
  projectId?: string;
  repositoryId: string;
  repositoryName: string;
  branch?: string;
  framework: string;
  frameworkVersion?: string;
  language: string;
  packageManager: string;
  testDirectories: string[];
  pageObjectDirectories: string[];
  fixtureDirectories: string[];
  helperDirectories: string[];
  locatorPreferences: Array<{ strategy: string; weight: number; source: string }>;
  namingPatterns: {
    testFilePattern: string;
    describePattern: string;
    testCasePattern: string;
    pageObjectPattern: string;
    fixturePattern: string;
    helperPattern: string;
    folderPattern: string;
  };
  testStylePatterns: {
    importStyle: string;
    describeStructure: string;
    beforeEachPattern: string;
    fixtureUsage: string;
    pageObjectUsage: string;
    assertionStyle: string;
    navigationStyle: string;
    dataSetupStyle: string;
    cleanupStyle: string;
    commentsStyle: string;
  };
  authPatterns: string[];
  commonFlows: string[];
  acceptedGenerationCount: number;
  rejectedGenerationCount: number;
  editedGenerationCount: number;
  validationPassCount: number;
  validationFailCount: number;
  repositoryMatchScore: number;
  locatorConfidence: number;
  assertionConfidence: number;
  namingConfidence: number;
  businessFlowConfidence: number;
  validationConfidence: number;
  overallConfidence: number;
  aiConfidenceTrend: Array<{ date: string; score: number; event: string }>;
  lastAnalyzedCommit?: string;
  lastAnalyzedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RepositoryValidationRun {
  id: string;
  workspaceId: string;
  projectId?: string;
  impactAnalysisId: string;
  status: RepositoryValidationRunStatus;
  totalTests: number;
  passed: number;
  failed: number;
  skipped: number;
  duration: number;
  browser: string;
  environment: string;
  validationMode?: RepositoryValidationMode;
  command?: string;
  logs: string;
  stdout?: string;
  stderr?: string;
  validationDebugLogs?: Array<{
    stepName: string;
    status: "Passed" | "Failed" | "Skipped";
    command: string;
    validationProvider?: "github-actions" | "backend-fallback" | "local-runner";
    workingDirectory?: string;
    repositoryPath?: string;
    packageJsonExists?: boolean;
    packageLockExists?: boolean;
    playwrightConfigTsExists?: boolean;
    nodeModulesExists?: boolean;
    playwrightTestInstalled?: boolean;
    npmVersion?: string;
    nodeVersion?: string;
    workflowRunId?: number;
    workflowUrl?: string;
    workflowStatus?: string;
    workflowConclusion?: string | null;
    branch?: string;
    commitSha?: string;
    jobName?: string;
    jobUrl?: string;
    startedAt?: string;
    completedAt?: string;
    exitCode: number;
    stdout: string;
    stderr: string;
  }>;
  validationStageTimings?: Array<{
    stage: string;
    status: "Passed" | "Failed" | "Skipped" | "Running" | "Unknown";
    duration: number;
    startedAt?: string;
    completedAt?: string;
  }>;
  failedTestNames?: string[];
  failedTests?: Array<{
    testFile: string;
    testName: string;
    errorMessage: string;
    duration: number;
    suggestedAction: string;
    stackTrace?: string;
  }>;
  stackTrace?: string;
  validationWorkspacePath?: string;
  errorDetails?: string;
  failureExplanation?: string;
  aiFailureExplanation?: string;
  screenshots: string[];
  videos: string[];
  traceFiles?: string[];
  reportUrl?: string;
  jsonReportPath?: string;
  htmlReportPath?: string;
  jsonReportData?: unknown;
  validationProvider?: "github-actions" | "backend-fallback" | "local-runner";
  validationBranchName?: string;
  workflowRunId?: number;
  workflowRunUrl?: string;
  workflowStatus?: string;
  workflowConclusion?: string;
  workflowCommitSha?: string;
  createdBy?: string;
  createdAt: string;
  completedAt?: string;
}

export interface RepositoryUpdatePullRequest {
  id: string;
  workspaceId: string;
  projectId?: string;
  impactAnalysisId: string;
  branchName: string;
  pullRequestUrl?: string;
  pullRequestNumber?: number;
  updatedFiles: string[];
  validationRunId?: string;
  status: RepositoryUpdatePullRequestStatus;
  createdBy?: string;
  createdAt: string;
}

export interface RepositoryValidationRecommendation {
  id: string;
  workspaceId: string;
  projectId?: string;
  impactAnalysisId: string;
  validationRunId: string;
  confidenceScore: number;
  releaseRecommendation: RepositoryValidationReleaseRecommendation;
  riskLevel: RepositoryRiskLevel;
  summary: string;
  reasons: string[];
  recommendedActions: string[];
  mergeDecision: RepositoryValidationMergeDecision;
  qaOwnerAction: string;
  aiProvider: string;
  aiModel: string;
  status: RepositoryValidationRecommendationStatus;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ValidationFailureAnalysis {
  id: string;
  workspaceId: string;
  projectId?: string;
  repositoryId?: string;
  validationRunId: string;
  workflowRunId?: number;
  workflowUrl?: string;
  failureType?: ValidationFailureType;
  rootCause: string;
  category: ValidationFailureCategory;
  affectedModule: string;
  affectedTestFile: string;
  affectedFiles?: string[];
  failedTests?: Array<{
    testFile: string;
    testName: string;
    errorMessage: string;
    suggestedFix: string;
    duration?: number;
    retryCount?: number;
    stackTrace?: string;
    screenshotUrl?: string;
    videoUrl?: string;
    traceUrl?: string;
  }>;
  confidenceScore: number;
  summary?: string;
  recommendedFix: string;
  recommendedActions?: string[];
  autoFixAvailable: boolean;
  qaOwnerAction?: string;
  riskLevel: RepositoryRiskLevel;
  aiProvider: string;
  aiModel: string;
  status?: RepositoryValidationRecommendationStatus;
  errorMessage?: string;
  createdBy?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface ValidationAutoFix {
  id: string;
  workspaceId: string;
  projectId?: string;
  repositoryId?: string;
  validationRunId: string;
  failureAnalysisId: string;
  filePath?: string;
  fixType?: string;
  repositoryMatchScore?: number;
  beforeCode?: string;
  afterCode?: string;
  explanation?: string;
  approved?: boolean;
  rejected?: boolean;
  committed?: boolean;
  commitSha?: string;
  branch?: string;
  aiProvider?: string;
  aiModel?: string;
  testFilePath: string;
  oldCode: string;
  fixedCode: string;
  fixSummary: string;
  status: ValidationAutoFixStatus;
  confidenceScore: number;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ValidationRetryAttempt {
  id: string;
  workspaceId: string;
  projectId?: string;
  repositoryId?: string;
  validationRunId: string;
  parentValidationRunId?: string;
  retryValidationRunId?: string;
  attemptNumber: number;
  triggeredBy?: string;
  triggerReason?: string;
  retryType?: "failed_tests_only" | "after_auto_fix" | "manual";
  validationMode?: RepositoryValidationMode;
  browser?: string;
  testFiles?: string[];
  testNames?: string[];
  traceEnabled?: boolean;
  status: RepositoryValidationRunStatus;
  totalTests?: number;
  passed: number;
  failed: number;
  skipped: number;
  duration: number;
  failureCategory?: ValidationFailureType;
  retryRecommendation?: "Recommended" | "With Caution" | "Not Recommended";
  flakyDetected?: boolean;
  workflowRunId?: number;
  workflowUrl?: string;
  createdBy?: string;
  createdAt: string;
  completedAt?: string;
}

export interface ValidationHistoryTimelineStep {
  name: string;
  status: string;
  timestamp: string;
  duration: number;
  details: string;
}

export interface ValidationHistoryRecord {
  id: string;
  workspaceId: string;
  projectId?: string;
  repositoryId?: string;
  validationRunId: string;
  workflowRunId?: number;
  workflowUrl?: string;
  repositoryName: string;
  projectName: string;
  branch: string;
  sourceBranch: string;
  targetBranch: string;
  commitSha?: string;
  commitMessage?: string;
  commitAuthor?: string;
  triggerSource: string;
  validationMode?: RepositoryValidationMode;
  browser?: string;
  browserVersion?: string;
  playwrightVersion?: string;
  nodeVersion?: string;
  operatingSystem?: string;
  queueTime: number;
  setupTime: number;
  executionTime: number;
  artifactUploadTime: number;
  aiAnalysisTime: number;
  totalDuration: number;
  totalTests: number;
  passedTests: number;
  failedTests: number;
  skippedTests: number;
  retryCount: number;
  retryStatus: string;
  aiRecommendation?: RepositoryValidationReleaseRecommendation;
  aiConfidence?: number;
  reportUrls: {
    html?: string;
    json?: string;
    junit?: string;
    screenshots?: string[];
    videos?: string[];
    traces?: string[];
  };
  logUrls: { workflow?: string };
  status: string;
  changedFiles?: RepositoryActivityChangedFile[];
  pullRequestUrl?: string;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ValidationHistoryDetail {
  history: ValidationHistoryRecord;
  timeline: ValidationHistoryTimelineStep[];
  validationRun: RepositoryValidationRun;
  failureAnalysis: ValidationFailureAnalysis | null;
  rootCauseAnalysis: RootCauseAnalysis | null;
  autoFixes: ValidationAutoFix[];
  retries: ValidationRetryAttempt[];
  recommendation: RepositoryValidationRecommendation | null;
  reports: ValidationHistoryRecord["reportUrls"];
  logs: {
    workflow?: string;
    logs?: string;
    stdout?: string;
    stderr?: string;
    debugLogs?: RepositoryValidationRun["validationDebugLogs"];
  };
}

export interface ValidationHistoryStatistics {
  totalValidations: number;
  passed: number;
  failed: number;
  passedAfterRetry: number;
  averageDuration: number;
  validationSuccessRate: number;
  retrySuccessRate: number;
  mostActiveRepository: string;
  mostActiveUser: string;
  browserDistribution: Record<string, number>;
  validationModeDistribution: Record<string, number>;
  dailyValidations: Array<{ date: string; total: number; passed: number; failed: number }>;
}

export interface ReleaseReadinessSnapshot {
  id: string;
  workspaceId: string;
  projectId?: string;
  repositoryId?: string;
  releaseName?: string;
  releaseVersion?: string;
  releaseScore?: number;
  releaseStatus?: ReleaseReadinessStatus;
  aiConfidence?: number;
  riskLevel?: ReleaseRiskLevel;
  validationSuccessRate?: number;
  failedTestsCount?: number;
  flakyTestsCount?: number;
  repositoryHealthScore?: number;
  criticalIssuesCount?: number;
  blockerIssuesCount?: number;
  finalRecommendation?: string;
  reasons?: string[];
  recommendedActions?: string[];
  rootCauseInsights?: string[];
  validationRunIds?: string[];
  readinessScore: number;
  recommendation: ReleaseReadinessRecommendation;
  automationPassRate: number;
  failedValidations: number;
  openHighRiskChanges: number;
  pendingFixes: number;
  prsWaitingForReview: number;
  coverageScore: number;
  manualExecutionPassRate: number;
  riskSummary: Record<string, number>;
  createdBy?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface RootCauseAnalysis {
  id: string;
  workspaceId: string;
  projectId?: string;
  repositoryId?: string;
  validationRunId: string;
  failureAnalysisId?: string;
  rootCause: string;
  category: RootCauseCategory;
  confidenceScore: number;
  riskLevel: RepositoryRiskLevel;
  affectedApplicationFiles: string[];
  affectedTestFiles: string[];
  failureReason: string;
  evidence: string[];
  recommendedFix: string;
  autoFixPossible: boolean;
  relatedPreviousFailures: string[];
  aiProvider: string;
  aiModel: string;
  status: RepositoryValidationRecommendationStatus;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiWorkspace {
  id: string;
  workspaceId: string;
  projectId?: string;
  name: string;
  description?: string;
  version?: string;
  sourceType: ApiWorkspaceSourceType;
  sourceUrl?: string;
  githubRepo?: string;
  githubPath?: string;
  format: ApiWorkspaceFormat;
  serverUrls: string[];
  authTypes: ApiAuthType[];
  tags: string[];
  totalEndpoints: number;
  importStatus: ApiImportStatus;
  importError?: string;
  rawSpec: unknown;
  normalizedSpec: unknown;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiEndpoint {
  id: string;
  workspaceId: string;
  projectId?: string;
  apiWorkspaceId: string;
  method: string;
  path: string;
  operationId?: string;
  summary?: string;
  description?: string;
  tags: string[];
  parameters: unknown[];
  headers: unknown[];
  requestBodySchema?: unknown;
  responseSchemas: Record<string, unknown>;
  statusCodes: string[];
  authRequired: boolean;
  authType: ApiAuthType;
  riskLevel: ApiRiskLevel;
  examples: {
    request?: unknown;
    response?: unknown;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ApiWorkspaceImportResponse {
  workspace: ApiWorkspace;
  endpoints: ApiEndpoint[];
}

export interface PostmanVariable {
  name: string;
  value?: string;
  source: PostmanVariableSource;
  resolvedValue?: string;
}

export interface PostmanWorkspace {
  id: string;
  workspaceId: string;
  projectId?: string;
  apiWorkspaceId?: string;
  collectionName: string;
  collectionVersion?: string;
  description?: string;
  sourceType: PostmanSourceType;
  sourceUrl?: string;
  githubRepo?: string;
  githubPath?: string;
  importStatus: PostmanImportStatus;
  importError?: string;
  authTypes: ApiAuthType[];
  totalFolders: number;
  totalRequests: number;
  totalVariables: number;
  healthScore: number;
  aiReady: number;
  folders: Array<{
    id: string;
    name: string;
    parentId?: string;
    path: string;
  }>;
  variables: PostmanVariable[];
  summary: {
    crudApis: number;
    authenticationApis: number;
    paymentApis: number;
    userApis: number;
    highRisk: string[];
    mediumRisk: string[];
    lowRisk: string[];
    currentTests: string[];
    missingTests: string[];
  };
  rawCollection: unknown;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PostmanRequest {
  id: string;
  workspaceId: string;
  projectId?: string;
  collectionId: string;
  apiEndpointId?: string;
  folderId?: string;
  folderPath?: string;
  name: string;
  description?: string;
  method: string;
  url: string;
  headers: unknown[];
  queryParams: unknown[];
  pathParams: unknown[];
  requestBody?: unknown;
  authType: ApiAuthType;
  variables: string[];
  testScripts: string[];
  testSummary: string[];
  responseExamples: unknown[];
  aiGenerated: boolean;
  aiReadyStatus: "Ready" | "Needs Variables" | "Needs Tests" | "Needs Review";
  riskLevel: ApiRiskLevel;
  createdAt: string;
  updatedAt: string;
}

export interface PostmanImportResponse {
  workspace: PostmanWorkspace;
  requests: PostmanRequest[];
  apiWorkspaceId?: string;
  apiEndpoints: ApiEndpoint[];
}

export interface GeneratedApiTestSuite {
  id: string;
  workspaceId: string;
  projectId?: string;
  apiWorkspaceId?: string;
  endpointId?: string;
  sourceType: ApiTestGenerationSourceType;
  generationType: ApiTestGenerationType;
  framework: ApiTestFramework;
  environment?: string;
  authProfile?: string;
  status: "Generated" | "Partially Approved" | "Approved" | "Rejected";
  totalTests: number;
  approvedTests: number;
  rejectedTests: number;
  aiProvider: string;
  aiModel: string;
  qualityScore: number;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GeneratedApiTest {
  id: string;
  workspaceId: string;
  projectId?: string;
  generatedSuiteId: string;
  apiWorkspaceId?: string;
  endpointId?: string;
  title: string;
  testType: ApiTestGenerationType;
  priority: ModulePriority;
  method: string;
  endpoint: string;
  headers: unknown;
  queryParams: unknown;
  pathParams: unknown;
  requestBody: unknown;
  expectedStatus: number;
  expectedResponse: unknown;
  assertions: string[];
  riskLevel: ApiRiskLevel;
  executableCode: string;
  framework: ApiTestFramework;
  status: GeneratedApiTestStatus;
  aiConfidence: number;
  qualityScores: {
    schemaCoverage: number;
    requirementCoverage: number;
    authCoverage: number;
    negativeCaseCoverage: number;
    contractCoverage: number;
    securityCoverage: number;
    overall: number;
  };
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiAssertionInput {
  assertionType: ApiAssertionType;
  fieldPath?: string;
  expectedValue?: unknown;
  enabled?: boolean;
}

export interface ApiAssertionResult {
  assertionType: ApiAssertionType;
  label: string;
  passed: boolean;
  expectedValue?: unknown;
  actualValue?: unknown;
  message: string;
}

export interface ApiRun {
  id: string;
  workspaceId: string;
  projectId?: string;
  apiWorkspaceId?: string;
  endpointId?: string;
  runType: ApiRunType;
  environment?: string;
  resolvedUrl: string;
  method: string;
  requestHeaders: Record<string, string>;
  requestBody?: unknown;
  queryParams: unknown;
  pathParams: unknown;
  authType: ApiAuthType;
  statusCode?: number;
  statusText?: string;
  responseTime: number;
  responseSize: number;
  responseHeaders: Record<string, string>;
  responseBody?: unknown;
  assertionResults: ApiAssertionResult[];
  contractResult?: {
    passed: boolean;
    issues: string[];
  };
  aiAnalysis?: string;
  resultStatus: ApiRunResultStatus;
  errorMessage?: string;
  executedBy?: string;
  executedAt: string;
}

export interface ApiCollectionRunResponse {
  runs: ApiRun[];
  summary: {
    total: number;
    passed: number;
    failed: number;
    errors: number;
  };
}

export interface ApiValidationRun {
  id: string;
  workspaceId: string;
  projectId?: string;
  repositoryId?: string;
  apiWorkspaceId?: string;
  generatedSuiteId?: string;
  endpointId?: string;
  validationMode: ApiValidationMode;
  framework: ApiTestFramework;
  environment: string;
  branch: string;
  commitSha?: string;
  workflowRunId?: number;
  workflowUrl?: string;
  workflowStatus?: string;
  workflowConclusion?: string | null;
  totalTests: number;
  passedTests: number;
  failedTests: number;
  skippedTests: number;
  responseTimeAverage: number;
  duration: number;
  status: ApiValidationStatus;
  progress: number;
  currentStep: string;
  reportUrls: string[];
  logUrls: string[];
  logs: string;
  aiRecommendation?: string;
  releaseImpact?: string;
  triggerSource: string;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiValidationResult {
  id: string;
  validationRunId: string;
  endpointId?: string;
  method: string;
  endpoint: string;
  expectedStatus?: number;
  actualStatus?: number;
  responseTime?: number;
  assertions: string[];
  contractResult?: unknown;
  status: "Passed" | "Failed" | "Skipped";
  failureReason?: string;
  createdAt: string;
}

export interface ApiValidationResponse {
  validationRun: ApiValidationRun;
  results: ApiValidationResult[];
}

export interface ApiFailureEvidence {
  id: string;
  analysisId: string;
  sourceType: string;
  sourceReference: string;
  evidenceType: string;
  summary: string;
  confidence: number;
  createdAt: string;
}

export interface ApiFailureAnalysis {
  id: string;
  workspaceId: string;
  projectId?: string;
  repositoryId?: string;
  validationRunId?: string;
  endpointId?: string;
  failureCategory: ApiFailureCategory;
  severity: ApiFailureSeverity;
  rootCause: string;
  confidenceScore: number;
  impactedApis: string[];
  impactedTests: string[];
  impactedBackendFiles: string[];
  impactedFrontendModules: string[];
  requestSummary: string;
  responseSummary: string;
  evidence: string[];
  recommendations: string[];
  autoFixPossible: boolean;
  aiProvider: string;
  aiModel: string;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiFailureAnalysisResponse {
  analysis: ApiFailureAnalysis;
  evidence: ApiFailureEvidence[];
}

export interface ContractDifference {
  id: string;
  validationId: string;
  fieldPath: string;
  changeType: ContractChangeType;
  expectedValue?: unknown;
  actualValue?: unknown;
  severity: ContractSeverity;
  impact: string;
  recommendation: string;
}

export interface ApiContractValidation {
  id: string;
  workspaceId: string;
  projectId?: string;
  apiWorkspaceId?: string;
  endpointId?: string;
  validationRunId?: string;
  expectedSchema?: unknown;
  actualSchema?: unknown;
  expectedStatusCode?: number;
  actualStatusCode?: number;
  compatibilityScore: number;
  breakingChanges: ContractDifference[];
  addedFields: string[];
  removedFields: string[];
  changedFields: string[];
  riskLevel: ApiRiskLevel | "Critical";
  aiAnalysis: string;
  aiConfidence: number;
  recommendations: string[];
  validationStatus: ContractValidationStatus;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiRepositoryProfile {
  id: string;
  workspaceId: string;
  projectId?: string;
  repositoryId: string;
  repositoryName: string;
  provider: "github";
  owner: string;
  repo: string;
  defaultBranch: string;
  tokenMasked?: string;
  framework: ApiRepositoryFramework;
  language: string;
  packageManager: string;
  routeDirectories: string[];
  controllerDirectories: string[];
  serviceDirectories: string[];
  dtoDirectories: string[];
  testDirectories: string[];
  totalEndpoints: number;
  protectedEndpoints: number;
  highRiskEndpoints: number;
  coverageScore: number;
  lastScannedCommit?: string;
  lastScannedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiRouteMapping {
  id: string;
  workspaceId: string;
  projectId?: string;
  repositoryId: string;
  method: string;
  path: string;
  controllerFile?: string;
  controllerName?: string;
  handlerName?: string;
  serviceFiles: string[];
  dtoFiles: string[];
  schemaFiles: string[];
  authRequired: boolean;
  roles: string[];
  riskLevel: ApiRiskLevel;
  testFiles: string[];
  lineNumber?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ApiImpactAnalysis {
  id: string;
  workspaceId: string;
  projectId?: string;
  repositoryId: string;
  commitSha?: string;
  changedFiles: string[];
  affectedEndpoints: string[];
  affectedControllers: string[];
  affectedServices: string[];
  affectedSchemas: string[];
  affectedTests: string[];
  riskLevel: ApiRiskLevel;
  confidenceScore: number;
  recommendations: string[];
  createdAt: string;
}

export interface ApiRepositorySummary {
  profile: ApiRepositoryProfile;
  mappings: ApiRouteMapping[];
  latestImpactAnalysis?: ApiImpactAnalysis | null;
}

export interface ApiRepositoryDependencyGraph {
  moduleName: string;
  endpoints: Array<{
    method: string;
    path: string;
    controller?: string;
    services: string[];
    schemas: string[];
    tests: string[];
    riskLevel: ApiRiskLevel;
  }>;
}

export interface ApiRepositoryCoverage {
  totalEndpoints: number;
  endpointsWithTests: number;
  endpointsWithoutTests: number;
  highRiskEndpointCoverage: number;
  authCoverage: number;
  coverageScore: number;
  untestedEndpoints: ApiRouteMapping[];
}

export interface ApiRepositoryRiskSummary {
  high: number;
  medium: number;
  low: number;
  protectedEndpoints: number;
  recommendations: string[];
}

export interface ContractDashboard {
  totalApis: number;
  validContracts: number;
  failedContracts: number;
  breakingChanges: number;
  compatibilityScore: number;
  highRiskApis: number;
  criticalApis: number;
  riskDistribution: Record<string, number>;
  trend: Array<{ date: string; score: number; status: ContractValidationStatus }>;
}

export interface ContractCompatibility {
  compatibilityScore: number;
  total: number;
  failed: number;
  warnings: number;
  highRiskApis: number;
}

export interface ApiTestGenerationResponse {
  suite: GeneratedApiTestSuite;
  tests: GeneratedApiTest[];
}

export interface RepositoryAnalysis {
  id: string;
  workspaceId: string;
  integrationId: string;
  provider: "github";
  repoOwner: string;
  repoName: string;
  branch: string;
  framework: RepositoryAnalysisFramework;
  language: RepositoryAnalysisLanguage;
  buildTool: RepositoryAnalysisBuildTool;
  testFolderPath: string;
  pageObjectFolderPath?: string;
  usesPageObjectModel: boolean;
  usesFixtures: boolean;
  namingConvention: string;
  importStyle: string;
  pattern: RepositoryAnalysisPattern;
  confidenceScore: number;
  playwrightVersion?: string;
  packageManager?: string;
  githubActionsCompatible?: boolean;
  onboardingStatus?: "Ready" | "Needs Initialization" | "Needs Review";
  readinessScore?: number;
  missingFiles?: string[];
  recommendedActions?: string[];
  healthChecks?: Array<{
    name: string;
    status: "Passed" | "Failed" | "Warning";
    message: string;
  }>;
  scannedFiles: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface RepositoryChangedFile {
  filePath: string;
  changeType: RepositoryChangeType;
  relatedModule: string;
  riskLevel: RepositoryRiskLevel;
  possibleTestImpact: string;
}

export interface RepositoryImpactedTest {
  testFile: string;
  relatedChangedFile: string;
  impactReason: string;
  suggestedAction: RepositorySuggestedAction;
  confidenceScore: number;
}

export interface RepositoryAISuggestion {
  summary: string;
  impactedTests: string[];
  suggestedUpdates: string[];
  riskLevel: RepositoryRiskLevel;
  recommendedPrAction: string;
}

export interface RepositoryGeneratedUpdate {
  id: string;
  syncId: string;
  testFilePath: string;
  oldCode: string;
  newCode: string;
  impactReason: string;
  changedLocatorOrFlow: string;
  confidenceScore: number;
  riskLevel: RepositoryRiskLevel;
  suggestedAction: RepositorySuggestedAction | "Needs Manual Review";
  createdAt: string;
}

export interface RepositoryPrPreview {
  filesToAdd: string[];
  filesToUpdate: string[];
  branchName: string;
  title: string;
  description: string;
  riskLevel: RepositoryRiskLevel;
  confidenceScore: number;
  createdAt: string;
}

export interface RepositorySync {
  id: string;
  workspaceId: string;
  integrationId: string;
  provider: "github";
  repoOwner: string;
  repoName: string;
  branch: string;
  previousCommitSha?: string;
  latestCommitSha: string;
  changedFiles: RepositoryChangedFile[];
  impactedTests: RepositoryImpactedTest[];
  aiSuggestions: RepositoryAISuggestion[];
  generatedUpdates?: RepositoryGeneratedUpdate[];
  prPreview?: RepositoryPrPreview;
  updatedFiles?: string[];
  branchName?: string;
  riskLevel: RepositoryRiskLevel;
  status: RepositorySyncStatus;
  prUrl?: string;
  prStatus?: "Not Created" | "Preview Ready" | "Created" | "Failed";
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface Plan {
  id: PlanId;
  name: string;
  description: string;
  monthlyPrice: number | null;
  yearlyPrice: number | null;
  recommended?: boolean;
  trialDays?: number;
  features: string[];
  limits: {
    workspaces: number | "unlimited";
    teamMembers: number | "unlimited";
    projects: number | "unlimited";
    requirementsPerMonth: number | "unlimited";
    aiGenerationsPerMonth: number | "unlimited";
    aiChatMessagesPerMonth: number | "unlimited";
    exportsPerMonth: number | "unlimited";
    storageMb: number | "unlimited";
    exports: string;
    analytics: boolean;
    reviewWorkflow: boolean;
    jiraIntegration: boolean;
    prioritySupport: boolean;
    customLimits: boolean;
  };
}

export interface Subscription {
  id: string;
  workspaceId: string;
  planId: PlanId;
  billingCycle: BillingCycle;
  status: SubscriptionStatus;
  trialStartsAt?: string;
  trialEndsAt?: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  createdAt: string;
  updatedAt: string;
}

export interface Trial {
  id: string;
  workspaceId: string;
  userId: string;
  subscriptionId: string;
  planId: PlanId;
  status: TrialStatus;
  startsAt: string;
  endsAt: string;
  daysRemaining: number;
  featuresAvailable: string[];
  createdAt: string;
  updatedAt: string;
}

export interface SubscriptionResponse {
  subscription: Subscription;
  plan: Plan;
  trial?: Trial | null;
}

export interface UsageMetric {
  used: number;
  limit: number | "unlimited";
}

export interface WorkspaceUsageResponse {
  subscription: Subscription;
  plan: Plan;
  trial?: Trial | null;
  usage: {
    workspaces: UsageMetric;
    members: UsageMetric;
    projects: UsageMetric;
    requirements: UsageMetric;
    aiGenerations: UsageMetric;
    aiChatMessages: UsageMetric;
    exports: UsageMetric;
    activeUsers: UsageMetric;
    storage: UsageMetric;
  };
}

export interface ProjectModule {
  id: string;
  projectId: string;
  name: string;
  description: string;
  priority: ModulePriority;
  status: EntityStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Requirement {
  id: string;
  projectId: string;
  moduleId: string;
  title: string;
  description: string;
  acceptanceCriteria: string;
  priority: ModulePriority;
  status: EntityStatus;
  createdAt: string;
  updatedAt: string;
}

export interface TestCaseGenerationHistory {
  id: string;
  userId: string;
  projectId: string;
  moduleId: string;
  requirementId: string;
  version: number;
  requirementInput: string;
  generatedAt: string;
  generatedBy: string;
  aiModelUsed: string;
  testType: TestFocus;
  coverageScore: number;
  status: HistoryStatus;
  reviewStatus: HistoryStatus;
  submittedBy?: string;
  submittedAt?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  approvedBy?: string;
  approvedAt?: string;
  rejectedBy?: string;
  rejectedAt?: string;
  isLocked: boolean;
  updatedAt: string;
  output: TestPlan;
}

export interface TestCaseHistoryRecord extends TestCaseGenerationHistory {
  projectName: string;
  moduleName: string;
  requirementTitle: string;
}

export interface TestCaseHistoryCompare {
  from: TestCaseHistoryRecord;
  to: TestCaseHistoryRecord;
  coverageDifference: number;
  addedTestCases: string[];
  removedTestCases: string[];
  updatedTestCases: string[];
}

export interface HistoryFilters {
  projectId?: string;
  moduleId?: string;
  requirementId?: string;
  generatedBy?: string;
  status?: HistoryStatus;
  dateFrom?: string;
  dateTo?: string;
  minCoverage?: string;
  maxCoverage?: string;
  search?: string;
}

export interface ExportHistoryRecord {
  id: string;
  userId: string;
  exportType: ExportType;
  exportFormat: ExportFormat;
  projectId?: string;
  requirementId?: string;
  totalRecords: number;
  createdAt: string;
}

export interface ReviewComment {
  id: string;
  historyId: string;
  userId: string;
  userName: string;
  role: UserRole;
  message: string;
  actionType: ReviewAction;
  createdAt: string;
}

export interface ReviewAuditTrail {
  id: string;
  historyId: string;
  action: ReviewAction;
  userId: string;
  userName: string;
  role: UserRole;
  oldStatus?: HistoryStatus;
  newStatus?: HistoryStatus;
  timestamp: string;
  comment?: string;
}

export interface ReviewDetail {
  history: TestCaseHistoryRecord;
  comments: ReviewComment[];
  auditTrail: ReviewAuditTrail[];
}

export interface AIChatMessage {
  role: "user" | "assistant";
  content: string;
  createdAt: string;
}

export interface AIChat {
  id: string;
  userId: string;
  projectId: string;
  moduleId: string;
  requirementId: string;
  historyVersionId?: string;
  title: string;
  messages: AIChatMessage[];
  createdAt: string;
  updatedAt: string;
  projectName?: string;
  moduleName?: string;
  requirementTitle?: string;
}

export interface AIChatSummary {
  id: string;
  projectId: string;
  moduleId: string;
  requirementId: string;
  historyVersionId?: string;
  title: string;
  projectName: string;
  requirementTitle: string;
  lastMessage: string;
  createdAt: string;
  updatedAt: string;
}

export interface SendAIChatMessageInput {
  chatId?: string;
  projectId: string;
  moduleId: string;
  requirementId: string;
  historyVersionId?: string;
  userMessage: string;
}

export interface ProjectDetail {
  project: ProjectSummary;
  modules: ProjectModule[];
  requirements: Requirement[];
  histories: TestCaseGenerationHistory[];
}

export interface ApprovedTestCaseVersion extends TestCaseHistoryRecord {
  totalTestCases: number;
}

export interface TestRunSummary {
  id: string;
  workspaceId: string;
  projectId: string;
  moduleId: string;
  requirementId?: string;
  name: string;
  environment: TestRunEnvironment;
  buildVersion: string;
  assignedTester: string;
  status: TestRunStatus;
  startDate: string;
  endDate: string;
  description: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  projectName: string;
  moduleName: string;
  requirementTitle?: string;
  totalTestCases: number;
  passed: number;
  failed: number;
  blocked: number;
  skipped: number;
  notExecuted: number;
  passRate: number;
  progress: number;
}

export interface TestExecution {
  id: string;
  testRunId: string;
  testCaseId: string;
  sourceHistoryId: string;
  sourceCategory: "Positive" | "Negative" | "Edge";
  title: string;
  description: string;
  expectedResult: string;
  priority: "High" | "Medium" | "Low";
  status: TestExecutionStatus;
  actualResult: string;
  comments: string;
  screenshotUrl?: string;
  videoUrl?: string;
  logUrl?: string;
  bugId?: string;
  jiraBugId?: string;
  jiraBugUrl?: string;
  executionTime?: number;
  browser?: "Chrome" | "Firefox" | "Safari" | "Edge";
  operatingSystem?: "Windows" | "macOS" | "Linux" | "Android" | "iOS";
  buildNumber?: string;
  environment?: TestRunEnvironment;
  executedBy?: string;
  executedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TestRunDetail extends TestRunSummary {
  executions: TestExecution[];
}

export interface TestExecutionHistoryItem {
  id: string;
  testRunId: string;
  testExecutionId: string;
  testCaseId: string;
  oldStatus: TestExecutionStatus;
  newStatus: TestExecutionStatus;
  updatedBy: string;
  comment?: string;
  actualResult?: string;
  bugId?: string;
  jiraBugId?: string;
  jiraBugUrl?: string;
  createdAt: string;
}

export interface TestExecutionDashboard {
  totalTestRuns: number;
  activeTestRuns: number;
  completedTestRuns: number;
  passRate: number;
  failedTestCases: number;
  blockedTestCases: number;
  executionProgressByProject: Array<{ projectId: string; projectName: string; progress: number }>;
  passFailChart: Array<{ name: string; value: number }>;
  dailyExecutionTrend: Array<{ name: string; executions: number }>;
  testerSummary: Array<{ tester: string; total: number; passed: number; failed: number }>;
  failedTestsWithEvidence?: number;
  testsLinkedToBugs?: number;
  averageExecutionTime?: number;
  browserWiseFailures?: Array<{ browser: string; failures: number }>;
  osWiseFailures?: Array<{ operatingSystem: string; failures: number }>;
  buildWisePassRate?: Array<{ buildNumber: string; passRate: number }>;
}

export interface CreateTestRunInput {
  name: string;
  projectId: string;
  moduleId: string;
  requirementId?: string;
  environment: TestRunEnvironment;
  buildVersion: string;
  assignedTester: string;
  startDate: string;
  endDate: string;
  description: string;
  historyIds: string[];
}

export interface DashboardStats {
  totalProjects: number;
  activeProjects: number;
  totalModules: number;
  totalRequirements: number;
  totalTestCases: number;
  averageTestCoverageScore: number;
  pendingReviews: number;
  approvedTestCases: number;
  changesRequested: number;
  rejectedItems: number;
  averageApprovalTimeHours: number;
  recentlyUpdatedProjects: ProjectSummary[];
}

export interface AnalyticsFilters {
  workspaceId?: string;
  projectId?: string;
  moduleId?: string;
  userId?: string;
  status?: HistoryStatus;
  dateFrom?: string;
  dateTo?: string;
}

export interface ApiAnalyticsFilters extends AnalyticsFilters {
  apiWorkspaceId?: string;
  repositoryId?: string;
  environment?: string;
  method?: string;
  riskLevel?: ApiRiskLevel;
  validationMode?: ApiValidationMode;
}

export interface AnalyticsSummary {
  totalProjects: number;
  totalModules: number;
  totalRequirements: number;
  totalTestCasesGenerated: number;
  averageCoverageScore: number;
  approvedTestCases: number;
  pendingReviews: number;
  changesRequested: number;
  rejectedTestCases: number;
  totalExports: number;
  aiChatInteractions: number;
}

export interface AnalyticsCoverage {
  byProject: Array<{ projectId: string; projectName: string; averageCoverageScore: number }>;
  trend: Array<{ date: string; averageCoverageScore: number }>;
  lowCoverageRequirements: Array<{
    historyId: string;
    requirementId: string;
    requirementTitle: string;
    projectName: string;
    moduleName: string;
    coverageScore: number;
    version: number;
    generatedAt: string;
  }>;
  highCoverageRequirements: Array<{
    historyId: string;
    requirementId: string;
    requirementTitle: string;
    projectName: string;
    moduleName: string;
    coverageScore: number;
    version: number;
    generatedAt: string;
  }>;
  recommendation: string;
}

export interface AnalyticsGeneration {
  generatedOverTime: Array<{ name: string; versions: number }>;
  caseDistribution: Array<{ name: string; value: number }>;
  generatedByProject: Array<{ name: string; testCases: number }>;
  generatedByUser: Array<{ name: string; testCases: number }>;
  mostActiveModules: Array<{ name: string; testCases: number }>;
}

export interface AnalyticsReview {
  pendingReviewCount: number;
  approvedCount: number;
  rejectedCount: number;
  changesRequestedCount: number;
  averageApprovalTimeHours: number;
  statusDistribution: Array<{ name: string; value: number }>;
  reviewBottlenecks: Array<{
    historyId: string;
    requirementTitle: string;
    projectName: string;
    submittedAt: string;
    waitingDays: number;
  }>;
  reviewerActivity: Array<{ name: string; reviewsCompleted: number }>;
}

export interface AnalyticsProjectHealth {
  projectId: string;
  projectName: string;
  totalRequirements: number;
  totalGeneratedVersions: number;
  averageCoverageScore: number;
  pendingReviews: number;
  approvedVersions: number;
  lastActivityDate: string;
  healthStatus: "Healthy" | "Needs Attention" | "Critical";
}

export interface AnalyticsUserProductivity {
  userId: string;
  userName: string;
  role: WorkspaceRole;
  testCasesGenerated: number;
  reviewsCompleted: number;
  approvedVersions: number;
  aiChatUsage: number;
  exports: number;
  lastActiveDate: string;
}

export interface AnalyticsAIUsage {
  totalAIGenerations: number;
  totalAIChatMessages: number;
  mostUsedQuickPrompts: Array<{ name: string; count: number }>;
  averageCoverageImprovementAfterAIChat: number;
  aiGeneratedVersionsSaved: number;
  usageOverTime: Array<{ name: string; messages: number }>;
}

export interface AnalyticsExports {
  totalExcelExports: number;
  totalPdfExports: number;
  exportsByProject: Array<{ name: string; exports: number }>;
  exportsByUser: Array<{ name: string; exports: number }>;
  mostExportedRequirements: Array<{ name: string; exports: number }>;
  approvedVsDraftExportCount: Array<{ name: string; value: number }>;
}

export interface AIQualityFilters extends AnalyticsFilters {
  repositoryId?: string;
  aiProvider?: string;
  validationMode?: RepositoryValidationMode | string;
}

export interface AIQualitySummary {
  overallQualityScore: number;
  qualityLabel: "Enterprise Ready" | "Excellent" | "Good" | "Needs Improvement" | "Low Quality";
  requirementCoverage: number;
  repositoryMatchScore: number;
  testGenerationAccuracy: number;
  validationSuccessRate: number;
  manualEditRate: number;
  manualEditScore: number;
  userAcceptanceRate: number;
  aiConfidenceScore: number;
  totalGeneratedOutputs: number;
  acceptedOutputs: number;
  rejectedOutputs: number;
  editedOutputs: number;
  validationPassed: number;
  validationFailed: number;
  qualityDistribution: Array<{ name: string; value: number }>;
  improvementSuggestions: string[];
}

export interface AIQualityTrendPoint {
  date: string;
  qualityScore: number;
  aiConfidenceScore: number;
  requirementCoverage: number;
  repositoryMatchScore: number;
  validationSuccessRate: number;
  manualEditRate: number;
  userAcceptanceRate: number;
}

export interface AIQualityMetric {
  id: string;
  workspaceId: string;
  projectId?: string;
  repositoryId?: string;
  generatedOutputId: string;
  requirementId?: string;
  validationRunId?: string;
  aiProvider: string;
  aiModel: string;
  requirementCoverage: number;
  repositoryMatchScore: number;
  testGenerationAccuracy: number;
  validationSuccessRate: number;
  manualEditRate: number;
  manualEditScore: number;
  userAcceptanceRate: number;
  aiConfidenceScore: number;
  overallQualityScore: number;
  qualityLabel: AIQualitySummary["qualityLabel"];
  generatedLines: number;
  editedLines: number;
  accepted: boolean;
  rejected: boolean;
  regenerated: boolean;
  validationPassed: boolean;
  validationFailed: boolean;
  createdBy?: string;
  createdAt: string;
}

export interface AIQualityGeneratedOutputDetail {
  metric: AIQualityMetric;
  outputType: string;
  title: string;
  validationResult: RepositoryValidationRun | null;
  improvementSuggestions: string[];
}

export interface ApiAnalyticsSummary {
  summary: {
    totalApis: number;
    testedApis: number;
    untestedApis: number;
    passedApis: number;
    failedApis: number;
    averageResponseTime: number;
    p50ResponseTime: number;
    p90ResponseTime: number;
    p95ResponseTime: number;
    p99ResponseTime: number;
    contractFailures: number;
    breakingChanges: number;
    apiCoverage: number;
    apiHealthScore: number;
    apiHealthLabel: "Excellent" | "Healthy" | "Needs Attention" | "High Risk";
    highRiskApis: number;
    highRiskFailures: number;
    releaseRisk: "Low" | "Medium" | "High" | "Critical";
    validationSuccessRate: number;
    contractCompatibility: number;
  };
  coverage: {
    totalEndpoints: number;
    testedEndpoints: number;
    untestedEndpointCount: number;
    authEndpointCoverage: number;
    highRiskEndpointCoverage: number;
    negativeTestCoverage: number;
    contractTestCoverage: number;
    byTag: Array<{ tag: string; total: number; tested: number; coverage: number }>;
    byRisk: Array<{ risk: ApiRiskLevel; total: number; tested: number; coverage: number }>;
    untestedEndpoints: Array<{ method: string; path: string; riskLevel: ApiRiskLevel; tags: string[] }>;
  };
  validation: {
    totalValidations: number;
    passedValidations: number;
    failedValidations: number;
    skippedValidations: number;
    averageDuration: number;
    validationSuccessRate: number;
    retrySuccessRate: number;
    failureCategories: Array<{ endpoint: string; category: string }>;
    trend: Array<{ date: string; passed: number; failed: number; total: number; averageDuration: number }>;
    failedEndpoints: Array<{ method: string; path: string; riskLevel: ApiRiskLevel; tags: string[] }>;
  };
  performance: {
    averageResponseTime: number;
    p50ResponseTime: number;
    p90ResponseTime: number;
    p95ResponseTime: number;
    p99ResponseTime: number;
    slowestApis: Array<{ method: string; endpoint: string; responseTime: number; statusCode?: number }>;
    fastestApis: Array<{ method: string; endpoint: string; responseTime: number; statusCode?: number }>;
    errorRate: number;
    trend: Array<{ date: string; averageResponseTime: number; p95ResponseTime: number }>;
  };
  contracts: {
    totalContractValidations: number;
    passedContractChecks: number;
    failedContractChecks: number;
    breakingChanges: number;
    missingFields: number;
    typeMismatches: number;
    statusCodeMismatches: number;
    compatibilityScore: number;
    trend: Array<{ date: string; passed: number; failed: number; breakingChanges: number; compatibilityScore: number }>;
    failures: ApiContractValidation[];
  };
  risks: {
    highRiskApis: number;
    highRiskCoverage: number;
    highRiskFailures: number;
    criticalApiFailures: number;
    releaseBlockers: string[];
    riskDistribution: Array<{ name: string; value: number }>;
  };
  aiInsights: string[];
  drilldowns: {
    failedApis: Array<{ method: string; path: string; riskLevel: ApiRiskLevel; tags: string[] }>;
    slowestApis: Array<{ method: string; endpoint: string; responseTime: number; statusCode?: number }>;
    contractFailures: ApiContractValidation[];
    untestedApis: Array<{ method: string; path: string; riskLevel: ApiRiskLevel; tags: string[] }>;
  };
}

export interface CreateProjectInput {
  name: string;
  description: string;
  domain: ProjectDomain;
  status?: EntityStatus;
}

export interface CreateModuleInput {
  projectId: string;
  name: string;
  description: string;
  priority: ModulePriority;
  status?: EntityStatus;
}

export interface CreateRequirementInput {
  projectId: string;
  moduleId: string;
  title: string;
  description: string;
  acceptanceCriteria: string;
  priority: ModulePriority;
  status?: EntityStatus;
}

const apiBaseUrl = () => import.meta.env.VITE_API_BASE_URL ?? import.meta.env.VITE_API_URL;

async function apiRequest<T>(path: string, options?: RequestInit): Promise<T> {
  const baseUrl = apiBaseUrl();
  if (!baseUrl) throw new Error("API URL is not configured.");
  const token = localStorage.getItem("aiqa_access_token");

  const response = await fetch(`${baseUrl.replace(/\/$/, "")}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  });

  if (!response.ok) {
    if (response.status === 401) localStorage.removeItem("aiqa_access_token");
    const errorBody = await response.json().catch(() => null);
    const firstIssue = Array.isArray(errorBody?.issues) ? errorBody.issues[0] : null;
    if (firstIssue?.message) {
      const field = Array.isArray(firstIssue.path) ? firstIssue.path.join(".") : "";
      throw new Error(field ? `${field}: ${firstIssue.message}` : firstIssue.message);
    }
    throw new Error(errorBody?.message ?? "Request failed.");
  }

  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

function toQueryString(filters: HistoryFilters) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.set(key, value);
  });
  const query = params.toString();
  return query ? `?${query}` : "";
}

function analyticsQueryString(filters: AnalyticsFilters) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.set(key, value);
  });
  const query = params.toString();
  return query ? `?${query}` : "";
}

function aiQualityQueryString(filters: AIQualityFilters) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.set(key, String(value));
  });
  const query = params.toString();
  return query ? `?${query}` : "";
}

function executionQueryString(filters: { projectId?: string; moduleId?: string; requirementId?: string; status?: string }) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.set(key, value);
  });
  const query = params.toString();
  return query ? `?${query}` : "";
}

export function getHistoryExportUrl(historyId: string, format: "pdf" | "excel" | "csv" | "json") {
  const baseUrl = apiBaseUrl();
  if (!baseUrl) throw new Error("API URL is not configured.");
  return `${baseUrl.replace(/\/$/, "")}/api/test-case-history/${historyId}/export?format=${format}`;
}

async function downloadBlob(path: string, body: unknown, fallbackName: string) {
  const baseUrl = apiBaseUrl();
  if (!baseUrl) throw new Error("API URL is not configured.");
  const token = localStorage.getItem("aiqa_access_token");

  const response = await fetch(`${baseUrl.replace(/\/$/, "")}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    throw new Error(errorBody?.message ?? "Export failed.");
  }

  const blob = await response.blob();
  const disposition = response.headers.get("Content-Disposition");
  const filename = disposition?.match(/filename="([^"]+)"/)?.[1] ?? fallbackName;
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

async function downloadGet(path: string, fallbackName: string) {
  const baseUrl = apiBaseUrl();
  if (!baseUrl) throw new Error("API URL is not configured.");
  const token = localStorage.getItem("aiqa_access_token");
  const response = await fetch(`${baseUrl.replace(/\/$/, "")}${path}`, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    throw new Error(errorBody?.message ?? "Download failed.");
  }
  const blob = await response.blob();
  const disposition = response.headers.get("Content-Disposition");
  const filename = disposition?.match(/filename="([^"]+)"/)?.[1] ?? fallbackName;
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

export const projectApi = {
  signup: (input: { fullName: string; email: string; password: string; confirmPassword: string; workspaceName?: string }) =>
    apiRequest<AuthResponse>("/api/auth/signup", { method: "POST", body: JSON.stringify(input) }),
  login: (input: { email: string; password: string }) =>
    apiRequest<AuthResponse>("/api/auth/login", { method: "POST", body: JSON.stringify(input) }),
  logout: () => apiRequest<void>("/api/auth/logout", { method: "POST" }),
  me: () => apiRequest<AuthContextResponse>("/api/auth/me"),
  forgotPassword: (email: string) =>
    apiRequest<{ message: string; resetLink?: string; resetToken?: string }>("/api/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),
  resetPassword: (input: { token: string; password: string; confirmPassword: string }) =>
    apiRequest<{ message: string }>("/api/auth/reset-password", { method: "POST", body: JSON.stringify(input) }),
  updateProfile: (input: { fullName?: string; avatar?: string }) =>
    apiRequest<AuthContextResponse>("/api/auth/profile", { method: "PATCH", body: JSON.stringify(input) }),
  changePassword: (input: { currentPassword: string; newPassword: string }) =>
    apiRequest<{ message: string }>("/api/auth/change-password", { method: "PATCH", body: JSON.stringify(input) }),
  listPlans: () => apiRequest<Plan[]>("/api/plans"),
  getCurrentSubscription: (workspaceId: string) =>
    apiRequest<SubscriptionResponse>(`/api/subscription/current?workspaceId=${encodeURIComponent(workspaceId)}`),
  getWorkspaceUsage: (workspaceId: string) =>
    apiRequest<WorkspaceUsageResponse>(`/api/subscription/usage?workspaceId=${encodeURIComponent(workspaceId)}`),
  getCurrentTrial: (workspaceId: string) =>
    apiRequest<Trial | null>(`/api/trial/current?workspaceId=${encodeURIComponent(workspaceId)}`),
  updateSubscription: (input: { workspaceId: string; planId: PlanId; billingCycle?: BillingCycle }) =>
    apiRequest<SubscriptionResponse>("/api/subscription/current", {
      method: "PATCH",
      body: JSON.stringify(input),
    }),
  getDashboard: () => apiRequest<DashboardStats>("/api/dashboard"),
  importApiWorkspaceUpload: (input: { workspaceId?: string; projectId?: string; fileName: string; content: string }) =>
    apiRequest<ApiWorkspaceImportResponse>("/api/api-workspaces/import/upload", {
      method: "POST",
      body: JSON.stringify(input),
    }),
  importApiWorkspaceUrl: (input: { workspaceId?: string; projectId?: string; url: string; sourceType?: "swagger_url" | "api_url" }) =>
    apiRequest<ApiWorkspaceImportResponse>("/api/api-workspaces/import/url", {
      method: "POST",
      body: JSON.stringify(input),
    }),
  importApiWorkspaceGitHub: (input: { workspaceId?: string; projectId?: string; owner: string; repo: string; path: string; branch?: string }) =>
    apiRequest<ApiWorkspaceImportResponse>("/api/api-workspaces/import/github", {
      method: "POST",
      body: JSON.stringify(input),
    }),
  listApiWorkspaces: (filters: { workspaceId?: string; projectId?: string } = {}) => {
    const params = new URLSearchParams();
    if (filters.workspaceId) params.set("workspaceId", filters.workspaceId);
    if (filters.projectId) params.set("projectId", filters.projectId);
    const query = params.toString();
    return apiRequest<ApiWorkspace[]>(`/api/api-workspaces${query ? `?${query}` : ""}`);
  },
  getApiWorkspace: (apiWorkspaceId: string) => apiRequest<ApiWorkspace>(`/api/api-workspaces/${apiWorkspaceId}`),
  listApiEndpoints: (apiWorkspaceId: string) => apiRequest<ApiEndpoint[]>(`/api/api-workspaces/${apiWorkspaceId}/endpoints`),
  getApiEndpoint: (apiWorkspaceId: string, endpointId: string) =>
    apiRequest<ApiEndpoint>(`/api/api-workspaces/${apiWorkspaceId}/endpoints/${endpointId}`),
  deleteApiWorkspace: (apiWorkspaceId: string) => apiRequest<void>(`/api/api-workspaces/${apiWorkspaceId}`, { method: "DELETE" }),
  importPostmanCollection: (input: { workspaceId?: string; projectId?: string; collection: string; sourceType?: PostmanSourceType; sourceUrl?: string; githubRepo?: string; githubPath?: string }) =>
    apiRequest<PostmanImportResponse>("/api/postman/import", {
      method: "POST",
      body: JSON.stringify(input),
    }),
  importPostmanEnvironment: (input: { postmanWorkspaceId: string; content: string; source?: "environment" | "global" }) =>
    apiRequest<PostmanWorkspace>("/api/postman/import/environment", {
      method: "POST",
      body: JSON.stringify(input),
    }),
  importPostmanGitHub: (input: { workspaceId?: string; projectId?: string; owner: string; repo: string; path: string; branch?: string }) =>
    apiRequest<PostmanImportResponse>("/api/postman/import/github", {
      method: "POST",
      body: JSON.stringify(input),
    }),
  listPostmanWorkspaces: (filters: { workspaceId?: string; projectId?: string } = {}) => {
    const params = new URLSearchParams();
    if (filters.workspaceId) params.set("workspaceId", filters.workspaceId);
    if (filters.projectId) params.set("projectId", filters.projectId);
    const query = params.toString();
    return apiRequest<PostmanWorkspace[]>(`/api/postman/workspaces${query ? `?${query}` : ""}`);
  },
  getPostmanWorkspace: (postmanWorkspaceId: string) => apiRequest<PostmanWorkspace>(`/api/postman/workspaces/${postmanWorkspaceId}`),
  listPostmanRequests: (postmanWorkspaceId: string) => apiRequest<PostmanRequest[]>(`/api/postman/workspaces/${postmanWorkspaceId}/requests`),
  listPostmanVariables: (postmanWorkspaceId: string) => apiRequest<PostmanVariable[]>(`/api/postman/workspaces/${postmanWorkspaceId}/variables`),
  getPostmanSummary: (postmanWorkspaceId: string) => apiRequest<PostmanWorkspace["summary"]>(`/api/postman/workspaces/${postmanWorkspaceId}/summary`),
  deletePostmanWorkspace: (postmanWorkspaceId: string) => apiRequest<void>(`/api/postman/workspaces/${postmanWorkspaceId}`, { method: "DELETE" }),
  generateApiTests: (input: {
    workspaceId?: string;
    projectId?: string;
    endpointId?: string;
    apiWorkspaceId?: string;
    requirementText?: string;
    manualEndpoint?: { method: string; endpoint: string };
    generationType?: ApiTestGenerationType;
    framework?: ApiTestFramework;
    environment?: string;
    authProfile?: string;
    priority?: ModulePriority;
    numberOfTests?: number;
  }) => apiRequest<ApiTestGenerationResponse>("/api/api-test-generation/generate", {
    method: "POST",
    body: JSON.stringify(input),
  }),
  generateApiTestsForEndpoint: (endpointId: string, input: {
    workspaceId?: string;
    projectId?: string;
    generationType?: ApiTestGenerationType;
    framework?: ApiTestFramework;
    environment?: string;
    authProfile?: string;
    priority?: ModulePriority;
    numberOfTests?: number;
  }) => apiRequest<ApiTestGenerationResponse>(`/api/api-test-generation/generate-endpoint/${endpointId}`, {
    method: "POST",
    body: JSON.stringify(input),
  }),
  generateApiTestsForCollection: (apiWorkspaceId: string, input: {
    workspaceId?: string;
    projectId?: string;
    generationType?: ApiTestGenerationType;
    framework?: ApiTestFramework;
    environment?: string;
    authProfile?: string;
    priority?: ModulePriority;
    numberOfTests?: number;
  }) => apiRequest<ApiTestGenerationResponse>(`/api/api-test-generation/generate-collection/${apiWorkspaceId}`, {
    method: "POST",
    body: JSON.stringify(input),
  }),
  getGeneratedApiTestSuite: (generationId: string) => apiRequest<GeneratedApiTestSuite>(`/api/api-test-generation/${generationId}`),
  listGeneratedApiTests: (generationId: string) => apiRequest<GeneratedApiTest[]>(`/api/api-test-generation/${generationId}/tests`),
  updateGeneratedApiTest: (testId: string, input: Partial<GeneratedApiTest>) =>
    apiRequest<{ test: GeneratedApiTest; suite: GeneratedApiTestSuite | null }>(`/api/api-test-generation/tests/${testId}`, {
      method: "PATCH",
      body: JSON.stringify(input),
    }),
  approveGeneratedApiTest: (testId: string) =>
    apiRequest<{ test: GeneratedApiTest; suite: GeneratedApiTestSuite | null }>(`/api/api-test-generation/tests/${testId}/approve`, { method: "POST" }),
  rejectGeneratedApiTest: (testId: string) =>
    apiRequest<{ test: GeneratedApiTest; suite: GeneratedApiTestSuite | null }>(`/api/api-test-generation/tests/${testId}/reject`, { method: "POST" }),
  regenerateGeneratedApiTest: (testId: string) =>
    apiRequest<{ test: GeneratedApiTest; suite: GeneratedApiTestSuite | null }>(`/api/api-test-generation/tests/${testId}/regenerate`, { method: "POST" }),
  runApiEndpoint: (endpointId: string, input: {
    workspaceId?: string;
    projectId?: string;
    apiWorkspaceId?: string;
    environment?: string;
    variables?: Record<string, string>;
    headers?: Record<string, string>;
    queryParams?: Record<string, string>;
    pathParams?: Record<string, string>;
    requestBody?: unknown;
    authType?: string;
    timeoutMs?: number;
    retryCount?: number;
    assertions?: ApiAssertionInput[];
  }) => apiRequest<ApiRun>(`/api/api-runner/run-endpoint/${endpointId}`, {
    method: "POST",
    body: JSON.stringify(input),
  }),
  runApiRequest: (input: {
    workspaceId?: string;
    projectId?: string;
    apiWorkspaceId?: string;
    environment?: string;
    variables?: Record<string, string>;
    url: string;
    method: string;
    headers?: Record<string, string>;
    queryParams?: Record<string, string>;
    pathParams?: Record<string, string>;
    requestBody?: unknown;
    authType?: string;
    timeoutMs?: number;
    retryCount?: number;
    assertions?: ApiAssertionInput[];
  }) => apiRequest<ApiRun>("/api/api-runner/run-request", {
    method: "POST",
    body: JSON.stringify(input),
  }),
  runApiCollection: (apiWorkspaceId: string, input: {
    workspaceId?: string;
    projectId?: string;
    environment?: string;
    variables?: Record<string, string>;
    headers?: Record<string, string>;
    queryParams?: Record<string, string>;
    pathParams?: Record<string, string>;
    requestBody?: unknown;
    authType?: string;
    timeoutMs?: number;
    retryCount?: number;
    assertions?: ApiAssertionInput[];
    stopOnFailure?: boolean;
  }) => apiRequest<ApiCollectionRunResponse>(`/api/api-runner/run-collection/${apiWorkspaceId}`, {
    method: "POST",
    body: JSON.stringify(input),
  }),
  listApiRuns: (filters: { workspaceId?: string; apiWorkspaceId?: string; endpointId?: string } = {}) => {
    const params = new URLSearchParams();
    if (filters.workspaceId) params.set("workspaceId", filters.workspaceId);
    if (filters.apiWorkspaceId) params.set("apiWorkspaceId", filters.apiWorkspaceId);
    if (filters.endpointId) params.set("endpointId", filters.endpointId);
    const query = params.toString();
    return apiRequest<ApiRun[]>(`/api/api-runner/runs${query ? `?${query}` : ""}`);
  },
  getApiRun: (runId: string) => apiRequest<ApiRun>(`/api/api-runner/runs/${runId}`),
  getApiRunLogs: (runId: string) => apiRequest<unknown>(`/api/api-runner/runs/${runId}/logs`),
  deleteApiRun: (runId: string) => apiRequest<void>(`/api/api-runner/runs/${runId}`, { method: "DELETE" }),
  runApiValidation: (input: {
    workspaceId?: string;
    projectId?: string;
    repositoryId?: string;
    apiWorkspaceId?: string;
    generatedSuiteId?: string;
    endpointIds?: string[];
    validationMode?: ApiValidationMode;
    framework?: ApiTestFramework;
    environment?: string;
    variables?: Record<string, string>;
    triggerSource?: string;
  }) => apiRequest<ApiValidationRun>("/api/api-validation/run", {
    method: "POST",
    body: JSON.stringify(input),
  }),
  runApiEndpointValidation: (endpointId: string, input: {
    workspaceId?: string;
    projectId?: string;
    apiWorkspaceId?: string;
    validationMode?: ApiValidationMode;
    framework?: ApiTestFramework;
    environment?: string;
    variables?: Record<string, string>;
  }) => apiRequest<ApiValidationRun>(`/api/api-validation/run-endpoint/${endpointId}`, {
    method: "POST",
    body: JSON.stringify(input),
  }),
  runApiWorkspaceValidation: (apiWorkspaceId: string, input: {
    workspaceId?: string;
    projectId?: string;
    validationMode?: ApiValidationMode;
    framework?: ApiTestFramework;
    environment?: string;
    variables?: Record<string, string>;
  }) => apiRequest<ApiValidationRun>(`/api/api-validation/run-workspace/${apiWorkspaceId}`, {
    method: "POST",
    body: JSON.stringify(input),
  }),
  retryApiValidation: (validationId: string, input: { variables?: Record<string, string> } = {}) =>
    apiRequest<ApiValidationRun>(`/api/api-validation/retry/${validationId}`, {
      method: "POST",
      body: JSON.stringify(input),
    }),
  getApiValidation: (validationId: string) => apiRequest<ApiValidationResponse>(`/api/api-validation/${validationId}`),
  listApiValidations: (filters: { workspaceId?: string; projectId?: string; apiWorkspaceId?: string; status?: ApiValidationStatus } = {}) => {
    const params = new URLSearchParams();
    if (filters.workspaceId) params.set("workspaceId", filters.workspaceId);
    if (filters.projectId) params.set("projectId", filters.projectId);
    if (filters.apiWorkspaceId) params.set("apiWorkspaceId", filters.apiWorkspaceId);
    if (filters.status) params.set("status", filters.status);
    const query = params.toString();
    return apiRequest<ApiValidationRun[]>(`/api/api-validation/history${query ? `?${query}` : ""}`);
  },
  getApiValidationReport: (validationId: string) => apiRequest<{ reportUrls: string[]; workflowUrl?: string }>(`/api/api-validation/report/${validationId}`),
  getApiValidationLogs: (validationId: string) => apiRequest<{ logs: string }>(`/api/api-validation/logs/${validationId}`),
  analyzeApiFailure: (validationRunId: string, regenerate = false) =>
    apiRequest<ApiFailureAnalysisResponse>("/api/api-failure-analysis/analyze", {
      method: "POST",
      body: JSON.stringify({ validationRunId, regenerate }),
    }),
  analyzeApiValidationFailure: (validationRunId: string) =>
    apiRequest<ApiFailureAnalysisResponse>(`/api/api-failure-analysis/analyze-validation/${validationRunId}`, { method: "POST" }),
  getApiFailureAnalysisByValidation: (validationRunId: string) =>
    apiRequest<ApiFailureAnalysisResponse | null>(`/api/api-failure-analysis/by-validation/${validationRunId}`),
  getApiFailureAnalysis: (analysisId: string) =>
    apiRequest<ApiFailureAnalysisResponse>(`/api/api-failure-analysis/${analysisId}`),
  getApiFailureHistory: (endpointId: string, workspaceId?: string) =>
    apiRequest<ApiFailureAnalysis[]>(`/api/api-failure-analysis/history/${endpointId}${workspaceId ? `?workspaceId=${encodeURIComponent(workspaceId)}` : ""}`),
  getApiFailureRecommendations: (analysisId: string) =>
    apiRequest<{ recommendations: string[]; autoFixPossible: boolean }>(`/api/api-failure-analysis/recommendations/${analysisId}`),
  regenerateApiFailureAnalysis: (input: { analysisId?: string; validationRunId?: string }) =>
    apiRequest<ApiFailureAnalysisResponse>("/api/api-failure-analysis/regenerate", {
      method: "POST",
      body: JSON.stringify(input),
    }),
  validateApiContract: (input: { endpointId: string; runId?: string; actualStatusCode?: number; actualResponse?: unknown }) =>
    apiRequest<ApiContractValidation>("/api/contract-testing/validate", {
      method: "POST",
      body: JSON.stringify(input),
    }),
  validateApiContractEndpoint: (endpointId: string, input: { runId?: string; actualStatusCode?: number; actualResponse?: unknown } = {}) =>
    apiRequest<ApiContractValidation>(`/api/contract-testing/validate-endpoint/${endpointId}`, {
      method: "POST",
      body: JSON.stringify(input),
    }),
  validateApiContractWorkspace: (apiWorkspaceId: string) =>
    apiRequest<{ validations: ApiContractValidation[]; summary: { total: number; passed: number; failed: number; warnings: number } }>(`/api/contract-testing/validate-workspace/${apiWorkspaceId}`, { method: "POST" }),
  getApiContractResult: (validationId: string) => apiRequest<ApiContractValidation>(`/api/contract-testing/results/${validationId}`),
  getApiContractHistory: (endpointId: string) => apiRequest<ApiContractValidation[]>(`/api/contract-testing/history/${endpointId}`),
  getApiContractCompatibility: (apiWorkspaceId: string) => apiRequest<ContractCompatibility>(`/api/contract-testing/compatibility/${apiWorkspaceId}`),
  getApiContractDashboard: (workspaceId?: string) =>
    apiRequest<ContractDashboard>(`/api/contract-testing/dashboard${workspaceId ? `?workspaceId=${encodeURIComponent(workspaceId)}` : ""}`),
  connectApiRepository: (input: { workspaceId?: string; projectId?: string; owner: string; repo: string; defaultBranch?: string; token: string }) =>
    apiRequest<ApiRepositoryProfile>("/api/api-repository/connect", {
      method: "POST",
      body: JSON.stringify(input),
    }),
  listApiRepositories: (workspaceId?: string) =>
    apiRequest<ApiRepositoryProfile[]>(`/api/api-repository${workspaceId ? `?workspaceId=${encodeURIComponent(workspaceId)}` : ""}`),
  scanApiRepository: (repositoryId: string) =>
    apiRequest<{ profile: ApiRepositoryProfile; mappings: ApiRouteMapping[] }>(`/api/api-repository/${repositoryId}/scan`, { method: "POST" }),
  getApiRepositorySummary: (repositoryId: string) => apiRequest<ApiRepositorySummary>(`/api/api-repository/${repositoryId}/summary`),
  listApiRepositoryEndpoints: (repositoryId: string) => apiRequest<ApiRouteMapping[]>(`/api/api-repository/${repositoryId}/endpoints`),
  getApiRepositoryDependencyGraph: (repositoryId: string) => apiRequest<ApiRepositoryDependencyGraph[]>(`/api/api-repository/${repositoryId}/dependency-graph`),
  runApiRepositoryImpactAnalysis: (repositoryId: string, input: { changedFiles: string[]; commitSha?: string }) =>
    apiRequest<ApiImpactAnalysis>(`/api/api-repository/${repositoryId}/impact-analysis`, {
      method: "POST",
      body: JSON.stringify(input),
    }),
  getApiRepositoryCoverage: (repositoryId: string) => apiRequest<ApiRepositoryCoverage>(`/api/api-repository/${repositoryId}/coverage`),
  getApiRepositoryRiskSummary: (repositoryId: string) => apiRequest<ApiRepositoryRiskSummary>(`/api/api-repository/${repositoryId}/risk-summary`),
  listProjects: () => apiRequest<ProjectSummary[]>("/api/projects"),
  createProject: (input: CreateProjectInput) =>
    apiRequest<ProjectSummary>("/api/projects", {
      method: "POST",
      body: JSON.stringify(input),
    }),
  getProject: (projectId: string) => apiRequest<ProjectDetail>(`/api/projects/${projectId}`),
  updateProject: (projectId: string, input: Partial<CreateProjectInput>) =>
    apiRequest<ProjectSummary>(`/api/projects/${projectId}`, {
      method: "PATCH",
      body: JSON.stringify(input),
    }),
  archiveProject: (projectId: string) =>
    apiRequest<ProjectSummary>(`/api/projects/${projectId}/archive`, { method: "PATCH" }),
  deleteProject: (projectId: string) =>
    apiRequest<void>(`/api/projects/${projectId}`, { method: "DELETE" }),
  listModules: (projectId: string) =>
    apiRequest<ProjectModule[]>(`/api/projects/${projectId}/modules`),
  createModule: (input: CreateModuleInput) =>
    apiRequest<ProjectModule>("/api/modules", {
      method: "POST",
      body: JSON.stringify(input),
    }),
  updateModule: (moduleId: string, input: Partial<Omit<CreateModuleInput, "projectId">>) =>
    apiRequest<ProjectModule>(`/api/modules/${moduleId}`, {
      method: "PATCH",
      body: JSON.stringify(input),
    }),
  deleteModule: (moduleId: string) => apiRequest<void>(`/api/modules/${moduleId}`, { method: "DELETE" }),
  listRequirements: (moduleId: string) =>
    apiRequest<Requirement[]>(`/api/modules/${moduleId}/requirements`),
  createRequirement: (input: CreateRequirementInput) =>
    apiRequest<Requirement>("/api/requirements", {
      method: "POST",
      body: JSON.stringify(input),
    }),
  updateRequirement: (
    requirementId: string,
    input: Partial<Omit<CreateRequirementInput, "projectId" | "moduleId">>,
  ) =>
    apiRequest<Requirement>(`/api/requirements/${requirementId}`, {
      method: "PATCH",
      body: JSON.stringify(input),
    }),
  deleteRequirement: (requirementId: string) =>
    apiRequest<void>(`/api/requirements/${requirementId}`, { method: "DELETE" }),
  getHistory: (requirementId: string) =>
    apiRequest<TestCaseHistoryRecord[]>(`/api/requirements/${requirementId}/history`),
  listHistory: (filters: HistoryFilters = {}) =>
    apiRequest<TestCaseHistoryRecord[]>(`/api/test-case-history${toQueryString(filters)}`),
  getHistoryById: (historyId: string) =>
    apiRequest<TestCaseHistoryRecord>(`/api/test-case-history/${historyId}`),
  compareHistory: (fromId: string, toId: string) =>
    apiRequest<TestCaseHistoryCompare>(
      `/api/test-case-history/compare?fromId=${encodeURIComponent(fromId)}&toId=${encodeURIComponent(toId)}`,
    ),
  updateHistoryStatus: (historyId: string, status: HistoryStatus) =>
    apiRequest<TestCaseHistoryRecord>(`/api/test-case-history/${historyId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),
  deleteHistory: (historyId: string) =>
    apiRequest<void>(`/api/test-case-history/${historyId}`, { method: "DELETE" }),
  listExportHistory: () => apiRequest<ExportHistoryRecord[]>("/api/export/history"),
  exportVersions: (historyIds: string[], format: ExportFormat) =>
    downloadBlob(`/api/export/${format}`, { historyIds }, `test-case-export.${format === "excel" ? "xlsx" : "pdf"}`),
  exportVersion: (historyId: string, format: ExportFormat) =>
    downloadBlob("/api/export/version", { historyId, format }, `test-case-version.${format === "excel" ? "xlsx" : "pdf"}`),
  exportRequirement: (requirementId: string, format: ExportFormat) =>
    downloadBlob("/api/export/requirement", { requirementId, format }, `requirement-export.${format === "excel" ? "xlsx" : "pdf"}`),
  exportProject: (projectId: string, format: ExportFormat) =>
    downloadBlob("/api/export/project", { projectId, format }, `project-export.${format === "excel" ? "xlsx" : "pdf"}`),
  exportFiltered: (filters: HistoryFilters, format: ExportFormat) =>
    downloadBlob(`/api/export/${format}`, { filters }, `filtered-export.${format === "excel" ? "xlsx" : "pdf"}`),
  sendAIChatMessage: (input: SendAIChatMessageInput) =>
    apiRequest<AIChat>("/api/ai-chat/message", {
      method: "POST",
      body: JSON.stringify(input),
    }),
  listAIChats: () => apiRequest<AIChatSummary[]>("/api/ai-chat/history"),
  getAIChat: (chatId: string) => apiRequest<AIChat>(`/api/ai-chat/${chatId}`),
  deleteAIChat: (chatId: string) => apiRequest<void>(`/api/ai-chat/${chatId}`, { method: "DELETE" }),
  saveChatAsVersion: (chatId: string, historyVersionId?: string) =>
    apiRequest<TestCaseHistoryRecord>(`/api/ai-chat/${chatId}/save-as-version`, {
      method: "POST",
      body: JSON.stringify({ historyVersionId }),
    }),
  submitForReview: (historyId: string, comment?: string) =>
    apiRequest<TestCaseHistoryRecord>(`/api/review/submit/${historyId}`, {
      method: "POST",
      body: JSON.stringify({ comment }),
    }),
  getReviewQueue: () => apiRequest<TestCaseHistoryRecord[]>("/api/review/queue"),
  getReviewDetail: (historyId: string) => apiRequest<ReviewDetail>(`/api/review/${historyId}`),
  approveReview: (historyId: string, comment?: string) =>
    apiRequest<TestCaseHistoryRecord>(`/api/review/approve/${historyId}`, {
      method: "POST",
      body: JSON.stringify({ comment }),
    }),
  requestReviewChanges: (historyId: string, comment: string) =>
    apiRequest<TestCaseHistoryRecord>(`/api/review/request-changes/${historyId}`, {
      method: "POST",
      body: JSON.stringify({ comment }),
    }),
  rejectReview: (historyId: string, comment: string) =>
    apiRequest<TestCaseHistoryRecord>(`/api/review/reject/${historyId}`, {
      method: "POST",
      body: JSON.stringify({ comment }),
    }),
  addReviewComment: (historyId: string, comment: string) =>
    apiRequest<ReviewComment>(`/api/review/comment/${historyId}`, {
      method: "POST",
      body: JSON.stringify({ comment }),
    }),
  getReviewComments: (historyId: string) =>
    apiRequest<ReviewComment[]>(`/api/review/comments/${historyId}`),
  listWorkspaces: () => apiRequest<Workspace[]>("/api/workspaces"),
  createWorkspace: (input: { workspaceName: string; description: string; logo?: string }) =>
    apiRequest<Workspace>("/api/workspaces", { method: "POST", body: JSON.stringify(input) }),
  getWorkspace: (workspaceId: string) => apiRequest<WorkspaceDetail>(`/api/workspaces/${workspaceId}`),
  updateWorkspace: (
    workspaceId: string,
    input: Partial<Pick<Workspace, "workspaceName" | "description" | "logo">>,
  ) => apiRequest<Workspace>(`/api/workspaces/${workspaceId}`, { method: "PUT", body: JSON.stringify(input) }),
  archiveWorkspace: (workspaceId: string) =>
    apiRequest<Workspace>(`/api/workspaces/${workspaceId}/archive`, { method: "PATCH" }),
  deleteWorkspace: (workspaceId: string) =>
    apiRequest<void>(`/api/workspaces/${workspaceId}`, { method: "DELETE" }),
  listWorkspaceMembers: (workspaceId: string) =>
    apiRequest<WorkspaceMember[]>(`/api/workspaces/${workspaceId}/members`),
  updateMemberRole: (workspaceId: string, memberId: string, role: WorkspaceRole) =>
    apiRequest<WorkspaceMember>(`/api/workspaces/${workspaceId}/members/${memberId}/role`, {
      method: "PATCH",
      body: JSON.stringify({ role }),
    }),
  updateMemberProjects: (
    workspaceId: string,
    memberId: string,
    assignedProjects: WorkspaceMember["assignedProjects"],
  ) =>
    apiRequest<WorkspaceMember>(`/api/workspaces/${workspaceId}/members/${memberId}/projects`, {
      method: "PATCH",
      body: JSON.stringify({ assignedProjects }),
    }),
  removeMember: (workspaceId: string, memberId: string) =>
    apiRequest<void>(`/api/workspaces/${workspaceId}/members/${memberId}`, { method: "DELETE" }),
  deactivateMember: (workspaceId: string, memberId: string) =>
    apiRequest<WorkspaceMember>(`/api/workspaces/${workspaceId}/members/${memberId}/deactivate`, {
      method: "PATCH",
    }),
  createInvite: (
    workspaceId: string,
    input: { email: string; role: WorkspaceRole; assignedProjects: WorkspaceInvite["assignedProjects"]; message?: string },
  ) =>
    apiRequest<WorkspaceInvite>(`/api/workspaces/${workspaceId}/invites`, {
      method: "POST",
      body: JSON.stringify(input),
    }),
  listInvites: (workspaceId: string) => apiRequest<WorkspaceInvite[]>(`/api/workspaces/${workspaceId}/invites`),
  acceptInvite: (token: string) =>
    apiRequest<WorkspaceMember>("/api/workspaces/invites/accept", {
      method: "POST",
      body: JSON.stringify({ token }),
    }),
  revokeInvite: (workspaceId: string, inviteId: string) =>
    apiRequest<WorkspaceInvite>(`/api/workspaces/${workspaceId}/invites/${inviteId}/revoke`, {
      method: "PATCH",
    }),
  resendInvite: (workspaceId: string, inviteId: string) =>
    apiRequest<WorkspaceInvite>(`/api/workspaces/${workspaceId}/invites/${inviteId}/resend`, {
      method: "POST",
    }),
  getMyPermissions: (workspaceId: string) =>
    apiRequest<{ userId: string; role: WorkspaceRole; permissions: string[]; assignedProjects: WorkspaceMember["assignedProjects"] }>(
      `/api/workspaces/${workspaceId}/permissions/me`,
    ),
  listRoles: (workspaceId: string) =>
    apiRequest<WorkspacePermission[]>(`/api/workspaces/${workspaceId}/roles`),
  updateRolePermissions: (workspaceId: string, role: WorkspaceRole, permissions: string[]) =>
    apiRequest<WorkspacePermission>(`/api/workspaces/${workspaceId}/roles/${role}`, {
      method: "PATCH",
      body: JSON.stringify({ role, permissions }),
    }),
  listAIProviders: (workspaceId: string) =>
    apiRequest<AIProviderSettingsResponse>(`/api/ai-providers?workspaceId=${encodeURIComponent(workspaceId)}`),
  createAIProvider: (input: SaveAIProviderInput) =>
    apiRequest<AIProviderConfig>("/api/ai-providers", { method: "POST", body: JSON.stringify(input) }),
  updateAIProvider: (providerId: string, input: Partial<Omit<SaveAIProviderInput, "workspaceId">>) =>
    apiRequest<AIProviderConfig>(`/api/ai-providers/${providerId}`, { method: "PUT", body: JSON.stringify(input) }),
  deleteAIProvider: (providerId: string) =>
    apiRequest<void>(`/api/ai-providers/${providerId}`, { method: "DELETE" }),
  testAIProvider: (providerId: string) =>
    apiRequest<{ ok: boolean; message: string }>(`/api/ai-providers/${providerId}/test`, { method: "POST" }),
  activateAIProvider: (providerId: string) =>
    apiRequest<AIProviderConfig>(`/api/ai-providers/${providerId}/activate`, { method: "PATCH" }),
  deactivateAIProvider: (providerId: string) =>
    apiRequest<AIProviderConfig>(`/api/ai-providers/${providerId}/deactivate`, { method: "PATCH" }),
  listAIProviderUsage: (workspaceId: string) =>
    apiRequest<AIProviderUsageLog[]>(`/api/ai-providers/usage?workspaceId=${encodeURIComponent(workspaceId)}`),
  updateAIProviderFeatureMapping: (
    workspaceId: string,
    mappings: Array<{ featureName: AIProviderFeatureName; providerId: string; modelName?: string; isActive?: boolean }>,
  ) =>
    apiRequest<AIProviderFeatureMapping[]>("/api/ai-providers/feature-mapping", {
      method: "PUT",
      body: JSON.stringify({ workspaceId, mappings }),
    }),
  getGitHubAutomationConfig: (workspaceId: string) =>
    apiRequest<GitHubAutomationConfig | null>(`/api/integrations/github/config?workspaceId=${encodeURIComponent(workspaceId)}`),
  getRepositoryLearning: (repositoryId: string) =>
    apiRequest<RepositoryLearningProfile>(`/api/repositories/${repositoryId}/learning`),
  refreshRepositoryLearning: (repositoryId: string) =>
    apiRequest<RepositoryLearningProfile>(`/api/repositories/${repositoryId}/learning/refresh`, { method: "POST" }),
  resetRepositoryLearning: (repositoryId: string) =>
    apiRequest<{ reset: boolean }>(`/api/repositories/${repositoryId}/learning`, { method: "DELETE" }),
  sendRepositoryLearningFeedback: (
    repositoryId: string,
    input: { action: "Approved" | "Rejected" | "Edited" | "Regenerated" | "Validation Passed" | "Validation Failed"; locatorStrategy?: string; confidenceDelta?: number },
  ) =>
    apiRequest<RepositoryLearningProfile>(`/api/repositories/${repositoryId}/learning/feedback`, {
      method: "POST",
      body: JSON.stringify(input),
    }),
  connectGitHubAutomation: (input: SaveGitHubAutomationConfigInput) =>
    apiRequest<GitHubAutomationConfig>("/api/integrations/github/connect", {
      method: "POST",
      body: JSON.stringify(input),
    }),
  testGitHubAutomationConnection: (workspaceId: string) =>
    apiRequest<{ ok: boolean; repository: string; defaultBranch: string; url: string }>("/api/integrations/github/test-connection", {
      method: "POST",
      body: JSON.stringify({ workspaceId }),
    }),
  connectApplicationRepository: (input: SaveApplicationRepositoryInput) =>
    apiRequest<ApplicationRepositoryConfig>("/api/integrations/github/application-repos/connect", {
      method: "POST",
      body: JSON.stringify(input),
    }),
  listApplicationRepositories: (workspaceId: string) =>
    apiRequest<ApplicationRepositoryConfig[]>(`/api/integrations/github/application-repos?workspaceId=${encodeURIComponent(workspaceId)}`),
  getApplicationRepository: (configId: string) =>
    apiRequest<ApplicationRepositoryConfig>(`/api/integrations/github/application-repos/${configId}`),
  testApplicationRepositoryConnection: (configId: string) =>
    apiRequest<{ ok: boolean; repository: string; defaultBranch: string; url: string }>(
      `/api/integrations/github/application-repos/${configId}/test-connection`,
      { method: "POST" },
    ),
  registerApplicationRepositoryWebhook: (configId: string) =>
    apiRequest<ApplicationRepositoryConfig & { manualSetup?: ApplicationRepositoryConfig["manualSetup"] }>(
      `/api/integrations/github/application-repos/${configId}/register-webhook`,
      { method: "POST" },
    ),
  deleteApplicationRepository: (configId: string) =>
    apiRequest<void>(`/api/integrations/github/application-repos/${configId}`, { method: "DELETE" }),
  listRepositoryActivity: (workspaceId: string, filters: { repositoryConfigId?: string; status?: RepositoryActivityStatus } = {}) => {
    const params = new URLSearchParams({ workspaceId });
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    return apiRequest<RepositoryActivity[]>(`/api/integrations/github/repository-activity?${params.toString()}`);
  },
  getRepositoryActivity: (activityId: string) =>
    apiRequest<RepositoryActivity>(`/api/integrations/github/repository-activity/${activityId}`),
  updateRepositoryActivityStatus: (activityId: string, status: RepositoryActivityStatus) =>
    apiRequest<RepositoryActivity>(`/api/integrations/github/repository-activity/${activityId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),
  runRepositoryImpactAnalysis: (activityId: string) =>
    apiRequest<RepositoryImpactAnalysis>(`/api/integrations/github/repository-activity/${activityId}/impact-analysis`, {
      method: "POST",
    }),
  getRepositoryImpactAnalysis: (activityId: string) =>
    apiRequest<RepositoryImpactAnalysis>(`/api/integrations/github/repository-activity/${activityId}/impact-analysis`),
  regenerateRepositoryImpactAnalysis: (activityId: string) =>
    apiRequest<RepositoryImpactAnalysis>(`/api/integrations/github/repository-activity/${activityId}/impact-analysis/regenerate`, {
      method: "POST",
    }),
  updateRepositoryImpactAnalysisStatus: (impactAnalysisId: string, status: RepositoryImpactAnalysisStatus) =>
    apiRequest<RepositoryImpactAnalysis>(`/api/integrations/github/impact-analysis/${impactAnalysisId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),
  generateRepositoryTestUpdates: (impactAnalysisId: string) =>
    apiRequest<RepositoryGeneratedTestUpdate[]>(`/api/integrations/github/impact-analysis/${impactAnalysisId}/generate-test-updates`, {
      method: "POST",
    }),
  listRepositoryTestUpdates: (impactAnalysisId: string) =>
    apiRequest<RepositoryGeneratedTestUpdate[]>(`/api/integrations/github/impact-analysis/${impactAnalysisId}/test-updates`),
  approveRepositoryTestUpdate: (updateId: string) =>
    apiRequest<RepositoryGeneratedTestUpdate>(`/api/integrations/github/test-updates/${updateId}/approve`, { method: "PATCH" }),
  rejectRepositoryTestUpdate: (updateId: string) =>
    apiRequest<RepositoryGeneratedTestUpdate>(`/api/integrations/github/test-updates/${updateId}/reject`, { method: "PATCH" }),
  editRepositoryTestUpdate: (updateId: string, input: { newCode: string; updateSummary?: string }) =>
    apiRequest<RepositoryGeneratedTestUpdate>(`/api/integrations/github/test-updates/${updateId}/edit`, {
      method: "PATCH",
      body: JSON.stringify(input),
    }),
  regenerateRepositoryTestUpdate: (updateId: string) =>
    apiRequest<RepositoryGeneratedTestUpdate>(`/api/integrations/github/test-updates/${updateId}/regenerate`, { method: "POST" }),
  runRepositoryUpdateValidation: (impactAnalysisId: string, input?: { validationMode?: RepositoryValidationMode; browser?: string }) =>
    apiRequest<RepositoryValidationRun>(`/api/integrations/github/impact-analysis/${impactAnalysisId}/run-validation`, {
      method: "POST",
      body: JSON.stringify(input ?? {}),
    }),
  getRepositoryUpdateValidation: (impactAnalysisId: string) =>
    apiRequest<RepositoryValidationRun>(`/api/integrations/github/impact-analysis/${impactAnalysisId}/validation-result`),
  generateRepositoryValidationRecommendation: (impactAnalysisId: string) =>
    apiRequest<RepositoryValidationRecommendation>(`/api/integrations/github/impact-analysis/${impactAnalysisId}/validation-recommendation`, { method: "POST" }),
  getRepositoryValidationRecommendation: (impactAnalysisId: string) =>
    apiRequest<RepositoryValidationRecommendation>(`/api/integrations/github/impact-analysis/${impactAnalysisId}/validation-recommendation`),
  regenerateRepositoryValidationRecommendation: (impactAnalysisId: string) =>
    apiRequest<RepositoryValidationRecommendation>(`/api/integrations/github/impact-analysis/${impactAnalysisId}/validation-recommendation/regenerate`, { method: "POST" }),
  generateRepositoryFixSuggestion: (impactAnalysisId: string) =>
    apiRequest<{ suggestion: string; validationRun?: RepositoryValidationRun }>(`/api/integrations/github/impact-analysis/${impactAnalysisId}/failure-explanation`, { method: "POST" }),
  generateValidationFailureAnalysis: (validationRunId: string) =>
    apiRequest<ValidationFailureAnalysis>(`/api/validation/${validationRunId}/failure-analysis`, { method: "POST" }),
  regenerateValidationFailureAnalysis: (validationRunId: string) =>
    apiRequest<ValidationFailureAnalysis>(`/api/validation/${validationRunId}/failure-analysis/regenerate`, { method: "POST" }),
  getValidationFailureAnalysis: (validationRunId: string) =>
    apiRequest<ValidationFailureAnalysis>(`/api/validation/${validationRunId}/failure-analysis`),
  listValidationFailedTests: (validationRunId: string) =>
    apiRequest<NonNullable<RepositoryValidationRun["failedTests"]>>(`/api/validation/${validationRunId}/failed-tests`),
  generateRootCauseAnalysis: (validationRunId: string) =>
    apiRequest<RootCauseAnalysis>(`/api/validation/${validationRunId}/root-cause-analysis`, { method: "POST" }),
  getRootCauseAnalysis: (validationRunId: string) =>
    apiRequest<RootCauseAnalysis>(`/api/validation/${validationRunId}/root-cause-analysis`),
  regenerateRootCauseAnalysis: (validationRunId: string) =>
    apiRequest<RootCauseAnalysis>(`/api/validation/${validationRunId}/root-cause-analysis/regenerate`, { method: "POST" }),
  getRootCauseEvidence: (validationRunId: string) =>
    apiRequest<{
      validationRunId: string;
      changedFiles: RepositoryActivityChangedFile[];
      failedTests: NonNullable<RepositoryValidationRun["failedTests"]>;
      logs?: string;
      stderr?: string;
      stackTrace?: string;
      failureAnalysis: ValidationFailureAnalysis | null;
      rootCause: RootCauseAnalysis | null;
      generatedUpdates: Array<{ testFilePath: string; updateSummary: string; impactReason: string }>;
    }>(`/api/validation/${validationRunId}/root-cause-evidence`),
  generateValidationAutoFix: (validationRunId: string) =>
    apiRequest<ValidationAutoFix[]>(`/api/validation/${validationRunId}/auto-fix`, { method: "POST" }),
  regenerateValidationAutoFix: (validationRunId: string) =>
    apiRequest<ValidationAutoFix[]>(`/api/validation/${validationRunId}/auto-fix/regenerate`, { method: "POST" }),
  listValidationAutoFixes: (validationRunId: string) =>
    apiRequest<ValidationAutoFix[]>(`/api/validation/${validationRunId}/auto-fix`),
  approveAllValidationAutoFixes: (validationRunId: string) =>
    apiRequest<ValidationAutoFix[]>(`/api/validation/${validationRunId}/auto-fix/approve`, { method: "POST" }),
  rejectAllValidationAutoFixes: (validationRunId: string) =>
    apiRequest<ValidationAutoFix[]>(`/api/validation/${validationRunId}/auto-fix/reject`, { method: "POST" }),
  commitValidationAutoFixes: (validationRunId: string) =>
    apiRequest<{ branch: string; committed: ValidationAutoFix[] }>(`/api/validation/${validationRunId}/auto-fix/commit`, { method: "POST" }),
  approveValidationAutoFix: (fixId: string) =>
    apiRequest<ValidationAutoFix>(`/api/validation/auto-fix/${fixId}/approve`, { method: "PATCH" }),
  rejectValidationAutoFix: (fixId: string) =>
    apiRequest<ValidationAutoFix>(`/api/validation/auto-fix/${fixId}/reject`, { method: "PATCH" }),
  editValidationAutoFix: (fixId: string, input: { fixedCode: string; fixSummary?: string }) =>
    apiRequest<ValidationAutoFix>(`/api/validation/auto-fix/${fixId}/edit`, { method: "PATCH", body: JSON.stringify(input) }),
  retryValidationRun: (validationRunId: string) =>
    apiRequest<{ retry: ValidationRetryAttempt; validationRun: RepositoryValidationRun }>(`/api/validation/${validationRunId}/retry`, { method: "POST" }),
  retryValidationAfterFix: (validationRunId: string) =>
    apiRequest<{ retry: ValidationRetryAttempt; validationRun: RepositoryValidationRun }>(`/api/validation/${validationRunId}/retry-after-fix`, { method: "POST" }),
  listValidationRetries: (validationRunId: string) =>
    apiRequest<ValidationRetryAttempt[]>(`/api/validation/${validationRunId}/retries`),
  getValidationRetryRecommendation: (validationRunId: string) =>
    apiRequest<{
      retryRecommendation: "Recommended" | "With Caution" | "Not Recommended";
      reason: string;
      failureType: ValidationFailureType | "Unknown";
      testFiles: string[];
      testNames: string[];
      maxRetries: number;
    }>(`/api/validation/${validationRunId}/retry-recommendation`),
  getValidationRetryStatistics: (workspaceId: string) =>
    apiRequest<{
      totalRetries: number;
      retrySuccessRate: number;
      flakyFailureCount: number;
      consistentFailureCount: number;
      averageRetryDuration: number;
      passedRetries: number;
      failedRetries: number;
      mostRetriedTests: Array<{ testFile: string; count: number }>;
      testsPassingAfterRetry: string[];
      testsFailingAfterRetry: string[];
    }>(`/api/validation/retry-statistics?workspaceId=${encodeURIComponent(workspaceId)}`),
  listValidationHistory: (filters: { workspaceId?: string; projectId?: string; status?: string } = {}) =>
    apiRequest<RepositoryValidationRun[]>(`/api/validation/history${executionQueryString(filters)}`),
  getValidationHistoryDetail: (validationRunId: string) =>
    apiRequest<{
      validationRun: RepositoryValidationRun;
      failureAnalysis: ValidationFailureAnalysis | null;
      autoFixes: ValidationAutoFix[];
      retries: ValidationRetryAttempt[];
      recommendation: RepositoryValidationRecommendation | null;
    }>(`/api/validation/history/${validationRunId}`),
  listValidationHistoryRecords: (filters: {
    workspaceId?: string;
    projectId?: string;
    repository?: string;
    branch?: string;
    commit?: string;
    status?: string;
    validationMode?: string;
    browser?: string;
    triggerSource?: string;
    user?: string;
    dateFrom?: string;
    dateTo?: string;
    aiRecommendation?: string;
    retryStatus?: string;
    search?: string;
  } = {}) =>
    apiRequest<ValidationHistoryRecord[]>(`/api/validation-history${executionQueryString(filters)}`),
  getValidationHistoryRecordDetail: (validationRunId: string) =>
    apiRequest<ValidationHistoryDetail>(`/api/validation-history/${validationRunId}`),
  getValidationHistoryTimeline: (validationRunId: string) =>
    apiRequest<ValidationHistoryTimelineStep[]>(`/api/validation-history/timeline/${validationRunId}`),
  getValidationHistoryReports: (validationRunId: string) =>
    apiRequest<ValidationHistoryRecord["reportUrls"]>(`/api/validation-history/reports/${validationRunId}`),
  getValidationHistoryLogs: (validationRunId: string) =>
    apiRequest<ValidationHistoryDetail["logs"]>(`/api/validation-history/logs/${validationRunId}`),
  getValidationHistoryRetries: (validationRunId: string) =>
    apiRequest<ValidationRetryAttempt[]>(`/api/validation-history/retry/${validationRunId}`),
  getValidationHistoryStatistics: (filters: { workspaceId?: string; projectId?: string; repository?: string; branch?: string; status?: string } = {}) =>
    apiRequest<ValidationHistoryStatistics>(`/api/validation-history/statistics${executionQueryString(filters)}`),
  getReleaseReadinessSummary: (workspaceId?: string) =>
    apiRequest<ReleaseReadinessSnapshot>(`/api/release-readiness/summary${workspaceId ? `?workspaceId=${encodeURIComponent(workspaceId)}` : ""}`),
  getProjectReleaseReadiness: (projectId: string) =>
    apiRequest<ReleaseReadinessSnapshot>(`/api/release-readiness/project/${projectId}`),
  getRepositoryReleaseReadiness: (repositoryId: string) =>
    apiRequest<ReleaseReadinessSnapshot>(`/api/release-readiness/repository/${repositoryId}`),
  getReleaseReadinessTimeline: (projectId: string) =>
    apiRequest<ValidationHistoryTimelineStep[]>(`/api/release-readiness/timeline/${projectId}`),
  recalculateReleaseReadiness: (input: { workspaceId?: string; projectId?: string; repositoryId?: string }) =>
    apiRequest<ReleaseReadinessSnapshot>("/api/release-readiness/recalculate", {
      method: "POST",
      body: JSON.stringify(input),
    }),
  createRepositoryImpactPullRequest: (impactAnalysisId: string, force = false) =>
    apiRequest<RepositoryUpdatePullRequest & { pullRequest?: { html_url: string; number: number; branchName: string; updatedFiles: string[] } }>(
      `/api/integrations/github/impact-analysis/${impactAnalysisId}/create-pr`,
      { method: "POST", body: JSON.stringify({ force }) },
    ),
  analyzeGitHubRepository: (workspaceId: string) =>
    apiRequest<RepositoryAnalysis>("/api/integrations/github/analyze-repository", {
      method: "POST",
      body: JSON.stringify({ workspaceId }),
    }),
  initializeAutomationRepositoryOnboarding: (workspaceId: string) =>
    apiRequest<{
      message: string;
      branchName: string | null;
      files: string[];
      pullRequest: { html_url: string; number: number; title: string } | null;
    }>("/api/integrations/github/automation-onboarding/initialize", {
      method: "POST",
      body: JSON.stringify({ workspaceId }),
    }),
  getGitHubRepositoryAnalysis: (workspaceId: string) =>
    apiRequest<RepositoryAnalysis | null>(`/api/integrations/github/analysis?workspaceId=${encodeURIComponent(workspaceId)}`),
  overrideGitHubRepositoryAnalysis: (
    input: Partial<Pick<RepositoryAnalysis, "framework" | "language" | "buildTool" | "testFolderPath" | "pageObjectFolderPath" | "usesPageObjectModel" | "usesFixtures" | "namingConvention" | "importStyle" | "pattern">> & { workspaceId: string },
  ) =>
    apiRequest<RepositoryAnalysis>("/api/integrations/github/analysis/override", {
      method: "PUT",
      body: JSON.stringify(input),
    }),
  syncGitHubRepository: (workspaceId: string) =>
    apiRequest<RepositorySync>("/api/integrations/github/sync", {
      method: "POST",
      body: JSON.stringify({ workspaceId }),
    }),
  listGitHubRepositorySyncs: (workspaceId: string) =>
    apiRequest<RepositorySync[]>(`/api/integrations/github/sync-history?workspaceId=${encodeURIComponent(workspaceId)}`),
  getGitHubRepositorySync: (syncId: string) =>
    apiRequest<RepositorySync>(`/api/integrations/github/sync/${syncId}`),
  generateGitHubRepositorySyncSuggestions: (syncId: string) =>
    apiRequest<RepositorySync>(`/api/integrations/github/sync/${syncId}/generate-suggestions`, { method: "POST" }),
  generateGitHubRepositorySyncUpdates: (syncId: string) =>
    apiRequest<RepositorySync>(`/api/integrations/github/sync/${syncId}/generate-updates`, { method: "POST" }),
  getGitHubRepositorySyncPrPreview: (syncId: string) =>
    apiRequest<RepositoryPrPreview>(`/api/integrations/github/sync/${syncId}/pr-preview`),
  createGitHubRepositorySyncUpdatePr: (syncId: string) =>
    apiRequest<RepositorySync & { pullRequest?: { pullRequestUrl: string; pullRequestNumber: number; branchName: string; updatedFiles: string[] } }>(
      `/api/integrations/github/sync/${syncId}/create-update-pr`,
      { method: "POST" },
    ),
  createGitHubRepositorySyncPr: (syncId: string) =>
    apiRequest<RepositorySync & { pullRequest?: { pullRequestUrl: string; pullRequestNumber: number; branchName: string; reportPath: string } }>(
      `/api/integrations/github/sync/${syncId}/create-pr`,
      { method: "POST" },
    ),
  pushPlaywrightToGitHub: (input: PushPlaywrightToGitHubInput) =>
    apiRequest<PushPlaywrightToGitHubResult>("/api/integrations/github/push-playwright-test", {
      method: "POST",
      body: JSON.stringify(input),
    }),
  createPlaywrightValidationJob: (input: CreatePlaywrightValidationJobInput) =>
    apiRequest<PlaywrightValidationJob>("/api/playwright-validation/jobs", {
      method: "POST",
      body: JSON.stringify(input),
    }),
  getPlaywrightValidationJob: (jobId: string) =>
    apiRequest<PlaywrightValidationJob>(`/api/playwright-validation/jobs/${jobId}`),
  listPlaywrightValidationJobs: (filters: { workspaceId?: string; projectId?: string; requirementId?: string } = {}) =>
    apiRequest<PlaywrightValidationJob[]>(`/api/playwright-validation/jobs${executionQueryString(filters)}`),
  getAnalyticsSummary: (filters: AnalyticsFilters = {}) =>
    apiRequest<AnalyticsSummary>(`/api/analytics/summary${analyticsQueryString(filters)}`),
  getAnalyticsCoverage: (filters: AnalyticsFilters = {}) =>
    apiRequest<AnalyticsCoverage>(`/api/analytics/coverage${analyticsQueryString(filters)}`),
  getAnalyticsGeneration: (filters: AnalyticsFilters = {}) =>
    apiRequest<AnalyticsGeneration>(`/api/analytics/generation${analyticsQueryString(filters)}`),
  getAnalyticsReview: (filters: AnalyticsFilters = {}) =>
    apiRequest<AnalyticsReview>(`/api/analytics/review${analyticsQueryString(filters)}`),
  getAnalyticsProjectsHealth: (filters: AnalyticsFilters = {}) =>
    apiRequest<AnalyticsProjectHealth[]>(`/api/analytics/projects-health${analyticsQueryString(filters)}`),
  getAnalyticsUsersProductivity: (filters: AnalyticsFilters = {}) =>
    apiRequest<AnalyticsUserProductivity[]>(`/api/analytics/users-productivity${analyticsQueryString(filters)}`),
  getAnalyticsAIUsage: (filters: AnalyticsFilters = {}) =>
    apiRequest<AnalyticsAIUsage>(`/api/analytics/ai-usage${analyticsQueryString(filters)}`),
  getAnalyticsExports: (filters: AnalyticsFilters = {}) =>
    apiRequest<AnalyticsExports>(`/api/analytics/exports${analyticsQueryString(filters)}`),
  getApiAnalyticsSummary: (filters: ApiAnalyticsFilters = {}) =>
    apiRequest<ApiAnalyticsSummary>(`/api/api-analytics/summary${analyticsQueryString(filters)}`),
  getApiAnalyticsWorkspace: (apiWorkspaceId: string, filters: ApiAnalyticsFilters = {}) =>
    apiRequest<ApiAnalyticsSummary>(`/api/api-analytics/workspace/${apiWorkspaceId}${analyticsQueryString(filters)}`),
  getApiAnalyticsProject: (projectId: string, filters: ApiAnalyticsFilters = {}) =>
    apiRequest<ApiAnalyticsSummary>(`/api/api-analytics/project/${projectId}${analyticsQueryString(filters)}`),
  getApiAnalyticsCoverage: (filters: ApiAnalyticsFilters = {}) =>
    apiRequest<ApiAnalyticsSummary["coverage"]>(`/api/api-analytics/coverage${analyticsQueryString(filters)}`),
  getApiAnalyticsValidationTrends: (filters: ApiAnalyticsFilters = {}) =>
    apiRequest<ApiAnalyticsSummary["validation"]>(`/api/api-analytics/validation-trends${analyticsQueryString(filters)}`),
  getApiAnalyticsPerformance: (filters: ApiAnalyticsFilters = {}) =>
    apiRequest<ApiAnalyticsSummary["performance"]>(`/api/api-analytics/performance${analyticsQueryString(filters)}`),
  getApiAnalyticsContracts: (filters: ApiAnalyticsFilters = {}) =>
    apiRequest<ApiAnalyticsSummary["contracts"]>(`/api/api-analytics/contracts${analyticsQueryString(filters)}`),
  getApiAnalyticsRisks: (filters: ApiAnalyticsFilters = {}) =>
    apiRequest<ApiAnalyticsSummary["risks"]>(`/api/api-analytics/risks${analyticsQueryString(filters)}`),
  generateApiAnalyticsInsights: (filters: ApiAnalyticsFilters = {}) =>
    apiRequest<{ insights: string[]; summary: ApiAnalyticsSummary["summary"] }>("/api/api-analytics/ai-insights", {
      method: "POST",
      body: JSON.stringify(filters),
    }),
  getAIQualitySummary: (filters: AIQualityFilters = {}) =>
    apiRequest<AIQualitySummary>(`/api/ai-quality/summary${aiQualityQueryString(filters)}`),
  getAIQualityProject: (projectId: string, filters: AIQualityFilters = {}) =>
    apiRequest<AIQualitySummary>(`/api/ai-quality/project/${projectId}${aiQualityQueryString(filters)}`),
  getAIQualityRepository: (repositoryId: string, filters: AIQualityFilters = {}) =>
    apiRequest<AIQualitySummary>(`/api/ai-quality/repository/${repositoryId}${aiQualityQueryString(filters)}`),
  getAIQualityTrends: (filters: AIQualityFilters = {}) =>
    apiRequest<AIQualityTrendPoint[]>(`/api/ai-quality/trends${aiQualityQueryString(filters)}`),
  getAIQualityGeneratedOutput: (outputId: string) =>
    apiRequest<AIQualityGeneratedOutputDetail>(`/api/ai-quality/generated-output/${outputId}`),
  recalculateAIQuality: (filters: AIQualityFilters = {}) =>
    apiRequest<{ recalculated: number; summary: AIQualitySummary }>("/api/ai-quality/recalculate", {
      method: "POST",
      body: JSON.stringify(filters),
    }),
  listApprovedTestCaseVersions: (filters: { projectId?: string; moduleId?: string; requirementId?: string } = {}) =>
    apiRequest<ApprovedTestCaseVersion[]>(`/api/approved-test-case-versions${executionQueryString(filters)}`),
  createTestRun: (input: CreateTestRunInput) =>
    apiRequest<TestRunSummary>("/api/test-runs", { method: "POST", body: JSON.stringify(input) }),
  listTestRuns: (filters: { projectId?: string; status?: TestRunStatus } = {}) =>
    apiRequest<TestRunSummary[]>(`/api/test-runs${executionQueryString(filters)}`),
  getTestRun: (testRunId: string) => apiRequest<TestRunDetail>(`/api/test-runs/${testRunId}`),
  updateTestRun: (testRunId: string, input: Partial<CreateTestRunInput> & { status?: TestRunStatus }) =>
    apiRequest<TestRunSummary>(`/api/test-runs/${testRunId}`, { method: "PUT", body: JSON.stringify(input) }),
  deleteTestRun: (testRunId: string) => apiRequest<void>(`/api/test-runs/${testRunId}`, { method: "DELETE" }),
  listTestExecutions: (testRunId: string) =>
    apiRequest<TestExecution[]>(`/api/test-runs/${testRunId}/executions`),
  updateTestExecutionStatus: (
    executionId: string,
    input: Partial<Pick<TestExecution, "actualResult" | "comments" | "screenshotUrl" | "videoUrl" | "logUrl" | "bugId" | "jiraBugId" | "jiraBugUrl" | "executionTime" | "browser" | "operatingSystem" | "buildNumber" | "environment">> & { status: TestExecutionStatus; updatedBy?: string },
  ) =>
    apiRequest<TestExecution>(`/api/test-executions/${executionId}/status`, {
      method: "PATCH",
      body: JSON.stringify(input),
    }),
  updateTestExecutionDetails: (
    executionId: string,
    input: Partial<Pick<TestExecution, "actualResult" | "comments" | "screenshotUrl" | "videoUrl" | "logUrl" | "bugId" | "jiraBugId" | "jiraBugUrl" | "executionTime" | "browser" | "operatingSystem" | "buildNumber" | "environment">>,
  ) =>
    apiRequest<TestExecution>(`/api/test-executions/${executionId}/details`, {
      method: "PATCH",
      body: JSON.stringify(input),
    }),
  getTestExecutionHistory: (executionId: string) =>
    apiRequest<TestExecutionHistoryItem[]>(`/api/test-executions/${executionId}/history`),
  getTestExecutionDashboard: () => apiRequest<TestExecutionDashboard>("/api/test-execution/dashboard"),
  getTestExecutionReports: () => apiRequest<TestRunSummary[]>("/api/test-execution/reports"),
  exportTestRunReport: (testRunId: string, format: ExportFormat) =>
    downloadGet(`/api/test-runs/${testRunId}/export?format=${format}`, `test-run-report.${format === "excel" ? "xls" : "html"}`),
};
