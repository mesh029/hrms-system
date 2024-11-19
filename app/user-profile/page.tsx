"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardFooter, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  role: z.string().min(1, { message: "Role is required." }),
  department: z.string().min(1, { message: "Department is required." }),
  address: z.string().min(1, { message: "Address is required." }),
});

type FormValues = z.infer<typeof formSchema>;

export default function UserProfilePage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [editableFields, setEditableFields] = useState<Record<keyof FormValues, boolean>>({
    name: false,
    email: false,
    role: false,
    department: false,
    address: false,
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "",
      department: "",
      address: "",
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/user/123"); // Replace with real API endpoint
        if (!response.ok) throw new Error("Failed to fetch user data");
        const data = await response.json();
        form.reset(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [form]);

  const handleEditToggle = (field: keyof FormValues) => {
    setEditableFields((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/user/123", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!response.ok) throw new Error("Failed to update user data");
      toast({ title: "Success", description: "Profile updated successfully!" });
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while saving changes.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setEditableFields({
        name: false,
        email: false,
        role: false,
        department: false,
        address: false,
      });
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto mt-10">
      <CardHeader>
        <CardTitle>User Profile</CardTitle>
      </CardHeader>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          {(["name", "email", "role", "department", "address"] as const).map((field) => (
            <div key={field} className="flex items-center justify-between space-y-1">
              <div className="w-full">
                <Label htmlFor={field} className="block mb-1 capitalize">
                  {field}
                </Label>
                {editableFields[field] ? (
                  field === "address" ? (
                    <Textarea
                      id={field}
                      placeholder={`Enter ${field}`}
                      {...form.register(field)}
                    />
                  ) : (
                    <Input
                      id={field}
                      placeholder={`Enter ${field}`}
                      {...form.register(field)}
                    />
                  )
                ) : (
                  <p className="p-2 border rounded bg-gray-50">{form.getValues(field)}</p>
                )}
                {form.formState.errors[field] && (
                  <p className="text-red-500 text-sm">
                    {form.formState.errors[field]?.message}
                  </p>
                )}
              </div>
              <Button
                type="button"
                size="sm"
                onClick={() => handleEditToggle(field)}
                variant={editableFields[field] ? "secondary" : "outline"}
                className="ml-2"
              >
                {editableFields[field] ? "Cancel" : "Edit"}
              </Button>
            </div>
          ))}
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
