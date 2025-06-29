'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from '@/components/ui/command';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from '@/components/ui/form';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, ChevronsUpDown, Trash2 } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useState } from 'react';
import fuzzysort from 'fuzzysort';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Instrument, InstrumentType } from '@/features/returns/lib/types';
import { instrumentTypeText } from '@/features/returns/lib/utils';

const schema = z.object({
	symbol: z.string(),
});

export default function SelectInstrumentsCard({
	instrumentType,
	instrumentList,
	addedInstruments,
}: {
	instrumentType: InstrumentType;
	instrumentList: Instrument[];
	addedInstruments: Instrument[];
}) {
	return (
		<Card className='rounded-lg shadow-md w-full'>
			<CardHeader>
				<CardTitle>{instrumentTypeText(instrumentType)}</CardTitle>
			</CardHeader>
			<CardContent>
				<InstrumentSearchForm
					instrumentType={instrumentType}
					instrumentList={instrumentList}
					addedInstruments={addedInstruments}
				/>
				<InstrumentsDisplay
					instrumentType={instrumentType}
					addedInstruments={addedInstruments}
				/>
			</CardContent>
		</Card>
	);
}

function InstrumentSearchForm({
	instrumentType,
	instrumentList,
	addedInstruments,
}: {
	instrumentType: InstrumentType;
	instrumentList: Instrument[];
	addedInstruments: Instrument[];
}) {
	const searchParams = useSearchParams();
	const pathname = usePathname();
	const { replace } = useRouter();

	const [mfSearchText, setMfSearchText] = useState('');

	const form = useForm<z.infer<typeof schema>>({
		resolver: zodResolver(schema),
		defaultValues: {
			symbol: '',
		},
	});

	const searchResults = fuzzysort
		.go(mfSearchText, instrumentList || [], {
			threshold: 0.5,
			limit: 10,
			key: 'name',
		})
		.map((x) => x.obj as Instrument)
		.filter(
			(instrument) =>
				!addedInstruments.find((a) => a.symbol === instrument.symbol)
		);

	function addSchemeCode() {
		const params = new URLSearchParams(searchParams);
		const schemeCodes = params.getAll('symbol');
		const selectedSchemeCode = form.getValues('symbol').toString();

		if (!schemeCodes.includes(selectedSchemeCode)) {
			params.append('symbol', selectedSchemeCode);
			replace(`${pathname}?${params.toString()}`);
		}

		form.reset();
	}

	return (
		<Form {...form}>
			<form className='space-y-4'>
				<FormField
					control={form.control}
					name='symbol'
					render={({ field }) => (
						<FormItem className='flex flex-col'>
							<Popover>
								<div className='flex flex-col sm:flex-row items-stretch sm:items-center gap-2'>
									<PopoverTrigger asChild className='flex-1'>
										<FormControl>
											<Button
												variant='outline'
												role='combobox'
												className={cn(
													'w-full justify-between h-10 mb-2 sm:mb-0',
													!field.value && 'text-muted-foreground'
												)}>
												<span className='text-wrap truncate max-w-[80%]'>
													{field.value
														? searchResults.find(
																(instrument) =>
																	instrument.symbol === field.value
														  )?.name
														: `Select ${instrumentTypeText(instrumentType)}...`}
												</span>
												<ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
											</Button>
										</FormControl>
									</PopoverTrigger>
									<Button
										type='button'
										onClick={addSchemeCode}
										className='h-10 w-full sm:w-20'
										disabled={field.value === ''}>
										Add
									</Button>
								</div>
								<PopoverContent className='p-0 w-[var(--radix-popover-trigger-width)]'>
									<Command>
										<CommandInput
											placeholder={`Search ${instrumentTypeText(
												instrumentType
											)}...`}
											onValueChange={setMfSearchText}
										/>
										<CommandList>
											<CommandEmpty>
												No {instrumentTypeText(instrumentType)} found.
											</CommandEmpty>
											<CommandGroup>
												{searchResults.map((instrument) => (
													<CommandItem
														value={instrument.name}
														key={`${instrument.symbol} - ${instrument.name}`}
														onSelect={() => {
															form.setValue('symbol', instrument.symbol, {
																shouldValidate: true,
															});
														}}>
														<Check
															className={cn(
																'mr-2 h-4 w-4',
																instrument.symbol === field.value
																	? 'opacity-100'
																	: 'opacity-0'
															)}
														/>
														{instrument.name}
													</CommandItem>
												))}
											</CommandGroup>
										</CommandList>
									</Command>
								</PopoverContent>
							</Popover>
							<FormMessage />
						</FormItem>
					)}
				/>
			</form>
		</Form>
	);
}

function InstrumentsDisplay({
	instrumentType,
	addedInstruments,
}: {
	instrumentType: InstrumentType;
	addedInstruments: Instrument[];
}) {
	if (!addedInstruments.length) {
		return null;
	}

	return (
		<div className='space-y-2 mt-2'>
			<CardTitle className='text-base m-2 mt-4'>
				Added {instrumentTypeText(instrumentType)}
			</CardTitle>
			{addedInstruments.map((instrument) => (
				<InstrumentDisplayItem
					instrument={instrument}
					key={instrument.symbol}
				/>
			))}
		</div>
	);
}

function InstrumentDisplayItem({ instrument }: { instrument: Instrument }) {
	const searchParams = useSearchParams();
	const pathname = usePathname();
	const { replace } = useRouter();

	function removeSchemeCode() {
		const params = new URLSearchParams(searchParams);
		const schemeCodes = searchParams.getAll('symbol');
		const schemeCode = instrument.symbol.toString();

		params.delete('symbol');

		schemeCodes
			.filter((code) => code !== schemeCode)
			.forEach((code) => {
				params.append('symbol', code);
			});

		replace(`${pathname}?${params.toString()}`);
	}

	return (
		<Card className='p-2 rounded-lg shadow-md'>
			<CardContent className='flex justify-between items-center p-2 gap-2 text-sm'>
				<span className='truncate'>{instrument.name}</span>
				<Button
					variant='secondary'
					onClick={() => removeSchemeCode()}
					className='h-full shrink-0'>
					<Trash2 className='h-4 w-4' />
				</Button>
			</CardContent>
		</Card>
	);
}
