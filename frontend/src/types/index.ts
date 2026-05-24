export interface CodeBlock {
  _id: string;
  title: string;
  description: string;
  initialCode: string;
}

export type Role = "mentor" | "student" | null;
