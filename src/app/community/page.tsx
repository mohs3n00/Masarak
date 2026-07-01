import { AppContainer } from "@/shared/layouts/Containers";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/atoms/Avatar";
import { Button } from "@/shared/components/atoms/Button";
import { Heart, MessageCircle, Share2, MoreHorizontal, Image as ImageIcon, Link as LinkIcon, Hash } from "lucide-react";

export default function CommunityPage() {
  return (
    <div className="w-full bg-background min-h-screen pb-20 pt-8 md:pt-12">
      <AppContainer>
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Main Feed */}
          <div className="flex-1 space-y-6">
            
            {/* Create Post */}
            <div className="bg-card border border-border/60 rounded-2xl p-4 shadow-sm">
              <div className="flex gap-4 mb-4">
                <Avatar className="w-12 h-12">
                  <AvatarFallback className="bg-primary/10 text-primary">أ</AvatarFallback>
                </Avatar>
                <textarea 
                  placeholder="شارك أفكارك، اسأل سؤالاً، أو ابدأ نقاشاً..." 
                  className="w-full bg-transparent border-none focus:ring-0 resize-none h-12 pt-3 text-[15px] outline-none"
                />
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-border/40">
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="text-muted-foreground rounded-full w-9 h-9">
                    <ImageIcon className="w-5 h-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-muted-foreground rounded-full w-9 h-9">
                    <LinkIcon className="w-5 h-5" />
                  </Button>
                </div>
                <Button className="rounded-full px-6 font-bold">نشر</Button>
              </div>
            </div>

            {/* Feed Posts */}
            {[1, 2, 3].map((post) => (
              <div key={post} className="bg-card border border-border/60 rounded-2xl p-5 shadow-sm transition-shadow hover:shadow-md">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12 border border-border">
                      <AvatarImage src={`https://i.pravatar.cc/150?img=${post + 10}`} />
                      <AvatarFallback>م</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-bold text-[15px] text-foreground hover:text-primary transition-colors cursor-pointer">
                        أحمد محمود
                      </h4>
                      <p className="text-xs text-muted-foreground">منذ {post * 2} ساعات • مبرمج واجهات أمامية</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="text-muted-foreground rounded-full w-8 h-8">
                    <MoreHorizontal className="w-5 h-5" />
                  </Button>
                </div>
                
                <p className="text-[15px] text-foreground/90 leading-relaxed mb-4">
                  لقد أنهيت للتو كورس الـ React المتقدم على منصة مسارك! التجربة كانت رائعة والمحتوى منظم جداً. هل هناك كورسات متقدمة تنصحون بها لتعلم الـ Next.js مع TypeScript؟ 🚀
                </p>

                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xs font-medium text-primary bg-primary/10 px-2.5 py-1 rounded-full cursor-pointer hover:bg-primary/20 transition-colors">#تطوير_الويب</span>
                  <span className="text-xs font-medium text-primary bg-primary/10 px-2.5 py-1 rounded-full cursor-pointer hover:bg-primary/20 transition-colors">#React</span>
                </div>

                <div className="flex items-center gap-6 pt-4 border-t border-border/40 text-muted-foreground">
                  <button className="flex items-center gap-2 hover:text-primary transition-colors group">
                    <Heart className="w-5 h-5 group-hover:fill-primary/20" />
                    <span className="text-sm font-bold">{12 + post * 5}</span>
                  </button>
                  <button className="flex items-center gap-2 hover:text-primary transition-colors group">
                    <MessageCircle className="w-5 h-5 group-hover:fill-primary/20" />
                    <span className="text-sm font-bold">{3 + post * 2}</span>
                  </button>
                  <button className="flex items-center gap-2 hover:text-primary transition-colors mt-auto ms-auto">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}

          </div>

          {/* Sidebar */}
          <aside className="w-full lg:w-[320px] flex-shrink-0 space-y-6">
            
            {/* Trending */}
            <div className="bg-card border border-border/60 rounded-2xl p-5 shadow-sm">
              <h3 className="font-bold text-lg mb-4 text-foreground">الهاشتاجات الشائعة</h3>
              <div className="flex flex-col gap-4">
                {[
                  { tag: 'برمجة', posts: '1.2k' },
                  { tag: 'تصميم_جرافيك', posts: '856' },
                  { tag: 'Nextjs', posts: '432' },
                  { tag: 'بحث_عن_عمل', posts: '312' },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between group cursor-pointer">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-muted/50 flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                        <Hash className="w-4 h-4" />
                      </div>
                      <span className="font-medium text-sm text-foreground group-hover:text-primary transition-colors">{item.tag}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{item.posts} منشور</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Popular Communities */}
            <div className="bg-card border border-border/60 rounded-2xl p-5 shadow-sm">
              <h3 className="font-bold text-lg mb-4 text-foreground">مجتمعات مقترحة</h3>
              <div className="flex flex-col gap-4">
                {[
                  { name: 'مطورو الويب', members: '5.4k' },
                  { name: 'مصممي واجهات المستخدم', members: '3.2k' },
                  { name: 'مسار التسويق الرقمي', members: '2.8k' },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between group cursor-pointer">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10 border border-border">
                        <AvatarFallback className="bg-primary/5 text-primary text-xs font-bold">{item.name.substring(0,1)}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">{item.name}</span>
                        <span className="text-xs text-muted-foreground">{item.members} عضو</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="rounded-full h-8 text-xs font-bold">انضمام</Button>
                  </div>
                ))}
              </div>
            </div>

          </aside>
          
        </div>
      </AppContainer>
    </div>
  );
}