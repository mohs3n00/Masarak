import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import { fetchPublicCourse, fetchTeacherCourseBySlug, fetchAdminCourseBySlug } from '@/lib/api/public';
import { AppContainer, Section } from '@/shared/layouts/Containers';
import Image from 'next/image';
import { Star, Users, Clock, PlayCircle, BookOpen } from 'lucide-react';
import { CourseActionButtons } from '@/features/marketing/components/CourseActionButtons';

export default async function CourseDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  let course = await fetchPublicCourse(resolvedParams.slug);
  
  if (!course) {
    const cookieStore = await cookies();
    const token = cookieStore.get('accessToken')?.value;
    if (token) {
      try {
        const payloadBase64 = token.split('.')[1];
        const decoded = JSON.parse(Buffer.from(payloadBase64, 'base64').toString());
        if (decoded.role === 'ADMIN' || decoded.role === 'SUPER_ADMIN') {
          course = await fetchAdminCourseBySlug(resolvedParams.slug, token);
        } else {
          course = await fetchTeacherCourseBySlug(resolvedParams.slug, token);
        }
      } catch (e) {
        course = await fetchTeacherCourseBySlug(resolvedParams.slug, token);
      }
    }
  }
  
  if (!course) {
    notFound();
  }

  return (
    <div className="w-full bg-background min-h-screen pb-24">
      <div className="w-full bg-slate-900 text-white pt-20 pb-16">
        <AppContainer>
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            <div className="flex-1 flex flex-col gap-6">
               <h1 className="text-3xl md:text-5xl font-bold font-heading leading-tight">{course.title}</h1>
               <p className="text-slate-300 text-lg max-w-2xl">{course.description || "لا يوجد وصف لهذا الكورس."}</p>
               
               <div className="flex items-center gap-6 mt-4">
                 <div className="flex items-center gap-2">
                   <Star className="text-amber-400 fill-amber-400 w-5 h-5" />
                   <span className="font-bold">{course.averageRating || 0}</span>
                 </div>
                 <div className="flex items-center gap-2">
                   <Users className="text-slate-400 w-5 h-5" />
                   <span>{course._count?.enrollments || 0} طالب</span>
                 </div>
                 {course.category && (
                   <span className="bg-white/10 px-3 py-1 rounded-full text-sm">{course.category.name}</span>
                 )}
               </div>
               
               {/* Teacher info */}
               {course.instructors?.[0]?.teacher?.user && (
                 <div className="flex items-center gap-4 mt-6 p-4 rounded-xl bg-white/5 border border-white/10 w-fit">
                    <div className="w-12 h-12 rounded-full overflow-hidden relative bg-slate-800 shrink-0 flex items-center justify-center text-slate-400">
                      {course.instructors[0].teacher.user.avatar ? (
                        <Image 
                          src={course.instructors[0].teacher.user.avatar} 
                          alt={course.instructors[0].teacher.user.name} 
                          fill 
                          className="object-cover" 
                        />
                      ) : (
                        <Users className="w-6 h-6" />
                      )}
                    </div>
                   <div>
                     <p className="text-sm text-slate-400">مقدم الكورس</p>
                     <p className="font-bold">{course.instructors[0].teacher.user.name}</p>
                   </div>
                 </div>
               )}
            </div>
            
            {/* Action Card */}
            <div className="w-full lg:w-[400px] bg-card text-foreground rounded-2xl shadow-xl overflow-hidden border border-border mt-8 lg:-mt-8 relative z-10 shrink-0">
               <div className="w-full aspect-video relative bg-slate-800">
                 {course.thumbnailUrl ? (
                   <Image src={course.thumbnailUrl} alt={course.title} fill className="object-cover" />
                 ) : (
                   <div className="w-full h-full bg-slate-800 flex items-center justify-center border border-border">
                     <BookOpen className="w-12 h-12 text-slate-600" />
                   </div>
                 )}
               </div>
               <div className="p-6 flex flex-col gap-6">
                 <div className="flex items-end gap-2">
                   <span className="text-3xl font-black">{course.price === 0 ? 'مجاناً' : course.price}</span>
                   {course.price > 0 && <span className="text-muted-foreground font-bold mb-1">ج.م</span>}
                   {course.originalPrice && course.originalPrice > course.price && (
                     <span className="text-muted-foreground line-through ml-2">{course.originalPrice} ج.م</span>
                   )}
                 </div>
                 
                 <CourseActionButtons 
                   courseId={course.id} 
                   price={course.price} 
                   instructorUserId={course.instructors?.[0]?.teacher?.userId || course.instructors?.[0]?.teacher?.user?.id}
                 />
                 
                 <div className="space-y-4 pt-4 border-t border-border">
                   <h4 className="font-bold">يحتوي هذا الكورس على:</h4>
                   <ul className="space-y-3 text-sm text-muted-foreground">
                     <li className="flex items-center gap-3"><Clock className="w-4 h-4 text-primary" /> وصول غير محدود لمحتوى الشهر</li>
                     <li className="flex items-center gap-3"><PlayCircle className="w-4 h-4 text-primary" /> فيديوهات بجودة عالية</li>
                     <li className="flex items-center gap-3"><Users className="w-4 h-4 text-primary" /> دعم فني ومجتمع طلابي</li>
                   </ul>
                 </div>
               </div>
            </div>
          </div>
        </AppContainer>
      </div>
      
      {/* Course Content */}
      <AppContainer>
         <Section className="py-16 max-w-4xl">
           <h2 className="text-2xl font-bold font-heading mb-8 flex items-center gap-2">
             <PlayCircle className="w-6 h-6 text-primary" />
             محتوى الكورس
           </h2>
           <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
             {course.sections && course.sections.length > 0 ? (
               <div className="flex flex-col gap-4">
                 {course.sections.map((sec: any) => (
                   <div key={sec.id} className="border border-border rounded-xl p-4 bg-background/50 hover:border-primary/30 transition-colors">
                     <h3 className="font-bold mb-3 text-lg">{sec.title}</h3>
                     <ul className="space-y-2">
                       {sec.lessons?.map((les: any) => (
                         <li key={les.id} className="flex items-center justify-between p-3 bg-card border border-border/50 rounded-lg text-sm hover:shadow-sm transition-all">
                           <div className="flex items-center gap-3">
                             <PlayCircle className="w-4 h-4 text-muted-foreground" />
                             <span className="font-medium text-foreground">{les.title}</span>
                           </div>
                           {les.isFreePreview ? (
                             <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold">مجاني</span>
                           ) : (
                             <span className="text-xs text-muted-foreground">مغلق</span>
                           )}
                         </li>
                       ))}
                     </ul>
                   </div>
                 ))}
               </div>
             ) : (
               <div className="text-center py-12">
                 <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                   <Clock className="w-8 h-8 text-muted-foreground" />
                 </div>
                 <h3 className="font-bold text-lg mb-2">جاري تجهيز المحتوى</h3>
                 <p className="text-muted-foreground max-w-md mx-auto">سيتم إضافة الفيديوهات والمرفقات الخاصة بهذا الكورس قريباً من قبل المعلم.</p>
               </div>
             )}
           </div>
         </Section>
      </AppContainer>
    </div>
  );
}