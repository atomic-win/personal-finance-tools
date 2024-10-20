import { ChevronUp, LogOut, User2 } from 'lucide-react';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { SidebarMenuButton } from './ui/sidebar';
import { GoogleLogin } from '@react-oauth/google';
import useAccessTokenQuery from '@/hooks/useAccessTokenQuery';
import { useLogInMutation } from '@/hooks/useLogInMutation';
import { useLogOutMutation } from '@/hooks/useLogOutMutation';

export default function AccountMenu() {
	const { data: accessToken, isFetching, error } = useAccessTokenQuery();

	if (isFetching) {
		return <div>Fetching Login Status...</div>;
	}

	if (error || !!!accessToken) {
		return <LogInMenu />;
	}

	return <LogOutMenu />;
}

function LogInMenu() {
	const loginMutation = useLogInMutation();

	return (
		<div className='flex flex-col items-center'>
			<GoogleLogin
				onSuccess={(response) => {
					loginMutation.mutate(response.credential!);
				}}
				onError={() => {
					console.error('Error logging in');
				}}
			/>
		</div>
	);
}

function LogOutMenu() {
	const logoutMutation = useLogOutMutation();

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
				<DropdownMenuItem
					onClick={async () => await logoutMutation.mutateAsync()}>
					<LogOut />
					Sign out
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
