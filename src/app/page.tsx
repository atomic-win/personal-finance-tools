import SidebarTriggerWithBreadcrumb from '@/components/SidebarTriggerWithBreadcrumb';

export default function HomePage() {
	return (
		<>
			<SidebarTriggerWithBreadcrumb breadcrumbs={[]} />
			<div className='text-center container my-4 mx-auto'>
				<h1 className='text-3xl'>Personal Finance Tools</h1>
				<p className='mt-4'>
					Welcome to the personal finance tools app. This app contains a set of
					calculators and analysis tools to help you assess returns on
					investments.
				</p>
			</div>
		</>
	);
}
