export type UserProfile = {
	email: string;
	firstName: string;
	lastName: string;
	fullName: string;
	profilePictureUrl: string;
};

export enum Currency {
	Unknown = 'Unknown',
	INR = 'INR',
}
