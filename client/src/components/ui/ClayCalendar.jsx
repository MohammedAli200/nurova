import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";

/**
 * ClayCalendar Component
 * Tactile claymorphic monthly calendar with date selection and status event indicators.
 */
const ClayCalendar = ({
    selectedDate,
    onSelectDate,
    events = [], // Array of { date: 'YYYY-MM-DD', status: 'available'|'booked'|'cancelled'|'completed' }
    minDate = null,
    className = "",
}) => {
    const [currentMonth, setCurrentMonth] = useState(() => {
        const d = selectedDate ? new Date(selectedDate) : new Date();
        return new Date(d.getFullYear(), d.getMonth(), 1);
    });

    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];

    const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

    const prevMonth = () => {
        setCurrentMonth(new Date(year, month - 1, 1));
    };

    const nextMonth = () => {
        setCurrentMonth(new Date(year, month + 1, 1));
    };

    // Calculate days grid
    const firstDayIndex = new Date(year, month, 1).getDay();
    const totalDaysInMonth = new Date(year, month + 1, 0).getDate();
    const totalDaysInPrevMonth = new Date(year, month, 0).getDate();

    // Today's normalized string (YYYY-MM-DD)
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

    // Normalize selected date string
    const selectedDateStr = selectedDate
        ? typeof selectedDate === "string"
            ? selectedDate.slice(0, 10)
            : `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}`
        : null;

    // Build event map for quick lookup
    const eventMap = new Map();
    events.forEach((ev) => {
        const dateKey = typeof ev.date === "string" ? ev.date.slice(0, 10) : ev.date;
        if (!eventMap.has(dateKey)) {
            eventMap.set(dateKey, []);
        }
        eventMap.get(dateKey).push(ev.status || "available");
    });

    const handleDateClick = (dayStr) => {
        if (minDate && new Date(dayStr) < new Date(minDate)) {
            return;
        }
        if (onSelectDate) {
            onSelectDate(dayStr);
        }
    };

    const days = [];

    // Previous month padding
    for (let i = firstDayIndex - 1; i >= 0; i--) {
        const prevDay = totalDaysInPrevMonth - i;
        days.push({
            day: prevDay,
            currentMonth: false,
            dateStr: `${month === 0 ? year - 1 : year}-${String(month === 0 ? 12 : month).padStart(2, "0")}-${String(prevDay).padStart(2, "0")}`,
        });
    }

    // Current month days
    for (let i = 1; i <= totalDaysInMonth; i++) {
        days.push({
            day: i,
            currentMonth: true,
            dateStr: `${year}-${String(month + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`,
        });
    }

    // Next month padding to fill standard 42 (6 rows) grid or 35 grid
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
        days.push({
            day: i,
            currentMonth: false,
            dateStr: `${month === 11 ? year + 1 : year}-${String(month === 11 ? 1 : month + 2).padStart(2, "0")}-${String(i).padStart(2, "0")}`,
        });
    }

    return (
        <div className={`clay-surface-2 p-5 sm:p-6 font-georama select-none ${className}`}>
            {/* Header / Month Navigator */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-forest/10">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-warmBeige flex items-center justify-center text-burntOrange shadow-[inset_2px_2px_4px_rgba(53,92,69,0.1),inset_-2px_-2px_4px_rgba(255,255,255,0.9)] border border-white/50">
                        <CalendarIcon className="w-4 h-4" />
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-forest">
                        {monthNames[month]} {year}
                    </h3>
                </div>

                <div className="flex items-center gap-1.5">
                    <button
                        type="button"
                        onClick={prevMonth}
                        className="p-2 rounded-xl text-forest bg-warmBeige shadow-[2px_2px_5px_rgba(53,92,69,0.1),-2px_-2px_5px_rgba(255,255,255,0.8)] hover:text-burntOrange active:shadow-[inset_2px_2px_4px_rgba(53,92,69,0.1)] transition-all cursor-pointer"
                        aria-label="Previous Month"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                        type="button"
                        onClick={nextMonth}
                        className="p-2 rounded-xl text-forest bg-warmBeige shadow-[2px_2px_5px_rgba(53,92,69,0.1),-2px_-2px_5px_rgba(255,255,255,0.8)] hover:text-burntOrange active:shadow-[inset_2px_2px_4px_rgba(53,92,69,0.1)] transition-all cursor-pointer"
                        aria-label="Next Month"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Days of Week */}
            <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2 text-center">
                {daysOfWeek.map((day) => (
                    <span
                        key={day}
                        className="text-xs font-bold uppercase tracking-wider text-forest/50 py-1"
                    >
                        {day}
                    </span>
                ))}
            </div>

            {/* Calendar Days Grid */}
            <div className="grid grid-cols-7 gap-1 sm:gap-2">
                {days.map((item, index) => {
                    const isSelected = selectedDateStr === item.dateStr;
                    const isToday = todayStr === item.dateStr;
                    const dayEvents = eventMap.get(item.dateStr) || [];
                    const hasEvents = dayEvents.length > 0;
                    const isPast =
                        minDate && new Date(item.dateStr) < new Date(minDate);

                    const hasAvailable = dayEvents.includes("available");
                    const hasBooked = dayEvents.includes("booked");

                    return (
                        <button
                            key={index}
                            type="button"
                            disabled={isPast || !item.currentMonth}
                            onClick={() => handleDateClick(item.dateStr)}
                            className={`
                                relative h-10 sm:h-11 rounded-2xl flex flex-col items-center justify-center text-xs sm:text-sm font-bold transition-all duration-150 cursor-pointer
                                ${
                                    isSelected
                                        ? "clay-btn-forest text-sand !shadow-[3px_3px_8px_rgba(53,92,69,0.3)] !transform-none"
                                        : item.currentMonth
                                          ? "text-forest hover:bg-white/50 bg-warmBeige shadow-[inset_1px_1px_2px_rgba(255,255,255,0.7),inset_-1px_-1px_2px_rgba(53,92,69,0.06)]"
                                          : "text-forest/25 opacity-40 bg-transparent cursor-not-allowed shadow-none"
                                }
                                ${isToday && !isSelected ? "ring-2 ring-burntOrange/60 font-extrabold" : ""}
                                ${isPast ? "opacity-30 cursor-not-allowed hover:bg-transparent" : ""}
                            `}
                        >
                            <span>{item.day}</span>

                            {/* Event Indicators */}
                            {item.currentMonth && hasEvents && (
                                <div className="flex items-center gap-0.5 mt-0.5">
                                    {hasAvailable && (
                                        <span
                                            className={`w-1.5 h-1.5 rounded-full ${
                                                isSelected
                                                    ? "bg-sand"
                                                    : "bg-forest"
                                            }`}
                                        />
                                    )}
                                    {hasBooked && (
                                        <span
                                            className={`w-1.5 h-1.5 rounded-full ${
                                                isSelected
                                                    ? "bg-burntOrange"
                                                    : "bg-burntOrange"
                                            }`}
                                        />
                                    )}
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default ClayCalendar;
