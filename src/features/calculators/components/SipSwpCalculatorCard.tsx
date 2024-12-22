'use client';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
	calculateSipResult,
	calculateSwpResult,
	displayCurrencyAmount,
	displayYearlyTimeDuration,
} from '@/features/calculators/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { Trash2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import {
	SipSwpCalculator,
	sipSwpCalculatorSchema,
} from '@/features/calculators/lib/types';
import {
	useRemoveCalculatorMutation,
	useUpdateCalculatorMutation,
} from '@/features/calculators/hooks/calculators';

const formFields = [
	{
		name: 'lumpsumAmount',
		label: 'Lumpsum Amount',
		description: 'Enter the lumpsum amount',
	},
	{
		name: 'monthlySipInvestmentAmount',
		label: 'Monthly SIP Investment',
		description: 'Enter the monthly SIP investment amount',
	},
	{
		name: 'annualSipStepUpPercent',
		label: 'Annual SIP Step-Up (%)',
		description: 'Enter the annual SIP step-up percentage',
	},
	{
		name: 'annualInterestPercent',
		label: 'Annual Interest Rate (%)',
		description: 'Enter the annual interest rate',
	},
	{
		name: 'numberOfSipYears',
		label: 'SIP Investment Duration (Years)',
		description: 'Enter the SIP investment duration in years',
	},
	{
		name: 'monthlySwpWithdrawalAmount',
		label: 'Monthly SWP Withdrawal',
		description: 'Enter the monthly SWP withdrawal amount',
	},
	{
		name: 'annualInflationPercent',
		label: 'Annual Inflation Rate (%)',
		description: 'Enter the annual inflation rate',
	},
];

export default function SipSwpCalculatorCard({
	index,
	calculator,
	canRemove,
}: {
	index: number;
	calculator: SipSwpCalculator;
	canRemove: boolean;
}) {
	const { mutate: updateCalculator } =
		useUpdateCalculatorMutation<SipSwpCalculator>('sip-swp');
	const { mutate: removeCalculator } =
		useRemoveCalculatorMutation<SipSwpCalculator>('sip-swp');

	const form = useForm<SipSwpCalculator>({
		resolver: zodResolver(sipSwpCalculatorSchema),
		defaultValues: calculator,
	});

	const {
		totalInvestedAmount,
		estimatedTotalValue: estimatedTotalValueAfterSip,
	} = calculateSipResult(
		calculator.lumpsumAmount,
		calculator.monthlySipInvestmentAmount,
		calculator.annualSipStepUpPercent,
		calculator.annualInterestPercent,
		calculator.numberOfSipYears
	);

	const { estimatedWithdrawalAmount, estimatedNumberOfYears } =
		calculateSwpResult(
			estimatedTotalValueAfterSip,
			calculator.monthlySwpWithdrawalAmount,
			calculator.annualInterestPercent,
			calculator.annualInflationPercent
		);

	function onFormChange(data: SipSwpCalculator) {
		updateCalculator({ ...calculator, ...data });
	}

	return (
		<Card className='mx-auto my-10 p-2 rounded-lg shadow-md w-full'>
			<CardHeader>
				<div className='flex items-center justify-between'>
					<CardTitle>SIP + SWP Calculator {index + 1}</CardTitle>
					{canRemove && (
						<Button onClick={() => removeCalculator(calculator.id)}>
							<Trash2 className='size-4' />
						</Button>
					)}
				</div>
				<CardDescription>Calculate your SIP-SWP investments</CardDescription>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form
						onChange={form.handleSubmit(onFormChange)}
						className='space-y-4'>
						{formFields.map((formField) => (
							<FormField
								key={formField.name}
								control={form.control}
								name={formField.name as keyof SipSwpCalculator}
								render={({ field }) => (
									<FormItem>
										<FormLabel>{formField.label}</FormLabel>
										<FormControl>
											<Input {...field} />
										</FormControl>
										<FormDescription>{formField.description}</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>
						))}
					</form>
				</Form>
				{totalInvestedAmount !== 0 && (
					<div className='mt-4 p-2 bg-green-100 rounded-md w-auto'>
						<table className='w-full'>
							<tbody>
								<tr>
									<td className='text-sm text-green-700 font-semibold'>
										Total Invested Amount:
									</td>
									<td className='text-sm text-green-700 font-semibold'>
										{displayCurrencyAmount(totalInvestedAmount)}
									</td>
								</tr>
								<tr>
									<td className='text-sm text-green-700 font-semibold'>
										Estimated Total Value After SIP:
									</td>
									<td className='text-sm text-green-700 font-semibold'>
										{displayCurrencyAmount(estimatedTotalValueAfterSip)}
									</td>
								</tr>
								<tr>
									<td className='text-sm text-green-700 font-semibold'>
										Estimated Total Withdrawal:
									</td>
									<td className='text-sm text-green-700 font-semibold'>
										{displayCurrencyAmount(estimatedWithdrawalAmount)}
									</td>
								</tr>
								<tr>
									<td className='text-sm text-green-700 font-semibold'>
										Estimated Corpus Lasted:
									</td>
									<td className='text-sm text-green-700 font-semibold'>
										{displayYearlyTimeDuration(estimatedNumberOfYears)}
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
