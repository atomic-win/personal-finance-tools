import { SWPCalculator } from '@/features/calculators/lib/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { NIL, v7 } from 'uuid';

const defaultSWPCalculator: SWPCalculator = {
	id: NIL,
	totalInvestmentAmount: 100000,
	monthlyWithdrawalAmount: 5000,
	annualInterestPercent: 10,
	annualInflationPercent: 8,
};

export function useCalculatorsQuery() {
	return useQuery({
		queryKey: ['calculators', 'swp'],
		initialData: [] as SWPCalculator[],
	});
}

export function useAddCalculatorMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: ['calculators', 'swp', 'add'],
		mutationFn: async () => {
			await queryClient.cancelQueries({
				queryKey: ['calculators', 'swp'],
			});

			const previousData = queryClient.getQueryData<SWPCalculator[]>([
				'calculators',
				'swp',
			]);

			queryClient.setQueryData<SWPCalculator[]>(
				['calculators', 'swp'],
				[
					...(previousData ?? []),
					{
						...defaultSWPCalculator,
						id: v7(),
					},
				]
			);

			return { previousData };
		},
		onError: (err, variables, context) => {
			console.error(err);
			queryClient.setQueryData(
				['calculators', 'swp'],
				(context as { previousData: SWPCalculator[] }).previousData
			);
		},
	});
}

export function useUpdateCalculatorMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: ['calculators', 'swp', 'update'],
		mutationFn: async (calculator: SWPCalculator) => {
			await queryClient.cancelQueries({
				queryKey: ['calculators', 'swp'],
			});

			const previousData = queryClient.getQueryData<SWPCalculator[]>([
				'calculators',
				'swp',
			]);

			queryClient.setQueryData<SWPCalculator[]>(
				['calculators', 'swp'],
				previousData?.map((c) => (c.id === calculator.id ? calculator : c))
			);

			return { previousData };
		},
		onError: (err, variables, context) => {
			console.error(err);
			queryClient.setQueryData(
				['calculators', 'swp'],
				(context as { previousData: SWPCalculator[] }).previousData
			);
		},
	});
}

export function useRemoveCalculatorMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: ['calculators', 'swp', 'remove'],
		mutationFn: async (id: string) => {
			await queryClient.cancelQueries({
				queryKey: ['calculators', 'swp'],
			});

			const previousData = queryClient.getQueryData<SWPCalculator[]>([
				'calculators',
				'swp',
			]);

			queryClient.setQueryData<SWPCalculator[]>(
				['calculators', 'swp'],
				previousData?.filter((c) => c.id !== id)
			);

			return { previousData };
		},
		onError: (err, variables, context) => {
			console.error(err);
			queryClient.setQueryData(
				['calculators', 'swp'],
				(context as { previousData: SWPCalculator[] }).previousData
			);
		},
	});
}
