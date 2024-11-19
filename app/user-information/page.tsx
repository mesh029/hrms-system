"use client"

import { useState, useEffect } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { format } from "date-fns"
import { Calendar as CalendarIcon, User, Briefcase, Mail, Scale, Ruler, MapPin, Users, Pencil } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useToast } from "@/hooks/use-toast"
import { EmployeeProvider, useEmployee } from "../context/EmployeeContext"
import { useSearchParams } from 'next/navigation';

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }).optional(),
  role: z.string().min(1, { message: "Role is required." }),
  department: z.string().min(1, { message: "Department is required." }),
  address: z.string().min(1, { message: "Address is required." }),
  hireDate: z.date({ required_error: "Hire date is required." }),
  endDate: z.date().optional(),
  reportsTo: z.string().min(1, { message: "Reports To is required." }),
  manager: z.string().optional(),
  weight: z.string().optional(),
  height: z.string().optional(),
  leaveDays: z.number().min(0, { message: "Leave days must be a positive number." }),
})

// Mock array of existing users
const existingUsers = [
  { id: "1", name: "Jane Smith" },
  { id: "2", name: "John Doe" },
  { id: "3", name: "Alice Johnson" },
  { id: "4", name: "Bob Williams" },
  { id: "5", name: "Emma Brown" },
]

interface User {
  id: number;
  name: string;
  role: string;
  department: string;
  // Add any other fields that your `user` object has
}
interface UserInformationFormProps {
  user: User | null; // If user can be null, or a valid User object
  onClose: () => void;
  onUpdate: (updatedUser: User) => void;
  isEditMode: boolean;
  userId?: string; // optional userId if necessary
}


