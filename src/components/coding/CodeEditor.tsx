import { useEffect } from "react";
import Editor from "@monaco-editor/react";

interface CodeEditorProps {
  code: string;
  onChange: (value: string) => void;
  language: string;
}

const boilerplates: Record<string, string> = {
  python: `# Read input
import sys
data = sys.stdin.read().strip()

# Write your code here
print(data)`,

  javascript: `process.stdin.resume();
process.stdin.setEncoding('utf-8');

let input = '';
process.stdin.on('data', chunk => input += chunk);
process.stdin.on('end', () => {

  // Write your code here
  console.log(input.trim());
});`,

  cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(NULL);

    // Write your code here

    return 0;
}`,

  java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        // Write your code here
    }
}`,
};

export default function CodeEditor({
  code,
  onChange,
  language,
}: CodeEditorProps) {

  // 🔥 Auto insert boilerplate if empty
  useEffect(() => {
    if (!code) {
      onChange(boilerplates[language] || "");
    }
  }, [language]);

  const resetCode = () => {
    onChange(boilerplates[language] || "");
  };

  return (
    <div className="w-full flex flex-col gap-3">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-lg">Code Editor</h3>

        <div className="flex items-center gap-2">
          <span className="text-sm px-3 py-1 border rounded bg-muted">
            {language.toUpperCase()}
          </span>

          <button
            onClick={resetCode}
            className="text-xs px-3 py-1 border rounded hover:bg-gray-100"
          >
            Reset
          </button>
        </div>
      </div>

      {/* EDITOR */}
      <div className="border rounded overflow-hidden">
        <Editor
          height="500px"
          language={language}
          theme="vs-dark"
          value={code}
          onChange={(value) => onChange(value || "")}
          options={{
            fontSize: 14,
            minimap: { enabled: false },
            automaticLayout: true,
            scrollBeyondLastLine: false,
            wordWrap: "on",
            tabSize: 2,
          }}
        />
      </div>
    </div>
  );
}