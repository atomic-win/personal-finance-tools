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
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

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
	const searchParams = useSearchParams();
	const pathname = usePathname();
	const { replace } = useRouter();

	const filteredInstrumentTypes =
		(searchParams.getAll('instrumentTypes') as InstrumentType[]) || [];
	const filteredInstrumentIds = searchParams.getAll('instrumentIds') || [];
	const filteredAssetIds = searchParams.getAll('assetIds') || [];

	const form = useForm<z.infer<typeof schema>>({
		resolver: zodResolver(schema),
		defaultValues: {
			instrumentTypes: filteredInstrumentTypes,
			instrumentIds: filteredInstrumentIds,
			assetIds: filteredAssetIds,
		},
	});

	function onCheckedChange(data: z.infer<typeof schema>) {
		const params = new URLSearchParams(searchParams);

		for (const key in data) {
			params.delete(key);
		}

		if (data.instrumentTypes.length > 0) {
			for (const instrumentType of data.instrumentTypes) {
				params.append('instrumentTypes', instrumentType);
			}
		}

		if (data.instrumentIds.length > 0) {
			for (const instrumentId of data.instrumentIds) {
				params.append('instrumentIds', instrumentId);
			}
		}

		if (data.assetIds.length > 0) {
			for (const assetId of data.assetIds) {
				params.append('assetIds', assetId);
			}
		}

		replace(`${pathname}?${params.toString()}`);
	}

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
																			if (checked) {
																				field.onChange([
																					...field.value,
																					instrumentType,
																				]);
																			} else {
																				field.onChange(
																					field.value?.filter(
																						(value) => value !== instrumentType
																					)
																				);
																			}

																			form.handleSubmit(onCheckedChange)();
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
																		if (checked) {
																			field.onChange([
																				...field.value,
																				instrument.id,
																			]);
																		} else {
																			field.onChange(
																				field.value?.filter(
																					(value) => value !== instrument.id
																				)
																			);
																		}

																		form.handleSubmit(onCheckedChange)();
																	}}
																	disabled={
																		filteredInstrumentTypes.length !== 0 &&
																		!filteredInstrumentTypes.includes(
																			instrument.type
																		)
																	}
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
																		if (checked) {
																			field.onChange([
																				...field.value,
																				asset.id,
																			]);
																		} else {
																			field.onChange(
																				field.value?.filter(
																					(value) => value !== asset.id
																				)
																			);
																		}

																		form.handleSubmit(onCheckedChange)();
																	}}
																	disabled={
																		!instruments
																			.filter(
																				(instrument) =>
																					filteredInstrumentTypes.length ===
																						0 ||
																					filteredInstrumentTypes.includes(
																						instrument.type
																					)
																			)
																			.map((instrument) => instrument.id)
																			.includes(asset.instrumentId)
																	}
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
