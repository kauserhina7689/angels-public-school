"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, FileText, Upload, Calendar } from "lucide-react";

const assignments = [
  {
    id: 1,
    title: "Quadratic Equations Problem Set",
    description:
      "Solve 20 quadratic equations using different methods including factoring, completing the square, and quadratic formula.",
    class: "10A",
    postDate: "2024-01-15",
    hasFile: true,
  },
  {
    id: 2,
    title: "Newton's Laws Lab Report",
    description:
      "Complete lab report on Newton's three laws of motion with experimental data and calculations.",
    class: "11A",
    postDate: "2024-01-12",
    hasFile: false,
  },
  {
    id: 3,
    title: "Shakespeare Essay Analysis",
    description:
      "Write a 750-word analytical essay on the themes of love and conflict in Romeo and Juliet.",
    class: "9B",
    postDate: "2024-01-10",
    hasFile: true,
  },
];

export default function AssignmentsPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Send Assignments</h1>
          <p className="text-muted-foreground">
            Post assignments to a selected class with title, description, and
            optional file upload
          </p>
        </div>
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-xl">
              <Plus className="w-4 h-4 mr-2" />
              Send Assignment
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-xl max-w-2xl">
            <DialogHeader>
              <DialogTitle>Send New Assignment</DialogTitle>
              <DialogDescription>
                Post an assignment to a selected class.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Assignment Title</Label>
                <Input
                  id="title"
                  placeholder="Enter assignment title"
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Enter assignment description and instructions"
                  className="rounded-xl min-h-24"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="class">Select Class</Label>
                <Select>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Choose class" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="9A">Class 9A</SelectItem>
                    <SelectItem value="9B">Class 9B</SelectItem>
                    <SelectItem value="10A">Class 10A</SelectItem>
                    <SelectItem value="10B">Class 10B</SelectItem>
                    <SelectItem value="11A">Class 11A</SelectItem>
                    <SelectItem value="11B">Class 11B</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="file">Upload File (Optional)</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-400">
                    PDF, DOC, DOCX up to 10MB
                  </p>
                  <Input id="file" type="file" className="hidden" />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <Button className="flex-1 rounded-xl">Send Assignment</Button>
                <Button
                  variant="outline"
                  className="flex-1 rounded-xl bg-transparent"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        {assignments.map((assignment) => (
          <Card key={assignment.id} className="rounded-xl">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">
                      {assignment.title}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-4 mt-1">
                      <span>Class {assignment.class}</span>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Posted:{" "}
                        {new Date(assignment.postDate).toLocaleDateString()}
                      </div>
                    </CardDescription>
                  </div>
                </div>
                {assignment.hasFile && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-xl bg-transparent"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    View File
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">{assignment.description}</p>
              <div className="flex gap-2">
                <Button variant="outline" className="rounded-xl bg-transparent">
                  Edit Assignment
                </Button>
                <Button
                  variant="outline"
                  className="rounded-xl text-red-600 hover:bg-red-50 bg-transparent"
                >
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
