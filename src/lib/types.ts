export interface GenerationRequest {
  company: string;
  persons: string[];
}

export interface StreamSection {
  type: "company" | "person" | "meeting_prep";
  name?: string; // for person sections
  content: string;
}
