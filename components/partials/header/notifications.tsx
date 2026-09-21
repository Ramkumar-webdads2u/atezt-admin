"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Icon } from "@/components/ui/icon";
import { ChevronLeft, ChevronRight } from "lucide-react";

const PAGE_SIZE = 6;

const DUMMY_NOTIFICATIONS = [
  {
    id: 1,
    title: "New Exam Created",
    desc: "A new exam was added to the admin panel.",
    time: "2 min ago",
  },
  {
    id: 2,
    title: "New User Registered",
    desc: "A new student account was registered.",
    time: "15 min ago",
  },
  {
    id: 3,
    title: "Exam Completed",
    desc: "An exam has been completed by students.",
    time: "1 hour ago",
  },
  {
    id: 4,
    title: "Coupon Updated",
    desc: "A coupon was updated successfully.",
    time: "2 hours ago",
  },
  {
    id: 5,
    title: "Results Ready",
    desc: "New exam results are available.",
    time: "Today",
  },
  {
    id: 6,
    title: "System Update",
    desc: "Dashboard frontend was updated.",
    time: "Today",
  },
  {
    id: 7,
    title: "Question Type Added",
    desc: "A question type was added.",
    time: "Yesterday",
  },
];

const Notifications = () => {
  const [notifications, setNotifications] = useState(DUMMY_NOTIFICATIONS);
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(notifications.length / PAGE_SIZE);
  const paginated = notifications.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );

  const handleClear = () => {
    setNotifications([]);
    setPage(1);
  };

  return (
    <DropdownMenu onOpenChange={() => setPage(1)}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Notifications"
          className="relative hidden focus:outline-hidden md:h-8 md:w-8 md:bg-secondary text-secondary-foreground rounded-full md:flex items-center justify-center cursor-pointer"
        >
          <Icon icon="heroicons-outline:bell" className="h-5 w-5" />
          {notifications.length > 0 && (
            <Badge
              className="w-4 h-4 p-0 text-[8px] rounded-full font-semibold items-center justify-center absolute left-[calc(100%-12px)] bottom-[calc(100%-10px)]"
              color="destructive"
            >
              {notifications.length}
            </Badge>
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="z-999 mx-4 lg:w-[320px] p-0">
        <DropdownMenuLabel>
          <div className="flex justify-between px-4 py-3 border-b border-default-100">
            <div className="text-sm text-default-800 font-medium">
              Notifications ({notifications.length})
            </div>
            {notifications.length > 0 && (
              <button onClick={handleClear} className="text-xs text-blue-500">
                Clear
              </button>
            )}
          </div>
        </DropdownMenuLabel>

        <ScrollArea className="no-scrollbar">
          {notifications.length === 0 ? (
            <p className="p-4 text-sm text-gray-400 text-center">
              No notifications
            </p>
          ) : (
            paginated.map((item) => (
              <DropdownMenuItem key={item.id} className="flex gap-3 p-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>{item.title.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{item.title}</p>
                  <p className="text-xs text-gray-500">{item.desc}</p>
                  <p className="text-[10px] text-gray-400">{item.time}</p>
                </div>
              </DropdownMenuItem>
            ))
          )}
        </ScrollArea>

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-3 py-2 border-t border-default-100">
            <button
              className="h-7 w-7 p-0 cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                setPage((p) => Math.max(1, p - 1));
              }}
              disabled={page === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-xs text-gray-500">
              Page {page} of {totalPages}
            </span>
            <button
              className="h-7 w-7 p-0 cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                setPage((p) => Math.min(totalPages, p + 1));
              }}
              disabled={page === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Notifications;
