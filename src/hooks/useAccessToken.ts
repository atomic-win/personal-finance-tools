export default function useAccessToken() {
	return (localStorage.getItem('accessToken') as string) ?? '';
}
