import { useState, useEffect } from "react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User } from "@/types/user.ts";
import UserDropdownMenu from "@/components/usertable/UserDropdownMenu.tsx";
import { getAllUsers } from "@/api/auth.ts";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext } from "@/components/ui/pagination";

const mockUsers = [
    { id: 1, firstName: "John", lastName: "Doe", email: "john.doe@example.com", department: "Engineering", phoneNumber: "123-456-7890", activated: true },
    { id: 2, firstName: "Jane", lastName: "Smith", email: "jane.smith@example.com", department: "HR", phoneNumber: "123-456-7891", activated: false },
    { id: 3, firstName: "Bob", lastName: "Johnson", email: "bob.johnson@example.com", department: "Sales", phoneNumber: "123-456-7892", activated: true },
    { id: 4, firstName: "Alice", lastName: "Brown", email: "alice.brown@example.com", department: "Marketing", phoneNumber: "123-456-7893", activated: false },
    { id: 5, firstName: "Charlie", lastName: "Davis", email: "charlie.davis@example.com", department: "Finance", phoneNumber: "123-456-7894", activated: true },
    { id: 6, firstName: "David", lastName: "Martinez", email: "david.martinez@example.com", department: "Operations", phoneNumber: "123-456-7895", activated: false },
    { id: 7, firstName: "Eve", lastName: "Miller", email: "eve.miller@example.com", department: "Design", phoneNumber: "123-456-7896", activated: true },
    { id: 8, firstName: "Frank", lastName: "Wilson", email: "frank.wilson@example.com", department: "Engineering", phoneNumber: "123-456-7897", activated: true },
    { id: 9, firstName: "Grace", lastName: "Moore", email: "grace.moore@example.com", department: "Marketing", phoneNumber: "123-456-7898", activated: false },
    { id: 10, firstName: "Hank", lastName: "Taylor", email: "hank.taylor@example.com", department: "Sales", phoneNumber: "123-456-7899", activated: true },
];

export default function UserTable() {

    const [search, setSearch] = useState({
        email: "",
        firstName: "",
        lastName: "",
        role: "",
    });

    const [users, setUsers] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    // const [totalPages, setTotalPages] = useState(1);
    const totalPages = Math.ceil(mockUsers.length / itemsPerPage);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const paginateUsers = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return mockUsers.slice(startIndex, startIndex + itemsPerPage);
    };

    const handleSearchChange = (field: string, value: string) => {
        setSearch(prevSearch => ({ ...prevSearch, [field]: value }));
    };

    const fetchUsers = async () => {

        setLoading(true);
        setError(null);

        try {
            const usersData = await getAllUsers(currentPage, itemsPerPage, search);

            setUsers(usersData);
            setTotalPages(Math.ceil(usersData.length / itemsPerPage));
        } catch (err) {
            console.error("Error fetching users:", err);
            setError("Failed to fetch users.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // fetchUsers(currentPage, itemsPerPage);
        setUsers(mockUsers);
    }, [currentPage, itemsPerPage, search]);

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

    if (loading) return <p className="text-center">Loading...</p>;
    if (error) return <p className="text-center text-red-500">{error}</p>;

    return (
        <div className="p-6 space-y-4">

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
                <Select onValueChange={(value) => handleSearchChange("role", value)}>
                    <SelectTrigger className="w-28">
                        <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="employee">Employee</SelectItem>
                        <SelectItem value="client">Client</SelectItem>
                    </SelectContent>
                </Select>
                <Button onClick={fetchUsers} variant="primary">
                    Filter
                </Button>
            </div>


            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>First Name</TableHead>
                        <TableHead>Last Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Position</TableHead>
                        <TableHead>Phone Number</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {Array.isArray(users) && paginateUsers().map(user => (
                        <TableRow key={user.id}>
                            <TableCell>{user.firstName}</TableCell>
                            <TableCell>{user.lastName}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.department}</TableCell>
                            <TableCell>{user.phoneNumber}</TableCell>
                            <TableCell>
                                <Badge variant={user.activated ? "default" : "destructive"}>
                                    {user.activated ? "Active" : "Inactive"}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <UserDropdownMenu
                                    onEdit={() => console.log(`Edit user ${user.id}`)}
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
                        <PaginationPrevious onClick={handlePrevious} disabled={currentPage === 1} />
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationLink isActive>{currentPage}</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationNext onClick={handleNext} disabled={currentPage === totalPages} />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    );
}