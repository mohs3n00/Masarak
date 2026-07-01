import * as React from "react"
import { Card, CardContent } from "../molecules/Card"
import { Avatar, AvatarFallback, AvatarImage } from "../atoms/Avatar"
import { Button } from "../atoms/Button"

export interface TeacherCardProps {
  name: string;
  subject: string;
  avatar?: string;
  bio: string;
  onFollow?: () => void;
}

export function TeacherCard({ name, subject, avatar, bio, onFollow }: TeacherCardProps) {
  return (
    <Card className="text-center overflow-hidden hover:shadow-md transition-shadow">
      <div className="h-20 bg-primary/10 w-full" />
      <CardContent className="px-4 pb-6 pt-0 relative">
        <div className="flex justify-center -mt-10 mb-3">
          <Avatar className="h-20 w-20 border-4 border-background shadow-sm">
            <AvatarImage src={avatar} />
            <AvatarFallback className="text-xl">{name.charAt(0)}</AvatarFallback>
          </Avatar>
        </div>
        <h3 className="font-bold text-lg">{name}</h3>
        <p className="text-primary text-sm font-medium mb-3">{subject}</p>
        <p className="text-sm text-muted-foreground line-clamp-3 mb-4">{bio}</p>
        <Button onClick={onFollow} variant="outline" className="w-full">Follow</Button>
      </CardContent>
    </Card>
  )
}