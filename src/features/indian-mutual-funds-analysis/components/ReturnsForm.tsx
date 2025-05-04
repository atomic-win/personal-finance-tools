import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import {
	Frequency,
	ReturnRequest,
} from '@/features/indian-mutual-funds-analysis/lib/types';
import { zodResolver } from '@hookform/resolvers/zod';
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
	SelectIcon,
} from '@/components/ui/select';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { displayFrequency } from '@/features/indian-mutual-funds-analysis/lib/utils';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ChevronDown } from 'lucide-react';

const schema = z.object({
	frequency: z.nativeEnum(Frequency),
	stepUpFrequency: z.nativeEnum(Frequency),
	stepUpRatio: z.number().min(0).max(1),
});

export default function ReturnsForm(
	props: Omit<ReturnRequest, 'investmentDuration'>
) {
	const searchParams = useSearchParams();
	const pathname = usePathname();
	const { replace } = useRouter();

	const form = useForm<z.infer<typeof schema>>({
		resolver: zodResolver(schema),
		defaultValues: props,
	});

	function onFormChange(data: z.infer<typeof schema>) {
		const params = new URLSearchParams(searchParams.toString());

		params.delete('frequency');
		params.delete('stepUpFrequency');
		params.delete('stepUpRatio');

		if (data.frequency !== Frequency.Monthly) {
			params.set('frequency', data.frequency);
		}

		if (data.stepUpFrequency !== Frequency.Yearly) {
			params.set('stepUpFrequency', data.stepUpFrequency);
		}

		if (data.stepUpRatio !== 0.1) {
			params.set('stepUpRatio', data.stepUpRatio.toString());
		}

		replace(`${pathname}?${params}`);
	}

	if (props.returnType === 'simple') {
		return null;
	}

	return (
		<Card className='rounded-lg shadow-md w-full p-4'>
			<Form {...form}>
				<form
					className='grid grid-cols-3 gap-4'
					onSubmit={(e) => e.preventDefault()}>
					<FormField
						control={form.control}
						name='frequency'
						render={({ field }) => (
							<FormItem className='flex flex-col items-start'>
								<FormLabel>Frequency</FormLabel>
								<Select
									onValueChange={(value) => {
										field.onChange(value);
										form.handleSubmit(onFormChange)();
									}}
									defaultValue={field.value}>
									<FormControl>
										<SelectTrigger className='w-full rounded-lg sm:ml-auto'>
											<SelectValue placeholder='Select Frequency' />
											<SelectIcon>
												<ChevronDown className='h-4 w-4 opacity-50' />
											</SelectIcon>
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										{Object.values(Frequency).map((frequency) => (
											<SelectItem key={frequency} value={frequency}>
												{displayFrequency(frequency)}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='stepUpFrequency'
						render={({ field }) => (
							<FormItem className='flex flex-col items-start'>
								<FormLabel>Step Up Frequency</FormLabel>
								<Select
									onValueChange={(value) => {
										field.onChange(value);
										form.handleSubmit(onFormChange)();
									}}
									defaultValue={field.value}>
									<FormControl>
										<SelectTrigger className='w-full rounded-lg sm:ml-auto'>
											<SelectValue placeholder='Select Step Up Frequency' />
											<SelectIcon>
												<ChevronDown className='h-4 w-4 opacity-50' />
											</SelectIcon>
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										{Object.values(Frequency).map((frequency) => (
											<SelectItem key={frequency} value={frequency}>
												{displayFrequency(frequency)}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='stepUpRatio'
						render={({ field }) => (
							<FormItem className='flex flex-col items-start'>
								<FormLabel>Step Up Ratio</FormLabel>
								<FormControl>
									<Input
										type='number'
										step={0.01}
										min={0}
										max={1}
										placeholder='Step Up Ratio'
										value={field.value}
										onChange={(e) => {
											const value = Number(e.target.value);
											field.onChange(value);
											form.handleSubmit(onFormChange)();
										}}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</form>
			</Form>
		</Card>
	);
}
