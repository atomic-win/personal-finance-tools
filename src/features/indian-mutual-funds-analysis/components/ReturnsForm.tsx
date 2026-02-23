import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import {
	Frequency,
	PresetTimeDurations,
	ReturnRequest,
	ReturnType,
	RollingReturnType,
} from '@/features/indian-mutual-funds-analysis/lib/types';
import { zodResolver } from '@hookform/resolvers/zod';
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
} from '@/components/ui/select';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import {
	displayFrequency,
	displayPresetTimeDuration,
	rollingReturnTypeText,
} from '@/features/indian-mutual-funds-analysis/lib/utils';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

const schema = z.object({
	frequency: z.nativeEnum(Frequency),
	stepUpFrequency: z.nativeEnum(Frequency),
	stepUpRatio: z.number().min(0).max(1),
	investmentDuration: z.nativeEnum(PresetTimeDurations),
	rollingWindow: z.nativeEnum(PresetTimeDurations),
	rollingReturnType: z.nativeEnum(RollingReturnType),
});

export default function ReturnsForm({
	returnRequest,
}: {
	returnRequest: ReturnRequest;
}) {
	const props = schema.parse(returnRequest);
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
		params.delete('rollingWindow');
		params.delete('rollingReturnType');

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

		if (data.rollingWindow !== PresetTimeDurations.TwoYears) {
			params.set('rollingWindow', data.rollingWindow);
		}

		if (data.rollingReturnType !== RollingReturnType.Avg) {
			params.set('rollingReturnType', data.rollingReturnType);
		}

		replace(`${pathname}?${params}`);
	}

	return (
		<Card className='rounded-lg shadow-md w-full p-4'>
			<form
				className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'
				onSubmit={(e) => e.preventDefault()}
			>
				{returnRequest.returnType !== 'cagr' && (
					<>
						<Controller
							control={form.control}
							name='frequency'
							render={({ field }) => (
								<Field className='flex flex-col items-start'>
									<FieldLabel>
										{getFrequencyLabel(
											returnRequest.returnType,
										)}
									</FieldLabel>
									<Select
										onValueChange={(value) => {
											field.onChange(value);
											form.handleSubmit(onFormChange)();
										}}
										value={field.value}
									>
										<SelectTrigger className='w-full rounded-lg'>
											<SelectValue placeholder='Select Frequency'>
												{displayFrequency(field.value)}
											</SelectValue>
										</SelectTrigger>
										<SelectContent>
											{Object.values(Frequency).map(
												(frequency) => (
													<SelectItem
														key={frequency}
														value={frequency}
													>
														{displayFrequency(
															frequency,
														)}
													</SelectItem>
												),
											)}
										</SelectContent>
									</Select>
									<FieldError
										errors={[
											form.formState.errors.frequency,
										]}
									/>
								</Field>
							)}
						/>
						<Controller
							control={form.control}
							name='stepUpFrequency'
							render={({ field }) => (
								<Field className='flex flex-col items-start'>
									<FieldLabel>Step Up Frequency</FieldLabel>
									<Select
										onValueChange={(value) => {
											field.onChange(value);
											form.handleSubmit(onFormChange)();
										}}
										value={field.value}
									>
										<SelectTrigger className='w-full rounded-lg'>
											<SelectValue placeholder='Select Step Up Frequency'>
												{displayFrequency(field.value)}
											</SelectValue>
										</SelectTrigger>
										<SelectContent>
											{Object.values(Frequency).map(
												(frequency) => (
													<SelectItem
														key={frequency}
														value={frequency}
													>
														{displayFrequency(
															frequency,
														)}
													</SelectItem>
												),
											)}
										</SelectContent>
									</Select>
									<FieldError
										errors={[
											form.formState.errors
												.stepUpFrequency,
										]}
									/>
								</Field>
							)}
						/>
						<Controller
							control={form.control}
							name='stepUpRatio'
							render={({ field }) => (
								<Field className='flex flex-col items-start'>
									<FieldLabel>Step Up Ratio</FieldLabel>
									<Input
										type='number'
										step={0.01}
										min={0}
										max={1}
										placeholder='Step Up Ratio'
										value={field.value}
										onChange={(e) => {
											const value = Number(
												e.target.value,
											);
											field.onChange(value);
											form.handleSubmit(onFormChange)();
										}}
									/>
									<FieldError
										errors={[
											form.formState.errors.stepUpRatio,
										]}
									/>
								</Field>
							)}
						/>
					</>
				)}
				<Controller
					control={form.control}
					name='investmentDuration'
					render={({ field }) => (
						<Field className='flex flex-col items-start'>
							<FieldLabel>
								{getInvestmentDurationLabel(
									returnRequest.returnType,
								)}
							</FieldLabel>
							<Select
								onValueChange={(value) => {
									field.onChange(value);
									form.handleSubmit(onFormChange)();
								}}
								value={field.value}
							>
								<SelectTrigger className='w-full rounded-lg'>
									<SelectValue placeholder='Select Investment Duration'>
										{displayPresetTimeDuration(field.value)}
									</SelectValue>
								</SelectTrigger>
								<SelectContent>
									{Object.values(PresetTimeDurations).map(
										(duration) => (
											<SelectItem
												key={duration}
												value={duration}
											>
												{displayPresetTimeDuration(
													duration,
												)}
											</SelectItem>
										),
									)}
								</SelectContent>
							</Select>
							<FieldError
								errors={[
									form.formState.errors.investmentDuration,
								]}
							/>
						</Field>
					)}
				/>
				<Controller
					control={form.control}
					name='rollingWindow'
					render={({ field }) => (
						<Field className='flex flex-col items-start'>
							<FieldLabel>Rolling Window</FieldLabel>
							<Select
								onValueChange={(value) => {
									field.onChange(value);
									form.handleSubmit(onFormChange)();
								}}
								value={field.value}
							>
								<SelectTrigger className='w-full rounded-lg'>
									<SelectValue placeholder='Select Rolling Window'>
										{displayPresetTimeDuration(field.value)}
									</SelectValue>
								</SelectTrigger>
								<SelectContent>
									{Object.values(PresetTimeDurations).map(
										(duration) => (
											<SelectItem
												key={duration}
												value={duration}
											>
												{displayPresetTimeDuration(
													duration,
												)}
											</SelectItem>
										),
									)}
								</SelectContent>
							</Select>
							<FieldError
								errors={[form.formState.errors.rollingWindow]}
							/>
						</Field>
					)}
				/>
				<Controller
					control={form.control}
					name='rollingReturnType'
					render={({ field }) => (
						<Field className='flex flex-col items-start'>
							<FieldLabel>Rolling Return Type</FieldLabel>
							<Select
								onValueChange={(value) => {
									field.onChange(value);
									form.handleSubmit(onFormChange)();
								}}
								value={field.value}
							>
								<SelectTrigger className='w-full rounded-lg'>
									<SelectValue placeholder='Select Rolling Return Type'>
										{rollingReturnTypeText(field.value)}
									</SelectValue>
								</SelectTrigger>
								<SelectContent>
									{Object.values(RollingReturnType).map(
										(type) => (
											<SelectItem key={type} value={type}>
												{rollingReturnTypeText(type)}
											</SelectItem>
										),
									)}
								</SelectContent>
							</Select>
							<FieldError
								errors={[
									form.formState.errors.rollingReturnType,
								]}
							/>
						</Field>
					)}
				/>
			</form>
		</Card>
	);
}

function getFrequencyLabel(returnType: ReturnType) {
	switch (returnType) {
		case 'sip':
			return 'Investment Frequency';
		case 'swp':
			return 'Withdrawal Frequency';
		default:
			throw new Error('Invalid return type');
	}
}

function getInvestmentDurationLabel(returnType: ReturnType) {
	switch (returnType) {
		case 'cagr':
		case 'sip':
			return 'Investment Duration';
		case 'swp':
			return 'Withdrawal Duration';
		default:
			throw new Error('Invalid return type');
	}
}
