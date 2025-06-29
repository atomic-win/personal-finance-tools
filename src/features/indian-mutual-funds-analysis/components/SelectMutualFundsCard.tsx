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
import { Instrument } from '@/features/indian-mutual-funds-analysis/lib/types';

const schema = z.object({
	symbol: z.string(),
});

export default function SelectMutualFundsCard({
	mutualFundList,
	addedMutualFunds,
}: {
	mutualFundList: Instrument[];
	addedMutualFunds: Instrument[];
}) {
	return (
		<Card className='rounded-lg shadow-md w-full'>
			<CardHeader>
				<CardTitle>Mutual Funds</CardTitle>
			</CardHeader>
			<CardContent>
				<MutualFundSearchForm
					mutualFundList={mutualFundList}
					addedMutualFunds={addedMutualFunds}
				/>
				<MutualFundsDisplay addedMutualFunds={addedMutualFunds} />
			</CardContent>
		</Card>
	);
}

function MutualFundSearchForm({
	mutualFundList,
	addedMutualFunds,
}: {
	mutualFundList: Instrument[];
	addedMutualFunds: Instrument[];
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
		.go(mfSearchText, mutualFundList || [], {
			threshold: 0.5,
			limit: 10,
			key: 'name',
		})
		.map((x) => x.obj as Instrument)
		.filter(
			(mutualfund) =>
				!addedMutualFunds.find((a) => a.symbol === mutualfund.symbol)
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
																(mutualfund) =>
																	mutualfund.symbol === field.value
														  )?.name
														: 'Add a Mutual Fund'}
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
											placeholder='Search Mutual Fund'
											onValueChange={setMfSearchText}
										/>
										<CommandList>
											<CommandEmpty>No Mutual Funds found.</CommandEmpty>
											<CommandGroup>
												{searchResults.map((mutualfund) => (
													<CommandItem
														value={mutualfund.name}
														key={`${mutualfund.symbol} - ${mutualfund.name}`}
														onSelect={() => {
															form.setValue('symbol', mutualfund.symbol, {
																shouldValidate: true,
															});
														}}>
														<Check
															className={cn(
																'mr-2 h-4 w-4',
																mutualfund.symbol === field.value
																	? 'opacity-100'
																	: 'opacity-0'
															)}
														/>
														{mutualfund.name}
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

function MutualFundsDisplay({
	addedMutualFunds,
}: {
	addedMutualFunds: Instrument[];
}) {
	if (!addedMutualFunds.length) {
		return null;
	}

	return (
		<div className='space-y-2 mt-2'>
			<CardTitle className='text-base m-2 mt-4'>Added Mutual Funds:</CardTitle>
			{addedMutualFunds.map((mutualfund) => (
				<MutualFundDisplayItem
					mutualfund={mutualfund}
					key={mutualfund.symbol}
				/>
			))}
		</div>
	);
}

function MutualFundDisplayItem({ mutualfund }: { mutualfund: Instrument }) {
	const searchParams = useSearchParams();
	const pathname = usePathname();
	const { replace } = useRouter();

	function removeSchemeCode() {
		const params = new URLSearchParams(searchParams);
		const schemeCodes = searchParams.getAll('symbol');
		const schemeCode = mutualfund.symbol.toString();

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
				<span className='truncate'>{mutualfund.name}</span>
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
