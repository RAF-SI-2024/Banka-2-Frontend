import React, { useState,useEffect } from "react";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {createTransactionTemplate, deleteTemplate, updateTemplate} from "@/api/templates";
import AddTemplateDialog from "./AddTemplateDialog";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";
import EditTemplateDialog from "./EditTemplateDialog"; // Importuj EditTemplateDialog
import { getTemplates } from "@/api/templates.ts";
import {Template} from "@/types/templates.ts";
import TemplateDropdownMenu from "@/components/home/TemplateDropDownMenu.tsx";
import {cn} from "@/lib/utils.ts";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {showErrorToast, showSuccessToast} from "@/lib/show-toast-utils.tsx";

const QuickPaymentCard = ({ className, ...props }: React.ComponentProps<"div">) => {
    const [templates, setTemplates] = useState<Template[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [templateToDelete, setTemplateToDelete] = useState<string | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false); // State za edit dijalog
    const [templateToEdit, setTemplateToEdit] = useState<Template | null>(null); // Šablon koji se edituje


    const templateSchema = z.object({
        name: z.string()
            .min(1, "Name is mandatory.")
            .max(32, "Name can't have more than 32 characters.")
            .regex(/^[A-Za-zčČćĆžŽšŠđĐ ]+$/, "Name can only have letters and spaces."),
        accountNumber: z.string()
            .length(18, "Account number must be exactly 18 characters long.")
            .regex(/^\d{18}$/, "Account number must contain only numbers.")
    });

    const form = useForm<z.infer<typeof templateSchema>>({
        resolver: zodResolver(templateSchema),
        mode: "onChange",
    });


    useEffect(() => {
        // Dohvatanje templejta kada se komponenta učita
        const fetchTemplates = async () => {
            try {
                const userId = JSON.parse(sessionStorage.getItem("user") || "{}").id;
                const templatesData = await getTemplates();

                if (templatesData && templatesData.items) {
                    const filteredTemplates = templatesData.items
                        .filter((template: Template) => template.client.id === userId && !template.deleted); // Provera deleted statusa

                    setTemplates(filteredTemplates); // Ažuriraj state sa validnim templejtima
                } else {
                    console.error("Nema podataka za templejte");
                }
            } catch (error) {
                console.error("Greška pri učitavanju templejta:", error);
            }
        };

        fetchTemplates();
    }, []); // Pokreće se samo pri prvom renderovanju

    const handleAddTemplate = async (name: string, accountNumber: string) => {
        try {
            const newTemplate = await createTransactionTemplate(name, accountNumber);
            setTemplates((prev) => [...prev, newTemplate]);
            setIsDialogOpen(false);
            showSuccessToast({description: "Template successfully created."})
        } catch (error) {
            showErrorToast({error, defaultMessage: "Error adding template."})
        }
    };

    const handleEdit = (id: string) => {
        const template = templates.find((t) => t.id === id);
        if (template) {
            setTemplateToEdit(template);
            setIsEditDialogOpen(true); // Otvori dijalog za editovanje
        }
    };

    const handleDelete = (id: string) => {
        setTemplateToDelete(id);
        setIsDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (templateToDelete) {
            const template = templates.find((t) => t.id === templateToDelete);
            if (!template) return;

            try {
                await deleteTemplate(template.id, template.name, template.accountNumber);

                setTemplates((prev) => prev.filter((t) => t.id !== template.id)); // Ažuriraj UI
                showSuccessToast({description: "Template successfully deleted."})
            } catch (error) {
                showErrorToast({error, defaultMessage: "Error deleting template."})
            } finally {
                setTemplateToDelete(null);
                setIsDeleteDialogOpen(false);
            }
        }
    };

    const confirmEdit = async (name: string, accountNumber: string) => {
        if (templateToEdit) {
            try {
                const updatedTemplate = await updateTemplate(templateToEdit.id, name, accountNumber);
                setTemplates((prev) =>
                    prev.map((template) =>
                        template.id === templateToEdit.id ? updatedTemplate : template
                    )
                );
                showSuccessToast({description: "Template successfully edited."})
            } catch (error) {
                showErrorToast({error, defaultMessage: "Error modifying template."})
            } finally {
                setTemplateToEdit(null); // Resetuj template koji se edituje
                setIsEditDialogOpen(false);
            }
        }
    };


    return (
        <Card className={cn("border-0 content-center", className)} {...props}>
            <CardHeader className="mb-2">
                <CardTitle className="font-heading text-2xl">Quick payment</CardTitle>
            </CardHeader>


            <CardContent className="overflow-y-auto max-h-50 mb-4 mr-4 pr-1">
                {(!templates || templates.length == 0) && (
                    <CardDescription>You don't have any quick payment templates. Click the button below to create a new payment template.</CardDescription>
                )}
                <Table>
                    <TableBody>
                        {templates.map((template) => (
                            <TableRow key={template.id} className="bg-background font-medium border-border text-foreground">
                                <TableCell className="p-0 rounded-2xl">
                                    <span className="size-full font-paragraph text-base py-4 font-semibold rounded-none flex justify-between items-center px-4 bg-negative text-foreground cursor-pointer">
                                        {template.name}
                                        <TemplateDropdownMenu
                                            onEdit={() => handleEdit(template.id)}
                                            onDelete={() => handleDelete(template.id)}
                                        />
                                    </span>
                                </TableCell>
                            </TableRow>

                        ))}
                    </TableBody>
                </Table>
            </CardContent>

            <CardFooter className="justify-center">
                <Button
                    className="size16"
                    variant="success"
                    onClick={() => setIsDialogOpen(true)}
                >
                    <span className="icon-[ph--plus] text-lg"></span>
                    Add a new template

                </Button>
            </CardFooter>

            <AddTemplateDialog form={form} open={isDialogOpen} onOpenChange={(open) =>
            {
                form.reset();
                setIsDialogOpen(open);}
            }
                               onAddTemplate={handleAddTemplate} />

            <DeleteConfirmationDialog open={isDeleteDialogOpen} onClose={() => {form.reset(); setIsDeleteDialogOpen(false)}} onConfirm={confirmDelete}/>
            <EditTemplateDialog form={form} open={isEditDialogOpen} onClose={() => {form.reset(); setIsEditDialogOpen(false)}} template={templateToEdit} onConfirm={confirmEdit}/>
        </Card>
    );
};

export default QuickPaymentCard;