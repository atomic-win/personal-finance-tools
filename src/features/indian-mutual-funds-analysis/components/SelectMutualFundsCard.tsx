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
import { MutualFund } from '@/features/indian-mutual-funds-analysis/lib/types';

const schema = z.object({
	mfSchemeCode: z.coerce
		.number()
		.min(100000, {
			message: 'Mutual Fund Scheme Code must be a 6 digit number',
		})
		.max(999999, {
			message: 'Mutual Fund Scheme Code must be a 6 digit number',
		}),
});

export default function SelectMutualFundsCard({
	mutualFundList,
	addedMutualFunds,
}: {
	mutualFundList: MutualFund[];
	addedMutualFunds: MutualFund[];
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
	mutualFundList: MutualFund[];
	addedMutualFunds: MutualFund[];
}) {
	const searchParams = useSearchParams();
	const pathname = usePathname();
	const { replace } = useRouter();

	const [mfSearchText, setMfSearchText] = useState('');

	const form = useForm<z.infer<typeof schema>>({
		resolver: zodResolver(schema),
		defaultValues: {
			mfSchemeCode: 0,
		},
	});

	const searchResults = fuzzysort
		.go(mfSearchText, mutualFundList || [], {
			threshold: 0.5,
			limit: 10,
			key: 'schemeName',
		})
		.map((x) => x.obj as MutualFund)
		.filter(
			(mutualfund) =>
				!addedMutualFunds.find((a) => a.schemeCode === mutualfund.schemeCode)
		);

	function addSchemeCode() {
		const params = new URLSearchParams(searchParams);
		const schemeCodes = params.getAll('mfSchemeCode');
		const selectedSchemeCode = form.getValues('mfSchemeCode').toString();

		if (!schemeCodes.includes(selectedSchemeCode)) {
			params.append('mfSchemeCode', selectedSchemeCode);
			replace(`${pathname}?${params.toString()}`);
		}

		form.reset();
	}

	return (
		<Form {...form}>
			<form className='space-y-4'>
				<FormField
					control={form.control}
					name='mfSchemeCode'
					render={({ field }) => (
						<FormItem className='flex flex-col'>
							<Popover>
								<div className='flex items-center gap-2'>
									<PopoverTrigger asChild className='flex-1'>
										<FormControl>
											<Button
												variant='outline'
												role='combobox'
												className={cn(
													'w-full justify-between h-10',
													!field.value && 'text-muted-foreground'
												)}>
												<span className='text-wrap truncate max-w-[80%]'>
													{field.value
														? searchResults.find(
																(mutualfund) =>
																	mutualfund.schemeCode === field.value
														  )?.schemeName
														: 'Add a Mutual Fund'}
												</span>
												<ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
											</Button>
										</FormControl>
									</PopoverTrigger>
									<Button
										type='button'
										onClick={addSchemeCode}
										className='h-10 w-20'
										disabled={field.value === 0}>
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
														value={mutualfund.schemeName}
														key={`${mutualfund.schemeCode} - ${mutualfund.schemeName}`}
														onSelect={() => {
															form.setValue(
																'mfSchemeCode',
																mutualfund.schemeCode,
																{ shouldValidate: true }
															);
														}}>
														<Check
															className={cn(
																'mr-2 h-4 w-4',
																mutualfund.schemeCode === field.value
																	? 'opacity-100'
																	: 'opacity-0'
															)}
														/>
														{mutualfund.schemeName}
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
	addedMutualFunds: MutualFund[];
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
					key={mutualfund.schemeCode}
				/>
			))}
		</div>
	);
}

function MutualFundDisplayItem({ mutualfund }: { mutualfund: MutualFund }) {
	const searchParams = useSearchParams();
	const pathname = usePathname();
	const { replace } = useRouter();

	function removeSchemeCode() {
		const params = new URLSearchParams(searchParams);
		const schemeCodes = searchParams.getAll('mfSchemeCode');
		const schemeCode = mutualfund.schemeCode.toString();

		params.delete('mfSchemeCode');

		schemeCodes
			.filter((code) => code !== schemeCode)
			.forEach((code) => {
				params.append('mfSchemeCode', code);
			});

		replace(`${pathname}?${params.toString()}`);
	}

	return (
		<Card className='p-2 rounded-lg shadow-md'>
			<CardContent className='flex justify-between items-center p-2 gap-2 text-sm'>
				<span>{mutualfund.schemeName}</span>
				<Button
					variant='secondary'
					onClick={() => removeSchemeCode()}
					className='h-full'>
					<Trash2 />
				</Button>
			</CardContent>
		</Card>
	);
}
