"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, Calendar as CalendarIcon, Camera, Lock, LogOut, Mail, Phone, User } from 'lucide-react'

import TimesheetComponent from "@/components/timesheet";
import LeaveManagementComponent from '@/components/leave';
import Footer from '@/components/footer'
import Header from '@/components/header'

export default function ProfilePage() {
  const [isAdmin] = useState(false)
  const [isApprover] = useState(false)
  const [showDeletionCalendar, setShowDeletionCalendar] = useState(false)
  const [activeTab, setActiveTab] = useState('dashboard');


  const handleTabClick = (value: "personal" | "account" | "timesheet" | "leave") => {
    setActiveTab(value);
  };
  

  const user = {
    name: "Alice Johnson",
    email: "alice@example.com",
    role: isAdmin ? "Admin" : (isApprover ? "Approver" : "Employee"),
    department: "Engineering",
    joinDate: "2022-03-15",
    phone: "+1 (555) 123-4567",
    bio: "Passionate software engineer with 5 years of experience in web development.",
  }

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh' 
    }}>                <Header />

    <div className="container mx-auto p-4 sm:p-8" style={{flex:1, padding:"20px"}}>
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
                <CardTitle>{user.name}</CardTitle>
                <CardDescription>{user.email}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-muted-foreground" />
                <span>{user.role}</span>
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
                backgroundColor: activeTab === 'account' ? '#003366' : '#8B1F25', // Dark blue for active, maroon for inactive
                color: activeTab === 'account' ? '#FFFFFF' : '#DDDDDD',
                padding: '10px 20px',
                borderRadius: '5px',
                transition: 'background-color 0.3s, color 0.3s',
              }}
            >
              Dashboard
            </TabsTrigger>
            <TabsTrigger
              value="account"
              onClick={() => handleTabClick('account')}
              style={{
                backgroundColor: activeTab === 'personal' ? '#003366' : '#8B1F25',
                color: activeTab === 'personal' ? '#FFFFFF' : '#DDDDDD',
                padding: '10px 20px',
                borderRadius: '5px',
                transition: 'background-color 0.3s, color 0.3s',
              }}
            >
              Employees
            </TabsTrigger>
            <TabsTrigger
              value="timesheet"
              onClick={() => handleTabClick('timesheet')}
              style={{
                backgroundColor: activeTab === 'account' ? '#003366' : '#8B1F25',
                color: activeTab === 'account' ? '#FFFFFF' : '#DDDDDD',
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
                backgroundColor: activeTab === 'timesheet' ? '#003366' : '#8B1F25',
                color: activeTab === 'timesheet' ? '#FFFFFF' : '#DDDDDD',
                padding: '10px 20px',
                borderRadius: '5px',
                transition: 'background-color 0.3s, color 0.3s',
              }}
            >
              Leave
            </TabsTrigger>
          </TabsList>
              <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
                <TabsTrigger value="personal">Personal</TabsTrigger>
                <TabsTrigger value="account">Account</TabsTrigger>
                <TabsTrigger value="timesheet">Timesheet</TabsTrigger>
                <TabsTrigger value="leave">Leave</TabsTrigger>

                {isAdmin && <TabsTrigger value="admin">Admin</TabsTrigger>}

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
              
              {isAdmin && (
                <TabsContent value="admin">
                  <div className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Card>
                        <CardHeader>
                          <CardTitle>User Management</CardTitle>
                          <CardDescription>Manage user accounts and permissions</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <Button className="w-full">
                            <User className="w-4 h-4 mr-2" />
                            View All Users
                          </Button>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader>
                          <CardTitle>System Settings</CardTitle>
                          <CardDescription>Configure global system settings</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <Button className="w-full">
                            <Lock className="w-4 h-4 mr-2" />
                            Security Settings
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                    <Card>
                      <CardHeader>
                        <CardTitle>Audit Log</CardTitle>
                        <CardDescription>View recent system activities</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {[
                            { action: "User login", timestamp: "2023-10-24 09:15:00" },
                            { action: "Password change", timestamp: "2023-10-23 14:30:00" },
                            { action: "New user created", timestamp: "2023-10-22 11:45:00" },
                          ].map((log, index) => (
                            <div key={index} className="flex justify-between items-center p-2 bg-muted rounded-md">
                              <span>{log.action}</span>
                              <Badge variant="outline">{log.timestamp}</Badge>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              )}
            </CardContent>
          </Tabs>
        </Card>
      </div>
      
      <Card className="mt-4 sm:mt-8">
        <CardHeader>
          <CardTitle>Account Actions</CardTitle>
          <CardDescription>Manage your account status and data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            <Button variant="outline" className="w-full">
              <AlertCircle className="w-4 h-4 mr-2" />
              Request Data Export
            </Button>
            <div className="relative">
              <Button variant="outline" className="w-full" onClick={() => setShowDeletionCalendar(!showDeletionCalendar)}>
                Schedule Account Deletion
              </Button>
              {showDeletionCalendar && (
                <div className="absolute z-10 mt-2 p-2 bg-background border rounded-md shadow-md">
                  <Calendar
                    mode="single"
                    selected={undefined}
                    onSelect={(newDate) => {
                      if (newDate) {
                        console.log("Selected date for account deletion:", newDate.toISOString())
                        // Here you would typically call an API to schedule the account deletion
                      }
                      setShowDeletionCalendar(false)
                    }}
                    disabled={(date) => date < new Date()}
                  />
                </div>
              )}
            </div>
            <Button variant="destructive" className="w-full">
              <LogOut className="w-4 h-4 mr-2" />
              Log Out of All Devices
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
    <Footer/>

    </div>
  )
}
