import React, { useState,useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {createTransactionTemplate, deleteTemplate, updateTemplate} from "@/api/templates";
import AddTemplateDialog from "./AddTemplateDialog";
import TemplateDropdownMenu from "./TemplateDropdownMenu";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";
import EditTemplateDialog from "./EditTemplateDialog"; // Importuj EditTemplateDialog
import { getTemplates } from "@/api/templates.ts";
import {Template} from "@/types/templates.ts";


const QuickPaymentCard = ({ className, ...props }: React.ComponentProps<"div">) => {
    const [templates, setTemplates] = useState<Template[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [templateToDelete, setTemplateToDelete] = useState<string | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false); // State za edit dijalog
    const [templateToEdit, setTemplateToEdit] = useState<Template | null>(null); // Šablon koji se edituje

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
        } catch (error) {
            console.error("Neuspelo dodavanje transakcijskog šablona.");
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
                console.log("Template uspešno obrisan!");
            } catch (error) {
                console.error("Greška pri brisanju templejta:", error);
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
                console.log("Template uspešno ažuriran!");
            } catch (error) {
                console.error("Greška pri ažuriranju templejta:", error);
            } finally {
                setTemplateToEdit(null); // Resetuj template koji se edituje
                setIsEditDialogOpen(false);
            }
        }
    };


    return (
        <Card className={className} {...props}>
            <CardHeader className="mb-2">
                <CardTitle className="font-heading text-2xl">Quick payment</CardTitle>
            </CardHeader>

            <CardContent className="overflow-y-auto max-h-50 mb-4 mr-4 pr-1">
                <Table>
                    <TableBody>
                        {templates.map((template) => (
                            <TableRow key={template.id} className="font-medium border-border text-secondary-foreground">
                                <TableCell className="p-0 rounded-2xl">
                                    <Button className="size-full font-paragraph text-base py-4 font-semibold rounded-none flex justify-between items-center px-4" variant="negative">
                                        {template.name}
                                        <TemplateDropdownMenu
                                            onEdit={() => handleEdit(template.id)}
                                            onDelete={() => handleDelete(template.id)}
                                        />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>

            <CardFooter className="justify-center">
                <Button size="icon" variant="success" className="rounded-full" onClick={() => setIsDialogOpen(true)}>
                    <span className="icon-[ph--plus-bold]"></span>
                </Button>
            </CardFooter>

            <AddTemplateDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} onAddTemplate={handleAddTemplate} />

            <DeleteConfirmationDialog open={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)} onConfirm={confirmDelete}/>
            <EditTemplateDialog open={isEditDialogOpen} onClose={() => setIsEditDialogOpen(false)} template={templateToEdit} onConfirm={confirmEdit}/>
        </Card>
    );
};

export default QuickPaymentCard;