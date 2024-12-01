import { useState } from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import {
    CalendarIcon,
    ChevronLeftIcon,
    ChevronRightIcon
} from "lucide-react";
import {
    getDay,
    parse,
    format,
    startOfWeek,
    addMonths,
    subMonths
} from "date-fns";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { enUS } from "date-fns/locale";

import "./data-calendar.css";

import { Button } from "@/components/ui/button";
import EventCard from "./event-card";

import { Task } from "../types";

const locales = {
    "en-US": enUS
};

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales
});

interface DataCalendarProps {
    data: Task[];
}

interface CustomToolbarProps {
    date: Date;
    onNavigate: (action: "PREV" | "NEXT" | "TODAY") => void;
}

const CustomToolbar = ({
    date,
    onNavigate
}: CustomToolbarProps) => {
    return (
        <div
          className="flex mb-4 gap-x-2 items-center w-full lg:w-auto justify-center lg:justify-start"
        >
            <Button
              onClick={() => onNavigate("PREV")}
              size="icon"
              variant="secondary"
            >
                <ChevronLeftIcon
                  className="size-4"
                />
            </Button>

            <div
              className="flex items-center rounded-md px-3 py-2 h-8 justify-center w-full lg:w-auto"
            >
                <CalendarIcon
                  className="size-4 mr-2"
                />
                <p
                  className="text-sm"
                >
                    {format(date, "MMMM yyyy")}
                </p>
            </div>

            <Button
              onClick={() => onNavigate("NEXT")}
              size="icon"
              variant="secondary"
            >
                <ChevronRightIcon
                  className="size-4"
                />
            </Button>
        </div>
    )
};

const DataCalendar = ({ data }: DataCalendarProps) => {
    const [value, setValue] = useState(
        data.length > 0 ? new Date(data[0].dueDate) : new Date()
    );

    // Populate the data with the required information
    const events = data.map((task) => ({
        start: new Date(task.dueDate),
        end: new Date(task.dueDate),
        title: task.name,
        project: task.project,
        assignee: task.assignee,
        status: task.status,
        id: task.$id
    }));

    // Function to handle the navigation of the calendar
    const handleNavigation = (action: "PREV" | "NEXT" | "TODAY") => {
        if (action === "PREV") {
            setValue(subMonths(value, 1));
        } else if (action === "NEXT") {
            setValue(addMonths(value, 1));
        } else if (action === "TODAY") {
            setValue(new Date());
        }
    };

    return (
        <Calendar
          className="h-full"
          localizer={localizer}
          date={value}
          events={events}
          views={["month"]}
          defaultView="month"
          toolbar
          showAllEvents
          max={new Date(new Date().setFullYear(new Date().getFullYear() + 1))}
          formats={{
            weekdayFormat: (date, culture, localizer) => localizer?.format(date, "EEE", culture) ?? ""
          }}
          components={{
            eventWrapper: ({ event }) => (
                <EventCard
                  id={event.id}
                  assignee={event.assignee}
                  title={event.title}
                  project={event.project}
                  status={event.status}
                />
            ),
            toolbar: () => (
                <CustomToolbar
                  date={value}
                  onNavigate={handleNavigation}
                />
            )
          }}
        />
    );
}
 
export default DataCalendar;