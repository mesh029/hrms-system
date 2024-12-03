"use client";

import { SetStateAction, useEffect, useState } from 'react';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, Camera, Lock, LogOut, Mail, Phone, User } from 'lucide-react';


import TimesheetComponent from "@/components/timesheet";
import LeaveManagementComponent from '@/components/leave';
import Footer from '@/components/footer';
import Header from '@/components/header';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@radix-ui/react-select';
import { toast, useToast } from '@/hooks/use-toast';
import { useRouter } from "next/router";
import { EmployeeProvider, useEmployee } from '../context/EmployeeContext';
import Link from 'next/link';
import AdminLeaveManagementComponent from '@/components/leaveAdmin';

import * as XLSX from "xlsx"; // For exporting to Excel

const employees = [
  { id: 1, name: 'Alice Johnson', role: 'Software Engineer', department: 'Engineering' },
  { id: 2, name: 'Bob Smith', role: 'Product Manager', department: 'Product' },
  { id: 3, name: 'Charlie Brown', role: 'UX Designer', department: 'Design' },
  { id: 4, name: 'Diana Ross', role: 'HR Specialist', department: 'Human Resources' },
]
interface User {
  id: number; // or string, depending on your ID type
  name: string;
  role: string;
  department: string;
  location: string;
  reportsTo: string;
  // Add any additional fields your user objects have
}
interface Employee {
  id: number;
  name: string;
  role: string;
  department: string;
}



  