export default function UserInformationForm({ onClose, onUpdate, isEditMode, userId }: UserInformationFormProps) {
  const searchParams = useSearchParams(); // Access search params
  const id = searchParams.get('id'); 
  const mode = searchParams.get('mode'); 
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isEditable, setIsEditable] = useState(false);
  const [hireDate, setHireDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [userInfo, setUserInfo] = useState<any>(null);
  const[token, setToken] = useState<any>(null);
  const { toast } = useToast()
  const {employee } = useEmployee()


  const toggleEdit = () => {
    setIsEditable((prev) => !prev); // Toggle edit mode
  };


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "",
      department: "",
      address: "",
      reportsTo: "",
      manager: "",
      weight: "",
      height: "",
      leaveDays: 0,
    },
  })

  useEffect(() => {
    const token = localStorage.getItem('jwtToken'); 
    setToken(localStorage.getItem('jwtToken'));

  }, []);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true)
    try {
      const url = isEditMode ? `/api/users/${userId}` : 'http://localhost:3030/api/users';
      const method = isEditMode ? 'PUT' : 'POST';
      const successMessage = isEditMode ? "User information updated successfully" : "User created successfully";
  
      const response = await fetch(url, {
        method: method,
        headers: {
          "Authorization": `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
  
      if (!response.ok) {
        throw new Error(isEditMode ? 'Failed to update user' : 'Failed to create user');
      }
  
      const data = await response.json();
      toast({
        title: "Success",
        description: isEditMode ? successMessage : `User created successfully. Default password: ${data.defaultPassword}`,
      });
  
      if (isEditMode) {
        onUpdate(data); // Trigger update for the edited user
        onClose();
      } else {
        form.reset(); // Reset form after adding a new user
      }
  
    } catch (error) {
      toast({
        title: "Error",
        description: isEditMode ? "Failed to update user information. Please try again." : "Failed to create user. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  

 // useEffect(() => {
   // if (form.formState.isSubmitSuccessful) {
     // form.reset()
    //}
  //}, [form.formState.isSubmitSuccessful, form.reset])
  
  useEffect(() => {
    if (id) {
      // Fetch the user data based on the user id from context
      fetch(`http://localhost:3030/api/users/${id}`)
        .then(response => response.json())
        .then(data => setUserInfo(data))
        .catch(err => console.error('Error fetching user data:', err));
    }
  }, [employee]); // Re-run effect when user changes

  // Ensure userInfo is loaded before rendering the form
  if (!userInfo) {
    return <div>Loading...</div>;
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>User Information Form</CardTitle>
        <CardDescription>Enter/Update the details of the user</CardDescription>
      </CardHeader>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent className="grid gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <div className="relative">
                <User className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
            id="email"
            value={userInfo.name} // Set the email value
            className="pl-8"
            readOnly={!isEditable} // Make the input readonly based on `isEditable`
          />
              </div>
              {form.formState.errors.name && (
                <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <div className="relative">
                <Mail className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <div className="flex items-center">
                <Input
            id="email"
            value={userInfo.email} // Set the email value
            className="pl-8"
            readOnly={!isEditable} // Make the input readonly based on `isEditable`
          />
          {isEditable ? (
            <Input
              id="email"
              placeholder="john@example.com"
              className="pl-8"
              {...form.register('email')}
              readOnly={!isEditable}
            />
          ) : (
            <span className="pl-8">{userInfo.email}</span> // Display email when not in edit mode
          )}
          <button
            type="button"
            className="ml-2"
            onClick={toggleEdit} // Toggle edit mode on pencil icon click
          >
            <Pencil className="h-4 w-4 text-muted-foreground" />
          </button>
          </div>
              </div>
            </div>
          </div>

          <Input
            id="email"
            value={userInfo.email} // Set the email value
            className="pl-8"
            readOnly={!isEditable} // Make the input readonly based on `isEditable`
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="role">Role *</Label>
              <div className="relative">
                <Briefcase className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
            id="email"
            value={userInfo.role} // Set the email value
            className="pl-8"
            readOnly={!isEditable} // Make the input readonly based on `isEditable`
          />              </div>
              {form.formState.errors.role && (
                <p className="text-sm text-red-500">{form.formState.errors.role.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Department *</Label>
              <div className="relative">
                <Briefcase className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
            id="email"
            value={userInfo.department} // Set the email value
            className="pl-8"
            readOnly={!isEditable} // Make the input readonly based on `isEditable`
          />              </div>
              {form.formState.errors.department && (
                <p className="text-sm text-red-500">{form.formState.errors.department.message}</p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Hire Date *</Label>
              <Input
            id="email"
            value={userInfo.hireDate} // Set the email value
            className="pl-8"
            readOnly={!isEditable} // Make the input readonly based on `isEditable`
          />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="reportsTo">Reports To *</Label>
              <Controller
                name="reportsTo"
                control={form.control}
                render={({ field }) => (
                  <Select onValueChange={(value) => field.onChange(parseInt(value))} defaultValue={field.value}>                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select supervisor" />
                    </SelectTrigger>
                    <SelectContent>
                      {existingUsers.map((user) => (
                        <SelectItem key={user.id} value={String(user.id)}>
                          {user.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {form.formState.errors.reportsTo && (
                <p className="text-sm text-red-500">{form.formState.errors.reportsTo.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="manager">Manager</Label>
              <div className="relative">
                <Users className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
            id="email"
            value={userInfo.manager} // Set the email value
            className="pl-8"
            readOnly={!isEditable} // Make the input readonly based on `isEditable`
          />              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="weight">Weight (kg)</Label>
              <div className="relative">
                <Scale className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
            id="email"
            value={userInfo.weight} // Set the email value
            className="pl-8"
            readOnly={!isEditable} // Make the input readonly based on `isEditable`
          />              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="height">Height (cm)</Label>
              <div className="relative">
                <Ruler className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
            id="email"
            value={userInfo.height} // Set the email value
            className="pl-8"
            readOnly={!isEditable} // Make the input readonly based on `isEditable`
          />              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="leaveDays">Leave Days *</Label>
              <div className="relative">
                <CalendarIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
            id="email"
            value={userInfo.leaveDays} // Set the email value
            className="pl-8"
            readOnly={!isEditable} // Make the input readonly based on `isEditable`
          />              </div>
              {form.formState.errors.leaveDays && (
                <p className="text-sm text-red-500">{form.formState.errors.leaveDays.message}</p>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Address *</Label>
            <div className="relative">
              <MapPin className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
            id="email"
            value={userInfo.address} // Set the email value
            className="pl-8"
            readOnly={!isEditable} // Make the input readonly based on `isEditable`
          />            </div>
            {form.formState.errors.address && (
              <p className="text-sm text-red-500">{form.formState.errors.address.message}</p>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Creating User..." : "Submit User Information"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
