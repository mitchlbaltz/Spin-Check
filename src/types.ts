export interface PersuasionTechnique {
  techniqueName: string;
  present: boolean;
  example: string;
  explanation: string;
}

export interface LogicalFallacy {
  name: string;
  explanation: string;
}

export interface AnalysisResponse {
  whatThisIs: string;
  mainClaims: string[];
  persuasionTechniques: PersuasionTechnique[];
  logicalFallacies: LogicalFallacy[];
  whatToCheck: string[];
  missingContext: string[];
}

export type AppState = "camera" | "preview" | "analyzing" | "result" | "error";
