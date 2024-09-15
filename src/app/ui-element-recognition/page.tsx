"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import ScoreInput from "@/app/components/ScoreInput";
import { useCompletion } from "ai/react";
import {
	Accordion,
	AccordionItem,
	AccordionTrigger,
	AccordionContent,
	Alert,
	AlertDescription,
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
	AspectRatio,
	Avatar,
	AvatarFallback,
	AvatarImage,
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbPage,
	BreadcrumbSeparator,
	Calendar,
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
	Checkbox,
	Command,
	CommandInput,
	CommandList,
	CommandEmpty,
	CommandGroup,
	CommandItem,
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuTrigger,
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
	Form,
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormDescription,
	FormMessage,
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
	Input,
	Label,
	Menubar,
	MenubarContent,
	MenubarItem,
	MenubarMenu,
	MenubarTrigger,
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
	Popover,
	PopoverContent,
	PopoverTrigger,
	Progress,
	RadioGroup,
	RadioGroupItem,
	ScrollArea,
	ScrollBar,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
	Separator,
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
	Skeleton,
	Slider,
	Switch,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
	Textarea,
	Toast,
	ToastAction,
	ToastProvider,
	ToastViewport,
	Toggle,
	ToggleGroup,
	ToggleGroupItem,
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
	DataTable,
	DatePicker,
} from "@/components/ui";
import { BreadcrumbList } from "@/components/ui/breadcrumb";

const uiElements = [
	"Accordion",
	"Alert",
	"AlertDialog",
	"AspectRatio",
	"Avatar",
	"Breadcrumb",
	"Button",
	"Calendar",
	"Card",
	"Checkbox",
	"Command",
	"ContextMenu",
	"DataTable",
	"DatePicker",
	"Dialog",
	"DropdownMenu",
	"HoverCard",
	"Input",
	"Menubar",
	"NavigationMenu",
	"Popover",
	"Progress",
	"RadioGroup",
	"ScrollArea",
	"Select",
	"Separator",
	"Sheet",
	"Skeleton",
	"Slider",
	"Switch",
	"Table",
	"Tabs",
	"Textarea",
	"Toast",
	"Toggle",
	"ToggleGroup",
	"Tooltip",
];

const elementsCount = 15;

