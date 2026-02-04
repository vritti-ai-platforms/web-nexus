import { Card, CardContent, CardHeader } from '@vritti/quantum-ui/Card';
import { Typography } from '@vritti/quantum-ui/Typography';

export const DemoPage = () => {
	return (
		<div className="container mx-auto p-6">
			<Typography variant="h1" className="mb-6">
				Welcome to Vritti Cloud
			</Typography>

			<Card>
				<CardHeader>
					<Typography variant="h3">AppLayout Demo</Typography>
				</CardHeader>
				<CardContent>
					<p className="text-foreground mb-4">
						This page demonstrates the new AppLayout component with:
					</p>
					<ul className="list-disc list-inside space-y-2 text-foreground">
						<li>TopBar with logo</li>
						<li>Notification bell button</li>
						<li>Ask Vritti button</li>
						<li>User menu dropdown with avatar</li>
					</ul>
				</CardContent>
			</Card>
		</div>
	);
};
