"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import React, { useState } from 'react';

interface LeaveRequest {
  id: number;
  user: string; // Name of the user requesting leave
  startDate: string; // Start date of the leave
  endDate: string; // End date of the leave
  reason: string; // Reason for the leave
  status: 'Pending' | 'Approved' | 'Denied'; // Leave request status
}

interface LeaveManagementComponentProps {
  isApprover: boolean; // Determines if the user is an approver or requestor
}

const LeaveManagementComponent: React.FC<LeaveManagementComponentProps> = ({ isApprover }) => {
  // Sample leave requests data (could be fetched from an API)
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([
    { id: 1, user: 'Alice', startDate: '2024-10-01', endDate: '2024-10-05', reason: 'Vacation', status: 'Pending' },
    { id: 2, user: 'Bob', startDate: '2024-10-10', endDate: '2024-10-12', reason: 'Medical', status: 'Pending' },
    { id: 3, user: 'Charlie', startDate: '2024-10-15', endDate: '2024-10-20', reason: 'Family Emergency', status: 'Approved' },
  ]);

  // Requestor actions (in a real application, you might fetch their requests)
  const [myLeaveRequests, setMyLeaveRequests] = useState<LeaveRequest[]>([
    { id: 1, user: 'You', startDate: '2024-10-25', endDate: '2024-10-30', reason: 'Personal', status: 'Pending' },
  ]);

  // State for requesting new leave
  const [newLeave, setNewLeave] = useState<{ startDate: string; endDate: string; reason: string }>({
    startDate: '',
    endDate: '',
    reason: '',
  });

  // Approver actions
  const handleApprove = (id: number) => {
    setLeaveRequests((prevRequests) =>
      prevRequests.map((request) =>
        request.id === id ? { ...request, status: 'Approved' } : request
      )
    );
  };

  const handleDeny = (id: number) => {
    setLeaveRequests((prevRequests) =>
      prevRequests.map((request) =>
        request.id === id ? { ...request, status: 'Denied' } : request
      )
    );
  };

  // Request new leave
  const handleRequestNewLeave = () => {
    const newRequest: LeaveRequest = {
      id: Math.random(), // Generating a random id for simplicity
      user: 'You', // In a real app, this would be the logged-in user
      startDate: newLeave.startDate,
      endDate: newLeave.endDate,
      reason: newLeave.reason,
      status: 'Pending',
    };

    // Update state
    setMyLeaveRequests((prev) => [...prev, newRequest]);
    setNewLeave({ startDate: '', endDate: '', reason: '' }); // Reset the form
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>{isApprover ? 'Leave Requests to Approve' : 'My Leave Requests'}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table className="min-w-full">
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Status</TableHead>
                {isApprover && <TableHead>Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {(isApprover ? leaveRequests : myLeaveRequests).map((request) => (
                <TableRow key={request.id}>
                  <TableCell>{request.user}</TableCell>
                  <TableCell>{request.startDate}</TableCell>
                  <TableCell>{request.endDate}</TableCell>
                  <TableCell>{request.reason}</TableCell>
                  <TableCell>{request.status}</TableCell>
                  {isApprover && (
                    <TableCell>
                      <Button variant="outline" onClick={() => handleApprove(request.id)}>Approve</Button>
                      <Button variant="outline" onClick={() => handleDeny(request.id)}>Deny</Button>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Request New Leave Form for Requestors */}
      {!isApprover && (
        <Card>
          <CardHeader>
            <CardTitle>Request New Leave</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1">Start Date</label>
                <input
                  type="date"
                  value={newLeave.startDate}
                  onChange={(e) => setNewLeave({ ...newLeave, startDate: e.target.value })}
                  className="border p-3 rounded w-full text-lg"
                />
              </div>
              <div>
                <label className="block mb-1">End Date</label>
                <input
                  type="date"
                  value={newLeave.endDate}
                  onChange={(e) => setNewLeave({ ...newLeave, endDate: e.target.value })}
                  className="border p-3 rounded w-full text-lg"
                />
              </div>
              <div className="col-span-2">
                <label className="block mb-1">Reason for Leave</label>
                <input
                  type="text"
                  value={newLeave.reason}
                  onChange={(e) => setNewLeave({ ...newLeave, reason: e.target.value })}
                  className="border p-3 rounded w-full text-lg"
                  placeholder="Enter reason for leave"
                />
              </div>
              <div className="col-span-2">
                <Button onClick={handleRequestNewLeave} disabled={!newLeave.startDate || !newLeave.endDate || !newLeave.reason} className="w-full">
                  Submit Leave Request
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LeaveManagementComponent;
