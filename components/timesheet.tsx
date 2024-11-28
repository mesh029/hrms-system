"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import React, { useState, useEffect } from "react";

interface TimesheetEntry {
  type: "Regular" | "Holiday" | "Sick" | "Annual";
  hours: string[]; // Keep as string to manage input value directly
  description: string;
}

interface TimesheetComponentProps {
  userId: number;
  isApprover: boolean;
}
interface ParsedEntry {
  date: string;
  hours: number;
  type: "Regular" | "Holiday" | "Sick" | "Annual";
  description: string;
}



const TimesheetComponent: React.FC<TimesheetComponentProps> = ({ userId, isApprover }) => {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [timesheetEntries, setTimesheetEntries] = useState<TimesheetEntry[]>([
    { type: "Regular", hours: [], description: "" },
  ]);
  const [status, setStatus] = useState<"Draft" | "Ready">("Draft"); 

  useEffect(() => {
    generateTimesheetEntries();
  }, [currentMonth]);

  const generateTimesheetEntries = () => {
    const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
    setTimesheetEntries([
      { type: "Regular", hours: Array(daysInMonth).fill("0.0"), description: "" }
    ]);
  };

  const handleHoursChange = (typeIndex: number, dayIndex: number, value: string) => {
    const formattedValue = value.match(/^\d*\.?\d{0,2}/)?.[0] || "0.0";
    const updatedEntries = [...timesheetEntries];
    updatedEntries[typeIndex].hours[dayIndex] = formattedValue; 
    setTimesheetEntries(updatedEntries);
  };

  const handleAddRow = () => {
    const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
    const newEntry: TimesheetEntry = {
      type: "Regular",
      hours: Array(daysInMonth).fill("0.0"),
      description: "",
    };
    setTimesheetEntries((prevEntries) => [...prevEntries, newEntry]);
  };

  const handleDeleteRow = (index: number) => {
    const updatedEntries = timesheetEntries.filter((_, idx) => idx !== index);
    setTimesheetEntries(updatedEntries);
  };

  const handleTypeChange = (typeIndex: number, newType: "Regular" | "Holiday" | "Sick" | "Annual") => {
    // Check if this day already has the same type of entry
    const hasEntryForDay = timesheetEntries.some(
      (entry) => entry.type === newType && entry.hours.some((hour, index) => hour !== "0.0")
    );

    if (!hasEntryForDay || timesheetEntries[typeIndex].type === newType) {
      const updatedEntries = [...timesheetEntries];
      updatedEntries[typeIndex].type = newType;
      setTimesheetEntries(updatedEntries);
    }
  };
  const handleSubmit = async () => {
    const parsedEntries: ParsedEntry[] = []; // To store the final parsed entries
    const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate(); // Get the days in the current month
  
    // Set to track unique day entries (so no duplicates)
    const uniqueDays = new Set<string>();
  
    // Loop over each entry (one per row in the table)
    timesheetEntries.forEach((entry) => {
      // Loop through each day of the month (1-based index)
      for (let dayIndex = 1; dayIndex <= daysInMonth; dayIndex++) {
        const dayValue = entry.hours[dayIndex - 1];
  
        // Only add to parsedEntries if hours are filled (non-zero or non-empty)
        if (dayValue !== "0.0" && dayValue.trim() !== "") {
          const entryDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), dayIndex).toLocaleDateString("en-CA");
  
          // Ensure no duplicate entries for the same day
          if (!uniqueDays.has(entryDate)) {
            uniqueDays.add(entryDate); // Mark this day as processed
            parsedEntries.push({
              date: entryDate,
              hours: parseFloat(dayValue), // Convert the string hours to a number
              type: entry.type,
              description: entry.description || "", // Ensure the description is not undefined
            });
          }
        }
      }
    });
  
    // Debugging: Check how many entries have been collected
    console.log("Total entries:", parsedEntries.length);
    console.log("Expected entries:", parsedEntries.length);
    console.log("Parsed entries:", parsedEntries);
  
    // Proceed only if entries exist after filtering
    if (parsedEntries.length === 0) {
      alert("No valid timesheet entries found. Please fill in the hours for the selected days.");
      return;
    }
  
    // Proceed with the API call if entries exist
    try {
      const response = await fetch("http://localhost:3030/api/timesheets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          userId,
          year: currentMonth.getFullYear(),
          month: currentMonth.getMonth() + 1,
          entries: parsedEntries,
          status,
        }),
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log("Timesheet submitted:", data);
        alert("Timesheet submitted successfully!");
      } else {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        try {
          const errorJson = JSON.parse(errorText);
          alert(`Error submitting timesheet: ${errorJson.message || errorJson.error || "Unknown error"}`);
        } catch {
          alert(`Error submitting timesheet: ${errorText || "Unknown error"}`);
        }
      }
    } catch (err) {
      console.error("Network error:", err);
      alert("Network error. Please try again.");
    }
  };
  
  
  

  const calculateTotalHours = () => {
    return timesheetEntries.reduce((total, entry) => {
      return total + entry.hours.reduce((sum, hour) => sum + parseFloat(hour), 0);
    }, 0).toFixed(2);
  };

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i + 1);
    const dayName = date.toLocaleString("default", { weekday: "short" });
    const isWeekend = date.getDay() === 0 || date.getDay() === 6; 
    const dayStyle = isWeekend ? "text-red-500" : "";

    return (
      <div key={i} className={`flex flex-col items-center ${dayStyle}`}>
        <div>{dayName}</div>
        <div>{i + 1}</div>
      </div>
    );
  });

  return (
    <div className="space-y-4">
      <span className="text-lg font-semibold">
        {currentMonth.toLocaleString("default", { month: "long" })} {currentMonth.getFullYear()}
      </span>

      <Select onValueChange={(value) => setStatus(value as "Draft" | "Ready")}>
        <SelectTrigger>
          <SelectValue>{status}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Draft">Draft</SelectItem>
          <SelectItem value="Ready">Ready</SelectItem>
        </SelectContent>
      </Select>

      <div className="overflow-x-auto">
        <Table className="min-w-full">
          <TableHeader>
            <TableRow>
              <TableHead>Time Code</TableHead>
              {daysArray.map((day, index) => (
                <TableHead key={index}>{day}</TableHead>
              ))}
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {timesheetEntries.map((entry, typeIndex) => (
              <TableRow key={typeIndex}>
                <TableCell>
                  <Select onValueChange={(value) => handleTypeChange(typeIndex, value as "Regular" | "Holiday" | "Sick" | "Annual")}>
                    <SelectTrigger>
                      <SelectValue>{entry.type}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Regular">Regular</SelectItem>
                      <SelectItem value="Holiday">Holiday</SelectItem>
                      <SelectItem value="Sick">Sick</SelectItem>
                      <SelectItem value="Annual">Annual</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                {entry.hours.map((hour, dayIndex) => (
                  <TableCell key={dayIndex}>
                    <Input
                      type="text"
                      value={hour}
                      onChange={(e) => handleHoursChange(typeIndex, dayIndex, e.target.value)}
                      placeholder="0.0"
                      className="w-16 h-8 text-sm text-center"
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

      <div className="flex justify-between">
        <span className="text-lg font-semibold">Total Hours: {calculateTotalHours()}</span>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={handleAddRow}>Add Time Code</Button>
        <Button variant="outline" onClick={handleSubmit}>Submit Timesheet</Button>
      </div>
    </div>
  );
};

export default TimesheetComponent
