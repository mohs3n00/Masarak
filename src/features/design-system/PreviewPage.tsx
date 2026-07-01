"use client"

import * as React from "react"
import { Moon, Sun, Users, BookOpen } from "lucide-react"

import { Button } from "@/shared/components/atoms/Button"
import { Input, PasswordInput, SearchInput } from "@/shared/components/atoms/Input"
import { Textarea } from "@/shared/components/atoms/Textarea"
import { Badge } from "@/shared/components/atoms/Badge"
import { Chip } from "@/shared/components/atoms/Chip"
import { Spinner } from "@/shared/components/atoms/Spinner"
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/atoms/Avatar"

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/shared/components/molecules/Card"
import { SectionTitle } from "@/shared/components/molecules/SectionTitle"
import { SearchBar } from "@/shared/components/molecules/SearchBar"
import { EmptyState, ErrorState, SuccessState, LoadingState } from "@/shared/components/molecules/States"

import { CourseCard } from "@/shared/components/organisms/CourseCard"
import { TeacherCard } from "@/shared/components/organisms/TeacherCard"
import { StatCard } from "@/shared/components/organisms/StatCard"

export function PreviewPage() {
  const [isDark, setIsDark] = React.useState(false)

  React.useEffect(() => {
    if (isDark) document.documentElement.classList.add("dark")
    else document.documentElement.classList.remove("dark")
  }, [isDark])

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* Header */}
      <div className="sticky top-0 z-50 flex items-center justify-between px-8 py-4 border-b bg-background/80 backdrop-blur-md">
        <div>
          <h1 className="text-2xl font-bold text-primary">Masarak Design System</h1>
          <p className="text-sm text-muted-foreground">Component Preview & Verification</p>
        </div>
        <Button variant="outline" onClick={() => setIsDark(!isDark)} leftIcon={isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}>
          {isDark ? "Light Mode" : "Dark Mode"}
        </Button>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-16">
        
        {/* Atoms Section */}
        <section className="space-y-8">
          <SectionTitle title="Atoms" subtitle="Basic building blocks" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Buttons */}
            <Card>
              <CardHeader>
                <CardTitle>Buttons</CardTitle>
                <CardDescription>All button variants and states</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Button>Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="destructive">Destructive</Button>
                  <Button loading>Loading</Button>
                  <Button leftIcon={<BookOpen className="h-4 w-4" />}>With Icon</Button>
                </div>
              </CardContent>
            </Card>

            {/* Inputs */}
            <Card>
              <CardHeader>
                <CardTitle>Inputs</CardTitle>
                <CardDescription>Text inputs and variants</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input placeholder="Default Input" />
                <Input placeholder="Error Input" error />
                <PasswordInput placeholder="Password Input" />
                <SearchInput placeholder="Search Input..." />
              </CardContent>
            </Card>

            {/* Badges & Chips */}
            <Card>
              <CardHeader>
                <CardTitle>Badges & Chips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Badge>Default Badge</Badge>
                  <Badge variant="secondary">Secondary</Badge>
                  <Badge variant="outline">Outline</Badge>
                  <Badge variant="destructive">Destructive</Badge>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Chip onRemove={() => {}}>Removable Chip</Chip>
                  <Chip icon={<Users className="h-3 w-3" />}>Icon Chip</Chip>
                </div>
                <div className="flex items-center gap-4 mt-4">
                  <Spinner size="sm" />
                  <Spinner size="md" />
                  <Spinner size="lg" />
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Molecules Section */}
        <section className="space-y-8">
          <SectionTitle title="Molecules" subtitle="Composite components" />
          
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Search Bar</CardTitle>
              </CardHeader>
              <CardContent>
                <SearchBar placeholder="Search courses, teachers..." onSearch={(v) => console.log(v)} />
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardContent className="p-0">
                  <EmptyState title="No Courses Found" description="Try adjusting your search criteria." />
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-0">
                  <ErrorState description="Failed to load data from the server." />
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-0">
                  <SuccessState title="Payment Successful" description="Your receipt has been sent." />
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-0">
                  <LoadingState text="Loading your dashboard..." />
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Organisms Section */}
        <section className="space-y-8">
          <SectionTitle title="Organisms" subtitle="Complex UI sections" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Course Card */}
            <CourseCard 
              title="Advanced React & Next.js Masterclass"
              image="https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80"
              instructor={{ name: "Ahmed Ali", avatar: "https://i.pravatar.cc/150?u=ahmed" }}
              price="1500 EGP"
              rating={4.8}
              studentsCount={1240}
              tags={["Frontend", "Next.js"]}
            />

            {/* Teacher Card */}
            <TeacherCard 
              name="Sarah Mohamed"
              subject="Mathematics"
              avatar="https://i.pravatar.cc/150?u=sarah"
              bio="Experienced math teacher with over 10 years of helping students excel in Calculus and Algebra."
            />

            {/* Stat Card */}
            <div className="space-y-4">
              <StatCard 
                title="Total Students"
                value="12,450"
                icon={Users}
                trend={{ value: 12.5, label: "vs last month" }}
              />
              <StatCard 
                title="Active Courses"
                value="45"
                icon={BookOpen}
                trend={{ value: -2.4, label: "vs last month" }}
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
