import * as React from "react";
import {cn} from "@/lib/utils"
import {Button} from "@/components/ui/button"
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form"
import {Input} from "@/components/ui/input"
import {Card, CardContent, CardHeader} from "@/components/ui/card";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group.tsx";
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {CalendarIcon} from "lucide-react";
import { format } from "date-fns"
import Stepper from "@/components/common/Stepper.tsx";

// @ts-expect-error can accept any time
export default function RegisterFormFirst({ form, nextStep, className, ...props }) {

    return (
        <>
        <h1 className="scroll-m-20 text-5xl font-heading tracking-tight lg:text-5xl z-0 relative text-center ">
            Register </h1>
            <div className = "w-full max-w-md z-10 relative">
        <Card className={cn("flex flex-col gap-6 justify-center border-0 bg-transparent ", className)} {...props}>
            <CardHeader className="pb-0">
                <Stepper totalSteps={4} currentStep={1} className="w-full h-10 justify-center"/>
            </CardHeader>
            <CardContent className="mt-4 font-paragraph">
                <Form {...form}>
                    <form className="flex flex-col gap-4">
                        {/* First name field */}
                        <div className="flex flex-row gap-4">
                            <FormField control={form.control} name="firstName" render={({field}) => (
                                <FormItem>
                                    <FormLabel>First Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Jon" id="firstName" type="text" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}/>

                            <FormField control={form.control} name="lastName" render={({field}) => (
                                <FormItem>
                                    <FormLabel>Last Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Doe" id="lastName" type="text" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}/>
                        </div>

                        <FormField
                            control={form.control}
                            name="dateOfBirth"
                            render={({field}) => (

                                <FormItem className="flex flex-col">
                                    <FormLabel>Date of birth</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant="outline"
                                                    className={cn(
                                                        "w-full justify-start text-left font-normal hover:bg-transparent hover:text-muted-foreground",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    <CalendarIcon className="h-4 w-4 opacity-50 mr-2 "/>
                                                    {field.value ? (
                                                        format(field.value, "yyyy-MM-dd")
                                                    ) : (
                                                        <span>Pick a date</span>
                                                    )}

                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0 inset-0 bg-card mask-size-cover"
                                                        align="start">
                                            <Calendar

                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                                                captionLayout="dropdown"
                                                toYear={2010}
                                                fromYear={1900}
                                                classNames={{
                                                    day_hidden: "invisible",
                                                    dropdown: "bg-card px-2 py-1.5 rounded-md bg-popover text-popover-foreground text-sm  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background",
                                                    caption_dropdowns: "flex gap-3",
                                                    vhidden: "hidden",
                                                    caption_label: "hidden",
                                                }}
                                                initialFocus
                                            />

                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <FormField control={form.control} name="uniqueIdentificationNumber" render={({field}) => (
                            <FormItem>
                                <FormLabel>National ID Number</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter ID number" id="uniqueIdentificationNumber"
                                           type="text" {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}/>

                        <FormField name="gender" render={({field}) => (
                            <FormItem>
                                <FormLabel>Sex</FormLabel>
                                <FormControl>
                                    <RadioGroup onValueChange={field.onChange} defaultValue={field.value}
                                                className="flex space-x-4 flex-row mt-2">
                                        <FormItem className="flex flex-row">
                                            <RadioGroupItem value="1"/>
                                            <FormLabel>Male</FormLabel>
                                        </FormItem>
                                        <FormItem className="flex flex-row">
                                            <RadioGroupItem value="2"/>
                                            <FormLabel>Female</FormLabel>
                                        </FormItem>
                                    </RadioGroup>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}/>

                        <Button type="button" variant="default" className="w-1/3" onClick={nextStep}>
                            Continue
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
            </div>
        </>);
}