export default function UIElementRecognitionTest() {
	const [isTestStarted, setIsTestStarted] = useState(false);
	const [currentElement, setCurrentElement] = useState("");
	const [elementsToShow, setElementsToShow] = useState<string[]>([]);
	const [correctAnswers, setCorrectAnswers] = useState(0);
	const [incorrectAnswers, setIncorrectAnswers] = useState(0);
	const [startTime, setStartTime] = useState(0);
	const [isTestComplete, setIsTestComplete] = useState(false);

	const { completion, complete: generateAIResponse } = useCompletion({
		api: "/api/completion",
	});

	useEffect(() => {
		if (isTestStarted && elementsToShow.length === 0) {
			endTest();
		}
	}, [isTestStarted, elementsToShow]);

	const startTest = () => {
		setIsTestStarted(true);
		setCorrectAnswers(0);
		setIncorrectAnswers(0);
		setStartTime(Date.now());
		const shuffled = uiElements.sort(() => 0.5 - Math.random());
		setElementsToShow(shuffled.slice(0, elementsCount));
		nextElement();
	};

	const nextElement = () => {
		if (elementsToShow.length > 0) {
			const nextElement = elementsToShow[0];
			setCurrentElement(nextElement);
			setElementsToShow(elementsToShow.slice(1));
		}
	};

	const handleAnswer = (isCorrect: boolean) => {
		if (isCorrect) {
			setCorrectAnswers(correctAnswers + 1);
		} else {
			setIncorrectAnswers(incorrectAnswers + 1);
		}
		nextElement();
	};

	const endTest = async () => {
		setIsTestComplete(true);
		const endTime = Date.now();
		const timeTaken = (endTime - startTime) / 1000; // Convert to seconds

		const aiPrompt = `Write a sentence to be displayed to a user who just completed a UI Element Recognition test.
    They correctly identified ${correctAnswers} elements and incorrectly identified ${incorrectAnswers} elements.
    The test took them ${timeTaken.toFixed(2)} seconds. An experienced designer would get 100% every time`;

		await generateAIResponse(aiPrompt);
	};

	const renderUIElement = (elementName: string) => {
		switch (elementName) {
			case "Accordion":
				return (
					<Accordion type="single" collapsible>
						<AccordionItem value="item-1">
							<AccordionTrigger>Click to expand</AccordionTrigger>
							<AccordionContent>Content here</AccordionContent>
						</AccordionItem>
					</Accordion>
				);
			case "Alert":
				return (
					<Alert>
						<AlertDescription>Important information here</AlertDescription>
					</Alert>
				);
			case "AlertDialog":
				return (
					<AlertDialog>
						<AlertDialogTrigger asChild>
							<Button variant="outline">Open</Button>
						</AlertDialogTrigger>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>Are you sure?</AlertDialogTitle>
								<AlertDialogDescription>
									This action cannot be undone.
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel>Cancel</AlertDialogCancel>
								<AlertDialogAction>Continue</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				);
			case "AspectRatio":
				return (
					<AspectRatio ratio={16 / 9}>
						<img
							src="https://picsum.photos/200"
							alt="Random"
							style={{ objectFit: "cover", width: "100%", height: "100%" }}
						/>
					</AspectRatio>
				);
			case "Avatar":
				return (
					<Avatar>
						<AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
						<AvatarFallback>CN</AvatarFallback>
					</Avatar>
				);
			case "Breadcrumb":
				return (
					<Breadcrumb>
						<BreadcrumbList>
							<BreadcrumbItem>
								<BreadcrumbLink href="/">Home</BreadcrumbLink>
							</BreadcrumbItem>
							<BreadcrumbSeparator />
							<BreadcrumbItem>
								<BreadcrumbLink href="/docs">Docs</BreadcrumbLink>
							</BreadcrumbItem>
							<BreadcrumbSeparator />
							<BreadcrumbItem>
								<BreadcrumbPage>Page</BreadcrumbPage>
							</BreadcrumbItem>
						</BreadcrumbList>
					</Breadcrumb>
				);
			case "Button":
				return <Button>Click me</Button>;
			case "Calendar":
				return <Calendar mode="single" />;
			case "Card":
				return (
					<Card>
						<CardHeader>
							<CardTitle>Title</CardTitle>
							<CardDescription>Description</CardDescription>
						</CardHeader>
						<CardContent>
							<p>Content</p>
						</CardContent>
						<CardFooter>
							<p>Footer</p>
						</CardFooter>
					</Card>
				);
			case "Checkbox":
				return (
					<div className="bg-white w-12 p-4 rounded-lg shadow-lg">
						<Checkbox />
					</div>
				);
			case "Command":
				return (
					<Command>
						<CommandInput placeholder="Search..." />
						<CommandList>
							<CommandEmpty>No results found.</CommandEmpty>
							<CommandGroup heading="Suggestions">
								<CommandItem>Copy Text</CommandItem>
								<CommandItem>Delete Item</CommandItem>
								<CommandItem>Do a thing</CommandItem>
							</CommandGroup>
						</CommandList>
					</Command>
				);
			case "ContextMenu":
				return (
					<ContextMenu>
						<ContextMenuTrigger>Right click me</ContextMenuTrigger>
						<ContextMenuContent>
							<ContextMenuItem>Item 1</ContextMenuItem>
							<ContextMenuItem>Item 2</ContextMenuItem>
						</ContextMenuContent>
					</ContextMenu>
				);
			case "Dialog":
				return (
					<Dialog>
						<DialogTrigger asChild>
							<Button variant="outline">Open</Button>
						</DialogTrigger>
						<DialogContent>
							<DialogHeader>
								<DialogTitle>Title</DialogTitle>
								<DialogDescription>Description</DialogDescription>
							</DialogHeader>
							<DialogFooter>
								<Button type="submit">Save changes</Button>
							</DialogFooter>
						</DialogContent>
					</Dialog>
				);
			case "DropdownMenu":
				return (
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="outline">Open</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent>
							<DropdownMenuItem>Item 1</DropdownMenuItem>
							<DropdownMenuItem>Item 2</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				);
			case "HoverCard":
				return (
					<HoverCard>
						<HoverCardTrigger asChild>
							<Button className="text-white" variant="link">
								Hover me
							</Button>
						</HoverCardTrigger>
						<HoverCardContent>The React Framework for the Web</HoverCardContent>
					</HoverCard>
				);
			case "Input":
				return <Input type="text" placeholder="Enter text here" />;
			case "Menubar":
				return (
					<Menubar>
						<MenubarMenu>
							<MenubarTrigger>File</MenubarTrigger>
							<MenubarContent>
								<MenubarItem>New</MenubarItem>
								<MenubarItem>Open</MenubarItem>
							</MenubarContent>
						</MenubarMenu>
					</Menubar>
				);
			case "NavigationMenu":
				return (
					<NavigationMenu>
						<NavigationMenuList>
							<NavigationMenuItem>
								<NavigationMenuTrigger>Item One</NavigationMenuTrigger>
								<NavigationMenuContent>
									<NavigationMenuLink>Link</NavigationMenuLink>
								</NavigationMenuContent>
							</NavigationMenuItem>
						</NavigationMenuList>
					</NavigationMenu>
				);
			case "DataTable":
				return <DataTable />;
			case "DatePicker":
				return <DatePicker />;
			case "Popover":
				return (
					<Popover>
						<PopoverTrigger asChild>
							<Button variant="outline">Open</Button>
						</PopoverTrigger>
						<PopoverContent>What am i?</PopoverContent>
					</Popover>
				);
			case "Progress":
				return (
					<div className="bg-white p-4 rounded-lg">
						<Progress value={33} />{" "}
					</div>
				);
			case "RadioGroup":
				return (
					<RadioGroup defaultValue="option-one">
						<RadioGroupItem value="option-one" id="option-one" />
						<Label htmlFor="option-one">Option One</Label>
						<RadioGroupItem value="option-two" id="option-two" />
						<Label htmlFor="option-two">Option Two</Label>
					</RadioGroup>
				);
			case "ScrollArea":
				return (
					<ScrollArea className="h-[200px] w-[350px] rounded-md border p-4">
						Jokester began sneaking into the castle in the middle of the night
						when the moon was high in the sky. He had been doing this for weeks
						now, and he was getting quite good at it. He had managed to avoid
						the guards and the traps that were set up to catch him. He had even
						managed to get past the magical wards that were supposed to keep him
						out. He was proud of himself for that. He was also proud of the fact
						that he had managed to steal the king's crown. He had been planning
						this for months now, and he was glad that it was finally over. He
						had what he wanted, and now he could move on to the next part of his
						plan.
						<ScrollBar orientation="vertical" />
					</ScrollArea>
				);
			case "Select":
				return (
					<Select>
						<SelectTrigger>
							<SelectValue placeholder="Select an option" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="option1">Option 1</SelectItem>
							<SelectItem value="option2">Option 2</SelectItem>
						</SelectContent>
					</Select>
				);
			case "Separator":
				return <Separator />;
			case "Sheet":
				return (
					<Sheet>
						<SheetTrigger asChild>
							<Button variant="outline">Open</Button>
						</SheetTrigger>
						<SheetContent>
							<SheetHeader>
								<SheetTitle>Title</SheetTitle>
								<SheetDescription>Description</SheetDescription>
							</SheetHeader>
						</SheetContent>
					</Sheet>
				);
			case "Skeleton":
				return (
					<div className="gap-2 flex flex-col">
						<Skeleton className="bg-blue-50 h-[20px] w-[100px] rounded-full" />
						<Skeleton className="bg-blue-50 h-[20px] w-[120px] rounded-full" />
						<Skeleton className="bg-blue-50 h-[20px] w-[120px] rounded-full" />
						<Skeleton className="bg-blue-50 h-[20px] w-[100px] rounded-full" />
					</div>
				);
			case "Slider":
				return (
					<div className="bg-white p-4 rounded-lg">
						<Slider defaultValue={[33]} max={100} step={1} />
					</div>
				);
			case "Switch":
				return <Switch />;
			case "Table":
				return (
					<Table className="border-4">
						<TableHeader>
							<TableRow>
								<TableHead>Header 1</TableHead>
								<TableHead>Header 2</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							<TableRow>
								<TableCell className="text-black">Cell 1</TableCell>
								<TableCell className="text-black">Cell 2</TableCell>
							</TableRow>
							<TableRow>
								<TableCell className="text-black">Cell 3</TableCell>
								<TableCell className="text-black">Cell 4</TableCell>
							</TableRow>
						</TableBody>
					</Table>
				);
			case "Tabs":
				return (
					<Tabs defaultValue="tab1">
						<TabsList>
							<TabsTrigger value="tab1">A thingy</TabsTrigger>
							<TabsTrigger value="tab2">Another thingy</TabsTrigger>
						</TabsList>
						<TabsContent value="tab1">Content 1</TabsContent>
						<TabsContent value="tab2">Content 2</TabsContent>
					</Tabs>
				);
			case "Textarea":
				return <Textarea placeholder="Type your message here." />;
			case "Toast":
				return (
					<ToastProvider>
						<Toast>
							<ToastAction altText="Try again">Try again</ToastAction>
						</Toast>
						<ToastViewport />
					</ToastProvider>
				);
			case "Toggle":
				return <Toggle>Toggle</Toggle>;
			case "ToggleGroup":
				return (
					<ToggleGroup type="single">
						<ToggleGroupItem value="a">A</ToggleGroupItem>
						<ToggleGroupItem value="b">B</ToggleGroupItem>
						<ToggleGroupItem value="c">C</ToggleGroupItem>
					</ToggleGroup>
				);
			case "Tooltip":
				return (
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild>
								<Button variant="outline">Hover me and wait</Button>
							</TooltipTrigger>
							<TooltipContent>
								<p>Why hello there, what do you call me</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				);
			default:
				return null;
		}
	};

	return (
		<div className="container mx-auto p-4">
			<h1 className="text-2xl font-bold mb-4">UI Element Recognition Test</h1>
			{!isTestStarted && !isTestComplete && (
				<Button onClick={startTest}>Start Test</Button>
			)}
			{isTestStarted && !isTestComplete && (
				<div>
					<div
						aria-label={currentElement}
						className="mb-4 bg-gray-800 p-12 rounded-lg"
					>
						<h2 className="text-xl font-semibold pb-4">
							Identify this UI element:
						</h2>
						{renderUIElement(currentElement)}
					</div>
					<div className="flex space-x-4">
						<Button onClick={() => handleAnswer(true)}>Correct ✅</Button>
						<Button onClick={() => handleAnswer(false)}>Incorrect ❌</Button>
					</div>
					<p className="mt-4">
						Correct: {correctAnswers} | Incorrect: {incorrectAnswers} |
						Remaining: {elementsToShow.length}
					</p>
				</div>
			)}
			{isTestComplete && (
				<div>
					<h2 className="text-xl font-semibold mb-4">Test Complete!</h2>
					<p>Correct Answers: {correctAnswers}</p>
					<p>Incorrect Answers: {incorrectAnswers}</p>
					<p>
						Time Taken: {((Date.now() - startTime) / 1000).toFixed(2)} seconds
					</p>
					<div className="mt-4">
						<h3 className="text-lg font-semibold">AI Feedback:</h3>
						<p>{completion}</p>
					</div>
					<ScoreInput
						testName="UI Element Recognition (% correct)"
						scoreType="number"
						unit="correct / total elements"
						initialScore={(correctAnswers / elementsCount).toFixed(2)}
					/>
				</div>
			)}
		</div>
	);
}
