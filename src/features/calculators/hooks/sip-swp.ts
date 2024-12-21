import { NIL, v7 } from 'uuid';
import { SipSwpCalculator } from '@/features/calculators/lib/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const defaultCalculator: SipSwpCalculator = {
	id: NIL,
	lumpsumAmount: 0,
	monthlySipInvestmentAmount: 500,
	annualSipStepUpPercent: 10,
	annualInterestPercent: 10,
	numberOfSipYears: 10,
	monthlySwpWithdrawalAmount: 10000,
	annualInflationPercent: 8,
};

export function useCalculatorsQuery() {
	return useQuery({
		queryKey: ['calculators', 'sip-swp'],
		initialData: [] as SipSwpCalculator[],
	});
}

export function useAddCalculatorMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: ['calculators', 'sip-swp', 'add'],
		mutationFn: async () => {
			await queryClient.cancelQueries({
				queryKey: ['calculators', 'sip-swp'],
			});

			const previousData = queryClient.getQueryData<SipSwpCalculator[]>([
				'calculators',
				'sip-swp',
			]);

			queryClient.setQueryData<SipSwpCalculator[]>(
				['calculators', 'sip-swp'],
				[
					...(previousData ?? []),
					{
						...defaultCalculator,
						id: v7(),
					},
				]
			);

			return { previousData };
		},
		onError: (err, variables, context) => {
			console.error(err);
			queryClient.setQueryData(
				['calculators', 'sip-swp'],
				(context as { previousData: SipSwpCalculator[] }).previousData
			);
		},
	});
}

export function useUpdateCalculatorMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: ['calculators', 'sip-swp', 'update'],
		mutationFn: async (calculator: SipSwpCalculator) => {
			await queryClient.cancelQueries({
				queryKey: ['calculators', 'sip-swp'],
			});

			const previousData = queryClient.getQueryData<SipSwpCalculator[]>([
				'calculators',
				'sip-swp',
			]);

			queryClient.setQueryData<SipSwpCalculator[]>(
				['calculators', 'sip-swp'],
				previousData?.map((c) => (c.id === calculator.id ? calculator : c))
			);

			return { previousData };
		},
		onError: (err, variables, context) => {
			console.error(err);
			queryClient.setQueryData(
				['calculators', 'sip-swp'],
				(context as { previousData: SipSwpCalculator[] }).previousData
			);
		},
	});
}

export function useRemoveCalculatorMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: ['calculators', 'sip-swp', 'remove'],
		mutationFn: async (id: string) => {
			await queryClient.cancelQueries({
				queryKey: ['calculators', 'sip-swp'],
			});

			const previousData = queryClient.getQueryData<SipSwpCalculator[]>([
				'calculators',
				'sip-swp',
			]);

			queryClient.setQueryData<SipSwpCalculator[]>(
				['calculators', 'sip-swp'],
				previousData?.filter((c) => c.id !== id)
			);

			return { previousData };
		},
		onError: (err, variables, context) => {
			console.error(err);
			queryClient.setQueryData(
				['calculators', 'sip-swp'],
				(context as { previousData: SipSwpCalculator[] }).previousData
			);
		},
	});
}
