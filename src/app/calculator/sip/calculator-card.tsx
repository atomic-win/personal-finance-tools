'use client';
import React, { useState } from 'react';

const SIPCalculator = () => {
	const [monthlyInvestment, setMonthlyInvestment] = useState('');
	const [annualInterestRate, setAnnualInterestRate] = useState('');
	const [investmentDuration, setInvestmentDuration] = useState('');
	const [maturityAmount, setMaturityAmount] = useState('');
	const [investedAmount, setInvestedAmount] = useState('');
	const [interestAmount, setInterestAmount] = useState('');

	const calculateSIP = (e: { preventDefault: () => void }) => {
		e.preventDefault();
		const P = parseFloat(monthlyInvestment);
		const r = parseFloat(annualInterestRate) / 12 / 100;
		const n = parseInt(investmentDuration) * 12;

		const A = P * (((1 + r) ** n - 1) / r) * (1 + r);
		const totalInvested = P * n;
		const totalInterest = A - totalInvested;

		setMaturityAmount(A.toFixed(2));
		setInvestedAmount(totalInvested.toFixed(2));
		setInterestAmount(totalInterest.toFixed(2));
	};

	return (
		<div className='max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md'>
			<form onSubmit={calculateSIP} className='space-y-4'>
				<div>
					<label className='block text-sm font-medium text-gray-700'>
						Monthly Investment Amount:
					</label>
					<input
						type='number'
						value={monthlyInvestment}
						onChange={(e) => setMonthlyInvestment(e.target.value)}
						required
						className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
					/>
				</div>
				<div>
					<label className='block text-sm font-medium text-gray-700'>
						Annual Interest Rate (%):
					</label>
					<input
						type='number'
						value={annualInterestRate}
						onChange={(e) => setAnnualInterestRate(e.target.value)}
						required
						className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
					/>
				</div>
				<div>
					<label className='block text-sm font-medium text-gray-700'>
						Investment Duration (years):
					</label>
					<input
						type='number'
						value={investmentDuration}
						onChange={(e) => setInvestmentDuration(e.target.value)}
						required
						className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
					/>
				</div>
				<button
					type='submit'
					className='w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'>
					Calculate
				</button>
			</form>
			{maturityAmount && (
				<div className='mt-6 p-4 bg-green-100 rounded-md'>
					<h2 className='text-lg font-semibold text-green-700'>
						Maturity Amount: {maturityAmount}
					</h2>
					<p className='text-sm text-green-700'>
						Total Invested Amount: {investedAmount}
					</p>
					<p className='text-sm text-green-700'>
						Total Interest Earned: {interestAmount}
					</p>
				</div>
			)}
		</div>
	);
};

export default SIPCalculator;
