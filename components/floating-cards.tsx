import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Mail, User, Star, Clock, TrendingUp } from "lucide-react"

export function FloatingCards() {
  return (
    <>
      {/* Congratulations Card - Middle Right - Visible on tablets and up */}
      <div className="absolute top-1/2 -right-4 lg:right-0 xl:right-12 animate-float-delayed hidden lg:block z-20 bg-transparent">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl">
            <svg className="w-12 h-12" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
              {/* Purple outer rounded square */}
              <rect x="0" y="0" width="32" height="32" rx="6" fill="#524FD5"/>
              {/* White inner rounded square */}
              <rect x="5" y="5" width="22" height="22" rx="4" fill="white"/>
              {/* Three vertical bars with varying heights */}
              <rect x="11" y="19" width="2" height="7" rx="0.75" fill="#6B46C1"/>
              <rect x="15.5" y="13" width="2" height="13" rx="0.75" fill="#6B46C1"/>
              <rect x="20" y="19" width="2" height="7" rx="0.75" fill="#6B46C1"/>
            </svg>
          </div>
        </div>
      </div>

      {/* User Experience Class Card - Bottom Left - Desktop only */}
      <div className="absolute bottom-16 -left-4 lg:left-0 xl:left-4 bg-white/95 backdrop-blur-sm px-4 py-4 rounded-xl shadow-xl animate-float hidden lg:block z-20 w-[230px]">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-10 h-10 bg-[#524FD5] rounded-lg flex items-center justify-center">
            <Calendar className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <div className="text-lg font-bold text-[#595959]">Mejora tu</div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              speaking
            </div>
          </div>
        </div>
      </div>

      {/* Decorative floating elements for visual interest */}
      <div className="hidden lg:block">
        {/* Floating dot 1 */}
        <div className="absolute top-20 -left-8 w-4 h-4 bg-gradient-to-br from-green-400 to-blue-400 rounded-full shadow-lg animate-bounce"></div>
        
        {/* Floating dot 2 */}
        <div className="absolute bottom-1/4 -right-8 w-3 h-3 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full shadow-lg animate-bounce delay-500"></div>
        
        {/* Floating dot 3 */}
        <div className="absolute top-1/2 left-8 w-2 h-2 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full shadow-md animate-pulse"></div>
      </div>
    </>
  )
}
