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
	PresetTimeDurations,
	ReturnRequest,
	ReturnType,
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
import {
	displayFrequency,
	displayPresetTimeDuration,
} from '@/features/indian-mutual-funds-analysis/lib/utils';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ChevronDown } from 'lucide-react';

const schema = z.object({
	frequency: z.nativeEnum(Frequency),
	stepUpFrequency: z.nativeEnum(Frequency),
	stepUpRatio: z.number().min(0).max(1),
	investmentDuration: z.nativeEnum(PresetTimeDurations),
});

export default function ReturnsForm(props: ReturnRequest) {
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
		params.delete('investmentDuration');

		if (data.frequency !== Frequency.Monthly) {
			params.set('frequency', data.frequency);
		}

		if (data.stepUpFrequency !== Frequency.Yearly) {
			params.set('stepUpFrequency', data.stepUpFrequency);
		}

		if (data.stepUpRatio !== 0.1) {
			params.set('stepUpRatio', data.stepUpRatio.toString());
		}

		if (data.investmentDuration !== PresetTimeDurations.OneYear) {
			params.set('investmentDuration', data.investmentDuration);
		}

		replace(`${pathname}?${params}`);
	}

	return (
		<Card className='rounded-lg shadow-md w-full p-4'>
			<Form {...form}>
				<form
					className='grid grid-cols-4 gap-4'
					onSubmit={(e) => e.preventDefault()}>
					{props.returnType !== 'simple' && (
						<>
							<FormField
								control={form.control}
								name='frequency'
								render={({ field }) => (
									<FormItem className='flex flex-col items-start'>
										<FormLabel>{getFrequencyLabel(props.returnType)}</FormLabel>
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
						</>
					)}
					<FormField
						control={form.control}
						name='investmentDuration'
						render={({ field }) => (
							<FormItem className='flex flex-col items-start'>
								<FormLabel>
									{getInvestmentDurationLabel(props.returnType)}
								</FormLabel>
								<Select
									onValueChange={(value) => {
										field.onChange(value);
										form.handleSubmit(onFormChange)();
									}}
									defaultValue={field.value}>
									<FormControl>
										<SelectTrigger className='w-full rounded-lg sm:ml-auto'>
											<SelectValue placeholder='Select Investment Duration' />
											<SelectIcon>
												<ChevronDown className='h-4 w-4 opacity-50' />
											</SelectIcon>
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
				</form>
			</Form>
		</Card>
	);
}

function getFrequencyLabel(returnType: ReturnType) {
	if (returnType === 'swp') {
		return 'Withdrawal Frequency';
	}

	throw new Error('Invalid return type');
}

function getInvestmentDurationLabel(returnType: ReturnType) {
	if (returnType === 'simple') {
		return 'Investment Duration';
	}

	if (returnType === 'swp') {
		return 'Withdrawal Duration';
	}

	throw new Error('Invalid return type');
}
