import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { startAssessment, submitAssessment } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { toast } from "react-hot-toast";
import { Clock } from "lucide-react";

interface Question {
  id: string;
  question: string;
  options: string[];
}

const TEST_DURATION = 15 * 60; // 15 minutes in seconds

export default function TestPage() {
  const { jobId, applicationId } = useParams<{
    jobId: string;
    applicationId: string;
  }>();

  const navigate = useNavigate();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(TEST_DURATION);
  const [submitting, setSubmitting] = useState(false);

  const hasSubmitted = useRef(false);

  // ===============================
  // LOAD QUESTIONS
  // ===============================
  useEffect(() => {
    if (!jobId || !applicationId) return;

    const loadQuestions = async () => {
      try {
        const res = await startAssessment(jobId, applicationId);

        if (!res?.questions?.length) {
          toast.error("No questions available");
          navigate("/applicant/applications");
          return;
        }

        setQuestions(res.questions);
      } catch (err: any) {
        toast.error(err?.message || "Failed to load questions");
        navigate("/applicant/applications");
      } finally {
        setLoading(false);
      }
    };

    loadQuestions();
  }, [jobId, applicationId, navigate]);

  // ===============================
  // TIMER
  // ===============================
  useEffect(() => {
    if (loading) return;

    if (timeLeft <= 0 && !hasSubmitted.current) {
      toast.error("Time is up! Auto-submitting...");
      handleSubmit();
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, loading]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  // ===============================
  // PREVENT PAGE EXIT DURING TEST
  // ===============================
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!hasSubmitted.current) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  // ===============================
  // ANSWER SELECT (FORCE NUMBER)
  // ===============================
  const handleSelect = (optionIndex: number) => {
    const qid = questions[currentIndex].id;

    setAnswers((prev) => ({
      ...prev,
      [qid]: Number(optionIndex), // 🔥 force number
    }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const allAnswered =
    questions.length > 0 &&
    Object.keys(answers).length === questions.length;

  // ===============================
  // SUBMIT
  // ===============================
  const handleSubmit = async () => {
    if (!jobId || !applicationId || hasSubmitted.current) return;

    try {
      setSubmitting(true);
      hasSubmitted.current = true;

      const result = await submitAssessment(
        jobId,
        applicationId,
        answers // 🔥 send raw answers
      );

      toast.success(
        `Test Completed! Final Score: ${result.final_score}%`
      );

      navigate("/applicant/applications");
    } catch (err: any) {
      hasSubmitted.current = false;
      setSubmitting(false);
      toast.error(err?.message || "Failed to submit test");
    }
  };

  if (loading)
    return <div className="p-6">Loading questions...</div>;

  if (!questions.length)
    return <div className="p-6">No questions available</div>;

  const question = questions[currentIndex];
  const progress =
    ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-background p-6 flex flex-col justify-between">
      
      {/* Header */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <p className="text-sm text-muted-foreground">
            Question {currentIndex + 1} of {questions.length}
          </p>
          <Progress value={progress} className="mt-2 w-64" />
        </div>

        <div className="flex items-center gap-2 text-red-500 font-semibold">
          <Clock size={18} />
          {formatTime(timeLeft)}
        </div>
      </div>

      {/* Question */}
      <Card className="p-6 flex-1">
        <h2 className="text-xl font-semibold mb-6">
          {question.question}
        </h2>

        <div className="space-y-4">
          {question.options.map((opt, index) => (
            <div
              key={index}
              onClick={() => handleSelect(index)}
              className={`p-4 border rounded-xl cursor-pointer transition ${
                answers[question.id] === index
                  ? "border-primary bg-primary/10"
                  : "border-border hover:bg-accent"
              }`}
            >
              {opt}
            </div>
          ))}
        </div>
      </Card>

      {/* Footer */}
      <div className="flex justify-end mt-6 gap-4">
        {currentIndex < questions.length - 1 ? (
          <Button onClick={handleNext}>
            Next
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={!allAnswered || submitting}
          >
            {submitting ? "Submitting..." : "Submit Test"}
          </Button>
        )}
      </div>
    </div>
  );
}