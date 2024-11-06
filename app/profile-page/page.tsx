
"use client";

import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, Calendar as CalendarIcon, Camera, Lock, LogOut, Mail, Phone, User } from 'lucide-react';

import TimesheetComponent from "@/components/timesheet";
import LeaveManagementComponent from '@/components/leave';
import Footer from '@/components/footer';
import Header from '@/components/header';

export default function ProfilePage() {
  const [isAdmin] = useState(true);
  const [isApprover] = useState(false);
  const [showDeletionCalendar, setShowDeletionCalendar] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [userMain, setUser] = useState<any>(null); // to store user data
  const [loading, setLoading] = useState(true); // loading state
  const [error, setError] = useState("");
  // Fetch user details using the token
  useEffect(() => {
    const token = localStorage.getItem('jwtToken'); // Get the token from localStorage

    if (!token) {
      setError("No token found");
      setLoading(false);
      return;
    }

    // Step 1: Fetch user data using the /api/user/me endpoint
    fetch("http://localhost:3030/api/user/me", {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }
        return response.json();
      })
      .then((userData) => {
        // Step 2: Extract the user ID from the response and use it to fetch user details
        const userId = userData.id; // Extract the ID from the userData object

        // Step 3: Fetch the full user data from the /users/:id route using the extracted ID
        return fetch(`http://localhost:3030/api/users/${userId}`, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
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
        setLoading(false); // Stop loading
      })
      .catch((err) => {
        setError(err.message); // Set error if any
        setLoading(false); // Stop loading in case of error
      });
  }, []);
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

  const handleTabClick = (value: "personal" | "account" | "timesheet" | "leave") => {
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
    bio: "Passionate software engineer with 5 years of experience in web development.",
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />

      <div className="container mx-auto p-4 sm:p-8" style={{ flex: 1, padding: "20px" }}>
        <h1 className="text-3xl sm:text-4xl font-bold mb-4 sm:mb-8">User Profile</h1>
        
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
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span>{user.phone}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                  <span>Joined {user.joinDate}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold">Manager:</span>
                  <span>{user.manager}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold">Pay:</span>
                  <span>{user.pay}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold">Height:</span>
                  <span>{user.height}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold">Weight:</span>
                  <span>{user.weight}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold">Address:</span>
                  <span>{user.address}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold">Hire Date:</span>
                  <span>{user.hireDate}</span>
                </div>
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
</TabsList>
              </CardHeader>
              <CardContent>
                <TabsContent value="personal">
                  <form className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" defaultValue={user.name} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" defaultValue={user.email} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input id="phone" type="tel" defaultValue={user.phone} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="department">Department</Label>
                        <Select defaultValue={user.department}>
                          <SelectTrigger id="department">
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Engineering">Engineering</SelectItem>
                            <SelectItem value="Marketing">Marketing</SelectItem>
                            <SelectItem value="Sales">Sales</SelectItem>
                            <SelectItem value="HR">Human Resources</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea id="bio" defaultValue={user.bio} />
                    </div>
                    <Button type="submit">Save Changes</Button>
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
                <TimesheetComponent isApprover={isApprover} />
              </TabsContent>
                        
              <TabsContent value="leave">
                <LeaveManagementComponent isApprover={isApprover} />
              </TabsContent>
              </CardContent>
            </Tabs>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}
