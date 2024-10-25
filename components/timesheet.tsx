"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import React, { useState, useEffect } from 'react';

interface TimesheetEntry {
  type: 'Regular' | 'Holiday' | 'Other';
  hours: string[]; // Keep as string to manage input value directly
  description: string;
}

interface TimesheetComponentProps {
  isApprover: boolean;
}

const TimesheetComponent: React.FC<TimesheetComponentProps> = () => {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [timesheetEntries, setTimesheetEntries] = useState<TimesheetEntry[]>([
    { type: 'Regular', hours: Array(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate()).fill('0.0'), description: '' },
  ]);
  
  const [status, setStatus] = useState<'Draft' | 'Ready'>('Draft'); // Default status is set to Draft

  useEffect(() => {
    generateTimesheetEntries();
  }, [currentMonth]);

  const generateTimesheetEntries = () => {
    const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
    setTimesheetEntries(entries => 
      entries.map(entry => ({
        ...entry,
        hours: Array(daysInMonth).fill('0.0'), // Initialize as string
      }))
    );
  };

  const handleHoursChange = (typeIndex: number, dayIndex: number, value: string) => {
    // Limit the input to 2 decimal places
    const formattedValue = value.match(/^\d*\.?\d{0,2}/)?.[0] || '0.0';

    const updatedEntries = [...timesheetEntries];

    // Ensure no more than one row has hours for the same day
    updatedEntries.forEach((entry, index) => {
      if (index !== typeIndex) {
        entry.hours[dayIndex] = entry.hours[dayIndex] === formattedValue ? '0.0' : entry.hours[dayIndex];
      }
    });

    updatedEntries[typeIndex].hours[dayIndex] = formattedValue; // Store formatted value
    setTimesheetEntries(updatedEntries);
  };

  const handleAddRow = () => {
    const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
    const newEntry: TimesheetEntry = {
      type: 'Regular',
      hours: Array(daysInMonth).fill('0.0'), // Ensure it's initialized with the correct number of days
      description: '',
    };
    setTimesheetEntries((prevEntries) => [...prevEntries, newEntry]); // Properly append the new entry
  };

  const handleDeleteRow = (index: number) => {
    const updatedEntries = timesheetEntries.filter((_, idx) => idx !== index); // Remove entry by index
    setTimesheetEntries(updatedEntries);
  };

  const handleTypeChange = (typeIndex: number, newType: 'Regular' | 'Holiday' | 'Other') => {
    const updatedEntries = [...timesheetEntries];
    updatedEntries[typeIndex].type = newType;
    setTimesheetEntries(updatedEntries);
  };

  const handleSubmit = () => {
    const parsedEntries = timesheetEntries.map(entry => ({
      ...entry,
      hours: entry.hours.map(hour => parseFloat(hour)), // Parse as float on submit
    }));
    console.log('Submitting timesheet:', { status, entries: parsedEntries });
    // Add your submit logic here (e.g., save to a database or API)
  };

  // Calculate total hours
  const calculateTotalHours = () => {
    return timesheetEntries.reduce((total, entry) => {
      return total + entry.hours.reduce((sum, hour) => sum + parseFloat(hour), 0);
    }, 0).toFixed(2); // Return total as a string with two decimal places
  };

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i);
    const dayName = date.toLocaleString('default', { weekday: 'short' });
    const isWeekend = date.getDay() === 0 || date.getDay() === 6; // 0: Sunday, 6: Saturday
    const dayStyle = isWeekend ? 'text-red-500' : '';

    return (
      <div key={i} className={`flex flex-col items-center ${dayStyle}`}>
        <div>{dayName}</div>
        <div>{i + 1}</div> {/* Date below the day name */}
      </div>
    );
  });

  return (
    <div className="space-y-4">
      <span className="text-lg font-semibold">
        {currentMonth.toLocaleString('default', { month: 'long' })} {currentMonth.getFullYear()}
      </span>
      
      {/* Dropdown to change status */}
      <Select onValueChange={(value) => setStatus(value as 'Draft' | 'Ready')}>
        <SelectTrigger>
          <SelectValue>{status}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Draft">Draft</SelectItem>
          <SelectItem value="Ready">Ready</SelectItem>
        </SelectContent>
      </Select>
      
      {/* Scrollable table */}
      <div className="overflow-x-auto">
        <Table className="min-w-full"> {/* Set min-width for proper scrolling */}
          <TableHeader>
            <TableRow>
              <TableHead>Time Code</TableHead>
              {daysArray.map((day, index) => (
                <TableHead key={index}>{day}</TableHead>
              ))}
              <TableHead>Actions</TableHead> {/* Column for Delete action */}
            </TableRow>
          </TableHeader>
          <TableBody>
            {timesheetEntries.map((entry, typeIndex) => (
              <TableRow key={typeIndex}>
                <TableCell>
                  <Select onValueChange={(value) => handleTypeChange(typeIndex, value as 'Regular' | 'Holiday' | 'Other')}>
                    <SelectTrigger>
                      <SelectValue>{entry.type}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Regular">Regular</SelectItem>
                      <SelectItem value="Holiday">Holiday</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                {entry.hours.map((hour, dayIndex) => (
                  <TableCell key={dayIndex}>
                    <Input
                      type="text" // Use text type to allow decimal input
                      value={hour}
                      onChange={(e) => handleHoursChange(typeIndex, dayIndex, e.target.value)}
                      placeholder="0.0"
                      className="w-16 h-8 text-sm text-center" // Adjusted width and reduced font size
                      style={{
                        border: '1px solid #ccc', // Optional: Add border for better visibility
                      }}
                    />
                  </TableCell>
                ))}
                <TableCell>
                  <Button variant="outline" onClick={() => handleDeleteRow(typeIndex)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Total Hours Section */}
      <div className="flex justify-between">
        <span className="text-lg font-semibold">
          Total Hours: {calculateTotalHours()}
        </span>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={handleAddRow}>
          Add Time Code
        </Button>
        <Button variant="outline" onClick={handleSubmit}>
          Submit Timesheet
        </Button>
      </div>
    </div>
  );
};

export default TimesheetComponent;
