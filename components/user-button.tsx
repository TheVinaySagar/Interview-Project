// "use client"
// import Link from "next/link"
// import { LogIn, LogOut } from "lucide-react"
// import { toast } from "sonner"

// import { Button } from "@/components/ui/button"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuGroup,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { useAuth } from "@/lib/auth-context"

// export function UserButton() {
//   const { user, signOut } = useAuth()

//   const handleSignOut = async () => {
//     try {
//       await signOut()
//       toast.success("Signed out successfully")
//     } catch (error) {
//       toast.error("Failed to sign out")
//     }
//   }

//   if (!user) {
//     return (
//       <Button variant="outline" size="sm" asChild>
//         <Link href="/login">
//           <LogIn className="mr-2 h-4 w-4" />
//           Login
//         </Link>
//       </Button>
//     )
//   }

//   // Get initials from display name
//   const getInitials = () => {
//     if (!user.displayName) return "U"
//     return user.displayName
//       .split(" ")
//       .map((n) => n[0])
//       .join("")
//       .toUpperCase()
//   }

//   return (
//     <DropdownMenu>
//       <DropdownMenuTrigger asChild>
//         <Button variant="ghost" size="icon" className="rounded-full">
//           <Avatar className="h-8 w-8">
//             <AvatarImage src={user.photoURL || ""} alt={user.displayName || "User"} />
//             <AvatarFallback>{getInitials()}</AvatarFallback>
//           </Avatar>
//         </Button>
//       </DropdownMenuTrigger>
//       <DropdownMenuContent className="w-56" align="end" forceMount>
//         <DropdownMenuLabel className="font-normal">
//           <div className="flex flex-col space-y-1">
//             <p className="text-sm font-medium leading-none">{user.displayName}</p>
//             <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
//           </div>
//         </DropdownMenuLabel>
//         <DropdownMenuSeparator />
//         <DropdownMenuGroup>
//           <DropdownMenuItem asChild>
//             <Link href="/profile">Profile</Link>
//           </DropdownMenuItem>
//           {/* <DropdownMenuItem asChild>
//             <Link href="/profile/interviews">My Interviews</Link>
//           </DropdownMenuItem>
//           <DropdownMenuItem asChild>
//             <Link href="/profile/settings">Settings</Link>
//           </DropdownMenuItem> */}
//         </DropdownMenuGroup>
//         <DropdownMenuSeparator />
//         <DropdownMenuItem onClick={handleSignOut}>
//           <LogOut className="mr-2 h-4 w-4" />
//           <span>Log out</span>
//         </DropdownMenuItem>
//       </DropdownMenuContent>
//     </DropdownMenu>
//   )
// }


"use client"
import { useRouter } from "next/navigation"
import { LogIn, LogOut, User } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/lib/auth-context"

export function UserButton() {
  const { user, signOut } = useAuth()
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      await signOut()
      toast.success("Signed out successfully")
    } catch (error) {
      toast.error("Failed to sign out")
    }
  }

  const handleLogin = () => {
    router.push("/login")
  }

  if (!user) {
    return null;
  }

  // Get initials from display name
  const getInitials = () => {
    if (!user.displayName) return "U"
    return user.displayName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.photoURL || ""} alt={user.displayName || "User"} />
            <AvatarFallback>{getInitials()}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.displayName}</p>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => router.push("/profile")}>
            <User className="mr-2 h-4 w-4" />
            Profile
          </DropdownMenuItem>
          {/* <DropdownMenuItem onClick={() => router.push("/profile/interviews")}>
            <FileText className="mr-2 h-4 w-4" />
            My Interviews
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push("/profile/settings")}>
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </DropdownMenuItem> */}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
