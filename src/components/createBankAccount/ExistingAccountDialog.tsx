import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState } from "react";

interface ExistingAccountDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ExistingAccountDialog({ isOpen, onClose }: ExistingAccountDialogProps) {
    const [creditCardOption, setCreditCardOption] = useState("");

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="w-sm bg-background text-white p-6 rounded-lg shadow-lg ">
                <DialogTitle className="text-lg font-semibold"></DialogTitle>
                <DialogDescription className="text-gray-400 mt-2 text-sm">
                </DialogDescription>

                <div className="space-y-4">
                    {/* Type */}
                    <div className="flex justify-between">
                        <div className="w-[68%]">
                            <Label className="text-gray-300">Type</Label>
                            <Select>
                                <SelectTrigger className="w-full mt-1 text-white">
                                    <SelectValue placeholder="Current account"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="current">Current account</SelectItem>
                                    <SelectItem value="savings">Savings account</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>


                    {/* Ownership & Plan */}
                    <div className="flex space-x-4">
                        <div className="w-[32%]">
                            <Label className="text-gray-300">Ownership</Label>
                            <Select>
                                <SelectTrigger className="mt-1 text-white">
                                    <SelectValue placeholder="Personal"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="personal">Personal</SelectItem>
                                    <SelectItem value="business">Business</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="w-[32%]">
                            <Label className="text-gray-300">Plan</Label>
                            <Select>
                                <SelectTrigger className="mt-1 text-white">
                                    <SelectValue placeholder="Standard" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="standard">Standard</SelectItem>
                                    <SelectItem value="premium">Premium</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Credit Card Option */}
                    <div>
                        <Label className="text-gray-300">Automatically create a credit card?</Label>
                        <RadioGroup value={creditCardOption} onValueChange={setCreditCardOption} className="mt-1 flex space-x-4">
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="yes" id="yes" />
                                <Label htmlFor="yes">Yes</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="no" id="no" />
                                <Label htmlFor="no">No</Label>
                            </div>
                        </RadioGroup>
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex justify-left mt-2">
                    <Button variant="ghost" onClick={onClose} className="mr-5">Back</Button>
                    <Button variant="gradient" onClick={onClose}>Finish</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
