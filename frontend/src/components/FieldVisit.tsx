        import { useState, useEffect } from "react";
        import {
        Stack,
        Typography,
        CircularProgress,
        TextField,
        Table,
        TableBody,
        TableCell,
        TableContainer,
        TableHead,
        TableRow,
        Paper,
        TablePagination,
        Button,
        Box,
        } from "@mui/material";
        import axios from "axios";

        interface Customer {
        id: number;
        employee_id: string;
        name: string;
        mobile_number: string;
        visit_purpose: string;
        location_text: string;
        location_url: string;
        visit_datetime: string;
        remarks: string | null;
        reschedule_datetime: string | null;
        supporting_document: string | null;
        }

        export const FieldVisit = () => {
        const [customers, setCustomers] = useState<Customer[]>([]);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState<string | null>(null);
        const [search, setSearch] = useState("");
        const [page, setPage] = useState(0);
        const [rowsPerPage, setRowsPerPage] = useState(10);

        // 🔹 Fetch Data
        useEffect(() => {
            const fetchData = async () => {
            try {
                const res = await axios.get("http://65.0.176.231:5000/api/customer/getallcustomer");

                console.log(res.data);
                if (Array.isArray(res.data)) {
                    setCustomers(res.data);
                    setError(null);
                    } else if (res.data.success) {
                    setCustomers(res.data.data || res.data.customers || []);
                    setError(null);
                    } else {
                    setError("No data found");
                    }

            } catch (err: any) {
                setError(err.message || "Failed to load data");
            } finally {
                setLoading(false);
            }
            };
            fetchData();
        }, []);

        const filteredCustomers = customers.filter(
            (c) =>
            c.name?.toLowerCase().includes(search.toLowerCase()) ||
            c.employee_id?.toLowerCase().includes(search.toLowerCase()) ||
            c.mobile_number?.includes(search)
        );

        const paginated = filteredCustomers.slice(
            page * rowsPerPage,
            page * rowsPerPage + rowsPerPage
        );

        if (loading)
            return (
            <Stack alignItems="center" py={4}>
                <CircularProgress />
                <Typography>Loading data...</Typography>
            </Stack>
            );

        if (error)
            return (
            <Stack alignItems="center" py={4}>
                <Typography color="error">{error}</Typography>
            </Stack>
            );

        return (
            <Box sx={{ width: "100%", px: 2 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" fontWeight={600}>
                Employee Field Visit Dashboard
                </Typography>
                <TextField
                size="small"
                placeholder="Search by Name, Employee ID, or Mobile..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                sx={{ width: 300 }}
                />
            </Stack>

            <Paper sx={{ width: "100%", overflow: "auto", borderRadius: 2 }}>
                <TableContainer>
                <Table>
                    <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
                    <TableRow>
                        <TableCell>SR NO</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Employee Name</TableCell>
                        <TableCell>Employee ID</TableCell>
                        <TableCell>Mobile Number</TableCell>
                        <TableCell>Visit Purpose</TableCell>
                        <TableCell>Device Location</TableCell>
                        <TableCell>View Location</TableCell>
                        <TableCell>Remarks</TableCell>
                        <TableCell>Visit Time</TableCell>
                        <TableCell>Details</TableCell>
                    </TableRow>
                    </TableHead>

                    <TableBody>
                    {paginated.map((cust, index) => {
                        const visitDate = new Date(cust.visit_datetime);
                        const formattedDate = visitDate.toLocaleDateString("en-GB");
                        const formattedTime = visitDate.toLocaleTimeString("en-IN", {
                        hour: "2-digit",
                        minute: "2-digit",
                        });

                        return (
                        <TableRow key={cust.id} hover>
                            <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                            <TableCell>{formattedDate}</TableCell>
                            <TableCell>{cust.name}</TableCell>
                            <TableCell>{cust.employee_id}</TableCell>
                            <TableCell>{cust.mobile_number}</TableCell>
                            <TableCell>{cust.visit_purpose || "-"}</TableCell>
                            <TableCell>{cust.location_text || "-"}</TableCell>
                            <TableCell>
                            <Button
                                variant="text"
                                color="primary"
                                href={cust.location_url}
                                target="_blank"
                            >
                                View Map
                            </Button>
                            </TableCell>
                            <TableCell>{cust.remarks || "-"}</TableCell>
                            <TableCell>{formattedTime}</TableCell>
                            <TableCell>
                            <Button
                                variant="outlined"
                                size="small"
                                sx={{ textTransform: "none" }}
                            >
                                See More
                            </Button>
                            </TableCell>
                        </TableRow>
                        );
                    })}
                    </TableBody>
                </Table>
                </TableContainer>

                <TablePagination
                component="div"
                count={filteredCustomers.length}
                page={page}
                onPageChange={(_, newPage) => setPage(newPage)}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={(e) => {
                    setRowsPerPage(parseInt(e.target.value, 10));
                    setPage(0);
                }}
                rowsPerPageOptions={[5, 10, 25, 50]}
                />
            </Paper>
            </Box>
        );
        };
