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
  const { employee } = useEmployee()

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

  useEffect(() => {
    if (id) {
      // Fetch the user data based on the user id
      fetch(`http://localhost:3030/api/users/${id}`)
        .then(response => response.json())
        .then(data => setUserInfo(data))
        .catch(err => console.error('Error fetching user data:', err));
    }
  }, [id]); // Re-run effect when `id` changes

  // Ensure userInfo is loaded before rendering the form
  if (!userInfo && !isEditMode) {
    // If `userInfo` is not available and not in edit mode, show the form to create a new user
    return (
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Create New User</CardTitle>
        </CardHeader>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          {/* Form Fields for creating new user */}
          {/* All the form inputs go here */}
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Creating User..." : "Submit New User Information"}
          </Button>
        </form>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>{isEditMode ? 'Edit User Information' : 'User Information Form'}</CardTitle>
      </CardHeader>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {/* Form Fields for editing user */}
        {/* Populate form fields with `userInfo` if available */}
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit User Information"}
        </Button>
      </form>
    </Card>
  )
}
