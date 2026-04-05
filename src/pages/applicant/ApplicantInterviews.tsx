import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  Video,
  User,
  CheckCircle2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

// Temporary empty upcoming interviews (until backend connected)
const interviews: any[] = [];

const pastInterviews = [
  {
    id: 3,
    company: "StartupXYZ",
    role: "React Developer",
    date: "2024-01-05",
    time: "11:00 AM PST",
    type: "Technical Interview",
    interviewer: "John Smith",
    platform: "Google Meet",
    status: "Completed",
    feedback: "Strong technical skills, good communication",
  },
  {
    id: 4,
    company: "TechCorp Inc.",
    role: "Senior Frontend Developer",
    date: "2024-01-02",
    time: "3:00 PM PST",
    type: "HR Screening",
    interviewer: "Lisa Wang",
    platform: "Zoom",
    status: "Completed",
    feedback: "Great cultural fit, proceed to technical round",
  },
];

export const ApplicantInterviews = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-foreground">
          My Interviews
        </h1>
        <p className="text-muted-foreground">
          Manage your upcoming and past interviews
        </p>
      </motion.div>

      {/* Upcoming Interviews */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-chart-1" />
          Upcoming Interviews ({interviews.length})
        </h2>

        <div className="space-y-4">
          {interviews.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-foreground font-medium">
                  No upcoming interviews
                </p>
                <p className="text-muted-foreground">
                  Complete assessments to get interview invitations
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </motion.div>

      {/* Interview Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="bg-gradient-to-r from-primary/5 to-chart-1/5 border-primary/20">
          <CardContent className="p-5">
            <h3 className="font-semibold text-foreground mb-3">
              💡 Interview Tips
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-chart-4 mt-0.5 flex-shrink-0" />
                Test your camera and microphone 15 minutes before the interview
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-chart-4 mt-0.5 flex-shrink-0" />
                Review the job description and prepare relevant examples
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-chart-4 mt-0.5 flex-shrink-0" />
                Have questions ready to ask the interviewer
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-chart-4 mt-0.5 flex-shrink-0" />
                Keep a copy of your resume handy for reference
              </li>
            </ul>
          </CardContent>
        </Card>
      </motion.div>

      {/* Past Interviews */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-chart-4" />
          Past Interviews ({pastInterviews.length})
        </h2>

        <div className="space-y-4">
          {pastInterviews.map((interview, index) => (
            <motion.div
              key={interview.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <Card className="opacity-80">
                <CardContent className="p-5">
                  <div>
                    <h3 className="font-semibold text-foreground">
                      {interview.role}
                    </h3>
                    <p className="text-muted-foreground">
                      {interview.company}
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      {interview.date} • {interview.type} • with{" "}
                      {interview.interviewer}
                    </p>
                    {interview.feedback && (
                      <p className="mt-3 text-sm text-chart-4 bg-chart-4/5 px-3 py-2 rounded-lg">
                        ✨ Feedback: {interview.feedback}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};