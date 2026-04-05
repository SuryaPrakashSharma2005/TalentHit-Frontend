import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import toast from "react-hot-toast";

interface CreateAssessmentModalProps {
  open: boolean;
  onClose: () => void;
}

export function CreateAssessmentModal({ open, onClose }: CreateAssessmentModalProps) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState("");
  const [duration, setDuration] = useState("60");
  const [difficulty, setDifficulty] = useState("");
  const [questions, setQuestions] = useState("10");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Assessment created successfully!");
    onClose();
    setTitle("");
    setCategory("");
    setType("");
    setDuration("60");
    setDifficulty("");
    setQuestions("10");
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Create New Assessment</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Assessment Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Frontend Technical Assessment"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Skill Category</Label>
            <Select value={category} onValueChange={setCategory} required>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Engineering">Engineering</SelectItem>
                <SelectItem value="Design">Design</SelectItem>
                <SelectItem value="Product Management">Product Management</SelectItem>
                <SelectItem value="Marketing">Marketing</SelectItem>
                <SelectItem value="Sales">Sales</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Test Type</Label>
            <Select value={type} onValueChange={setType} required>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MCQ">MCQ</SelectItem>
                <SelectItem value="Coding">Coding</SelectItem>
                <SelectItem value="Situational">Situational</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                min="15"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="questions">Number of Questions</Label>
              <Input
                id="questions"
                type="number"
                value={questions}
                onChange={(e) => setQuestions(e.target.value)}
                min="5"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="difficulty">Difficulty</Label>
            <Select value={difficulty} onValueChange={setDifficulty} required>
              <SelectTrigger>
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Beginner">Beginner</SelectItem>
                <SelectItem value="Intermediate">Intermediate</SelectItem>
                <SelectItem value="Advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-3 justify-end">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Create Assessment</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
