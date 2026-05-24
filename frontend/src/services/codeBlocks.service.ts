import api from "./api";
import type { CodeBlock } from "../types";

export const fetchCodeBlocks = () =>
  api.get<CodeBlock[]>("/api/codeblocks");

export const fetchCodeBlockById = (id: string) =>
  api.get<CodeBlock>(`/api/codeblocks/${id}`);

export const checkSolution = (id: string, code: string) =>
  api.post<{ correct: boolean }>(`/api/codeblocks/${id}/check`, { code });
