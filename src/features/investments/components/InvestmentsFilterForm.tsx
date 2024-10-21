import {
	Card,
	CardHeader,
	CardTitle,
	CardContent,
	CardDescription,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
	Form,
	FormField,
	FormItem,
	FormLabel,
	FormDescription,
	FormControl,
	FormMessage,
} from '@/components/ui/form';
import {
	Asset,
	Instrument,
	InstrumentType,
} from '@/features/investments/lib/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { displayInstrumentType } from '@/features/investments/lib/utils';

const schema = z.object({
	instrumentTypes: z.array(z.nativeEnum(InstrumentType)),
	instrumentIds: z.array(z.string()),
	assetIds: z.array(z.string()),
});

export default function InvestmentsFilterForm({
	assets,
	instruments,
}: {
	assets: Asset[];
	instruments: Instrument[];
}) {
	const form = useForm<z.infer<typeof schema>>({
		resolver: zodResolver(schema),
		defaultValues: {
			instrumentTypes: [],
			instrumentIds: [],
			assetIds: [],
		},
	});

	return (
		<Card className='mx-auto my-2 p-2 rounded-lg shadow-md'>
			<CardHeader className='flex items-center gap-4 space-y-0 border-b py-2 pt-4 sm:flex-row'>
				<div className='grid text-center sm:text-left w-full gap-2'>
					<CardTitle>Investments Filter</CardTitle>
					<CardDescription>
						Apply filters for portfolio calculation
					</CardDescription>
				</div>
			</CardHeader>
			<CardContent className='p-4'>
				<Form {...form}>
					<form onSubmit={() => {}} className='space-y-6'>
						<FormField
							control={form.control}
							name='instrumentTypes'
							render={() => (
								<FormItem>
									<div>
										<FormLabel className='text-base'>Instrument Type</FormLabel>
										<FormDescription>
											Select the instrument types for portfolio calculation
										</FormDescription>
									</div>
									{Object.values(InstrumentType)
										.filter(
											(instrumentType) =>
												instrumentType !== InstrumentType.Unknown
										)
										.map((instrumentType) => (
											<FormField
												key={instrumentType}
												control={form.control}
												name='instrumentTypes'
												render={({ field }) => {
													return (
														<div className='py-0.5'>
															<FormItem
																key={instrumentType}
																className='flex flex-row items-start space-x-3 space-y-0'>
																<FormControl>
																	<Checkbox
																		checked={field.value?.includes(
																			instrumentType
																		)}
																		onCheckedChange={(checked) => {
																			return checked
																				? field.onChange([
																						...field.value,
																						instrumentType,
																				  ])
																				: field.onChange(
																						field.value?.filter(
																							(value) =>
																								value !== instrumentType
																						)
																				  );
																		}}
																	/>
																</FormControl>
																<FormLabel className='font-normal'>
																	{displayInstrumentType(instrumentType)}
																</FormLabel>
															</FormItem>
														</div>
													);
												}}
											/>
										))}
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='instrumentIds'
							render={() => (
								<FormItem>
									<div>
										<FormLabel className='text-base'>Instruments</FormLabel>
										<FormDescription>
											Select the instruments for portfolio calculation
										</FormDescription>
									</div>
									{instruments.map((instrument) => (
										<FormField
											key={instrument.id}
											control={form.control}
											name='instrumentIds'
											render={({ field }) => {
												return (
													<div className='py-0.5'>
														<FormItem
															key={instrument.id}
															className='flex flex-row items-start space-x-3 space-y-0'>
															<FormControl>
																<Checkbox
																	checked={field.value?.includes(instrument.id)}
																	onCheckedChange={(checked) => {
																		return checked
																			? field.onChange([
																					...field.value,
																					instrument.id,
																			  ])
																			: field.onChange(
																					field.value?.filter(
																						(value) => value !== instrument.id
																					)
																			  );
																	}}
																/>
															</FormControl>
															<FormLabel className='font-normal'>
																{instrument.name}
															</FormLabel>
														</FormItem>
													</div>
												);
											}}
										/>
									))}
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='assetIds'
							render={() => (
								<FormItem>
									<div>
										<FormLabel className='text-base'>Assets</FormLabel>
										<FormDescription>
											Select the assets for portfolio calculation
										</FormDescription>
									</div>
									{assets.map((asset) => (
										<FormField
											key={asset.id}
											control={form.control}
											name='assetIds'
											render={({ field }) => {
												return (
													<div className='py-0.5'>
														<FormItem
															key={asset.id}
															className='flex flex-row items-start space-x-3 space-y-0'>
															<FormControl>
																<Checkbox
																	checked={field.value?.includes(asset.id)}
																	onCheckedChange={(checked) => {
																		return checked
																			? field.onChange([
																					...field.value,
																					asset.id,
																			  ])
																			: field.onChange(
																					field.value?.filter(
																						(value) => value !== asset.id
																					)
																			  );
																	}}
																/>
															</FormControl>
															<FormLabel className='font-normal'>
																{asset.name}
															</FormLabel>
														</FormItem>
													</div>
												);
											}}
										/>
									))}
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
