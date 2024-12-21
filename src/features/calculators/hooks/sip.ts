import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { NIL, v7 } from 'uuid';
import { SIPCalculator } from '@/features/calculators/lib/types';

const defaultSIPCalculator: SIPCalculator = {
	id: NIL,
	lumpsumAmount: 0,
	monthlyInvestment: 500,
	annualStepUpPercent: 10,
	annualInterestPercent: 10,
	numberOfYears: 10,
};

export function useCalculatorsQuery() {
	return useQuery({
		queryKey: ['calculators', 'sip'],
		initialData: [] as SIPCalculator[],
	});
}

export function useAddCalculatorMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: ['calculators', 'sip', 'add'],
		mutationFn: async () => {
			await queryClient.cancelQueries({
				queryKey: ['calculators', 'sip'],
			});

			const previousData = queryClient.getQueryData<SIPCalculator[]>([
				'calculators',
				'sip',
			]);

			queryClient.setQueryData<SIPCalculator[]>(
				['calculators', 'sip'],
				[
					...(previousData ?? []),
					{
						...defaultSIPCalculator,
						id: v7(),
					},
				]
			);

			return { previousData };
		},
		onError: (err, variables, context) => {
			console.error(err);
			queryClient.setQueryData(
				['calculators', 'sip'],
				(context as { previousData: SIPCalculator[] }).previousData
			);
		},
	});
}

export function useUpdateCalculatorMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: ['calculators', 'sip', 'update'],
		mutationFn: async (calculator: SIPCalculator) => {
			await queryClient.cancelQueries({
				queryKey: ['calculators', 'sip'],
			});

			const previousData = queryClient.getQueryData<SIPCalculator[]>([
				'calculators',
				'sip',
			]);

			queryClient.setQueryData<SIPCalculator[]>(
				['calculators', 'sip'],
				(previousData ?? []).map((c) =>
					c.id === calculator.id ? calculator : c
				)
			);

			return { previousData };
		},
		onError: (err, variables, context) => {
			console.error(err);
			queryClient.setQueryData(
				['calculators', 'sip'],
				(context as { previousData: SIPCalculator[] }).previousData
			);
		},
	});
}

export function useRemoveCalculatorMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: ['calculators', 'sip', 'remove'],
		mutationFn: async (id: string) => {
			await queryClient.cancelQueries({
				queryKey: ['calculators', 'sip'],
			});

			const previousData = queryClient.getQueryData<SIPCalculator[]>([
				'calculators',
				'sip',
			]);

			queryClient.setQueryData<SIPCalculator[]>(
				['calculators', 'sip'],
				(previousData ?? []).filter((calculator) => calculator.id !== id)
			);

			return { previousData };
		},
		onError: (err, variables, context) => {
			console.error(err);
			queryClient.setQueryData(
				['calculators', 'sip'],
				(context as { previousData: SIPCalculator[] }).previousData
			);
		},
	});
}
