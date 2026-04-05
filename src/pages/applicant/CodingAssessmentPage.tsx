import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CodeEditor from "@/components/coding/CodeEditor";
import {
  startCodingTest,
  submitCodingTest,
} from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Play } from "lucide-react";
import toast from "react-hot-toast";

// ===============================
// DOMAIN → LANGUAGE MAP
// ===============================
const domainLanguageMap: Record<string, string> = {
  web_development: "javascript",
  backend: "python",
  cyber_security: "python",
  networking: "python",
  database: "python",
  operating_system: "cpp",
  file_processing: "python",
  system_design: "java",
};

// ===============================
// BOILERPLATES
// ===============================
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

export default function CodingAssessmentPage() {
  const { applicationId } = useParams();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [jobLanguage, setJobLanguage] = useState("python");

  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [inputs, setInputs] = useState<Record<string, string>>({});

  const [code, setCode] = useState("");
  const [input, setInput] = useState("");

  const [output, setOutput] = useState("");
  const [running, setRunning] = useState(false);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const currentQuestion = questions[currentIndex];

  // ✅ AUTO LANGUAGE
  const language =
    domainLanguageMap[currentQuestion?.domain] || "python";

  // ===============================
  // LOAD QUESTIONS
  // ===============================
  useEffect(() => {
    const load = async () => {
      try {
        const res = await startCodingTest(applicationId!);
        setQuestions(res.questions || []);
        

        if (res.questions?.length > 0) {
          const first = res.questions[0];
          const lang = domainLanguageMap[first.domain] || "python";

          setCode(boilerplates[lang]);
          setInput("");
        }
      } catch (err: any) {
        toast.error(err?.message || "Failed to load coding test");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [applicationId]);

  // ===============================
  // SAVE STATE
  // ===============================
  const saveState = () => {
    if (!currentQuestion) return;

    setAnswers((prev) => ({
      ...prev,
      [String(currentQuestion._id)]: code,
    }));

    setInputs((prev) => ({
      ...prev,
      [currentQuestion._id]: input,
    }));
  };

  // ===============================
  // CHANGE QUESTION
  // ===============================
  const changeQuestion = (index: number) => {
    saveState();

    const q = questions[index];
    setCurrentIndex(index);

    const lang = domainLanguageMap[q.domain] || "python";

    setCode(answers[q._id] || boilerplates[lang]);
    setInput(inputs[q._id] || "");
    setOutput("");
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      changeQuestion(currentIndex + 1);
    }
  };

  const prevQuestion = () => {
    if (currentIndex > 0) {
      changeQuestion(currentIndex - 1);
    }
  };

  // ===============================
  // RUN CODE
  // ===============================
  const runCode = async () => {
    try {
      setRunning(true);
      setOutput("Running...");

      const res = await fetch("/api/coding/run", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          code,
          input: input || "\n",
          language, // ✅ IMPORTANT
        }),
      });

      const data = await res.json();

      let out = "";

      if (data.stdout && data.stdout.trim() !== "") {
        out += `STDOUT:\n${data.stdout}\n`;
      }

      if (data.stderr && data.stderr.trim() !== "") {
        out += `\n❌ ERROR:\n${data.stderr}`;
      }

      if (!out) {
        out = "⚠️ No output (did you forget print?)";
      }

      setOutput(out);
    } catch (err: any) {
      setOutput(err.message || "Execution failed");
    } finally {
      setRunning(false);
    }
  };

  // ===============================
  // SUBMIT TEST
  // ===============================
  const submitTest = async () => {
    setSubmitting(true);

    try {
      const finalAnswers = {
        ...answers,
        [String(currentQuestion._id)]: code,
      };

      const result = await submitCodingTest(applicationId!, finalAnswers);

      toast.success(
        `Score: ${result.coding_score} | Final: ${result.final_score}`
      );

      setTimeout(() => {
        navigate("/applicant/applications");
      }, 1500);
    } catch (err: any) {
      toast.error(err?.message || "Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  // ===============================
  // LOADING
  // ===============================
  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <Loader2 className="animate-spin w-6 h-6" />
      </div>
    );
  }

  if (!currentQuestion) {
    return <div className="p-6">No questions available</div>;
  }

  return (
    <div className="max-w-[1600px] mx-auto px-6 py-6 flex flex-col gap-6">

      {/* HEADER */}
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h1 className="text-2xl font-semibold">
            Coding Assessment
          </h1>
          <p className="text-sm text-muted-foreground">
            Solve problems like a real interview
          </p>
        </div>

        <Badge className="text-sm px-3 py-1">
          {currentIndex + 1} / {questions.length}
        </Badge>
      </div>

      {/* MAIN */}
      <div className="grid grid-cols-2 gap-6 h-[calc(100vh-260px)]">

        {/* QUESTION */}
        <Card className="h-full">
          <CardContent className="p-6 space-y-4 overflow-y-auto">
            <div className="flex justify-between">
              <h2 className="text-lg font-semibold">
                {currentQuestion.title}
              </h2>

              <Badge variant="secondary">
                {currentQuestion.difficulty}
              </Badge>
            </div>

            <div className="text-sm whitespace-pre-line text-muted-foreground leading-relaxed">
              {currentQuestion.description}
            </div>
          </CardContent>
        </Card>

        {/* EDITOR */}
        <Card className="flex flex-col h-full">
          <CardContent className="p-4 flex flex-col gap-3 flex-1">

            {/* RUN */}
            <div className="flex justify-between">
              <Button
                onClick={runCode}
                disabled={running}
                variant="secondary"
              >
                {running ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-1" />
                    Run Code
                  </>
                )}
              </Button>
            </div>

            {/* EDITOR */}
            <div className="flex-1">
              <CodeEditor
                code={code}
                onChange={setCode}
                language={language}
              />
            </div>

            {/* INPUT */}
            <div>
              <p className="text-xs text-muted-foreground mb-1">
                Custom Input (stdin)
              </p>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full p-2 border rounded text-sm font-mono"
                placeholder="Enter input here..."
              />
            </div>

            {/* TERMINAL */}
            <div className="bg-black text-green-400 p-3 rounded h-36 overflow-auto font-mono text-sm">
              {output || "Run your code to see output..."}
            </div>

          </CardContent>
        </Card>

      </div>

      {/* FOOTER */}
      <div className="flex justify-between border-t pt-4">

        <Button
          variant="outline"
          onClick={prevQuestion}
          disabled={currentIndex === 0}
        >
          Previous
        </Button>

        {currentIndex !== questions.length - 1 ? (
          <Button onClick={nextQuestion}>
            Next Question
          </Button>
        ) : (
          <Button
            onClick={submitTest}
            disabled={submitting}
          >
            {submitting ? (
              <Loader2 className="animate-spin w-4 h-4" />
            ) : (
              "Submit Test"
            )}
          </Button>
        )}

      </div>

    </div>
  );
}