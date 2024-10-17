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
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, ChevronsUpDown } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const languages = [
	{ label: 'English', value: 'en' },
	{ label: 'French', value: 'fr' },
	{ label: 'German', value: 'de' },
	{ label: 'Spanish', value: 'es' },
	{ label: 'Portuguese', value: 'pt' },
	{ label: 'Russian', value: 'ru' },
	{ label: 'Japanese', value: 'ja' },
	{ label: 'Korean', value: 'ko' },
	{ label: 'Chinese', value: 'zh' },
] as const;

const schema = z.object({
	mf_query: z.string({
		message: 'Please select a mutual fund',
	}),
});

export default function MutualFundsInputCard() {
	const searchParams = useSearchParams();
	const pathname = usePathname();
	const { replace } = useRouter();

	const form = useForm<z.infer<typeof schema>>({
		resolver: zodResolver(schema),
		defaultValues: {
			mf_query: '',
		},
	});

	function onChange(values: z.infer<typeof schema>) {
		console.log(values);
	}

	return (
		<Card className='mx-auto my-2 p-2 rounded-lg shadow-md w-full col-start-3'>
			<CardHeader>
				<CardTitle>Mutual Funds</CardTitle>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form onChange={form.handleSubmit(onChange)} className='space-y-4'>
						<FormField
							control={form.control}
							name='mf_query'
							render={({ field }) => (
								<FormItem className='flex flex-col'>
									<Popover>
										<div className='flex justify-between gap-2'>
											<PopoverTrigger asChild>
												<FormControl>
													<Button
														variant='outline'
														role='combobox'
														className={cn(
															'w-full justify-between',
															!field.value && 'text-muted-foreground'
														)}>
														{field.value
															? languages.find(
																	(language) => language.value === field.value
															  )?.label
															: 'Add a Mutual Fund'}
														<ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
													</Button>
												</FormControl>
											</PopoverTrigger>
											<Button type='button'>Add</Button>
										</div>
										<PopoverContent className='w-[200px] p-0'>
											<Command>
												<CommandInput placeholder='Search language...' />
												<CommandList>
													<CommandEmpty>No language found.</CommandEmpty>
													<CommandGroup>
														{languages.map((language) => (
															<CommandItem
																value={language.label}
																key={language.value}
																onSelect={() => {
																	form.setValue('mf_query', language.value);
																}}>
																<Check
																	className={cn(
																		'mr-2 h-4 w-4',
																		language.value === field.value
																			? 'opacity-100'
																			: 'opacity-0'
																	)}
																/>
																{language.label}
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
			</CardContent>
		</Card>
	);
}
