import { NIL, v7 } from 'uuid';
import {
	SipCalculator,
	SipSwpCalculator,
	SwpCalculator,
	Calculator,
	FdCalculator,
} from '@/features/calculators/lib/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const defaultFdCalculator: FdCalculator = {
	id: NIL,
	type: 'fixed-deposit',
	principalAmount: 1000,
	annualInterestRate: 7,
	numberOfYears: 1,
	compoundingFrequency: 4,
};

const defaultSipCalculator: SipCalculator = {
	id: NIL,
	type: 'sip',
	lumpsumAmount: 0,
	monthlyInvestmentAmount: 500,
	annualStepUpPercent: 10,
	annualInterestPercent: 10,
	numberOfYears: 10,
};

const defaultSwpCalculator: SwpCalculator = {
	id: NIL,
	type: 'swp',
	totalInvestmentAmount: 100000,
	monthlyWithdrawalAmount: 5000,
	annualInterestPercent: 10,
	annualInflationPercent: 8,
};

const defaultSipSwpCalculator: SipSwpCalculator = {
	id: NIL,
	type: 'sip-swp',
	lumpsumAmount: 0,
	monthlySipInvestmentAmount: 500,
	annualSipStepUpPercent: 10,
	annualInterestPercent: 10,
	numberOfSipYears: 10,
	currentMonthlyExpenseAmount: 10000,
	annualInflationPercent: 8,
};

export function useCalculatorsQuery<T extends Calculator>(type: T['type']) {
	return useQuery({
		queryKey: ['calculators', type],
		initialData: [] as T[],
		staleTime: Infinity,
	});
}

export function useAddCalculatorMutation<T extends Calculator>(
	type: T['type']
) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: ['calculators', type, 'add'],
		mutationFn: async () => {
			await queryClient.cancelQueries({
				queryKey: ['calculators', type],
			});

			const previousData = queryClient.getQueryData<T[]>(['calculators', type]);

			queryClient.setQueryData<T[]>(
				['calculators', type],
				[
					...(previousData ?? []),
					{
						...(getDefaultCalculator(type) as unknown as T),
						id: v7(),
					},
				]
			);

			return { previousData };
		},
		onError: (err, variables, context) => {
			console.error(err);
			queryClient.setQueryData(
				['calculators', type],
				(context as { previousData: T[] }).previousData
			);
		},
	});
}

export function useUpdateCalculatorMutation<T extends Calculator>(
	type: T['type']
) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: ['calculators', type, 'update'],
		mutationFn: async (calculator: T) => {
			await queryClient.cancelQueries({
				queryKey: ['calculators', type],
			});

			const previousData = queryClient.getQueryData<T[]>(['calculators', type]);

			queryClient.setQueryData<T[]>(
				['calculators', type],
				previousData?.map((c) => (c.id === calculator.id ? calculator : c))
			);

			return { previousData };
		},
		onError: (err, variables, context) => {
			console.error(err);
			queryClient.setQueryData(
				['calculators', type],
				(context as { previousData: T[] }).previousData
			);
		},
	});
}

export function useRemoveCalculatorMutation<T extends Calculator>(
	type: T['type']
) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: ['calculators', type, 'delete'],
		mutationFn: async (id: string) => {
			await queryClient.cancelQueries({
				queryKey: ['calculators', type],
			});

			const previousData = queryClient.getQueryData<T[]>(['calculators', type]);

			queryClient.setQueryData<T[]>(
				['calculators', type],
				previousData?.filter((c) => c.id !== id)
			);

			return { previousData };
		},
		onError: (err, variables, context) => {
			console.error(err);
			queryClient.setQueryData(
				['calculators', type],
				(context as { previousData: T[] }).previousData
			);
		},
	});
}

function getDefaultCalculator(type: Calculator['type']) {
	switch (type) {
		case 'fixed-deposit':
			return defaultFdCalculator;
		case 'sip':
			return defaultSipCalculator;
		case 'swp':
			return defaultSwpCalculator;
		case 'sip-swp':
			return defaultSipSwpCalculator;
	}
}
