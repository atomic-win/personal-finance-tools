'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { PresetTimeDurations } from '@/lib/types';
import { displayPresetTimeDuration } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const schema = z.object({
	lumpsumAmount: z.coerce.number().min(0, {
		message: 'Lumpsum Amount cannot be less than 0',
	}),
	monthlyInvestment: z.coerce
		.number()
		.min(1, { message: 'Monthly Investment cannot be less than 1' }),
	annualStepUpPercent: z.coerce.number().min(-99, {
		message: 'Annual Step-Up Percent cannot be less than or equal to -100%',
	}),
	investmentDuration: z.nativeEnum(PresetTimeDurations),
});

const formFields = [
	{
		name: 'lumpsumAmount',
		label: 'Lumpsum Amount',
		description: 'Enter the lumpsum amount',
	},
	{
		name: 'monthlyInvestment',
		label: 'Monthly Installment',
		description: 'Enter the monthly installment',
	},
	{
		name: 'annualStepUpPercent',
		label: 'Annual Step-Up (%)',
		description: 'Enter the annual step-up percentage',
	},
];

export default function SIPInputCard({
	lumpsumAmount,
	monthlyInvestment,
	annualStepUpPercent,
	investmentDuration,
}: {
	lumpsumAmount: number;
	monthlyInvestment: number;
	annualStepUpPercent: number;
	investmentDuration: PresetTimeDurations;
}) {
	const searchParams = useSearchParams();
	const pathname = usePathname();
	const { replace } = useRouter();

	const form = useForm<z.infer<typeof schema>>({
		resolver: zodResolver(schema),
		defaultValues: {
			lumpsumAmount,
			monthlyInvestment,
			annualStepUpPercent,
			investmentDuration,
		},
	});

	function onChange(values: z.infer<typeof schema>) {
		const params = new URLSearchParams(searchParams);

		params.delete('lumpsumAmount');
		if (values.lumpsumAmount !== 0) {
			params.set('lumpsumAmount', String(values.lumpsumAmount));
		}

		params.delete('monthlyInvestment');
		if (values.monthlyInvestment !== 500) {
			params.set('monthlyInvestment', String(values.monthlyInvestment));
		}

		params.delete('annualStepUpPercent');
		if (values.annualStepUpPercent !== 10) {
			params.set('annualStepUpPercent', String(values.annualStepUpPercent));
		}

		params.delete('investmentDuration');
		if (values.investmentDuration !== PresetTimeDurations.OneYear) {
			params.set('investmentDuration', values.investmentDuration);
		}

		replace(`${pathname}?${params.toString()}`);
	}

	return (
		<Card className='mx-auto my-2 p-2 rounded-lg shadow-md w-full col-start-3'>
			<CardHeader>
				<CardTitle>SIP Parameters</CardTitle>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form
						onChangeCapture={form.handleSubmit(onChange)}
						className='space-y-4'>
						{formFields.map((formField) => (
							<FormField
								key={formField.name}
								control={form.control}
								name={formField.name as keyof z.infer<typeof schema>}
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
						<FormField
							control={form.control}
							name='investmentDuration'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Investment Time Duration</FormLabel>
									<Select
										onValueChange={(e) => {
											field.onChange(e);
											form.handleSubmit(onChange)();
										}}
										defaultValue={field.value}>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder='Select the investment duration' />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{Object.values(PresetTimeDurations).map((duration) => (
												<SelectItem key={duration} value={duration}>
													{displayPresetTimeDuration(duration)}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<FormDescription>
										Choose the investment time duration
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
}
