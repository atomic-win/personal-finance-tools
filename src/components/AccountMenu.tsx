'use client';
import { ChevronUp, LogOut, User2 } from 'lucide-react';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SidebarMenuButton } from '@/components/ui/sidebar';
import { GoogleLogin } from '@react-oauth/google';
import useAccessTokenQuery from '@/hooks/useAccessTokenQuery';
import { useLogInMutation } from '@/hooks/useLogInMutation';
import { useLogOutMutation } from '@/hooks/useLogOutMutation';
import { useMyProfileQuery } from '@/hooks/useMyProfileQuery';
import LoadingComponent from '@/components/LoadingComponent';

export default function AccountMenu() {
	const { data: accessToken, isLoading } = useAccessTokenQuery();

	if (isLoading) {
		return <LoadingComponent loadingMessage='Checking login status...' />;
	}

	if (!!!accessToken) {
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
	const { data: profile, isFetching, error } = useMyProfileQuery();
	const logoutMutation = useLogOutMutation();

	if (isFetching) {
		return <div>Fetching Profile...</div>;
	}

	if (error || !!!profile) {
		return <div>Error fetching profile</div>;
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<SidebarMenuButton>
					<User2 />
					{profile.fullName}
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
