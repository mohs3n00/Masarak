"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { TeacherCard } from "@/shared/components/organisms/TeacherCard"
import { cn } from "@/lib/utils"

interface TeachersCarouselProps {
  teachers: any[]
}

export function TeachersCarousel({ teachers }: TeachersCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % teachers.length)
  }

  useEffect(() => {
    if (isHovered || teachers.length <= 1) return
    const timer = setInterval(() => {
      handleNext()
    }, 3000)
    return () => clearInterval(timer)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHovered, teachers.length])

  if (!teachers || teachers.length === 0) return null

  // Function to get visible items based on current index
  const getVisibleItems = () => {
    const items = []
    // 5 items to show for smooth transition (2 left, 1 center, 2 right)
    for (let i = -2; i <= 2; i++) {
      const index = (currentIndex + i + teachers.length) % teachers.length
      items.push({ item: teachers[index], offset: i })
    }
    return items
  }

  return (
    <div 
      className="relative w-full max-w-6xl mx-auto py-10"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center justify-center relative min-h-[450px] overflow-hidden" dir="ltr">
        <AnimatePresence mode="popLayout">
          {getVisibleItems().map(({ item, offset }) => {
            const isCenter = offset === 0;
            const isEdge = Math.abs(offset) === 2;
            
            return (
              <motion.div
                key={`${item.id}-${currentIndex + offset}`} // Force re-render on index change
                initial={{ 
                  opacity: 0, 
                  x: offset * 250, 
                  scale: 0.8 
                }}
                animate={{ 
                  opacity: isCenter ? 1 : isEdge ? 0 : 0.6,
                  x: offset * 320,
                  scale: isCenter ? 1.1 : 0.9,
                  zIndex: isCenter ? 10 : 5 - Math.abs(offset),
                  filter: isCenter ? "blur(0px)" : "blur(2px)"
                }}
                exit={{ 
                  opacity: 0,
                  scale: 0.8,
                  zIndex: 0
                }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="absolute"
                style={{ width: "280px" }}
              >
                <div className={cn("transition-all duration-300", !isCenter && "pointer-events-none", isCenter && "shadow-2xl rounded-2xl")}>
                  <TeacherCard
                    id={item.id}
                    name={item.name}
                    subject={item.specializations?.[0] || 'مدرس'}
                    avatar={item.avatar || ''}
                    bio={item.bio || ''}
                    studentsCount={item.studentsCount}
                    coursesCount={item.coursesCount}
                  />
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {/* Navigation Dots */}
      <div className="flex justify-center gap-2 mt-4" dir="rtl">
        {teachers.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={cn(
              "w-2.5 h-2.5 rounded-full transition-all duration-300",
              currentIndex === idx 
                ? "bg-white w-6" 
                : "bg-white/30 hover:bg-white/50"
            )}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
