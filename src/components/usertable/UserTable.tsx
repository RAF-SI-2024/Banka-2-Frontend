import { useState, useEffect } from "react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, UserResponse } from "@/types/user.ts";
import UserDropdownMenu from "@/components/usertable/UserDropdownMenu.tsx";
import { getAllUsers } from "@/api/user.ts";
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationNext } from "@/components/ui/pagination";
import { Role, Gender } from "@/types/enums.ts"; // Import Enums
import React from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { EditUserDialog } from "../admin/EditUserDialog";


export default function UserTable() {
    const [search, setSearch] = useState({
        email: "",
        firstName: "",
        lastName: "",
        role: "",
    });
    
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);

    const isSearchActive = Object.values(search).some(value => value !== "");

    const [users, setUsers] = useState<User[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const [totalPages, setTotalPages] = useState(1);

    // const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch Users from API
    const fetchUsers = async () => {
        // setLoading(true);
        setError(null);

        try {
            const usersData:UserResponse = await getAllUsers(currentPage, itemsPerPage, search);
            setUsers(usersData.items);
            setTotalPages(usersData.totalPages); // Assuming backend doesn't send totalPages
        } catch (err) {
            console.error("Error fetching users:", err);
            setError("Failed to fetch users.");
        }
    };

    const handleClearSearch = () => {
        console.log("Clearing search...");
        search.email = "";
        search.firstName = "";  
        search.lastName = "";
        search.role = "";
        fetchUsers();
    };

    useEffect(() => {
       fetchUsers();
    }, [currentPage]);

    const handleSearchChange = (field: string, value: string) => {
        setSearch(prevSearch => ({ ...prevSearch, [field]: value }));
    };

    const handlePrevious = () => {
        if (currentPage > 1) {
            setCurrentPage(prev => prev - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            setCurrentPage(prev => prev + 1);
        }
    };
    
    const handleOpenEditDialog = (user: User) => {
        setEditingUser(user);
        setIsEditDialogOpen(true);
      };
      
      const handleCloseEditDialog = () => {
        setIsEditDialogOpen(false);
        setEditingUser(null);
      };

    // if (loading) return <p className="text-center">Loading...</p>;
    if (error) return <p className="text-center text-red-500">{error}</p>;

    return (
        <div className="p-6 space-y-4">
            {/* 🔍 Search Filters */}
            <div className="flex flex-wrap gap-4">
                <Input
                    placeholder="Search by email..."
                    value={search.email}
                    onChange={(e) => handleSearchChange("email", e.target.value)}
                    className="w-42"
                />
                <Input
                    placeholder="Search by first name..."
                    value={search.firstName}
                    onChange={(e) => handleSearchChange("firstName", e.target.value)}
                    className="w-42"
                />
                <Input
                    placeholder="Search by last name..."
                    value={search.lastName}
                    onChange={(e) => handleSearchChange("lastName", e.target.value)}
                    className="w-42"
                />
                <Select onValueChange={(value) => handleSearchChange("role", value)} value={search.role}>
                    <SelectTrigger className="w-28">
                        <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="1"> Admin </SelectItem>
                        <SelectItem value="2"> Employee </SelectItem>
                        <SelectItem value="3"> Client </SelectItem>
                    </SelectContent>
                </Select>
                <Button onClick={fetchUsers} variant="primary"> 
                    Filter
                </Button>
                {isSearchActive && (
                    <Button onClick={handleClearSearch} variant="secondary">
                        Clear
                    </Button>
                )}
            </div>

            {/* 📋 Users Table */}
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>First-Name</TableHead>
                        <TableHead>Last-Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Phone-Number</TableHead>
                        <TableHead>Gender</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                {users.map(user => (
                        <TableRow key={user.id}>
                            <TableCell>{user.firstName}</TableCell>
                            <TableCell>{user.lastName}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{roleToText(user.role)}</TableCell>
                            <TableCell>{user.department || "N/A"}</TableCell>
                            <TableCell>{user.phoneNumber}</TableCell>
                            <TableCell>{genderToText(user.gender)}</TableCell>
                            <TableCell>
                                <Badge variant={user.activated ? "default" : "destructive"}>
                                    {user.activated ? "Activated" : "Not activated"}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <UserDropdownMenu
                                    onEdit={() => handleOpenEditDialog(user)}
                                    onDelete={() => console.log(`Delete user ${user.id}`)}
                                />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <Pagination>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious onClick={handlePrevious} aria-disabled={currentPage === 1} />
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationNext onClick={handleNext} aria-disabled={currentPage === totalPages} />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
            {editingUser && (
            <EditUserDialog 
                id={editingUser.id}
                isOpen={isEditDialogOpen}
                onOpenChange={(open: any) => {
                    setIsEditDialogOpen(open);
                    if (!open) {
                        setEditingUser(null);
                        fetchUsers(); // Refresh the user list after editing
                    }
                }}
            />
        )}
        </div>
    );
}

/* ✅ Helper Functions */
const roleToText = (role: number) => {
    switch (role) {
        case Role.Admin:
            return "Admin";
        case Role.Employee:
            return "Employee";
        case Role.Client:
            return "Client";
        default:
            return "Unknown";
    }
};

const genderToText = (gender: number) => {
    switch (gender) {
        case Gender.Male:
            return "Male";
        case Gender.Female:
            return "Female";
        default:
            return "Other";
    }
};