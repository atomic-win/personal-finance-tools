import SidebarTriggerWithBreadcrumb from '@/components/SidebarTriggerWithBreadcrumb';

export default function HomePage() {
	return (
		<>
			<SidebarTriggerWithBreadcrumb breadcrumbs={[]} />
			<div className='text-center px-4 space-y-4'>
				<h1 className='text-3xl'>Personal Finance Tools</h1>
				<p>
					Welcome to the personal finance tools app. This app contains a set of
					calculators and analysis tools to help you assess returns on
					investments.
				</p>
			</div>
		</>
	);
}
