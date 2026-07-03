import { DashboardContainer } from "@/shared/layouts/Containers";
import { SectionTitle } from "@/shared/components/molecules/SectionTitle";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";
import { Users, BookOpen, Layers, Settings } from "lucide-react";

export default function Page() {
  const adminModules = [
    {
      title: "إدارة المدرسين",
      description: "إضافة، حذف، إيقاف، وتعديل بيانات المدرسين على المنصة.",
      href: "/dashboard/admin/teachers",
      icon: <Users className="w-8 h-8 text-primary" />,
    },
    {
      title: "إدارة الكورسات",
      description: "تعديل أسعار الكورسات، تغيير الصور، ومتابعة جميع الكورسات.",
      href: "/dashboard/admin/courses",
      icon: <BookOpen className="w-8 h-8 text-primary" />,
    },
    {
      title: "التقسيم الأكاديمي",
      description: "إدارة الصفوف الدراسية، المواد، والتصنيفات.",
      href: "/dashboard/admin/academic",
      icon: <Layers className="w-8 h-8 text-primary" />,
    },
    {
      title: "إعدادات المنصة",
      description: "تعديل الصفحة الرئيسية، البانرات، وغيرها من الإعدادات.",
      href: "/dashboard/admin/settings",
      icon: <Settings className="w-8 h-8 text-primary" />,
    },
  ];

  return (
    <DashboardContainer>
      <SectionTitle title="لوحة تحكم الإدارة" subtitle="نظرة عامة على أقسام لوحة التحكم" />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {adminModules.map((module, index) => (
          <Link key={index} href={module.href}>
            <Card className="hover:border-primary/50 transition-colors cursor-pointer group">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-xl group-hover:scale-110 transition-transform">
                    {module.icon}
                  </div>
                  <div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">
                      {module.title}
                    </CardTitle>
                    <CardDescription className="mt-1 text-sm">
                      {module.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </DashboardContainer>
  );
}