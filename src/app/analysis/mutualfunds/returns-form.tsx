import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
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
	investmentDuration: z.nativeEnum(PresetTimeDurations),
	lookbackDuration: z.nativeEnum(PresetTimeDurations),
});

const formFields = [
	{
		name: 'investmentDuration',
		label: 'Investment Time Duration',
		placeholder: 'Select the investment duration',
	},
	{
		name: 'lookbackDuration',
		label: 'Lookback Time Duration',
		placeholder: 'Select the lookback duration',
	},
];

export default function ReturnsForm({
	investmentDuration,
	lookbackDuration,
}: {
	investmentDuration: PresetTimeDurations;
	lookbackDuration: PresetTimeDurations;
}) {
	const searchParams = useSearchParams();
	const pathname = usePathname();
	const { replace } = useRouter();

	const form = useForm<z.infer<typeof schema>>({
		resolver: zodResolver(schema),
		defaultValues: {
			investmentDuration,
			lookbackDuration,
		},
	});

	function onChange(values: z.infer<typeof schema>) {
		const params = new URLSearchParams(searchParams);

		params.delete('investmentDuration');
		if (values.investmentDuration !== PresetTimeDurations.OneYear) {
			params.set('investmentDuration', values.investmentDuration);
		}

		params.delete('lookbackDuration');
		if (values.lookbackDuration !== PresetTimeDurations.TwoYears) {
			params.set('lookbackDuration', values.lookbackDuration);
		}

		replace(`${pathname}?${params.toString()}`);
	}

	return (
		<Form {...form}>
			<form
				onChangeCapture={form.handleSubmit(onChange)}
				className='flex flex-row align-middle justify-center items-center gap-4'>
				{formFields.map((formField) => (
					<FormField
						key={formField.name}
						control={form.control}
						name={formField.name as keyof z.infer<typeof schema>}
						render={({ field }) => (
							<FormItem className='m-0 mr-auto w-full'>
								<FormLabel>{formField.label}</FormLabel>
								<Select
									onValueChange={(e) => {
										field.onChange(e);
										form.handleSubmit(onChange)();
									}}
									defaultValue={field.value}>
									<FormControl>
										<SelectTrigger>
											<SelectValue placeholder={formField.placeholder} />
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
								<FormMessage />
							</FormItem>
						)}
					/>
				))}
			</form>
		</Form>
	);
}
