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
});

export default function SIPInputCard({
	investmentDuration,
}: {
	investmentDuration: PresetTimeDurations;
}) {
	const searchParams = useSearchParams();
	const pathname = usePathname();
	const { replace } = useRouter();

	const form = useForm<z.infer<typeof schema>>({
		resolver: zodResolver(schema),
		defaultValues: {
			investmentDuration,
		},
	});

	function onChange(values: z.infer<typeof schema>) {
		const params = new URLSearchParams(searchParams);

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
