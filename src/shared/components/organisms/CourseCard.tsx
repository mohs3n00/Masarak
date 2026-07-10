import * as React from "react"
import { Card, CardContent } from "../molecules/Card"
import { Badge } from "../atoms/Badge"
import { Avatar, AvatarFallback, AvatarImage } from "../atoms/Avatar"
import { Star } from "lucide-react"

export interface CourseCardProps {
  title: string;
  image: string;
  instructor: { name: string; avatar?: string };
  price: string;
  rating: number;
  studentsCount: number;
  tags?: string[];
}

export function CourseCard({ title, image, instructor, price, rating, studentsCount, tags = [] }: CourseCardProps) {
  return (
    <Card className="overflow-hidden group hover:shadow-lg transition-shadow">
      <div className="relative aspect-video w-full overflow-hidden bg-muted">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image} alt={title} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300" />
        <div className="absolute top-2 start-2 flex flex-wrap gap-1">
          {tags.map(tag => <Badge key={tag} variant="outline" className="bg-background text-xs">{tag}</Badge>)}
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="font-bold text-lg line-clamp-2 mb-2">{title}</h3>
        <div className="flex items-center gap-2 mb-4">
          <Avatar className="h-6 w-6">
            <AvatarImage src={instructor.avatar} />
            <AvatarFallback>{instructor.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <span className="text-sm text-muted-foreground">{instructor.name}</span>
        </div>
        <div className="flex items-center justify-between mt-auto pt-2 border-t">
          <div className="flex items-center gap-1 text-sm font-medium">
            <Star className="h-4 w-4 fill-warning text-warning" />
            <span>{(rating || 0).toFixed(1)}</span>
            <span className="text-muted-foreground font-normal">({studentsCount})</span>
          </div>
          <span className="font-bold text-primary">{price}</span>
        </div>
      </CardContent>
    </Card>
  )
}