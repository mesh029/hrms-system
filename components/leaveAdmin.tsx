import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface LeaveRequest {
  id: number;
  userId: number;
  startDate: string;
  endDate: string;
  reason: string;
  status: 'Pending' | 'Approved' | 'Denied';
}

interface AdminLeaveManagementComponentProps {
  isApprover: boolean; // Determines if the user is an approver or requestor
  userId: number;
}

const AdminLeaveManagementComponent: React.FC<AdminLeaveManagementComponentProps> = ({ userId, isApprover }) => {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [userNames, setUserNames] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(true);

  // Fetch leave requests
  useEffect(() => {
    const fetchLeaveRequests = async () => {
      try {
        const response = await fetch(`http://localhost:3030/api/leaves`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          const leaveRequestsWithUserIds = data.leaveRequests.map((request: any) => ({
            ...request,
            userId: userId || "unknown", // Safely assign userId if not present
          }));
          setLeaveRequests(leaveRequestsWithUserIds);
        } else {
          console.error("Failed to fetch leave requests.");
        }
      } catch (error) {
        console.error("Error fetching leave requests:", error);
      }
    };

    fetchLeaveRequests();
  }, []);

  // Fetch user names based on userId
  useEffect(() => {
    const fetchUserNames = async () => {
      const userIds = leaveRequests.map((request) => request.userId);
      const uniqueUserIds = [...new Set(userIds)];
      const userNamesData: { [key: string]: string } = {}; // Type the userNamesData correctly

      for (const userId of uniqueUserIds) {
        try {
          const response = await fetch(`http://localhost:3030/api/users/${userId}`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });

          if (response.ok) {
            const userData = await response.json();
            userNamesData[userId] = userData.name;
          } else {
            console.error(`Failed to fetch user details for userId ${userId}`);
          }
        } catch (error) {
          console.error("Error fetching user details:", error);
        }
      }

      setUserNames(userNamesData);
      setLoading(false);
    };

    if (leaveRequests.length > 0) {
      fetchUserNames();
    }
  }, [leaveRequests]);

  // Function to handle approval of leave request
  const handleApprove = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:3030/api/leaves/${id}/approve`, {
        method: "PATCH", // Assuming PATCH method for approval
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        setLeaveRequests((prev) =>
          prev.map((request) =>
            request.id === id ? { ...request, status: "Approved" } : request
          )
        );
      } else {
        console.error("Failed to approve leave request.");
      }
    } catch (error) {
      console.error("Error approving leave request:", error);
    }
  };

  // Function to handle rejection of leave request
  const handleReject = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:3030/api/leaves/${id}/reject`, {
        method: "PATCH", // Assuming PATCH method for rejection
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        setLeaveRequests((prev) =>
          prev.map((request) =>
            request.id === id ? { ...request, status: "Denied" } : request
          )
        );
      } else {
        console.error("Failed to reject leave request.");
      }
    } catch (error) {
      console.error("Error rejecting leave request:", error);
    }
  };

  return (
    <>
      <CardHeader>
        <CardTitle>Leave Requests to Approve</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <Table className="min-w-full">
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaveRequests.map((request) => (
                <TableRow key={request.id || `leave-${request.id}`}>
                  <TableCell>{userNames[request.userId] || "Unknown"}</TableCell>
                  <TableCell>{request.startDate}</TableCell>
                  <TableCell>{request.endDate}</TableCell>
                  <TableCell>{request.reason}</TableCell>
                  <TableCell>{request.status}</TableCell>
                  <TableCell>
                    {request.status === "Pending" && (
                      <>
                        <Button onClick={() => handleApprove(request.id)} className="mr-2">
                          Approve
                        </Button>
                        <Button onClick={() => handleReject(request.id)} variant="destructive">
                          Reject
                        </Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </>
  );
};

export default AdminLeaveManagementComponent;
