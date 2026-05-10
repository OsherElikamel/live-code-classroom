import Editor from "@monaco-editor/react";
import { useThemeMode } from "../../contexts/ThemeContext";

interface CodeEditorProps {
  value: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  language?: string;
}

const CodeEditor = ({
  value,
  onChange,
  readOnly = false,
  language = "javascript",
}: CodeEditorProps) => {
  const { mode } = useThemeMode();

  return (
    <Editor
      height="100%"
      language={language}
      theme={mode === "dark" ? "vs-dark" : "light"}
      value={value}
      onChange={(v) => onChange?.(v ?? "")}
      options={{
        readOnly,
        minimap: { enabled: false },
        wordWrap: "on",
        fontSize: 16,
        lineHeight: 24,
        lineNumbers: "on",
        scrollBeyondLastLine: false,
        automaticLayout: true,
        padding: { top: 16, bottom: 16 },
      }}
    />
  );
};

export default CodeEditor;
