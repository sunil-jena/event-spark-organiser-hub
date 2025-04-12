import React from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
    addMonths, subMonths, format, startOfMonth, endOfMonth, startOfWeek, endOfWeek,
    isSameMonth, isSameDay, addDays, isToday, isBefore
} from 'date-fns';
import { cn } from '@/lib/utils';

interface DatePickerCalendarProps {
    selected: Date;
    onSelect: (date: Date) => void;
    onClose: () => void;
    minDate?: Date;
    maxDate?: Date;
}

export const DatePickerCalendar: React.FC<DatePickerCalendarProps> = ({
    selected,
    onSelect,
    onClose,
    minDate,
    maxDate,
}) => {
    const [currentMonth, setCurrentMonth] = React.useState(new Date(selected));
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const prevMonth = () => {
        setCurrentMonth(subMonths(currentMonth, 1));
    };

    const nextMonth = () => {
        setCurrentMonth(addMonths(currentMonth, 1));
    };

    const isDayDisabled = (day: Date) => {
        if (minDate && isBefore(day, minDate)) return true;
        if (maxDate && isBefore(maxDate, day)) return true;
        return false;
    };

    const handleDateSelect = (day: Date) => {
        if (!isDayDisabled(day) && isSameMonth(day, currentMonth)) {
            onSelect(day);
        }
    };

    const renderDays = () => {
        const monthStart = startOfMonth(currentMonth);
        const monthEnd = endOfMonth(monthStart);
        const startDate = startOfWeek(monthStart);
        const endDate = endOfWeek(monthEnd);

        const rows = [];
        let days = [];
        let day = startDate;

        // Create header with weekday names
        const header = weekDays.map(weekDay => (
            <div key={weekDay} className="w-8 h-8 flex items-center justify-center text-xs font-medium text-gray-500">
                {weekDay}
            </div>
        ));
        rows.push(<div key="header" className="grid grid-cols-7 mb-1">{header}</div>);

        // Create calendar days
        while (day <= endDate) {
            for (let i = 0; i < 7; i++) {
                const cloneDay = new Date(day);
                const isDisabled = isDayDisabled(cloneDay);
                const isCurrentMonth = isSameMonth(day, monthStart);
                const isSelectedDay = isSameDay(day, selected);

                days.push(
                    <div
                        key={day.toString()}
                        className={cn(
                            "w-8 h-8 flex items-center justify-center text-sm rounded-full mx-auto",
                            isCurrentMonth ? "text-gray-900" : "text-gray-400",
                            isSelectedDay && "bg-[#24005b] text-white",
                            isToday(day) && !isSelectedDay && "border border-[#24005b]",
                            !isSelectedDay && !isDisabled && isCurrentMonth && "hover:bg-[#24005b]/10 cursor-pointer",
                            isDisabled && "opacity-50 cursor-not-allowed text-gray-300"
                        )}
                        onClick={() => handleDateSelect(cloneDay)}
                    >
                        {format(day, 'd')}
                    </div>
                );
                day = addDays(day, 1);
            }
            rows.push(
                <div key={day.toString()} className="grid grid-cols-7 my-1">
                    {days}
                </div>
            );
            days = [];
        }

        return rows;
    };

    return (
        <Card className="p-3 shadow-lg bg-white border border-[#24005b]/20 w-64 absolute z-50">
            <div className="flex justify-between items-center mb-4">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={prevMonth}
                    className="h-7 w-7 text-[#24005b] hover:bg-[#24005b]/10"
                >
                    <ChevronLeft size={18} />
                </Button>

                <div className="text-sm font-medium text-[#24005b]">
                    {format(currentMonth, 'MMMM yyyy')}
                </div>

                <div className="flex">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={nextMonth}
                        className="h-7 w-7 text-[#24005b] hover:bg-[#24005b]/10"
                    >
                        <ChevronRight size={18} />
                    </Button>

                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                        className="h-7 w-7 text-gray-500 hover:bg-gray-100 ml-1"
                    >
                        <X size={18} />
                    </Button>
                </div>
            </div>

            <div className="space-y-1">
                {renderDays()}
            </div>

            <div className="flex justify-between mt-3 pt-2 border-t border-gray-100">
                <Button
                    variant="outline"
                    size="sm"
                    className="text-xs h-7 border-[#24005b]/20 text-[#24005b] hover:bg-[#24005b]/10"
                    onClick={() => {
                        const today = new Date();
                        onSelect(today);
                        onClose();
                    }}
                >
                    Today
                </Button>

                <Button
                    variant="default"
                    size="sm"
                    className="text-xs h-7 bg-[#24005b] hover:bg-[#24005b]/90"
                    onClick={onClose}
                >
                    Done
                </Button>
            </div>
        </Card>
    );
};
