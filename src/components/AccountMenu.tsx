import { ChevronUp, LogOut, User2 } from 'lucide-react';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { SidebarMenuButton } from './ui/sidebar';
import { GoogleLogin } from '@react-oauth/google';

export default function AccountMenu() {
	return <GoogleLogin onSuccess={(res) => console.log(res)} />;
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<SidebarMenuButton>
					<User2 /> Username
					<ChevronUp className='ml-auto' />
				</SidebarMenuButton>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				side='top'
				className='w-[--radix-popper-anchor-width]'>
				<DropdownMenuItem>
					<LogOut />
					Sign out
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
