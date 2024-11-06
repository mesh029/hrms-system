"use client"

import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { format } from "date-fns"
import { Calendar as CalendarIcon, User, Briefcase, Mail, Scale, Ruler, MapPin, Users } from "lucide-react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import Footer from '@/components/footer';
import Header from '@/components/header';

// Zod schema for form validation
const formSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    role: z.string().min(1, { message: "Role is required." }),
    department: z.string().min(1, { message: "Department is required." }),
    pay: z.string().min(1, { message: "Pay is required." }),
    email: z.string().email({ message: "Invalid email address." }),
    hireDate: z.date({ required_error: "Hire date is required." }),
    endDate: z.date().optional(),
    reportsTo: z.string().optional(),
    weight: z.string().optional(),
    height: z.string().optional(),
    address: z.string().min(1, { message: "Address is required." }),
    manager: z.string().optional(),
  })
// Mock array of existing users
const existingUsers = [
  { id: "1", name: "Jane Smith" },
  { id: "2", name: "John Doe" },
  { id: "3", name: "Alice Johnson" },
  { id: "4", name: "Bob Williams" },
  { id: "5", name: "Emma Brown" },
]

export default function UserInformationForm() {
  const [hireDate, setHireDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [generatedPassword, setGeneratedPassword] = useState("")

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        name: "",
        role: "",
        department: "",
        pay: "",
        email: "",
        reportsTo: "",
        weight: "",
        height: "",
        address: "",
        manager: "",
      },
  })

 
  const router = useRouter()

  async function onSubmit(values: z.infer<typeof formSchema>) {
      try {
          // Simulate submitting the user data to an API
          console.log(values)
          const response = await fetch("/api/users", {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
              },
              body: JSON.stringify(values),
          })

          if (!response.ok) {
              throw new Error("Error creating user")
          }

          const data = await response.json()
          alert(`User created successfully. Default password: ${data.defaultPassword}`)
      } catch (error) {
          console.error("Error:", error)
      }
  }

  const handleSubmitClick = () => {
      form.handleSubmit(onSubmit)()  // Manually trigger form submission
  }

  return (
    <div>
              <Header />


    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>User Information Form</CardTitle>
        <CardDescription>Enter the details of the new user</CardDescription>
      </CardHeader>
      <form>
        <CardContent className="grid gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <div className="relative">
                <User className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input id="name" placeholder="John Doe" className="pl-8" {...form.register("name")} />
              </div>
              {form.formState.errors.name && (
                <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role *</Label>
              <div className="relative">
                <Briefcase className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input id="role" placeholder="Software Engineer" className="pl-8" {...form.register("role")} />
              </div>
              {form.formState.errors.role && (
                <p className="text-sm text-red-500">{form.formState.errors.role.message}</p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pay">Pay *</Label>
              <div className="relative">
                <span className="absolute left-2 top-2.5 text-muted-foreground">$</span>
                <Input id="pay" placeholder="50,000" className="pl-6" {...form.register("pay")} />
              </div>
              {form.formState.errors.pay && (
                <p className="text-sm text-red-500">{form.formState.errors.pay.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <div className="relative">
                <Mail className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input id="email" placeholder="john@example.com" className="pl-8" {...form.register("email")} />
              </div>
              {form.formState.errors.email && (
                <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Hire Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !hireDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {hireDate ? format(hireDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={hireDate}
                    onSelect={(date) => {
                      setHireDate(date)
                      form.setValue("hireDate", date as Date)
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {form.formState.errors.hireDate && (
                <p className="text-sm text-red-500">{form.formState.errors.hireDate.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>End of Hire Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={(date) => {
                      setEndDate(date)
                      form.setValue("endDate", date as Date)
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="reportsTo">Reports To *</Label>
              <Controller
                name="reportsTo"
                control={form.control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select supervisor" />
                    </SelectTrigger>
                    <SelectContent>
                      {existingUsers.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
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
                <Input id="manager" placeholder="John Doe" className="pl-8" {...form.register("manager")} />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="weight">Weight (kg)</Label>
              <div className="relative">
                <Scale className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input id="weight" placeholder="70" className="pl-8" {...form.register("weight")} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="height">Height (cm)</Label>
              <div className="relative">
                <Ruler className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input id="height" placeholder="175" className="pl-8" {...form.register("height")} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="height">Leave Days (cm)</Label>
              <div className="relative">
                <CalendarIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input id="height" placeholder="9" className="pl-8" {...form.register("height")} />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Address *</Label>
            <div className="relative">
              <MapPin className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Textarea id="address" placeholder="123 Main St, City, Country" className="pl-8 min-h-[80px]" {...form.register("address")} />
            </div>
            {form.formState.errors.address && (
              <p className="text-sm text-red-500">{form.formState.errors.address.message}</p>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSubmitClick} className="w-full">Submit User Information</Button>
        </CardFooter>
      </form>
    </Card>
    <Footer/>

    </div>

  )
}