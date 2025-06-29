import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Bell, Calendar } from "lucide-react";

// 🔔 Sample notifications grouped by date
const dailyNotifications = [
  {
    date: "2024-01-15",
    notifications: [
      {
        title: "Unit Test on Friday",
        description:
          "Class 10 will have a Mathematics Unit Test on Friday at 10 AM.",
      },
      {
        title: "Science Lab Report Due",
        description: "Submit your Physics lab report by tomorrow evening.",
      },
    ],
  },
  {
    date: "2024-01-12",
    notifications: [
      {
        title: "School Closed on Monday",
        description:
          "The school will remain closed on Monday due to maintenance work.",
      },
    ],
  },
];

export default function NotificationsPage() {
  return (
    <div className="p-6 space-y-8 overflow-y-auto h-full">
      <div>
        <h1 className="text-3xl font-bold">Notifications</h1>
        <p className="text-muted-foreground">
          Stay updated with important announcements from your school
        </p>
      </div>

      {dailyNotifications.map(({ date, notifications }) => (
        <Card key={date} className="rounded-xl">
          <CardHeader className="border-b">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-muted-foreground" />
              <CardTitle className="text-lg">
                {new Date(date).toLocaleDateString()}
              </CardTitle>
            </div>
            <CardDescription>
              {notifications.length} notification
              {notifications.length > 1 ? "s" : ""} posted
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {notifications.map((note, index) => (
              <div
                key={index}
                className="flex items-start gap-4 bg-muted/30 p-4 rounded-lg"
              >
                <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
                  <Bell className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-base">{note.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {note.description}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
