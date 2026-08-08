import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { Card } from '@/components/ui/card';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {
	Frequency,
	PresetTimeDurations,
	type ReturnRequest,
	type ReturnType,
	RollingReturnType,
} from '@/features/investment-analysis/lib/types';
import {
	displayFrequency,
	displayPresetTimeDuration,
	rollingReturnTypeText,
} from '@/features/investment-analysis/lib/utils';

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
	const search = useSearch({ strict: false });
	const navigate = useNavigate();

	const form = useForm<z.infer<typeof schema>>({
		resolver: zodResolver(schema),
		defaultValues: props,
	});

	function onFormChange(data: z.infer<typeof schema>) {
		const updatedSearch: Record<string, string | undefined> = {
			...search,
			frequency:
				data.frequency !== Frequency.Monthly ? data.frequency : undefined,
			stepUpFrequency:
				data.stepUpFrequency !== Frequency.Yearly
					? data.stepUpFrequency
					: undefined,
			stepUpRatio:
				data.stepUpRatio !== 0.1 ? data.stepUpRatio.toString() : undefined,
			investmentDuration:
				data.investmentDuration !== PresetTimeDurations.OneYear
					? data.investmentDuration
					: undefined,
			rollingWindow:
				data.rollingWindow !== PresetTimeDurations.TwoYears
					? data.rollingWindow
					: undefined,
			rollingReturnType:
				data.rollingReturnType !== RollingReturnType.Avg
					? data.rollingReturnType
					: undefined,
		};

		navigate({
			search: updatedSearch as Record<string, string>,
			replace: true,
		});
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
										{getFrequencyLabel(returnRequest.returnType)}
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
											{Object.values(Frequency).map((frequency) => (
												<SelectItem key={frequency} value={frequency}>
													{displayFrequency(frequency)}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<FieldError errors={[form.formState.errors.frequency]} />
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
											{Object.values(Frequency).map((frequency) => (
												<SelectItem key={frequency} value={frequency}>
													{displayFrequency(frequency)}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<FieldError
										errors={[form.formState.errors.stepUpFrequency]}
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
											const value = Number(e.target.value);
											field.onChange(value);
											form.handleSubmit(onFormChange)();
										}}
									/>
									<FieldError errors={[form.formState.errors.stepUpRatio]} />
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
								{getInvestmentDurationLabel(returnRequest.returnType)}
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
									{Object.values(PresetTimeDurations).map((duration) => (
										<SelectItem key={duration} value={duration}>
											{displayPresetTimeDuration(duration)}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<FieldError errors={[form.formState.errors.investmentDuration]} />
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
									{Object.values(PresetTimeDurations).map((duration) => (
										<SelectItem key={duration} value={duration}>
											{displayPresetTimeDuration(duration)}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<FieldError errors={[form.formState.errors.rollingWindow]} />
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
									{Object.values(RollingReturnType).map((type) => (
										<SelectItem key={type} value={type}>
											{rollingReturnTypeText(type)}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<FieldError errors={[form.formState.errors.rollingReturnType]} />
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
