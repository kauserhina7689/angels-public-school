"use client";

import { useEffect, useState } from "react";
import { CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRouter } from "next/navigation";
import {
  getMarks,
  saveAllMarks,
  saveOneMark,
} from "@/server/actions/school/marks";
import { toast } from "sonner";

function MarksPage({
  marks,
}: {
  marks: Awaited<ReturnType<typeof getMarks>>["marks"];
}) {
  const router = useRouter();
  const [newMarks, setMarks] = useState<
    ((typeof marks)[number] & { saved: number })[]
  >([]);

  // ✅ Ensure state syncs after marks arrive or route changes
  useEffect(() => {
    if (marks && marks.length > 0) {
      setMarks(marks.map((m) => ({ ...m, saved: m.marks })));
    }
  }, [marks]);
  function onMarksChange(marks: number, _id: string) {
    setMarks((oldMArks) =>
      oldMArks.map((m) => {
        if (m._id !== _id) return m;
        return { ...m, marks: marks };
      })
    );
  }
  const isChanged = newMarks.some((m) => m.marks !== m.saved);

  const saveMarks = async (marks: {
    saved: number;
    marks: number;
    max: number;
    absent: boolean;
    name: string;
    rollNumber: string;
    _id: string;
  }) => {
    const id = toast.loading("Saving marks of " + marks.name);
    try {
      const res = await saveOneMark(marks._id, {
        obtained: marks.marks,
        absent: marks.absent,
      });
      if (!res.success)
        return toast.success(res.message, {
          id,
        });
      toast.success(`Saved marks for ${marks.name} successfully`, { id });
    } catch (error) {
      console.log(error);
      toast.error(`Something went wrong please try again`, { id });
    }
  };
  const saveAllMark = async () => {
    const id = toast.loading("Saving marks of all students");
    try {
      const updatedMarks = newMarks.map(
        ({ _id: markId, marks: obtained, absent }) => ({
          markId,
          obtained,
          absent,
        })
      );
      const res = await saveAllMarks(updatedMarks);
      if (!res.success)
        return toast.success(res.message, {
          id,
        });
      toast.success(`Saved marks for all students successfully`, { id });
      router.refresh();
    } catch (error) {
      console.log(error);
      toast.error(`Something went wrong please try again`, { id });
    }
  };
  return (
    <CardContent>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Roll No</TableHead>
            <TableHead>Student Name</TableHead>
            <TableHead>Marks</TableHead>
            <TableHead>
              <Button onClick={saveAllMark} disabled={!isChanged}>
                Save all
              </Button>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {newMarks
            .sort((a, b) => {
              const rollA = Number(a.rollNumber);
              const rollB = Number(b.rollNumber);
              if (!isNaN(rollA) && !isNaN(rollB)) {
                return rollA - rollB;
              }
              return a.rollNumber.localeCompare(b.rollNumber);
            })
            .map((record, index) => (
              <TableRow key={record._id}>
                <TableCell>{record.rollNumber}</TableCell>
                <TableCell className="font-medium">{record.name}</TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={record.marks}
                    onChange={(e) => {
                      onMarksChange(Number(e.target.value), record._id);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        const inputs =
                          document.querySelectorAll<HTMLInputElement>(
                            "input[type='number']"
                          );
                        inputs?.[index + 1]?.focus();
                      }
                    }}
                    className="w-16 text-center"
                    min={0}
                  />
                </TableCell>
                <TableCell>
                  <Button
                    disabled={record.saved === record.marks}
                    onClick={() => saveMarks(record)}
                    variant={"link"}
                  >
                    Save
                  </Button>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </CardContent>
  );
}

export default MarksPage;