export default function ProfilePage() {

  const [isApprover] = useState(false);
  const [showDeletionCalendar, setShowDeletionCalendar] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [userMain, setUser] = useState<any>(null); // to store user data
  const [loading, setLoading] = useState(true); // loading state
  const [error, setError] = useState("");
  const [isAdmin, setIsAdmin] = useState(false); // simplified hook for admin role
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Employee | null>(null);
  const [searchQuery, setSearchQuery] = useState<any>("");
  const [selectedRole, setSelectedRole] = useState<any>("");
  const [selectedLocation, setSelectedLocation] = useState<any>("");
    const [allUsers, setAllUsers] = useState([ { id: 1, name: 'Alice Johnson', role: 'Software Engineer', department: 'Engineering', location:"Kakamega", reportsTo: "Meshack Ariri" },
  ])
  // Fetch user details using the token
  const { setEmployee } = useEmployee();


  const handleEmployeeClick = (employee: { id: number, name: string }) => {
    setEmployee(employee); // Store employee data in context
  };


  

    
useEffect(() => {
  const token = localStorage.getItem("jwtToken"); // Get the token from localStorage

  if (!token) {
    setError("No token found");
    setLoading(false);
    return;
  }

  fetch("http://localhost:3030/api/user/me", {
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }
      return response.json();
    })
    .then((userData) => {
      const userId = userData.id;
      

      return fetch(`http://localhost:3030/api/users/${userId}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch detailed user data");
      }
      return response.json();
    })
    .then((data) => {
      setUser(data); // Set the fetched user data
      const isAdmin = ["admin", "approver", "hrmanager"].includes(data.role.toLowerCase());
      setIsAdmin(isAdmin); // Set admin status

      // If the user is an admin, fetch the list of all users
      if (isAdmin) {
        return fetch("http://localhost:3030/api/users", {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Failed to fetch all users data");
            }
            return response.json();
          })
          .then((allUsersData) => {
            setAllUsers(allUsersData); // Set all users data
          });
      }
    })
    .catch((err) => {
      setError(err.message); // Set error if any
    })
    .finally(() => {
      setLoading(false); // Stop loading in case of success or error
    });
}, []);

const filteredUsers = allUsers.filter((user) => {
  const matchesSearch =
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.department.toLowerCase().includes(searchQuery.toLowerCase());
  const matchesRole = selectedRole ? user.role === selectedRole : true;
  const matchesLocation = selectedLocation
    ? user.location === selectedLocation
    : true;

  return matchesSearch && matchesRole && matchesLocation;
});
const filteredUsers2 = allUsers.filter((user) => {
  const matchesSearch =
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.department.toLowerCase().includes(searchQuery.toLowerCase());
  const matchesRole = selectedRole ? user.role === selectedRole : true;
  const matchesLocation = selectedLocation
    ? user.location === selectedLocation
    : true;
  const matchesManager =
    userMain?.role === "Admin" || user.reportsTo === userMain?.name;

  return matchesSearch && matchesRole && matchesLocation && matchesManager;
});
  // Export to Excel
  const exportToExcel = () => {
    const data = filteredUsers2.map((user) => ({
      Name: user.name,
      Role: user.role,
      Department: user.department,
      Location: user.location,
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Employees");

    XLSX.writeFile(workbook, "Employees.xlsx");
  };





const handleAddNewUser = () => {
  toast({
    title: "Nekee!!",
  });
};


const handleUpdateUser = (updatedUser: User) => {
  setAllUsers(allUsers.map(user => user.id === updatedUser.id ? updatedUser : user));
  toast({
    title: "User Updated",
    description: `${updatedUser.name}'s information has been updated successfully.`,
  });
};


  // Loading spinner component
  const LoadingSpinner = () => (
    <div className="flex justify-center items-center">
      <div className="w-16 h-16 border-4 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
    </div>
  );

  // If loading, display the spinner; if error, display the error message
  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  const handleTabClick = (value: "personal" | "account" | "timesheet" | "leave" | "add") => {
    setActiveTab(value);
  };

  const user = {
    name: "Alice Johnson",
    email: "alice@example.com",
    role: isAdmin ? "Admin" : (isApprover ? "Approver" : "Employee"),
    department: "Engineering",
    joinDate: "2022-03-15",
    hireDate: "2020-01-10",
    phone: "+1 (555) 123-4567",
    manager: "John Doe",
    pay: "$80,000",
    height: "5'6\"",
    weight: "130 lbs",
    address: "123 Main St, Cityville, ST 12345",
    bio: "Passionate.",
  }

  return (
    <EmployeeProvider>
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />

      <div className="container mx-auto p-4 sm:p-8" style={{ flex: 1, padding: "20px" }}>
        <h1 className="text-3xl sm:text-4xl font-bold mb-4 sm:mb-8">Hello {userMain.name}!</h1>
        
        <div className="grid gap-4 sm:gap-8 md:grid-cols-3">
          <Card className="md:col-span-1">
            <CardHeader>
              <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
                <Avatar className="w-20 h-20">
                  <AvatarImage src="/placeholder.svg?height=80&width=80" alt={user.name} />
                  <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div className="text-center sm:text-left">
                  <CardTitle>{userMain.name}</CardTitle>
                  <CardDescription>{userMain.email}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span>{userMain.role}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span>{userMain.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span>{userMain.phone}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                  <span>Joined {user.joinDate}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold">Manager:</span>
                  <span>{userMain.reportsTo}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold">Pay:</span>
                  <span>{userMain.pay}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold">Height:</span>
                  <span>{userMain.height}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold">Weight:</span>
                  <span>{userMain.weight}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold">Address:</span>
                  <span>{userMain.address}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold">Hire Date:</span>
                  <span>{userMain.hireDate}</span>
                </div>
                {isAdmin && (

                <div className="flex items-center space-x-2">
                  <span className="font-bold">Leave Days:</span>
                  <span>{userMain.leaveDays}</span>
                </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" variant="outline">
                <Camera className="w-4 h-4 mr-2" />
                Change Photo
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="md:col-span-2">
            <Tabs defaultValue="personal" className="w-full">
              <CardHeader>
               <TabsList
  style={{
    display: 'flex',
    borderRadius: '5px',
    padding: '5px',
    gap: '10px',
  }}
>
  <TabsTrigger
    value="personal"
    onClick={() => handleTabClick('personal')}
    style={{
      backgroundColor: activeTab === 'personal' ? '#003366' : '#8B1F25',
      color: activeTab === 'personal' ? '#FFFFFF' : '#DDDDDD',
      padding: '10px 20px',
      borderRadius: '5px',
      transition: 'background-color 0.3s, color 0.3s',
    }}
  >
    Personal Information
  </TabsTrigger>
  <TabsTrigger
    value="account"
    onClick={() => handleTabClick('account')}
    style={{
      backgroundColor: activeTab === 'account' ? '#003366' : '#8B1F25',
      color: activeTab === 'account' ? '#FFFFFF' : '#DDDDDD',
      padding: '10px 20px',
      borderRadius: '5px',
      transition: 'background-color 0.3s, color 0.3s',
    }}
  >
    Account Settings
  </TabsTrigger>
  <TabsTrigger
    value="timesheet"
    onClick={() => handleTabClick('timesheet')}
    style={{
      backgroundColor: activeTab === 'timesheet' ? '#003366' : '#8B1F25',
      color: activeTab === 'timesheet' ? '#FFFFFF' : '#DDDDDD',
      padding: '10px 20px',
      borderRadius: '5px',
      transition: 'background-color 0.3s, color 0.3s',
    }}
  >
    Timesheet
  </TabsTrigger>
  <TabsTrigger
    value="leave"
    onClick={() => handleTabClick('leave')}
    style={{
      backgroundColor: activeTab === 'leave' ? '#003366' : '#8B1F25',
      color: activeTab === 'leave' ? '#FFFFFF' : '#DDDDDD',
      padding: '10px 20px',
      borderRadius: '5px',
      transition: 'background-color 0.3s, color 0.3s',
    }}
  >
    Leave Management
  </TabsTrigger>

  {isAdmin && (


  <TabsTrigger
    value="add"
    onClick={() => handleTabClick('add')}
    style={{
      backgroundColor: activeTab === 'add' ? '#003366' : '#8B1F25',
      color: activeTab === 'add' ? '#FFFFFF' : '#DDDDDD',
      padding: '10px 20px',
      borderRadius: '5px',
      transition: 'background-color 0.3s, color 0.3s',
    }}
  >
    Manage Employees
  </TabsTrigger>

)}
</TabsList>
              </CardHeader>
              <CardContent>
                <TabsContent value="personal">
                  <form className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" defaultValue={userMain.name} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" defaultValue={userMain.email} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input id="phone" type="tel" defaultValue={userMain.phone} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Department</Label>
                        <Input id="email" type="email" defaultValue={userMain.department} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea id="bio" defaultValue={user.bio} />
                    </div>
                  </form>
                </TabsContent>
                
                <TabsContent value="account">
                  <form className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Current Password</Label>
                      <Input id="current-password" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input id="new-password" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm New Password</Label>
                      <Input id="confirm-password" type="password" />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="two-factor" />
                      <Label htmlFor="two-factor">Enable Two-Factor Authentication</Label>
                    </div>
                    <Button type="submit">Update Password</Button>
                  </form>
                </TabsContent>
                
                <TabsContent value="timesheet">
                <TimesheetComponent userId={userMain.id} isApprover={isApprover} />
              </TabsContent>
                        
              <TabsContent value="leave">
                <LeaveManagementComponent userId={userMain.id} isApprover={isAdmin} />
                <AdminLeaveManagementComponent userRole={userMain.role} userId={userMain.id} userName={userMain.name} />
                
              </TabsContent>

              {isAdmin && (
  <TabsContent value="add">
    <Card>
      <CardHeader>
        <CardTitle>Employee Directory</CardTitle>
        <CardDescription>Manage and view all employee information</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
        <Input
            className="max-w-sm"
            placeholder="Search employees..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />          <Button>
          <Link href={`/user-profile`}>
          Add User
          </Link>

          </Button>

        </div>

        <div className="flex justify-start space-x-4 mb-4">
          <select
            className="border rounded px-2 py-1"
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
          >
            <option value="">Filter by Role</option>
            {[...new Set(allUsers.map((u) => u.role))].map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
          <select
            className="border rounded px-2 py-1"
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
          >
            <option value="">Filter by Location</option>
            {[...new Set(allUsers.map((u) => u.location))].map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>
          <Button onClick={exportToExcel}>Download Excel</Button>
        </div>
        <div className="space-y-4">
          {filteredUsers2.map((employee) => (
            <div key={employee.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarFallback>{employee?.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{employee.name}</p>
                  <p className="text-sm text-muted-foreground">{employee.role}</p>
                </div>
              </div>
              <Badge>{employee.department}</Badge>
              <Button variant="outline" className="ml-2" onClick={() => handleEmployeeClick(employee)}>
                                
              <Link href={`/user-profile?id=${employee.id}`}>
          View {employee.name}'s Profile
        </Link>
                              </Button>

          <div onClick={() => handleEmployeeClick(employee)}>
            {employee.name}
          </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  </TabsContent>
)}




              
              </CardContent>
              
            </Tabs>
          </Card>
        </div>
      </div>



      <Footer />
    </div>
    </EmployeeProvider>
  );
}
