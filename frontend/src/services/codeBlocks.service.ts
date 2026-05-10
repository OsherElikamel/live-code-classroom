import api from "./api";
import type { CodeBlock } from "../types";

export const fetchCodeBlocks = () =>
  api.get<CodeBlock[]>("/api/codeblocks");

export const fetchCodeBlockById = (id: string) =>
  api.get<CodeBlock>(`/api/codeblocks/${id}`);
